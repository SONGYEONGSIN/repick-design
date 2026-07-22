import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Factory,
  Frown,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  LineChart,
  MessageSquareWarning,
  Package,
  Plane,
  Plug,
  Radio,
  Server,
  Settings,
  ShoppingCart,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Truck,
  UserMinus,
  UtensilsCrossed,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { QuadrantId, Tone } from "./tokens";

/* ---------------------------------------------------------------------- */
/* Deterministic math utilities — no Math.random / Date.now / bare new Date() */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Fixed "today" reference for all renewal-window math — never Date.now(). Matches the current session date. */
export const TODAY_ISO = "2026-07-22";

/** Days between two fixed ISO date strings (both operands are hardcoded — deterministic, hydration-safe). */
export function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(`${fromIso}T00:00:00Z`).getTime();
  const b = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Offsets a fixed ISO date string by whole days (deltaDays may be negative). Deterministic given a fixed iso. */
export function addDaysIso(iso: string, deltaDays: number): string {
  const t = new Date(`${iso}T00:00:00Z`).getTime() + deltaDays * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/* ---------------------------------------------------------------------- */
/* Brand / workspace / current user (fully fictional — no session identity) */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Quorum", tagline: "Customer Success & Renewal Health Console" };
export { HeartPulse as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "enterprise", name: "Enterprise Pod", plan: "26 accounts · $5.4M ARR" },
  { id: "midmarket", name: "Mid-Market Pod", plan: "58 accounts · $3.1M ARR" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

/** Fictional persona — invented for this route, unrelated to any real account/session identity. */
export const CURRENT_USER = {
  name: "Priya Kandasamy",
  role: "Customer Success Ops Lead",
  email: "priya.kandasamy@quorumcs.io",
  avatarId: "1541823709867-1b206113eafd",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* Navigation                                                              */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "renewal-health", label: "Renewal Health", Icon: HeartPulse, active: true },
      { id: "accounts", label: "Accounts", Icon: Users },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "health-trends", label: "Health Trends", Icon: LineChart },
      { id: "playbooks", label: "Save Playbooks", Icon: CheckCircle2, badge: "New" },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Time range                                                              */
/* ---------------------------------------------------------------------- */

export type RangeId = "quarter" | "ttm";
export const RANGES: { id: RangeId; label: string }[] = [
  { id: "quarter", label: "This quarter" },
  { id: "ttm", label: "Trailing 12mo" },
];

/* ---------------------------------------------------------------------- */
/* Accounts (book of business) — hand-authored base health/ARR, deterministic */
/* ---------------------------------------------------------------------- */

export type AccountBase = {
  id: string;
  name: string;
  industry: string;
  Icon: LucideIcon;
  csm: string;
  renewalIso: string;
  baseHealth: number;
  baseArr: number;
  seed: number;
};

const CSM_POOL = ["Priya Kandasamy", "Marcus Ondieki", "Sana Belhadj", "Theo Bergstrom", "Ines Cavalcante"];

export const ACCOUNTS_BASE: AccountBase[] = [
  { id: "bramwell", name: "Bramwell & Voss Logistics", industry: "Logistics", Icon: Truck, csm: CSM_POOL[1], renewalIso: "2026-08-14", baseHealth: 42, baseArr: 210_000, seed: 3 },
  { id: "solmark", name: "Solmark Financial Group", industry: "Finance", Icon: Building2, csm: CSM_POOL[3], renewalIso: "2026-09-02", baseHealth: 38, baseArr: 340_000, seed: 10 },
  { id: "pellucid", name: "Pellucid Health Systems", industry: "Healthcare", Icon: Stethoscope, csm: CSM_POOL[2], renewalIso: "2026-08-29", baseHealth: 71, baseArr: 265_000, seed: 17 },
  { id: "ferrow", name: "Ferrow Manufacturing Co.", industry: "Manufacturing", Icon: Factory, csm: CSM_POOL[4], renewalIso: "2027-01-18", baseHealth: 84, baseArr: 410_000, seed: 24 },
  { id: "cobalt", name: "Cobalt Fieldworks", industry: "Field Services", Icon: Wrench, csm: CSM_POOL[1], renewalIso: "2026-10-05", baseHealth: 55, baseArr: 95_000, seed: 31 },
  { id: "anchorage", name: "Anchorage Retail Collective", industry: "Retail", Icon: ShoppingCart, csm: CSM_POOL[0], renewalIso: "2026-09-20", baseHealth: 63, baseArr: 145_000, seed: 38 },
  { id: "driftwood", name: "Driftwood Media Group", industry: "Media", Icon: Radio, csm: CSM_POOL[3], renewalIso: "2027-03-11", baseHealth: 77, baseArr: 88_000, seed: 45 },
  { id: "kestrel", name: "Kestrel Air Cargo", industry: "Air Cargo", Icon: Plane, csm: CSM_POOL[2], renewalIso: "2026-08-05", baseHealth: 33, baseArr: 520_000, seed: 52 },
  { id: "northloom", name: "Northloom Textiles", industry: "Manufacturing", Icon: Factory, csm: CSM_POOL[4], renewalIso: "2026-11-14", baseHealth: 68, baseArr: 72_000, seed: 59 },
  { id: "verdant", name: "Verdant Agritech", industry: "Agriculture", Icon: Package, csm: CSM_POOL[0], renewalIso: "2027-02-01", baseHealth: 88, baseArr: 198_000, seed: 66 },
  { id: "halcyon", name: "Halcyon Wealth Partners", industry: "Finance", Icon: Building2, csm: CSM_POOL[1], renewalIso: "2026-08-22", baseHealth: 47, baseArr: 305_000, seed: 73 },
  { id: "ridgeline", name: "Ridgeline Outdoor Supply", industry: "Retail", Icon: ShoppingCart, csm: CSM_POOL[3], renewalIso: "2027-05-09", baseHealth: 74, baseArr: 61_000, seed: 80 },
  { id: "meridian", name: "Meridian Public Schools Alliance", industry: "Education", Icon: GraduationCap, csm: CSM_POOL[2], renewalIso: "2026-09-30", baseHealth: 58, baseArr: 132_000, seed: 87 },
  { id: "tallowmere", name: "Tallowmere Hospitality Group", industry: "Hospitality", Icon: UtensilsCrossed, csm: CSM_POOL[4], renewalIso: "2026-08-11", baseHealth: 29, baseArr: 178_000, seed: 94 },
  { id: "ferngate", name: "Ferngate Biotech", industry: "Healthcare", Icon: Stethoscope, csm: CSM_POOL[0], renewalIso: "2027-04-16", baseHealth: 91, baseArr: 245_000, seed: 101 },
  { id: "ombra", name: "Ombra Studios", industry: "Media", Icon: Radio, csm: CSM_POOL[1], renewalIso: "2026-12-02", baseHealth: 66, baseArr: 54_000, seed: 108 },
  { id: "solace", name: "Solace Building Materials", industry: "Manufacturing", Icon: Factory, csm: CSM_POOL[3], renewalIso: "2026-10-28", baseHealth: 52, baseArr: 168_000, seed: 115 },
  { id: "wrenfield", name: "Wrenfield Insurance Partners", industry: "Finance", Icon: Building2, csm: CSM_POOL[2], renewalIso: "2027-01-05", baseHealth: 80, baseArr: 289_000, seed: 122 },
  { id: "copperline", name: "Copperline Freight", industry: "Logistics", Icon: Truck, csm: CSM_POOL[4], renewalIso: "2026-09-08", baseHealth: 44, baseArr: 224_000, seed: 129 },
  { id: "everstead", name: "Everstead Realty Group", industry: "Real Estate", Icon: Building2, csm: CSM_POOL[0], renewalIso: "2027-06-19", baseHealth: 69, baseArr: 97_000, seed: 136 },
  { id: "palewell", name: "Palewell Diagnostics", industry: "Healthcare", Icon: Stethoscope, csm: CSM_POOL[1], renewalIso: "2026-08-17", baseHealth: 61, baseArr: 158_000, seed: 143 },
  { id: "grovemont", name: "Grovemont University Partners", industry: "Education", Icon: GraduationCap, csm: CSM_POOL[3], renewalIso: "2027-02-27", baseHealth: 85, baseArr: 121_000, seed: 150 },
  { id: "ashcombe", name: "Ashcombe Retail Ventures", industry: "Retail", Icon: ShoppingCart, csm: CSM_POOL[2], renewalIso: "2026-11-30", baseHealth: 36, baseArr: 76_000, seed: 157 },
  { id: "fennimore", name: "Fennimore Aerospace", industry: "Manufacturing", Icon: Factory, csm: CSM_POOL[4], renewalIso: "2027-03-22", baseHealth: 93, baseArr: 465_000, seed: 164 },
  { id: "locksley", name: "Locksley Data Centers", industry: "Tech Infrastructure", Icon: Server, csm: CSM_POOL[0], renewalIso: "2026-08-02", baseHealth: 24, baseArr: 388_000, seed: 171 },
  { id: "windmere", name: "Windmere Civic Utilities", industry: "Utilities", Icon: Zap, csm: CSM_POOL[1], renewalIso: "2027-05-30", baseHealth: 57, baseArr: 112_000, seed: 178 },
];

/* Quadrant thresholds — always paired with a visible label + boundary line, never inferred from color alone. */
export const HEALTH_THRESHOLD = 60;
export const ARR_THRESHOLD = 150_000;

export function quadrantFor(health: number, arr: number): QuadrantId {
  const healthy = health >= HEALTH_THRESHOLD;
  const highArr = arr >= ARR_THRESHOLD;
  if (healthy && highArr) return "champions";
  if (!healthy && highArr) return "at_risk";
  if (!healthy && !highArr) return "nurture";
  return "stable";
}

/** Small deterministic wobble in [-spread, spread], seeded by account + a salt (no Math.random). */
function wobble(seed: number, salt: number, spread: number): number {
  const m = ((seed * 31 + salt * 17) % 23) - 11; // -11..11
  return round2((m / 11) * spread);
}

export type AccountSnapshot = AccountBase & {
  health: number;
  arr: number;
  quadrant: QuadrantId;
  healthDeltaVsPriorPeriod: number;
};

/** Re-plots the book against a different snapshot per range — quarter is the latest, volatile read;
 *  trailing 12mo is the smoothed year-average read. Both derive deterministically from the same base row. */
export function snapshotFor(range: RangeId): AccountSnapshot[] {
  return ACCOUNTS_BASE.map((a) => {
    const health =
      range === "quarter"
        ? clamp(round2(a.baseHealth + wobble(a.seed, 3, 7)), 2, 99)
        : clamp(round2(a.baseHealth + wobble(a.seed, 11, 3)), 2, 99);
    const arr =
      range === "quarter" ? a.baseArr : Math.round((a.baseArr * (1 + wobble(a.seed, 19, 0.06))) / 100) * 100;
    const priorHealth = range === "quarter" ? clamp(round2(a.baseHealth + wobble(a.seed, 27, 5)), 2, 99) : a.baseHealth;
    return {
      ...a,
      health,
      arr,
      quadrant: quadrantFor(health, arr),
      healthDeltaVsPriorPeriod: round2(health - priorHealth),
    };
  });
}

/* ---------------------------------------------------------------------- */
/* Hero: at-risk ARR trend series — ends exactly at the current snapshot's total (continuity), */
/* deterministic modulo-based wobble, no trigonometry needed.                                    */
/* ---------------------------------------------------------------------- */

export type SeriesPoint = { label: string; value: number };

function genSeriesEndingAt(seed: number, n: number, endValue: number, amp: number): SeriesPoint[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const m = ((seed + i * 13) % 17) - 8; // -8..8
    const drift = ((n - 1 - i) / (n - 1)) * amp * 0.55; // decays toward 0 as i -> n-1
    out.push(round2(clamp(endValue - drift + m * (amp / 24), 0, endValue * 3)));
  }
  out[n - 1] = round2(endValue);
  return out.map((v, i) => ({ label: "", value: v }));
}

