// ---------------------------------------------------------------------------
// The Case File — fixed, deterministic data only. No Math.random / Date.now /
// new Date() anywhere in this route: every number below is a hand-set lookup
// value, keyed by the two discrete axes a visitor can select (inspection
// intensity x comparison period). Selecting a combination reads this table —
// it never generates a new one.
// ---------------------------------------------------------------------------

export type Intensity = "standard" | "deep" | "forensic";
export type Period = "7" | "30" | "90";

export interface CaseMetrics {
  confidence: number; // % — trust score for the recommended price
  price: number; // USD — recommended asking price
  days: number; // estimated days-to-sell
}

export const INTENSITIES: { id: Intensity; label: string; blurb: string }[] = [
  { id: "standard", label: "Standard", blurb: "4-point visual and function check." },
  { id: "deep", label: "Deep", blurb: "Adds optical clarity and mechanical timing tests." },
  { id: "forensic", label: "Forensic", blurb: "Adds sensor imaging and a provenance cross-reference." },
];

export const PERIODS: { id: Period; label: string; blurb: string }[] = [
  { id: "7", label: "7 Days", blurb: "Priced against the last 7 days of comparable sales." },
  { id: "30", label: "30 Days", blurb: "Priced against the last 30 days of comparable sales." },
  { id: "90", label: "90 Days", blurb: "Priced against the last 90 days of comparable sales." },
];

// Confidence rises with both inspection depth and window size — more physical
// evidence and more comparable sales both reduce uncertainty. Price eases
// down slightly as the window widens (older, softer sales enter the average)
// but rises with intensity (a better-documented item supports a firmer ask).
// Days-to-sell falls with both: a better-proven listing and a tighter price
// both move faster.
export const METRICS: Record<Intensity, Record<Period, CaseMetrics>> = {
  standard: {
    "7": { confidence: 78, price: 505, days: 14 },
    "30": { confidence: 82, price: 495, days: 12 },
    "90": { confidence: 85, price: 480, days: 11 },
  },
  deep: {
    "7": { confidence: 86, price: 518, days: 9 },
    "30": { confidence: 90, price: 508, days: 8 },
    "90": { confidence: 93, price: 492, days: 7 },
  },
  forensic: {
    "7": { confidence: 91, price: 532, days: 6 },
    "30": { confidence: 95, price: 521, days: 5 },
    "90": { confidence: 97, price: 504, days: 4 },
  },
};

// The grade a deeper inspection confirms or upgrades. Depends only on
// intensity — condition is a physical property, not a function of the sales
// window used to price it.
export const GRADE_BY_INTENSITY: Record<Intensity, string> = {
  standard: "B+",
  deep: "B+",
  forensic: "A-",
};

export interface ChecklistItem {
  label: string;
  status: "pass" | "flagged";
  note: string;
}

// Checklist depth depends only on inspection intensity — each tier is a
// strict superset of the one below it.
export const CHECKLISTS: Record<Intensity, ChecklistItem[]> = {
  standard: [
    { label: "Power-on and response test", status: "pass", note: "Functions on first attempt" },
    { label: "Cosmetic exterior scan", status: "pass", note: "Light wear, no cracks" },
    { label: "Included accessories match", status: "pass", note: "All original items present" },
    { label: "Serial number match", status: "pass", note: "Matches listing record" },
  ],
  deep: [
    { label: "Power-on and response test", status: "pass", note: "Functions on first attempt" },
    { label: "Cosmetic exterior scan", status: "pass", note: "Light wear, no cracks" },
    { label: "Included accessories match", status: "pass", note: "All original items present" },
    { label: "Serial number match", status: "pass", note: "Matches listing record" },
    { label: "Optical clarity scan", status: "pass", note: "No fungus or haze detected" },
    { label: "Mechanical timing test", status: "pass", note: "Within factory tolerance" },
  ],
  forensic: [
    { label: "Power-on and response test", status: "pass", note: "Functions on first attempt" },
    { label: "Cosmetic exterior scan", status: "pass", note: "Light wear, no cracks" },
    { label: "Included accessories match", status: "pass", note: "All original items present" },
    { label: "Serial number match", status: "pass", note: "Matches listing record" },
    { label: "Optical clarity scan", status: "pass", note: "No fungus or haze detected" },
    { label: "Mechanical timing test", status: "pass", note: "Within factory tolerance" },
    { label: "Sensor imaging pass", status: "flagged", note: "Minor dust, cosmetic only" },
    { label: "Provenance cross-reference", status: "pass", note: "No loss or theft record found" },
  ],
};

export function discountPct(original: number, price: number): number {
  return Math.round(((original - price) / original) * 100);
}

// ---------------------------------------------------------------------------
// The listing the case file is computed for.
// ---------------------------------------------------------------------------

export const LISTING = {
  title: "Vintage Chronograph, Steel Case and Bracelet",
  matchPct: 96,
  sellerVerified: true,
  retailPrice: 780,
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  imageAlt: "Stainless steel mechanical chronograph wristwatch with a steel bracelet, photographed on a neutral background",
};

// ---------------------------------------------------------------------------
// Exhibit B — why the ledger moves
// ---------------------------------------------------------------------------

export const WHY_ITEMS: { title: string; body: string }[] = [
  {
    title: "Inspection depth",
    body: "Each tier adds physical checks the one below it skips — more evidence collected, more certainty in the number.",
  },
  {
    title: "Market window",
    body: "A wider comparison window folds in more comparable sales, smoothing out any single high or low outlier.",
  },
  {
    title: "Fixed outcomes",
    body: "All nine combinations are precomputed and constant. Selecting one loads a value from this table — nothing recalculates from scratch or drifts over time.",
  },
];

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "9,600+", label: "case files opened this quarter" },
  { value: "97%", label: "top-tier confidence score achievable" },
  { value: "4 days", label: "fastest verified sale on record" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I ran Forensic before I'd even messaged the seller. Nobody haggled once they saw the checklist for themselves.",
    name: "Renata Solis",
    role: "Buyer, 22 purchases",
  },
  {
    quote: "Switching the window from 7 to 90 days moved my asking price by twelve dollars. I would never have caught that on my own.",
    name: "Otis Vance",
    role: "Seller, watches and small leather goods",
  },
  {
    quote: "The flagged item on my sensor scan was disclosed before a single buyer asked. That's the part that kept my return rate at zero.",
    name: "Hana Delacroix",
    role: "Seller, camera and optics",
  },
];
