import {
  Camera,
  Armchair,
  Headphones,
  Bike,
  Layers,
  type LucideIcon,
} from "lucide-react";

export type CategoryId = "all" | "cameras" | "furniture" | "audio" | "bikes";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "all", label: "All matches", icon: Layers },
  { id: "cameras", label: "Cameras", icon: Camera },
  { id: "furniture", label: "Furniture", icon: Armchair },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "bikes", label: "Bikes", icon: Bike },
];

export interface MatchPair {
  id: string;
  category: Exclude<CategoryId, "all">;
  buyer: {
    title: string;
    budget: string;
    conditionAsk: string;
    location: string;
    posted: string;
  };
  listing: {
    title: string;
    price: number;
    priceBefore: number;
    conditionGrade: string;
    verification: string;
    image: string;
    imageAlt: string;
  };
  rationale: string[];
  priceFit: number;
  conditionConf: number;
  speedDays: number;
}

const CATEGORY_IMAGE: Record<Exclude<CategoryId, "all">, { image: string; imageAlt: string }> = {
  cameras: {
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    imageAlt: "Mirrorless camera body with lens attached, resting on a neutral surface.",
  },
  furniture: {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    imageAlt: "Wooden dining table and chairs in a bright room.",
  },
  audio: {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    imageAlt: "Over-ear headphones photographed against a plain background.",
  },
  bikes: {
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    imageAlt: "Bicycle parked against a plain wall.",
  },
};