export function heroSeries(range: RangeId, atRiskArrTotal: number): SeriesPoint[] {
  if (range === "quarter") {
    const pts = genSeriesEndingAt(41, 13, atRiskArrTotal, atRiskArrTotal * 0.22);
    return pts.map((p, i) => ({ ...p, label: `W${i + 1}` }));
  }
  const pts = genSeriesEndingAt(67, 12, atRiskArrTotal, atRiskArrTotal * 0.3);
  return pts.map((p, i) => ({ ...p, label: `M${i + 1}` }));
}

/* ---------------------------------------------------------------------- */
/* Per-account health trend (detail panel sparkline) — 8-point, deterministic */
/* ---------------------------------------------------------------------- */

export function accountHealthTrend(a: AccountSnapshot): SeriesPoint[] {
  const n = 8;
  const out: SeriesPoint[] = [];
  for (let i = 0; i < n; i++) {
    const m = ((a.seed + i * 9) % 15) - 7; // -7..7
    const drift = (i - (n - 1)) * 0.6; // trends toward current value at i = n-1
    out.push({ label: `W${i + 1}`, value: clamp(round2(a.health - drift + m * 0.7), 1, 99) });
  }
  out[n - 1] = { label: `W${n}`, value: a.health };
  return out;
}

/* ---------------------------------------------------------------------- */
/* Recent support/usage signals per account — deterministic, health-aware selection */
/* ---------------------------------------------------------------------- */

