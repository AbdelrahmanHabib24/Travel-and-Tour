import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
  const t = await getTranslations("blog");

  const posts = [
    {
      id: 1,
      title: t("posts.1.title"),
      excerpt: t("posts.1.excerpt"),
      image: "/i1.webp",
      path: "https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html",
    },
    {
      id: 2,
      title: t("posts.2.title"),
      excerpt: t("posts.2.excerpt"),
      image: "/e.webp",
      path: "https://travellersworldwide.com/best-places-to-visit-in-europe",
    },
    {
      id: 3,
      title: t("posts.3.title"),
      excerpt: t("posts.3.excerpt"),
      image: "/g1.webp",
      path: "https://www.nationalgeographic.com/travel/article/how-to-travel-better-a-beginners-guide-to-sustainable-travel-in-2023-and-beyond",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-start">
      {/* Featured Post */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/de.webp"
          alt={t("featured.title")}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("featured.title")}
          </h1>
          <Link
            href="https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-blue-400 text-lg font-medium hover:underline transition">
              {t("featured.readMore")}
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                <p className="text-gray-600 mt-2 flex-1">{post.excerpt}</p>
                <Link href={post.path} target="_blank" rel="noopener noreferrer">
                  <span className="text-blue-500 mt-4 inline-block hover:underline transition font-medium">
                    {t("readMore")}
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
