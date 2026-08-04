// Stackrail Engineering Blog — deterministic seed data. No Math.random / Date.now / new Date():
// every date below is a fixed ISO string and sorts correctly as a string because the format is
// zero-padded YYYY-MM-DD.

export type CategoryId =
  | "architecture"
  | "reliability"
  | "performance"
  | "dx"
  | "open-source"
  | "release-notes";

export type Category = {
  id: CategoryId;
  label: string;
  /** Tailwind text color class for the category's dot + tag label (all AA on white, see candidate notes). */
  text: string;
  /** Tailwind bg color class for the small identifying dot next to the tag label. */
  dot: string;
};

export const CATEGORIES: Category[] = [
  { id: "architecture", label: "Architecture", text: "text-teal-700", dot: "bg-teal-500" },
  { id: "reliability", label: "Reliability & incidents", text: "text-rose-700", dot: "bg-rose-500" },
  { id: "performance", label: "Performance", text: "text-amber-700", dot: "bg-amber-500" },
  { id: "dx", label: "Developer experience", text: "text-sky-700", dot: "bg-sky-500" },
  { id: "open-source", label: "Open source", text: "text-emerald-700", dot: "bg-emerald-500" },
  { id: "release-notes", label: "Release notes", text: "text-orange-700", dot: "bg-orange-500" },
];

export type AuthorId =
  | "priya-nandakumar"
  | "marcus-feld"
  | "renata-souza"
  | "owen-tran"
  | "dana-whitfield"
  | "kai-sorensen"
  | "ingrid-lachlan";

export type Author = {
  id: AuthorId;
  name: string;
  role: string;
  initials: string;
};

export const AUTHORS: Record<AuthorId, Author> = {
  "priya-nandakumar": { id: "priya-nandakumar", name: "Priya Nandakumar", role: "Staff Engineer, Orchestration", initials: "PN" },
  "marcus-feld": { id: "marcus-feld", name: "Marcus Feld", role: "Site Reliability Engineer", initials: "MF" },
  "renata-souza": { id: "renata-souza", name: "Renata Souza", role: "Engineering Manager, Platform", initials: "RS" },
  "owen-tran": { id: "owen-tran", name: "Owen Tran", role: "Senior Software Engineer", initials: "OT" },
  "dana-whitfield": { id: "dana-whitfield", name: "Dana Whitfield", role: "Developer Advocate", initials: "DW" },
  "kai-sorensen": { id: "kai-sorensen", name: "Kai Sorensen", role: "Performance Engineer", initials: "KS" },
  "ingrid-lachlan": { id: "ingrid-lachlan", name: "Ingrid Lachlan", role: "Co-founder & CTO", initials: "IL" },
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  category: CategoryId;
  author: AuthorId;
  date: string; // ISO, fixed
  dateLabel: string;
  readMins: number;
  reads: number;
};