export type SignalCategory = "support" | "usage" | "sentiment" | "org" | "adoption";

export type SignalTemplate = {
  key: string;
  category: SignalCategory;
  tone: Tone;
  Icon: LucideIcon;
  text: (account: AccountBase) => string;
};

const SIGNAL_TEMPLATES: SignalTemplate[] = [
  { key: "ticket_high", category: "support", tone: "down", Icon: MessageSquareWarning, text: (a) => `Escalated support ticket opened by ${a.name}'s admin team — SLA breach risk` },
  { key: "ticket_resolved", category: "support", tone: "up", Icon: CheckCircle2, text: () => `Support backlog cleared — all open tickets resolved within SLA` },
  { key: "usage_drop", category: "usage", tone: "down", Icon: TrendingDown, text: (a) => `Weekly active seats at ${a.name} down versus the trailing 4-week average` },
  { key: "usage_up", category: "usage", tone: "up", Icon: TrendingUp, text: (a) => `Weekly active seats at ${a.name} up versus the trailing 4-week average` },
  { key: "nps_detractor", category: "sentiment", tone: "down", Icon: Frown, text: () => `NPS survey response: detractor (score 0-6) — flagged for CSM follow-up` },
  { key: "nps_promoter", category: "sentiment", tone: "up", Icon: Smile, text: () => `NPS survey response: promoter (score 9-10)` },
  { key: "exec_change", category: "org", tone: "warn", Icon: UserMinus, text: (a) => `Executive sponsor change reported at ${a.name} — relationship continuity at risk` },
  { key: "contract_usage_low", category: "adoption", tone: "warn", Icon: Package, text: () => `Contracted seat utilization below 60% for the second consecutive month` },
  { key: "qbr_completed", category: "org", tone: "neutral", Icon: CalendarCheck2, text: () => `Quarterly business review completed — renewal timeline confirmed` },
  { key: "feature_adopted", category: "adoption", tone: "up", Icon: Sparkles, text: () => `Adopted a new core workflow feature — first use logged this period` },
];