export const ALL_MATCHES: MatchPair[] = [
  // Cameras
  {
    id: "cam-1",
    category: "cameras",
    buyer: {
      title: "Full-frame mirrorless under $900, minimal shutter wear",
      budget: "Budget $900",
      conditionAsk: "Condition B+ or better",
      location: "Within 5 mi of Austin, TX",
      posted: "Posted 2 hours ago",
    },
    listing: {
      title: "Sony a7 III body, 4,200 shutter count",
      price: 840,
      priceBefore: 1050,
      conditionGrade: "A-",
      verification: "Pro Seller · 340 sales",
      ...CATEGORY_IMAGE.cameras,
    },
    rationale: ["Within budget by $60", "Condition A- beats B+ ask", "3.1 mi away"],
    priceFit: 96,
    conditionConf: 91,
    speedDays: 2,
  },
  {
    id: "cam-2",
    category: "cameras",
    buyer: {
      title: "Compact travel camera, weather-sealed, under $500",
      budget: "Budget $500",
      conditionAsk: "Weather-sealed required",
      location: "Ships nationwide",
      posted: "Posted 6 hours ago",
    },
    listing: {
      title: "Fujifilm X100V, light use, original box",
      price: 470,
      priceBefore: 650,
      conditionGrade: "B+",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.cameras,
    },
    rationale: ["Weather-sealed body confirmed", "Within budget by $30", "Ships in 1 day"],
    priceFit: 94,
    conditionConf: 86,
    speedDays: 1,
  },
  {
    id: "cam-3",
    category: "cameras",
    buyer: {
      title: "Vintage 35mm film body, condition flexible, up to $250",
      budget: "Budget $250",
      conditionAsk: "Any disclosed condition",
      location: "Within 10 mi of Portland, OR",
      posted: "Posted yesterday",
    },
    listing: {
      title: "Canon AE-1 Program, CLA serviced",
      price: 210,
      priceBefore: 260,
      conditionGrade: "B",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.cameras,
    },
    rationale: ["CLA service log attached", "Brassing disclosed up front", "Local pickup available"],
    priceFit: 88,
    conditionConf: 80,
    speedDays: 3,
  },

  // Furniture
  {
    id: "fur-1",
    category: "furniture",
    buyer: {
      title: "Mid-century dining table, seats 6, under $600",
      budget: "Budget $600",
      conditionAsk: "Seats 6 minimum",
      location: "Within 8 mi of Denver, CO",
      posted: "Posted 3 hours ago",
    },
    listing: {
      title: "Walnut extension table, 1962 refinish",
      price: 540,
      priceBefore: 720,
      conditionGrade: "A-",
      verification: "Pro Seller · 118 sales",
      ...CATEGORY_IMAGE.furniture,
    },
    rationale: ["Seats 6 confirmed", "Within budget by $60", "Refinish work documented"],
    priceFit: 95,
    conditionConf: 89,
    speedDays: 3,
  },
  {
    id: "fur-2",
    category: "furniture",
    buyer: {
      title: "Ergonomic office chair, mesh back, budget $300",
      budget: "Budget $300",
      conditionAsk: "Mesh back required",
      location: "Ships nationwide",
      posted: "Posted 5 hours ago",
    },
    listing: {
      title: "Herman Miller Aeron, size B",
      price: 275,
      priceBefore: 390,
      conditionGrade: "B+",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.furniture,
    },
    rationale: ["Mesh back match", "Within budget by $25", "Size B fits stated height"],
    priceFit: 92,
    conditionConf: 87,
    speedDays: 2,
  },
  {
    id: "fur-3",
    category: "furniture",
    buyer: {
      title: "Bookshelf, solid wood, 6ft or taller, under $200",
      budget: "Budget $200",
      conditionAsk: "Solid wood only",
      location: "Within 6 mi of Denver, CO",
      posted: "Posted 2 days ago",
    },
    listing: {
      title: "Oak veneer shelving unit, 6.2 ft",
      price: 175,
      priceBefore: 230,
      conditionGrade: "B",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.furniture,
    },
    rationale: ["Height exceeds the ask", "Within budget by $25", "Local pickup 4.4 mi"],
    priceFit: 90,
    conditionConf: 81,
    speedDays: 3,
  },

  // Audio
  {
    id: "aud-1",
    category: "audio",
    buyer: {
      title: "Studio monitor speakers, pair, under $350",
      budget: "Budget $350",
      conditionAsk: "Pair required, low hours",
      location: "Ships nationwide",
      posted: "Posted 1 hour ago",
    },
    listing: {
      title: "KRK Rokit 5 G4, pair, light studio use",
      price: 310,
      priceBefore: 400,
      conditionGrade: "A-",
      verification: "Pro Seller · 76 sales",
      ...CATEGORY_IMAGE.audio,
    },
    rationale: ["Pair confirmed", "Within budget by $40", "Original packaging included"],
    priceFit: 93,
    conditionConf: 90,
    speedDays: 2,
  },
  {
    id: "aud-2",
    category: "audio",
    buyer: {
      title: "Noise-cancelling headphones, under $150, battery disclosed",
      budget: "Budget $150",
      conditionAsk: "Battery health disclosed",
      location: "Ships nationwide",
      posted: "Posted 4 hours ago",
    },
    listing: {
      title: "Sony WH-1000XM4, 88% battery health",
      price: 135,
      priceBefore: 220,
      conditionGrade: "B+",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.audio,
    },
    rationale: ["Battery health disclosed", "Within budget by $15", "Ships same day"],
    priceFit: 95,
    conditionConf: 87,
    speedDays: 1,
  },
  {
    id: "aud-3",
    category: "audio",
    buyer: {
      title: "Turntable with built-in preamp, under $220",
      budget: "Budget $220",
      conditionAsk: "Built-in preamp required",
      location: "Within 12 mi of Chicago, IL",
      posted: "Posted yesterday",
    },
    listing: {
      title: "Audio-Technica AT-LP60XBT, sealed accessories",
      price: 195,
      priceBefore: 250,
      conditionGrade: "A",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.audio,
    },
    rationale: ["Built-in preamp confirmed", "Within budget by $25", "Condition A, unused"],
    priceFit: 91,
    conditionConf: 93,
    speedDays: 1,
  },

  // Bikes
  {
    id: "bik-1",
    category: "bikes",
    buyer: {
      title: "Commuter hybrid bike, frame 54-56cm, under $400",
      budget: "Budget $400",
      conditionAsk: "Frame 54-56cm",
      location: "Within 5 mi of Minneapolis, MN",
      posted: "Posted 3 hours ago",
    },
    listing: {
      title: "Trek FX 2 Hybrid, 55cm frame",
      price: 360,
      priceBefore: 520,
      conditionGrade: "B+",
      verification: "Pro Seller · 203 sales",
      ...CATEGORY_IMAGE.bikes,
    },
    rationale: ["Frame size match", "Within budget by $40", "Tune-up included"],
    priceFit: 92,
    conditionConf: 86,
    speedDays: 2,
  },
  {
    id: "bik-2",
    category: "bikes",
    buyer: {
      title: "Gravel bike, disc brakes, budget $900",
      budget: "Budget $900",
      conditionAsk: "Disc brakes required",
      location: "Ships nationwide",
      posted: "Posted 7 hours ago",
    },
    listing: {
      title: "Specialized Diverge E5, disc brakes",
      price: 840,
      priceBefore: 1150,
      conditionGrade: "A-",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.bikes,
    },
    rationale: ["Disc brakes confirmed", "Within budget by $60", "Recent tune-up log"],
    priceFit: 90,
    conditionConf: 89,
    speedDays: 3,
  },
  {
    id: "bik-3",
    category: "bikes",
    buyer: {
      title: "Kids bike, 20-inch wheels, under $120",
      budget: "Budget $120",
      conditionAsk: "20-inch wheels",
      location: "Within 4 mi of Minneapolis, MN",
      posted: "Posted 2 days ago",
    },
    listing: {
      title: "Cannondale Trail 20, light scuffs",
      price: 95,
      priceBefore: 140,
      conditionGrade: "B",
      verification: "Verified Seller",
      ...CATEGORY_IMAGE.bikes,
    },
    rationale: ["20-inch wheel match", "Within budget by $25", "Local pickup 2.0 mi"],
    priceFit: 96,
    conditionConf: 82,
    speedDays: 1,
  },
];

