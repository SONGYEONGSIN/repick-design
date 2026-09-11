/**
 * Portage — deterministic dummy data (r25 / candidate c).
 * No Math.random / Date.now / new Date() anywhere. Every derived total below is computed from the
 * same nine routes with a reduce, so per-zone and per-status subtotals are guaranteed to sum to the
 * citywide totals rather than being retyped by hand.
 */

import {
  BarChart3,
  Building2,
  Handshake,
  LayoutDashboard,
  MapPin,
  OctagonAlert,
  Route as RouteIcon,
  Store,
  Users,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { STATUS_LABEL, type RouteStatus } from "./tokens";

export const BRAND = { name: "Portage", Icon: RouteIcon };

export const WORKSPACES = [
  { id: "seoul", name: "Seoul Metro", plan: "Primary region" },
  { id: "busan", name: "Busan Coastal", plan: "Secondary region" },
  { id: "incheon", name: "Incheon Bay", plan: "Pilot region" },
];

export const CURRENT_USER = {
  name: "Jiho Kwon",
  role: "Dispatch lead",
  email: "jiho.kwon@portage.app",
  avatarId: "1544005313-94ddf0286df2",
};

export const NAV_SECTIONS: { id: string; title: string; items: { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean }[] }[] = [
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "board", label: "Dispatch board", Icon: LayoutDashboard, active: true },
      { id: "planner", label: "Route planner", Icon: Waypoints },
      { id: "drivers", label: "Driver roster", Icon: Users },
    ],
  },
  {
    id: "network",
    title: "Network",
    items: [
      { id: "zones", label: "Zones & hubs", Icon: Building2 },
      { id: "sellers", label: "Sellers", Icon: Store },
      { id: "partners", label: "Partners", Icon: Handshake, disabled: true },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    items: [
      { id: "performance", label: "Performance", Icon: BarChart3 },
      { id: "exceptions", label: "Exceptions", Icon: OctagonAlert },
    ],
  },
];

export type Zone = { id: string; name: string; angleDeg: number; capacity: number };

export const ZONES: Zone[] = [
  { id: "gangnam", name: "Gangnam", angleDeg: 0, capacity: 120 },
  { id: "songpa", name: "Songpa", angleDeg: 60, capacity: 90 },
  { id: "seongdong", name: "Seongdong", angleDeg: 120, capacity: 60 },
  { id: "mapo", name: "Mapo", angleDeg: 180, capacity: 130 },
  { id: "eunpyeong", name: "Eunpyeong", angleDeg: 240, capacity: 50 },
  { id: "yongsan", name: "Yongsan", angleDeg: 300, capacity: 70 },
];

export const HUB_NAME = "Seongsu Sort Hub";

export type Route = {
  id: string;
  zoneId: string;
  angleOffsetDeg: number; // offset from the zone's center angle, so two routes in one zone don't overlap
  driver: string;
  vanId: string;
  avatarId: string;
  stopsTotal: number;
  stopsDone: number;
  items: number;
  weightKg: number;
  status: RouteStatus;
  etaLabel: string;
  progressPct: number;
  trend7d: number[];
};

export const ROUTES: Route[] = [
  { id: "RT-104", zoneId: "gangnam", angleOffsetDeg: -12, driver: "Jae-won Lim", vanId: "V-12", avatarId: "1507003211169-0a1dd7228f2d", stopsTotal: 8, stopsDone: 6, items: 54, weightKg: 118, status: "on-time", etaLabel: "14:20", progressPct: 72, trend7d: [88, 90, 92, 89, 94, 93, 95] },
  { id: "RT-108", zoneId: "gangnam", angleOffsetDeg: 12, driver: "Soo-ah Baek", vanId: "V-19", avatarId: "1494790108377-be9c29b29330", stopsTotal: 7, stopsDone: 3, items: 38, weightKg: 96, status: "at-risk", etaLabel: "15:05", progressPct: 40, trend7d: [80, 78, 82, 75, 79, 77, 74] },
  { id: "RT-201", zoneId: "songpa", angleOffsetDeg: -12, driver: "Min-jun Cho", vanId: "V-05", avatarId: "1438761681033-6461ffad8d80", stopsTotal: 5, stopsDone: 5, items: 41, weightKg: 88, status: "completed", etaLabel: "Arrived 13:40", progressPct: 100, trend7d: [91, 93, 90, 95, 96, 94, 97] },
  { id: "RT-205", zoneId: "songpa", angleOffsetDeg: 12, driver: "Hana Yoon", vanId: "V-22", avatarId: "1500648767791-00dcc994a43e", stopsTotal: 6, stopsDone: 2, items: 22, weightKg: 51, status: "on-time", etaLabel: "15:40", progressPct: 33, trend7d: [85, 87, 88, 86, 90, 89, 91] },
  { id: "RT-302", zoneId: "seongdong", angleOffsetDeg: 0, driver: "Tae-yang Oh", vanId: "V-03", avatarId: "1500375592092-40eb2168fd21", stopsTotal: 4, stopsDone: 4, items: 33, weightKg: 70, status: "completed", etaLabel: "Arrived 12:55", progressPct: 100, trend7d: [93, 92, 94, 95, 93, 96, 95] },
  { id: "RT-410", zoneId: "mapo", angleOffsetDeg: -12, driver: "Yuna Seo", vanId: "V-17", avatarId: "1517841905240-472988babdf9", stopsTotal: 9, stopsDone: 5, items: 61, weightKg: 142, status: "delayed", etaLabel: "16:10", progressPct: 55, trend7d: [70, 74, 68, 72, 65, 69, 63] },
  { id: "RT-414", zoneId: "mapo", angleOffsetDeg: 12, driver: "Do-yun Kang", vanId: "V-08", avatarId: "1544005313-94ddf0286df2", stopsTotal: 6, stopsDone: 6, items: 47, weightKg: 101, status: "completed", etaLabel: "Arrived 14:05", progressPct: 100, trend7d: [89, 91, 90, 92, 94, 93, 95] },
  { id: "RT-506", zoneId: "eunpyeong", angleOffsetDeg: 0, driver: "Areum Jung", vanId: "V-11", avatarId: "1494790108377-be9c29b29330", stopsTotal: 5, stopsDone: 3, items: 24, weightKg: 58, status: "on-time", etaLabel: "15:55", progressPct: 60, trend7d: [84, 86, 85, 88, 87, 89, 90] },
  { id: "RT-601", zoneId: "yongsan", angleOffsetDeg: 0, driver: "Ha-eun Moon", vanId: "V-14", avatarId: "1500648767791-00dcc994a43e", stopsTotal: 7, stopsDone: 4, items: 36, weightKg: 84, status: "at-risk", etaLabel: "15:15", progressPct: 57, trend7d: [79, 81, 77, 80, 76, 78, 73] },
];

