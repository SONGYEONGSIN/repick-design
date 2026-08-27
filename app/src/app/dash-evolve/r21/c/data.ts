import { Boxes, Gauge, PackageSearch, TrendingDown, Truck, Warehouse, type LucideIcon } from "lucide-react";
import type { RiskTier } from "./tokens";

export const BRAND = { name: "Flowline", Icon: Boxes };

export const CURRENT_USER = {
  name: "Theo Marsh",
  role: "Inventory planning lead",
  email: "theo.marsh@flowlinehq.com",
  avatarId: "1552664730-d307ca884978",
};

export const WORKSPACES = [
  { id: "network", name: "Network-wide", plan: "2 warehouses" },
  { id: "wholesale", name: "Wholesale channel", plan: "48 accounts" },
  { id: "dtc", name: "DTC channel", plan: "1 storefront" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "forecast", label: "Inventory forecast", Icon: TrendingDown, active: true },
      { id: "skus", label: "SKU catalog", Icon: PackageSearch },
      { id: "warehouses", label: "Warehouses", Icon: Warehouse },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "purchasing", label: "Purchase orders", Icon: Truck },
      { id: "models", label: "Forecast models", Icon: Gauge, disabled: true },
    ],
  },
];

export type WarehouseId = "all" | "east" | "west";
export const WAREHOUSE_OPTIONS: { id: WarehouseId; label: string; scale: number }[] = [
  { id: "all", label: "All", scale: 1 },
  { id: "east", label: "East DC", scale: 0.58 },
  { id: "west", label: "West DC", scale: 0.42 },
];

export type Horizon = 30 | 60 | 90;

export interface ForecastPoint {
  day: number; // negative = history (actual), 0 = today, positive = forecast
  value: number;
  lower?: number;
  upper?: number;
}

const BASE_UNITS = 5200;
const REORDER_POINT = 1800;

export function buildSeries(horizon: Horizon, scale: number): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const base = r0(BASE_UNITS * scale);

  for (let d = -7; d <= 0; d++) {
    const noise = Math.sin(d * 0.7) * 60 * scale;
    const value = r0(base - d * -42 * scale + noise);
    points.push({ day: d, value });
  }

  const todayValue = points[points.length - 1].value;
  let running = todayValue;
  for (let d = 1; d <= horizon; d++) {
    const dailyBurn = (58 + 9 * Math.sin(d * 0.31)) * scale;
    running = running - dailyBurn;
    const bandWidth = Math.sqrt(d) * 22 * scale;
    points.push({ day: d, value: r0(running), lower: r0(running - bandWidth), upper: r0(running + bandWidth) });
  }
  return points;
}

export function reorderPoint(scale: number): number {
  return r0(REORDER_POINT * scale);
}

export function findCrossDay(points: ForecastPoint[], reorder: number): number | null {
  const forecast = points.filter((p) => p.day >= 0);
  const hit = forecast.find((p) => p.value <= reorder);
  return hit ? hit.day : null;
}

function r0(n: number): number {
  return Math.round(n);
}

export interface Sku {
  id: string;
  name: string;
  code: string;
  onHand: number;
  dailyBurn: number;
  warehouse: Exclude<WarehouseId, "all">;
}

export const SKUS: Sku[] = [
  { id: "s1", name: "Ridge Trail Jacket — Slate", code: "RTJ-SL-M", onHand: 214, dailyBurn: 18.4, warehouse: "east" },
  { id: "s2", name: "Ridge Trail Jacket — Moss", code: "RTJ-MS-M", onHand: 96, dailyBurn: 14.1, warehouse: "east" },
  { id: "s3", name: "Summit Base Layer — Charcoal", code: "SBL-CH-L", onHand: 512, dailyBurn: 9.8, warehouse: "west" },
  { id: "s4", name: "Traverse Daypack 22L", code: "TDP-22-BLK", onHand: 41, dailyBurn: 6.6, warehouse: "east" },
  { id: "s5", name: "Alpine Wool Socks (3pk)", code: "AWS-3PK", onHand: 880, dailyBurn: 22.3, warehouse: "west" },
  { id: "s6", name: "Crest Insulated Bottle 750ml", code: "CIB-750", onHand: 133, dailyBurn: 11.2, warehouse: "west" },
  { id: "s7", name: "Foothill Rain Shell — Navy", code: "FRS-NV-S", onHand: 28, dailyBurn: 5.9, warehouse: "east" },
  { id: "s8", name: "Basecamp Beanie", code: "BCB-ONE", onHand: 640, dailyBurn: 17.5, warehouse: "west" },
  { id: "s9", name: "Ridge Trail Jacket — Slate, XL", code: "RTJ-SL-XL", onHand: 19, dailyBurn: 4.2, warehouse: "east" },
  { id: "s10", name: "Traverse Daypack 22L — Clay", code: "TDP-22-CLY", onHand: 305, dailyBurn: 7.9, warehouse: "west" },
];

export function daysOfCover(sku: Sku): number {
  return Math.round((sku.onHand / sku.dailyBurn) * 10) / 10;
}

export function riskTier(sku: Sku): RiskTier {
  const cover = daysOfCover(sku);
  if (cover < 10) return "critical";
  if (cover < 21) return "watch";
  return "healthy";
}

export const AT_RISK_COUNT = SKUS.filter((s) => riskTier(s) === "critical").length;

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export const SEARCH_ENTRIES = SKUS.map((s) => ({ id: s.id, title: `${s.code} — ${s.name}`, meta: s.warehouse === "east" ? "East DC" : "West DC", Icon: PackageSearch }));
