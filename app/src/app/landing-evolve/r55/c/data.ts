// Fixed, deterministic data only. No Math.random / Date.now / new Date() anywhere in this route —
// every number this page shows is either a literal here or a pure function (model.ts) of the two
// live handle positions. Meetpoint is an invented resale marketplace brand for this candidate; all
// copy is English-only per the repo binding.

import type { LucideIcon } from "lucide-react";
import { Armchair, Bike, Camera, Watch } from "lucide-react";

export interface Listing {
  id: string;
  title: string;
  Icon: LucideIcon;
  photoId: string;
  alt: string;
  matchPct: number;
  grade: string;
  verified: boolean;
  originalPrice: number;
  askPrice: number;
  reasonTags: readonly [string, string];
  conditionNote: string;
}

export const LISTINGS = [
  {
    id: "l-camera",
    title: "Pentax K1000 35mm, 50mm lens",
    Icon: Camera,
    photoId: "1510127034890-ba27508e9f1c",
    alt: "A black 35mm film camera with a 50mm lens resting on a wooden table",
    matchPct: 94,
    grade: "Excellent",
    verified: true,
    originalPrice: 780,
    askPrice: 620,
    reasonTags: ["Shutter speeds tested across all stops", "Matches 3 of your saved searches"],
    conditionNote: "Light-seal foam and shutter curtain checked against 14 comparable listings.",
  },
  {
    id: "l-sideboard",
    title: "Mid-century teak sideboard",
    Icon: Armchair,
    photoId: "1555041469-a586c61ea9bc",
    alt: "A low wooden sideboard with tapered legs against a plain wall",
    matchPct: 89,
    grade: "Good",
    verified: true,
    originalPrice: 940,
    askPrice: 710,
    reasonTags: ["Veneer intact in all close-up photos", "Dimensions fit 2 saved room sizes"],
    conditionNote: "Drawer runners and veneer edges checked against 8 comparable listings.",
  },
  {
    id: "l-bike",
    title: "Steel-frame commuter bike, size M",
    Icon: Bike,
    photoId: "1485965120184-e220f721d03e",
    alt: "A steel-frame bicycle leaning against a brick wall",
    matchPct: 91,
    grade: "Good",
    verified: false,
    originalPrice: 560,
    askPrice: 395,
    reasonTags: ["Drivetrain wear within normal range", "Size M is this week's top search"],
    conditionNote: "Chain stretch and brake pad depth measured against 11 comparable listings.",
  },
  {
    id: "l-watch",
    title: "Automatic dive watch, steel bracelet",
    Icon: Watch,
    photoId: "1524805444758-089113d48a6d",
    alt: "A stainless steel automatic watch with a dive bezel photographed on a dark surface",
    matchPct: 97,
    grade: "Like New",
    verified: true,
    originalPrice: 510,
    askPrice: 430,
    reasonTags: ["Service papers on file from last year", "Bezel action confirmed on video"],
    conditionNote: "Case back and crown tested for tightness against the manufacturer's spec.",
  },
] as const satisfies readonly Listing[];

export const HERO_LISTING: Listing = LISTINGS[0];

export interface SellerPreset {
  id: string;
  label: string;
  tagText: string;
  offer: number;
  ask: number;
}

// Same offer every time (matches the default hero offer) — only the seller's posture changes, so
// the three cards isolate exactly one variable: where you think their floor actually sits.
export const SELLER_PRESETS: readonly SellerPreset[] = [
  {
    id: "firm",
    label: "Firm on price",
    tagText: "Comps suggest this seller rarely moves far off the ask",
    offer: 420,
    ask: 680,
  },
  {
    id: "open",
    label: "Open to offers",
    tagText: "This seller has accepted close-to-ask offers before",
    offer: 420,
    ask: 455,
  },
  {
    id: "motivated",
    label: "Ready to deal",
    tagText: "Relisted twice with no sale — likely motivated",
    offer: 420,
    ask: 400,
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "t-rosa",
    quote:
      "I used to send an offer and just hope. Dragging the two handles until the label flipped to \"likely\" made it obvious my first number was never going to land.",
    name: "Rosa Calder",
    role: "Bought 9 items, member since 2024",
    initials: "RC",
  },
  {
    id: "t-ibrahim",
    quote:
      "Meetpoint's comps put the seller's floor $40 lower than I guessed. That was the difference between a rejected offer and a deal that closed the same day.",
    name: "Ibrahim Okafor",
    role: "Bought 23 items, member since 2023",
    initials: "IO",
  },
  {
    id: "t-wen",
    quote:
      "Seeing both numbers on the same bar, instead of two separate sliders, is what made the gap click for me. It's one distance, not two unrelated numbers.",
    name: "Wen Zhao",
    role: "Bought 6 items, member since 2025",
    initials: "WZ",
  },
];

export interface StatChip {
  id: string;
  value: string;
  label: string;
}

export const STAT_CHIPS: readonly StatChip[] = [
  { id: "s-buyers", value: "31,400+", label: "active buyers" },
  { id: "s-accept", value: "68%", label: "offers accepted within comps range" },
  { id: "s-rating", value: "4.9 / 5", label: "average buyer rating" },
];
