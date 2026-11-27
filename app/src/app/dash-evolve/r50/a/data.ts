// Riskline — release-approval console. Deterministic dummy data only: every derived number
// (tier, release-level risk/blast, services-touched count) is computed from the service rows
// below, never hand-typed separately, so no two displayed numbers can disagree.

export type Category = "api" | "database" | "frontend" | "infra";
export type Tier = "Critical" | "High" | "Medium" | "Low";
export type Status = "pending" | "approved";

export type Service = {
  id: string;
  name: string;
  category: Category;
  /** % of users/services exposed if this component's change misbehaves. */
  blastRadiusPct: number;
  /** 0–100 rollback-risk score for this component's change. */
  riskScore: number;
  /** Number of other services that depend on this one (drives bubble size). */
  dependentsTouched: number;
};

export type Release = {
  id: string;
  version: string;
  title: string;
  env: "production" | "staging";
  requestedBy: { name: string; initials: string };
  requestedAt: string;
  status: Status;
  approvedBy?: string;
  approvedAt?: string;
  changeNote?: string;
  services: Service[];
};

export const CATEGORY_META: Record<Category, { label: string; shape: "circle" | "diamond" | "triangle" | "square" }> = {
  api: { label: "API / service", shape: "circle" },
  database: { label: "Database / store", shape: "diamond" },
  frontend: { label: "Frontend", shape: "triangle" },
  infra: { label: "Infra / pipeline", shape: "square" },
};

export const TIER_META: Record<Tier, { text: string; bg: string; border: string; dot: string }> = {
  Critical: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "#dc2626" },
  High: { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", dot: "#ea580c" },
  Medium: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "#d97706" },
  Low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "#059669" },
};

