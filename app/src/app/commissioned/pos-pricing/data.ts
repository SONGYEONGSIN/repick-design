// Tillmark — a point-of-sale vendor's public price list.
//
// The reader is not a customer. There is no account, no current plan and no usage history to
// diagnose, so the page has exactly one job: say what a rollout costs, today and every month,
// before anyone has to ask a salesperson. Two amounts of a different nature (one-time capital vs
// recurring operating cost) are therefore held apart on screen and never summed into one figure.
//
// Determinism: every value here is a fixed literal and every derived amount is integer arithmetic.
// No Math.random, no Date.now, no wall-clock reads — server and client always render identical
// markup, and moving a control only re-runs `quote()` below.

export const BRAND = "Tillmark";
export const REGION_NOTE = "Prices in KRW, VAT excluded";

/** JetBrains Mono, the one display face this work uses. Receipts, terminal readouts and price tags
 *  are the domain's native typography, and it keeps every amount on the same advance width. */
export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Whole-won currency, thousands-separated by hand — no Intl, so no locale drift between the
 *  server render and the client hydration. */
export function won(n: number): string {
  return `₩${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

// ---------------------------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------------------------

export type ProcurementId = "buy" | "installment" | "rental";
export type TierId = "counter" | "chain" | "franchise";

export interface Terminal {
  /** Product name printed on the unit. */
  model: string;
  form: string;
  /** Bought outright, per unit. */
  unitPrice: number;
  /** 20% of `unitPrice`, taken up front on the installment plan. */
  downPayment: number;
  /** Per unit, per month, for 24 months — the financed 80% plus a 6% total fee. */
  installmentMonthly: number;
  /** Per unit, per month, on a 36-month rental. Higher than the installment: it carries
   *  next-business-day replacement and the unit never becomes the operator's. */
  rentalMonthly: number;
}

export interface Tier {
  id: TierId;
  name: string;
  /** Software, per terminal, per month. */
  perTerminal: number;
  /** What this rung adds over the one below it. */
  adds: string;
  terminal: Terminal;
}

export const TIER_ORDER: TierId[] = ["counter", "chain", "franchise"];

export const TIERS: Record<TierId, Tier> = {
  counter: {
    id: "counter",
    name: "Counter",
    perTerminal: 29_000,
    adds: "Card, cash and QR tender, refunds, receipts, cash-drawer close and daily settlement.",
    terminal: {
      model: "T1 Palm",
      form: "handheld, 6in",
      unitPrice: 420_000,
      downPayment: 84_000,
      installmentMonthly: 14_900,
      rentalMonthly: 16_800,
    },
  },
  chain: {
    id: "chain",
    name: "Chain",
    perTerminal: 59_000,
    adds: "Adds stock synced across every store, staff roles and per-shift reports.",
    terminal: {
      model: "T2 Counter",
      form: "countertop, 15in with customer display",
      unitPrice: 790_000,
      downPayment: 158_000,
      installmentMonthly: 27_900,
      rentalMonthly: 31_600,
    },
  },
  franchise: {
    id: "franchise",
    name: "Franchise",
    perTerminal: 89_000,
    adds: "Adds royalty settlement per branch, branch-level P&L and an open sales API.",
    terminal: {
      model: "T3 Lane",
      form: "full lane station, scanner and printer",
      unitPrice: 1_180_000,
      downPayment: 236_000,
      installmentMonthly: 41_700,
      rentalMonthly: 47_200,
    },
  },
};

export interface ProcurementOption {
  id: ProcurementId;
  label: string;
  /** The one-line trade being made, not a feature list. */
  trade: string;
}

export const PROCUREMENTS: ProcurementOption[] = [
  { id: "buy", label: "Buy outright", trade: "Own them on day one. No hardware line ever again." },
  { id: "installment", label: "24-month installment", trade: "20% down, the rest over 24 months at a 6% total fee." },
  { id: "rental", label: "36-month rental", trade: "Nothing down. A failed unit is swapped the next business day." },
];

/** Install, cabling and two hours of staff training, charged once per store. */
export const ONBOARDING_PER_STORE = 120_000;

export const SCALE = {
  stores: { min: 1, max: 12, initial: 3 },
  perStore: { min: 1, max: 6, initial: 2 },
};

/** Above this many terminals the install stops being self-serve. */
export const MANAGED_ROLLOUT_FROM = 24;

// ---------------------------------------------------------------------------------------------
// The single calculation
// ---------------------------------------------------------------------------------------------

/** Plan follows scale, not a click: a reader who has never seen this product cannot be asked to
 *  pick a tier before knowing what the tiers mean. */
export function recommendTier(stores: number, perStore: number): TierId {
  const terminals = stores * perStore;
  if (stores === 1 && terminals <= 3) return "counter";
  if (stores <= 6) return "chain";
  return "franchise";
}

export interface Quote {
  procurement: ProcurementId;
  tier: Tier;
  stores: number;
  perStore: number;
  terminals: number;
  onboarding: number;
  hardwareToday: number;
  dueToday: number;
  software: number;
  hardwareMonthly: number;
  monthly: number;
}

/** The only place either amount is computed. Both headline figures, the three readouts inside the
 *  procurement selector, the recommended tier and both calls to action are read out of the object
 *  this returns — if they were each computed locally they would agree at the default values and
 *  drift apart the moment a control moved. */
export function quote(procurement: ProcurementId, stores: number, perStore: number): Quote {
  const tier = TIERS[recommendTier(stores, perStore)];
  const t = tier.terminal;
  const terminals = stores * perStore;

  const onboarding = ONBOARDING_PER_STORE * stores;
  const hardwareToday =
    procurement === "buy" ? t.unitPrice * terminals : procurement === "installment" ? t.downPayment * terminals : 0;
  const hardwareMonthly =
    procurement === "buy" ? 0 : procurement === "installment" ? t.installmentMonthly * terminals : t.rentalMonthly * terminals;
  const software = tier.perTerminal * terminals;

  return {
    procurement,
    tier,
    stores,
    perStore,
    terminals,
    onboarding,
    hardwareToday,
    dueToday: hardwareToday + onboarding,
    software,
    hardwareMonthly,
    monthly: software + hardwareMonthly,
  };
}

export interface LineItem {
  label: string;
  detail: string;
  amount: number;
  /** `accent` is the share the composition bar fills. */
  tone: "accent" | "muted";
}

export function todayLines(q: Quote): LineItem[] {
  const t = q.tier.terminal;
  const lines: LineItem[] = [];
  if (q.procurement === "buy") {
    lines.push({
      label: `${t.model} terminals`,
      detail: `${q.terminals} × ${won(t.unitPrice)}, bought outright`,
      amount: q.hardwareToday,
      tone: "accent",
    });
  } else if (q.procurement === "installment") {
    lines.push({
      label: `${t.model} down payment`,
      detail: `${q.terminals} × ${won(t.downPayment)}, 20% of list`,
      amount: q.hardwareToday,
      tone: "accent",
    });
  }
  lines.push({
    label: "Install and staff training",
    detail: `${plural(q.stores, "store", "stores")} × ${won(ONBOARDING_PER_STORE)}`,
    amount: q.onboarding,
    tone: q.procurement === "rental" ? "accent" : "muted",
  });
  return lines;
}

export function monthlyLines(q: Quote): LineItem[] {
  const t = q.tier.terminal;
  const lines: LineItem[] = [
    {
      label: `${q.tier.name} plan`,
      detail: `${q.terminals} terminals × ${won(q.tier.perTerminal)}`,
      amount: q.software,
      tone: "accent",
    },
  ];
  if (q.procurement === "installment") {
    lines.push({
      label: "Terminal installment",
      detail: `${q.terminals} × ${won(t.installmentMonthly)}, months 1–24`,
      amount: q.hardwareMonthly,
      tone: "muted",
    });
  } else if (q.procurement === "rental") {
    lines.push({
      label: "Terminal rental",
      detail: `${q.terminals} × ${won(t.rentalMonthly)}, replacement included`,
      amount: q.hardwareMonthly,
      tone: "muted",
    });
  }
  return lines;
}

export function todayNote(q: Quote): string {
  if (q.procurement === "buy") return "One charge. Nothing else is taken before your first month.";
  if (q.procurement === "installment") return "One charge. The remaining 80% is spread over the 24 months below.";
  return "Rental terminals need no deposit — this is the install visit only.";
}

export function monthlyNote(q: Quote): string {
  if (q.procurement === "buy") return "Software only. The terminals are already yours, so nothing here is hardware.";
  if (q.procurement === "installment") return `Falls to ${won(q.software)} in month 25, when the terminals become yours.`;
  return "Terminals stay ours. Return or upgrade them at the end of the 36 months.";
}

/** One line in the recommended-plan panel: how the chosen terminal is actually paid for. */
export function hardwareNote(q: Quote): string {
  const t = q.tier.terminal;
  if (q.procurement === "buy") return `${won(t.unitPrice)} each, yours outright`;
  if (q.procurement === "installment") return `${won(t.downPayment)} down, then ${won(t.installmentMonthly)} each per month`;
  return `${won(t.rentalMonthly)} each per month, no deposit`;
}

export function rolloutNote(q: Quote): string {
  return q.terminals >= MANAGED_ROLLOUT_FROM
    ? `${q.terminals} terminals: a named rollout lead sequences the install store by store.`
    : "Installed and staff-trained within five business days.";
}
