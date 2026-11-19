import React from "react";
import type { InputPackageRecord, LocalizedPackageResult } from "@/lib/i18n/packageLocalization";

export type TabId = "overview" | "details" | "reviews";

export interface PackageImage {
  id: number | string;
  url: string;
  packageId?: number | string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description?: string;
  activities?: string[];
}

export interface PackageRecord extends InputPackageRecord {
  ageRange?: string | null;
  maxGroupSize?: number | null;
  travelDuration?: string;
  startTimeInfo?: string | null;
  mobileTicket?: boolean;
  liveGuideLanguages?: string[];
  images?: PackageImage[];
  itinerary?: ItineraryItem[];
  URL?: string;
  [key: string]: unknown;
}

export type LocalizedPackage = LocalizedPackageResult<PackageRecord>;

export interface TripProperty {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface CommentItem {
  id: number;
  text: string;
  userName: string;
  createdAt?: string;
  avatarUrl?: string;
}
