import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { Status, IncidentStatus, Severity } from "./data";

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  /** Text + icon color classes — always AA on zinc-950/900 surfaces. */
  text: string;
  /** Background used for filled status dots. */
  dot: string;
  /** Badge pill classes (bg + border + text). */
  badge: string;
}

export const SERVICE_STATUS_META: Record<Status, StatusMeta> = {
  operational: {
    label: "Operational",
    icon: CheckCircle2,
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    text: "text-amber-300",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  down: {
    label: "Down",
    icon: XCircle,
    text: "text-red-300",
    dot: "bg-red-400",
    badge: "bg-red-400/10 text-red-300 border-red-400/30",
  },
};

export const INCIDENT_STATUS_META: Record<IncidentStatus, StatusMeta> = {
  investigating: {
    label: "Investigating",
    icon: Search,
    text: "text-red-300",
    dot: "bg-red-400",
    badge: "bg-red-400/10 text-red-300 border-red-400/30",
  },
  monitoring: {
    label: "Monitoring",
    icon: Eye,
    text: "text-amber-300",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  minor: "Minor",
  major: "Major",
  critical: "Critical",
};

export const SEVERITY_TEXT: Record<Severity, string> = {
  minor: "text-zinc-300",
  major: "text-amber-300",
  critical: "text-red-300",
};

export const STATUS_FILTER_OPTIONS: Array<{ key: Status; meta: StatusMeta }> = [
  { key: "operational", meta: SERVICE_STATUS_META.operational },
  { key: "degraded", meta: SERVICE_STATUS_META.degraded },
  { key: "down", meta: SERVICE_STATUS_META.down },
];
