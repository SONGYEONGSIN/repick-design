import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Bug,
  Lock,
  Compass,
  Plug,
  Gauge,
  Sparkles,
  CircleHelp,
} from "lucide-react";

/**
 * Category identity for the backlog waffle.
 *
 * Order matters: it is the fixed categorical hue order from the dataviz palette
 * (blue, orange, aqua, yellow, magenta, green, violet, red), and the waffle renders
 * each category as a *contiguous* run of cells in this same order — so the only
 * hues that ever sit edge-to-edge are adjacent slots, which is the pairing the
 * palette's CVD validation actually covers (worst adjacent Delta E 9.1 light,
 * OKLab x100, >= 8 target). Re-ordering categories would re-pair hues that were
 * never validated against each other.
 *
 * Every cell also carries its category's icon, so identity never rides on hue
 * alone (three of these eight light-mode steps — aqua, yellow, magenta — sit
 * under 3:1 contrast on a white surface by the palette's own documentation; the
 * icon + the legend's text label are the mitigation, never the tint by itself).
 */
export type CategoryId =
  | "billing"
  | "bug"
  | "access"
  | "onboarding"
  | "integration"
  | "performance"
  | "feature"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Full-saturation categorical hex — used for the icon glyph and legend swatch ring. */
  hex: string;
  /** Hand-picked light tint of the same hue, used as the waffle cell fill. */
  tint: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "billing",
    label: "Billing",
    description: "Invoices, charges, plan changes",
    icon: CreditCard,
    hex: "#2a78d6",
    tint: "#eaf2fc",
  },
  {
    id: "bug",
    label: "Bug report",
    description: "Defects in the product",
    icon: Bug,
    hex: "#eb6834",
    tint: "#fdeee6",
  },
  {
    id: "access",
    label: "Access",
    description: "Login, SSO, permissions",
    icon: Lock,
    hex: "#1baf7a",
    tint: "#e6f6f0",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    description: "Setup and first-run issues",
    icon: Compass,
    hex: "#eda100",
    tint: "#fcf2df",
  },
  {
    id: "integration",
    label: "Integration",
    description: "Third-party connections",
    icon: Plug,
    hex: "#e87ba4",
    tint: "#fbebf1",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Speed and reliability",
    icon: Gauge,
    hex: "#008300",
    tint: "#e6f5e6",
  },
  {
    id: "feature",
    label: "Feature request",
    description: "Product suggestions",
    icon: Sparkles,
    hex: "#4a3aa7",
    tint: "#ecebfa",
  },
  {
    id: "other",
    label: "Other",
    description: "Everything uncategorized",
    icon: CircleHelp,
    hex: "#e34948",
    tint: "#fbe9e9",
  },
];

export function categoryById(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category id: ${id}`);
  return found;
}
