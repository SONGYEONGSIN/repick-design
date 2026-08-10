/**
 * Tessera — "Contact" (auto-contact-r1 / candidate c).
 *
 * Deflection-first desk: the page tries to answer before it takes a message, but never hides an
 * address to do it. Every literal here is hand-authored and fixed — no Math.random, no Date.now, no
 * new Date() anywhere in this route. The "when will I hear back" arithmetic runs off a *chosen*
 * weekday/hour, never off the visitor's clock, so server and client render the same thing.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2";

export const COMPANY = {
  name: "Tessera",
  product: "Tessera Reconcile",
  line: "the reconciliation layer payment-operations teams run between their processors and their ledger",
  statusUrl: "https://status.tessera.co",
  docsUrl: "https://docs.tessera.co",
  postal: "Tessera Financial Systems, 118 Ravenswood Row, Suite 4, Cambridge MA 02141, United States",
  registered: "Registered in Delaware, no. 7742119",
};

/* ------------------------------------------------------------------ desks */

export type DeskId = "support" | "billing" | "trust" | "partners";

/** A staffed span, in UTC. `days` is 0 = Monday … 6 = Sunday; `start`/`end` are minutes of day. */
export type Window = { days: number[]; start: number; end: number };

export type Desk = {
  id: DeskId;
  name: string;
  email: string;
  purpose: string;
  covers: string[];
  notFor: string;
  owner: { name: string; role: string };
  altChannel: { label: string; value: string };
  hoursLabel: string;
  windows: Window[];
  /** Minutes of *staffed* time to a first human reply. Trailing twelve months, fixed. */
  medianMinutes: number;
  p90Minutes: number;
  /** Share of last quarter's inbound that landed here. Sums to 100. */
  volumeShare: number;
};

export const DESKS: Desk[] = [
  {
    id: "support",
    name: "Product & API support",
    email: "support@tessera.co",
    purpose: "Anything the software is doing that you did not expect.",
    covers: ["Imports, matching rules, exports", "API errors and webhook delivery", "Manual replays and backfills"],
    notFor: "Contract terms and invoice disputes — those go to Accounts, who can actually change them.",
    owner: { name: "Dara Okonjo", role: "Head of Support" },
    altChannel: { label: "In-app", value: "Help menu, then Message support" },
    hoursLabel: "Mon–Fri 06:00–23:00 UTC · Sat–Sun 09:00–17:00 UTC",
    windows: [
      { days: [0, 1, 2, 3, 4], start: 360, end: 1380 },
      { days: [5, 6], start: 540, end: 1020 },
    ],
    medianMinutes: 34,
    p90Minutes: 132,
    volumeShare: 58,
  },
  {
    id: "billing",
    name: "Accounts & billing",
    email: "billing@tessera.co",
    purpose: "Invoices, seats, plan changes, purchase orders, tax documents.",
    covers: ["Invoice corrections and reissues", "Seat and plan changes", "PO numbers, W-9s, VAT IDs"],
    notFor: "Anything that needs a log line read. Support answers faster on those and can escalate here.",
    owner: { name: "Marta Vilchez", role: "Accounts Manager" },
    altChannel: { label: "Post", value: "Include your invoice number on any mailed document" },
    hoursLabel: "Mon–Fri 08:00–17:00 UTC",
    windows: [{ days: [0, 1, 2, 3, 4], start: 480, end: 1020 }],
    medianMinutes: 96,
    p90Minutes: 384,
    volumeShare: 21,
  },
  {
    id: "trust",
    name: "Trust & security",
    email: "security@tessera.co",
    purpose: "Vulnerability reports, DPAs, subprocessors, audit evidence, data-erasure requests.",
    covers: ["Coordinated disclosure", "DPA, SOC 2, pen-test letters", "Erasure and export requests"],
    notFor: "Password resets. Those are self-serve and Support handles the stuck ones.",
    owner: { name: "Ilya Brandt", role: "Security Engineering" },
    altChannel: { label: "PGP", value: "Key fingerprint 4C1B 90A7 22DE 5F08 · published on the trust centre" },
    hoursLabel: "Paged 24/7 for disclosures",
    windows: [{ days: [0, 1, 2, 3, 4, 5, 6], start: 0, end: 1440 }],
    medianMinutes: 47,
    p90Minutes: 118,
    volumeShare: 7,
  },
  {
    id: "partners",
    name: "Sales & partnerships",
    email: "partners@tessera.co",
    purpose: "Pricing above 40 seats, reseller agreements, processor integrations, press.",
    covers: ["Enterprise pricing and pilots", "Processor and ERP integrations", "Press and analyst requests"],
    notFor: "Existing-customer problems. Writing here delays you by a day; the desks above are faster.",
    owner: { name: "Priya Raghunathan", role: "Partnerships Lead" },
    altChannel: { label: "Phone", value: "+1 617 555 0182, Tue and Thu only" },
    hoursLabel: "Mon–Fri 07:00–16:00 UTC",
    windows: [{ days: [0, 1, 2, 3, 4], start: 420, end: 960 }],
    medianMinutes: 214,
    p90Minutes: 640,
    volumeShare: 14,
  },
];

