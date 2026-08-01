import {
  BarChart3,
  BadgeCheck,
  Calculator,
  Clock,
  Database,
  FlaskConical,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Category, Status } from "./data";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Accounting: Calculator,
  Analytics: BarChart3,
  CRM: Users,
  Communication: MessageSquare,
  Marketing: Megaphone,
  Productivity: LayoutGrid,
  Security: ShieldCheck,
  Storage: Database,
};

export const STATUS_STYLE: Record<Status, { icon: LucideIcon; className: string }> = {
  Verified: { icon: BadgeCheck, className: "text-emerald-400" },
  Beta: { icon: FlaskConical, className: "text-amber-400" },
  "In review": { icon: Clock, className: "text-zinc-400" },
};
