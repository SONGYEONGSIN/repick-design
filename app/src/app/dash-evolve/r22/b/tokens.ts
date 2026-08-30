import { CircleCheck, TriangleAlert, OctagonAlert, type LucideIcon } from "lucide-react";
import type { ServiceStatus } from "./data";

// Single brand accent: teal. Contrast measured against a pure-white canvas (WCAG relative
// luminance formula) so the two shades below are used for the roles they were checked against —
// see candidate.md for the full calculation.
//   teal-700 #0f766e  — 5.48:1 on #fff  → safe for text, icons, focus rings (AA normal text 4.5:1)
//   teal-600 #0d9488  — 3.74:1 on #fff  → large-scale fills/graphic objects only (non-text 3:1),
//                                          never body text or small labels
export const ACCENT = {
  text: "text-teal-700",
  textHover: "hover:text-teal-800",
  bg: "bg-teal-700",
  bgHover: "hover:bg-teal-800",
  bgSoft: "bg-teal-50",
  border: "border-teal-700",
  ring: "ring-teal-700",
  stroke: "stroke-teal-600",
  navActive: "bg-teal-50 text-teal-700",
} as const;

interface StatusMeta {
  label: string;
  icon: LucideIcon;
  badge: string; // bg + text + border, on a white/zinc-50 canvas
  strokeClass: string; // graph edge/node stroke — a graphic object, so held to the 3:1 non-text
  // WCAG floor at minimum; degraded/critical use the -700 step (5.0:1 / 6.3:1 measured against
  // white) rather than -500/-600 for a comfortable margin, matching the -700 step already used for
  // this pair's text (badges, KPI figures) so one status reads as one consistent color everywhere.
  fillClass: string; // graph node fill (soft tint)
  dash: string; // SVG dasharray — pattern differentiates status without relying on color alone
}

export const STATUS_META: Record<ServiceStatus, StatusMeta> = {
  healthy: {
    label: "Healthy",
    icon: CircleCheck,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    strokeClass: "stroke-zinc-300",
    fillClass: "fill-white",
    dash: "0",
  },
  degraded: {
    label: "Degraded",
    icon: TriangleAlert,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    strokeClass: "stroke-amber-700",
    fillClass: "fill-amber-50",
    dash: "6 3",
  },
  critical: {
    label: "Critical",
    icon: OctagonAlert,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    strokeClass: "stroke-rose-700",
    fillClass: "fill-rose-50",
    dash: "1.5 3",
  },
};
