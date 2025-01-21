import Image from 'next/image'
import Link from 'next/link'

const posts = [
  {
    id: 1,
    title: 'Exploring the Hidden Gems of Bali',
    excerpt: 'Discover the serene beaches and lush jungles of Bali. This post covers off-the-beaten-path destinations.',
    image: '/i1.jpeg',
    path: 'https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html'
  },
  {
    id: 2,
    title: 'Top 15 Must-Visit Destinations in Europe',
    excerpt: 'From the Eiffel Tower in Paris to the canals of Venice, here are the top 10 destinations every traveler should experience.',
    image: '/E.jpeg',
    path: 'https://travellersworldwide.com/best-places-to-visit-in-europe'
  },
  {
    id: 3,
    title: 'A Guide to Sustainable Travel',
    excerpt: 'Sustainable travel is the future. Learn how you can reduce your carbon footprint while exploring the world.',
    image: '/G1.jpg',
    path: 'https://www.nationalgeographic.com/travel/article/how-to-travel-better-a-beginners-guide-to-sustainable-travel-in-2023-and-beyond'
  },
]

export default function Home() {
  return (
    <div>
      {/* Featured Post */}
      <section className="w-full bg-gray-100">
        <div className="relative w-full">
          <Image 
            src="/de.jpeg" 
            alt="Featured Post" 
            width={2000}  
            height={800}  
            className="w-full h-50vh object-cover"
          />
          <div className="absolute top-0 left-0 bg-gray-90 bg-opacity-50 text-white w-full h-full flex justify-center items-center">
            <h3 className="text-3xl font-semibold">Bali: A Hidden Paradise</h3>
          </div>
        </div>
        <div className="container mx-auto text-center mt-6">
          <Link href="https://www.tripadvisor.com/Attraction_Products-g294226-a_contentId.1186373408924765+268450243-Bali.html">
            <span className="text-blue-500 text-lg">
              Read More
            </span>
          </Link>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container max_padd_container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 flex flex-col items-center justify-between h-full rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
              <Image 
                src={post.image} 
                alt={post.title} 
                width={500} 
                height={300} 
                className="rounded-xl h-full"
                layout="responsive"
              />
              <h3 className="text-xl font-semibold mt-4">{post.title}</h3>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <Link href={post.path}>
                <span className="text-blue-500 mt-4 inline-block hover:underline"  rel="noopener noreferrer">
                  Read More
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}
