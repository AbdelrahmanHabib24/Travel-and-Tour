"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Slider from "react-slick";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaRegUser,
  FaUsers,
  FaHourglassHalf,
  FaClock,
  FaMobileAlt,
  FaLanguage,
  FaStar,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GlobalLoading from "@/app/loading";

type PackageType = {
  id: number;
  URL: string;
  title1: string;
  title2: string;
  price: number;
  duration: string;
  des: string;
  rating?: number;
  count?: number;
  images: { id: number; url: string }[];
  ageRange?: string;
  maxGroupSize?: number;
  travelDuration?: string;
  startTimeInfo?: string;
  mobileTicket?: boolean;
  liveGuideLanguages?: string[];
};

type Comment = {
  id: number;
  text: string;
  userName: string;
  avatarUrl?: string;
  createdAt: string;
};

async function fetchPackage(id: string): Promise<PackageType> {
  const res = await fetch(`/api/packages/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch package");
  return res.json();
}

async function fetchComments(id: string): Promise<Comment[]> {
  const res = await fetch(`/api/packages/${id}/comments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export default function PackageDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  const { data: packageDetails, error, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackage(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/packages/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userName: "Traveler",
          avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setNewComment("");
    },
  });

  const handleReserveClick = () => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      router.push("/payment");
    } else {
      toast.error("You must be logged in to reserve");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutation.mutate(newComment);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
       <GlobalLoading/>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading package details
      </p>
    );

  if (!packageDetails)
    return <p className="text-center mt-10">Package not found</p>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white mt-14">
      {/* Hero Section */}
      <div className="relative h-[350px] sm:h-[450px] md:h-[500px] w-full">
        <Image
          src={packageDetails.images[0].url}
          alt={packageDetails.title1}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-2xl"
          >
            {packageDetails.title1}, {packageDetails.title2}
          </motion.h1>
          <button
            onClick={handleReserveClick}
            className="mt-4 sm:mt-6 px-6 sm:px-10 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            Reserve Now
          </button>
        </div>
      </div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 mt-8 sm:mt-10 text-center"
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          About this Trip
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-lg">
          {packageDetails.des}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mt-6 sm:mt-10 px-4 overflow-x-auto">
        <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 border-b relative">
          {["overview", "details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 sm:pb-3 text-sm sm:text-lg font-semibold transition ${
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-0 py-6 sm:py-10">
        {activeTab === "overview" && (
          <>
            {/* Slider */}
            <Slider {...sliderSettings}>
              {packageDetails.images.map((img) => (
                <div key={img.id} className="px-1 sm:px-2">
                  <Image
                    src={img.url}
                    alt={packageDetails.title1}
                    width={1200}
                    height={700}
                    className="rounded-2xl shadow-lg"
                  />
                </div>
              ))}
            </Slider>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-xl text-center"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600">Price</h3>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">${packageDetails.price}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-xl text-center"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600">Duration</h3>
                <p className="text-lg sm:text-xl">{packageDetails.duration}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-xl text-center"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600">Rating</h3>
                <p className="text-lg sm:text-xl text-yellow-500 flex items-center justify-center gap-2">
                  <FaStar /> {packageDetails.rating ?? "N/A"}
                </p>
                {packageDetails.count && (
                  <p className="text-xs sm:text-sm text-gray-500">(
                                    {packageDetails.count} reviews)
                  </p>
                )}
              </motion.div>
            </div>
          </>
        )}

        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8"
          >
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaRegUser className="inline text-orange-500 mr-2" />
              Ages: {packageDetails.ageRange || "N/A"}
            </div>
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaUsers className="inline text-orange-500 mr-2" />
              Max Group Size: {packageDetails.maxGroupSize || "N/A"}
            </div>
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaHourglassHalf className="inline text-orange-500 mr-2" />
              Travel Duration: {packageDetails.travelDuration || "N/A"}
            </div>
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaClock className="inline text-orange-500 mr-2" />
              Start Time: {packageDetails.startTimeInfo || "N/A"}
            </div>
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaMobileAlt className="inline text-orange-500 mr-2" />
              Mobile Ticket: {packageDetails.mobileTicket ? "Yes" : "No"}
            </div>
            <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-xl p-4 sm:p-6">
              <FaLanguage className="inline text-orange-500 mr-2" />
              Languages: {packageDetails.liveGuideLanguages?.join(", ") || "N/A"}
            </div>
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4 sm:mb-6">
              Traveler Reviews
            </h2>
            <form
              onSubmit={handleCommentSubmit}
              className="flex flex-col space-y-2 sm:space-y-3 mb-4 sm:mb-6"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience..."
                className="border rounded-xl p-2 sm:p-3 w-full shadow-md focus:ring-2 focus:ring-orange-400 outline-none resize-none"
                rows={3}
              />
              <button
                type="submit"
                className="self-start px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm sm:text-base"
              >
                Submit
              </button>
            </form>
            <ul className="space-y-3 sm:space-y-4">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="bg-orange-50 border-l-4 border-orange-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm flex gap-2 sm:gap-3 items-start"
                >
                  <Image
                    src={c.avatarUrl || "/default-avatar.png"}
                    alt={c.userName}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{c.userName}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