export const ARTICLES: Article[] = [
  {
    slug: "single-log-scheduler",
    title: "Why we rebuilt the scheduler around a single append-only log",
    dek: "Every retry, backoff and dead-letter used to be its own code path. Now they're all replays of one log.",
    excerpt:
      "We spent four months collapsing six separate retry mechanisms into one: an append-only log that every worker replays to reach its current state. The payoff wasn't fewer bugs so much as fewer places bugs could hide — state is now a pure function of the log, not of whichever service happened to touch a job last.",
    category: "architecture",
    author: "priya-nandakumar",
    date: "2026-08-01",
    dateLabel: "Aug 1, 2026",
    readMins: 11,
    reads: 18420,
  },
  {
    slug: "control-plane-data-plane-split",
    title: "Splitting the control plane from the data plane, three years late",
    dek: "The scheduler and the runner shared a process for three years. Here's what finally forced them apart.",
    excerpt:
      "Coupling the thing that decides what runs to the thing that runs it felt fine at 200 workflows a day. At 200,000 it meant a slow customer query could stall dispatch for everyone. This is the migration plan we used to split them without a maintenance window, and the two failure modes we didn't anticipate.",
    category: "architecture",
    author: "renata-souza",
    date: "2026-07-24",
    dateLabel: "Jul 24, 2026",
    readMins: 9,
    reads: 11280,
  },
  {
    slug: "dag-compiler-retries-as-edges",
    title: "A DAG compiler that treats retries as first-class edges",
    dek: "Modeling a retry as a graph edge instead of a runtime exception changed how our compiler validates workflows.",
    excerpt:
      "Most workflow engines bolt retries on as an exception handler wrapped around a step. We compile them into the graph itself, as edges with their own backoff policy attached — which means a workflow's retry behavior is visible, diffable and testable before a single instance ever runs.",
    category: "architecture",
    author: "owen-tran",
    date: "2026-07-14",
    dateLabel: "Jul 14, 2026",
    readMins: 8,
    reads: 7640,
  },
  {
    slug: "versioning-workflow-definitions",
    title: "How we version workflow definitions without breaking running instances",
    dek: "Deploying a new workflow version used to mean waiting for every in-flight run to drain first.",
    excerpt:
      "In-flight instances now pin to the definition they started with, while new triggers pick up the latest version automatically — no drain window, no dual-write. The trick was separating 'definition' from 'schema' so a step can be renamed without invalidating history that already references it.",
    category: "architecture",
    author: "priya-nandakumar",
    date: "2026-06-19",
    dateLabel: "Jun 19, 2026",
    readMins: 7,
    reads: 6190,
  },
  {
    slug: "multi-tenant-queue-redesign",
    title: "The multi-tenant queue redesign that cut noisy-neighbor incidents to zero",
    dek: "One customer's retry storm used to be everyone's latency spike. Fair-share scheduling fixed that.",
    excerpt:
      "We moved from a single global queue to per-tenant virtual queues with weighted fair-share dequeuing. It sounds like a small change; it removed an entire incident category from our postmortem archive and let us stop hand-tuning rate limits per account.",
    category: "architecture",
    author: "marcus-feld",
    date: "2026-05-27",
    dateLabel: "May 27, 2026",
    readMins: 10,
    reads: 9840,
  },
  {
    slug: "postmortem-47-minute-backlog",
    title: "Postmortem: the 47-minute queue backlog that taught us about backpressure",
    dek: "A downstream webhook endpoint slowed down by 200ms. Forty-seven minutes later, 40,000 jobs were queued.",
    excerpt:
      "No single component failed. Every component did exactly what it was built to do, and together they built a wall. This is the full timeline, the five contributing factors, and the backpressure signal we added so a slow consumer can no longer become everyone's outage.",
    category: "reliability",
    author: "marcus-feld",
    date: "2026-07-28",
    dateLabel: "Jul 28, 2026",
    readMins: 12,
    reads: 21930,
  },
  {
    slug: "chaos-testing-retry-storms",
    title: "Chaos-testing our own retry storms before customers do",
    dek: "We built a harness that deliberately fails 30% of webhook deliveries and watches what the retry logic does next.",
    excerpt:
      "Retry logic is one of those things that looks correct in a code review and only reveals its edge cases under sustained, correlated failure. Our chaos harness runs nightly against a staging fleet, replaying real production traffic shapes with injected failure, and it has caught three thundering-herd bugs before they shipped.",
    category: "reliability",
    author: "marcus-feld",
    date: "2026-07-10",
    dateLabel: "Jul 10, 2026",
    readMins: 8,
    reads: 8320,
  },
  {
    slug: "paging-on-budgets-not-symptoms",
    title: "Why we stopped paging on symptoms and started paging on budgets",
    dek: "CPU-over-80% pages taught us nothing. Error-budget-burn-rate pages tell on-call exactly how urgent it is.",
    excerpt:
      "We deleted 34 threshold-based alerts and replaced them with six burn-rate alerts tied to our published SLOs. Page volume dropped by more than half in the first month, and the pages that remained were, without exception, worth waking up for.",
    category: "reliability",
    author: "renata-souza",
    date: "2026-06-23",
    dateLabel: "Jun 23, 2026",
    readMins: 6,
    reads: 10450,
  },
  {
    slug: "two-years-of-error-budgets",
    title: "Two years of error budgets: what actually changed our on-call rotation",
    dek: "A retrospective on the SLO program, including the quarter it nearly got cancelled for being too strict.",
    excerpt:
      "Error budgets are easy to adopt and easy to abandon the first time one blocks a launch a VP wanted. This is the case for keeping them anyway, with two years of burn-rate data and the one policy change that made the program survivable: a budget freeze during declared incidents.",
    category: "reliability",
    author: "renata-souza",
    date: "2026-05-13",
    dateLabel: "May 13, 2026",
    readMins: 9,
    reads: 5920,
  },
  {
    slug: "cold-start-latency-worker-pods",
    title: "Cutting cold-start latency on worker pods from 4.2s to 380ms",
    dek: "Most of that 4.2 seconds turned out to be import-time work our runtime was redoing on every single cold start.",
    excerpt:
      "A flame graph of a cold worker boot showed 3.1 seconds spent re-resolving dependencies we could have cached. Snapshotting the runtime after warmup and restoring from that snapshot on scale-out did almost all of the work; the remaining gains came from lazy-loading connectors nobody's first job actually uses.",
    category: "performance",
    author: "kai-sorensen",
    date: "2026-07-21",
    dateLabel: "Jul 21, 2026",
    readMins: 10,
    reads: 14760,
  },
  {
    slug: "profiling-scheduler-50000-runs",
    title: "Profiling a scheduler under 50,000 concurrent runs",
    dek: "Our load-testing rig finally found the lock contention that only shows up past 40,000 concurrent instances.",
    excerpt:
      "Below 40,000 concurrent workflow instances, everything looked fine on every dashboard we had. The contention was in a mutex around instance-state writes that only became visible once we profiled with sampling fine-grained enough to see individual lock waits — a technique this post walks through end to end.",
    category: "performance",
    author: "kai-sorensen",
    date: "2026-06-15",
    dateLabel: "Jun 15, 2026",
    readMins: 9,
    reads: 6870,
  },
  {
    slug: "removed-index-faster-dashboards",
    title: "The index we removed that made every dashboard query faster",
    dek: "A well-intentioned composite index was quietly forcing the planner away from a much better plan.",
    excerpt:
      "Adding indexes is the reflexive fix for a slow query; removing one is a much harder sell in a review. This is the query-plan evidence that got a two-year-old composite index dropped, and the 40% p95 improvement across every dashboard that hit the same table.",
    category: "performance",
    author: "owen-tran",
    date: "2026-05-18",
    dateLabel: "May 18, 2026",
    readMins: 6,
    reads: 4930,
  },
  {
    slug: "batching-webhook-deliveries",
    title: "Batching webhook deliveries without adding a second of lag",
    dek: "Batching usually trades latency for throughput. We wanted both, so we batched on the wire, not in the queue.",
    excerpt:
      "Coalescing outbound webhook deliveries at the HTTP/2 connection level — rather than holding events in a buffer — cut our outbound request volume by 60% with no measurable increase in delivery latency. The details are all in how the connection pool decides when a batch is 'full enough.'",
    category: "performance",
    author: "kai-sorensen",
    date: "2026-05-04",
    dateLabel: "May 4, 2026",
    readMins: 7,
    reads: 5310,
  },
  {
    slug: "cli-explains-why-workflow-did-not-trigger",
    title: "A CLI that explains why your workflow didn't trigger",
    dek: "\"It should have run\" was our most common support ticket. Now the CLI answers that question itself.",
    excerpt:
      "`stackrail why <run-id>` walks the trigger evaluation the same way the scheduler did — condition by condition — and prints the first one that failed, in plain language. Support tickets asking why a trigger didn't fire dropped by 70% in the first month it shipped.",
    category: "dx",
    author: "dana-whitfield",
    date: "2026-07-17",
    dateLabel: "Jul 17, 2026",
    readMins: 5,
    reads: 9160,
  },
  {
    slug: "local-run-replay",
    title: "Local run replay: debugging production workflows on a laptop",
    dek: "Pull a production run's exact inputs, secrets excluded, and step through it locally with a real debugger.",
    excerpt:
      "Reproducing a production failure used to mean re-reading logs and guessing. `stackrail replay` downloads the exact step inputs and timing of a real run — with secrets redacted and replaced by local stand-ins — so you can set a breakpoint in your own IDE and watch it happen again.",
    category: "dx",
    author: "dana-whitfield",
    date: "2026-06-10",
    dateLabel: "Jun 10, 2026",
    readMins: 6,
    reads: 7440,
  },
  {
    slug: "type-safe-workflow-definitions",
    title: "Type-safe workflow definitions, without a new language",
    dek: "We wanted compile-time checking for workflow graphs without asking anyone to learn a DSL.",
    excerpt:
      "Our SDK generates workflow definitions from plain TypeScript functions and infers the graph from how you call them, which means a step that expects the wrong shape of input is a red squiggle in your editor, not a failed run three weeks later in production.",
    category: "dx",
    author: "owen-tran",
    date: "2026-05-08",
    dateLabel: "May 8, 2026",
    readMins: 8,
    reads: 6020,
  },
  {
    slug: "open-sourced-dag-visualizer",
    title: "We open-sourced our DAG visualizer — here's why",
    dek: "The tool we built to debug our own workflows internally is now MIT-licensed and works with any DAG.",
    excerpt:
      "It started as a Saturday project to make our own incident reviews less painful and turned into the tool half the team opens before opening a log file. It doesn't care where your DAG comes from, so we cut the two lines coupling it to our internal format and shipped it.",
    category: "open-source",
    author: "dana-whitfield",
    date: "2026-07-07",
    dateLabel: "Jul 7, 2026",
    readMins: 5,
    reads: 12980,
  },
  {
    slug: "maintaining-public-sdk-three-release-trains",
    title: "Maintaining a public SDK with three release trains",
    dek: "Stable, beta and nightly, each with its own compatibility promise. Here's the branching model behind it.",
    excerpt:
      "Running three simultaneous release trains for one SDK sounded like a maintenance nightmare until we stopped trying to cherry-pick fixes backward and started building nightly as the source of truth that stable and beta both fork from on a schedule, not a whim.",
    category: "open-source",
    author: "ingrid-lachlan",
    date: "2026-06-05",
    dateLabel: "Jun 5, 2026",
    readMins: 7,
    reads: 4580,
  },
  {
    slug: "year-of-external-contributions",
    title: "What a year of external contributions changed about our API",
    dek: "Outside contributors kept hitting the same three rough edges. We finally listened and redesigned around them.",
    excerpt:
      "Twelve months of public issues and pull requests surfaced a pattern we'd missed from the inside: everyone new to the SDK stumbled on the same three seams. This post walks through the API changes those contributions forced, and why we think they made the internal API better too.",
    category: "open-source",
    author: "ingrid-lachlan",
    date: "2026-05-22",
    dateLabel: "May 22, 2026",
    readMins: 6,
    reads: 3970,
  },
  {
    slug: "release-4-0",
    title: "Stackrail 4.0: durable timers, native retries, and a faster UI",
    dek: "The biggest release since launch — durable sleep up to a year, retries as a first-class step type, and a rebuilt console.",
    excerpt:
      "4.0 replaces our old polling-based delay step with durable timers that survive redeploys and can sleep for up to a year at effectively zero cost, adds retry policies you configure instead of code, and ships a console rebuild that's roughly three times faster on large workflow graphs.",
    category: "release-notes",
    author: "ingrid-lachlan",
    date: "2026-07-31",
    dateLabel: "Jul 31, 2026",
    readMins: 4,
    reads: 16240,
  },
  {
    slug: "release-august",
    title: "August release: scoped API keys and per-step timeouts",
    dek: "API keys can now be scoped to a single workflow, and every step can carry its own timeout independent of the run.",
    excerpt:
      "Two frequently requested changes land this month: API keys scoped to a specific workflow or read-only access, and per-step timeouts so one slow integration can no longer hold an entire run hostage until the global timeout catches up.",
    category: "release-notes",
    author: "renata-souza",
    date: "2026-08-01",
    dateLabel: "Aug 1, 2026",
    readMins: 3,
    reads: 5480,
  },
  {
    slug: "release-july",
    title: "July release: workflow versioning goes GA",
    dek: "Definition versioning — in beta since March — is now generally available with a documented migration path.",
    excerpt:
      "Versioning moves from beta to GA this release, along with a CLI migration command that rewrites existing triggers to pin to their current version explicitly, so nothing changes behavior on upgrade unless you ask it to.",
    category: "release-notes",
    author: "priya-nandakumar",
    date: "2026-07-02",
    dateLabel: "Jul 2, 2026",
    readMins: 3,
    reads: 4210,
  },
];

export const CATEGORY_COUNTS: Record<CategoryId, number> = ARTICLES.reduce(
  (acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  },
  {} as Record<CategoryId, number>,
);

export const TOTAL_ARTICLES = ARTICLES.length;
export const TOTAL_AUTHORS = Object.keys(AUTHORS).length;