export function deskById(id: DeskId): Desk {
  const found = DESKS.find((d) => d.id === id);
  return found ?? DESKS[0];
}

/* ------------------------------------------------------- resolution corpus */

export type Route = "status" | "docs" | "answered" | "human";

export type Resolution = {
  id: string;
  route: Route;
  title: string;
  source: string;
  lead: string;
  steps: string[];
  deskId: DeskId;
  /** Share of people who reported this closed the question, from the "did this help" prompt. */
  resolvedShare: number;
  keywords: string[];
};

export const RESOLUTIONS: Resolution[] = [
  {
    id: "inc-webhooks",
    route: "status",
    title: "Webhook deliveries are running behind",
    source: "Status page · INC-2418 · investigating",
    lead:
      "Since 04:12 UTC we have been re-queueing deliveries to roughly 9% of endpoints. Nothing is dropped — retries run for 72 hours — but delivery is landing 6 to 40 minutes late. A written update goes up at the top of every hour until it closes.",
    steps: [
      "Check whether your endpoint is in the affected set; the status page lists them by prefix.",
      "Leave your consumer running. Replays carry the same Tessera-Event-Id, so de-duplicate on that field rather than pausing.",
      "If you need a manual replay before the incident closes, Support can trigger one for a named endpoint.",
    ],
    deskId: "support",
    resolvedShare: 71,
    keywords: ["webhook", "webhooks", "delivery", "deliveries", "retry", "retries", "late", "delayed", "endpoint", "504", "timeout", "events", "down", "outage", "slow"],
  },
  {
    id: "doc-currency",
    route: "docs",
    title: "An import fails with UNMATCHED_CURRENCY",
    source: "Docs · Statement imports § 4.2",
    lead:
      "This is a column-mapping problem, not a data problem. The importer rejects a file when the currency column holds anything other than a three-letter ISO code, and the usual cause is a spreadsheet that quietly reformatted it as a number.",
    steps: [
      "Open the import, then Column mapping.",
      "Point Currency at the column that literally reads USD, EUR or GBP.",
      "If it reads 840 instead of USD, re-export from your bank with ISO codes selected. Tessera deliberately does not guess numeric codes.",
      "Re-run the import. Rows already ingested are skipped by checksum, so re-running is safe.",
    ],
    deskId: "support",
    resolvedShare: 88,
    keywords: ["import", "imports", "csv", "currency", "unmatched", "statement", "upload", "mapping", "column", "file", "error", "fails", "failed", "reject"],
  },
  {
    id: "doc-keys",
    route: "docs",
    title: "Rotate an API key without downtime",
    source: "Docs · Authentication § 2.1",
    lead:
      "Keys are additive. You never have to break a running integration to rotate one, and there is no maintenance window to book.",
    steps: [
      "Create a second key under Settings, API keys. Both are live at the same time.",
      "Deploy the new key.",
      "Watch Last used on the old key. When it has not moved for a full hour, revoke it.",
      "Revocation takes effect immediately and cannot be undone, so revoke last, not first.",
    ],
    deskId: "support",
    resolvedShare: 93,
    keywords: ["api", "key", "keys", "rotate", "rotation", "token", "auth", "secret", "credential", "credentials", "revoke", "401", "unauthorized", "expired"],
  },
  {
    id: "doc-sandbox",
    route: "docs",
    title: "A sandbox key returns 401 in production",
    source: "Docs · Environments § 1.3",
    lead:
      "Sandbox and production are separate ledgers with separate keys. A key prefixed tsr_sbx_ will never authenticate against the production host, and that is deliberate rather than a bug.",
    steps: [
      "Read the prefix: tsr_sbx_ is sandbox, tsr_live_ is production.",
      "Production keys are visible to Owners and Admins only. If Settings shows no live key, an Owner on your account has to issue it.",
      "Sandbox records are never copied into production, counterparties included, so a working sandbox flow can still fail on missing production data.",
    ],
    deskId: "support",
    resolvedShare: 91,
    keywords: ["sandbox", "production", "401", "unauthorized", "environment", "staging", "test", "live", "prefix", "forbidden", "403"],
  },
  {
    id: "ans-export",
    route: "answered",
    title: "Can I re-run a settlement export for a closed period?",
    source: "Answered 214 times · reviewed by Dara Okonjo, Head of Support",
    lead:
      "Yes, for any period inside the last 18 months, and it does not re-open your books. A re-run writes a new versioned file and leaves the original downloadable; the version is in the filename so your auditor can see both.",
    steps: [
      "Reports, Settlement exports, then Re-run on the period you want.",
      "Exports above 400,000 rows are queued and emailed rather than streamed to the browser.",
      "Older than 18 months, Support restores it from cold storage within one business day.",
    ],
    deskId: "support",
    resolvedShare: 96,
    keywords: ["export", "exports", "settlement", "rerun", "re-run", "replay", "period", "closed", "month", "report", "download", "restore", "past"],
  },
  {
    id: "ans-invite",
    route: "answered",
    title: "Invite a teammate, or change what someone can do",
    source: "Answered 151 times · reviewed by Dara Okonjo, Head of Support",
    lead:
      "There are four roles — Owner, Admin, Analyst, Viewer. Only an Owner can invite another Owner; an Admin can do everything else on this list.",
    steps: [
      "Settings, Team, Invite. Invitations expire after 14 days and can be re-sent from the same screen.",
      "Analyst can run and download exports but cannot change payout accounts.",
      "Removing someone revokes their keys in the same action, with no delay.",
    ],
    deskId: "support",
    resolvedShare: 94,
    keywords: ["invite", "invitation", "team", "teammate", "role", "roles", "permission", "permissions", "access", "seat", "seats", "admin", "owner", "user", "remove"],
  },
  {
    id: "ans-proration",
    route: "answered",
    title: "Why does my invoice show a proration line?",
    source: "Answered 168 times · reviewed by Marta Vilchez, Accounts",
    lead:
      "A proration line appears when a seat or plan changed mid-cycle. It is the difference between what you already paid and what the account now costs for the days remaining — never a second full charge.",
    steps: [
      "Expand the proration line on the invoice; it prints the change, the date and the day count it used.",
      "Seat removals return as a credit on the next invoice rather than as a refund to the card.",
      "If the day count looks wrong, Accounts can reissue. Nothing is final until the payment run.",
    ],
    deskId: "billing",
    resolvedShare: 82,
    keywords: ["invoice", "invoices", "billing", "bill", "proration", "prorated", "charge", "charged", "plan", "upgrade", "refund", "credit", "payment", "card", "receipt", "tax", "vat"],
  },
  {
    id: "ans-cancel",
    route: "answered",
    title: "How do I cancel or downgrade?",
    source: "Answered 63 times · reviewed by Marta Vilchez, Accounts",
    lead:
      "Self-serve, from Settings, Plan. There is no retention call and no form. Cancellation takes effect at the end of the current cycle, and your exports stay downloadable for 90 days after that.",
    steps: [
      "Settings, Plan, then Cancel plan or Change plan.",
      "Owners can do this. Admins cannot, which is the single most common reason the button looks missing.",
      "If you want the data gone sooner than 90 days, Trust handles erasure requests directly.",
    ],
    deskId: "billing",
    resolvedShare: 87,
    keywords: ["cancel", "cancellation", "downgrade", "close", "terminate", "delete", "subscription", "renewal", "stop", "account"],
  },
  {
    id: "ans-dpa",
    route: "answered",
    title: "Do you sign DPAs, and where is the subprocessor list?",
    source: "Answered 97 times · Trust desk",
    lead:
      "Yes. The DPA is pre-signed, countersignature takes one business day, and the subprocessor list is public and versioned. Changes to it are announced 30 days before they take effect.",
    steps: [
      "Download the pre-signed DPA from the trust centre and return it executed to the Trust desk.",
      "Subscribe to subprocessor changes on the same page. That feed is the notice channel, not a marketing list.",
      "SOC 2 Type II and the current pen-test letter are released under NDA by the same desk.",
    ],
    deskId: "trust",
    resolvedShare: 90,
    keywords: ["dpa", "gdpr", "security", "compliance", "soc", "soc2", "subprocessor", "privacy", "legal", "questionnaire", "vendor", "audit", "nda", "erasure", "pentest", "vulnerability", "disclosure"],
  },
];

