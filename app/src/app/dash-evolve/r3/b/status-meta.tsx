import {
  Truck,
  PackagePlus,
  ParkingCircle,
  AlertTriangle,
  PowerOff,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { DeliveryStatus, VehicleStatus } from "./data";

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  /** Text + icon color classes — always AA on zinc-950/900 surfaces. */
  text: string;
  /** Background used for filled dots / badge chips. */
  dot: string;
  /** Badge pill classes (bg + border + text). */
  badge: string;
  /** Whether this status should pulse on the map (active + needs attention). */
  pulse: boolean;
}

export const VEHICLE_STATUS_META: Record<VehicleStatus, StatusMeta> = {
  "En Route": {
    label: "En route",
    icon: Truck,
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    badge: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
    pulse: true,
  },
  Loading: {
    label: "Loading",
    icon: PackagePlus,
    text: "text-cyan-300",
    dot: "bg-cyan-300",
    badge: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
    pulse: false,
  },
  Idle: {
    label: "Idle",
    icon: ParkingCircle,
    text: "text-zinc-300",
    dot: "bg-zinc-400",
    badge: "bg-white/5 text-zinc-300 border-white/10",
    pulse: false,
  },
  Delayed: {
    label: "Delayed",
    icon: AlertTriangle,
    text: "text-amber-300",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    pulse: true,
  },
  Offline: {
    label: "Offline",
    icon: PowerOff,
    text: "text-zinc-400",
    dot: "bg-zinc-500",
    badge: "bg-white/5 text-zinc-400 border-white/10",
    pulse: false,
  },
};

export const DELIVERY_STATUS_META: Record<DeliveryStatus, StatusMeta> = {
  "En Route": VEHICLE_STATUS_META["En Route"],
  Delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    pulse: false,
  },
  Delayed: VEHICLE_STATUS_META.Delayed,
  Failed: {
    label: "Failed",
    icon: XCircle,
    text: "text-rose-300",
    dot: "bg-rose-400",
    badge: "bg-rose-400/10 text-rose-300 border-rose-400/30",
    pulse: false,
  },
};

export const ALL_STATUS_OPTIONS: Array<{
  key: VehicleStatus | DeliveryStatus;
  domain: "vehicle" | "delivery" | "both";
  meta: StatusMeta;
}> = [
  { key: "En Route", domain: "both", meta: VEHICLE_STATUS_META["En Route"] },
  { key: "Loading", domain: "vehicle", meta: VEHICLE_STATUS_META.Loading },
  { key: "Idle", domain: "vehicle", meta: VEHICLE_STATUS_META.Idle },
  { key: "Delayed", domain: "both", meta: VEHICLE_STATUS_META.Delayed },
  { key: "Offline", domain: "vehicle", meta: VEHICLE_STATUS_META.Offline },
  { key: "Delivered", domain: "delivery", meta: DELIVERY_STATUS_META.Delivered },
  { key: "Failed", domain: "delivery", meta: DELIVERY_STATUS_META.Failed },
];
