"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import GlobalLoading from "@/app/loading";
import { usePackageDetails } from "../../hooks/usePackageDetails";
import { usePackageBooking } from "../../hooks/usePackageBooking";
import { usePackageReviews } from "../../hooks/usePackageReviews";
import { PackageHero } from "./PackageHero";
import { PackageTabs } from "./PackageTabs";
import { PackageOverview } from "./PackageOverview";
import { PackageTripDetails } from "./PackageTripDetails";
import { PackageReviews } from "./PackageReviews";
import TourItinerary from "./TourItinerary";
import type { TabId } from "../../types";

const VALID_TABS: readonly TabId[] = ["overview", "details", "reviews"];
const tabListeners = new Set<() => void>();
let memoryActiveTab: TabId | null = null;

function subscribeActiveTab(listener: () => void) {
  tabListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key === "activeTab") {
      memoryActiveTab = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    tabListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getClientActiveTab(): TabId {
  try {
    const savedTab = window.localStorage.getItem("activeTab") as TabId | null;
    if (savedTab && VALID_TABS.includes(savedTab)) {
      return savedTab;
    }
  } catch {
    // Ignore storage access errors
  }
  return memoryActiveTab ?? "overview";
}

function getServerActiveTab(): TabId {
  return "overview";
}

export default function PackageDetailsClient({ id }: { id: string }) {
  const t = useTranslations("package-details");

  const activeTab = useSyncExternalStore(
    subscribeActiveTab,
    getClientActiveTab,
    getServerActiveTab
  );
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const itineraryTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleTabChange = (tab: TabId) => {
    memoryActiveTab = tab;
    try {
      window.localStorage.setItem("activeTab", tab);
    } catch {
      // Ignore storage write errors
    }
    tabListeners.forEach((l) => l());
  };

  /* -------------------- Custom Hooks -------------------- */
  const {
    packageDetails,
    localizedPackage,
    isLoading,
    error,
    heroImage,
    hasPrice,
    propDuration,
    formatPriceDisplay,
    sixTripProperties,
    hasItinerary,
    isRTL,
  } = usePackageDetails(id);

  const { isProcessing, handleReserveClick, user } = usePackageBooking(packageDetails);

  const {
    comments,
    newComment,
    setNewComment,
    editingCommentId,
    editingText,
    setEditingText,
    handleCommentSubmit,
    startEditComment,
    cancelEditComment,
    saveEditComment,
    handleDeleteComment,
    formatDate,
    isAdding,
    isEditing,
  } = usePackageReviews(id);

  /* -------------------- Guards -------------------- */
  if (isLoading) return <GlobalLoading />;

  if (error) {
    return (
      <div className="py-20 text-center text-red-500 font-medium">
        {t("errors.loadFailed")}
      </div>
    );
  }

  if (!packageDetails || !localizedPackage) {
    return (
      <div className="py-20 text-center text-gray-600 font-medium">
        {t("errors.notFound")}
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-start text-gray-900"
    >
      {/* 1. HERO SECTION */}
      <PackageHero
        title={localizedPackage.title}
        destination={localizedPackage.destination}
        heroImage={heroImage}
        duration={propDuration}
        hasPrice={hasPrice}
        priceDisplay={formatPriceDisplay(packageDetails.price, packageDetails.currency)}
        isProcessing={isProcessing}
        onReserve={handleReserveClick}
      />

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* CENTERED TABS */}
        <PackageTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabRefs={tabRefs}
        />

        {/* TAB PANELS */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <PackageOverview
              key="overview"
              title={localizedPackage.title}
              description={localizedPackage.description}
              galleryImages={localizedPackage.images || []}
            />
          )}

          {activeTab === "details" && (
            <PackageTripDetails
              key="details"
              properties={sixTripProperties}
              hasItinerary={hasItinerary}
              itineraryDaysCount={localizedPackage.itinerary?.length || 0}
              onOpenItinerary={() => setIsItineraryOpen(true)}
              itineraryTriggerRef={itineraryTriggerRef}
            />
          )}

          {activeTab === "reviews" && (
            <PackageReviews
              key="reviews"
              comments={comments}
              isLoggedIn={user.isLoggedIn}
              currentUsername={user.username}
              newComment={newComment}
              onNewCommentChange={setNewComment}
              onSubmitComment={handleCommentSubmit}
              isAdding={isAdding}
              editingCommentId={editingCommentId}
              editingText={editingText}
              onEditingTextChange={setEditingText}
              onStartEdit={startEditComment}
              onCancelEdit={cancelEditComment}
              onSaveEdit={saveEditComment}
              isSavingEdit={isEditing}
              onDeleteComment={handleDeleteComment}
              formatDate={formatDate}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. DAY-BY-DAY ITINERARY MODAL */}
      {hasItinerary && (
        <TourItinerary
          isOpen={isItineraryOpen}
          onClose={() => setIsItineraryOpen(false)}
          items={localizedPackage.itinerary || []}
          triggerRef={itineraryTriggerRef}
        />
      )}
    </div>
  );
}
