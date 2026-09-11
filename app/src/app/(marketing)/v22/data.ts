import type { LucideIcon } from "lucide-react";
import { Armchair, Gamepad2, Laptop, Shirt, Smartphone } from "lucide-react";

/** The single flagship listing the hero ledger is built around. */
export const flagship = {
  title: "iPhone 14 Pro",
  spec: "256GB · Deep Purple · Unlocked",
  category: "Electronics" as const,
  icon: Smartphone,
  aiMatch: 96,
  grade: "A−",
  gradeScore: 9.1,
  originalPrice: 1099,
};

export type Offer = {
  id: string;
  seller: string;
  initials: string;
  price: number;
  shipDays: number;
  trust: number;
  grade: string;
  verified: boolean;
  trades: number;
  reasoning: string[];
};

/** Six verified sellers holding an equivalent listing, competing for the same match. */
export const offers: Offer[] = [
  {
    id: "mara-t",
    seller: "Mara T.",
    initials: "MT",
    price: 589,
    shipDays: 1,
    trust: 98,
    grade: "A",
    verified: true,
    trades: 340,
    reasoning: ["Exact model + storage match", "Ships same day", "340 completed trades"],
  },
  {
    id: "dae-ho-k",
    seller: "Dae-ho K.",
    initials: "DK",
    price: 612,
    shipDays: 2,
    trust: 95,
    grade: "A−",
    verified: true,
    trades: 210,
    reasoning: ["Battery health 91%+", "ID and address verified", "Listing photos AI-audited"],
  },
  {
    id: "priya-s",
    seller: "Priya S.",
    initials: "PS",
    price: 560,
    shipDays: 4,
    trust: 91,
    grade: "B+",
    verified: true,
    trades: 88,
    reasoning: ["Lowest price in this category", "Minor cosmetic wear noted", "Ships from origin city"],
  },
  {
    id: "yuki-n",
    seller: "Yuki N.",
    initials: "YN",
    price: 645,
    shipDays: 1,
    trust: 99,
    grade: "A",
    verified: true,
    trades: 512,
    reasoning: ["Highest trust score in category", "Same-day courier pickup", "512 completed trades"],
  },
  {
    id: "chidi-o",
    seller: "Chidi O.",
    initials: "CO",
    price: 599,
    shipDays: 3,
    trust: 88,
    grade: "A−",
    verified: true,
    trades: 64,
    reasoning: ["Newer seller, fully verified", "Original box and accessories", "Standard shipping"],
  },
  {
    id: "lea-m",
    seller: "Léa M.",
    initials: "LM",
    price: 625,
    shipDays: 1,
    trust: 93,
    grade: "A",
    verified: true,
    trades: 176,
    reasoning: ["Ships same day", "Face ID and Touch ID confirmed working", "176 completed trades"],
  },
];

export type PreviewCategory = "Electronics" | "Furniture" | "Fashion" | "Gaming";

export type PreviewItem = {
  id: string;
  category: PreviewCategory;
  icon: LucideIcon;
  title: string;
  spec: string;
  grade: string;
  match: number;
  verified: boolean;
  originalPrice: number;
  price: number;
  seller: string;
  tags: string[];
};

export const previewItems: PreviewItem[] = [
  {
    id: "macbook-air",
    category: "Electronics",
    icon: Laptop,
    title: "MacBook Air M2",
    spec: "13″ · 8-core · Midnight",
    grade: "A",
    match: 94,
    verified: true,
    originalPrice: 1199,
    price: 640,
    seller: "Noah P.",
    tags: ["Exact model match", "Battery health 92%", "Fast shipper"],
  },
  {
    id: "aeron",
    category: "Furniture",
    icon: Armchair,
    title: "Herman Miller Aeron",
    spec: "Size B · Graphite frame",
    grade: "B+",
    match: 89,
    verified: true,
    originalPrice: 1395,
    price: 410,
    seller: "Renee A.",
    tags: ["Local pickup available", "Verified condition photos", "Frame recently serviced"],
  },
  {
    id: "better-sweater",
    category: "Fashion",
    icon: Shirt,
    title: "Patagonia Better Sweater",
    spec: "Men's M · Fleece",
    grade: "A−",
    match: 91,
    verified: true,
    originalPrice: 139,
    price: 52,
    seller: "Theo B.",
    tags: ["No pilling noted", "Smoke-free home", "Ships in 1 day"],
  },
  {
    id: "switch-oled",
    category: "Gaming",
    icon: Gamepad2,
    title: "Nintendo Switch OLED",
    spec: "White · Dock included",
    grade: "A",
    match: 97,
    verified: true,
    originalPrice: 349,
    price: 178,
    seller: "Ivy R.",
    tags: ["Joy-Cons drift-free", "Includes original dock", "200+ completed trades"],
  },
];

export const socialStats = [
  { value: "$14.2M", label: "Paid out to sellers this year" },
  { value: "312,480", label: "Items matched to date" },
  { value: "4.8/5", label: "Average buyer rating" },
  { value: "97.3", label: "Average seller trust score" },
];

export const testimonials = [
  {
    quote:
      "I priced my own MacBook for months and never found a real buyer. The order book found a verified match at a fair price in about six hours.",
    name: "Jordan M.",
    role: "Seller since 2024",
  },
  {
    quote:
      "I could see exactly why one seller ranked above the others — price, ship time, trust, all printed as numbers. Not a black box.",
    name: "Amara K.",
    role: "Buyer, matched in 6 hours",
  },
];
