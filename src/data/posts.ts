export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  imageAlt: string
  date: string
  author: string
  category: string
}

export const posts: BlogPost[] = [
  {
    id: 'pristine-beaches',
    slug: 'barbudas-pristine-beaches',
    title: 'Barbuda’s Pristine Beaches: A Slice of Paradise',
    excerpt: 'Barbuda’s Pristine Beaches: A Slice of Paradise If you’re dreaming of secluded, untouched shores with endless stretches of powdery sand and crystal-clear waters, Barbuda is the ultimate destination. This idyllic...',
    image: '/images/downloaded/Allesandra-370x247.jpg',
    imageAlt: 'Beautiful beach in Barbuda',
    date: '2024-11-16',
    author: 'Barbuda Leisure',
    category: 'Travel',
    content: `
If you’re dreaming of secluded, untouched shores with endless stretches of powdery sand and crystal-clear waters, Barbuda is the ultimate destination. This idyllic Caribbean Island, often referred to as the “hidden gem” of the West Indies, boasts some of the most pristine beaches in the world. With its captivating pink sand shores and tranquil turquoise waters, Barbuda offers an unparalleled escape from the ordinary.

### The World-Famous Pink Sand Beach

No trip to Barbuda is complete without a visit to the renowned Pink Sand Beach. This stunning stretch of coastline owes its unique blush hue to tiny, crushed shells mixed with the white sand, creating a mesmerizing pastel pink shade. Extending for over 17 miles, Pink Sand Beach is perfect for leisurely strolls, swimming in the calm waters, or simply soaking in the beauty of this natural wonder. It’s no wonder this beach is a favorite among travelers seeking an otherworldly experience.

### Diana, Princess of Wales, Beach

Named in honor of the late Princess Diana, who visited Barbuda for its unmatched tranquility, this beach is a true sanctuary. Located on the island’s southwestern coast, it offers an expansive stretch of soft white sand and breathtaking views of the Caribbean Sea. With its serene atmosphere, Diana Beach is a perfect spot for relaxation, contemplation, and reveling in the natural beauty of Barbuda.

### Secluded Gems: Barbuda’s Other Beaches

*   **Low Bay Beach**: Located near the island’s lagoon, Low Bay Beach is a serene escape where the gentle lapping waves create a soothing soundtrack. This beach is ideal for beachcombing and kayaking, with ample opportunities to spot exotic birds along the shore.
*   **Coco Point Beach**: Nestled on Barbuda’s southern tip, Coco Point Beach offers seclusion and exclusivity. Its pristine sands and inviting waters make it a favorite spot for swimming and picnicking. With its remote location, you’ll feel like you have the entire beach to yourself.
*   **Palmetto Point Beach**: Palmetto Point Beach is a hidden treasure perfect for nature lovers. Surrounded by lush vegetation, it’s an ideal location for birdwatching and taking in Barbuda’s unspoiled landscape.
*   **Spanish Point Beach**: A true off-the-beaten-path destination, Spanish Point Beach is a rugged and picturesque shoreline. The dramatic scenery and peaceful environment make it an excellent spot for photography and quiet reflection.
*   **Two Foot Bay Beach**: Famous for its unique rock formations and nearby caves, Two Foot Bay Beach offers a more adventurous experience. After exploring the area’s historical caves, you can relax on the soft sands and take a refreshing dip in the ocean.

### What Makes Barbuda’s Beaches Special?

The magic of Barbuda’s beaches lies in their untouched nature. With no towering resorts or overcrowded shores, every beach on the island feels like your private slice of paradise. Whether you’re looking for a romantic retreat, an adventurous day of exploration, or simply a peaceful escape, Barbuda’s beaches deliver an unmatched experience.
    `
  },
  {
    id: 'discover-barbuda',
    slug: 'discover-enchanting-barbuda',
    title: 'Discover the Enchanting Island of Barbuda with Barbuda Leisure Day Tours',
    excerpt: 'Discover the Enchanting Island of Barbuda with Barbuda Leisure Day Tours Nestled in the heart of the Caribbean, Barbuda is an untouched gem that exudes serenity and natural beauty. Known...',
    image: '/images/downloaded/DSCF5666-2-370x247.jpg',
    imageAlt: 'Barbuda island tour experience',
    date: '2024-11-16',
    author: 'Barbuda Leisure',
    category: 'Tours',
    content: `
Nestled in the heart of the Caribbean, Barbuda is an untouched gem that exudes serenity and natural beauty. Known for its powdery pink sandy beaches, crystal-clear turquoise waters, and vibrant wildlife, this tranquil island offers a unique escape from the bustling pace of everyday life. At Barbuda Leisure Day Tours, we bring you the best of this unspoiled paradise with unforgettable tours tailored to ensure one day is enough to create endless memories.

### Why Choose Barbuda?

Barbuda is the ultimate destination for nature lovers, history enthusiasts, and anyone looking to relax in a tropical haven. The island is home to the world-famous Frigate Bird Sanctuary, a thriving habitat for thousands of magnificent seabirds. History buffs will marvel at landmarks like Martello Tower, a centuries-old fortress steeped in Barbuda’s fascinating past. And of course, the pristine beaches, untouched by overdevelopment, offer the perfect spot to unwind.

### Our Signature Tours

#### Discover Barbuda by Air

Perfect for those who want to maximize their time on the island, this tour begins with a quick 15-minute flight from Antigua to Barbuda. Highlights include:

*   Guided sightseeing of Martello Tower and Two Foot Bay National Parks.
*   A boat ride to the Frigate Bird Sanctuary and the stunning Pink Sand Beach.
*   A delicious BBQ lunch with options to upgrade to local seafood delicacies.
*   Leisure time on Barbuda’s serene beaches.

#### Discover Barbuda by Sea

This tour offers a scenic 90-minute ferry ride to Barbuda, giving you the chance to enjoy the Caribbean waters before you arrive. It features:

*   Sightseeing of historical sites and natural wonders.
*   A boat trip to the Pink Sand Beach and Frigate Bird Sanctuary.
*   A sumptuous BBQ lunch and time to relax on Barbuda’s untouched shores.

#### Private Charters by Air or Sea

For those seeking a truly personalized experience, we offer customizable private charters. Whether it’s a catamaran cruise or a private flight, we’ll create the perfect itinerary tailored to your preferences.

### What Sets Us Apart?

At Barbuda Leisure Day Tours, we are passionate about sharing the magic of Barbuda with visitors from around the globe. Our experienced guides provide in-depth knowledge of the island’s history, culture, and natural beauty, ensuring an enriching and memorable experience. From the moment you book with us, we handle every detail, so all you have to do is relax and enjoy.

### Plan Your Barbuda Adventure Today

Barbuda is more than just a destination; it’s an experience that lingers in your heart long after you leave. Whether you choose to explore the island by air, sea, or on a private charter, Barbuda Leisure Day Tours promises a seamless and unforgettable journey.

Start planning your trip to paradise today by visiting our website or contacting us at bookings@BarbudaLeisure.com. Let Barbuda Leisure Day Tours make your dream Caribbean getaway a reality.
    `
  }
]

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}
