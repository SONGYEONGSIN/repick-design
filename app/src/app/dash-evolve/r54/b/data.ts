/**
 * Gantry — fixed, deterministic dummy data. No Math.random(), no Date.now(), no `new Date()`
 * anywhere: every "requested on" value is a literal display string, not a computed timestamp.
 */

export type StageId = "requested" | "review" | "approved" | "canary" | "live";

export type RiskLevel = "low" | "medium" | "high";

export type Deployment = {
  id: string;
  modelName: string;
  version: string;
  owner: { name: string; initials: string };
  team: string;
  environment: string;
  riskLevel: RiskLevel;
  stage: StageId;
  requestedOn: string;
  latencyP99Ms: number;
  checklist: { label: string; done: boolean }[];
  tags: string[];
  watchers: number;
};

export const BRAND = { name: "Gantry", tagline: "Deployment approvals for ML teams" };

export const WORKSPACES = [
  { id: "vector-labs", name: "Vector Labs", meta: "18 models" },
  { id: "payments-ml", name: "Payments ML", meta: "6 models" },
  { id: "trust-safety", name: "Trust & Safety ML", meta: "4 models" },
];

export const CURRENT_USER = { name: "Jordan Ames", role: "ML Platform Lead", initials: "JA" };

export const STAGES: { id: StageId; label: string; description: string }[] = [
  { id: "requested", label: "Requested", description: "Awaiting triage" },
  { id: "review", label: "Risk Review", description: "Model & data risk check" },
  { id: "approved", label: "Approved", description: "Cleared, queued to ship" },
  { id: "canary", label: "Canary", description: "Partial-traffic rollout" },
  { id: "live", label: "Live", description: "Full production traffic" },
];

