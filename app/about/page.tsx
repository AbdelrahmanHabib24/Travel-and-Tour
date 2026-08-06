import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { FaCompass, FaRoute, FaCrown } from "react-icons/fa6";

interface DataType {
  id: number;
  heading: string;
  imgSrc: string;
  paragraph: string;
  link: string;
  href: string;
}

const AboutData: DataType[] = [
  {
    id: 1,
    heading: "Discover Destinations",
    imgSrc: "/destination.webp",
    paragraph:
      "Explore breathtaking destinations around the world, from vibrant cities to serene natural landscapes. We offer tailored itineraries that suit your travel desires.",
    link: "Learn More",
    href: "/about",
  },
  {
    id: 2,
    heading: "Personalized Tours",
    imgSrc: "/tours.webp",
    paragraph:
      "Experience the thrill of travel with our personalized tour packages designed just for you. Discover hidden gems and local cultures in every journey.",
    link: "Learn More",
    href: "/about",
  },
  {
    id: 3,
    heading: "Luxury Travel",
    imgSrc: "/luxury-travel.webp",
    paragraph:
      "Indulge in luxury travel experiences that go beyond expectations. Enjoy first-class accommodations, gourmet dining, and exclusive access to the best attractions.",
    link: "Learn More",
    href: "/about",
  },
];

const AboutCard = ({ item }: { item: DataType }) => (
  <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden ">
    <div>
      {/* Image container */}
      <div className="w-full h-56 sm:h-60 overflow-hidden relative">
        <Image
          src={item.imgSrc}
          alt={item.heading}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          quality={90}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content wrapper */}
      <div className="bg-white pt-6 px-6 sm:px-8">
        {/* Heading */}
        <h4 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 text-center mb-4 transition-colors duration-300">
          {item.heading}
        </h4>

        {/* Paragraph */}
        <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
          {item.paragraph}
        </p>
      </div>
    </div>

    {/* Link */}
    <div className="flex justify-center pb-8 px-6 sm:px-8 bg-white">
      <Link
        href={item.href}
        className="inline-flex items-center text-orange-500 font-semibold text-base hover:text-orange-600 transition-colors duration-300 group/link"
        aria-label={`Learn more about ${item.heading}`}
      >
        <span>{item.link}</span>
        <ChevronRightIcon className="ml-1 w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
      </Link>
    </div>
  </div>
);

export default function AboutUs() {
  return (
    <div
      id="aboutus-section"
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden"
    >
      <Image
        src="/travel.webp"
        alt="About Us Background"
        fill
        sizes="100vw"
        className="object-cover opacity-80"
        quality={90}
        priority
      />
      
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      <div className="relative z-10 max_padd_container pt-32 pb-24 px-6 sm:px-12 lg:px-16">
        <h3 className="text-center text-orange-400 font-bold text-sm tracking-[0.2em] uppercase mb-2">
          ABOUT US
        </h3>
        <h4 className="text-center text-3xl lg:text-5xl font-extrabold text-white">
          Know More About Us
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16 gap-8 lg:gap-10">
          {AboutData.map((item) => (
            <AboutCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
