// app/src/app/blog-evolve/r2/c/type-meta.ts
//
// Presentation metadata for each release type — separate from data.ts so the fixture stays pure
// data. Every type pairs a fixed hue (for the generated cover art) with a text label and an icon:
// colour never carries meaning alone (page-brief-core §3), so the badge always renders the label
// and the icon beside the colour, and the spine dot is followed by the same label in the index.
import { Rocket, GitBranch, Wrench, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ReleaseType } from "./data";

export const TYPE_META: Record<
  ReleaseType,
  {
    label: string;
    icon: LucideIcon;
    hue: number;
    badgeBg: string;
    badgeText: string;
    dot: string;
    ring: string;
  }
> = {
  major: {
    label: "Major",
    icon: Rocket,
    hue: 217,
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    dot: "bg-blue-600",
    ring: "ring-blue-600",
  },
  minor: {
    label: "Minor",
    icon: GitBranch,
    hue: 152,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    dot: "bg-emerald-600",
    ring: "ring-emerald-600",
  },
  patch: {
    label: "Patch",
    icon: Wrench,
    hue: 262,
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    dot: "bg-violet-600",
    ring: "ring-violet-600",
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    hue: 347,
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    dot: "bg-rose-600",
    ring: "ring-rose-600",
  },
};