export const DEPLOYMENTS: Deployment[] = [
  {
    id: "dep-01",
    modelName: "fraud-scoring-v4",
    version: "v4.2.1",
    owner: { name: "Mina Cho", initials: "MC" },
    team: "Payments ML",
    environment: "prod-us-east1",
    riskLevel: "high",
    stage: "requested",
    requestedOn: "Oct 29",
    latencyP99Ms: 84,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: false },
      { label: "Rollback plan filed", done: false },
    ],
    tags: ["Tabular", "PII"],
    watchers: 5,
  },
  {
    id: "dep-02",
    modelName: "chat-router-llm",
    version: "v2.0.0",
    owner: { name: "Ethan Brooks", initials: "EB" },
    team: "Support AI",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "requested",
    requestedOn: "Oct 30",
    latencyP99Ms: 310,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Prompt-injection eval", done: false },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["LLM"],
    watchers: 3,
  },
  {
    id: "dep-03",
    modelName: "eta-predictor",
    version: "v1.6.0",
    owner: { name: "Lucia Alvarez", initials: "LA" },
    team: "Logistics ML",
    environment: "staging",
    riskLevel: "low",
    stage: "requested",
    requestedOn: "Oct 30",
    latencyP99Ms: 46,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
    ],
    tags: ["Tabular"],
    watchers: 1,
  },
  {
    id: "dep-04",
    modelName: "refund-risk-v1",
    version: "v1.0.0",
    owner: { name: "Mina Cho", initials: "MC" },
    team: "Payments ML",
    environment: "prod-eu-west1",
    riskLevel: "high",
    stage: "requested",
    requestedOn: "Oct 31",
    latencyP99Ms: 71,
    checklist: [
      { label: "Model card complete", done: false },
      { label: "Bias audit attached", done: false },
      { label: "Rollback plan filed", done: false },
    ],
    tags: ["Tabular", "PII"],
    watchers: 2,
  },
  {
    id: "dep-05",
    modelName: "doc-classifier-v2",
    version: "v2.3.0",
    owner: { name: "Priya Natarajan", initials: "PN" },
    team: "Trust & Safety",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "review",
    requestedOn: "Oct 27",
    latencyP99Ms: 58,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: true },
      { label: "Rollback plan filed", done: false },
    ],
    tags: ["Vision"],
    watchers: 4,
  },
  {
    id: "dep-06",
    modelName: "ad-rank-gbm",
    version: "v9.1.4",
    owner: { name: "Sam Okafor", initials: "SO" },
    team: "Ads ML",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "review",
    requestedOn: "Oct 28",
    latencyP99Ms: 22,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Ranking"],
    watchers: 6,
  },
  {
    id: "dep-07",
    modelName: "spam-detector-v6",
    version: "v6.0.2",
    owner: { name: "Priya Natarajan", initials: "PN" },
    team: "Trust & Safety",
    environment: "prod-eu-west1",
    riskLevel: "low",
    stage: "review",
    requestedOn: "Oct 28",
    latencyP99Ms: 19,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
    ],
    tags: ["Tabular"],
    watchers: 2,
  },
  {
    id: "dep-08",
    modelName: "content-rank-v3",
    version: "v3.4.0",
    owner: { name: "Daniel Osei", initials: "DO" },
    team: "Growth ML",
    environment: "staging",
    riskLevel: "medium",
    stage: "review",
    requestedOn: "Oct 29",
    latencyP99Ms: 37,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: false },
    ],
    tags: ["Ranking"],
    watchers: 1,
  },
  {
    id: "dep-09",
    modelName: "price-predictor",
    version: "v2.1.0",
    owner: { name: "Daniel Osei", initials: "DO" },
    team: "Growth ML",
    environment: "prod-us-east1",
    riskLevel: "low",
    stage: "approved",
    requestedOn: "Oct 24",
    latencyP99Ms: 28,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Tabular"],
    watchers: 3,
  },
  {
    id: "dep-10",
    modelName: "support-triage-llm",
    version: "v1.3.0",
    owner: { name: "Ethan Brooks", initials: "EB" },
    team: "Support AI",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "approved",
    requestedOn: "Oct 25",
    latencyP99Ms: 265,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Prompt-injection eval", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["LLM"],
    watchers: 4,
  },
  {
    id: "dep-11",
    modelName: "voice-intent-clf",
    version: "v1.1.2",
    owner: { name: "Sam Okafor", initials: "SO" },
    team: "Support AI",
    environment: "staging",
    riskLevel: "low",
    stage: "approved",
    requestedOn: "Oct 26",
    latencyP99Ms: 51,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
    ],
    tags: ["Audio"],
    watchers: 1,
  },
  {
    id: "dep-12",
    modelName: "churn-model-v3",
    version: "v3.0.1",
    owner: { name: "Lucia Alvarez", initials: "LA" },
    team: "Growth ML",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "canary",
    requestedOn: "Oct 21",
    latencyP99Ms: 33,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Tabular"],
    watchers: 7,
  },
  {
    id: "dep-13",
    modelName: "image-mod-filter",
    version: "v4.0.0",
    owner: { name: "Priya Natarajan", initials: "PN" },
    team: "Trust & Safety",
    environment: "prod-eu-west1",
    riskLevel: "high",
    stage: "canary",
    requestedOn: "Oct 22",
    latencyP99Ms: 112,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Vision", "PII"],
    watchers: 8,
  },
  {
    id: "dep-14",
    modelName: "onboarding-nba",
    version: "v1.8.0",
    owner: { name: "Daniel Osei", initials: "DO" },
    team: "Growth ML",
    environment: "prod-us-east1",
    riskLevel: "low",
    stage: "canary",
    requestedOn: "Oct 23",
    latencyP99Ms: 25,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
    ],
    tags: ["Ranking"],
    watchers: 2,
  },
  {
    id: "dep-15",
    modelName: "recsys-ranker-v5",
    version: "v5.2.0",
    owner: { name: "Lucia Alvarez", initials: "LA" },
    team: "Growth ML",
    environment: "prod-us-east1",
    riskLevel: "low",
    stage: "live",
    requestedOn: "Oct 14",
    latencyP99Ms: 31,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Ranking"],
    watchers: 6,
  },
  {
    id: "dep-16",
    modelName: "credit-risk-v2",
    version: "v2.4.1",
    owner: { name: "Mina Cho", initials: "MC" },
    team: "Payments ML",
    environment: "prod-us-east1",
    riskLevel: "high",
    stage: "live",
    requestedOn: "Oct 10",
    latencyP99Ms: 67,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Bias audit attached", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Tabular", "PII"],
    watchers: 9,
  },
  {
    id: "dep-17",
    modelName: "search-rerank-llm",
    version: "v1.5.0",
    owner: { name: "Sam Okafor", initials: "SO" },
    team: "Search ML",
    environment: "prod-eu-west1",
    riskLevel: "medium",
    stage: "live",
    requestedOn: "Oct 16",
    latencyP99Ms: 140,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
    ],
    tags: ["LLM", "Ranking"],
    watchers: 3,
  },
  {
    id: "dep-18",
    modelName: "anomaly-detect-v2",
    version: "v2.2.0",
    owner: { name: "Ethan Brooks", initials: "EB" },
    team: "Payments ML",
    environment: "prod-us-east1",
    riskLevel: "medium",
    stage: "live",
    requestedOn: "Oct 18",
    latencyP99Ms: 40,
    checklist: [
      { label: "Model card complete", done: true },
      { label: "Load test passed", done: true },
      { label: "Rollback plan filed", done: true },
    ],
    tags: ["Tabular"],
    watchers: 4,
  },
];

/** Median hours spent in each pre-live stage, over the trailing 90 days, with sample size. Used by
 * the pipeline-velocity strip. Sum of medians (4 + 18 + 6 + 30 = 58) is the headline "time to Live". */
export const STAGE_DURATIONS: { stageId: StageId; label: string; medianHours: number; sampleSize: number }[] = [
  { stageId: "requested", label: "Requested", medianHours: 4, sampleSize: 42 },
  { stageId: "review", label: "Risk Review", medianHours: 18, sampleSize: 38 },
  { stageId: "approved", label: "Approved", medianHours: 6, sampleSize: 35 },
  { stageId: "canary", label: "Canary", medianHours: 30, sampleSize: 31 },
];

export const MEDIAN_TIME_TO_LIVE_HOURS = STAGE_DURATIONS.reduce((sum, s) => sum + s.medianHours, 0);
export const SHIPPED_LAST_90_DAYS = STAGE_DURATIONS[STAGE_DURATIONS.length - 1].sampleSize;

export const NAV_ITEMS = [
  { id: "deployments", label: "Deployments", icon: "Rocket" as const },
  { id: "models", label: "Models", icon: "Boxes" as const },
  { id: "policies", label: "Policies", icon: "ShieldCheck" as const },
  { id: "audit", label: "Audit Log", icon: "History" as const },
  { id: "integrations", label: "Integrations", icon: "Plug" as const },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "credit-risk-v2 passed its canary SLO check.", time: "12m ago" },
  { id: "n2", text: "image-mod-filter flagged for a second bias review.", time: "1h ago" },
  { id: "n3", text: "Mina Cho requested review on refund-risk-v1.", time: "3h ago" },
];
