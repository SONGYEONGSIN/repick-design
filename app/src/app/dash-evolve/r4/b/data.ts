// Deterministic dummy data for Wardline — no Math.random / Date.now / new Date
// anywhere in this module. All "randomness" below comes from Math.sin() fed
// with a fixed numeric seed derived from each service's id string, so output
// is 100% reproducible between server and client renders.

export type Status = "operational" | "degraded" | "down";
export type Environment = "production" | "staging";
export type Team = "Payments" | "Identity" | "Platform" | "Search" | "Messaging" | "Data" | "Mobile" | "Growth";
export type Region = "us-east-1" | "us-west-2" | "eu-west-1" | "ap-south-1";
export type TimeRange = "1h" | "24h" | "7d";
export type IncidentStatus = "investigating" | "monitoring" | "resolved";
export type Severity = "minor" | "major" | "critical";

export interface HistoryPoint {
  label: string;
  value: number;
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  startedAt: string;
  /** Monotonic day*1440 + hour*60 + minute value for correct chronological sort (higher = more recent). No Date object involved. */
  startedRank: number;
  ongoing: boolean;
  durationMin: number;
  assignee: string;
  assigneeAvatar?: string;
}

export interface ServiceRecord {
  id: string;
  name: string;
  description: string;
  team: Team;
  environment: Environment;
  region: Region;
  status: Status;
  owner: string;
  ownerAvatar?: string;
  lastDeploy: string;
  uptimePct30d: number;
  latencyP50Ms: number;
  latencyP99Ms: number;
  errorRatePct: number;
  throughputRps: number;
  history: Record<TimeRange, HistoryPoint[]>;
  incidents: IncidentRecord[];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function round(n: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

const RANGE_LABELS: Record<TimeRange, string[]> = {
  "1h": ["-55m", "-50m", "-45m", "-40m", "-35m", "-30m", "-25m", "-20m", "-15m", "-10m", "-5m", "now"],
  "24h": [
    "-23h", "-21h", "-19h", "-17h", "-15h", "-13h", "-11h", "-9h", "-7h", "-5h", "-3h", "-1h", "now",
  ],
  "7d": ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "today"],
};

const RANGE_FREQ: Record<TimeRange, number> = { "1h": 1.1, "24h": 0.55, "7d": 0.9 };

/** Builds a deterministic latency series (ms) for one service + time range. */
function buildHistory(seed: number, range: TimeRange, base: number, status: Status): HistoryPoint[] {
  const labels = RANGE_LABELS[range];
  const n = labels.length;
  const freq = RANGE_FREQ[range];
  const amp = base * 0.12;
  return labels.map((label, i) => {
    const w1 = Math.sin(seed * 0.0007 + i * freq) * amp;
    const w2 = Math.sin(seed * 0.0021 + i * freq * 0.4 + 1.3) * amp * 0.45;
    let value = base + w1 + w2;
    // Trailing incident spike for services that are currently unhealthy.
    if (status !== "operational" && i >= Math.floor(n * 0.65)) {
      const rampT = (i - Math.floor(n * 0.65)) / Math.max(1, n - Math.floor(n * 0.65) - 1);
      const boost = status === "down" ? base * 1.6 : base * 0.55;
      value += boost * rampT;
    }
    return { label, value: Math.max(1, round(value)) };
  });
}

interface ServiceSpec {
  id: string;
  name: string;
  description: string;
  team: Team;
  environment: Environment;
  region: Region;
  status: Status;
  owner: string;
  ownerAvatar?: string;
  lastDeploy: string;
  latencyBase: number;
  errorBase: number;
  throughputBase: number;
  uptimeBase: number;
  incidents: IncidentRecord[];
}

const AVA = {
  elena: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&q=80",
  priya: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&q=80",
  tobias: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80",
};

const SPECS: ServiceSpec[] = [
  {
    id: "api-gateway",
    name: "API Gateway",
    description: "Edge entrypoint that routes and authenticates every inbound request.",
    team: "Platform",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Marcus Aldridge",
    ownerAvatar: AVA.tobias,
    lastDeploy: "Jul 15, 18:42 UTC",
    latencyBase: 42,
    errorBase: 0.08,
    throughputBase: 3820,
    uptimeBase: 99.98,
    incidents: [
      {
        id: "inc-8801",
        title: "Elevated 502s after edge node rollout",
        severity: "minor",
        status: "resolved",
        startedAt: "Jul 10, 03:14 UTC",
        startedRank: 14594,
        ongoing: false,
        durationMin: 22,
        assignee: "Marcus Aldridge",
        assigneeAvatar: AVA.tobias,
      },
    ],
  },
  {
    id: "auth-service",
    name: "Auth Service",
    description: "Issues and verifies session tokens for web and mobile clients.",
    team: "Identity",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Sana Okafor",
    lastDeploy: "Jul 14, 09:05 UTC",
    latencyBase: 61,
    errorBase: 0.05,
    throughputBase: 2140,
    uptimeBase: 99.99,
    incidents: [
      {
        id: "inc-8790",
        title: "Token refresh latency spike",
        severity: "minor",
        status: "resolved",
        startedAt: "Jul 6, 14:02 UTC",
        startedRank: 9482,
        ongoing: false,
        durationMin: 14,
        assignee: "Sana Okafor",
      },
    ],
  },
  {
    id: "payments-core",
    name: "Payments Core",
    description: "Authorizes and captures card payments across all storefronts.",
    team: "Payments",
    environment: "production",
    region: "us-east-1",
    status: "degraded",
    owner: "Priya Chandran",
    ownerAvatar: AVA.priya,
    lastDeploy: "Jul 15, 11:20 UTC",
    latencyBase: 188,
    errorBase: 2.4,
    throughputBase: 940,
    uptimeBase: 99.61,
    incidents: [
      {
        id: "inc-9012",
        title: "Elevated authorization latency from acquirer partner",
        severity: "major",
        status: "investigating",
        startedAt: "Jul 16, 07:48 UTC",
        startedRank: 23508,
        ongoing: true,
        durationMin: 96,
        assignee: "Priya Chandran",
        assigneeAvatar: AVA.priya,
      },
      {
        id: "inc-8955",
        title: "Retry storm on capture endpoint",
        severity: "minor",
        status: "resolved",
        startedAt: "Jul 9, 20:11 UTC",
        startedRank: 14171,
        ongoing: false,
        durationMin: 31,
        assignee: "Diego Fuentes",
      },
    ],
  },
  {
    id: "payments-ledger",
    name: "Payments Ledger",
    description: "Double-entry ledger recording every settled transaction.",
    team: "Payments",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Diego Fuentes",
    lastDeploy: "Jul 12, 16:00 UTC",
    latencyBase: 74,
    errorBase: 0.02,
    throughputBase: 610,
    uptimeBase: 99.99,
    incidents: [],
  },
  {
    id: "billing-invoicing",
    name: "Billing & Invoicing",
    description: "Generates recurring invoices and applies proration for plan changes.",
    team: "Payments",
    environment: "production",
    region: "eu-west-1",
    status: "operational",
    owner: "Naomi Whitfield",
    lastDeploy: "Jul 11, 08:30 UTC",
    latencyBase: 96,
    errorBase: 0.11,
    throughputBase: 210,
    uptimeBase: 99.95,
    incidents: [],
  },
  {
    id: "search-index",
    name: "Search Index",
    description: "Serves ranked catalog search results from the primary index.",
    team: "Search",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Yuki Tanaka",
    lastDeploy: "Jul 14, 22:10 UTC",
    latencyBase: 58,
    errorBase: 0.06,
    throughputBase: 1870,
    uptimeBase: 99.97,
    incidents: [],
  },
  {
    id: "search-autocomplete",
    name: "Search Autocomplete",
    description: "Low-latency typeahead suggestions for the global search bar.",
    team: "Search",
    environment: "production",
    region: "us-east-1",
    status: "degraded",
    owner: "Yuki Tanaka",
    lastDeploy: "Jul 15, 13:44 UTC",
    latencyBase: 34,
    errorBase: 1.1,
    throughputBase: 2410,
    uptimeBase: 99.82,
    incidents: [
      {
        id: "inc-9020",
        title: "Suggestion cache misses after index rebuild",
        severity: "minor",
        status: "monitoring",
        startedAt: "Jul 16, 06:05 UTC",
        startedRank: 23405,
        ongoing: true,
        durationMin: 158,
        assignee: "Yuki Tanaka",
      },
    ],
  },
  {
    id: "notifications-email",
    name: "Notifications — Email",
    description: "Transactional and marketing email delivery pipeline.",
    team: "Messaging",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Farah Haddad",
    lastDeploy: "Jul 9, 10:15 UTC",
    latencyBase: 210,
    errorBase: 0.3,
    throughputBase: 340,
    uptimeBase: 99.9,
    incidents: [],
  },
  {
    id: "notifications-push",
    name: "Notifications — Push",
    description: "Mobile push delivery via APNs and FCM.",
    team: "Messaging",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Farah Haddad",
    lastDeploy: "Jul 13, 19:00 UTC",
    latencyBase: 130,
    errorBase: 0.22,
    throughputBase: 520,
    uptimeBase: 99.93,
    incidents: [],
  },
  {
    id: "notifications-sms",
    name: "Notifications — SMS",
    description: "SMS delivery via upstream carrier gateways.",
    team: "Messaging",
    environment: "production",
    region: "eu-west-1",
    status: "down",
    owner: "Lucas Bergman",
    lastDeploy: "Jul 15, 07:00 UTC",
    latencyBase: 260,
    errorBase: 18.6,
    throughputBase: 88,
    uptimeBase: 97.4,
    incidents: [
      {
        id: "inc-9031",
        title: "Upstream carrier gateway rejecting all sends",
        severity: "critical",
        status: "investigating",
        startedAt: "Jul 16, 09:02 UTC",
        startedRank: 23582,
        ongoing: true,
        durationMin: 42,
        assignee: "Lucas Bergman",
      },
    ],
  },
  {
    id: "user-profile",
    name: "User Profile",
    description: "Reads and writes account profile and preference data.",
    team: "Identity",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Sana Okafor",
    lastDeploy: "Jul 8, 12:40 UTC",
    latencyBase: 48,
    errorBase: 0.04,
    throughputBase: 1450,
    uptimeBase: 99.99,
    incidents: [],
  },
  {
    id: "session-store",
    name: "Session Store",
    description: "Distributed cache backing active user sessions.",
    team: "Identity",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Tobias Renner",
    ownerAvatar: AVA.tobias,
    lastDeploy: "Jul 12, 05:20 UTC",
    latencyBase: 12,
    errorBase: 0.01,
    throughputBase: 5210,
    uptimeBase: 100,
    incidents: [],
  },
  {
    id: "data-warehouse-sync",
    name: "Warehouse Sync",
    description: "Streams operational events into the analytics warehouse.",
    team: "Data",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Elena Voss",
    ownerAvatar: AVA.elena,
    lastDeploy: "Jul 7, 23:55 UTC",
    latencyBase: 340,
    errorBase: 0.15,
    throughputBase: 180,
    uptimeBase: 99.9,
    incidents: [],
  },
  {
    id: "data-etl-pipeline",
    name: "ETL Pipeline",
    description: "Nightly batch transforms feeding downstream reporting tables.",
    team: "Data",
    environment: "production",
    region: "us-east-1",
    status: "degraded",
    owner: "Elena Voss",
    ownerAvatar: AVA.elena,
    lastDeploy: "Jul 15, 02:00 UTC",
    latencyBase: 890,
    errorBase: 3.8,
    throughputBase: 64,
    uptimeBase: 99.2,
    incidents: [
      {
        id: "inc-9008",
        title: "Job queue backlog from upstream schema change",
        severity: "major",
        status: "investigating",
        startedAt: "Jul 16, 04:30 UTC",
        startedRank: 23310,
        ongoing: true,
        durationMin: 214,
        assignee: "Elena Voss",
        assigneeAvatar: AVA.elena,
      },
    ],
  },
  {
    id: "ml-inference",
    name: "ML Inference",
    description: "Serves recommendation model predictions in real time.",
    team: "Data",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Diego Fuentes",
    lastDeploy: "Jul 13, 15:10 UTC",
    latencyBase: 118,
    errorBase: 0.18,
    throughputBase: 740,
    uptimeBase: 99.94,
    incidents: [],
  },
  {
    id: "ml-feature-store",
    name: "Feature Store",
    description: "Low-latency feature lookups for model serving.",
    team: "Data",
    environment: "staging",
    region: "us-east-1",
    status: "operational",
    owner: "Elena Voss",
    ownerAvatar: AVA.elena,
    lastDeploy: "Jul 14, 17:25 UTC",
    latencyBase: 22,
    errorBase: 0.03,
    throughputBase: 310,
    uptimeBase: 99.97,
    incidents: [],
  },
  {
    id: "mobile-gateway-ios",
    name: "Mobile Gateway — iOS",
    description: "BFF layer serving the iOS client.",
    team: "Mobile",
    environment: "production",
    region: "us-west-2",
    status: "operational",
    owner: "Naomi Whitfield",
    lastDeploy: "Jul 10, 21:00 UTC",
    latencyBase: 68,
    errorBase: 0.09,
    throughputBase: 1120,
    uptimeBase: 99.96,
    incidents: [],
  },
  {
    id: "mobile-gateway-android",
    name: "Mobile Gateway — Android",
    description: "BFF layer serving the Android client.",
    team: "Mobile",
    environment: "production",
    region: "us-west-2",
    status: "operational",
    owner: "Naomi Whitfield",
    lastDeploy: "Jul 10, 21:05 UTC",
    latencyBase: 71,
    errorBase: 0.1,
    throughputBase: 1340,
    uptimeBase: 99.95,
    incidents: [],
  },
  {
    id: "edge-cdn",
    name: "Edge CDN",
    description: "Caches and serves static assets from regional points of presence.",
    team: "Platform",
    environment: "production",
    region: "ap-south-1",
    status: "operational",
    owner: "Marcus Aldridge",
    ownerAvatar: AVA.tobias,
    lastDeploy: "Jul 6, 11:00 UTC",
    latencyBase: 18,
    errorBase: 0.02,
    throughputBase: 8420,
    uptimeBase: 100,
    incidents: [],
  },
  {
    id: "rate-limiter",
    name: "Rate Limiter",
    description: "Token-bucket limiter guarding downstream services from abuse.",
    team: "Platform",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Tobias Renner",
    ownerAvatar: AVA.tobias,
    lastDeploy: "Jul 9, 06:40 UTC",
    latencyBase: 4,
    errorBase: 0.01,
    throughputBase: 6100,
    uptimeBase: 100,
    incidents: [],
  },
  {
    id: "webhook-dispatcher",
    name: "Webhook Dispatcher",
    description: "Delivers outbound webhooks to customer-configured endpoints.",
    team: "Platform",
    environment: "production",
    region: "us-east-1",
    status: "down",
    owner: "Marcus Aldridge",
    ownerAvatar: AVA.tobias,
    lastDeploy: "Jul 16, 08:10 UTC",
    latencyBase: 340,
    errorBase: 22.4,
    throughputBase: 46,
    uptimeBase: 98.8,
    incidents: [
      {
        id: "inc-9034",
        title: "Deploy regression blocking delivery worker startup",
        severity: "critical",
        status: "investigating",
        startedAt: "Jul 16, 08:15 UTC",
        startedRank: 23535,
        ongoing: true,
        durationMin: 29,
        assignee: "Marcus Aldridge",
        assigneeAvatar: AVA.tobias,
      },
      {
        id: "inc-8870",
        title: "Backlog after downstream 3rd-party outage",
        severity: "major",
        status: "resolved",
        startedAt: "Jul 4, 12:00 UTC",
        startedRank: 6480,
        ongoing: false,
        durationMin: 87,
        assignee: "Marcus Aldridge",
        assigneeAvatar: AVA.tobias,
      },
    ],
  },
  {
    id: "growth-experiments",
    name: "Experiments Service",
    description: "Assigns and tracks A/B test variants for the growth team.",
    team: "Growth",
    environment: "production",
    region: "us-east-1",
    status: "operational",
    owner: "Priya Chandran",
    ownerAvatar: AVA.priya,
    lastDeploy: "Jul 11, 14:50 UTC",
    latencyBase: 29,
    errorBase: 0.05,
    throughputBase: 980,
    uptimeBase: 99.98,
    incidents: [],
  },
  {
    id: "growth-referrals",
    name: "Referrals Service",
    description: "Tracks referral codes and applies signup rewards.",
    team: "Growth",
    environment: "staging",
    region: "us-east-1",
    status: "operational",
    owner: "Naomi Whitfield",
    lastDeploy: "Jul 13, 09:30 UTC",
    latencyBase: 36,
    errorBase: 0.07,
    throughputBase: 150,
    uptimeBase: 99.96,
    incidents: [],
  },
  {
    id: "audit-log",
    name: "Audit Log",
    description: "Immutable append-only log of security-relevant account events.",
    team: "Identity",
    environment: "production",
    region: "eu-west-1",
    status: "operational",
    owner: "Sana Okafor",
    lastDeploy: "Jul 5, 17:15 UTC",
    latencyBase: 40,
    errorBase: 0.02,
    throughputBase: 260,
    uptimeBase: 100,
    incidents: [],
  },
];

export const SERVICES: ServiceRecord[] = SPECS.map((spec) => {
  const seed = hashString(spec.id);
  const history: Record<TimeRange, HistoryPoint[]> = {
    "1h": buildHistory(seed, "1h", spec.latencyBase, spec.status),
    "24h": buildHistory(seed + 1, "24h", spec.latencyBase, spec.status),
    "7d": buildHistory(seed + 2, "7d", spec.latencyBase, spec.status),
  };
  const latencyP99Ms = round(spec.latencyBase * (1.6 + (seed % 7) / 20));
  return {
    id: spec.id,
    name: spec.name,
    description: spec.description,
    team: spec.team,
    environment: spec.environment,
    region: spec.region,
    status: spec.status,
    owner: spec.owner,
    ownerAvatar: spec.ownerAvatar,
    lastDeploy: spec.lastDeploy,
    uptimePct30d: round(spec.uptimeBase, 2),
    latencyP50Ms: round(spec.latencyBase),
    latencyP99Ms,
    errorRatePct: round(spec.errorBase, 2),
    throughputRps: round(spec.throughputBase),
    history,
    incidents: spec.incidents,
  };
});

export const TEAMS: Team[] = ["Payments", "Identity", "Platform", "Search", "Messaging", "Data", "Mobile", "Growth"];

export const TOTAL_SERVICES = SERVICES.length;
export const OPERATIONAL_COUNT = SERVICES.filter((s) => s.status === "operational").length;
export const DEGRADED_COUNT = SERVICES.filter((s) => s.status === "degraded").length;
export const DOWN_COUNT = SERVICES.filter((s) => s.status === "down").length;
export const OPEN_INCIDENT_COUNT = SERVICES.reduce(
  (sum, s) => sum + s.incidents.filter((i) => i.ongoing).length,
  0,
);

export function serviceById(id: string): ServiceRecord | undefined {
  return SERVICES.find((s) => s.id === id);
}

export const TIME_RANGE_LABEL: Record<TimeRange, string> = {
  "1h": "Last hour",
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
};
