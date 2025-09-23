import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

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
    heading: "Discover destinations",
    imgSrc: "/destination.jpg",
    paragraph:
      "Explore breathtaking destinations around the world, from vibrant cities to serene natural landscapes. We offer tailored itineraries that suit your travel desires.",
    link: "Learn More",
    href: "/about",
  },
  {
    id: 2,
    heading: "Personalized Tours",
    imgSrc: "/tours.jpg",
    paragraph:
      "Experience the thrill of travel with our personalized tour packages designed just for you. Discover hidden gems and local cultures in every journey.",
    link: "Learn More",
    href: "/about",
  },
  {
    id: 3,
    heading: "Luxury Travel",
    imgSrc: "/Travel.jpg",
    paragraph:
      "Indulge in luxury travel experiences that go beyond expectations. Enjoy first-class accommodations, gourmet dining, and exclusive access to the best attractions.",
    link: "Learn More",
    href: "/about",
  },
];

const AboutCard = ({ item }: { item: DataType }) => (
  <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105 p-6 lg:p-10 flex flex-col items-center justify-between mt-12 overflow-hidden">
    {/* Image */}
    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 relative">
      <Image
        src={item.imgSrc}
        alt={item.heading}
        width={800}
        height={600}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
    </div>

    {/* Heading */}
    <h4 className="text-2xl sm:text-2xl md:text-xl lg:text-xl font-semibold text-gray-900 group-hover:text-orange text-center mb-3 transition-colors duration-300">
      {item.heading}
    </h4>

    {/* Paragraph */}
    <p className="text-lg font-normal text-gray-700 group-hover:text-gray-900 mb-5 text-center line-clamp-4">
  {item.paragraph}
</p>


    {/* Link */}
    <Link
      href={item.href}
      className="flex items-center text-blue-600 group-hover:text-orange font-semibold text-lg hover:underline transition-colors duration-300"
      aria-label={`Learn more about ${item.heading}`}
    >
      {item.link}
      <ChevronRightIcon className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  </div>
);

export default function AboutUs() {
  return (
    <div
      id="aboutus-section"
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700"
    >
      <div
        className="relative"
        style={{
          backgroundImage: `url('/travel.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <div className="max_padd_container p-24 relative z-10">
          <h3 className="text-center text-white text-lg tracking-widest">
            ABOUT US
          </h3>
          <h4 className="text-center text-4xl lg:text-5xl font-bold text-white mt-2">
            Know More About Us
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-16 gap-x-12 lg:gap-x-24 gap-y-12">
            {AboutData.map((item) => (
              <AboutCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
