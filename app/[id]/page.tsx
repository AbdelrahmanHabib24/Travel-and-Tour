/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

"use client";

import {  useEffect, useState } from "react";
import { useSearchParams  , useRouter} from "next/navigation";
import { PACKAGE } from "@/app/ulits/type"; 
import Image from "next/image"; 
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import { motion } from "framer-motion"; 
import Cookies from 'js-cookie';  
import {
  FaRegUser,
  FaUsers,
  FaHourglassHalf,
  FaClock,
  FaMobileAlt,
  FaLanguage,
} from "react-icons/fa"; // Icons
import { toast, ToastContainer } from "react-toastify";
import router from "next/router";

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
  images?: string[]; 
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
};

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void; 
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
      staggerChildren: 0.3, 
    },
  },
};

const PackageDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
    const router = useRouter();  
  

  const [loading, setLoading] = useState<boolean>(true);
  const [packageDetails, setPackageDetails] = useState<PACKAGE | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 

  const [selectedImage, setSelectedImage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    console.log("ID from URL:", id);

    if (!id) {
      setError("Invalid package ID!");
      setLoading(false);
      return;
    }

    const foundPackage = PACKAGE.find((pkg: PACKAGE) => pkg.id === id);

    if (foundPackage) {
      setPackageDetails(foundPackage);
    } else {
      setError("Package not found!");
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
    const authToken = Cookies.get('authToken');  
  
    if (authToken) {
      router.push('/payment');  
    } else {
      toast.error('You must be logged in to reserve');  
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
      <><motion.div
        className="  bg-white mt-14 px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className=" max_padd_container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={bounceIn}
            className="justify-center   items-center mb-12"
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
                    onClick={() => handleImageClick(img)} />
                </div>
              ))}
            </Slider>
          </motion.div>

          <ImageModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            imgSrc={selectedImage}
            title={`${packageDetails.title1} Image`} />

          <div className="text-start max-w-7xl  sm:max-w-full">
            <motion.section
              className="relative mb-6 bg-white shadow-lg p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={container}
            >
              <motion.h1
                variants={fadeIn}
                className="text-xl font-bold text-center  sm:text-3xl text-gray-800  mb-6"
              >
                {packageDetails.title1}, {packageDetails.title2}
                <hr className="bg-black " />
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="overflow-hidden text-center text-sm sm:text-lg text-gray-700  mb-6   "
              >
                {packageDetails.des}
              </motion.p>
              <div className="flexCenter">
                <div className="relative text-center ">
                  <motion.div
                    variants={fadeIn}
                    className="bg-white shadow-lg p-4  mb-8 rounded-lg max-w-48 sm:max-w-56"
                  >
                    <p className=" text-lg sm:text-xl font-semibold  text-black">
                      Price: ${packageDetails.price}
                    </p>
                    <p className="text-sm text-black"></p>
                  </motion.div>
                </div>
              </div>
              <section>
                <div className="max_padd_container overflow-hidden relative">
                  <motion.div
                    className="flex gap-x-16 justify-center mb-8 flex-wrap"
                  >
                    {[
                      { title: "London", image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80", rating: "4.5", place: "Big Ben" },
                      { title: "Paris", image: "https://images.unsplash.com/photo-1581010864468-c972b8705439?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80", rating: "5", place: "Eiffel Tower" },
                      { title: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1096&q=80", rating: "4.7", place: "Colosseum" },
                      { title: "Pisa", image: "https://images.unsplash.com/photo-1581473483413-313a5afffb08?ixlib=rb-1.2.1&auto=format&fit=crop&w=714&q=80", rating: "4.3", place: "Pisa Tower" },
                      { title: "New York", image: "https://images.unsplash.com/photo-1585155967849-91c736589c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=627&q=80", rating: "4.8", place: "Statue of Liberty" },
                      { title: "Sydney", image: "https://images.unsplash.com/photo-1527915676329-fd5ec8a12d4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80", rating: "5", place: "Sydney Opera House" },
                    ].map((card, index) => (
                      <motion.div
                        className="flex flex-col  items-center justify-center w-full sm:w-56 md:w-64 lg:w-72 p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105"
                        key={index}
                        animate={{ x: index % 2 === 0 ? "-10%" : "10%" }}
                        transition={{ repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" }}
                      >
                        <div className="relative aspect-w-1 aspect-h-1">
                          <img
                            src={card.image}
                            alt={card.place}
                            className="rounded-xl w-full h-48 " />
                          <span className="absolute top-2 right-2 bg-black text-white px-2 rounded-lg text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.016a1 1 0 00-.362 1.118l1.07 3.292c.3.92-.755 1.688-1.543 1.118l-2.8-2.016a1 1 0 00-1.118 0l-2.8 2.016c-.788.57-1.843-.198-1.543-1.118l1.07-3.292a1 1 0 00-.362-1.118l-2.8-2.016c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                            {card.rating}
                          </span>
                        </div>
                        <div className="card__content mt-2 overflow-y-hidden">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{card.title}</h3>
                          <p className="text-sm sm:text-base text-gray-500">{card.place}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>


              <div className="flexCenter">
                <motion.div
                  variants={fadeIn}
                  className="mt-6 mb-12  bg-white shadow-lg p-4  max-w-56 sm:max-w-xs rounded-lg"
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

              <div className="flexCenter">
                <motion.div
                  variants={fadeIn}
                  className=" gap-10 mb-6 flexStart bg-white shadow-lg p-4 max-w-xs rounded-lg"
                >
                  <p className="text-lg text-gray-800 font-medium">Rating:</p>
                  <p className="text-xl text-yellow-500">
                    {packageDetails.rating ?? "N/A"}
                  </p>
                  {packageDetails.count && (
                    <span className="text-sm text-gray-500">
                      ({packageDetails.count} reviews)
                    </span>
                  )}
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
                  duration: 1 
                }}
              >
                <button
                
                  onClick={handleReserveClick}
                  type="submit"
                  className="rounded-lg text-white bg-orange-500 hover:bg-orange-400 active:scale-95  focus:ring-4 focus:ring-orange-300 transition-all duration-300 py-3 px-5"
                >
                  Reserve
                </button>
              </motion.div>


              <motion.section className="mt-10">
                <h2 className="text-xl flexCenter font-bold text-orange-500 mb-4">
                  Comments
                </h2>

                <form
                  onSubmit={handleCommentSubmit}
                  className="flex flex-col mb-4"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="border rounded-lg p-2 mb-2"
                    rows={4}
                    required />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                  >
                    Submit Comment
                  </button>
                </form>

                {/* Comment List */}
                <ul className="list-none">
                  {comments.map((comment) => (
                    <li key={comment.id} className="border-b py-2">
                      {comment.text}
                    </li>
                  ))}
                </ul>


              </motion.section>

            </motion.section>

          </div>

          {/* Adding the Card Section Below */}
        </div>

      </motion.div><>
          <ToastContainer   className="mt-14"       position="top-center"
 />
              </></>
  )}

  return null;
};

export default PackageDetails;


