export const siteConfig = {
  name: "Benizer Green Shop",
  tagline: "ORGANIC • NATURAL",
  /** Scrolling banner above the header */
  promoMarquee:
    "Your Health is your Wealth! Starts Now - Organic Wellness + Distributor Rewards",
  description:
    "Premium organic supplements for men, women, and complete wellness with a high-impact distributor opportunity.",
  /** E.164 for wa.me links (Ghana: 0545753721 → 233545753721) */
  whatsappAi: "+233545753721",
  /** Display format for footer / copy */
  whatsappDirect: "0545753721",
  email: "benizergreens@gmail.com",
  social: {
    tiktok: "https://www.tiktok.com/@benizer.green.shop",
    facebook: "https://www.facebook.com/Starlight94.co/",
    instagram: "https://www.instagram.com/benizergreenshp/",
    /** Display handle (profile: benizergreenshp) */
    instagramHandle: "@benizergreenshp",
  },
};

export const categories = [
  "Men",
  "Women",
  "Unisex",
  "Weight Management",
  "Cellular Health",
  "Digestive Health",
] as const;

export type ProductCategory = (typeof categories)[number];

export type Product = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  price: number;
  category: ProductCategory;
  shortBenefit: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  featured: boolean;
  stock: number;
  images: string[];
};