export function tierFromScore(score: number): Tier {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

/** Release-level rollback risk = the worst single component, since that is the floor the org is
 *  exposed to regardless of how safe the other changed services are. */
export function releaseRiskScore(r: Release): number {
  return Math.max(...r.services.map((s) => s.riskScore));
}

/** Release-level blast radius = the most exposed single component, same reasoning as risk. */
export function releaseBlastRadius(r: Release): number {
  return Math.max(...r.services.map((s) => s.blastRadiusPct));
}

export function releaseTier(r: Release): Tier {
  return tierFromScore(releaseRiskScore(r));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const RELEASES: Release[] = [
  {
    id: "rel-1",
    version: "v2.14.0",
    title: "Checkout flow — multi-currency rollout",
    env: "production",
    requestedBy: { name: "Priya Nair", initials: "PN" },
    requestedAt: "12m ago",
    status: "pending",
    services: [
      { id: "s1", name: "checkout-api", category: "api", blastRadiusPct: 72, riskScore: 88, dependentsTouched: 9 },
      { id: "s2", name: "payments-gateway", category: "api", blastRadiusPct: 65, riskScore: 91, dependentsTouched: 11 },
      { id: "s3", name: "billing-service", category: "api", blastRadiusPct: 40, riskScore: 58, dependentsTouched: 5 },
      { id: "s4", name: "cache-layer-redis", category: "database", blastRadiusPct: 28, riskScore: 44, dependentsTouched: 4 },
    ],
  },
  {
    id: "rel-2",
    version: "v1.9.2",
    title: "Auth gateway — token rotation hardening",
    env: "production",
    requestedBy: { name: "Marcus Lee", initials: "ML" },
    requestedAt: "38m ago",
    status: "pending",
    services: [
      { id: "s5", name: "auth-service", category: "api", blastRadiusPct: 58, riskScore: 83, dependentsTouched: 14 },
      { id: "s6", name: "session-store", category: "database", blastRadiusPct: 45, riskScore: 61, dependentsTouched: 6 },
      { id: "s7", name: "graphql-gateway", category: "api", blastRadiusPct: 33, riskScore: 39, dependentsTouched: 7 },
    ],
  },
  {
    id: "rel-3",
    version: "v4.2.1",
    title: "Search index — relevance model refresh",
    env: "production",
    requestedBy: { name: "Sofia Alvarez", initials: "SA" },
    requestedAt: "1h ago",
    status: "pending",
    services: [
      { id: "s8", name: "search-index", category: "database", blastRadiusPct: 22, riskScore: 52, dependentsTouched: 3 },
      { id: "s9", name: "recommendation-engine", category: "api", blastRadiusPct: 19, riskScore: 47, dependentsTouched: 2 },
    ],
  },
  {
    id: "rel-4",
    version: "v3.0.0",
    title: "Order fulfillment — warehouse routing v3",
    env: "production",
    requestedBy: { name: "Ben Okafor", initials: "BO" },
    requestedAt: "2h ago",
    status: "pending",
    services: [
      { id: "s10", name: "order-fulfillment", category: "api", blastRadiusPct: 61, riskScore: 76, dependentsTouched: 8 },
      { id: "s11", name: "inventory-db", category: "database", blastRadiusPct: 54, riskScore: 69, dependentsTouched: 6 },
      { id: "s12", name: "notification-worker", category: "infra", blastRadiusPct: 20, riskScore: 31, dependentsTouched: 2 },
    ],
  },
  {
    id: "rel-5",
    version: "v1.3.0",
    title: "Feature flags service — kill-switch API",
    env: "staging",
    requestedBy: { name: "Dana Kim", initials: "DK" },
    requestedAt: "3h ago",
    status: "pending",
    services: [
      { id: "s13", name: "feature-flags-service", category: "api", blastRadiusPct: 15, riskScore: 28, dependentsTouched: 3 },
      { id: "s14", name: "cdn-edge-config", category: "infra", blastRadiusPct: 12, riskScore: 22, dependentsTouched: 1 },
    ],
  },
  {
    id: "rel-6",
    version: "v2.6.0",
    title: "Web frontend — checkout redesign",
    env: "production",
    requestedBy: { name: "Priya Nair", initials: "PN" },
    requestedAt: "5h ago",
    status: "pending",
    services: [
      { id: "s15", name: "web-frontend", category: "frontend", blastRadiusPct: 48, riskScore: 42, dependentsTouched: 2 },
      { id: "s16", name: "mobile-bff", category: "api", blastRadiusPct: 30, riskScore: 55, dependentsTouched: 4 },
    ],
  },
  {
    id: "rel-7",
    version: "v5.1.0",
    title: "Fraud detection — real-time scoring rollout",
    env: "production",
    requestedBy: { name: "Marcus Lee", initials: "ML" },
    requestedAt: "6h ago",
    status: "pending",
    services: [
      { id: "s17", name: "fraud-detection", category: "api", blastRadiusPct: 70, riskScore: 85, dependentsTouched: 10 },
      { id: "s18", name: "user-profile-db", category: "database", blastRadiusPct: 35, riskScore: 48, dependentsTouched: 5 },
      { id: "s19", name: "analytics-pipeline", category: "infra", blastRadiusPct: 24, riskScore: 36, dependentsTouched: 3 },
    ],
  },
  {
    id: "rel-8",
    version: "v1.0.4",
    title: "Email dispatcher — retry queue migration",
    env: "staging",
    requestedBy: { name: "Sofia Alvarez", initials: "SA" },
    requestedAt: "Yesterday",
    status: "pending",
    services: [
      { id: "s20", name: "email-dispatcher", category: "infra", blastRadiusPct: 18, riskScore: 25, dependentsTouched: 2 },
      { id: "s21", name: "notification-worker", category: "infra", blastRadiusPct: 14, riskScore: 20, dependentsTouched: 1 },
    ],
  },
  {
    id: "rel-9",
    version: "v2.13.0",
    title: "Checkout flow — currency rounding fix",
    env: "production",
    requestedBy: { name: "Priya Nair", initials: "PN" },
    requestedAt: "3d ago",
    status: "approved",
    approvedBy: "Jordan Price",
    approvedAt: "2d ago",
    services: [
      { id: "s22", name: "checkout-api", category: "api", blastRadiusPct: 30, riskScore: 41, dependentsTouched: 4 },
      { id: "s23", name: "billing-service", category: "api", blastRadiusPct: 22, riskScore: 33, dependentsTouched: 2 },
    ],
  },
  {
    id: "rel-10",
    version: "v1.9.1",
    title: "Auth gateway — session timeout tuning",
    env: "production",
    requestedBy: { name: "Marcus Lee", initials: "ML" },
    requestedAt: "4d ago",
    status: "approved",
    approvedBy: "Jordan Price",
    approvedAt: "3d ago",
    services: [
      { id: "s24", name: "auth-service", category: "api", blastRadiusPct: 20, riskScore: 29, dependentsTouched: 3 },
      { id: "s25", name: "session-store", category: "database", blastRadiusPct: 15, riskScore: 24, dependentsTouched: 2 },
    ],
  },
  {
    id: "rel-11",
    version: "v4.2.0",
    title: "Search index — typo tolerance",
    env: "production",
    requestedBy: { name: "Sofia Alvarez", initials: "SA" },
    requestedAt: "5d ago",
    status: "approved",
    approvedBy: "Alicia Wong",
    approvedAt: "4d ago",
    services: [{ id: "s26", name: "search-index", category: "database", blastRadiusPct: 18, riskScore: 26, dependentsTouched: 2 }],
  },
  {
    id: "rel-12",
    version: "v2.9.0",
    title: "Order fulfillment — carrier rate cache",
    env: "production",
    requestedBy: { name: "Ben Okafor", initials: "BO" },
    requestedAt: "6d ago",
    status: "approved",
    approvedBy: "Alicia Wong",
    approvedAt: "5d ago",
    services: [
      { id: "s27", name: "order-fulfillment", category: "api", blastRadiusPct: 25, riskScore: 37, dependentsTouched: 3 },
      { id: "s28", name: "inventory-db", category: "database", blastRadiusPct: 20, riskScore: 30, dependentsTouched: 2 },
    ],
  },
  {
    id: "rel-13",
    version: "v5.0.2",
    title: "Fraud detection — rule engine patch",
    env: "production",
    requestedBy: { name: "Marcus Lee", initials: "ML" },
    requestedAt: "1w ago",
    status: "approved",
    approvedBy: "Jordan Price",
    approvedAt: "6d ago",
    services: [{ id: "s29", name: "fraud-detection", category: "api", blastRadiusPct: 28, riskScore: 44, dependentsTouched: 4 }],
  },
  {
    id: "rel-14",
    version: "v1.2.4",
    title: "Feature flags service — audit logging",
    env: "staging",
    requestedBy: { name: "Dana Kim", initials: "DK" },
    requestedAt: "1w ago",
    status: "approved",
    approvedBy: "Alicia Wong",
    approvedAt: "1w ago",
    services: [
      { id: "s30", name: "feature-flags-service", category: "api", blastRadiusPct: 10, riskScore: 18, dependentsTouched: 1 },
      { id: "s31", name: "cdn-edge-config", category: "infra", blastRadiusPct: 8, riskScore: 15, dependentsTouched: 1 },
    ],
  },
];

/** Baseline stats for the "new release request" dialog — a small fixed catalog, not a free text
 *  risk field, so a composed request still produces numbers consistent with the rest of the data. */
export const SERVICE_CATALOG: { name: string; category: Category; blastRadiusPct: number; riskScore: number; dependentsTouched: number }[] = [
  { name: "checkout-api", category: "api", blastRadiusPct: 55, riskScore: 60, dependentsTouched: 6 },
  { name: "payments-gateway", category: "api", blastRadiusPct: 60, riskScore: 70, dependentsTouched: 8 },
  { name: "auth-service", category: "api", blastRadiusPct: 40, riskScore: 55, dependentsTouched: 7 },
  { name: "inventory-db", category: "database", blastRadiusPct: 35, riskScore: 50, dependentsTouched: 4 },
  { name: "search-index", category: "database", blastRadiusPct: 20, riskScore: 35, dependentsTouched: 3 },
  { name: "web-frontend", category: "frontend", blastRadiusPct: 30, riskScore: 30, dependentsTouched: 2 },
  { name: "mobile-bff", category: "api", blastRadiusPct: 25, riskScore: 40, dependentsTouched: 3 },
  { name: "notification-worker", category: "infra", blastRadiusPct: 15, riskScore: 20, dependentsTouched: 2 },
  { name: "cdn-edge-config", category: "infra", blastRadiusPct: 10, riskScore: 18, dependentsTouched: 1 },
];
