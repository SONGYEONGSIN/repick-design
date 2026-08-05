// app/src/app/blog-evolve/r2/a/data.ts
//
// Continuum — a systems-engineering research & education group. Its blog is organized around
// "Series": ordered, multi-part investigations a reader works through in sequence, plus a smaller
// set of standalone "Essays" that don't belong to any series. Series membership (which series, and
// which part) is the primary structural device for this candidate, per the round's assignment.
//
// All dates below are fixed display strings, never `new Date()` / `Date.now()` — the brief bans both
// for hydration determinism. Hues are plain integers (no trig), reused by cover-tile.tsx for
// deterministic per-item SVG art instead of any remote image host.

export type PartStatus = "published" | "upcoming";

export type Part = {
  id: string;
  index: number; // 1-based position within its series
  title: string;
  dek: string; // one-line summary shown collapsed
  summary: string; // longer text revealed on expand
  readMins: number;
  status: PartStatus;
  tags: string[];
};

export type SeriesId = "consensus" | "query-planning" | "observability";

export type Series = {
  id: SeriesId;
  title: string;
  tagline: string;
  description: string;
  hue: number;
  parts: Part[];
};

export const SERIES: Series[] = [
  {
    id: "consensus",
    title: "Consensus from First Principles",
    tagline: "Why distributed systems disagree, and how they stop.",
    description:
      "A six-part walk from the FLP impossibility result to a working toy consensus engine, aimed at engineers who've used Raft or Paxos-based systems without ever tracing why the algorithm is shaped the way it is.",
    hue: 350,
    parts: [
      {
        id: "consensus-1",
        index: 1,
        title: "Why Distributed Systems Disagree",
        dek: "Two nodes, one network partition, and no way to tell a slow peer from a dead one.",
        summary:
          "We start with the smallest possible disagreement: two nodes and a partitioned network. This part builds the vocabulary — safety, liveness, and the impossibility of distinguishing 'slow' from 'dead' — that every later part in the series leans on.",
        readMins: 9,
        status: "published",
        tags: ["distributed-systems", "consensus"],
      },
      {
        id: "consensus-2",
        index: 2,
        title: "The FLP Impossibility Result, Explained",
        dek: "No deterministic algorithm can guarantee consensus in an asynchronous network with even one faulty process.",
        summary:
          "FLP gets cited constantly and read rarely. We work through the 1985 proof at the pace of an engineer, not a theorist, and land on the practical takeaway: every real consensus system quietly gives up something FLP says you can't have for free.",
        readMins: 11,
        status: "published",
        tags: ["consensus", "papers"],
      },
      {
        id: "consensus-3",
        index: 3,
        title: "Paxos Without the Mystique",
        dek: "Prepare, promise, accept, accepted — four messages, and most of the confusion is in the names.",
        summary:
          "Paxos has a reputation for being hard to explain that outlives most attempts to explain it. This part strips the protocol to its four message types and shows why each one exists, with the classic 'Paxos Made Simple' shortcuts restored rather than skipped.",
        readMins: 13,
        status: "published",
        tags: ["consensus", "papers"],
      },
      {
        id: "consensus-4",
        index: 4,
        title: "Raft: Consensus You Can Actually Debug",
        dek: "Raft traded some of Paxos's generality for a log and a leader you can point a debugger at.",
        summary:
          "Raft's real innovation wasn't a new algorithm so much as a new priority: understandability. This part covers leader election, log replication, and the specific design choices that make a Raft cluster's state legible from the outside.",
        readMins: 10,
        status: "published",
        tags: ["consensus", "distributed-systems"],
      },
      {
        id: "consensus-5",
        index: 5,
        title: "Byzantine Faults and When You Actually Need Them",
        dek: "Most systems assume crash faults. This part is about the ones that can't.",
        summary:
          "Byzantine fault tolerance protects against nodes that lie, not just nodes that stop. We cover where that assumption is load-bearing (multi-party systems, adversarial environments) and where it's expensive overkill for a private cluster.",
        readMins: 12,
        status: "upcoming",
        tags: ["consensus", "distributed-systems"],
      },
      {
        id: "consensus-6",
        index: 6,
        title: "Building a Toy Consensus Engine in 200 Lines",
        dek: "The series ends where it should: a working, readable implementation you can step through.",
        summary:
          "We close the series by implementing a minimal Raft-shaped consensus engine end to end, with every simplification called out explicitly so the toy version stays honest about what it isn't handling.",
        readMins: 15,
        status: "upcoming",
        tags: ["consensus", "distributed-systems"],
      },
    ],
  },
  {
    id: "query-planning",
    title: "Query Planning Deep Dive",
    tagline: "How a SQL query becomes a plan, and how to read one.",
    description:
      "Four parts tracing a query from parse tree to executed plan, written for engineers who can write a join but have never had to explain why the planner chose the order it did.",
    hue: 205,
    parts: [
      {
        id: "query-planning-1",
        index: 1,
        title: "How a SQL Query Becomes a Plan",
        dek: "Parse, bind, rewrite, optimize, execute — five stages, and most of the interesting decisions happen in the fourth.",
        summary:
          "Before optimization can make sense, the pipeline that precedes it has to. This part walks a single query through parsing, name binding, and rule-based rewriting before the cost-based optimizer ever sees it.",
        readMins: 8,
        status: "published",
        tags: ["databases", "query-optimization"],
      },
      {
        id: "query-planning-2",
        index: 2,
        title: "Cost-Based Optimization in Practice",
        dek: "The optimizer isn't finding the best plan — it's finding the best plan it can estimate the cost of.",
        summary:
          "Cost models are estimates built on statistics that go stale. This part covers how selectivity and cardinality estimates are built, why they drift, and the query shapes where a bad estimate does the most damage.",
        readMins: 10,
        status: "published",
        tags: ["databases", "query-optimization"],
      },
      {
        id: "query-planning-3",
        index: 3,
        title: "Join Ordering, and Why It's NP-Hard",
        dek: "Ten tables have over three million possible join orders. The planner doesn't check all of them.",
        summary:
          "Join order determines the size of every intermediate result downstream, which makes it the single highest-leverage decision the optimizer makes. We cover the dynamic-programming and greedy heuristics real planners use to avoid the exhaustive search.",
        readMins: 9,
        status: "published",
        tags: ["databases", "query-optimization"],
      },
      {
        id: "query-planning-4",
        index: 4,
        title: "Reading EXPLAIN Output Like an Engineer",
        dek: "The series ends with the skill that started it: making sense of the plan your own database gives you.",
        summary:
          "We close by reading real EXPLAIN ANALYZE output line by line, matching each node back to the concepts from the first three parts, so the closing skill is one you can use on your own queries the same afternoon.",
        readMins: 7,
        status: "upcoming",
        tags: ["databases", "query-optimization"],
      },
    ],
  },
  {
    id: "observability",
    title: "Observability at Scale",
    tagline: "Metrics, logs, traces, and the on-call rotations that depend on all three.",
    description:
      "Five parts on instrumenting a system that's grown past the point where any one engineer can hold its whole shape in their head, and on the dashboards and runbooks that make that manageable.",
    hue: 160,
    parts: [
      {
        id: "observability-1",
        index: 1,
        title: "Metrics, Logs, and Traces Aren't the Same Job",
        dek: "Three signals get lumped together as 'observability.' Each answers a different question.",
        summary:
          "Metrics tell you something is wrong. Traces tell you where. Logs tell you why. This part is about matching each signal to the question it's actually good at answering, so instrumentation effort stops being spread evenly by default.",
        readMins: 7,
        status: "published",
        tags: ["observability", "sre"],
      },
      {
        id: "observability-2",
        index: 2,
        title: "Cardinality Is the Real Enemy",
        dek: "A single high-cardinality label can turn a cheap metric into your most expensive one.",
        summary:
          "Most metrics bills and query timeouts trace back to cardinality, not volume. This part covers how to spot a cardinality explosion before it ships, and the label design patterns that keep dashboards fast at scale.",
        readMins: 9,
        status: "published",
        tags: ["observability"],
      },
      {
        id: "observability-3",
        index: 3,
        title: "Sampling Strategies for High-Volume Traces",
        dek: "Tracing every request is free until it isn't. Sampling well means never dropping the trace you needed.",
        summary:
          "Head-based sampling is simple and drops the traces you'd most want to keep — the slow, erroring ones. This part covers tail-based sampling and the buffering it requires, with the tradeoffs made explicit.",
        readMins: 11,
        status: "published",
        tags: ["observability"],
      },
      {
        id: "observability-4",
        index: 4,
        title: "Building Golden-Signal Dashboards That Get Used",
        dek: "Latency, traffic, errors, saturation — the four signals, and the dashboard layout that keeps them legible.",
        summary:
          "A dashboard with forty panels gets glanced at once and then ignored. This part is a layout method built around the four golden signals, aimed at a dashboard someone actually opens during an incident.",
        readMins: 8,
        status: "published",
        tags: ["observability", "sre"],
      },
      {
        id: "observability-5",
        index: 5,
        title: "On-Call Runbooks That Actually Get Read",
        dek: "The series closes on the document nobody wants to write and everybody needs at 3am.",
        summary:
          "We close with what makes a runbook get followed under pressure rather than abandoned for a Slack thread: structure, staleness checks, and the one rule that keeps a runbook from silently drifting out of date.",
        readMins: 6,
        status: "upcoming",
        tags: ["observability", "sre", "on-call"],
      },
    ],
  },
];

