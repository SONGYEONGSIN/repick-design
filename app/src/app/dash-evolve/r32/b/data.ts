// Deterministic dummy data for the "Census" support-ticket triage console.
// No Math.random / Date.now / argument-less new Date() anywhere — every figure
// here is either a fixed literal or derived from fixed literals by pure functions,
// so server and client render identical output.

import type { LucideIcon } from "lucide-react";
import { Banknote, Gavel, KeyRound, PackageX, RotateCcw, ShieldAlert, Truck } from "lucide-react";

export type CategoryId =
  | "not-as-described"
  | "shipping-delay"
  | "payment-payout"
  | "refund-request"
  | "authenticity-dispute"
  | "account-access"
  | "listing-removal";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Fixed categorical fill — order below is the palette's assignment order, never cycled. */
  color: string;
  /** Icon ink needed to hold contrast against `color` (light fills need dark ink, not white). */
  iconInk: "light" | "dark";
}

// Order is fixed and is the single source of truth for hue assignment (categorical slots
// 1–7 of the validated palette, in order) — every component reads color off this list rather
// than re-deriving or cycling one of its own.
export const CATEGORIES: Category[] = [
  {
    id: "not-as-described",
    name: "Item not as described",
    short: "Not as described",
    description: "Condition, materials, or contents don't match the listing.",
    icon: PackageX,
    color: "#2a78d6",
    iconInk: "light",
  },
  {
    id: "shipping-delay",
    name: "Shipping delay",
    short: "Shipping delay",
    description: "Carrier scan gaps, missed windows, or stalled transit.",
    icon: Truck,
    color: "#eb6834",
    iconInk: "light",
  },
  {
    id: "payment-payout",
    name: "Payment / payout issue",
    short: "Payment / payout",
    description: "Failed charges, held payouts, or duplicate billing.",
    icon: Banknote,
    color: "#1baf7a",
    iconInk: "light",
  },
  {
    id: "refund-request",
    name: "Refund request",
    short: "Refund request",
    description: "Full or partial refunds pending review or payout.",
    icon: RotateCcw,
    color: "#eda100",
    iconInk: "dark",
  },
  {
    id: "authenticity-dispute",
    name: "Authenticity dispute",
    short: "Authenticity",
    description: "Buyer or seller disputes an item's authenticity.",
    icon: ShieldAlert,
    color: "#e87ba4",
    iconInk: "dark",
  },
  {
    id: "account-access",
    name: "Account access",
    short: "Account access",
    description: "Lockouts, 2FA resets, and recovery-email mismatches.",
    icon: KeyRound,
    color: "#008300",
    iconInk: "light",
  },
  {
    id: "listing-removal",
    name: "Listing removal appeal",
    short: "Removal appeal",
    description: "Seller appeals a takedown or enforcement action.",
    icon: Gavel,
    color: "#4a3aa7",
    iconInk: "light",
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;

export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type TicketStatus = "New" | "In Progress" | "Waiting on Customer" | "Escalated";

export interface Ticket {
  id: string;
  categoryId: CategoryId;
  subject: string;
  priority: Priority;
  ageDays: number;
  assignee: string;
  assigneeInitials: string;
  status: TicketStatus;
}

// 24 tickets — the full open backlog this console tracks. Ages are fixed (0–27 days),
// so the "last 7 days" / "last 30 days" window toggle produces two genuinely different,
// reproducible slices rather than a random subset.
export const TICKETS: Ticket[] = [
  // Item not as described (6)
  { id: "TKT-1042", categoryId: "not-as-described", subject: "Sneakers arrived with visible resoling, listing said “like new”", priority: "High", ageDays: 2, assignee: "Priya Nair", assigneeInitials: "PN", status: "In Progress" },
  { id: "TKT-1038", categoryId: "not-as-described", subject: "Vintage jacket missing inner lining shown in photos", priority: "Medium", ageDays: 5, assignee: "Marcus Chen", assigneeInitials: "MC", status: "New" },
  { id: "TKT-1029", categoryId: "not-as-described", subject: "Watch case size doesn't match listed spec", priority: "Medium", ageDays: 9, assignee: "Devon Ruiz", assigneeInitials: "DR", status: "Waiting on Customer" },
  { id: "TKT-1015", categoryId: "not-as-described", subject: "Handbag hardware tarnished, not disclosed in listing", priority: "Low", ageDays: 14, assignee: "Amara Osei", assigneeInitials: "AO", status: "In Progress" },
  { id: "TKT-1004", categoryId: "not-as-described", subject: "Bundle arrived missing one item shown in the cover photo", priority: "Medium", ageDays: 21, assignee: "Leah Whitfield", assigneeInitials: "LW", status: "Escalated" },
  { id: "TKT-0996", categoryId: "not-as-described", subject: "Color noticeably different from listing photos", priority: "Low", ageDays: 27, assignee: "Sam Okafor", assigneeInitials: "SO", status: "New" },
  // Shipping delay (5)
  { id: "TKT-1051", categoryId: "shipping-delay", subject: "Carrier scan shows no movement in 6 days", priority: "High", ageDays: 1, assignee: "Marcus Chen", assigneeInitials: "MC", status: "Escalated" },
  { id: "TKT-1047", categoryId: "shipping-delay", subject: "Package stuck at regional sorting facility", priority: "High", ageDays: 3, assignee: "Devon Ruiz", assigneeInitials: "DR", status: "In Progress" },
  { id: "TKT-1033", categoryId: "shipping-delay", subject: "Tracking hasn't updated since pickup scan", priority: "Medium", ageDays: 7, assignee: "Priya Nair", assigneeInitials: "PN", status: "New" },
  { id: "TKT-1019", categoryId: "shipping-delay", subject: "Delivery window passed by 5 days, no carrier update", priority: "Medium", ageDays: 12, assignee: "Amara Osei", assigneeInitials: "AO", status: "Waiting on Customer" },
  { id: "TKT-1002", categoryId: "shipping-delay", subject: "International shipment held at customs", priority: "Low", ageDays: 24, assignee: "Sam Okafor", assigneeInitials: "SO", status: "In Progress" },
  // Payment / payout issue (4)
  { id: "TKT-1049", categoryId: "payment-payout", subject: "Seller payout not released after delivery confirmation", priority: "Urgent", ageDays: 2, assignee: "Leah Whitfield", assigneeInitials: "LW", status: "Escalated" },
  { id: "TKT-1041", categoryId: "payment-payout", subject: "Card declined at checkout despite valid funds", priority: "Medium", ageDays: 6, assignee: "Marcus Chen", assigneeInitials: "MC", status: "New" },
  { id: "TKT-1022", categoryId: "payment-payout", subject: "Payout routed to a closed bank account", priority: "High", ageDays: 11, assignee: "Devon Ruiz", assigneeInitials: "DR", status: "In Progress" },
  { id: "TKT-1008", categoryId: "payment-payout", subject: "Buyer charged twice for a single order", priority: "High", ageDays: 19, assignee: "Priya Nair", assigneeInitials: "PN", status: "Waiting on Customer" },
  // Refund request (4)
  { id: "TKT-1044", categoryId: "refund-request", subject: "Refund requested after a size-exchange was denied", priority: "Medium", ageDays: 2, assignee: "Amara Osei", assigneeInitials: "AO", status: "New" },
  { id: "TKT-1036", categoryId: "refund-request", subject: "Refund approved but payout not yet processed", priority: "Medium", ageDays: 5, assignee: "Sam Okafor", assigneeInitials: "SO", status: "In Progress" },
  { id: "TKT-1024", categoryId: "refund-request", subject: "Partial refund requested for damaged outer packaging", priority: "Low", ageDays: 10, assignee: "Leah Whitfield", assigneeInitials: "LW", status: "Waiting on Customer" },
  { id: "TKT-1011", categoryId: "refund-request", subject: "Refund disputed after item was returned visibly used", priority: "High", ageDays: 16, assignee: "Marcus Chen", assigneeInitials: "MC", status: "Escalated" },
  // Authenticity dispute (2)
  { id: "TKT-1046", categoryId: "authenticity-dispute", subject: "Buyer requests third-party authentication before accepting", priority: "High", ageDays: 3, assignee: "Devon Ruiz", assigneeInitials: "DR", status: "In Progress" },
  { id: "TKT-1017", categoryId: "authenticity-dispute", subject: "Serial number mismatch flagged by buyer", priority: "Urgent", ageDays: 13, assignee: "Priya Nair", assigneeInitials: "PN", status: "Escalated" },
  // Account access (2)
  { id: "TKT-1050", categoryId: "account-access", subject: "Seller locked out after repeated failed 2FA attempts", priority: "High", ageDays: 1, assignee: "Amara Osei", assigneeInitials: "AO", status: "In Progress" },
  { id: "TKT-1026", categoryId: "account-access", subject: "Buyer can't reset password, recovery email outdated", priority: "Low", ageDays: 9, assignee: "Sam Okafor", assigneeInitials: "SO", status: "New" },
  // Listing removal appeal (1)
  { id: "TKT-1013", categoryId: "listing-removal", subject: "Seller appeals takedown for an alleged trademark match", priority: "Medium", ageDays: 15, assignee: "Leah Whitfield", assigneeInitials: "LW", status: "Waiting on Customer" },
];

export type WindowDays = 7 | 30;

export function ticketsInWindow(windowDays: WindowDays): Ticket[] {
  return TICKETS.filter((t) => t.ageDays <= windowDays);
}

export function ticketsForCategory(categoryId: CategoryId, windowDays: WindowDays): Ticket[] {
  return ticketsInWindow(windowDays).filter((t) => t.categoryId === categoryId);
}

export interface CompositionSlice {
  categoryId: CategoryId;
  count: number;
  pct: number;
}

/**
 * Largest-remainder apportionment: turns raw ticket counts into integer percentages
 * that always sum to exactly 100, so a 10x10 waffle grid always fills exactly 100
 * cells regardless of the window's total ticket count. Deterministic tie-break is
 * "lower category index wins" — never Math.random.
 */
export function compositionFor(windowDays: WindowDays): CompositionSlice[] {
  const tickets = ticketsInWindow(windowDays);
  const total = tickets.length;
  const counts = CATEGORIES.map((c) => tickets.filter((t) => t.categoryId === c.id).length);
  if (total === 0) {
    return CATEGORIES.map((c) => ({ categoryId: c.id, count: 0, pct: 0 }));
  }
  const raw = counts.map((n) => (n / total) * 100);
  const floors = raw.map((v) => Math.floor(v));
  const remainder = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const pct = [...floors];
  for (let k = 0; k < remainder; k++) pct[order[k].i] += 1;
  return CATEGORIES.map((c, i) => ({ categoryId: c.id, count: counts[i], pct: pct[i] }));
}

/** Ordered list of category ids, one per waffle cell (row-major, 100 entries — empty when a window has zero tickets). */
export function waffleSequence(windowDays: WindowDays): CategoryId[] {
  const slices = compositionFor(windowDays);
  return slices.flatMap((s) => Array(s.pct).fill(s.categoryId) as CategoryId[]);
}

export function avgAgeDays(tickets: Ticket[]): number | null {
  if (tickets.length === 0) return null;
  const sum = tickets.reduce((a, t) => a + t.ageDays, 0);
  return Math.round((sum / tickets.length) * 10) / 10;
}

export function formatAvgAge(tickets: Ticket[]): string {
  const avg = avgAgeDays(tickets);
  return avg === null ? "–" : `${avg.toFixed(1)}d`;
}