export const products: Product[] = [
  {
    slug: "miira-lanang",
    title: "Advanced Miira-Lanang - Coffee for Men",
    shortTitle: "Miira-Lanang",
    tagline: "Feel the Energy. Embrace the Balance.",
    price: 450,
    category: "Men",
    shortBenefit: "Supports energy, stamina, and male vitality",
    ingredients: ["Tongkat Ali", "Maca Root", "Ginseng", "Arabica Coffee"],
    benefits: [
      "Supports stamina and endurance for demanding days",
      "Helps improve natural energy and focus",
      "Promotes healthy male vitality and confidence",
      "Formulated for daily wellness and performance",
    ],
    usage: "Mix one sachet with warm water once daily, preferably in the morning.",
    featured: true,
    stock: 100,
    images: ["/products/miira-lanang-1.jpg"],
  },
  {
    slug: "miira-wedok",
    title: "Advanced Miira-Wedok - Coffee for Women",
    shortTitle: "Miira-Wedok",
    tagline: "Radiance, Balance, and Everyday Confidence.",
    price: 450,
    category: "Women",
    shortBenefit: "Supports women wellness, glow, and daily vitality",
    ingredients: ["Collagen", "Pomegranate", "Ginseng", "Arabica Coffee"],
    benefits: [
      "Supports natural beauty and skin glow",
      "Helps with hormonal balance and mood support",
      "Promotes sustained daily energy",
      "Designed for modern women on the go",
    ],
    usage: "Mix one sachet in warm water once per day after breakfast.",
    featured: true,
    stock: 120,
    images: ["/products/miira-wedok-1.jpg"],
  },
  {
    slug: "miira-curve",
    title: "Advanced Miira-Curve - Weight Management",
    shortTitle: "Miira-Curve",
    tagline: "Shape Your Wellness Journey Naturally.",
    price: 700,
    category: "Weight Management",
    shortBenefit: "Supports healthy weight and appetite balance",
    ingredients: ["L-Carnitine", "Green Tea Extract", "Garcinia Cambogia"],
    benefits: [
      "Supports healthy metabolism and fat utilization",
      "Helps reduce cravings and overeating",
      "Improves energy during weight-management routines",
      "Pairs well with lifestyle and exercise plans",
    ],
    usage: "Take one sachet before breakfast and hydrate throughout the day.",
    featured: true,
    stock: 90,
    images: ["/products/miira-curve-1.jpg"],
  },
  {
    slug: "miira-cell-plus",
    title: "Advanced Miira-Cell+ - Cellular Regeneration",
    shortTitle: "Miira-Cell+",
    tagline: "Restore from Within. Age with Confidence.",
    price: 700,
    category: "Cellular Health",
    shortBenefit: "Supports anti-aging and cellular wellness",
    ingredients: ["CoQ10", "Resveratrol", "Vitamin C", "Omega Complex"],
    benefits: [
      "Supports cellular renewal and longevity",
      "Helps fight oxidative stress",
      "Promotes skin elasticity and healthy aging",
      "Supports immune resilience and recovery",
    ],
    usage: "Take one serving daily with food for best absorption.",
    featured: false,
    stock: 80,
    images: ["/products/miira-cell-plus-1.jpg"],
  },
  {
    slug: "miira-phyll",
    title: "Advanced Miira-Phyll - Digestive Health and Detox",
    shortTitle: "Miira-Phyll",
    tagline: "Cleanse Gently. Feel Light. Live Vibrant.",
    price: 450,
    category: "Digestive Health",
    shortBenefit: "Supports digestion, gut health, and natural detox",
    ingredients: ["Chlorophyll", "Probiotics", "Peppermint", "Fiber Blend"],
    benefits: [
      "Supports gentle detox and digestive comfort",
      "Promotes better gut balance and regularity",
      "Helps reduce bloating and heaviness",
      "Supports daily freshness and vitality",
    ],
    usage: "Mix one serving in water once daily, preferably in the evening.",
    featured: false,
    stock: 110,
    images: ["/products/miira-phyll-1.jpg"],
  },
  {
    slug: "miira-coffee",
    title: "Miira Coffee - Functional Wellness Coffee",
    shortTitle: "Miira Coffee",
    tagline: "Wellness in a Cup.",
    price: 600,
    category: "Unisex",
    shortBenefit: "Arabica coffee with botanicals for energy, focus, and daily balance",
    ingredients: [
      "Arabica coffee",
      "Fingerroot extract",
      "Mangosteen skin extract",
      "Black seed powder",
      "Dates powder",
    ],
    benefits: [
      "Natural energy and mental clarity from quality coffee and botanicals",
      "Antioxidant support for everyday wellness",
      "May help with digestion and metabolism as part of a healthy routine",
      "Convenient sachets for on-the-go use",
      "Designed as a functional beverage, not just ordinary coffee",
    ],
    usage:
      "Mix one sachet with hot water, stir, and enjoy. Follow any guidance from your healthcare provider for your situation.",
    featured: true,
    stock: 85,
    images: ["/products/miira-coffee-1.png"],
  },
  {
    slug: "miira-life",
    title: "Miira-life - Immune & Vitality Support",
    shortTitle: "Miira-life",
    tagline: "Vitality for Your Life.",
    price: 700,
    category: "Cellular Health",
    shortBenefit: "Wellness supplement for vitality, immune support, and everyday balance",
    ingredients: [
      "Seracol-G.Pink (mixed berry)",
      "Black ginger extract",
      "Bird's nest extract",
      "Apple stem cell",
      "Moringa extract",
      "Rock salt",
      "Wolfberry extract",
    ],
    benefits: [
      "Designed to boost vitality and support immune health alongside diet and lifestyle",
      "Black ginger, moringa, wolfberry, and bird's nest are traditionally associated with antioxidant and nutrient support",
      "Apple stem cell and botanicals complement cellular wellness goals",
      "Formulated for daily use; adults often take 1–2 sachets daily per label guidance",
      "Can generally pair with other Miira-care style products when spaced 30–60 minutes apart",
    ],
    usage:
      "From age 4: often ½–1 sachet daily; adults 18+: commonly 1–2 sachets daily. Always follow the product label and consult a healthcare professional—especially for children, pregnancy, or breastfeeding.",
    featured: true,
    stock: 80,
    images: ["/products/miira-life-1.png"],
  },
  {
    slug: "edg3-plus",
    title: "EDG3 Plus - Immune & Vitality Beverage",
    shortTitle: "EDG3 Plus",
    tagline: "The Power of Three—Turmeric, Vitamin D3 & Glutathione Support.",
    price: 850,
    category: "Cellular Health",
    shortBenefit: "Multi-functional drink for immunity, energy, and whole-body support",
    ingredients: ["Turmeric", "Glutathione amino acid blend (precursors)", "Vitamin D3"],
    benefits: [
      "Supports immune resilience and cellular protection",
      "Helps manage oxidative stress alongside diet and lifestyle",
      "Supports energy, vitality, and cardiovascular wellness goals",
      "Aids digestion and detoxification pathways for many users",
      "Halal, GMP, and HACCP positioning on official formulation",
    ],
    usage:
      "Normal wellness: mix one sachet in 120ml water, stir, and drink—often five days per week before meals. For tailored use, follow label or practitioner advice.",
    featured: true,
    stock: 75,
    images: ["/products/edg3-plus-1.webp"],
  },
  {
    slug: "amezcua-bio-disc-3",
    title: "Amezcua Bio Disc 3 - Structured Water & Energy Wellness",
    shortTitle: "Amezcua Bio Disc 3",
    tagline: "Energized Health Made Simple.",
    price: 2500,
    category: "Unisex",
    shortBenefit: "Glass wellness disc to structure water and support home vitality",
    ingredients: ["Energized glass disc with granulated crystal matrix", "Protective silicone shield (included)"],
    benefits: [
      "Restructures and energizes drinking water for daily hydration rituals",
      "May help prolong freshness of produce when used as directed",
      "Supports a holistic lifestyle—kitchen, plants, and living spaces",
      "Portable—use with bottles, cups, or in the refrigerator",
      "Recognized in Amezcua materials for harmonizing subtle energy in the environment",
    ],
    usage:
      "Place beverages on the disc for the recommended time, use in the fridge for produce, or follow the five integration tips from the official Bio Disc 3 guide.",
    featured: true,
    stock: 25,
    images: ["/products/amezcua-bio-disc-3-1.png"],
  },
];