/** The three that resolve the most inbound, shown before anyone types. */
export const TOP_IDS = ["doc-currency", "ans-export", "ans-proration"];

export const CHIPS: { label: string; query: string }[] = [
  { label: "Webhooks are late", query: "webhooks delayed" },
  { label: "Import rejected my file", query: "import fails currency" },
  { label: "401 from the API", query: "api key 401 unauthorized" },
  { label: "Invoice looks wrong", query: "invoice proration charge" },
  { label: "Need a DPA", query: "dpa subprocessor security review" },
  { label: "Add or remove a teammate", query: "invite teammate role" },
];

/** Used only when nothing in the corpus matches — routes a stranger to a plausible desk. */
const DESK_HINTS: { deskId: DeskId; words: string[] }[] = [
  { deskId: "billing", words: ["invoice", "billing", "refund", "card", "receipt", "vat", "tax", "purchase", "po", "renewal", "quote"] },
  { deskId: "trust", words: ["breach", "vulnerability", "disclosure", "pentest", "subprocessor", "gdpr", "dpa", "erasure", "audit", "soc"] },
  { deskId: "partners", words: ["partnership", "partner", "reseller", "press", "media", "analyst", "enterprise", "pilot", "demo", "pricing", "integration"] },
];

export function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

export type Match = { resolution: Resolution; score: number };

