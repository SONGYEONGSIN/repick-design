/**
 * Every number on the Tessera Extract API contract page, and the arithmetic that binds them.
 *
 * The page is written as a contract rather than a brochure, which means each clause has to resolve
 * to a value the reader can check. So none of the figures below are decorative: the reader supplies
 * a monthly volume, a document profile, a plan and a region, and everything else — the throughput
 * ceiling, the bill, the p95, the day a version stops answering — is derived here by pure functions.
 *
 * The determinism rule bans `new Date()`, which on a page about sunset dates could have been fatal.
 * It became structure instead: `REF_DATE` is the day the contract was last revised, every "days
 * remaining" is a difference of two civil dates computed by arithmetic, and the page says out loud
 * which day it is counting from.
 *
 * `fontFamily` is deliberately *not* exported from here. The static gate's `no-unlisted-font` rule
 * reads the literal immediately after `fontFamily:` and does not resolve constants, so a correct
 * constant reads to the checker as an unknown face and hard-fails the route. Each call site spells
 * `"var(--font-display-grotesk)"` out.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/* ------------------------------------------------------------------ format */

/**
 * 416976 -> "416,976".
 *
 * Written out rather than delegated to `toLocaleString`, whose grouping depends on the ICU data of
 * whichever runtime renders it. Client components render twice — once on the server, once in the
 * browser — and a formatter that can disagree between the two is a hydration mismatch waiting for
 * the wrong machine.
 */
export function groupThousands(value: number): string {
  const digits = String(Math.trunc(Math.abs(value)));
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return value < 0 ? `-${out}` : out;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 2402.784 -> "$2,402.78". Money is always shown to the cent; nothing here is ever rounded up. */
export function usd(value: number): string {
  const rounded = round2(value);
  const whole = Math.trunc(rounded);
  const cents = Math.round((rounded - whole) * 100);
  return `$${groupThousands(whole)}.${String(cents).padStart(2, "0")}`;
}

/** 0.009 -> "$0.0090". Unit prices keep four places because the fourth one is the negotiation. */
export function unitUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}

export function pctText(ratio: number, places = 1): string {
  return `${(ratio * 100).toFixed(places)}%`;
}

export function secText(seconds: number): string {
  return `${seconds.toFixed(2)} s`;
}

/* ------------------------------------------------------------------- dates */

export type CivilDate = { y: number; m: number; d: number };

/**
 * Days since 1970-01-01 for a proleptic Gregorian date, by arithmetic only (Howard Hinnant's
 * `days_from_civil`). No `Date` object is constructed anywhere on this route.
 */
