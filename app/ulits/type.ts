


export const LINKS = [
  { title: "Home", path: "/", offset: -50 },
  { title: "About", path: "/about", offset: -50 },
  { title: "Contact", path: "/blog", offset: -50 },
  { title: "Feature", path: "feature", offset: -50 },
  { title: "Testimonials", path: "/Testimonials", offset: -50 },

];

export const FEATURE = [  
  { title: "Brazil", URL: "/brazil.jpg" },    // Corrected URL for Brazil  
  { title: "England", URL: "/england.jpg" },  
  { title: "France", URL: "/france.jpg" },  
  { title: "Australia", URL: "/australia.jpg" },  
  { title: "California", URL: "/california.jpg" },  
  { title: "Germany", URL: "/germany.jpg" },  
  { title: "HongKong", URL: "/hong-Kong.jpg" },  
  { title: "India", URL: "/india.jpg" },  
];

export const PACKAGES = [  
  { id: "1", URL: "/package1.jpg",  images: ["/th.jpeg", "/img1.jpeg", "/img2.jpeg","/img.jpeg"], title1: "Florence city", title2: "Italy", price: "2400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.5, count: 20 },  
  { id: "2", URL: "/package2.jpg", title1: "Opera House", title2: "Australia", price: "1400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.0, count: 15 },  
  { id: "3", URL: "/package3.jpg", title1: "Eiffel Tower", title2: "France", price: "1400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.7, count: 30 },  
  { id: "4", URL: "/package4.jpg", title1: "Victoria Peak", title2: "Hong Kong", price: "3400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.8, count: 25 },  
  { id: "5", URL: "/package5.jpg", title1: "Amazon Rainforest", title2: "Brazil", price: "2000", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.2, count: 18 },  
  { id: "6", URL: "/package6.jpg", title1: "Camden Market", title2: "London", price: "2400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.6, count: 22 },  
  { id: "7", URL: "/package7.jpg", title1: "Komodo Park", title2: "Indonesia", price: "2400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.5, count: 16 },  
  { id: "8", URL: "/package8.jpg", title1: "Zurich City", title2: "Switzerland", price: "2400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.3, count: 12 },  
  { id: "9", URL: "/package9.jpg", title1: "Taj Mahal", title2: "India", price: "1400", duration: "2 days", des: "Embark on an unforgettable adventure with our all-inclusive tour and travel package, offering immersive experiences and arrangements", rating: 4.9, count: 35 },  
];

export const PACKAGE = [  
  {  
    id: "1",  
    URL: "/package1.jpg",  
    title1: "Florence city",  
    title2: "Italy",  
    price: "2400",  
    duration: "2 days", 
    images:["/img.jpeg","/img1.jpeg","/img2.jpeg" , "/th.jpeg"], 
    des: "Florence is a compact city yet, as the capital of the Italian Renaissance, its concentration of museums and monuments is amazing. Rather than build your own itinerary and grapple with maps and long lines, join this fully guided tour to check off the highlights and get skip-the-line access to Michelango’s celebrated David sculpture, too. Covering everything from art to shops, it's perfect for new visitors or anyone with limited time.",  
    rating: 4.5,  
    count: 20,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["German", "English", "Italian"]  
  },  
  {  
    id: "2",  
    URL: "/package2.jpg",  
    title1: "Opera House",  
    title2: "Australia",  
    price: "1400",  
    duration: "2 days",  
    images:["/c.jpg", "/c1.jpg","/c2.jpg","/c3.jpg"],
    des: "The Sydney Opera House is a multi-venue performing arts centre in Sydney, New South Wales, Australia. Located on the foreshore of Sydney Harbour, it is widely regarded as one of the world's most famous and distinctive buildings, and a masterpiece of 20th-century architecture Designed by Danish architect Jørn Utzon and completed by an Australian architectural team headed by Peter Hall, the building was formally opened by Queen Elizabeth II on 20 October 1973,[5] 16 years after Utzon's 1957 selection as winner of an international design competition.",  
    rating: 4.0,  
    count: 15,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["German", "English", "Portuguese"]  
  },  

  
  {  
    id: "3",  
    URL: "/package3.jpg",  
    title1: "Eiffel Tower",  
    title2: "France",  
    price: "1400",  
    duration: "2 days",  
    des: "The Eiffel Tower (/ˈaɪfəl/ ⓘ EYE-fəl; French: Tour Eiffel [tuʁ ɛfɛl] ⓘ) is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower from 1887 to 1889 Locally nicknamed La dame de fer (French for Iron Lady), it was constructed as the centerpiece of the 1889 World's Fair, and to crown the centennial anniversary of the French Revolution. ",  
    rating: 4.7,  
    count: 30,  
    images:["/r1.jpeg" , "/r.jpg" , "/r2.jpg" , "/r4.jpg"],
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["German", "English", "French"]  
  },  
  {  
    id: "4",  
    URL: "/package4.jpg",  
    title1: "Victoria Peak",  
    title2: "Hong Kong",  
    price: "3400",  
    duration: "2 days",  
    des: "Victoria Peak is a hill on the western half of Hong Kong Island. It is also known as Mount Austin, and locally as The Peak only generally. With an elevation of 552 metres (1,811 ft), it is the tallest hill on Hong Kong Island, and the 29th tallest in the territory of Hong Kong. It is a major tourist attraction offering views of Central, Victoria Harbour, Lamma Island and the surrounding islands.",  
    rating: 4.8,  
    count: 25,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    images:["/t.jpeg" , "/t1.jpg" , "/t2.jpeg"],
    mobileTicket: true,  
    liveGuideLanguages: ["Chinese", "English"]  
  },  
  {  
    id: "5",  
    URL: "/package5.jpg",  
    title1: "Amazon Rainforest",  
    title2: "Brazil",  
    price: "2000",  
    duration: "2 days",  
    des: "The Amazon rainforest,[a] also called Amazon jungle or Amazonia, is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 km2 (2,700,000 sq mi),[2] of which 6,000,000 km2 (2,300,000 sq mi) are covered by the rainforest.[3] This region includes territory belonging to nine nations and 3,344 indigenous territories.",  
    rating: 4.2,  
    count: 18,  
    ageRange: "0-99",  
    images:["/a.jpeg" , "/a1.jpg" , "/a2.jpeg" , "/a3.jpg"],
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["English", "Portuguese"]  
  },  
  {  
    id: "6",  
    URL: "/package6.jpg",  
    title1: "Camden Market",  
    title2: "London",  
    price: "2400",  
    duration: "2 days",  
    des: "The Camden markets are a number of adjoining large retail markets, often collectively referred to as Camden Market or Camden Lock, located in the historic former Pickfords stables, in Camden Town, London. It is situated north of the Hampstead Road Lock of the Regent's Canal (popularly referred to as Camden Lock). Famed for their cosmopolitan image, products sold on the stalls include crafts, clothing, books, bric-a-brac, and fast food. It is the fourth-most popular visitor attraction in London, attracting approximately 250,000 people each week.[1]",  
    rating: 4.6,  
    count: 22,  
    images:["/f.jpeg" , "/f1.jpeg", "/f2.jpg", "/f3.jpeg"],
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["English", "French"]  
  },  
  {  
    id: "7",  
    URL: "/package7.jpg",  
    title1: "Komodo Park",  
    title2: "Indonesia",  
    price: "2400",  
    duration: "2 days",  
    des: "Komodo National Park (Indonesian: Taman Nasional Komodo) is a national park in Indonesia located within the Lesser Sunda Islands in the border region between the provinces of East Nusa Tenggara and West Nusa Tenggara. The park includes the three larger islands Komodo, Padar and Rinca, and 26 smaller ones, with a total area of 1,733 km2 (603 km2 of it land). The national park was founded in 1980 to protect the Komodo dragon, the world's largest lizard. Later it was dedicated to protecting other species, including marine species. In 1991 the national park was declared a UNESCO World Heritage Site and a Man and Biosphere Reserve. It is considered one of the world's 25 biodiversity hotspots.",  
    rating: 4.5,  
    count: 16,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    startTimeInfo: "Check availability",  
    images:["/k.jpg" , "/k1.jpg" , "/k2.jpg" , "/k3.jpeg" ],
    mobileTicket: true,  
    liveGuideLanguages: ["English", "Indonesian"]  
  },  
  {  
    id: "8",  
    URL: "/package8.jpg",  
    title1: "Zurich City",  
    title2: "Switzerland",  
    price: "2400",  
    duration: "2 days",  
    des: "Zurich (German: Zürich; Alemannic German: Züri) is the largest city in Switzerland and the capital of the canton of Zurich. It is located in north-central Switzerland,[5] at the northwestern tip of Lake Zurich. As of January 2023, the municipality had 443,037 inhabitants,[6] the urban area 1.315 million (2009),[7] and the Zurich metropolitan area 1.83 million (2011).[8] Zurich is a hub for railways, roads, and air traffic. Both Zurich Airport and Zurich's main railway station are the largest and busiest in the country.",  
    rating: 4.3,  
    count: 12,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h",  
    images:["/s.jpeg", "/s1.jpeg", "/s2.jpeg" , "/s3.jpeg"],
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["German", "English", "French"]  
  },  
  {  
    id: "9",  
    URL: "/package9.jpg",  
    title1: "Taj Mahal",  
    title2: "India",  
    price: "1400",  
    duration: "2 days",  
    des: "The Taj Mahal (/ˌtɑːdʒ məˈhɑːl, ˌtɑːʒ -/ TAHJ mə-HAHL, TAHZH -⁠, Hindi: [taːdʒ ˈmɛɦ(ɛ)l]; lit. 'Crown of the Palace') is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan (r. 1628–1658) to house the tomb of his beloved wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.",  
    rating: 4.9,  
    count: 35,  
    ageRange: "0-99",  
    maxGroupSize: 19,  
    travelDuration: "3h", 
    images:["/q.jpg", "/q1.jpg" , "/q2.jpg" , "/q3.jpg"], 
    startTimeInfo: "Check availability",  
    mobileTicket: true,  
    liveGuideLanguages: ["Hindi", "English"]  
  },  
];


export const TESTIMONIALS = [
  {title:"James Martinez",
    Profession:"Director , Nova Gold",
    URL:"/person-1.jpg",
    Desc:"Fanstastic destinations , knowledgeable guides , seamless logistics. Spectacular views and memories. Exceeded expectations; worth every penny"
  },
  {title:"Sophia Anderson",
    Profession:"Manager , Safe City",
    URL:"/person-2.jpg",
    Desc:"Unforgettable adventures, expert planning, and personalized experiences. Breathtaking landscapes and genuine connections. Truly a dream trip; every moment was priceless."
  },
  {  
    title: "Oliver King",  
    Profession: "Adventure Specialist, Travel Beyond",  
    URL: "/person-3.jpg",  
    Desc: "Inspiring travel experiences, precise planning, and unique itineraries. Breathtaking sights and rich encounters. A remarkable journey; a priceless investment in exploration!"  
},
  {  
    title: "Daniel Thompson",  
    Profession: "Event Coordinator, Urban Escapes",  
    URL: "/person-4.jpg",  
  Desc: "Incredible experiences, meticulous organization, and custom itineraries. Stunning sights and memorable encounters. A remarkable journey; a true value for the investment."  
},
{  
  title: "Ali Khan",  
  Profession: "Ceo, High Chase",  
  URL: "/person-5.jpg",  
  Desc: "Exceptional adventures, seamless planning, and curated experiences. Breathtaking views and unforgettable stories. Truly a life-changing trip; every moment was invaluable."  
},
]