// Default "at rest" view: one representative match from three different
// categories, so the board never opens on an empty or single-category state.
const ALL_VIEW_IDS = ["cam-1", "fur-1", "aud-1"];

export function getMatchesForCategory(id: CategoryId): MatchPair[] {
  if (id === "all") {
    return ALL_VIEW_IDS.map((mid) => ALL_MATCHES.find((m) => m.id === mid)!).filter(Boolean);
  }
  return ALL_MATCHES.filter((m) => m.category === id);
}

export interface AggregateStats {
  priceFit: number;
  conditionConf: number;
  speedDays: number;
  count: number;
}

export function aggregateStats(matches: MatchPair[]): AggregateStats {
  if (matches.length === 0) {
    return { priceFit: 0, conditionConf: 0, speedDays: 0, count: 0 };
  }
  const sum = matches.reduce(
    (acc, m) => ({
      priceFit: acc.priceFit + m.priceFit,
      conditionConf: acc.conditionConf + m.conditionConf,
      speedDays: acc.speedDays + m.speedDays,
    }),
    { priceFit: 0, conditionConf: 0, speedDays: 0 }
  );
  const n = matches.length;
  return {
    priceFit: Math.round(sum.priceFit / n),
    conditionConf: Math.round(sum.conditionConf / n),
    speedDays: Math.round((sum.speedDays / n) * 10) / 10,
    count: n,
  };
}

export function discountPct(price: number, priceBefore: number): number {
  return Math.round(((priceBefore - price) / priceBefore) * 100);
}

export const TESTIMONIALS = [
  {
    quote:
      "I posted a budget and a condition floor. The match that came back had a service log I didn't even know to ask for.",
    name: "Morgan L.",
    role: "Bought a matched camera, Austin TX",
  },
  {
    quote:
      "As a seller, I stopped fielding lowball offers. The buyers who reach me already know my price fits their ask.",
    name: "Priya R.",
    role: "Pro Seller, 118 furniture sales",
  },
  {
    quote:
      "The rationale tags told me exactly why it was a fit before I clicked through. That's the part that built trust.",
    name: "Devon K.",
    role: "Bought a matched turntable, Chicago IL",
  },
];

export const PROOF_STATS = [
  { value: "94%", label: "of matched buyers complete checkout within 48 hours" },
  { value: "3.2x", label: "faster time-to-sale for sellers who accept a matched offer" },
  { value: "12,400+", label: "matched pairs re-threaded across the board last month" },
];
