// Deterministic seed data for the Circuitloom Restorations seller profile.
// No Math.random / Date.now / new Date() anywhere — every "recency" label below is a fixed string,
// not a computed offset from the current date, so the page renders identically on every visit.

import type { LucideIcon } from "lucide-react";
import {
  Aperture,
  AudioWaveform,
  Camera,
  Disc3,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  Speaker,
} from "lucide-react";

export type Grade = "Like New" | "Excellent" | "Good" | "Fair";

export const GRADES: Grade[] = ["Like New", "Excellent", "Good", "Fair"];

export const GRADE_INFO: Record<Grade, { blurb: string }> = {
  "Like New": { blurb: "No visible wear, full function bench-tested." },
  Excellent: { blurb: "Light cosmetic wear only, fully functional." },
  Good: { blurb: "Visible wear consistent with use, fully functional." },
  Fair: { blurb: "Heavier wear or minor flaws, tested and functional." },
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  category: string;
  grade: Grade;
  price: number;
  watchers: number;
  postedLabel: string;
  icon: LucideIcon;
};

export const LISTINGS: Listing[] = [
  { id: "l1", slug: "anvil-tkl-75", title: "Anvil TKL-75 Mechanical Keyboard", category: "Keyboards", grade: "Like New", price: 149, watchers: 24, postedLabel: "Posted 2 days ago", icon: Keyboard },
  { id: "l2", slug: "meridian-a1-speakers", title: "Meridian A1 Bookshelf Speakers (Pair)", category: "Audio", grade: "Excellent", price: 210, watchers: 18, postedLabel: "Posted 5 days ago", icon: Speaker },
  { id: "l3", slug: "voss-35mm-rangefinder", title: "Voss 35mm Rangefinder Camera", category: "Cameras", grade: "Good", price: 340, watchers: 31, postedLabel: "Posted 1 day ago", icon: Camera },
  { id: "l4", slug: "palisade-turntable", title: "Palisade Direct-Drive Turntable", category: "Turntables", grade: "Excellent", price: 265, watchers: 12, postedLabel: "Posted 9 days ago", icon: Disc3 },
  { id: "l5", slug: "orbital-mini-synth", title: "Orbital Mini Synthesizer", category: "Synths", grade: "Like New", price: 180, watchers: 27, postedLabel: "Posted 3 days ago", icon: AudioWaveform },
  { id: "l6", slug: "fenwick-headphones", title: "Fenwick Over-Ear Headphones", category: "Audio", grade: "Good", price: 95, watchers: 8, postedLabel: "Posted 14 days ago", icon: Headphones },
  { id: "l7", slug: "ridgeline-monitor-27", title: "Ridgeline 27″ QHD Monitor", category: "Monitors", grade: "Fair", price: 120, watchers: 6, postedLabel: "Posted 21 days ago", icon: Monitor },
  { id: "l8", slug: "compass-wireless-mouse", title: "Compass Wireless Mouse", category: "Accessories", grade: "Excellent", price: 38, watchers: 15, postedLabel: "Posted 4 days ago", icon: Mouse },
  { id: "l9", slug: "solstice-prime-50mm", title: "Solstice Prime 50mm f/1.8 Lens", category: "Lenses", grade: "Like New", price: 310, watchers: 22, postedLabel: "Posted 6 days ago", icon: Aperture },
];

export type Review = {
  id: string;
  author: string;
  initials: string;
  rating: number;
  dateLabel: string;
  itemTitle: string;
  verified: boolean;
  text: string;
  helpful: number;
};

// Ordered most-recent-first — this is the "Most recent" sort's resting order.
export const REVIEWS: Review[] = [
  { id: "r1", author: "Priya N.", initials: "PN", rating: 5, dateLabel: "Jul 2026", itemTitle: "Anvil TKL-75 Keyboard", verified: true, text: "Keyboard looked and felt brand new — original box, every switch tested, shipped the next morning.", helpful: 14 },
  { id: "r2", author: "Marcus T.", initials: "MT", rating: 5, dateLabel: "Jul 2026", itemTitle: "Voss 35mm Rangefinder", verified: true, text: "Light seals were freshly replaced and the shutter speed is dead accurate. Better condition than most 'mint' listings I've seen elsewhere.", helpful: 9 },
  { id: "r3", author: "Elena R.", initials: "ER", rating: 4, dateLabel: "Jun 2026", itemTitle: "Palisade Turntable", verified: true, text: "Great condition overall — one small scuff on the plinth that wasn't visible in the photos, but sound quality is excellent.", helpful: 5 },
  { id: "r4", author: "Devon K.", initials: "DK", rating: 5, dateLabel: "Jun 2026", itemTitle: "Solstice Prime 50mm Lens", verified: true, text: "Glass is spotless and the focus ring is buttery smooth. Fast shipping with real tracking updates the whole way.", helpful: 11 },
  { id: "r5", author: "Sasha L.", initials: "SL", rating: 5, dateLabel: "May 2026", itemTitle: "Meridian A1 Speakers", verified: true, text: "Paired and burned in before shipping — arrived sounding better than I expected for the price.", helpful: 7 },
  { id: "r6", author: "Owen B.", initials: "OB", rating: 3, dateLabel: "May 2026", itemTitle: "Ridgeline 27″ Monitor", verified: true, text: "Panel has minor uniformity issues, consistent with the Fair grade listed — seller was upfront about it beforehand.", helpful: 3 },
  { id: "r7", author: "Nadia F.", initials: "NF", rating: 5, dateLabel: "Apr 2026", itemTitle: "Fenwick Headphones", verified: true, text: "Ear pads were replaced with new foam and the sound is clean. Would buy from this seller again.", helpful: 6 },
  { id: "r8", author: "Colin W.", initials: "CW", rating: 5, dateLabel: "Apr 2026", itemTitle: "Compass Wireless Mouse", verified: false, text: "Works perfectly, exactly as described. Quick to respond when I had a question before buying.", helpful: 2 },
];

// Star-count distribution behind the 4.9 average, sums to reviewCount (612).
export const RATING_BREAKDOWN: { stars: number; count: number }[] = [
  { stars: 5, count: 580 },
  { stars: 4, count: 20 },
  { stars: 3, count: 8 },
  { stars: 2, count: 2 },
  { stars: 1, count: 2 },
];

export const SELLER = {
  brand: "Circuitloom Restorations",
  handle: "@circuitloom",
  location: "Austin, TX, US",
  memberSinceLabel: "Selling since Mar 2019",
  responseTimeLabel: "Replies within 1 hour",
  bio: "Certified-refurbished audio, keyboards, cameras and optics. Every unit is bench-tested, cleaned and re-certified before it ships.",
  ratingAvg: 4.9,
  reviewCount: 612,
  shipOnTimePct: 98,
  itemsSold: 1284,
  followersBase: 3842,
};

export const PERFORMANCE_ROWS: { metric: string; seller: string; marketAvg: string }[] = [
  { metric: "Response time", seller: "Under 1 hr", marketAvg: "~6 hrs" },
  { metric: "On-time shipping", seller: "98%", marketAvg: "89%" },
  { metric: "Item as described", seller: "99%", marketAvg: "94%" },
  { metric: "Return rate", seller: "1.2%", marketAvg: "4.8%" },
];

export const BADGES: { label: string }[] = [
  { label: "Verified Seller" },
  { label: "Top Rated" },
  { label: "Fast Shipper" },
  { label: "30-Day Returns" },
];