export type Essay = {
  slug: string;
  title: string;
  dek: string;
  tags: string[];
  readMins: number;
  dateLabel: string; // fixed display string, not a Date
  hue: number;
};

export const ESSAYS: Essay[] = [
  {
    slug: "boring-infrastructure",
    title: "The Case for Boring Infrastructure",
    dek: "Novelty is a cost center. Here's what we optimize for instead when a new tool shows up in a proposal.",
    tags: ["culture", "architecture"],
    readMins: 6,
    dateLabel: "Jul 30, 2026",
    hue: 20,
  },
  {
    slug: "kubernetes-back-and-forth",
    title: "Why We Left Kubernetes, and Why We Came Back",
    dek: "Two migrations, eighteen months apart, and the one constraint that made the second decision different.",
    tags: ["architecture", "culture"],
    readMins: 9,
    dateLabel: "Jul 18, 2026",
    hue: 265,
  },
  {
    slug: "reading-papers-without-a-phd",
    title: "Reading Systems Papers Without a PhD",
    dek: "A five-pass method for getting through a paper you don't yet have the background to read cold.",
    tags: ["papers", "culture"],
    readMins: 7,
    dateLabel: "Jul 9, 2026",
    hue: 340,
  },
  {
    slug: "half-life-of-a-runbook",
    title: "The Half-Life of a Runbook",
    dek: "Most runbooks are wrong within six months of being written. We measured how wrong, and why.",
    tags: ["sre", "on-call", "incident-response"],
    readMins: 5,
    dateLabel: "Jun 27, 2026",
    hue: 145,
  },
  {
    slug: "what-postmortems-are-for",
    title: "What Postmortems Are Actually For",
    dek: "Not blame, not paperwork — a postmortem has exactly one job: change what happens next time.",
    tags: ["incident-response", "sre", "culture"],
    readMins: 8,
    dateLabel: "Jun 12, 2026",
    hue: 30,
  },
  {
    slug: "reading-code-you-didnt-write",
    title: "Notes on Reading Code You Didn't Write",
    dek: "A checklist for the first hour in an unfamiliar codebase, before you touch anything in it.",
    tags: ["culture", "architecture"],
    readMins: 6,
    dateLabel: "May 29, 2026",
    hue: 285,
  },
];

export const TAG_LABELS: Record<string, string> = {
  culture: "Culture",
  architecture: "Architecture",
  papers: "Papers",
  sre: "SRE",
  "on-call": "On-call",
  "incident-response": "Incident response",
};

export const ALL_TAGS: { id: string; label: string; count: number }[] = Object.keys(TAG_LABELS)
  .map((id) => ({
    id,
    label: TAG_LABELS[id],
    count: ESSAYS.filter((e) => e.tags.includes(id)).length,
  }))
  .filter((t) => t.count > 0);

export const TOTAL_PARTS = SERIES.reduce((sum, s) => sum + s.parts.length, 0);
export const TOTAL_PUBLISHED_PARTS = SERIES.reduce(
  (sum, s) => sum + s.parts.filter((p) => p.status === "published").length,
  0,
);
export const TOTAL_SERIES = SERIES.length;
export const TOTAL_ESSAYS = ESSAYS.length;
