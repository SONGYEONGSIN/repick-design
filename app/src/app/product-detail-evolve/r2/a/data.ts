// Meridian Exchange — Meridian FE 35mm f/1.4 ASPH product-detail data.
// Every value below is a fixed literal or a pure function of fixed literals: no Math.random,
// no Date.now, no bare `new Date()`. Nothing here derives from the clock at render time, so
// server and client markup always match.

export const BRAND = "Meridian Exchange";
export const PRODUCT_NAME = "Meridian FE 35mm f/1.4 ASPH";
export const SKU_LINE = "Sony E-mount · full-frame prime · Certified Pre-Owned Program";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function usd(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const s = Math.trunc(Math.abs(amount)).toString();
  return `${sign}$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// ---------------------------------------------------------------- Condition grades (Certified column)

export type GradeId = "mint" | "excellent" | "good";

export interface Grade {
  id: GradeId;
  label: string;
  price: number;
  cosmeticScore: string;
  cosmeticNote: string;
  wear: "faint" | "light" | "moderate";
  actuationsNote: string;
  accessories: string[];
  warrantyMonths: number;
}

export const GRADES: Grade[] = [
  {
    id: "mint",
    label: "Mint",
    price: 1189,
    cosmeticScore: "9.8 / 10",
    cosmeticNote: "No visible marks under macro inspection",
    wear: "faint",
    actuationsNote: "~2,100 aperture cycles on file",
    accessories: ["Original front & rear caps", "OEM hood", "Padded case", "Manufacturer strap"],
    warrantyMonths: 6,
  },
  {
    id: "excellent",
    label: "Excellent",
    price: 1049,
    cosmeticScore: "9.2 / 10",
    cosmeticNote: "Faint brassing on two mount screws, glass flawless",
    wear: "light",
    actuationsNote: "~14,000 aperture cycles on file",
    accessories: ["Generic front & rear caps", "OEM hood", "Soft pouch"],
    warrantyMonths: 6,
  },
  {
    id: "good",
    label: "Good",
    price: 899,
    cosmeticScore: "8.4 / 10",
    cosmeticNote: "Light barrel wear, one hairline mark outside the optical path",
    wear: "moderate",
    actuationsNote: "~31,000 aperture cycles on file",
    accessories: ["Generic front & rear caps"],
    warrantyMonths: 3,
  },
];

// ---------------------------------------------------------------- New, sealed column (fixed reference)

export const NEW_UNIT = {
  price: 1699,
  cosmeticScore: "10 / 10 — factory sealed",
  cosmeticNote: "Unopened manufacturer packaging",
  actuationsNote: "0 — unused",
  accessories: ["OEM hood", "OEM caps", "Padded case", "Strap", "Warranty registration card"],
  warrantyMonths: 24,
};

// ---------------------------------------------------------------- Shared protection plan control

export const PLAN_COST_CERTIFIED = 89;
export const PLAN_COST_NEW = 149;
export const PLAN_EXTRA_MONTHS = 12;

// ---------------------------------------------------------------- Gallery angle (shared control)

export type AngleId = "front" | "mount";

export const ANGLES: { id: AngleId; label: string }[] = [
  { id: "front", label: "Front element" },
  { id: "mount", label: "Mount side" },
];

// ---------------------------------------------------------------- Spec comparison groups

export interface SpecRow {
  label: string;
  certified: string;
  new: string;
}

export interface SpecGroup {
  id: string;
  title: string;
  rows: SpecRow[];
}

export function buildSpecGroups(grade: Grade, planEnabled: boolean): SpecGroup[] {
  const certWarranty = grade.warrantyMonths + (planEnabled ? PLAN_EXTRA_MONTHS : 0);
  const newWarranty = NEW_UNIT.warrantyMonths + (planEnabled ? PLAN_EXTRA_MONTHS : 0);

  return [
    {
      id: "optical",
      title: "Optical & build",
      rows: [
        { label: "Focal length", certified: "35mm", new: "35mm" },
        { label: "Maximum aperture", certified: "f/1.4", new: "f/1.4" },
        { label: "Elements / groups", certified: "12 elements / 9 groups", new: "12 elements / 9 groups" },
        { label: "Cosmetic condition", certified: grade.cosmeticScore, new: NEW_UNIT.cosmeticScore },
        { label: "Weather sealing", certified: "Yes — gaskets inspected, intact", new: "Yes — factory fresh" },
      ],
    },
    {
      id: "electronics",
      title: "Autofocus & electronics",
      rows: [
        { label: "AF motor", certified: "Linear XD — bench tested", new: "Linear XD" },
        { label: "Firmware", certified: "Updated to v3.2", new: "v3.2, factory" },
        { label: "Aperture cycle count", certified: grade.actuationsNote, new: NEW_UNIT.actuationsNote },
      ],
    },
    {
      id: "box",
      title: "In the box & coverage",
      rows: [
        { label: "Included accessories", certified: grade.accessories.join(", "), new: NEW_UNIT.accessories.join(", ") },
        { label: "Warranty coverage", certified: `${certWarranty} months`, new: `${newWarranty} months` },
      ],
    },
    {
      id: "compatibility",
      title: "Compatibility",
      rows: [
        { label: "Mount", certified: "Sony E", new: "Sony E" },
        { label: "Filter thread", certified: "67mm", new: "67mm" },
        { label: "In-body stabilization support", certified: "Yes, 5-axis", new: "Yes, 5-axis" },
      ],
    },
  ];
}

// ---------------------------------------------------------------- Reviews

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  gradeBought: GradeId | "new";
  date: string;
  title: string;
  body: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "D. Okafor",
    rating: 5,
    gradeBought: "excellent",
    date: "2026-06-14",
    title: "Exactly as graded",
    body: "The brassing they mentioned on the mount screws is there if you go looking for it — glass is spotless. Saved about $650 versus new.",
  },
  {
    id: "r2",
    author: "M. Sorensen",
    rating: 5,
    gradeBought: "mint",
    date: "2026-05-02",
    title: "Could not tell it apart from new",
    body: "Paid the Mint premium over Excellent and it was worth it for a copy that looks factory-fresh. Autofocus is silent and fast.",
  },
  {
    id: "r3",
    author: "J. Park",
    rating: 4,
    gradeBought: "good",
    date: "2026-04-21",
    title: "Great value, minor wear as described",
    body: "Barrel has a bit of shine near the focus ring but the optics are perfect. Bought Good grade specifically to save for a second body.",
  },
  {
    id: "r4",
    author: "A. Reyes",
    rating: 5,
    gradeBought: "new",
    date: "2026-03-30",
    title: "Wanted factory sealed for resale value",
    body: "Went new since I plan to resell in a year and wanted the full accessory kit intact. The certified units looked tempting on price though.",
  },
  {
    id: "r5",
    author: "T. Whitfield",
    rating: 3,
    gradeBought: "excellent",
    date: "2026-03-11",
    title: "Good glass, hood was generic not OEM",
    body: "Listing was accurate about the hood substitution — just wish it had been called out more prominently before checkout.",
  },
  {
    id: "r6",
    author: "S. Lindqvist",
    rating: 5,
    gradeBought: "mint",
    date: "2026-02-19",
    title: "Care+ plan paid for itself",
    body: "Dropped it off a tripod within the first month; the extended coverage handled the repair with no fuss.",
  },
];

export const RATING_SUMMARY = {
  average: 4.5,
  count: REVIEWS.length,
};
