// Transport requirements for booking form
export interface TransportRequirements {
  requiresPassport?: boolean
  requiresBodyWeight?: boolean
}

// Booking restrictions for tours
export interface BookingRestrictions {
  minAge?: number
  daysOfWeek?: number[]       // 0=Sunday, 1=Monday, ... 5=Friday, 6=Saturday
  seasonStart?: string         // 'MM-DD' format or ISO date string
  seasonEnd?: string           // 'MM-DD' format or ISO date string
  minGuests?: number
  maxGuests?: number
}

// Tour-specific meal upgrade pricing (overrides defaults)
export interface MealUpgradePricing {
  lobster?: number
  fish?: number
  conch?: number
  shrimp?: number
  vegetarian?: number
}

export interface Tour {
  slug: string
  title: string
  subtitle?: string
  description: string
  heroImage?: string
  duration: string
  price: string
  groupSize: string
  difficulty?: string
  included: string[]
  highlights?: string[]
  gallery?: string[]
  featured?: boolean
  category: 'signature' | 'local' | 'shared' | 'private'

  // Pricing breakdown
  pricing?: {
    adult: number
    child?: number
    infant?: number
    currency: string
    notes?: string
  }

  // Schedule information
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

  // Lunch upgrade options
  lunchUpgrades?: {
    name: string
    price: number
  }[]

  // What to bring
  whatToBring?: string[]

  // Important information
  importantInfo?: string[]

  // Age restrictions
  ageRestrictions?: string

  // Aircraft/transport details
  transportDetails?: string[]

  // Partner operated
  partnerOperated?: boolean
  partnerName?: string

  // Minimum group size
  minimumGuests?: number

  // Booking form configuration (auto-configures booking form based on tour)
  transportMethod?: 'air' | 'sea' | 'helicopter' | 'yacht' | 'airplane'
  tourType?: 'discover-air' | 'discover-sea' | 'sky-sea' | 'beach-escape' | 'already-in-barbuda' | 'excellence' | 'shared-boat' | 'private-helicopter' | 'private-yacht' | 'private-airplane'
  transportRequirements?: TransportRequirements
  bookingRestrictions?: BookingRestrictions
  mealUpgradePricing?: MealUpgradePricing
}

