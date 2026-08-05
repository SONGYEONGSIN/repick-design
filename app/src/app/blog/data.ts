// app/src/app/blog-evolve/r2/b/data.ts
//
// Deterministic report data for the Baseline evidence journal. Every field is a plain literal —
// no `Math.random()`, `Date.now()`, or `new Date()` — dates are ISO strings compared lexicographically,
// which sorts correctly without ever constructing a Date object.
import type { LucideIcon } from "lucide-react";
import { Boxes, Cpu, Database, HardDrive, Network } from "lucide-react";

export type CategoryId = "databases" | "networking" | "caching" | "compute" | "storage";

export const CATEGORIES: { id: CategoryId; label: string; icon: LucideIcon }[] = [
  { id: "databases", label: "Databases", icon: Database },
  { id: "networking", label: "Networking", icon: Network },
  { id: "caching", label: "Caching", icon: Boxes },
  { id: "compute", label: "Compute", icon: Cpu },
  { id: "storage", label: "Storage", icon: HardDrive },
];

export type Confidence = "high" | "medium" | "exploratory";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  exploratory: "Exploratory",
};

export type Direction = "lower-is-better" | "higher-is-better";

export type Metric = {
  label: string;
  unit: "%" | "ms" | "x";
  baseline: number;
  result: number;
  direction: Direction;
};

export type Report = {
  slug: string;
  title: string;
  category: CategoryId;
  dek: string;
  excerpt: string;
  methodology: string;
  date: string; // ISO, string-sortable
  dateLabel: string;
  author: { name: string; role: string; seed: number };
  readMins: number;
  sampleSize: number;
  sampleUnit: string;
  confidence: Confidence;
  metric: Metric;
};

function delta(m: Metric): number {
  if (m.baseline === 0) return 0;
  return Math.round(((m.result - m.baseline) / m.baseline) * 1000) / 10;
}

export function metricDelta(m: Metric): { value: number; improved: boolean } {
  const d = delta(m);
  const improved = m.direction === "lower-is-better" ? d < 0 : d > 0;
  return { value: d, improved };
}