export type Signal = {
  id: string;
  accountId: string;
  dateIso: string;
  category: SignalCategory;
  tone: Tone;
  Icon: LucideIcon;
  title: string;
  templateKey: string;
};

const SIGNAL_DAY_OFFSETS = [4, 9, 16, 24, 33, 45];

/** Deterministically biases which template category is drawn from, based on account health —
 *  distressed accounts surface more support/usage/sentiment risk signals, healthy accounts more adoption wins. */
function categoryPoolFor(health: number): SignalTemplate[] {
  if (health < 45) return SIGNAL_TEMPLATES.filter((t) => t.tone === "down" || t.key === "exec_change" || t.key === "contract_usage_low");
  if (health < HEALTH_THRESHOLD) return SIGNAL_TEMPLATES.filter((t) => t.tone !== "up" || t.key === "ticket_resolved");
  if (health < 80) return SIGNAL_TEMPLATES;
  return SIGNAL_TEMPLATES.filter((t) => t.tone === "up" || t.key === "qbr_completed");
}

export function signalsFor(a: AccountSnapshot): Signal[] {
  const pool = categoryPoolFor(a.health);
  return SIGNAL_DAY_OFFSETS.map((offsetDays, i) => {
    const t = pool[(a.seed + i * 5) % pool.length];
    const dateIso = addDaysIso(TODAY_ISO, -offsetDays);
    return {
      id: `${a.id}__sig${i}`,
      accountId: a.id,
      dateIso,
      category: t.category,
      tone: t.tone,
      Icon: t.Icon,
      title: t.text(a),
      templateKey: t.key,
    };
  });
}

/* ---------------------------------------------------------------------- */
/* Intl formatters                                                        */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");
const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const USD_COMPACT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 0 });
const DATE_MED = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatUsd(v: number): string {
  return USD0.format(v);
}
export function formatUsdCompact(v: number): string {
  return USD_COMPACT.format(v);
}
/** iso: fixed "YYYY-MM-DD" string only (no dynamic Date generation). */
export function formatDate(iso: string): string {
  return DATE_MED.format(new Date(`${iso}T00:00:00Z`));
}

/* Dev-time self-check: confirm quadrant thresholds actually split the book across all four quadrants
 * for the default (quarter) snapshot, so the archetype's four-quadrant scatter is never degenerate. */
export const _QUADRANTS_POPULATED = (() => {
  const snap = snapshotFor("quarter");
  const set = new Set(snap.map((a) => a.quadrant));
  return set.size === 4;
})();
