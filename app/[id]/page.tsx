/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PACKAGE } from "@/app/ulits/type"; // Ensure PACKAGE is an array of package objects
import Image from "next/image"; // Image component for optimized loading
import Slider from "react-slick"; // Import Slick for carousel
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import "slick-carousel/slick/slick.css"; // Import Slick styles
import "slick-carousel/slick/slick-theme.css"; // Import Slick theme styles
import { motion } from "framer-motion"; // Import motion from Framer Motion
import {
  FaRegUser,
  FaUsers,
  FaHourglassHalf,
  FaClock,
  FaMobileAlt,
  FaLanguage,
} from "react-icons/fa"; // Icons
import Link from "next/link";

// Define the structure of the package data
type PACKAGE = {
  id: string;
  URL: string;
  title1: string;
  title2: string;
  price: string;
  duration: string;
  des: string;
  rating?: number;
  count?: number;
  images?: string[]; // Array of images for the slider
  ageRange?: string; // e.g., "Ages 0-99"
  maxGroupSize?: number; // e.g., max of 19 per group
  travelDuration?: string; // e.g., "3h"
  startTimeInfo?: string; // e.g., "Check availability"
  mobileTicket?: boolean; // e.g., true for mobile tickets
  liveGuideLanguages?: string[]; // e.g., ["German", "Chinese", ...]
};

type Comment = {
  id: number; // Unique identifier for each comment
  text: string; // The comment text
};

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void; // Function to close the modal
  imgSrc: string;
  title: string;
};

// Modal component
const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imgSrc,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-3xl">
        <Image
          src={imgSrc}
          alt={title}
          width={1400}
          height={1200}
          layout="responsive"
          className="max-w-3xl max-h-3xl object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-2"
        >
          X
        </button>
      </div>
    </div>
  );
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // Time between each element's appearance
    },
  },
};

const PackageDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [packageDetails, setPackageDetails] = useState<PACKAGE | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // حالة لتخزين حالة تسجيل الدخول

  const [selectedImage, setSelectedImage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    console.log("ID from URL:", id);

    if (!id) {
      setError("Invalid package ID!");
      toast.error("Invalid package ID!"); // Toast error on invalid package ID
      setLoading(false);
      return;
    }

    const foundPackage = PACKAGE.find((pkg: PACKAGE) => pkg.id === id);

    if (foundPackage) {
      setPackageDetails(foundPackage);
    } else {
      setError("Package not found!");
      toast.error("Package not found!"); // Toast error if package is not found
    }

    setLoading(false);
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        text: newComment,
      };
      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment("");
    }
  };

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      // هنا يتم عرض رسالة الخطأ باستخدام toast
      toast.error("You must be logged in to reserve "); // Toast error for login check
    } else {
      // هنا يتم تنفيذ الحجز إذا كان المستخدم مسجلاً دخوله
      console.log("Proceed with the reservation...");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        <p className="text-lg font-semibold text-gray-600 ml-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
        <Link href="/packages" className="mt-4 text-blue-500 underline">
          Go back to packages list
        </Link>
      </div>
    );
  }

  if (packageDetails) {
    const { images = [] } = packageDetails;

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
      ],
    };

    const handleImageClick = (imgSrc: string) => {
      setSelectedImage(imgSrc);
      setIsOpen(true);
    };

    return (
      <motion.div
        className="bg-white mt-14 px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max_padd_container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={bounceIn}
            className="justify-center items-center mb-12"
          >
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <div className="px-1" key={index}>
                  <Image
                    src={img}
                    alt={`Image of ${packageDetails.title1} (${index + 1})`}
                    width={1200}
                    height={1000}
                    layout="responsive"
                    priority
                    className="rounded-xl transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => handleImageClick(img)}
                  />
                </div>
              ))}
            </Slider>
          </motion.div>

          <ImageModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            imgSrc={selectedImage}
            title={`${packageDetails.title1} Image`}
          />

          <div className="text-start max-w-7xl sm:max-w-full">
            <motion.section
              className="relative mb-6 bg-white shadow-lg p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              <motion.h1
                variants={fadeIn}
                className="text-xl font-bold text-center sm:text-3xl text-gray-800 mb-6"
              >
                {packageDetails.title1}, {packageDetails.title2}
                <hr className="bg-black" />
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="overflow-hidden text-center text-sm sm:text-lg text-gray-700 mb-6"
              >
                {packageDetails.des}
              </motion.p>
              <div className="flexCenter">
                <div className="relative text-center">
                  <motion.div
                    variants={fadeIn}
                    className="bg-white shadow-lg p-4 mb-8 rounded-lg max-w-48 sm:max-w-56"
                  >
                    <p className="text-lg sm:text-xl font-semibold text-black">
                      Price: ${packageDetails.price}
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="flexCenter">
                <motion.div
                  variants={fadeIn}
                  className="mt-6 mb-12 bg-white shadow-lg p-4 max-w-56 sm:max-w-xs rounded-lg"
                >
                  <h2 className="text-xl text-center font-bold text-orange-500 mb-4">
                    Additional Details
                  </h2>
                  <ul className="list-none list-inside text-lg">
                    <li>
                      <FaRegUser className="inline-block mr-2" />
                      Ages: {packageDetails.ageRange || "N/A"}
                    </li>
                    <li>
                      <FaUsers className="inline-block mr-2" />
                      Max Group Size: {packageDetails.maxGroupSize || "N/A"}
                    </li>
                    <li>
                      <FaHourglassHalf className="inline-block mr-2" />
                      Duration: {packageDetails.duration || "N/A"}
                    </li>
                    <li>
                      <FaClock className="inline-block mr-2" />
                      Start Time: {packageDetails.startTimeInfo || "N/A"}
                    </li>
                    <li>
                      <FaMobileAlt className="inline-block mr-2" />
                      Mobile Ticket: {packageDetails.mobileTicket ? "Yes" : "No"}
                    </li>
                    <li>
                      <FaLanguage className="inline-block mr-2" />
                      Live Guide Languages:{" "}
                      {packageDetails.liveGuideLanguages?.join(", ") || "N/A"}
                    </li>
                  </ul>
                </motion.div>
              </div>

              <motion.div
                className="flexCenter mt-5"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 40,
                  duration: 1,
                }}
              >
                <button
                  onClick={handleReserveClick}
                  type="submit"
                  className="rounded-lg text-white bg-orange-500 hover:bg-orange-400 active:scale-95 focus:ring-4 focus:ring-orange-300 transition-all duration-300 py-3 px-5"
                >
                  Reserve
                </button>
              </motion.div>

              <motion.section className="mt-10">
                <h2 className="text-xl flexCenter font-bold text-orange-500 mb-4">
                  Comments
                </h2>

                <form onSubmit={handleCommentSubmit} className="flex flex-col mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="border rounded-lg p-2 mb-2"
                    rows={4}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                  >
                    Submit Comment
                  </button>
                </form>

                <ul className="list-none">
                  {comments.map((comment) => (
                    <li key={comment.id} className="mb-4 p-2 bg-gray-100 rounded-lg">
                      <p className="text-gray-800">{comment.text}</p>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </motion.section>
          </div>
        </div>
        <ToastContainer   position="top-center"
        className= "mt-10  "
 />
      </motion.div>
    );
  }

  return null;
};

export default PackageDetails;
