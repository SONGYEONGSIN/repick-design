/**
 * Keel — dummy data for the sales pipeline workspace.
 * Entirely deterministic static literals — no random or current-time-based generation.
 * The "today" anchor (TODAY_ISO) is a fictional dataset reference point, unrelated to the real system clock.
 * Aggregates (total pipeline, weighted forecast, column sums, etc.) are computed at runtime from
 * this array, so they always stay in sync (no hardcoded totals).
 */

export const TODAY_ISO = "2026-07-15";

export type Stage = "lead" | "qualify" | "proposal" | "negotiation";
export type Health = "healthy" | "at_risk" | "stalled";
export type Period = "quarter" | "prev_quarter" | "year";

export interface Owner {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Deal {
  id: string;
  company: string;
  title: string;
  amount: number; // KRW
  ownerId: string;
  stage: Stage;
  probability: number; // 0–100
  daysInStage: number;
  closeDate: string; // ISO YYYY-MM-DD
  health: Health;
  tags: string[];
  isNew?: boolean;
}

export const CURRENT_USER_ID = "u5";

const AV = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=200&auto=format&fit=facearea&facepad=2.5`;

export const owners: Owner[] = [
  { id: "u1", name: "Yujin Jung", role: "Enterprise AE", avatarUrl: AV("photo-1472099645785-5658abf4ff4e") },
  { id: "u2", name: "Dohyun Kim", role: "Account Executive", avatarUrl: AV("photo-1500648767791-00dcc994a43e") },
  { id: "u3", name: "Seoyeon Lee", role: "Sales Development", avatarUrl: AV("photo-1519244703995-f4e0f30006d5") },
  { id: "u4", name: "Junho Park", role: "Account Executive", avatarUrl: AV("photo-1544005313-94ddf0286df2") },
  { id: "u5", name: "Jiwoo Choi", role: "Sales Lead", avatarUrl: AV("photo-1607746882042-944635dfe10e") },
  { id: "u6", name: "Sohee Han", role: "Account Executive", avatarUrl: AV("photo-1633332755192-727a05c4013d") },
];

const ownerMap = new Map(owners.map((o) => [o.id, o]));
export function getOwner(id: string): Owner {
  const o = ownerMap.get(id);
  if (!o) throw new Error(`unknown owner: ${id}`);
  return o;
}

export const STAGE_ORDER: Stage[] = ["lead", "qualify", "proposal", "negotiation"];

export const stageMeta: Record<
  Stage,
  { label: string; dotClass: string; accentClass: string; description: string }
> = {
  lead: { label: "Lead", dotClass: "bg-zinc-400", accentClass: "bg-zinc-300", description: "New inbound" },
  qualify: { label: "Qualify", dotClass: "bg-sky-500", accentClass: "bg-sky-400", description: "Discovery & meetings" },
  proposal: { label: "Proposal", dotClass: "bg-violet-500", accentClass: "bg-violet-400", description: "Quote sent" },
  negotiation: { label: "Negotiation", dotClass: "bg-teal-500", accentClass: "bg-teal-400", description: "Closing contract" },
};

export const healthMeta: Record<
  Health,
  { label: string; badgeClass: string; barClass: string }
> = {
  healthy: {
    label: "On track",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    barClass: "bg-emerald-500",
  },
  at_risk: {
    label: "At risk",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    barClass: "bg-amber-500",
  },
  stalled: {
    label: "Stalled",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
    barClass: "bg-rose-500",
  },
};

export const deals: Deal[] = [
  // Lead
  { id: "d01", company: "NexaTech", title: "Enterprise CRM Rollout", amount: 48_000_000, ownerId: "u3", stage: "lead", probability: 20, daysInStage: 3, closeDate: "2026-09-30", health: "healthy", tags: ["Inbound"], isNew: true },
  { id: "d02", company: "Daon Energy", title: "Data Pipeline", amount: 120_000_000, ownerId: "u2", stage: "lead", probability: 15, daysInStage: 9, closeDate: "2026-10-15", health: "at_risk", tags: ["Enterprise"] },
  { id: "d03", company: "Brickworks", title: "Security Module", amount: 26_000_000, ownerId: "u4", stage: "lead", probability: 25, daysInStage: 2, closeDate: "2026-08-28", health: "healthy", tags: ["Inbound"], isNew: true },
  { id: "d04", company: "NovaForm", title: "Team Plan", amount: 9_600_000, ownerId: "u1", stage: "lead", probability: 18, daysInStage: 21, closeDate: "2026-09-12", health: "stalled", tags: ["Self-serve"] },

  // Qualify
  { id: "d05", company: "Green Mobility", title: "Logistics Optimization Suite", amount: 84_000_000, ownerId: "u1", stage: "qualify", probability: 40, daysInStage: 6, closeDate: "2026-08-20", health: "healthy", tags: ["Enterprise"] },
  { id: "d06", company: "Link Healthcare", title: "Compliance Add-on", amount: 52_000_000, ownerId: "u3", stage: "qualify", probability: 35, daysInStage: 12, closeDate: "2026-09-05", health: "at_risk", tags: ["Regulated"] },
  { id: "d07", company: "Pixel Commerce", title: "Growth Plan Expansion", amount: 31_000_000, ownerId: "u4", stage: "qualify", probability: 45, daysInStage: 4, closeDate: "2026-08-14", health: "healthy", tags: ["Inbound"] },
  { id: "d08", company: "Serim Bio", title: "Analytics Add-on", amount: 18_500_000, ownerId: "u2", stage: "qualify", probability: 30, daysInStage: 8, closeDate: "2026-08-30", health: "healthy", tags: [] },

  // Proposal
  { id: "d09", company: "Atlas Logistics", title: "Enterprise License", amount: 156_000_000, ownerId: "u5", stage: "proposal", probability: 60, daysInStage: 5, closeDate: "2026-08-08", health: "healthy", tags: ["Enterprise"] },
  { id: "d10", company: "Core Payments", title: "Payment Integration Package", amount: 72_000_000, ownerId: "u2", stage: "proposal", probability: 65, daysInStage: 15, closeDate: "2026-07-31", health: "at_risk", tags: ["Priority"] },
  { id: "d11", company: "Harbor Cloud", title: "Infrastructure Bundle", amount: 64_000_000, ownerId: "u1", stage: "proposal", probability: 55, daysInStage: 7, closeDate: "2026-08-22", health: "healthy", tags: [] },
  { id: "d12", company: "Kairos AI", title: "Model Hosting", amount: 38_000_000, ownerId: "u3", stage: "proposal", probability: 70, daysInStage: 3, closeDate: "2026-07-28", health: "healthy", tags: ["Inbound"] },

  // Negotiation
  { id: "d13", company: "Millennium Retail", title: "Omnichannel Platform", amount: 198_000_000, ownerId: "u5", stage: "negotiation", probability: 85, daysInStage: 4, closeDate: "2026-07-22", health: "healthy", tags: ["Enterprise"] },
  { id: "d14", company: "Seven Bridge", title: "Analytics Suite", amount: 44_000_000, ownerId: "u4", stage: "negotiation", probability: 80, daysInStage: 6, closeDate: "2026-07-18", health: "healthy", tags: [] },
  { id: "d15", company: "Delta Bank", title: "Security Audit Package", amount: 90_000_000, ownerId: "u1", stage: "negotiation", probability: 75, daysInStage: 11, closeDate: "2026-07-25", health: "at_risk", tags: ["Regulated"] },
  { id: "d16", company: "Orbit Studio", title: "Creator Plan", amount: 22_000_000, ownerId: "u3", stage: "negotiation", probability: 90, daysInStage: 2, closeDate: "2026-07-19", health: "healthy", tags: ["Inbound"] },
];

export const periodMeta: Record<Period, { label: string; short: string }> = {
  quarter: { label: "This Quarter", short: "This Quarter" },
  prev_quarter: { label: "Last Quarter", short: "Last Quarter" },
  year: { label: "This Year", short: "This Year" },
};

/** Closed (won/lost) performance — switches with the period toggle. */
export const closedByPeriod: Record<Period, { wonAmount: number; wonCount: number; lostCount: number }> = {
  quarter: { wonAmount: 312_000_000, wonCount: 7, lostCount: 3 },
  prev_quarter: { wonAmount: 268_000_000, wonCount: 6, lostCount: 4 },
  year: { wonAmount: 1_040_000_000, wonCount: 24, lostCount: 11 },
};

/** Weighted forecast trend (unit: ₩ millions) — dataset switches with the period toggle, used by the crosshair chart. */
export const trendByPeriod: Record<Period, { unit: string; points: { label: string; value: number }[] }> = {
  quarter: {
    unit: "M",
    points: [
      { label: "Week 1", value: 390 },
      { label: "Week 2", value: 420 },
      { label: "Week 3", value: 400 },
      { label: "Week 4", value: 460 },
      { label: "Week 5", value: 510 },
      { label: "Week 6", value: 480 },
      { label: "Week 7", value: 540 },
      { label: "Week 8", value: 590 },
      { label: "Week 9", value: 560 },
      { label: "Week 10", value: 620 },
      { label: "Week 11", value: 650 },
      { label: "Week 12", value: 610 },
    ],
  },
  prev_quarter: {
    unit: "M",
    points: [
      { label: "Week 1", value: 280 },
      { label: "Week 2", value: 310 },
      { label: "Week 3", value: 300 },
      { label: "Week 4", value: 350 },
      { label: "Week 5", value: 330 },
      { label: "Week 6", value: 390 },
      { label: "Week 7", value: 410 },
      { label: "Week 8", value: 380 },
      { label: "Week 9", value: 440 },
      { label: "Week 10", value: 470 },
      { label: "Week 11", value: 450 },
      { label: "Week 12", value: 500 },
    ],
  },
  year: {
    unit: "M",
    points: [
      { label: "Jan", value: 220 },
      { label: "Feb", value: 290 },
      { label: "Mar", value: 340 },
      { label: "Apr", value: 310 },
      { label: "May", value: 380 },
      { label: "Jun", value: 430 },
      { label: "Jul", value: 400 },
      { label: "Aug", value: 490 },
      { label: "Sep", value: 530 },
      { label: "Oct", value: 580 },
      { label: "Nov", value: 620 },
      { label: "Dec", value: 670 },
    ],
  },
};
