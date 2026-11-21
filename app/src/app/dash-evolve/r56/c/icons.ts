// Icon lookups kept separate from data.ts so the data module stays plain, serializable data with
// no React/lucide dependency.

import {
  Router,
  Smartphone,
  ShieldCheck,
  LayoutGrid,
  Search,
  DollarSign,
  Waypoints,
  Image as ImageIcon,
  Workflow,
  RadioTower,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { IconKey, Status } from "./data";

export const NODE_ICONS: Record<IconKey, LucideIcon> = {
  router: Router,
  smartphone: Smartphone,
  shield: ShieldCheck,
  grid: LayoutGrid,
  search: Search,
  dollar: DollarSign,
  route: Waypoints,
  image: ImageIcon,
  workflow: Workflow,
  radio: RadioTower,
  database: Database,
};

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  text: string;
  badgeBg: string;
  badgeBorder: string;
  dot: string;
}

export const STATUS_META: Record<Status, StatusMeta> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    text: "text-emerald-700",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    dot: "bg-emerald-600",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    text: "text-amber-700",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    dot: "bg-amber-600",
  },
  down: {
    label: "Down",
    icon: XCircle,
    text: "text-red-700",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    dot: "bg-red-600",
  },
};
