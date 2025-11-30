export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  category?: string
  tags?: string[]
  author: string
  authorBio?: string
  authorImage?: string
  publishedDate: string
  readTime?: number
  featured?: boolean
}

// All articles - merged from sample data and WordPress conversion
const articles: Article[] = [
  // WordPress Converted Articles
  {
    slug: 'discover-the-enchanting-island-of-barbuda',
    title: 'Discover the Enchanting Island of Barbuda',
    excerpt:
      'Explore everything that makes Barbuda one of the Caribbean\'s most pristine and unspoiled destinations. From pink sand beaches to wildlife sanctuaries, discover why Barbuda should be your next island escape.',
    content: `
      <h2>Introduction to Barbuda</h2>
      <p>Welcome to Barbuda, a Caribbean gem that remains one of the region's most pristine and undiscovered destinations. Unlike its more developed neighbors, Barbuda has retained its natural beauty and tranquil atmosphere, making it the perfect escape for those seeking authentic island experiences.</p>

      <h2>What Makes Barbuda Special</h2>
      <p>Barbuda is home to some of the Caribbean's most spectacular natural wonders. The island boasts 17 miles of uninterrupted pink sand beaches, crystal-clear turquoise waters, and one of the largest frigate bird sanctuaries in the Western Hemisphere.</p>

      <h3>Natural Wonders</h3>
      <ul>
        <li><strong>Pink Sand Beaches:</strong> Barbuda's iconic beaches get their rosy hue from crushed coral mixed with white sand</li>
        <li><strong>Frigate Bird Sanctuary:</strong> Home to over 5,000 magnificent frigate birds during nesting season</li>
        <li><strong>Marine Life:</strong> Pristine coral reefs teeming with tropical fish, stingrays, and sea turtles</li>
        <li><strong>Cave Systems:</strong> Explore ancient caves with Arawak Indian petroglyphs</li>
      </ul>

      <h2>Planning Your Barbuda Adventure</h2>
      <p>Our tours are designed to showcase the best of Barbuda while respecting the island's delicate ecosystems and local culture. Whether you're interested in wildlife viewing, snorkeling, beach relaxation, or cultural experiences, we have the perfect tour for you.</p>

      <h3>Top Activities</h3>
      <p>From snorkeling with stingrays to exploring hidden beaches, Barbuda offers activities for every type of traveler. Our expert guides ensure you experience the island's highlights while learning about its unique ecology and history.</p>

      <h2>Why Choose Barbuda Leisure Day Tours</h2>
      <p>With years of experience and deep local knowledge, our team provides authentic, sustainable, and unforgettable Barbuda experiences. We're committed to preserving the island's natural beauty while sharing it with visitors from around the world.</p>
    `,
    featuredImage: '/images/Pink-Beach-North-scaled.jpg',
    category: 'Destination Guide',
    tags: ['Barbuda', 'Travel Guide', 'Caribbean', 'Island Paradise'],
    author: 'Barbuda Leisure Tours',
    authorBio: 'Local experts with decades of combined experience showing visitors the best of Barbuda.',
    publishedDate: '2024-01-10',
    readTime: 6,
    featured: true,
  },

  // Sample Articles (keeping for variety)
  {
    slug: 'best-time-visit-barbuda',
    title: 'The Best Time to Visit Barbuda: A Season-by-Season Guide',
    excerpt:
      'Discover the ideal time to experience Barbuda\'s pristine beaches, wildlife, and perfect weather. Learn about peak seasons, weather patterns, and special events throughout the year.',
    content: `
      <h2>Understanding Barbuda's Climate</h2>
      <p>Barbuda enjoys a tropical climate with warm temperatures year-round, making it an excellent destination any time of the year. However, understanding the seasonal variations can help you plan the perfect trip.</p>

      <h2>Peak Season (December to April)</h2>
      <p>The winter months are considered peak season in Barbuda. During this time, you'll experience:</p>
      <ul>
        <li>Temperatures ranging from 77°F to 84°F (25°C to 29°C)</li>
        <li>Low humidity and minimal rainfall</li>
        <li>Perfect beach weather with calm seas</li>
        <li>Higher accommodation rates and more tourists</li>
      </ul>

      <h2>Shoulder Season (May to June, November)</h2>
      <p>These months offer excellent value and great weather:</p>
      <ul>
        <li>Fewer crowds and better prices</li>
        <li>Still warm and sunny with occasional rain showers</li>
        <li>Ideal for those seeking a quieter experience</li>
        <li>Great wildlife viewing opportunities</li>
      </ul>

      <h2>Hurricane Season (July to October)</h2>
      <p>While these months carry some risk of tropical storms, they also offer unique advantages:</p>
      <ul>
        <li>Lowest accommodation rates</li>
        <li>Lush, green landscapes</li>
        <li>Warm ocean temperatures perfect for swimming</li>
        <li>Fewer tourists means secluded beaches</li>
      </ul>

      <h2>Special Events and Festivals</h2>
      <p>Plan your visit around these exciting events:</p>
      <ul>
        <li><strong>Barbuda Caribana</strong> - June: Caribbean culture celebration</li>
        <li><strong>Lobster Festival</strong> - Late June: Fresh seafood and local music</li>
        <li><strong>Sailing Week</strong> - Late April: International sailing regatta</li>
      </ul>

      <h2>Our Recommendation</h2>
      <p>For the best balance of weather, prices, and experience, we recommend visiting during the shoulder months of May, June, or November. You'll enjoy beautiful weather, fewer crowds, and excellent value.</p>
    `,
    featuredImage: '/images/DSC3331-scaled-600x398.jpg',
    category: 'Travel Tips',
    tags: ['Travel Planning', 'Weather', 'Best Time to Visit', 'Barbuda Guide'],
    author: 'Maria Thompson',
    authorBio: 'Local tour guide with 15 years of experience showing visitors the best of Barbuda.',
    publishedDate: '2024-01-15',
    readTime: 6,
    featured: true,
  },
  {
    slug: 'stingray-city-conservation',
    title: 'Stingray City: A Conservation Success Story',
    excerpt:
      'Learn about the conservation efforts protecting Barbuda\'s famous stingrays and how responsible tourism is helping preserve this natural wonder for future generations.',
    content: `
      <h2>The History of Stingray City</h2>
      <p>Stingray City has become one of the Caribbean's most iconic marine attractions. What started as a natural gathering place for southern stingrays has evolved into a carefully managed conservation area.</p>

      <h2>Conservation Initiatives</h2>
      <p>Several programs are in place to protect the stingray population:</p>
      <ul>
        <li>Limited daily visitor numbers to prevent overcrowding</li>
        <li>Strict guidelines for human-stingray interaction</li>
        <li>Regular marine life monitoring and research</li>
        <li>Education programs for tourists and local communities</li>
      </ul>

      <h2>Responsible Tourism Practices</h2>
      <p>When visiting Stingray City with Barbuda Leisure Day Tours, we follow these guidelines:</p>
      <ul>
        <li>No touching of stingrays unless they approach naturally</li>
        <li>Use of reef-safe sunscreen only</li>
        <li>Proper waste disposal to keep waters pristine</li>
        <li>Educational briefings before each tour</li>
      </ul>

      <h2>The Impact of Your Visit</h2>
      <p>By choosing responsible tour operators, you're directly contributing to:</p>
      <ul>
        <li>Marine research and monitoring programs</li>
        <li>Local conservation employment opportunities</li>
        <li>Protection of the broader marine ecosystem</li>
        <li>Education initiatives for the next generation</li>
      </ul>

      <h2>Looking to the Future</h2>
      <p>Our commitment to conservation ensures that Stingray City will remain a pristine natural wonder. Through responsible tourism and ongoing research, we're creating a sustainable model that benefits both wildlife and the local community.</p>
    `,
    featuredImage: '/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp',
    category: 'Conservation',
    tags: ['Marine Life', 'Conservation', 'Stingray City', 'Responsible Tourism'],
    author: 'Dr. James Martinez',
    authorBio: 'Marine biologist specializing in Caribbean marine ecosystems and conservation.',
    publishedDate: '2024-01-20',
    readTime: 5,
    featured: true,
  },
  {
    slug: 'photography-tips-caribbean',
    title: '10 Photography Tips for Capturing Caribbean Beauty',
    excerpt:
      'Master the art of Caribbean photography with these expert tips. From beach shots to underwater photography, learn how to capture stunning memories of your Barbuda adventure.',
    content: `
      <h2>1. Golden Hour Magic</h2>
      <p>Shoot during the first hour after sunrise and the last hour before sunset for warm, soft lighting that makes beaches and waters glow.</p>

      <h2>2. Protect Your Gear</h2>
      <p>Use waterproof cases and silica gel packets to protect cameras from humidity, salt spray, and sand. Always clean equipment after beach sessions.</p>

      <h2>3. Capture the Blues</h2>
      <p>Use a polarizing filter to enhance the vibrant blues of Caribbean waters and reduce glare. Adjust your white balance to capture true-to-life colors.</p>

      <h2>4. Include People for Scale</h2>
      <p>Add human elements to show the grandeur of beaches and landscapes. Silhouettes against sunsets create powerful compositions.</p>

      <h2>5. Go Underwater</h2>
      <p>Invest in a good underwater housing or action camera. Shoot in RAW format for better color correction in post-processing.</p>

      <h2>6. Experiment with Angles</h2>
      <p>Get low for dramatic foreground interest, or shoot from above (drone photography) for stunning aerial perspectives.</p>

      <h2>7. Focus on Details</h2>
      <p>Capture close-ups of shells, coral patterns, tropical flowers, and local crafts to tell a complete visual story.</p>

      <h2>8. Use Leading Lines</h2>
      <p>Utilize natural elements like shorelines, palm shadows, and beach paths to guide the viewer's eye through your composition.</p>

      <h2>9. Wait for Weather</h2>
      <p>Don't skip photography during cloudy days - dramatic skies can create stunning, moody beach shots with unique character.</p>

      <h2>10. Tell a Story</h2>
      <p>Document your journey from preparation to adventure. Candid moments often become the most cherished memories.</p>
    `,
    featuredImage: '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
    category: 'Photography',
    tags: ['Photography', 'Travel Tips', 'Beach Photography', 'Underwater Photography'],
    author: 'Sarah Chen',
    authorBio: 'Professional travel photographer specializing in Caribbean destinations.',
    publishedDate: '2024-01-25',
    readTime: 7,
    featured: true,
  },
]

export function getAllArticles(): Article[] {
  return articles.sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  )
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((article) => article.category === category)
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((article) => article.tags?.includes(tag))
}