export function daysFromCivil({ y, m, d }: CivilDate): number {
  const shifted = m <= 2 ? y - 1 : y;
  const era = Math.floor(shifted / 400);
  const yearOfEra = shifted - era * 400;
  const dayOfYear = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

export function isoDate({ y, m, d }: CivilDate): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** The day this contract was last revised. Every countdown on the page is measured from it. */
export const REF_DATE: CivilDate = { y: 2026, m: 8, d: 10 };
export const REF_DAY = daysFromCivil(REF_DATE);
export const REF_LABEL = isoDate(REF_DATE);

export function daysFromRef(date: CivilDate): number {
  return daysFromCivil(date) - REF_DAY;
}

/* ------------------------------------------------------------- the ladders */

/** Documents submitted per calendar month. Eight rungs, roughly half an order of magnitude apart. */
export const VOLUME_LADDER = [2_000, 5_000, 12_000, 30_000, 75_000, 150_000, 400_000, 1_000_000];
export const DEFAULT_VOLUME_INDEX = 3;

/**
 * The share of a month's requests that land in its busiest hour.
 *
 * Accounts-payable and lending workloads are not uniform — they arrive when a batch job runs. Sizing
 * against the mean would let this page promise headroom that the reader's first month-end would
 * destroy, so the whole page sizes against a busiest hour carrying a fifth of the month, and says so
 * wherever the number is used.
 */
export const PEAK_SHARE = 0.2;
export const SECONDS_PER_HOUR = 3600;
export const DAYS_PER_MONTH = 30;

/** Hard per-part caps. A document past either of these must be split by the caller before upload. */
export const MAX_PAGES_PER_PART = 200;
export const MAX_MB_PER_PART = 25;

/** Synchronous extraction is offered only under both of these. Everything else is webhook-only. */
export const SYNC_MAX_PAGES = 8;
export const SYNC_MAX_MB = 6;

/** A page we fail to read is still a page we rendered, so it bills at this share of the unit price. */
export const REJECT_BILL_SHARE = 0.4;

/** Extracted JSON is kept this long unless the caller sets `retention: none`. */
export const RETENTION_DAYS = 30;

/* ---------------------------------------------------------------- profiles */

export type ProfileId = "invoice" | "remittance" | "statement" | "loanfile" | "discovery";

export type Profile = {
  id: ProfileId;
  label: string;
  pages: number;
  mb: number;
  /** Share of submitted pages that come back `unreadable_scan`. Measured per document class. */
  rejectRate: number;
  note: string;
};

export const PROFILES: Profile[] = [
  {
    id: "invoice",
    label: "Supplier invoice",
    pages: 2,
    mb: 0.4,
    rejectRate: 0.003,
    note: "Mostly born-digital. The one profile small enough for the synchronous endpoint.",
  },
  {
    id: "remittance",
    label: "Remittance advice",
    pages: 5,
    mb: 1.1,
    rejectRate: 0.006,
    note: "Wide tables, thin margins. Column detection carries the accuracy here.",
  },
  {
    id: "statement",
    label: "Bank statement",
    pages: 14,
    mb: 3.2,
    rejectRate: 0.012,
    note: "Half of these arrive as scans of a print of a PDF. That is where the reject rate comes from.",
  },
  {
    id: "loanfile",
    label: "Loan file",
    pages: 62,
    mb: 18.4,
    rejectRate: 0.024,
    note: "Long, mixed, and often stapled together out of order. Under the caps, but only just.",
  },
  {
    id: "discovery",
    label: "Discovery bundle",
    pages: 240,
    mb: 96,
    rejectRate: 0.038,
    note: "Over both hard caps. Your code has to split it, and the clauses below show what that costs.",
  },
];

export const DEFAULT_PROFILE_ID: ProfileId = "statement";

export function profileById(id: ProfileId): Profile {
  return PROFILES.find((p) => p.id === id) ?? PROFILES[2];
}

/* ------------------------------------------------------------------- plans */

export type PlanId = "build" | "scale" | "atlas";

export type Plan = {
  id: PlanId;
  name: string;
  fee: number;
  /** Page-units included in the fee each month. */
  included: number;
  /** Price of a page-unit past the included allowance. */
  unit: number;
  /** Sustained submissions per second, per account. */
  rps: number;
  /** Token-bucket burst, refilled at the sustained rate. */
  burst: number;
  /** Extraction jobs that may be in flight at once. In practice this is the ceiling that binds. */
  concurrent: number;
  signup: string;
};

export const PLANS: Plan[] = [
  {
    id: "build",
    name: "Build",
    fee: 0,
    included: 25_000,
    unit: 0.014,
    rps: 4,
    burst: 20,
    concurrent: 4,
    signup: "Self-serve. Card on file, no call.",
  },
  {
    id: "scale",
    name: "Scale",
    fee: 900,
    included: 250_000,
    unit: 0.009,
    rps: 20,
    burst: 100,
    concurrent: 24,
    signup: "Self-serve. Upgrade takes effect on the next request.",
  },
  {
    id: "atlas",
    name: "Atlas",
    fee: 6_500,
    included: 2_000_000,
    unit: 0.0055,
    rps: 80,
    burst: 400,
    concurrent: 120,
    signup: "Annual commitment. Dedicated capacity is quoted separately.",
  },
];

export const DEFAULT_PLAN_ID: PlanId = "scale";

export function planById(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[1];
}

/* ----------------------------------------------------------------- regions */

export type RegionId = "us-east" | "eu-west" | "ap-southeast";

export type Region = {
  id: RegionId;
  name: string;
  host: string;
  /** Fixed per-request overhead in seconds: auth, object storage write, queue admission. */
  overhead: number;
  p50Page: number;
  p95Page: number;
  /** Includes queue time at the plan concurrency, which is why it is not a small multiple of p95. */
  p99Page: number;
  residency: string;
};

export const REGIONS: Region[] = [
  {
    id: "us-east",
    name: "us-east · Northern Virginia",
    host: "us-east.api.tessera.dev",
    overhead: 0.21,
    p50Page: 0.29,
    p95Page: 0.47,
    p99Page: 0.78,
    residency: "Documents and extractions stay in the United States. Two sub-processors, both listed at /trust.",
  },
  {
    id: "eu-west",
    name: "eu-west · Dublin",
    host: "eu-west.api.tessera.dev",
    overhead: 0.24,
    p50Page: 0.31,
    p95Page: 0.52,
    p99Page: 0.86,
    residency: "Documents and extractions stay in the EEA. No transfer, so no standard contractual clauses to sign.",
  },
  {
    id: "ap-southeast",
    name: "ap-southeast · Singapore",
    host: "ap-southeast.api.tessera.dev",
    overhead: 0.33,
    p50Page: 0.34,
    p95Page: 0.61,
    p99Page: 1.05,
    residency: "Documents and extractions stay in Singapore. Newest region, and the one with the least spare capacity.",
  },
];

export const DEFAULT_REGION_ID: RegionId = "us-east";

export function regionById(id: RegionId): Region {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}

/* ---------------------------------------------------------------- versions */

export type VersionId = "2024-11-30" | "2025-06-15" | "2026-02-01";

export type ApiVersion = {
  id: VersionId;
  released: CivilDate;
  sunset: CivilDate | null;
  /** Share of live API keys pinned to this version, as of the revision date. */
  keyShare: number;
  /** What a caller on this version must change to reach the current one. */
  breaking: string[];
};

export const VERSIONS: ApiVersion[] = [
  {
    id: "2024-11-30",
    released: { y: 2024, m: 11, d: 30 },
    sunset: { y: 2026, m: 9, d: 30 },
    keyShare: 0.09,
    breaking: [
      "line_items[].amount became a minor-unit integer with a currency sibling. A float will never appear again.",
      "confidence moved from the document root onto each field, and the root value was removed rather than deprecated.",
      "Webhook signatures moved to Tessera-Signature, SHA-256, with a five-minute timestamp window. The old SHA-1 header is gone.",
    ],
  },
  {
    id: "2025-06-15",
    released: { y: 2025, m: 6, d: 15 },
    sunset: { y: 2027, m: 3, d: 31 },
    keyShare: 0.68,
    breaking: [
      "pages[].rotation reports the rotation we applied, not the one we detected. Callers that re-rotated will double-rotate.",
      "An unreadable scan is a 422 with an error body. It used to be a 200 carrying an empty line_items array.",
    ],
  },
  {
    id: "2026-02-01",
    released: { y: 2026, m: 2, d: 1 },
    sunset: null,
    keyShare: 0.23,
    breaking: [],
  },
];

export const CURRENT_VERSION_ID: VersionId = "2026-02-01";
/** The most-pinned version, which is what an existing integration is realistically on. */
export const DEFAULT_VERSION_ID: VersionId = "2025-06-15";

export function versionById(id: VersionId): ApiVersion {
  return VERSIONS.find((v) => v.id === id) ?? VERSIONS[1];
}

/** Minimum notice given before a version stops answering. No announced date has ever moved. */
export const SUNSET_NOTICE_MONTHS = 12;

/** The soonest sunset on the calendar, which is the number the masthead carries. */
export const NEXT_SUNSET = VERSIONS.filter((v) => v.sunset !== null).reduce((soonest, v) =>
  daysFromCivil(v.sunset as CivilDate) < daysFromCivil(soonest.sunset as CivilDate) ? v : soonest,
);

/* ------------------------------------------------------------ the contract */

export type ApiError = {
  code: string;
  status: number;
  /** Occurrences per ten thousand requests, over the sample below. */
  per10k: number;
  retry: string;
  billed: string;
  quota: string;
  /** The obligation this error places on the caller. Not advice — the thing that has to exist. */
  mustDo: string;
  handler: string;
};

export const ERROR_SAMPLE = "41.2 M requests over the 30 days to 2026-08-10";

export const API_ERRORS: ApiError[] = [
  {
    code: "unreadable_scan",
    status: 422,
    per10k: 118,
    retry: "Never. The same file returns the same 422.",
    billed: "40% of the page price",
    quota: "Counts, at 40% of a page-unit",
    mustDo:
      "Route the document to human review and mark the job closed. Resubmitting the identical file bills a second time and fails a second time — the most expensive loop you can write against this API.",
    handler:
      'if (err.code === "unreadable_scan") {\n  await review.enqueue(doc.id, err.pages);   // human, not retry\n  return;                                    // do NOT resubmit\n}',
  },
  {
    code: "rate_limited",
    status: 429,
    per10k: 41,
    retry: "Honour Retry-After, then back off from 250 ms, cap 8 s, 5 attempts",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "Queue and drain; do not spin. A burst of 429s is normal at month-end. Sixty seconds of unbroken 429s is not bad luck, it is a plan one size too small, and your alerting should say so.",
    handler:
      'const wait = Number(res.headers.get("Retry-After") ?? 1) * 1000;\nawait sleep(Math.min(wait * 2 ** attempt, 8000));\nif (attempt === 5) alert.page("tessera saturated");',
  },
  {
    code: "document_too_large",
    status: 413,
    per10k: 12.4,
    retry: "Never. Nothing about the file will change.",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "Split at 200 pages or 25 MB, whichever bites first, and submit the parts with part_index set and a shared idempotency prefix. We will not split it for you, because we cannot know where a document is allowed to be cut.",
    handler:
      "const parts = splitPdf(file, { maxPages: 200, maxBytes: 25 * MB });\nawait Promise.all(parts.map((p, i) =>\n  submit(p, { idempotencyKey: `${base}-${i}`, partIndex: i })));",
  },
  {
    code: "webhook_unreachable",
    status: 424,
    per10k: 6.7,
    retry: "We retry six times over three hours, then stop",
    billed: "Already billed — the extraction succeeded",
    quota: "Already counted",
    mustDo:
      "Nothing in the request path; the job is done and paid for. Fix the endpoint, then call POST /v1/jobs/{id}/redeliver within seven days. After seven days the result is deleted and you pay to extract it again.",
    handler:
      "// out of band, from your own dead-letter sweeper\nfor (const job of await tessera.jobs.list({ status: \"undelivered\" })) {\n  await tessera.jobs.redeliver(job.id);\n}",
  },
  {
    code: "idempotency_conflict",
    status: 409,
    per10k: 3.1,
    retry: "Never",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "You reused a key with a different body. Mint a new key. Dropping the header is not a fix — it converts a duplicate submission into a double charge, which is exactly what the header exists to prevent.",
    handler:
      'if (err.code === "idempotency_conflict") {\n  log.warn({ key }, "key reuse with changed body");\n  return submit(file, { idempotencyKey: newKey() });\n}',
  },
  {
    code: "region_capacity",
    status: 503,
    per10k: 0.9,
    retry: "After 2 s, three attempts, then fail over",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "Hold a second region base URL in configuration and switch to it. We do not fail over for you, because moving your documents across a border is your decision to make, not ours.",
    handler:
      "const hosts = [cfg.primaryHost, cfg.failoverHost];   // set both\nfor (const host of hosts) {\n  const res = await submit(file, { host });\n  if (res.status !== 503) return res;\n}",
  },
  {
    code: "quota_hard_cap",
    status: 402,
    per10k: 0.4,
    retry: "Never. Retrying cannot succeed.",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "This fires only for accounts that set a hard spend cap. Wake a human. There is no backoff that turns a spend cap into capacity, and silently swallowing it means documents disappear.",
    handler:
      'if (err.code === "quota_hard_cap") {\n  await pager.trigger("tessera hard cap reached");\n  await inbox.hold(doc.id);           // keep it, do not drop it\n}',
  },
  {
    code: "version_retired",
    status: 410,
    per10k: 0.1,
    retry: "Never",
    billed: "No",
    quota: "Does not count",
    mustDo:
      "The date in your Tessera-Version header is past its sunset. Only a header change fixes this, and the header change is a code change — which is why clause 5 counts the days out loud.",
    handler:
      '// nothing to catch at runtime. Pin the version in one place:\nconst tessera = new Tessera(key, { version: "2026-02-01" });',
  },
];

export const ERROR_TOTAL_PER_10K = API_ERRORS.reduce((sum, e) => sum + e.per10k, 0);

/* ------------------------------------------------------------- the resolve */

export type Inputs = {
  volumeIndex: number;
  profileId: ProfileId;
  planId: PlanId;
  regionId: RegionId;
};

export const DEFAULT_INPUTS: Inputs = {
  volumeIndex: DEFAULT_VOLUME_INDEX,
  profileId: DEFAULT_PROFILE_ID,
  planId: DEFAULT_PLAN_ID,
  regionId: DEFAULT_REGION_ID,
};

export type PlanOutcome = {
  plan: Plan;
  /** Page-units billed: submitted pages, less the 60% we forgive on pages we could not read. */
  units: number;
  overageUnits: number;
  overageCost: number;
  total: number;
  /** Submissions per second this plan can actually sustain on this profile. */
  ceilingRps: number;
  /** Which of the two limits produced that ceiling. */
  bindingLimit: "concurrency" | "submission rate";
  ceilingDocsPerMonth: number;
  /** Peak demand over the ceiling. Above 1 the plan cannot carry the volume at all. */
  utilisation: number;
};

export type Resolved = {
  docsPerMonth: number;
  profile: Profile;
  plan: Plan;
  region: Region;
  /** Parts each document must be cut into before upload, given the hard caps. */
  parts: number;
  pagesPerPart: number;
  mbPerPart: number;
  syncEligible: boolean;
  requestsPerMonth: number;
  pagesSubmitted: number;
  rejectedPages: number;
  peakRequestsPerHour: number;
  peakRps: number;
  jobP50: number;
  jobP95: number;
  jobP99: number;
  outcomes: PlanOutcome[];
  outcome: PlanOutcome;
  cheapest: PlanOutcome;
  /** Plans whose ceiling covers the peak. Empty means no self-serve plan does. */
  viable: PlanOutcome[];
  costPerDocument: number;
  costPerUnit: number;
};

export function resolve(inputs: Inputs): Resolved {
  const profile = profileById(inputs.profileId);
  const region = regionById(inputs.regionId);
  const plan = planById(inputs.planId);
  const docsPerMonth = VOLUME_LADDER[inputs.volumeIndex] ?? VOLUME_LADDER[DEFAULT_VOLUME_INDEX];

  const parts = Math.max(
    1,
    Math.ceil(profile.pages / MAX_PAGES_PER_PART),
    Math.ceil(profile.mb / MAX_MB_PER_PART),
  );
  const pagesPerPart = Math.ceil(profile.pages / parts);
  const mbPerPart = profile.mb / parts;
  const syncEligible = pagesPerPart <= SYNC_MAX_PAGES && mbPerPart <= SYNC_MAX_MB;

  const requestsPerMonth = docsPerMonth * parts;
  const pagesSubmitted = docsPerMonth * profile.pages;
  const rejectedPages = pagesSubmitted * profile.rejectRate;
  const units = pagesSubmitted - rejectedPages * (1 - REJECT_BILL_SHARE);

  const peakRequestsPerHour = requestsPerMonth * PEAK_SHARE;
  const peakRps = peakRequestsPerHour / SECONDS_PER_HOUR;

  const jobP50 = region.overhead + pagesPerPart * region.p50Page;
  const jobP95 = region.overhead + pagesPerPart * region.p95Page;
  const jobP99 = region.overhead + pagesPerPart * region.p99Page;

  const outcomes: PlanOutcome[] = PLANS.map((p) => {
    const overageUnits = Math.max(0, units - p.included);
    const overageCost = round2(overageUnits * p.unit);
    const throughput = p.concurrent / jobP95;
    const ceilingRps = Math.min(p.rps, throughput);
    return {
      plan: p,
      units,
      overageUnits,
      overageCost,
      total: round2(p.fee + overageCost),
      ceilingRps,
      bindingLimit: throughput <= p.rps ? "concurrency" : "submission rate",
      ceilingDocsPerMonth: Math.floor((ceilingRps * SECONDS_PER_HOUR) / PEAK_SHARE / parts),
      utilisation: peakRps / ceilingRps,
    };
  });

  const outcome = outcomes.find((o) => o.plan.id === plan.id) ?? outcomes[1];
  const cheapest = outcomes.reduce((best, o) => (o.total < best.total ? o : best));
  const viable = outcomes.filter((o) => o.utilisation <= 1);

  return {
    docsPerMonth,
    profile,
    plan,
    region,
    parts,
    pagesPerPart,
    mbPerPart,
    syncEligible,
    requestsPerMonth,
    pagesSubmitted,
    rejectedPages,
    peakRequestsPerHour,
    peakRps,
    jobP50,
    jobP95,
    jobP99,
    outcomes,
    outcome,
    cheapest,
    viable,
    costPerDocument: outcome.total / docsPerMonth,
    costPerUnit: outcome.total / units,
  };
}

/** The six clauses, in the order a reader hits a wall in them. */
export const CLAUSES = [
  { id: "clause-1", n: "1", title: "Rate, burst, concurrency" },
  { id: "clause-2", n: "2", title: "Quota and what it costs" },
  { id: "clause-3", n: "3", title: "Latency and which mode you get" },
  { id: "clause-4", n: "4", title: "The error contract" },
  { id: "clause-5", n: "5", title: "Versions and sunsets" },
  { id: "clause-6", n: "6", title: "Keys and the first call" },
];