export const ACTIVE_ROUTES = ROUTES.filter((r) => r.status !== "completed");
export const NEEDS_ATTENTION_ROUTES = ROUTES.filter((r) => r.status === "at-risk" || r.status === "delayed");

export const ITEMS_TODAY = ROUTES.reduce((sum, r) => sum + r.items, 0);
export const WEIGHT_TODAY_KG = ROUTES.reduce((sum, r) => sum + r.weightKg, 0);

export type ZoneStat = Zone & { items: number; weightKg: number; routeCount: number; loadPct: number };

export const ZONE_STATS: ZoneStat[] = ZONES.map((z) => {
  const routes = ROUTES.filter((r) => r.zoneId === z.id);
  const items = routes.reduce((sum, r) => sum + r.items, 0);
  const weightKg = routes.reduce((sum, r) => sum + r.weightKg, 0);
  return { ...z, items, weightKg, routeCount: routes.length, loadPct: Math.round((items / z.capacity) * 100) };
});

// Sanity: zone item/weight subtotals sum back to the citywide totals above (356 items, 808 kg).
export const ZONE_ITEMS_TOTAL = ZONE_STATS.reduce((sum, z) => sum + z.items, 0);
export const ZONE_WEIGHT_TOTAL = ZONE_STATS.reduce((sum, z) => sum + z.weightKg, 0);

// Citywide on-time rate, by period. "7d" values are averaged for the KPI card rather than typed
// separately, so the headline number can never drift from the series behind the trend chart.
export const TREND_TODAY: { label: string; value: number }[] = [
  { label: "09:00", value: 88 },
  { label: "10:00", value: 90 },
  { label: "11:00", value: 89 },
  { label: "12:00", value: 92 },
  { label: "13:00", value: 94 },
  { label: "14:00", value: 93 },
  { label: "15:00", value: 95 },
  { label: "16:00", value: 96 },
  { label: "17:00", value: 94 },
];

export const TREND_7D: { label: string; value: number }[] = [
  { label: "Mon", value: 90 },
  { label: "Tue", value: 88 },
  { label: "Wed", value: 91 },
  { label: "Thu", value: 93 },
  { label: "Fri", value: 89 },
  { label: "Sat", value: 94 },
  { label: "Sun", value: 96 },
];

export const TREND_30D: { label: string; value: number }[] = [
  { label: "Wk 1", value: 87 },
  { label: "Wk 2", value: 90 },
  { label: "Wk 3", value: 92 },
  { label: "Wk 4", value: 94 },
];

export const ON_TIME_RATE_7D = Math.round((TREND_7D.reduce((sum, p) => sum + p.value, 0) / TREND_7D.length) * 10) / 10;

export const SEARCH_ENTRIES: { id: string; title: string; meta: string; Icon: LucideIcon; kind: "route" | "zone" | "driver" }[] = [
  ...ROUTES.map((r) => ({
    id: r.id,
    title: `${r.id} · ${ZONES.find((z) => z.id === r.zoneId)?.name} pickup route`,
    meta: `${r.driver} · ${STATUS_LABEL[r.status]}`,
    Icon: RouteIcon,
    kind: "route" as const,
  })),
  ...ZONES.map((z) => ({
    id: `zone-${z.id}`,
    title: `${z.name} · Zone overview`,
    meta: `Capacity ${z.capacity}/day`,
    Icon: MapPin,
    kind: "zone" as const,
  })),
  ...ROUTES.map((r) => ({
    id: `driver-${r.vanId}`,
    title: `${r.driver} · Driver`,
    meta: `Van ${r.vanId}`,
    Icon: Users,
    kind: "driver" as const,
  })),
];

export const intFmt = new Intl.NumberFormat("en-US");
export const pctFmt1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatInt(n: number): string {
  return intFmt.format(n);
}

export function formatKg(n: number): string {
  return `${intFmt.format(n)} kg`;
}

export function formatPct1(n: number): string {
  return `${pctFmt1.format(n)}%`;
}