export const trustIndicators = [
  "100% Natural Ingredients",
  "Premium Quality Formulations",
  "Trusted by Customers",
  "Ghana-Based Support",
];

/** Distributor starter tiers (aligned with homepage package cards). */
export const distributorPackageTiers = ["starter", "bronze", "silver", "gold"] as const;
export type DistributorPackageTier = (typeof distributorPackageTiers)[number];

export type DistributorPackage = {
  tier: DistributorPackageTier;
  /** Membership tier label */
  name: string;
  /** Price in GHS (₵) */
  price: number;
  /** Short tier tagline */
  blurb: string;
  /** Reference USD from membership graphic */
  usdApprox: number;
  /** Number of product boxes included */
  boxes: number;
  /** Point value (PV) */
  pv: number;
  /** Highlight on card (e.g. Gold tier) */
  bestValue?: boolean;
};

export const distributorPackages: DistributorPackage[] = [
  {
    tier: "starter",
    name: "Starter",
    price: 780,
    blurb: "Start strong",
    usdApprox: 65,
    boxes: 1,
    pv: 50,
  },
  {
    tier: "bronze",
    name: "Bronze",
    price: 1440,
    blurb: "Build momentum",
    usdApprox: 120,
    boxes: 2,
    pv: 100,
  },
  {
    tier: "silver",
    name: "Silver",
    price: 7200,
    blurb: "Scale up",
    usdApprox: 600,
    boxes: 10,
    pv: 500,
  },
  {
    tier: "gold",
    name: "Gold",
    price: 14400,
    blurb: "Maximum value",
    usdApprox: 1200,
    boxes: 20,
    pv: 1000,
    bestValue: true,
  },
];

export type SiteTestimonial = {
  quote: string;
  name: string;
  /** Avatar initials */
  initial: string;
  /** Short line under name (e.g. location) */
  tagline?: string;
  /** Optional link shown after tagline/subtitle */
  href?: string;
  linkLabel?: string;
};

export const siteTestimonials: SiteTestimonial[] = [
  {
    quote:
      "Benizer products helped me regain energy and confidence in my daily life.",
    name: "Ama Serwaa",
    initial: "AS",
    tagline: "Verified customer · Greater Accra",
  },
  {
    quote:
      "I joined as a distributor and the support system made it easy to start earning.",
    name: "Innocen Golden",
    initial: "IG",
    tagline: "Founder",
    href: "https://buildwithinnocent.com",
    linkLabel: "buildwithinnocent.com",
  },
];