export const REPORTS: Report[] = [
  {
    slug: "columnar-compaction-p99",
    title: "Columnar compaction cuts P99 read latency 42% under mixed load",
    category: "databases",
    dek: "Re-running compaction on the write path instead of a background sweep.",
    excerpt:
      "We re-ran the standard mixed read/write benchmark against three compaction strategies. Moving compaction onto the write path — rather than a periodic background sweep — held P99 read latency flat as write volume climbed, at the cost of roughly 6% extra CPU per write.",
    methodology:
      "48-node cluster, 12h soak per strategy, 70/30 read/write mix replayed from a captured production trace. Runs repeated three times; reported figures are the median run.",
    date: "2026-07-22",
    dateLabel: "Jul 22, 2026",
    author: { name: "Priya Nathan", role: "Storage engineering", seed: 11 },
    readMins: 7,
    sampleSize: 1240,
    sampleUnit: "benchmark runs",
    confidence: "high",
    metric: { label: "P99 read latency", unit: "ms", baseline: 184, result: 107, direction: "lower-is-better" },
  },
  {
    slug: "grpc-vs-rest-fanout",
    title: "gRPC fan-out beats REST by 3.1x at 200 downstream calls",
    category: "networking",
    dek: "The gap only opens once fan-out crosses roughly 40 concurrent calls.",
    excerpt:
      "Below 40 concurrent downstream calls, REST and gRPC finish within noise of each other. Past that point connection reuse and header compression start to matter and the gap widens steadily — by 200 calls gRPC completes the full fan-out 3.1x faster on the same hardware.",
    methodology:
      "Synthetic fan-out harness, downstream call count swept from 1 to 400, 200 iterations per step, same service mesh sidecar for both protocols.",
    date: "2026-07-15",
    dateLabel: "Jul 15, 2026",
    author: { name: "Owen Vasquez", role: "Platform networking", seed: 27 },
    readMins: 6,
    sampleSize: 400,
    sampleUnit: "call-count steps",
    confidence: "high",
    metric: { label: "Fan-out completion time", unit: "x", baseline: 3.1, result: 1, direction: "lower-is-better" },
  },
  {
    slug: "edge-cache-tiering",
    title: "Two-tier edge cache trims origin egress 61% with a 4KB budget",
    category: "caching",
    dek: "A small in-process tier ahead of the shared edge cache absorbs the hot 4KB.",
    excerpt:
      "Adding a tiny in-process LRU (4KB effective budget per instance) ahead of the shared edge cache absorbs almost all repeat hits for hot keys, without materially changing the shared cache's own hit rate. Origin egress dropped 61% in the traffic window we sampled.",
    methodology:
      "Shadow-traffic replay against production edge fleet, one week of captured request logs, tiering applied to 50% of edge nodes for an A/B split.",
    date: "2026-07-08",
    dateLabel: "Jul 8, 2026",
    author: { name: "Mireille Aubert", role: "Edge infrastructure", seed: 42 },
    readMins: 5,
    sampleSize: 50,
    sampleUnit: "edge nodes",
    confidence: "medium",
    metric: { label: "Origin egress volume", unit: "%", baseline: 100, result: 39, direction: "lower-is-better" },
  },
  {
    slug: "arm-spot-cost-per-req",
    title: "Arm spot instances hold cost-per-request steady through 4x traffic swings",
    category: "compute",
    dek: "x86 on-demand cost-per-request rose with load; Arm spot barely moved.",
    excerpt:
      "We ran the same request-serving workload on x86 on-demand and Arm-based spot instances across a simulated daily traffic curve. Arm spot cost-per-request stayed within 4% of its baseline through a 4x peak; x86 on-demand rose 33% at the same peak, largely from headroom provisioning.",
    methodology:
      "24h simulated traffic curve replayed 5 times per instance family, autoscaler config identical across families, spot interruptions logged but excluded from the reported runs (none exceeded 2 minutes).",
    date: "2026-06-30",
    dateLabel: "Jun 30, 2026",
    author: { name: "Dade Okafor", role: "Cost & capacity", seed: 8 },
    readMins: 8,
    sampleSize: 5,
    sampleUnit: "traffic-curve replays",
    confidence: "medium",
    metric: { label: "Cost per request at peak", unit: "%", baseline: 100, result: 104, direction: "lower-is-better" },
  },
  {
    slug: "erasure-coding-rebuild",
    title: "Wider erasure coding halves rebuild time, adds 8% steady-state overhead",
    category: "storage",
    dek: "Moving from 6+3 to 12+4 shards changes the rebuild-vs-overhead trade sharply.",
    excerpt:
      "Widening the erasure-coding scheme from 6+3 to 12+4 shards cut single-node rebuild time roughly in half, since more nodes share the reconstruction work. The trade is a measurable rise in steady-state write overhead — worth it for clusters that rebuild often, not for ones that rarely lose a node.",
    methodology:
      "16-node test cluster, single simulated node failure per trial, 10 trials per scheme, steady-state overhead measured over a 6h write-heavy window.",
    date: "2026-06-19",
    dateLabel: "Jun 19, 2026",
    author: { name: "Priya Nathan", role: "Storage engineering", seed: 11 },
    readMins: 6,
    sampleSize: 10,
    sampleUnit: "failure trials",
    confidence: "high",
    metric: { label: "Node rebuild time", unit: "%", baseline: 100, result: 48, direction: "lower-is-better" },
  },
  {
    slug: "connection-pool-tail",
    title: "Fixed connection pools push tail latency onto the slowest 1% of requests",
    category: "databases",
    dek: "A queueing-aware pool holds median latency flat and shrinks the tail instead.",
    excerpt:
      "Fixed-size connection pools keep median latency low by rejecting overflow into a wait queue, but that queue empties onto whichever requests arrive last — the P99.9 tail absorbs almost all of the cost. A queueing-aware pool that sheds load earlier shrank that tail by 55% at the same median.",
    methodology:
      "Load generator sweeping concurrency from 50 to 800 connections, 20-minute steady window per concurrency level, three pool implementations compared under identical traffic.",
    date: "2026-06-11",
    dateLabel: "Jun 11, 2026",
    author: { name: "Sena Okonkwo", role: "Query engine", seed: 19 },
    readMins: 9,
    sampleSize: 800,
    sampleUnit: "concurrency steps",
    confidence: "exploratory",
    metric: { label: "P99.9 latency", unit: "%", baseline: 100, result: 45, direction: "lower-is-better" },
  },
  {
    slug: "http3-cold-start",
    title: "HTTP/3 shaves 180ms off cold-start page loads on lossy networks",
    category: "networking",
    dek: "The win concentrates on the first request; warm connections barely differ.",
    excerpt:
      "On networks with simulated 2% packet loss, HTTP/3's independent streams avoid head-of-line blocking that HTTP/2 pays for on a lost packet. The advantage is almost entirely a cold-start effect — once a connection is warm and loss clears, the two protocols converge within noise.",
    methodology:
      "Network-conditioned lab harness, packet loss injected at 0%, 2%, and 5%, 150 page loads per condition per protocol, cold cache each run.",
    date: "2026-05-27",
    dateLabel: "May 27, 2026",
    author: { name: "Owen Vasquez", role: "Platform networking", seed: 27 },
    readMins: 5,
    sampleSize: 150,
    sampleUnit: "page loads",
    confidence: "medium",
    metric: { label: "Cold-start load time", unit: "ms", baseline: 640, result: 460, direction: "lower-is-better" },
  },
  {
    slug: "cache-stampede-locking",
    title: "Request coalescing prevents stampede-driven origin spikes at scale",
    category: "caching",
    dek: "One in-flight request per key, everyone else waits on the same result.",
    excerpt:
      "When a hot key expires under high concurrency, every waiting request re-fetches from origin at once — a stampede. Coalescing concurrent misses on the same key into a single origin request removed the spike entirely in our load test, at a small median-latency cost for the requests that wait.",
    methodology:
      "Synthetic hot-key expiry test, concurrency held at 2,000 simultaneous requesters, key TTL forced to expire mid-test, five repeated trials.",
    date: "2026-05-14",
    dateLabel: "May 14, 2026",
    author: { name: "Mireille Aubert", role: "Edge infrastructure", seed: 42 },
    readMins: 4,
    sampleSize: 2000,
    sampleUnit: "concurrent requesters",
    confidence: "high",
    metric: { label: "Peak origin request rate", unit: "%", baseline: 100, result: 6, direction: "lower-is-better" },
  },
  {
    slug: "vector-index-recall-cost",
    title: "Wider vector index search lifts recall 9pts for a 22% latency cost",
    category: "compute",
    dek: "Where the recall/latency knob actually pays off for hybrid search.",
    excerpt:
      "Doubling the search breadth on an HNSW index raised top-10 recall from 0.81 to 0.90, but query latency rose 22% alongside it. For a hybrid search workload where results feed a re-ranker anyway, the recall gain outweighed the cost; for latency-bound autocomplete, it did not.",
    methodology:
      "1M-vector benchmark index built once and reused across all trials, breadth parameter swept across five settings, 500 queries sampled per setting.",
    date: "2026-05-02",
    dateLabel: "May 2, 2026",
    author: { name: "Dade Okafor", role: "Cost & capacity", seed: 8 },
    readMins: 7,
    sampleSize: 500,
    sampleUnit: "sampled queries",
    confidence: "exploratory",
    metric: { label: "Query latency", unit: "%", baseline: 100, result: 122, direction: "lower-is-better" },
  },
];

export const TOTAL_REPORTS = REPORTS.length;
export const TOTAL_AUTHORS = new Set(REPORTS.map((r) => r.author.name)).size;
