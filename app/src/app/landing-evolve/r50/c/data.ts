// data.ts — English-only copy and fixed, hand-picked Unsplash photo ids (never a randomized
// image endpoint). Each id below is reused elsewhere in this catalogue for the same subject, so
// it is a known-good, already-served image rather than a guess.

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  match: number;
  gradeShort: string;
  gradeLabel: string;
  image: { src: string; alt: string };
  reasoningTags?: string[];
};

export const HERO_PRODUCTS: Product[] = [
  {
    id: "trail-sneaker",
    title: "Retro Trail Sneaker",
    category: "Footwear",
    price: 86,
    originalPrice: 148,
    match: 96,
    gradeShort: "A",
    gradeLabel: "Excellent",
    image: {
      src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
      alt: "A white and grey trail running sneaker photographed on a plain background",
    },
  },
  {
    id: "field-watch",
    title: "Automatic Field Watch",
    category: "Accessories",
    price: 210,
    originalPrice: 340,
    match: 93,
    gradeShort: "A-",
    gradeLabel: "Excellent",
    image: {
      src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
      alt: "A stainless steel automatic wristwatch resting on a plain surface",
    },
  },
];

export const SHOWCASE_PRODUCTS: Product[] = [
  {
    id: "mirrorless-body",
    title: "Full-Frame Mirrorless Body",
    category: "Electronics · 24MP sensor",
    price: 612,
    originalPrice: 980,
    match: 91,
    gradeShort: "B+",
    gradeLabel: "Very Good",
    image: {
      src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
      alt: "A mirrorless camera body with a lens attached, resting on a plain neutral background",
    },
    reasoningTags: [
      "Matches your saved search: full-frame",
      "Shutter count verified under 8,000",
      "Same kit lens you viewed last week",
    ],
  },
  {
    id: "studio-headphones",
    title: "Studio Headphones, Over-Ear",
    category: "Audio · Wireless ANC",
    price: 94,
    originalPrice: 180,
    match: 88,
    gradeShort: "A",
    gradeLabel: "Excellent",
    image: {
      src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
      alt: "A pair of over-ear wireless headphones on a plain background",
    },
    reasoningTags: [
      "Fits your budget filter: $50–150",
      "Pairs with 3 items in your saved list",
      "Battery health confirmed at 97%",
    ],
  },
  {
    id: "field-jacket",
    title: "Waxed Cotton Field Jacket",
    category: "Outerwear · Size M",
    price: 128,
    originalPrice: 210,
    match: 94,
    gradeShort: "A-",
    gradeLabel: "Excellent",
    image: {
      src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
      alt: "A waxed cotton field jacket laid flat on a plain background",
    },
    reasoningTags: [
      "Matches your style profile: utilitarian",
      "Brand history: 4 prior verified sales",
      "Seasonal demand up 22% this month",
    ],
  },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: { src: string; alt: string };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "priya",
    name: "Priya Shah",
    role: "Platinum seller, Portland",
    quote:
      "I verified everything on day one. My first listing sold in four days — repick told me exactly which step would move me fastest.",
    avatar: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=160&auto=format&fit=crop",
      alt: "Portrait of Priya Shah, a repick Platinum seller",
    },
  },
  {
    id: "marco",
    name: "Marco Villanueva",
    role: "Gold seller, Austin",
    quote:
      "The AI match score stopped the back-and-forth. Buyers already know the condition grade before they message me.",
    avatar: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=160&auto=format&fit=crop",
      alt: "Portrait of Marco Villanueva, a repick Gold seller",
    },
  },
  {
    id: "elena",
    name: "Elena Kade",
    role: "Silver seller, Chicago",
    quote:
      "Linking my bank account for instant payout took two minutes and unlocked same-day cash on every sale.",
    avatar: {
      src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=160&auto=format&fit=crop",
      alt: "Portrait of Elena Kade, a repick Silver seller",
    },
  },
];

export const PLATFORM_STATS = [
  { label: "Verified sellers", value: "12,400+" },
  { label: "Listings graded by AI", value: "2.1M" },
  { label: "Buyer-reported match accuracy", value: "94%" },
];
