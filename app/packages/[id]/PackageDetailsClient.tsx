/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaRegUser,
  FaUsers,
  FaHourglassHalf,
  FaClock,
  FaMobileAlt,
  FaLanguage,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GlobalLoading from "@/app/loading";
import { useSelector, useDispatch } from "react-redux";
import { setPaymentToken } from "@/store/paymentslice";
import type { RootState } from "@/store/store";

export default function PackageDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  const [newComment, setNewComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "reviews"
  >("overview");

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") as
      | "overview"
      | "details"
      | "reviews";
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  /* -------------------- Fetch Package -------------------- */
  const {
    data: packageDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await fetch(`/api/packages/${id}`, { cache: "force-cache" });
      if (!res.ok) throw new Error("Failed to fetch package");
      return res.json();
    },
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    placeholderData: () => queryClient.getQueryData(["package", id]),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await fetch(`/api/packages/${id}/comments`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user.isLoggedIn) {
        throw new Error("Unauthorized");
      }
      const res = await fetch(`/api/packages/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text, userName: user.username }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setNewComment("");
      toast.success("Comment added!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add comment");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      text,
    }: {
      commentId: number;
      text: string;
    }) => {
      const res = await fetch(`/api/packages/${id}/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text }),
      });
      if (!res.ok) throw new Error("Failed to edit comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast.info("Comment updated!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(
        `/api/packages/${id}/comments?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast.error("Comment deleted!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete comment");
    },
  });

  /* -------------------- Handlers -------------------- */
  const handleReserveClick = useCallback(async () => {
    if (!user.isLoggedIn) return toast.error("You must login before booking");
    if (!packageDetails) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/packages/${packageDetails.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: packageDetails.price,
          currency: "USD",
          billing_data: {
            first_name: user.username || "John",
            email: user.email || "test@example.com",
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.sessionId && data.paymentToken) {
        dispatch(setPaymentToken(data.paymentToken));
        router.push(`/payment/${data.sessionId}`);
      } else toast.error("Failed to create payment session");
    } catch {
      toast.error("Error initializing payment");
    } finally {
      setIsProcessing(false);
    }
  }, [packageDetails, user, router, dispatch]);

  const handleCommentSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newComment.trim()) addCommentMutation.mutate(newComment);
    },
    [newComment, addCommentMutation]
  );

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    }),
    []
  );

  /* -------------------- Render -------------------- */
  if (isLoading) return <GlobalLoading />;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error loading package</p>
    );
  if (!packageDetails)
    return <p className="text-center mt-10">Package not found</p>;

  const {
    title1,
    title2,
    des,
    price,
    duration,
    images,
    rating,
    count,
    ageRange,
    maxGroupSize,
    travelDuration,
    startTimeInfo,
    mobileTicket,
    liveGuideLanguages,
  } = packageDetails;

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white mt-14">
      <ToastContainer position="top-center" />

      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        {images?.[0] && (
          <Image
            src={images[0].url}
            alt={title1}
            fill
            className="object-cover brightness-75"
            priority
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-extrabold drop-shadow-2xl"
          >
            {title1}, {title2}
          </motion.h1>
          <button
            onClick={handleReserveClick}
            disabled={isProcessing}
            className={`mt-6 px-8 py-3 rounded-full font-semibold shadow-lg transition ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105"
            }`}
          >
            {isProcessing ? "Processing..." : "Reserve Now"}
          </button>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10 text-center"
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          About this Trip
        </h2>
        <p className="text-gray-700 leading-relaxed">{des}</p>
      </motion.div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex justify-center gap-6 border-b">
          {["overview", "details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-semibold transition ${
                activeTab === tab
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === "overview" && (
          <>
            <Slider {...sliderSettings}>
              {images.map((img: any) => (
                <div key={img.id} className="px-2">
                  <Image
                    src={img.url}
                    alt={title1}
                    width={1200}
                    height={700}
                    className="rounded-2xl shadow-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                {
                  label: "Price",
                  value: `$${price}`,
                  color: "text-orange-600",
                },
                { label: "Duration", value: duration },
                {
                  label: "Rating",
                  value: `${rating ?? "N/A"} ⭐ (${count ?? 0})`,
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 bg-white rounded-xl shadow-xl text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-600">
                    {item.label}
                  </h3>
                  <p
                    className={`text-xl font-bold ${
                      item.color || "text-gray-800"
                    }`}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
          >
            {[
              { icon: <FaRegUser />, label: "Ages", value: ageRange },
              {
                icon: <FaUsers />,
                label: "Max Group Size",
                value: maxGroupSize,
              },
              {
                icon: <FaHourglassHalf />,
                label: "Travel Duration",
                value: travelDuration,
              },
              { icon: <FaClock />, label: "Start Time", value: startTimeInfo },
              {
                icon: <FaMobileAlt />,
                label: "Mobile Ticket",
                value: mobileTicket ? "Yes" : "No",
              },
              {
                icon: <FaLanguage />,
                label: "Languages",
                value: liveGuideLanguages?.join(", "),
              },
            ].map((d) => (
              <div
                key={d.label}
                className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-6"
              >
                <div className="flex items-center text-orange-500 gap-2 mb-2">
                  {d.icon}
                  <span className="font-semibold text-gray-700">
                    {d.label}:
                  </span>
                </div>
                <p>{d.value || "N/A"}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-600 mb-6">
              Traveler Reviews
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience..."
                className="border rounded-xl p-3 w-full shadow-md focus:ring-2 focus:ring-orange-400 resize-none"
                rows={3}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </form>

            <ul className="space-y-4">
              {comments.map((c: any) => {
                const isOwner = c.userName === user.username;

                return (
                  <li
                    key={c.id}
                    className="bg-orange-50 border-l-4 border-orange-400 px-4 py-3 rounded-lg shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex gap-3 items-start">
                      <Image
                        src={
                          c.avatarUrl ||
                          `https://i.pravatar.cc/150?u=${c.userName}`
                        }
                        alt={c.userName}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {c.userName}
                        </p>
                        <p className="text-gray-600 text-sm">{c.text}</p>
                      </div>
                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() => {
                              const newText = prompt(
                                "Edit your comment:",
                                c.text
                              );
                              if (!newText) return;
                              editCommentMutation.mutate({
                                commentId: c.id,
                                text: newText,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm text-red-500 hover:underline"
                            onClick={() => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this comment?"
                                )
                              )
                                return;
                              deleteCommentMutation.mutate(c.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        )}
      </div>
    </div>
  );
}