// All tours - Barbuda Leisure Day Tours 2025-2026
const tours: Tour[] = [
  {
    slug: 'discover-barbuda-by-air',
    title: 'Discover Barbuda by Air',
    subtitle: 'Experience Barbuda from Above - A Journey Like No Other',
    category: 'signature',
    description: `Take a flight across the Caribbean Sea and discover Barbuda's unspoiled beauty from a bird's-eye view. In just 20 minutes, you'll arrive on one of the most breathtaking islands in the Caribbean - home to pink-sand beaches, turquoise lagoons, and the world's largest Frigate Bird Sanctuary. This signature tour is ideal for those who prefer a comfortable, scenic, and time-efficient way to explore Barbuda.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-7.jpg',
    duration: 'Approximately 8-9 hours total',
    price: 'From $349 per person',
    groupSize: 'Small groups',
    pricing: {
      adult: 349,
      child: 249,
      infant: 99,
      currency: 'USD',
      notes: 'Infants must sit on an adult\'s lap during flight',
    },
    schedule: {
      departure: '7:15 AM',
      arrival: '7:35 AM',
      returnDeparture: '4:30 PM',
      returnArrival: '4:50 PM',
      checkInTime: 'One hour and 15 minutes before departure',
      location: 'V.C. Bird International Airport',
      notes: 'Flight times may vary slightly depending on weather and operational conditions',
    },
    included: [
      'Round-trip flights between Antigua and Barbuda',
      'Pick-up and drop-off from Barbuda International Airport',
      'Fully guided sightseeing tour',
      'Frigate Bird Sanctuary and Pink Sand Beach (water taxi ride included)',
      'Martello Tower',
      'Two Foot Bay National Park',
      'Princess Diana Beach (leisure time)',
      'BBQ Chicken Lunch',
      'Bottled water during the tour'
    ],
    lunchUpgrades: [
      { name: 'Fish, Conch, or Shrimp', price: 10 },
      { name: 'Lobster', price: 15 },
      { name: 'Vegetarian Meal', price: 5 }
    ],
    transportDetails: [
      'J8-VBL Islander',
      'J8-CRU Twin Otter',
      'J8-VBK',
      'Dash-8',
      'ATR-42'
    ],
    whatToBring: [
      'Valid passport or government-issued ID (same used when booking)',
      'Sunscreen, hat, and sunglasses',
      'Swimwear and towel',
      'Comfortable clothing and footwear',
      'Camera or smartphone for photos',
      'Light snacks or preferred beverages',
      'Reusable water bottle (water also provided)',
      'Umbrella (recommended)'
    ],
    importantInfo: [
      'Please check in at V.C. Bird International Airport no later than one hour and 15 minutes before your flight\'s departure',
      'Bring the same ID or passport used during booking - required for check-in',
      'Flight availability is limited - book early to secure your seats',
      'Weather conditions may affect tour timing. In the event of cancellation, guests will be fully refunded or rescheduled',
      'Transportation to and from your hotel, towels and snorkeling gears are not included in the tour package',
      'Guests will receive a detailed tour itinerary & weather forecast 24 hours prior to departure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/MG_6762.tif-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_1963_Edited-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/100_6287-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/grill-mangrove-snapper-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/BELLE-BarbudaBelle-1505JMR7800-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/1-2-300x300.webp'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'air',
    tourType: 'discover-air',
    transportRequirements: {
      requiresPassport: true,
      requiresBodyWeight: false,
    },
  },

  {
    slug: 'discover-barbuda-by-sea',
    title: 'Discover Barbuda by Sea',
    subtitle: 'Sail Across the Caribbean Sea to Discover Barbuda',
    category: 'signature',
    description: `Sail across the Caribbean Sea to discover Barbuda aboard a scenic ferry from Antigua and spend the day exploring one of the Caribbean's most untouched islands. From the world-famous Pink Sand Beach to the breathtaking Frigate Bird Sanctuary, this tour combines adventure, culture, and relaxation - a perfect way to experience Barbuda's natural beauty at an affordable rate.`,
    heroImage: '/images/downloaded/Pink-Beach-North-scaled.jpg',
    duration: 'Approximately 6-7 hours total',
    price: 'From $249 per person',
    groupSize: 'Groups welcome',
    pricing: {
      adult: 249,
      child: 199,
      infant: 99,
      currency: 'USD',
      notes: 'Infants must sit on an adult\'s lap',
    },
    schedule: {
      departure: '6:30 AM',
      arrival: '8:00 AM',
      returnDeparture: '3:00 PM',
      returnArrival: '4:30 PM',
      checkInTime: '6:00 AM',
      location: 'Heritage Quay Ferry Terminal',
      notes: '90-minute crossing each way - schedule may vary based on weather and ferry operations',
    },
    included: [
      'Round-trip ferry transportation between Antigua and Barbuda',
      'Pick-up and drop-off from Barbuda\'s ferry dock',
      'Guided sightseeing tour',
      'Frigate Bird Sanctuary and Pink Sand Beach (water taxi included)',
      'Martello Tower',
      'Two Foot Bay National Park',
      'Princess Diana Beach (relaxation time)',
      'BBQ Chicken Lunch',
      'Bottled water during the tour'
    ],
    lunchUpgrades: [
      { name: 'Fish, Conch, or Shrimp', price: 10 },
      { name: 'Lobster', price: 15 },
      { name: 'Vegetarian Meal', price: 5 }
    ],
    whatToBring: [
      'Passport or government-issued ID',
      'Hat, sunscreen, and sunglasses',
      'Swimwear and towel',
      'Comfortable shoes and light clothing',
      'Camera or smartphone',
      'Light snacks or preferred beverages',
      'Seasickness medication (recommended for sensitive travelers)',
      'Reusable water bottle (water also provided)',
      'Umbrella (recommended)'
    ],
    importantInfo: [
      'Check-in for the ferry at Heritage Quay Ferry Pier by 6:00 AM',
      'Weather conditions can affect sea travel; rescheduling or refunds will be offered if necessary',
      'The ferry ride can be bumpy on rough days - this tour may not be ideal for those prone to motion sickness',
      'Transportation to and from your hotel, towels and snorkeling gears are not included in the tour package',
      'Guests will receive a detailed tour itinerary & weather forecast 24 hours prior to departure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-8-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_1963_Edited-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-13-300x300.jpg'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'sea',
    tourType: 'discover-sea',
    transportRequirements: {
      requiresPassport: false,
      requiresBodyWeight: false,
    },
  },

  {
    slug: 'barbuda-sky-sea-adventure',
    title: 'Barbuda Sky & Sea Adventure',
    subtitle: 'The Ultimate Way to Experience Barbuda - Fly In, Cruise Back',
    category: 'signature',
    description: `This signature tour offers the best of both worlds - a flight to Barbuda in the morning and a return ferry in the afternoon. Enjoy a smooth 20-minute scenic flight over the Caribbean Sea followed by an unforgettable day of exploration, sightseeing, and relaxation before sailing back to Antigua.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-3-2.jpg',
    duration: 'Approximately 6-7 hours',
    price: 'From $299 per person',
    groupSize: 'Small groups',
    pricing: {
      adult: 299,
      child: 229,
      infant: 99,
      currency: 'USD',
      notes: 'Infants on adult\'s lap',
    },
    schedule: {
      departure: '7:00 AM',
      arrival: '7:20 AM',
      returnDeparture: '3:00 PM',
      returnArrival: '4:30 PM',
      checkInTime: 'One hour and 15 minutes before departure for flight',
      location: 'V.C. Bird International Airport',
      notes: 'Combining flight and ferry return',
    },
    included: [
      'One-way flight Antigua to Barbuda',
      'Return ferry Barbuda to Antigua',
      'Guided sightseeing tour with local expert',
      'Frigate Bird Sanctuary',
      'Pink Sand Beach',
      'Martello Tower',
      'Two Foot Bay National Park',
      'Princess Diana Beach',
      'BBQ Chicken Lunch',
      'Bottled water during the tour'
    ],
    lunchUpgrades: [
      { name: 'Fish, Conch, or Shrimp', price: 10 },
      { name: 'Lobster', price: 15 },
      { name: 'Vegetarian Meal', price: 5 }
    ],
    whatToBring: [
      'Passport (required for flight check-in)',
      'Hat, sunscreen, and sunglasses',
      'Swimwear and towels',
      'Comfortable footwear',
      'Camera or phone',
      'Light snacks or preferred beverages'
    ],
    importantInfo: [
      'Check-in for flight at V.C. Bird International Airport no later than one hour and 15 minutes before departure',
      'Check-in for the ferry 30 minutes before departure',
      'Bring the same ID used during booking',
      'Tour includes both air and sea travel; schedule may vary due to weather',
      'The ferry ride can be bumpy on rough days - this tour may not be ideal for those prone to motion sickness',
      'Transportation to and from your hotel, towels and snorkeling gears are not included in the tour package',
      'Guests will receive a detailed tour itinerary & weather forecast 24 hours prior to departure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/MG_6762.tif-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_1963_Edited-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/100_6287-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-8-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'air',
    tourType: 'sky-sea',
    transportRequirements: {
      requiresPassport: true,
      requiresBodyWeight: false,
    },
  },

  {
    slug: 'barbuda-beach-escape',
    title: 'Barbuda Beach Escape',
    subtitle: 'A Relaxing Getaway to Paradise',
    category: 'signature',
    description: `If your idea of paradise is sun, sea, and serenity - this is the tour for you. Fly or sail to Barbuda and spend the day on the island's most famous beach, Princess Diana Beach, where turquoise waters and pink sands await.`,
    heroImage: '/images/downloaded/Pink-Beach-North-scaled.jpg',
    duration: 'Approximately 6-8 hours',
    price: 'From $199 per person',
    groupSize: 'Flexible',
    pricing: {
      adult: 199,
      currency: 'USD',
      notes: 'Pricing varies by transport option: Ferry ($199), Air ($299), Helicopter ($699 based on 6 people), Private Boat ($399 based on 8 people)',
    },
    included: [
      'Round-trip transportation (flight, ferry, helicopter, or private boat)',
      'Taxi pick-up and drop-off from Barbuda airport/ferry dock to Princess Diana Beach',
      'Leisure time for swimming, sunbathing, and exploring',
      'Lunch at beach Grill',
      'Optional lunch arrangements at Nobu Barbuda or Uncle Roddy\'s Beach Bar (additional cost)'
    ],
    whatToBring: [
      'Passport (for air travel) or valid ID',
      'Hat, sunscreen, and sunglasses',
      'Swimwear, towel, and beachwear',
      'Comfortable sandals or flip-flops',
      'Camera or phone',
      'Small cash for lunch or souvenirs'
    ],
    importantInfo: [
      'Guests traveling by air must check in 1 hour and 15 minutes before departure',
      'Lunch at Nobu Barbuda or Uncle Roddy\'s are not included but can be arranged in advance',
      'Bring your own beach towel, sun protection and snorkeling gear'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_1963_Edited-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/100_6287-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-13-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'sea',
    tourType: 'beach-escape',
    transportRequirements: {
      requiresPassport: false,
      requiresBodyWeight: false,
    },
  },

  {
    slug: 'discover-barbuda-local-tour',
    title: 'Discover Barbuda - Local Guided Day Tour',
    subtitle: 'Already in Barbuda? Join Our Local Excursions',
    category: 'local',
    description: `If you're already on the island, you can still experience Barbuda Leisure's guided tours! Join our local excursions featuring sightseeing, beach relaxation, and cultural exploration - available daily upon request. Whether you're staying in a hotel, guesthouse, arriving by your own flight or ferry, or relaxing aboard a private yacht anchored along Barbuda's coastline, you can book a day tour directly with us and enjoy the best of Barbuda in one unforgettable experience.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-6.jpg',
    duration: 'Approximately 6-7 hours total',
    price: 'From $149 per person',
    groupSize: 'Small groups welcome',
    pricing: {
      adult: 149,
      child: 99,
      infant: 29,
      currency: 'USD',
    },
    schedule: {
      departure: '8:30 AM',
      returnArrival: '3:30 PM',
      notes: 'Available daily upon request',
    },
    included: [
      'Taxi pick-up and drop-off from your hotel or private yacht (anchored only at River Wharf or Princess Diana Beach)',
      'Water taxi to the Pink Sand Beach and Frigate Bird Sanctuary',
      'Sightseeing at Two Foot Bay and the Martello Tower',
      'Delicious island-style lunch',
      'Bottled water',
      'Leisure time at Princess Diana Beach'
    ],
    lunchUpgrades: [
      { name: 'Fish, Conch, or Shrimp', price: 10 },
      { name: 'Lobster', price: 15 },
      { name: 'Vegetarian Meal', price: 5 }
    ],
    whatToBring: [
      'Hat, sunscreen, and sunglasses',
      'Swimwear and towel',
      'Comfortable shoes and light clothing',
      'Camera or smartphone',
      'Light snacks or preferred beverages',
      'Seasickness or motion-sickness medication (recommended for sensitive travelers)',
      'Reusable water bottle (water also provided)'
    ],
    importantInfo: [
      'Weather conditions can affect sea travel; rescheduling or refunds will be offered if necessary',
      'Snorkeling gear is not included in the tour package',
      'Guests will receive a detailed tour itinerary and weather forecast 24 hours prior to departure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-8-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_1963_Edited-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-13-300x300.jpg'
    ],
    featured: false,
    // Booking form configuration
    transportMethod: 'sea',
    tourType: 'already-in-barbuda',
    transportRequirements: {
      requiresPassport: false,
    },
  },

  {
    slug: 'excellence-barbuda-by-sea',
    title: 'Excellence Barbuda by Sea',
    subtitle: 'A Spectacular Day Adventure to Paradise',
    category: 'shared',
    description: `Embark on an unforgettable journey to Barbuda aboard Excellence, a luxury power catamaran designed for comfort, relaxation, and discovery. This exclusive day tour, available only on Fridays from May to October, offers the perfect blend of adventure, nature, and Caribbean charm. Cruise along Low Bay's 17-mile beach, marvel at pink-sand pockets, and spot turtle tracks during nesting season. Step ashore via the Excellence's drop-stair gangway and explore the warm, turquoise shallows. Your day continues with a Frigate Bird Sanctuary tour guided by local experts, followed by a relaxing lunch onboard before heading to Princess Diana Beach - where you can swim, sunbathe, and savor pure Caribbean tranquility.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-7.jpg',
    duration: '7 hours',
    price: 'From $190 per person',
    groupSize: 'Group tour',
    pricing: {
      adult: 190,
      child: 120,
      currency: 'USD',
      notes: 'Children 5-12 years. Not suitable for children under 5 years old',
    },
    schedule: {
      departure: '9:00 AM',
      checkInTime: '8:15 AM',
      frequency: 'Fridays only (October to May)',
      notes: 'Enjoy a scenic 90-minute sea crossing to Barbuda',
    },
    included: [
      'Professional Captain & Crew',
      'Open Bar featuring beer, rum punch, sodas, and water',
      'Two long beach stops for swimming and sunbathing',
      'Guided Frigate Bird Sanctuary Tour with local experts',
      'Caribbean-style lunch (grilled chicken and fish with local sides)',
      'Round-trip sea crossing (90 minutes each way)',
      'Visit to Low Bay - the island\'s longest beach with sea turtle tracks',
      'Stop at Princess Diana Beach'
    ],
    whatToBring: [
      'Sunscreen / Sunblock',
      'Beach Towel',
      'Spending Money for souvenirs or extra refreshments'
    ],
    importantInfo: [
      'This tour is not suitable for pregnant women or anyone with back or neck conditions',
      'Children under 5 years old are not permitted on this tour',
      'Available only on Fridays from May to October'
    ],
    ageRestrictions: 'Not suitable for pregnant women, those with back or neck conditions, or children under 5 years old',
    partnerOperated: true,
    partnerName: 'Excellence Tours',
    gallery: [
      '/images/excellence/DJI_0918.jpg',
      '/images/excellence/exclnce-10.jpg',
      '/images/excellence/exclnce-25.jpg',
      '/images/excellence/exclnce-27.jpg',
      '/images/excellence/exclnce-27 (1).jpg',
      '/images/excellence/LobsterLunch-3.jpg'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'sea',
    tourType: 'excellence',
    transportRequirements: {
      requiresPassport: false,
      requiresBodyWeight: false,
    },
    bookingRestrictions: {
      minAge: 5,
      daysOfWeek: [5],
      seasonStart: '10-01',
      seasonEnd: '05-31',
    },
  },

  {
    slug: 'shared-barbuda-boat-charter',
    title: 'Shared Barbuda Boat Charter',
    subtitle: 'A Fun, Social, and Scenic Way to Experience Barbuda',
    category: 'shared',
    description: `Looking for a fun, social, and scenic way to experience Barbuda? Join our Shared Barbuda Charter by our partners - a small-group adventure that combines comfort, breathtaking views, and authentic island hospitality. Enjoy a full day exploring Barbuda's pristine beaches, snorkeling in turquoise waters, and savoring a freshly grilled island-style lunch.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-4.jpg',
    duration: 'Full day (approximately 8 hours)',
    price: 'From $310 per person',
    groupSize: 'Small groups (6-10 guests)',
    pricing: {
      adult: 310,
      child: 220,
      infant: 75,
      currency: 'USD',
      notes: 'Ages 6-12 ($220), Ages 3-5 ($75), 2 and under (Free). US$20 deposit per person required for booking',
    },
    schedule: {
      departure: '9:00 AM (Jolly Harbour) / 9:30 AM (Dickenson Bay)',
      returnArrival: '5:00 PM - 5:30 PM',
      notes: 'Crossing duration: 1 hour 10 minutes to 1 hour 25 minutes depending on sea conditions',
    },
    included: [
      'Round-trip boat transportation between Antigua and Barbuda',
      'Professional crew and guide for the day',
      'Cooler stocked with complimentary drinks: water, sodas, beer, rum, rosé, and Prosecco',
      'Towels and snorkeling gear provided',
      'Island-style lunch freshly prepared (Grilled Chicken or Grilled Lobster)',
      'Visits to Spanish Point, Coco Point, Princess Diana Beach, and Palmetto Point (time permitting)',
      'Side dishes: rice & peas, macaroni salad, sweet potato salad, plantains, or local ground provisions'
    ],
    lunchUpgrades: [
      { name: 'Grilled Lobster', price: 25 },
      { name: 'Grilled Chicken Wings', price: 20 }
    ],
    importantInfo: [
      'Minimum of 6 people required for the trip to operate (up to 10 guests maximum)',
      'Weather Policy: If sea conditions are unsafe, the trip will be rescheduled or moved to an alternate Antigua-based experience',
      'Motion Sickness: The boats are fast and comfortable, but conditions can be choppy. If you are prone to seasickness, we recommend taking motion sickness medication prior to departure',
      'Cancellation Policy: 50% fee applies unless canceled at least 48 hours in advance',
      'The exact itinerary and stops may vary depending on weather and sea conditions'
    ],
    partnerOperated: true,
    partnerName: 'Local Charter Partners',
    minimumGuests: 6,
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_7042-300x200.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg'
    ],
    featured: true,
    // Booking form configuration
    transportMethod: 'sea',
    tourType: 'shared-boat',
    transportRequirements: {
      requiresPassport: false,
      requiresBodyWeight: false,
    },
    bookingRestrictions: {
      minGuests: 6,
      maxGuests: 10,
    },
    mealUpgradePricing: {
      lobster: 25,
    },
  },

  {
    slug: 'barbuda-exclusive-helicopter',
    title: 'Barbuda Exclusive: Helicopter Adventure',
    subtitle: 'Experience Barbuda Like Never Before',
    category: 'private',
    description: `Experience Barbuda like never before with our luxury private helicopter adventure - the most exclusive way to discover the island's untouched beauty. Whether you're dreaming of a romantic lunch escape, a sun-kissed beach picnic, or an extended day of exploration among Barbuda's pink-sand shores and natural wonders, we'll design a custom itinerary just for you. From the moment you lift off from Antigua, every detail is crafted for comfort, privacy, and unforgettable views of the Caribbean Sea below.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-8.jpg',
    duration: 'Flexible (customizable)',
    price: 'From $3,500',
    groupSize: 'Private charter',
    pricing: {
      adult: 3500,
      currency: 'USD',
      notes: 'Starting price for private helicopter charter. Fully customizable itinerary',
    },
    included: [
      'Private helicopter charter',
      'Professional pilot',
      'Customized itinerary',
      'Scenic aerial views',
      'Beach landing access',
      'Flexible scheduling'
    ],
    importantInfo: [
      'This is more than a trip - it\'s an experience made for those who believe paradise should be personalized',
      'Custom itinerary designed based on your preferences',
      'Contact us to discuss your specific requirements and preferences'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-09-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/MG_6762.tif-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/DSC3121-300x199.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/BELLE-BarbudaBelle-1505JMR6691-300x190.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-300x300.jpg'
    ],
    featured: false,
    // Booking form configuration
    transportMethod: 'helicopter',
    tourType: 'private-helicopter',
    transportRequirements: {
      requiresPassport: true,
      requiresBodyWeight: true,
    },
  },

  {
    slug: 'barbuda-exclusive-yacht',
    title: 'Barbuda Exclusive: Yacht Adventure',
    subtitle: 'Set Sail in Style - Discover Barbuda, Your Way',
    category: 'private',
    description: `Embark on one of our most sought-after experiences - the Barbuda Exclusive Yacht Adventure, where luxury meets the open sea. Enjoy a private charter across the Caribbean, guided by our professional captain and crew, as you glide effortlessly from Antigua to Barbuda in just 1 hour and 15 minutes. Your unforgettable day can begin with a scenic departure from Dickenson Bay or Jolly Harbour, followed by an island-hopping escape to Barbuda's most breathtaking coastal gems, including Spanish Point, Coco Point, Princess Diana Beach, and Palmetto Point (time permitting), where you may find shimmering pink sand. Relax on deck with a cooler of complimentary drinks - including water, sodas, beer, rum, rosé, and Prosecco - and enjoy the sunshine, sea breeze, and unmatched Caribbean beauty.`,
    heroImage: '/images/downloaded/Allesandra-scaled.jpg',
    duration: 'Full day (flexible)',
    price: 'From $1,800',
    groupSize: 'Private charter',
    pricing: {
      adult: 1800,
      currency: 'USD',
      notes: 'Starting price for private yacht charter',
    },
    included: [
      'Private yacht with professional captain and crew',
      'Round-trip from Dickenson Bay or Jolly Harbour',
      'Cooler of complimentary drinks (water, sodas, beer, rum, rosé, Prosecco)',
      'All snorkeling gear and towels provided',
      'Visits to Spanish Point, Coco Point, Princess Diana Beach, Palmetto Point',
      'Optional add-ons: seafood lunch, BBQ chicken meal, or guided island tour'
    ],
    importantInfo: [
      'Perfect for celebrating special occasions, romantic escapes, or adventure in luxury',
      'Customizable itinerary based on your preferences',
      'Contact us to arrange your private yacht adventure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/IMG_7042-300x200.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-10-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg'
    ],
    featured: false,
    // Booking form configuration
    transportMethod: 'yacht',
    tourType: 'private-yacht',
    transportRequirements: {
      requiresPassport: false,
      requiresBodyWeight: false,
    },
  },

  {
    slug: 'barbuda-exclusive-airplane',
    title: 'Barbuda Exclusive: Airplane Adventure',
    subtitle: 'Elevate Your Escape. Experience Barbuda from Above',
    category: 'private',
    description: `Take your island getaway to new heights with our private aircraft charter from Antigua to Barbuda - designed for those who seek luxury, adventure, and exclusivity in one unforgettable experience. As you soar across the turquoise Caribbean Sea, enjoy breathtaking aerial views of Antigua's coastline and Barbuda's untouched pink-sand beaches below. Every moment of your journey is tailored to perfection, offering comfort, style, and seamless service from takeoff to touchdown. Your Barbuda Exclusive Airplane Adventure is fully customizable - whether you desire a scenic flight, a private beach day, or a private day tour exploring Barbuda's natural wonders and cultural gems. Simply share your preferences, and our team will craft a bespoke itinerary designed precisely to your wishes.`,
    heroImage: '/images/downloaded/BarbudaLeisureTours-12.jpg',
    duration: 'Flexible (half/full day)',
    price: 'From $2,800',
    groupSize: 'Private charter',
    pricing: {
      adult: 2800,
      currency: 'USD',
      notes: 'Starting price for round-trip private aircraft charter',
    },
    included: [
      'Private aircraft charter (round trip)',
      'Professional pilot',
      'Customized itinerary',
      'Scenic aerial views',
      'Flexible scheduling',
      'Options for beach day or guided tour'
    ],
    importantInfo: [
      'Experience the Caribbean\'s most pristine paradise - your way',
      'Fully customizable itinerary based on your preferences',
      'Contact us to book your private air adventure'
    ],
    gallery: [
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-09-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/MG_6762.tif-300x300.webp',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/DSC3121-300x199.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/11/BELLE-BarbudaBelle-1505JMR6691-300x190.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg',
      'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-300x300.jpg'
    ],
    featured: false,
    // Booking form configuration
    transportMethod: 'airplane',
    tourType: 'private-airplane',
    transportRequirements: {
      requiresPassport: true,
      requiresBodyWeight: true,
    },
  },
];

export function getAllTours(): Tour[] {
  return tours
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug)
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((tour) => tour.featured)
}

export function getToursByCategory(category: 'signature' | 'local' | 'shared' | 'private'): Tour[] {
  return tours.filter((tour) => tour.category === category)
}