/**
 * Deterministic scoring: a keyword hit is worth 3, a hit inside the title 2, and matches are summed
 * over the query's tokens. Ties fall back to corpus order, so the same string always routes the same
 * way — there is no ranking model and no clock in here.
 */
export function rank(query: string): Match[] {
  const tokens = tokenise(query);
  if (tokens.length === 0) return [];
  return RESOLUTIONS.map((resolution) => {
    const title = resolution.title.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (resolution.keywords.includes(token)) score += 3;
      else if (token.length >= 3 && resolution.keywords.some((k) => k.startsWith(token))) score += 2;
      if (title.includes(token) && token.length >= 4) score += 2;
    }
    return { resolution, score };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function fallbackDesk(query: string): DeskId {
  const tokens = tokenise(query);
  for (const hint of DESK_HINTS) {
    if (tokens.some((t) => hint.words.includes(t))) return hint.deskId;
  }
  return "support";
}

/* ---------------------------------------------------------- staffing maths */

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WEEK = 7 * 1440;

export const DEFAULT_DAY = 2;
export const DEFAULT_HOUR = 9;

export function formatClock(minuteOfDay: number): string {
  const h = Math.floor(minuteOfDay / 60) % 24;
  const m = minuteOfDay % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const restMin = minutes % 60;
  if (hours < 24) return restMin ? `${hours} h ${restMin} min` : `${hours} h`;
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours ? `${days} d ${restHours} h` : `${days} d`;
}

export function isStaffed(desk: Desk, day: number, hour: number): boolean {
  const m = hour * 60;
  return desk.windows.some((w) => w.days.includes(day) && m >= w.start && m < w.end);
}

/** Absolute staffed spans starting at or after `from`, in minutes from Monday 00:00 of week zero. */
function segmentsFrom(desk: Desk, from: number): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = [];
  for (let week = 0; week < 3; week += 1) {
    for (let day = 0; day < 7; day += 1) {
      for (const w of desk.windows) {
        if (!w.days.includes(day)) continue;
        const base = week * WEEK + day * 1440;
        if (base + w.end > from) out.push({ start: base + w.start, end: base + w.end });
      }
    }
  }
  return out.sort((a, b) => a.start - b.start);
}

export type Estimate = {
  staffedNow: boolean;
  replyDay: number;
  replyMinuteOfDay: number;
  dayOffset: number;
  waitMinutes: number;
};

/**
 * Advances the desk's median first-response time through *staffed* minutes only, so a message sent
 * at 23:30 on a Friday does not pretend a human reads it at 00:04. Pure arithmetic over the fixed
 * window table above.
 */
export function estimateReply(desk: Desk, sendDay: number, sendHour: number): Estimate {
  const sent = sendDay * 1440 + sendHour * 60;
  let cursor = sent;
  let remaining = desk.medianMinutes;
  for (const seg of segmentsFrom(desk, sent)) {
    if (cursor < seg.start) cursor = seg.start;
    const available = seg.end - cursor;
    if (available >= remaining) {
      cursor += remaining;
      remaining = 0;
      break;
    }
    remaining -= available;
    cursor = seg.end;
  }
  if (remaining > 0) cursor += remaining;
  return {
    staffedNow: isStaffed(desk, sendDay, sendHour),
    replyDay: Math.floor(cursor / 1440) % 7,
    replyMinuteOfDay: cursor % 1440,
    dayOffset: Math.floor(cursor / 1440) - Math.floor(sent / 1440),
    waitMinutes: cursor - sent,
  };
}

/** Coverage of one weekday as percentage spans of a 24-hour track, rounded to two decimals. */
export function coverageSpans(desk: Desk, day: number): { left: number; width: number }[] {
  return desk.windows
    .filter((w) => w.days.includes(day))
    .map((w) => ({
      left: Math.round((w.start / 1440) * 10000) / 100,
      width: Math.round(((w.end - w.start) / 1440) * 10000) / 100,
    }));
}

/* ------------------------------------------------------------------ drafts */

export function draftFor(desk: Desk, query: string, attempted: Resolution | null): string {
  const symptom = query.trim() || "[describe what you are seeing]";
  const tried = attempted ? `${attempted.title} (${attempted.source})` : "Nothing yet — the triage box found no match.";
  return [
    `Desk: ${desk.name}`,
    "Workspace: [your workspace name]",
    "Environment: production / sandbox",
    "",
    "What is happening",
    symptom,
    "",
    "Already tried",
    tried,
    "",
    "What I need from you",
    "[the specific outcome, e.g. a manual replay for endpoint ops-eu-2]",
  ].join("\n");
}

export function mailtoFor(desk: Desk, query: string, attempted: Resolution | null): string {
  const subject = query.trim() ? `${query.trim().slice(0, 70)}` : `Question for ${desk.name}`;
  return `mailto:${desk.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftFor(desk, query, attempted))}`;
}

/* ------------------------------------------------------------ page figures */

export const QUARTER = {
  inbound: 1842,
  selfResolved: 63,
  firstReplyMedian: "34 min",
  reopened: 4.1,
};

export const PREP = [
  "Your workspace name, exactly as it appears in Settings.",
  "Whether you are on production or sandbox. Half of all first replies are spent asking this.",
  "One request ID, one import ID, or one invoice number. Screenshots of a whole window rarely contain it.",
  "The time the problem started, in UTC, and whether it is still happening.",
];

export const NOT_HANDLED = [
  { label: "We do not run a phone queue for support", detail: "One phone line exists, on the partnerships desk, and it is not staffed for incidents." },
  { label: "We do not answer product questions on social", detail: "Anything technical gets redirected here, which costs you a day." },
  { label: "We do not take account changes by chat", detail: "Anything that moves money is answered from a signed-in address on the account." },
];
