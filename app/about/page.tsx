import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from '@heroicons/react/20/solid';

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
        paragraph: 'Explore breathtaking destinations around the world, from vibrant cities to serene natural landscapes. We offer tailored itineraries that suit your travel desires.',
        link: 'Learn More',
        href: '/about'
    },
    {
        id: 2,
        heading: "Personalized Tours",
        imgSrc: "/tours.jpg",
        paragraph: 'Experience the thrill of travel with our personalized tour packages designed just for you. Discover hidden gems and local cultures in every journey.',
        link: 'Learn More',
        href: '/about'
    },
    {
        id: 3,
        heading: "Luxury Travel",
        imgSrc: "/Travel.jpg",
        paragraph: 'Indulge in luxury travel experiences that go beyond expectations. Enjoy first-class accommodations, gourmet dining, and exclusive access to the best attractions.',
        link: 'Learn More',
        href: '/about'
    },
];

const AboutCard = ({ item }: { item: DataType }) => {
    return (
        <div
            key={item.id}
            className='hover:bg-navyblue bg-white flex flex-col items-center justify-between rounded-3xl mt-12 p-6 lg:p-10 shadow-xl transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 group'
        >
            <div className="flex flex-col items-center justify-between h-full">
                <h4 className="text-3xl lg:text-4xl font-semibold text-black mb-4 group-hover:text-orange text-center">{item.heading}</h4>
                <Image
                    src={item.imgSrc}
                    alt={item.heading}
                    width={600} // Set width and height based on expected aspect ratio
                    height={400}
                    className="rounded-lg mb-6"
                    loading="lazy"
                    quality={75} // Add quality for optimized images
                    layout="responsive" // Make images responsive
                />
                <p className="text-lg font-normal text-black group-hover:text-offwhite mb-5 text-center">{item.paragraph}</p>
                <Link
                    href={item.href}
                    className="flex justify-center items-center text-lg font-semibold group-hover:text-white text-blue hover:underline"
                    aria-label={`Learn more about ${item.heading}`}
                >
                    {item.link}
                    <ChevronRightIcon className="ml-2" width={20} height={20} />
                </Link>
            </div>
        </div>
    );
};

const AboutUs = () => {
    return (
        <div id="aboutus-section" className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
            <div
                className="relative"
                style={{
                    backgroundImage: `url('/travel.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                }}
            >
                <div className="absolute inset-0 opacity-40"></div>
                <div className="max_padd_container p-24 relative z-10">
                    <h3 className="text-center text-black text-lg tracking-widest">ABOUT US</h3>
                    <h4 className="text-center text-4xl lg:text-5xl font-bold text-white">Know More About Us</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-16 gap-x-16 lg:gap-x-32">
                        {AboutData.map((item) => (
                            <AboutCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
