export const siteConfig = {
  name: "Benizer Green Shop",
  tagline: "ORGANIC • NATURAL",
  /** Scrolling banner above the header */
  promoMarquee:
    "Your Health is your Wealth! Starts Now - Organic Wellness + Distributor Rewards",
  description:
    "Premium organic supplements for men, women, and complete wellness with a high-impact distributor opportunity.",
  /** Homepage funnel sections (hero, slider, highlights, packages). */
  homePage: {
    heroEyebrow:
      "Organic supplements • Authentic sourcing • Nationwide fulfilment",
    heroTitle: "Wellness clients can feel.",
    heroTitleAccent: "Supply partners can scale.",
    heroLead:
      "Benizer Green Shop equips serious retailers and distributors with authenticated MiiraCare lines, disciplined logistics, and a partnership model engineered for recurring revenue—not one-off excuses.",
    heroPoints: [
      "Clinical-grade storytelling meets lifestyle demand: curated SKUs your buyers reorder with confidence.",
      "Regional fulfilment that respects timelines across Ghana—ideal for flagship clinics, boutiques, and growing teams.",
      "Distributor economics that compound: structured bundles, onboarding guidance, and upside as loyal accounts mature.",
    ],
    primaryCta: "Shop the catalogue",
    secondaryCta: "Partner as a distributor",
    transformTitle: "Transform your future",
    discountBandEyebrow: "Member pricing",
    discountBandTitle: "Get 40% distributor pricing on product bundles!",
    discountBandSubtitle:
      "Become a registered Benizer distributor today and buy your boxes for less—plus earn on referrals.",
    discountBandCta: "Join the distributor program",
    packagesIntroTitle: "Become a distributor",
    packagesIntroSubtitle: "Pick a starter package and unlock better rates on every restock.",
  },
  /** E.164 for wa.me links (Ghana: 0545753721 → 233545753721) */
  whatsappAi: "+233545753721",
  /** Display format for footer / copy */
  whatsappDirect: "0545753721",
  email: "benizergreens@gmail.com",
  social: {
    tiktok: "https://www.tiktok.com/@benizer.green.shop",
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
    slug: "miira-cell-plus",
    title: "Advanced Miira-Cell+ - Cellular Regeneration",
    shortTitle: "Miira-Cell+",
    tagline: "Restore from Within. Age with Confidence.",
    price: 700,
    category: "Cellular Health",
    shortBenefit: "Supports anti-aging and cellular wellness",
    ingredients: [
      "Soursop juice powder",
      "Kiwi juice powder",
      "Pomegranate extract",
      "Klamath algae (AFA)",
      "Collagen (fish)",
      "Bee propolis",
      "Ashwagandha extract",
      "Apple stem cells",
      "Salmon ovary peptide",
      "Goji berry",
      "Bilberry extract",
    ],
    benefits: [
      "Supports cellular renewal and longevity",
      "Helps fight oxidative stress",
      "Promotes skin elasticity and healthy aging",
      "Supports immune resilience and recovery",
    ],
    usage:
      "General wellness: take 1 sachet under the tongue daily.",
    featured: false,
    stock: 80,
    images: ["/products/miira-cell-plus-1.jpg"],
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
      "Wolfberry extract",
      "Black ginger extract",
      "Mixed berries",
      "Rock salt",
      "Apple stem cell",
      "Bird's nest extract",
      "Moringa extract",
    ],
    benefits: [
      "Designed to boost vitality and support immune health alongside diet and lifestyle",
      "Black ginger, moringa, wolfberry, and bird's nest are traditionally associated with antioxidant and nutrient support",
      "Apple stem cell and botanicals complement cellular wellness goals",
      "Formulated for daily use per label guidance",
      "Can generally pair with other Miira-care style products when spaced 30–60 minutes apart",
    ],
    usage: "Take 1 sachet orally once or twice daily.",
    featured: true,
    stock: 80,
    images: ["/products/miira-life-1.png"],
  },
  {
    slug: "miira-curve",
    title: "Advanced Miira-Curve - Weight Management",
    shortTitle: "Miira-Curve",
    tagline: "Shape Your Wellness Journey Naturally.",
    price: 700,
    category: "Weight Management",
    shortBenefit: "Supports healthy weight and appetite balance",
    ingredients: [
      "Natural extracts: Garcinia cambogia, Hoodia gordonii, African mango, Guarana, Goji berry, Acai berry, Maqui berry",
      "Banana juice powder",
      "Cocoa powder",
      "L-Carnitine",
      "Inulin",
    ],
    benefits: [
      "Supports healthy metabolism and fat utilization",
      "Helps reduce cravings and overeating",
      "Improves energy during weight-management routines",
      "Pairs well with lifestyle and exercise plans",
    ],
    usage: "Take one sachet (2.5g) daily.",
    featured: true,
    stock: 90,
    images: ["/products/miira-curve-1.jpg"],
  },
  {
    slug: "miira-phyll",
    title: "Advanced Miira-Phyll - Natural Digestive and Detox Solution",
    shortTitle: "Miira-Phyll",
    tagline: "Cleanse Gently. Feel Light. Live Vibrant.",
    price: 450,
    category: "Digestive Health",
    shortBenefit: "Supports digestion, gut health, and natural detox",
    ingredients: [
      "Psyllium husk",
      "Lemon juice powder (30%)",
      "Lime juice powder",
      "Senna extract (1.5%)",
      "Chlorophyll extract (0.2%)",
      "Minor ingredients: maltitol; malic acid & citric acid; acidity regulators; anticaking agent",
    ],
    benefits: [
      "Supports gentle detox and digestive comfort",
      "Promotes better gut balance and regularity",
      "Helps reduce bloating and heaviness",
      "Supports daily freshness and vitality",
    ],
    usage: "Mix one sachet (2.5g) with 100ml of cold water.",
    featured: false,
    stock: 110,
    images: ["/products/miira-phyll-1.jpg"],
  },
  {
    slug: "miira-lanang",
    title: "Advanced Miira-Lanang - Coffee for Men Only",
    shortTitle: "Miira-Lanang",
    tagline: "Feel the Energy. Embrace the Balance.",
    price: 450,
    category: "Men",
    shortBenefit: "Supports energy, stamina, and male vitality",
    ingredients: [
      "Instant coffee powder",
      "Garcinia cambogia",
      "Ginger extract (0.1%)",
      "Saw palmetto extract (0.1%)",
      "Sucralose",
      "Rock salt",
      "Tongkat Ali (longjack)",
      "Xanthan gum",
    ],
    benefits: [
      "Supports stamina and endurance for demanding days",
      "Helps improve natural energy and focus",
      "Promotes healthy male vitality and confidence",
      "Formulated for daily wellness and performance",
    ],
    usage: "Mix one sachet with 150ml of hot water.",
    featured: true,
    stock: 100,
    images: ["/products/miira-lanang-1.jpg"],
  },
  {
    slug: "miira-coffee",
    title: "Miira Coffee - Functional Wellness Coffee",
    shortTitle: "Miira Coffee",
    tagline: "Wellness in a Cup.",
    price: 600,
    category: "Unisex",
    shortBenefit: "Functional coffee with botanicals for wellness-focused routines",
    ingredients: [
      "Mangosteen skin extract",
      "Black seed powder",
      "Dates powder",
      "Finger root extract",
      "Instant coffee powder",
      "Creamer",
      "Sweetener (sucralose)",
    ],
    benefits: [
      "Natural energy and mental clarity from quality coffee and botanicals",
      "Antioxidant support for everyday wellness",
      "May help with digestion and metabolism as part of a healthy routine",
      "Convenient sachets for on-the-go use",
      "Designed as a functional beverage, not just ordinary coffee",
    ],
    usage: "Wellness: mix 1 sachet with 150ml of hot water daily.",
    featured: true,
    stock: 85,
    images: ["/products/miira-coffee-1.png"],
  },
  {
    slug: "miira-wedok",
    title: "Advanced Miira-Wedok - Coffee for Women Only",
    shortTitle: "Miira-Wedok",
    tagline: "Radiance, Balance, and Everyday Confidence.",
    price: 450,
    category: "Women",
    shortBenefit: "Supports women wellness, glow, and daily vitality",
    ingredients: [
      "Instant coffee powder",
      "Garcinia cambogia",
      "Betel extract (0.7%)",
      "Labisia pumila (Kacip Fatimah)",
      "Sucralose",
      "Rock salt",
      "Manjakani extract (0.198%)",
      "Xanthan gum",
    ],
    benefits: [
      "Supports natural beauty and skin glow",
      "Helps with hormonal balance and mood support",
      "Promotes sustained daily energy",
      "Designed for modern women on the go",
    ],
    usage: "Mix one sachet with 150ml of hot water.",
    featured: true,
    stock: 120,
    images: ["/products/miira-wedok-1.jpg"],
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
export const distributorPackageTiers = ["promo", "starter", "bronze", "silver", "gold"] as const;
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
  /** Number of product boxes included (informational; see quantityNote for special cases) */
  boxes: number;
  /** Point value (PV) */
  pv: number;
  /** Highlight on card (e.g. Gold tier) */
  bestValue?: boolean;
  /** Full card title line under blurb (default: "{name} membership") */
  subtitle?: string;
  /** Replaces the default "N box(es) of product" line when set */
  quantityNote?: string;
  /** Promo ribbon (e.g. limited promo tier) */
  promo?: boolean;
};

export const distributorPackages: DistributorPackage[] = [
  {
    tier: "promo",
    name: "Intro promo",
    price: 350,
    blurb: "Entry tier",
    usdApprox: 29,
    boxes: 0,
    pv: 50,
    subtitle: "Intro distributor promo",
    quantityNote: "Half product",
    promo: true,
  },
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
