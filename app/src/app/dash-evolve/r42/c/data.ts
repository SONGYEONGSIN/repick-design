// All figures below are fixed, hand-authored dummy data — no Math.random, no Date.now, no
// argument-less `new Date()`. Dates are plain display strings. Lift percentages, confidence
// intervals and daily trend arrays were computed once by hand and hardcoded, so every render
// (server or client) produces byte-identical output.

export type ExperimentStatus = "running" | "completed" | "paused";

export type LiftClass = "positive" | "negative" | "inconclusive";

export interface SecondaryMetric {
  label: string;
  unit: "pct" | "usd" | "num" | "min";
  control: number;
  variant: number;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  status: ExperimentStatus;
  owner: { name: string; initials: string };
  startedOn: string;
  metricLabel: string;
  controlRate: number;
  variantRate: number;
  controlSample: number;
  variantSample: number;
  /** Relative lift of variant over control, in percent. */
  liftPct: number;
  /** 95% CI on the full test-to-date window. */
  ciFull: [number, number];
  /** 95% CI using only the trailing 7 days — always wider, fewer samples. */
  ciWeek: [number, number];
  confidencePct: number;
  secondaryMetrics: SecondaryMetric[];
  /** 14 daily lift-percent readings, oldest first, converging toward liftPct. */
  trend14: number[];
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "checkout-cta",
    name: "Checkout CTA color + copy",
    hypothesis: "A higher-contrast button with action-oriented copy reduces last-step hesitation.",
    status: "running",
    owner: { name: "Mina Cho", initials: "MC" },
    startedOn: "Sep 2",
    metricLabel: "Checkout completion",
    controlRate: 4.82,
    variantRate: 5.46,
    controlSample: 48210,
    variantSample: 48190,
    liftPct: 13.3,
    ciFull: [6.1, 20.6],
    ciWeek: [-1.9, 28.5],
    confidencePct: 97,
    secondaryMetrics: [
      { label: "Avg order value", unit: "usd", control: 84.2, variant: 86.1 },
      { label: "Cart abandonment", unit: "pct", control: 61.4, variant: 58.9 },
    ],
    trend14: [1.2, -0.5, 3.8, 2.1, 6.4, 5.0, 8.7, 7.9, 10.2, 9.5, 11.8, 12.6, 12.9, 13.3],
  },
  {
    id: "pricing-annual-first",
    name: "Pricing page — annual-first toggle default",
    hypothesis: "Defaulting the plan toggle to annual billing nudges more trials into a paid annual plan.",
    status: "running",
    owner: { name: "Grace Lin", initials: "GL" },
    startedOn: "Aug 18",
    metricLabel: "Trial-to-paid conversion",
    controlRate: 11.4,
    variantRate: 12.9,
    controlSample: 9840,
    variantSample: 9790,
    liftPct: 13.2,
    ciFull: [2.4, 24.7],
    ciWeek: [-10.2, 36.6],
    confidencePct: 93,
    secondaryMetrics: [
      { label: "Annual plan share", unit: "pct", control: 38.0, variant: 52.0 },
      { label: "Avg contract value", unit: "usd", control: 1180, variant: 1340 },
    ],
    trend14: [-2.0, 1.5, -1.0, 4.2, 3.0, 6.8, 5.5, 8.9, 7.6, 10.4, 9.8, 11.9, 12.5, 13.2],
  },
  {
    id: "onboarding-order",
    name: "Onboarding checklist step order",
    hypothesis: "Moving the integration step earlier gets users to a working setup before they lose momentum.",
    status: "running",
    owner: { name: "Omar Haddad", initials: "OH" },
    startedOn: "Sep 22",
    metricLabel: "Activation within 7 days",
    controlRate: 61.2,
    variantRate: 58.9,
    controlSample: 6120,
    variantSample: 6080,
    liftPct: -3.8,
    ciFull: [-9.1, 1.9],
    ciWeek: [-15.4, 7.8],
    confidencePct: 61,
    secondaryMetrics: [
      { label: "Step completion rate", unit: "pct", control: 74.2, variant: 71.0 },
      { label: "Time to first value", unit: "min", control: 18.4, variant: 21.1 },
    ],
    trend14: [0.5, 2.1, -1.2, 0.8, -2.5, -0.3, -3.1, -1.8, -4.0, -2.9, -4.5, -3.2, -4.1, -3.8],
  },
  {
    id: "empty-state-illustration",
    name: "Empty-state illustration swap",
    hypothesis: "A task-specific illustration on first load prompts the first real action sooner than a generic graphic.",
    status: "completed",
    owner: { name: "Priya Nair", initials: "PN" },
    startedOn: "Jul 14",
    metricLabel: "Dashboard first-action rate",
    controlRate: 34.1,
    variantRate: 39.7,
    controlSample: 15300,
    variantSample: 15260,
    liftPct: 16.4,
    ciFull: [9.8, 23.2],
    ciWeek: [2.3, 30.5],
    confidencePct: 99,
    secondaryMetrics: [
      { label: "Session depth", unit: "num", control: 3.1, variant: 3.6 },
      { label: "Day-2 return rate", unit: "pct", control: 28.5, variant: 33.0 },
    ],
    trend14: [2.0, 4.5, 3.1, 7.8, 6.2, 10.5, 9.0, 13.2, 11.8, 15.0, 14.1, 16.9, 15.8, 16.4],
  },
  {
    id: "upgrade-nudge-timing",
    name: "In-app upgrade nudge timing",
    hypothesis: "Showing the nudge after a usage-limit warning (instead of on login) targets intent, not just presence.",
    status: "paused",
    owner: { name: "Leo Fischer", initials: "LF" },
    startedOn: "Aug 5",
    metricLabel: "Upgrade click-through",
    controlRate: 2.95,
    variantRate: 2.88,
    controlSample: 22400,
    variantSample: 22350,
    liftPct: -2.4,
    ciFull: [-11.2, 7.1],
    ciWeek: [-21.6, 16.8],
    confidencePct: 54,
    secondaryMetrics: [
      { label: "Nudge dismiss rate", unit: "pct", control: 71.0, variant: 74.2 },
      { label: "Upgrades / 1k sessions", unit: "num", control: 29.5, variant: 28.8 },
    ],
    trend14: [1.0, -0.8, 2.2, -1.5, 0.3, -2.8, 1.1, -3.5, 0.6, -2.0, -4.2, -1.3, -3.0, -2.4],
  },
  {
    id: "search-recency-boost",
    name: "Search ranking — recency boost",
    hypothesis: "Weighting recently-updated records higher surfaces what people are actually looking for.",
    status: "running",
    owner: { name: "Sana Khatri", initials: "SK" },
    startedOn: "Sep 10",
    metricLabel: "Search-to-click rate",
    controlRate: 47.8,
    variantRate: 51.3,
    controlSample: 31000,
    variantSample: 30980,
    liftPct: 7.3,
    ciFull: [2.1, 12.6],
    ciWeek: [-3.7, 18.3],
    confidencePct: 96,
    secondaryMetrics: [
      { label: "Avg results scanned", unit: "num", control: 4.8, variant: 3.9 },
      { label: "Zero-click search rate", unit: "pct", control: 18.2, variant: 14.6 },
    ],
    trend14: [0.2, 1.8, -0.5, 3.0, 2.1, 4.6, 3.8, 5.9, 5.0, 6.7, 6.1, 7.5, 7.0, 7.3],
  },
  {
    id: "email-digest-frequency",
    name: "Email digest frequency — daily vs. twice-weekly",
    hypothesis: "A lighter-touch cadence reduces fatigue without losing the habit loop that return visits depend on.",
    status: "running",
    owner: { name: "Tomás Rivera", initials: "TR" },
    startedOn: "Sep 29",
    metricLabel: "Weekly active return rate",
    controlRate: 42.0,
    variantRate: 44.6,
    controlSample: 18700,
    variantSample: 18660,
    liftPct: 6.2,
    ciFull: [1.0, 11.6],
    ciWeek: [-4.9, 17.3],
    confidencePct: 94,
    secondaryMetrics: [
      { label: "Unsubscribe rate", unit: "pct", control: 1.8, variant: 2.3 },
      { label: "Emails opened / week", unit: "num", control: 2.1, variant: 3.4 },
    ],
    trend14: [-1.0, 0.6, 1.9, -0.3, 2.8, 1.5, 4.0, 3.2, 5.1, 4.4, 5.8, 5.3, 6.0, 6.2],
  },
];

export function experimentById(id: string): Experiment | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/** Single source of truth for "is this lift real" — reused by the bench cards, the table, and the
 *  command palette so the same experiment is never shown as positive in one place and inconclusive
 *  in another. */
export function classifyLift(ci: [number, number]): LiftClass {
  if (ci[0] > 0) return "positive";
  if (ci[1] < 0) return "negative";
  return "inconclusive";
}

export const DEFAULT_BENCH_IDS: string[] = ["checkout-cta", "pricing-annual-first"];
export const BENCH_CAPACITY = 3;

export const TOTAL_EXPERIMENTS = EXPERIMENTS.length;
export const RUNNING_COUNT = EXPERIMENTS.filter((e) => e.status === "running").length;
export const SIGNIFICANT_COUNT = EXPERIMENTS.filter((e) => classifyLift(e.ciFull) !== "inconclusive").length;
export const USERS_IN_ACTIVE_TESTS = EXPERIMENTS.filter((e) => e.status === "running").reduce(
  (sum, e) => sum + e.controlSample + e.variantSample,
  0
);

export const CURRENT_USER = { name: "Jordan Avery", email: "jordan@varia.app", initials: "JA" };
export const WORKSPACES = ["Varia — Production", "Varia — Staging"];
