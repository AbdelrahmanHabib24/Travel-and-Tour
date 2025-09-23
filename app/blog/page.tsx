import Image from "next/image";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  path: string;
};

// Simulate fetching posts (SSG)
async function getPosts(): Promise<Post[]> {
  return [
    {
      id: 1,
      title: "Exploring the Hidden Gems of Bali",
      excerpt:
        "Discover the serene beaches and lush jungles of Bali. This post covers off-the-beaten-path destinations.",
      image: "/i1.jpeg",
      path: "https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html",
    },
    {
      id: 2,
      title: "Top 15 Must-Visit Destinations in Europe",
      excerpt:
        "From the Eiffel Tower in Paris to the canals of Venice, here are the top 10 destinations every traveler should experience.",
      image: "/E.jpeg",
      path: "https://travellersworldwide.com/best-places-to-visit-in-europe",
    },
    {
      id: 3,
      title: "A Guide to Sustainable Travel",
      excerpt:
        "Sustainable travel is the future. Learn how you can reduce your carbon footprint while exploring the world.",
      image: "/G1.jpg",
      path: "https://www.nationalgeographic.com/travel/article/how-to-travel-better-a-beginners-guide-to-sustainable-travel-in-2023-and-beyond",
    },
  ];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Post */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/de.jpeg"
          alt="Featured Post"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bali: A Hidden Paradise
          </h1>
          <Link
            href="https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-blue-400 text-lg font-medium hover:underline transition">
              Read More
            </span>
          </Link>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col"
            >
              <Link href={post.path} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-64 sm:h-56 md:h-60 lg:h-64">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                <p className="text-gray-600 mt-2 flex-1">{post.excerpt}</p>
                <Link href={post.path} target="_blank" rel="noopener noreferrer">
                  <span className="text-blue-500 mt-4 inline-block hover:underline transition">
                    Read More
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
