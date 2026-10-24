export interface Listing {
  id: string;
  title: string;
  brand: string;
  image: string;
  alt: string;
  matchPercent: number;
  conditionGrade: string;
  verified: boolean;
  retailPrice: number;
  listedPrice: number;
}

export const FEATURED_LISTING: Listing = {
  id: "featured",
  title: "Field jacket, waxed cotton",
  brand: "Northbound Supply",
  image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop",
  alt: "Waxed cotton field jacket laid flat against a neutral background",
  matchPercent: 96,
  conditionGrade: "A−",
  verified: true,
  retailPrice: 340,
  listedPrice: 212,
};

export const PRODUCTS: Listing[] = [
  {
    id: "p1",
    title: "Raw denim trucker jacket",
    brand: "Harlow Mills",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56?q=80&w=800&auto=format&fit=crop",
    alt: "Raw denim trucker jacket folded on a table",
    matchPercent: 94,
    conditionGrade: "B+",
    verified: true,
    retailPrice: 228,
    listedPrice: 149,
  },
  {
    id: "p2",
    title: "Leather weekender bag",
    brand: "Felt & Co.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    alt: "Brown leather weekender duffel bag",
    matchPercent: 91,
    conditionGrade: "A−",
    verified: true,
    retailPrice: 410,
    listedPrice: 265,
  },
  {
    id: "p3",
    title: "Suede chelsea boots",
    brand: "Marrow",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=800&auto=format&fit=crop",
    alt: "Pair of suede chelsea boots standing side by side",
    matchPercent: 89,
    conditionGrade: "B",
    verified: true,
    retailPrice: 190,
    listedPrice: 118,
  },
  {
    id: "p4",
    title: "Wool overcoat, double-breasted",
    brand: "Dunmore House",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    alt: "Double-breasted wool overcoat hanging against a plain wall",
    matchPercent: 97,
    conditionGrade: "A",
    verified: true,
    retailPrice: 480,
    listedPrice: 299,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya N.",
    role: "Buyer, 14 verified purchases",
    quote:
      "I stopped reading the full listing and started reading the five checks instead. Faster, and I trust it more.",
  },
  {
    id: "t2",
    name: "Owen T.",
    role: "Seller, menswear",
    quote:
      "Every one of my listings gets the same scrutiny. No more haggling over whether the jacket really is what I said.",
  },
  {
    id: "t3",
    name: "Marisol D.",
    role: "Buyer",
    quote:
      "The confidence number moved when I asked it to, right in front of me. First marketplace proof that hasn't felt like marketing.",
  },
];

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { id: "s1", value: "1.2M", label: "Listings scored across all five checks last year" },
  { id: "s2", value: "96%", label: "Buyers who said the condition grade matched on arrival" },
  { id: "s3", value: "4.8/5", label: "Average buyer trust rating after delivery" },
];
