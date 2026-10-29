// Deterministic workforce-capacity simulator math for the Shiftcast staffing planner.
//
// Every number below is either a fixed literal or a pure function of (fixed literals + the
// control-panel inputs the person is actively adjusting) — no Math.random, no Date.now, no
// bare `new Date()`. The same inputs always produce the same projection, on the server and in
// the browser, so re-renders and hydration never disagree.

export type SlaTarget = 80 | 90 | 95;
export type Horizon = 8 | 12;

export interface SimInputs {
  /** Assumed growth in forecast ticket volume, applied to every week in the horizon. */
  growthPct: number; // 0 | 10 | 20 | 30 | 40
  /** Average handle time in minutes, stored ×10 so the slider only ever carries integers. */
  ahtTenths: number; // 40..100 step 5  → 4.0..10.0 minutes
  /** Planned shrinkage (PTO, training, breaks) as a percentage of scheduled hours. */
  shrinkagePct: number; // 10..30 step 1
  /** Additional agents hired on top of the current roster, flat across the horizon. */
  hires: number; // 0..24 step 2
  slaTarget: SlaTarget;
  horizon: Horizon;
}

export const DEFAULT_INPUTS: SimInputs = {
  growthPct: 0,
  ahtTenths: 65,
  shrinkagePct: 20,
  hires: 0,
  slaTarget: 90,
  horizon: 12,
};

export const BASELINE_HEADCOUNT = 185;
const STANDARD_WEEKLY_HOURS = 40;
const CHAT_SHARE = 0.45;
const EMAIL_SHARE = 0.25;
// Phone's share (0.30) is never multiplied directly — it is taken by subtraction in
// splitChannels() below, so the three channel counts always add back up to exactly the
// required headcount instead of drifting apart from independent rounding.

/** Twelve weeks of baseline forecast ticket volume, Oct 19 2026 – Jan 11 2027, rising into the
 *  holiday season and tapering after. Real literals, not generated. */
export const BASE_WEEKLY_VOLUME: readonly number[] = [
  48000, 47000, 49500, 51200, 53500, 56800, 60500, 64800, 70200, 74500, 68300, 59800,
];

const WEEK_START_YEAR = 2026;
const WEEK_START_MONTH = 9; // October (0-indexed)
const WEEK_START_DAY = 19; // a Monday

export function weekStartDate(index: number): Date {
  return new Date(WEEK_START_YEAR, WEEK_START_MONTH, WEEK_START_DAY + index * 7);
}

export function weekEndDate(index: number): Date {
  return new Date(WEEK_START_YEAR, WEEK_START_MONTH, WEEK_START_DAY + index * 7 + 6);
}

export function ahtMinutes(inputs: SimInputs): number {
  return inputs.ahtTenths / 10;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface ChannelSplit {
  chat: number;
  email: number;
  phone: number;
}

export interface WeekResult {
  index: number;
  volume: number;
  requiredHeadcount: number;
  scheduledHeadcount: number;
  gap: number; // scheduled - required; positive = surplus, negative = deficit
  attainmentPct: number;
  breach: boolean;
  channels: ChannelSplit;
}

function splitChannels(required: number): ChannelSplit {
  const chat = Math.round(required * CHAT_SHARE);
  const email = Math.round(required * EMAIL_SHARE);
  const phone = required - chat - email;
  return { chat, email, phone };
}

export function computeWeek(inputs: SimInputs, baseVolume: number, index: number): WeekResult {
  const volume = Math.round(baseVolume * (1 + inputs.growthPct / 100));
  const agentHours = (volume * ahtMinutes(inputs)) / 60;
  const productiveHoursPerAgent = STANDARD_WEEKLY_HOURS * (1 - inputs.shrinkagePct / 100);
  const requiredHeadcount = Math.ceil(agentHours / productiveHoursPerAgent);
  const scheduledHeadcount = BASELINE_HEADCOUNT + inputs.hires;
  const gap = scheduledHeadcount - requiredHeadcount;
  const attainmentPct = Math.min(100, Math.round((scheduledHeadcount / requiredHeadcount) * 100));
  const breach = attainmentPct < inputs.slaTarget;
  return {
    index,
    volume,
    requiredHeadcount,
    scheduledHeadcount,
    gap,
    attainmentPct,
    breach,
    channels: splitChannels(requiredHeadcount),
  };
}

export function computeProjection(inputs: SimInputs): WeekResult[] {
  return BASE_WEEKLY_VOLUME.slice(0, inputs.horizon).map((volume, index) => computeWeek(inputs, volume, index));
}

export function peakWeekIndex(rows: WeekResult[]): number {
  let best = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].requiredHeadcount > rows[best].requiredHeadcount) best = i;
  }
  return best;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  inputs: SimInputs;
}

export const PRESETS: ScenarioPreset[] = [
  {
    id: "baseline",
    label: "Baseline plan",
    description: "Current roster, no volume growth assumed.",
    inputs: DEFAULT_INPUTS,
  },
  {
    id: "peak-surge",
    label: "Peak season surge",
    description: "+30% ticket volume across the full horizon.",
    inputs: { ...DEFAULT_INPUTS, growthPct: 30 },
  },
  {
    id: "lean",
    label: "Lean staffing",
    description: "Shrinkage climbs to 25% with no new hires.",
    inputs: { ...DEFAULT_INPUTS, shrinkagePct: 25 },
  },
  {
    id: "recommended",
    label: "Recommended hiring",
    description: "Adds 14 agents to close the holiday-peak gap.",
    inputs: { ...DEFAULT_INPUTS, hires: 14 },
  },
  {
    id: "strict-sla",
    label: "Strict SLA + hiring",
    description: "95% SLA target, backed by the 14-agent hire plan.",
    inputs: { ...DEFAULT_INPUTS, hires: 14, slaTarget: 95 },
  },
];

export function inputsEqual(a: SimInputs, b: SimInputs): boolean {
  return (
    a.growthPct === b.growthPct &&
    a.ahtTenths === b.ahtTenths &&
    a.shrinkagePct === b.shrinkagePct &&
    a.hires === b.hires &&
    a.slaTarget === b.slaTarget &&
    a.horizon === b.horizon
  );
}
