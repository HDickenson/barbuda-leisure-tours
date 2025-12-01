// Tour data for Barbuda Leisure Day Tours
// This data is used to generate static tour pages

export interface Tour {
  slug: string
  title: string
  subtitle: string
  description: string
  heroImage: string
  duration: string
  price: string
  priceDetails: {
    adult: number
    child: number
    infant?: number
  }
  transport: string
  difficulty: string
  category: 'signature' | 'local' | 'shared' | 'private'
  highlights: string[]
  included: string[]
  importantInfo: string[]
  badge?: string
  gallery?: string[]
  featured?: boolean
  requiresPassport?: boolean
  requiresBodyWeight?: boolean
  mealUpgrades?: {
    lobster?: number
    fish?: number
    conch?: number
    shrimp?: number
    vegetarian?: number
  }
  whatToBring?: string[]
  schedule?: {
    departure?: string
    arrival?: string
    returnDeparture?: string
    returnArrival?: string
    checkInTime?: string
    location?: string
    frequency?: string
    notes?: string
  }
  lunchUpgrades?: {
    name: string
    price: number
  }[]
  transportDetails?: string[]
}

const tours: Tour[] = [
  // Signature Tours
  {
    slug: 'discover-barbuda-by-air',
    title: 'Discover Barbuda by Air',
    subtitle: 'The Complete Island Experience',
    description:
      'Soar above the stunning Caribbean waters and experience Barbuda from a breathtaking aerial perspective. This premium tour includes round-trip flights, a guided island exploration, beach time at the famous pink sand beaches, and an authentic Caribbean lunch experience. Perfect for those seeking the ultimate convenience and a birds-eye view of paradise.',
    heroImage: '/images/BarbudaLeisureTours-3.webp',
    duration: 'Full Day (6-7 hours)',
    price: 'From $349',
    priceDetails: {
      adult: 349,
      child: 249,
      infant: 99,
    },
    transport: 'Small Aircraft',
    difficulty: 'Easy',
    category: 'signature',
    highlights: [
      'Scenic flight over the Caribbean Sea',
      'Visit the famous Frigate Bird Sanctuary',
      'Relax on world-renowned pink sand beaches',
      'Explore historical ruins and local culture',
      'Crystal clear waters perfect for swimming',
      'Snorkeling at pristine reef sites',
    ],
    included: [
      'Round-trip flights from Antigua to Barbuda',
      'Guided island tour with local expert',
      'Beach time at pristine pink sand beaches',
      'Authentic Caribbean BBQ lunch',
      'All ground transportation in Barbuda',
      'Professional tour guide',
      'Snorkeling equipment',
      'Refreshments and water',
    ],
    importantInfo: [
      'Valid passport required for all passengers',
      'Weight information required for flight safety',
      'Duration: Full day (approximately 6-7 hours)',
      'Minimum 3 days advance booking required',
      'Subject to weather conditions',
    ],
    badge: 'Most Popular',
    featured: true,
    requiresPassport: true,
    requiresBodyWeight: true,
    mealUpgrades: {
      lobster: 15,
      fish: 10,
      conch: 10,
      shrimp: 10,
      vegetarian: 5,
    },
    whatToBring: [
      'Valid passport or government-issued ID (same used when booking)',
      'Sunscreen, hat, and sunglasses',
      'Swimwear and towel',
      'Comfortable clothing and footwear',
      'Camera or smartphone for photos',
      'Light snacks or preferred beverages',
      'Reusable water bottle (water also provided)',
      'Umbrella (recommended)',
    ],
    schedule: {
      departure: '7:15 AM',
      arrival: '7:35 AM',
      returnDeparture: '4:30 PM',
      returnArrival: '4:50 PM',
      checkInTime: 'One hour and 15 minutes before departure',
      location: 'V.C. Bird International Airport',
      notes: 'Flight times may vary slightly depending on weather and operational conditions',
    },
    transportDetails: [
      'J8-VBL Islander',
      'J8-CRU Twin Otter',
      'J8-VBK',
      'Dash-8',
      'ATR-42',
    ],
    gallery: [
      '/images/BarbudaLeisureTours-3.webp',
      '/images/Pink-Beach-North.webp',
      '/images/BarbudaLeisureTours-4.webp',
      '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
      '/images/BarbudaLeisureTours-7.webp',
      '/images/BarbudaLeisureTours-8.webp',
    ],
  },
  {
    slug: 'discover-barbuda-by-sea',
    title: 'Discover Barbuda by Sea',
    subtitle: 'Sail to Paradise',
    description:
      "Set sail on a luxury catamaran adventure to Barbuda's hidden gems. Enjoy crystal-clear waters, pristine beaches, and the famous Frigate Bird Sanctuary. This full-day cruise combines relaxation with exploration, featuring swimming, snorkeling, and a delicious Caribbean lunch on board.",
    heroImage: '/images/BarbudaLeisureTours-3-2.webp',
    duration: 'Full Day (7-8 hours)',
    price: 'From $249',
    priceDetails: {
      adult: 249,
      child: 179,
      infant: 75,
    },
    transport: 'Luxury Catamaran',
    difficulty: 'Easy',
    category: 'signature',
    highlights: [
      'Scenic catamaran cruise from Antigua',
      'Frigate Bird Sanctuary visit',
      'Multiple beach stops',
      'Snorkeling at coral reefs',
      'Open bar with tropical drinks',
      'Beach BBQ lunch',
    ],
    included: [
      'Round-trip catamaran cruise',
      'Professional crew and guides',
      'Beach time at multiple locations',
      'Caribbean BBQ lunch',
      'Open bar (rum punch, beer, soft drinks)',
      'Snorkeling equipment',
      'Life jackets',
      'Fresh water showers',
    ],
    importantInfo: [
      'Departure from Jolly Harbour, Antigua',
      'Duration: Full day (approximately 7-8 hours)',
      'Advance booking recommended',
      'Suitable for all ages',
      'Subject to weather and sea conditions',
    ],
    badge: 'Best Value',
    featured: true,
    requiresPassport: true,
    whatToBring: [
      'Passport or government-issued ID',
      'Hat, sunscreen, and sunglasses',
      'Swimwear and towel',
      'Comfortable shoes and light clothing',
      'Camera or smartphone',
      'Light snacks or preferred beverages',
      'Seasickness medication (recommended for sensitive travelers)',
      'Reusable water bottle (water also provided)',
      'Umbrella (recommended)',
    ],
    schedule: {
      departure: '6:30 AM',
      arrival: '8:00 AM',
      returnDeparture: '3:00 PM',
      returnArrival: '4:30 PM',
      checkInTime: '6:00 AM',
      location: 'Heritage Quay Ferry Terminal',
      notes: '90-minute crossing each way - schedule may vary based on weather and ferry operations',
    },
    gallery: [
      '/images/BarbudaLeisureTours-3-2.webp',
      '/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp',
      '/images/Pink-Beach-North.webp',
      '/images/BarbudaLeisureTours-6.webp',
      '/images/DSC3331.webp',
      '/images/BarbudaLeisureTours-8.webp',
    ],
  },
  {
    slug: 'barbuda-sky-sea-adventure',
    title: 'Sky & Sea Adventure',
    subtitle: 'The Best of Both Worlds',
    description:
      'Fly to Barbuda in the morning, explore the island, then cruise back on a luxury catamaran. The ultimate combination of convenience and adventure, offering aerial views on the way there and a relaxing sail home. Experience the best of both transportation methods in one incredible day.',
    heroImage: '/images/BarbudaLeisureTours-7.webp',
    duration: 'Full Day (7-8 hours)',
    price: 'From $299',
    priceDetails: {
      adult: 299,
      child: 219,
      infant: 89,
    },
    transport: 'Air + Sea',
    difficulty: 'Easy',
    category: 'signature',
    highlights: [
      'Morning flight to Barbuda',
      'Full island tour',
      'Pink sand beach relaxation',
      'Frigate Bird Sanctuary',
      'Afternoon catamaran cruise back',
      'Snorkeling opportunities',
    ],
    included: [
      'One-way flight to Barbuda',
      'Ground tour of the island',
      'Beach time and swimming',
      'Caribbean lunch',
      'Return catamaran cruise',
      'Snorkeling equipment',
      'Professional guides',
      'Refreshments throughout',
    ],
    importantInfo: [
      'Passport required',
      'Weight information needed for flight',
      'Flexible schedule accommodations',
      'Subject to weather conditions',
      'Advance booking required',
    ],
    featured: true,
    requiresPassport: true,
    requiresBodyWeight: true,
    whatToBring: [
      'Passport (required for flight check-in)',
      'Hat, sunscreen, and sunglasses',
      'Swimwear and towels',
      'Comfortable footwear',
      'Camera or phone',
      'Light snacks or preferred beverages',
    ],
    schedule: {
      departure: '7:00 AM',
      arrival: '7:20 AM',
      returnDeparture: '3:00 PM',
      returnArrival: '4:30 PM',
      checkInTime: 'One hour and 15 minutes before departure for flight',
      location: 'V.C. Bird International Airport',
      notes: 'Combining flight and ferry return',
    },
    gallery: [
      '/images/BarbudaLeisureTours-7.webp',
      '/images/BarbudaLeisureTours-3.webp',
      '/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp',
      '/images/Pink-Beach-North.webp',
      '/images/BarbudaLeisureTours-6.webp',
      '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
    ],
  },
  {
    slug: 'barbuda-beach-escape',
    title: 'Barbuda Beach Escape',
    subtitle: 'Your Choice of Transport',
    description:
      'Escape to pristine pink sand beaches with your preferred mode of transport. This flexible tour allows you to choose from air, ferry, helicopter, or private boat. Focus on pure relaxation with extended beach time, snorkeling in crystal-clear waters, and a delicious lunch on the beach.',
    heroImage: '/images/Pink-Beach-North.webp',
    duration: 'Half Day or Full Day',
    price: 'From $199',
    priceDetails: {
      adult: 199,
      child: 149,
    },
    transport: 'Multiple Options',
    difficulty: 'Easy',
    category: 'signature',
    highlights: [
      'Choice of 4 transport methods',
      'Extended beach relaxation time',
      'World-famous pink sand beaches',
      'Snorkeling at pristine reefs',
      'Flexible timing options',
      'Beach lunch included',
    ],
    included: [
      'Round-trip transportation (your choice)',
      'Beach setup (umbrellas, chairs)',
      'Snorkeling equipment',
      'Beach lunch',
      'Cooler with drinks',
      'Guide services',
    ],
    importantInfo: [
      'Transport options: Air, Ferry, Helicopter, or Private Boat',
      'Half-day or full-day options available',
      'Customizable itinerary',
      'Advance booking required for transport coordination',
    ],
    badge: 'Customizable',
    featured: true,
    whatToBring: [
      'Passport (for air travel) or valid ID',
      'Hat, sunscreen, and sunglasses',
      'Swimwear, towel, and beachwear',
      'Comfortable sandals or flip-flops',
      'Camera or phone',
      'Small cash for lunch or souvenirs',
    ],
    gallery: [
      '/images/Pink-Beach-North.webp',
      '/images/BarbudaLeisureTours-8.webp',
      '/images/DSC3331.webp',
      '/images/DSCF5666-2.webp',
      '/images/MG_9010.tif.webp',
      '/images/BarbudaLeisureTours-4.webp',
    ],
  },

  // Local Tours
  {
    slug: 'already-in-barbuda',
    title: 'Local Guided Tour',
    subtitle: 'Already in Barbuda?',
    description:
      "Join our expert local guides for a comprehensive island tour. Perfect for guests staying in Barbuda who want to explore beyond their resort. Discover hidden gems, learn about the island's rich history and culture, and visit all the must-see attractions with an authentic local perspective.",
    heroImage: '/images/BarbudaLeisureTours-3.webp',
    duration: 'Full Day (5-6 hours)',
    price: 'From $149',
    priceDetails: {
      adult: 149,
      child: 99,
    },
    transport: 'Ground Transport',
    difficulty: 'Easy',
    category: 'local',
    highlights: [
      'Comprehensive island exploration',
      'Local expert guide',
      'Frigate Bird Sanctuary',
      'Historical sites and ruins',
      'Multiple beach stops',
      'Cultural insights',
    ],
    included: [
      'Air-conditioned ground transportation',
      'Local expert guide',
      'Island highlights tour',
      'Beach time',
      'Caribbean lunch',
      'Bottled water and snacks',
    ],
    importantInfo: [
      'Perfect for resort guests in Barbuda',
      'Flexible start times',
      'Customizable itinerary',
      'Advance booking recommended',
    ],
    gallery: [
      '/images/BarbudaLeisureTours-3.webp',
      '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
      '/images/BarbudaLeisureTours-7.webp',
      '/images/Pink-Beach-North.webp',
      '/images/BarbudaLeisureTours-6.webp',
    ],
  },

  // Shared Adventures
  {
    slug: 'excellence-barbuda-by-sea',
    title: 'Excellence Catamaran',
    subtitle: 'Premium Sailing Experience',
    description:
      'Join us on the Excellence catamaran for a luxurious journey to Barbuda. This premium vessel offers comfort, style, and exceptional service. Available Fridays from May to October, this shared charter provides an upscale experience at a great value. Ages 5 and up only.',
    heroImage: '/images/BarbudaLeisureTours-3-2.webp',
    duration: 'Full Day (7-8 hours)',
    price: 'From $190',
    priceDetails: {
      adult: 190,
      child: 140,
    },
    transport: 'Premium Catamaran',
    difficulty: 'Easy',
    category: 'shared',
    highlights: [
      'Premium Excellence catamaran',
      'Spacious comfortable seating',
      'Full bar service',
      'Gourmet lunch options',
      'Professional crew',
      'Small group atmosphere',
    ],
    included: [
      'Round-trip catamaran cruise',
      'Open bar',
      'Gourmet lunch',
      'Snorkeling equipment',
      'Professional crew',
      'Beach time',
    ],
    importantInfo: [
      'Available Fridays only',
      'Seasonal: May to October',
      'Ages 5 and up only',
      'Advanced booking required',
      'Weather dependent',
    ],
    badge: 'Seasonal',
    gallery: [
      '/images/BarbudaLeisureTours-3-2.webp',
      '/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp',
      '/images/Pink-Beach-North.webp',
      '/images/DSC3331.webp',
      '/images/BarbudaLeisureTours-6.webp',
    ],
  },
  {
    slug: 'shared-boat-charter',
    title: 'Shared Boat Charter',
    subtitle: 'Small Group Adventure',
    description:
      'Share the adventure with fellow travelers on our luxury boat charter. Perfect for solo travelers and small groups seeking a more intimate experience. Limited to 6-10 guests for a semi-private feel at a shared charter price. Enjoy personalized service and gourmet dining options.',
    heroImage: '/images/BarbudaLeisureTours-7.webp',
    duration: 'Full Day (6-7 hours)',
    price: 'From $310',
    priceDetails: {
      adult: 310,
      child: 230,
    },
    transport: 'Luxury Boat',
    difficulty: 'Easy',
    category: 'shared',
    highlights: [
      'Small group (6-10 guests)',
      'Semi-private atmosphere',
      'Luxury vessel',
      'Gourmet meal options',
      'Personalized service',
      'Flexible itinerary',
    ],
    included: [
      'Round-trip boat charter',
      'Gourmet lunch',
      'Premium beverages',
      'Snorkeling equipment',
      'Professional captain and crew',
      'Beach setup',
    ],
    importantInfo: [
      'Limited to 6-10 guests',
      '$20 deposit required',
      'Customizable menu options',
      'Advanced booking required',
    ],
    gallery: [
      '/images/BarbudaLeisureTours-7.webp',
      '/images/BarbudaLeisureTours-8.webp',
      '/images/Pink-Beach-North.webp',
      '/images/DSCF5666-2.webp',
      '/images/BarbudaLeisureTours-4.webp',
    ],
  },

  // Private Charters
  {
    slug: 'helicopter-adventure',
    title: 'Helicopter Charter',
    subtitle: 'Ultimate Luxury Experience',
    description:
      'Experience Barbuda from the sky with our exclusive helicopter charter. Fully customizable itinerary for the ultimate VIP experience. Enjoy breathtaking aerial views, quick transport, and the flexibility to create your perfect day. Ideal for special occasions, photography, or those seeking the ultimate luxury.',
    heroImage: '/images/BarbudaLeisureTours-3.webp',
    duration: 'Custom (2-8 hours)',
    price: 'From $3,500',
    priceDetails: {
      adult: 3500,
      child: 3500,
    },
    transport: 'Private Helicopter',
    difficulty: 'Easy',
    category: 'private',
    highlights: [
      'Private helicopter charter',
      'Stunning aerial photography',
      'Fully customizable itinerary',
      'VIP service throughout',
      'Multiple landing spots available',
      'Professional pilot',
    ],
    included: [
      'Private helicopter and pilot',
      'Customizable itinerary',
      'Ground coordination',
      'Photography opportunities',
      'Refreshments',
      'Concierge service',
    ],
    importantInfo: [
      'Advance booking required',
      'Weather dependent',
      'Weight restrictions apply',
      'Passport required',
      'Fully customizable',
    ],
    badge: 'Exclusive',
    gallery: [
      '/images/BarbudaLeisureTours-3.webp',
      '/images/Pink-Beach-North.webp',
      '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
      '/images/BarbudaLeisureTours-7.webp',
      '/images/MG_9010.tif.webp',
    ],
  },
  {
    slug: 'yacht-adventure',
    title: 'Private Yacht Charter',
    subtitle: 'Sail in Style',
    description:
      'Charter your own luxury yacht for the day. Completely customizable experience with gourmet catering options and flexible scheduling. Perfect for families, couples, or groups seeking privacy and personalized service. Your captain and crew will ensure an unforgettable day on the water.',
    heroImage: '/images/BarbudaLeisureTours-3-2.webp',
    duration: 'Custom (4-10 hours)',
    price: 'From $1,800',
    priceDetails: {
      adult: 1800,
      child: 1800,
    },
    transport: 'Private Yacht',
    difficulty: 'Easy',
    category: 'private',
    highlights: [
      'Private luxury yacht',
      'Custom itinerary',
      'Gourmet catering available',
      'Full bar service',
      'Water sports equipment',
      'Professional crew',
    ],
    included: [
      'Private yacht charter',
      'Professional captain and crew',
      'Fuel',
      'Standard beverages',
      'Snorkeling equipment',
      'Water toys',
    ],
    importantInfo: [
      'Fully customizable',
      'Gourmet catering available (additional cost)',
      'Flexible departure times',
      'Advance booking required',
      'Perfect for groups up to 12',
    ],
    badge: 'Luxury',
    gallery: [
      '/images/BarbudaLeisureTours-3-2.webp',
      '/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp',
      '/images/Pink-Beach-North.webp',
      '/images/DSC3331.webp',
      '/images/BarbudaLeisureTours-6.webp',
      '/images/BarbudaLeisureTours-8.webp',
    ],
  },
  {
    slug: 'airplane-adventure',
    title: 'Private Airplane Charter',
    subtitle: 'Exclusive Island Access',
    description:
      'Book your own private aircraft for ultimate convenience and comfort. Perfect for groups seeking privacy and flexibility. Enjoy quick transport, comfortable seating, and the ability to set your own schedule. Ideal for families, corporate groups, or anyone wanting exclusive access to paradise.',
    heroImage: '/images/BarbudaLeisureTours-7.webp',
    duration: 'Custom (4-8 hours)',
    price: 'From $2,800',
    priceDetails: {
      adult: 2800,
      child: 2800,
    },
    transport: 'Private Aircraft',
    difficulty: 'Easy',
    category: 'private',
    highlights: [
      'Private aircraft charter',
      'Flexible scheduling',
      'Perfect for groups',
      'Quick convenient travel',
      'Spacious comfortable seating',
      'Custom ground arrangements',
    ],
    included: [
      'Private aircraft and pilot',
      'Round-trip flights',
      'Ground transportation coordination',
      'Flexible timing',
      'Refreshments on board',
    ],
    importantInfo: [
      'Advance booking required',
      'Weight information needed',
      'Passport required',
      'Accommodates up to 9 passengers',
      'Fully customizable ground itinerary',
    ],
    badge: 'Premium',
    gallery: [
      '/images/BarbudaLeisureTours-7.webp',
      '/images/BarbudaLeisureTours-3.webp',
      '/images/Pink-Beach-North.webp',
      '/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp',
      '/images/BarbudaLeisureTours-4.webp',
    ],
  },
]

export function getAllTours(): Tour[] {
  return tours
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug)
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((tour) => tour.featured)
}

export function getToursByCategory(category: Tour['category']): Tour[] {
  return tours.filter((tour) => tour.category === category)
}
