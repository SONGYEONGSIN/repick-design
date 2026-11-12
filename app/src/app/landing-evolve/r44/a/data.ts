import { BadgeCheck, ShieldCheck, Package, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StageKey = "listed" | "inspected" | "authenticated" | "shipped";

export interface Stage {
  key: StageKey;
  label: string;
  confidence: number;
  eta: number;
  badges: number;
}

// Three synchronized surfaces (confidence / badge count / ETA) are a plain
// lookup table indexed by stage, not a formula — no reduce, no min/max, so
// there is no tie condition to get wrong. The non-trivial default
// (stageIndex = 2, "Authenticated") lives in page.tsx.
export const STAGES: Stage[] = [
  { key: "listed", label: "Listed", confidence: 40, eta: 9, badges: 1 },
  { key: "inspected", label: "Inspected", confidence: 65, eta: 6, badges: 2 },
  { key: "authenticated", label: "Authenticated", confidence: 88, eta: 3, badges: 3 },
  { key: "shipped", label: "Shipped", confidence: 97, eta: 1, badges: 4 },
];

export interface ProofBadge {
  icon: LucideIcon;
  label: string;
}

// Ordered so stage.badges (1-4) slices the same list every stage builds on.
export const BADGE_POOL: ProofBadge[] = [
  { icon: BadgeCheck, label: "AI match 94%" },
  { icon: ShieldCheck, label: "Seller verified" },
  { icon: Package, label: "Condition checked" },
  { icon: Tag, label: "Price fair" },
];

export const PRODUCT = {
  name: "Full-frame mirrorless kit, lens included",
  category: "Electronics",
  photo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  alt: "A mirrorless camera body with a lens attached, resting on a plain neutral background",
  tier: "ID-Verified",
  grade: "Good (7/10)",
  resale: 690,
  retail: 1650,
  whyMatched:
    "Matched on shutter count and kit completeness against your saved search. The seller's ID is on file, and the condition photos were taken separately for the body, the lens mount, and the LCD — not just one hero shot.",
};

export function discountPct(retail: number, resale: number): number {
  return Math.round(((retail - resale) / retail) * 100);
}
