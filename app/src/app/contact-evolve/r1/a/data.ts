/**
 * Fixtures and dispatch arithmetic for the Culvert "Contact" page.
 *
 * Nothing in this route reads a clock. There is no Math.random, no Date.now, no new Date() — the
 * visitor states the moment they would send ("Thursday 16:00, my time"), and every reply-by figure
 * on the page is integer arithmetic over that stated moment against fixed desk hours. That is a
 * design decision before it is a gate decision: a contact page that says "we usually reply fast"
 * is unfalsifiable, and one that says "we are open now" is a lie the moment it is cached. Stating
 * the send time makes the promise checkable, and it makes the page deterministic for free.
 *
 * Time is held as minutes-from-Monday-00:00 ("minute of week"), UTC for desks, local for the
 * sender. Offsets are fixed integers, including a half-hour zone, so the model cannot quietly
 * assume whole-hour arithmetic.
 */

export const WEEK_MINUTES = 7 * 24 * 60;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/* ------------------------------------------------------------------ sender clock */

export type Zone = { id: string; label: string; short: string; offsetMinutes: number };

/** A short list on purpose: enough spread to prove the arithmetic, few enough to scan. */
export const ZONES: Zone[] = [
  { id: "pt", label: "UTC-07:00 — Los Angeles, Vancouver", short: "Los Angeles", offsetMinutes: -420 },
  { id: "ct", label: "UTC-05:00 — Austin, Mexico City", short: "Austin", offsetMinutes: -300 },
  { id: "et", label: "UTC-04:00 — New York, Toronto", short: "New York", offsetMinutes: -240 },
  { id: "wet", label: "UTC+01:00 — Lisbon, Dublin", short: "Lisbon", offsetMinutes: 60 },
  { id: "cet", label: "UTC+02:00 — Berlin, Johannesburg", short: "Berlin", offsetMinutes: 120 },
  { id: "ist", label: "UTC+05:30 — Mumbai, Colombo", short: "Mumbai", offsetMinutes: 330 },
  { id: "kst", label: "UTC+09:00 — Seoul, Tokyo", short: "Seoul", offsetMinutes: 540 },
];

export const DEFAULT_ZONE = "et";
export const DEFAULT_DAY = 3; // Thursday — late enough in the week that two desks roll to Monday
export const DEFAULT_HOUR = 16;

/* ------------------------------------------------------------------ the desks */

export type DeskId = "sales" | "operations" | "partnerships" | "recruiting" | "press";

export type FieldKind = "text" | "email" | "textarea" | "select";

export type Field = {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  hint?: string;
  placeholder?: string;
  options?: string[];
};

export type Alternate = {
  kind: "link" | "phone" | "mail";
  label: string;
  detail: string;
  href: string;
};

export type Desk = {
  id: DeskId;
  /** Icon key — resolved to a lucide component in the client, so this file stays a plain module. */
  icon: "building" | "activity" | "handshake" | "briefcase" | "newspaper";
  name: string;
  belongsHere: string;
  owner: string;
  ownerRole: string;
  ownerNote: string;
  email: string;
  /** 0 = Monday. */
  coverageDays: number[];
  /** Minutes past midnight UTC. Never wraps past midnight — the fixtures are chosen so it cannot. */
  openUtc: number;
  closeUtc: number;
  coverageLabel: string;
  /** Service level counted in *desk* minutes, not wall-clock minutes. */
  slaMinutes: number;
  slaLabel: string;
  /** The honest redirect: what this desk will hand off rather than answer. */
  wrongDesk: string;
  fields: Field[];
  alternates: Alternate[];
};

const h = (hours: number) => hours * 60;
const WEEKDAYS = [0, 1, 2, 3, 4];
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export const DESKS: Desk[] = [
  {
    id: "sales",
    icon: "building",
    name: "Utility sales",
    belongsHere: "Pricing, pilots, procurement packets, and anything that ends in a signature.",
    owner: "Dana Okonkwo",
    ownerRole: "Director, Utility Accounts",
    ownerNote:
      "Dana reads every message on this desk herself before it goes to an account engineer. Pilot scoping calls are hers too.",
    email: "sales@culvert.io",
    coverageDays: WEEKDAYS,
    openUtc: h(13),
    closeUtc: h(23),
    coverageLabel: "Mon–Fri, 13:00–23:00 UTC (Austin business hours)",
    slaMinutes: 240,
    slaLabel: "within 4 desk hours",
    wrongDesk:
      "Already live on Culvert and something has stopped landing? That is Operations, and Operations never closes.",
    fields: [
      {
        name: "email",
        label: "Work email",
        kind: "email",
        required: true,
        hint: "Dana replies from her own address. Nothing on this desk is a no-reply.",
        placeholder: "you@utility.example",
      },
      {
        name: "org",
        label: "Utility or company",
        kind: "text",
        required: true,
        placeholder: "Cascade Valley Water",
      },
      {
        name: "scale",
        label: "Endpoints under management",
        kind: "select",
        required: true,
        options: [
          "Under 50,000",
          "50,000 – 250,000",
          "250,000 – 1 million",
          "Over 1 million",
          "Not a utility — I integrate for one",
        ],
      },
      {
        name: "body",
        label: "What are you trying to get working?",
        kind: "textarea",
        required: true,
        hint: "Meter vendors and your billing system are the two facts that shorten this most.",
        placeholder: "We run Itron and Sensus side by side and the monthly export never reconciles…",
      },
    ],
    alternates: [
      {
        kind: "link",
        label: "Procurement & security packet",
        detail: "SOC 2 report, DPA, insurance certificates — no form in front of it.",
        href: "https://culvert.io/trust",
      },
      {
        kind: "link",
        label: "Book 20 minutes with Dana",
        detail: "Weekday slots, 13:00–22:00 UTC. Skips this desk entirely.",
        href: "https://culvert.io/book/dana",
      },
    ],
  },
  {
    id: "operations",
    icon: "activity",
    name: "Operations & support",
    belongsHere: "Ingest gaps, delayed exports, console errors — anything already in production.",
    owner: "On-call engineer",
    ownerRole: "Rota of six, one always paged",
    ownerNote:
      "This is the only desk staffed every hour of every day. The engineer who picks it up can read your pipeline, not just your ticket.",
    email: "ops@culvert.io",
    coverageDays: EVERY_DAY,
    openUtc: 0,
    closeUtc: h(24),
    coverageLabel: "Every day, all hours — six-person on-call rota",
    slaMinutes: 45,
    slaLabel: "within 45 minutes, any hour",
    wrongDesk:
      "Not live yet and evaluating? Utility sales will answer faster than the on-call engineer can, and with better numbers.",
    fields: [
      {
        name: "email",
        label: "Work email",
        kind: "email",
        required: true,
        placeholder: "you@utility.example",
      },
      {
        name: "account",
        label: "Account ID",
        kind: "text",
        required: true,
        hint: "Begins with CV-. Top left of the console, under your utility name.",
        placeholder: "CV-40188",
      },
      {
        name: "severity",
        label: "Severity",
        kind: "select",
        required: true,
        options: [
          "P1 — meter data has stopped landing",
          "P2 — ingest degraded or billing export late",
          "P3 — something behaves oddly, nothing is blocked",
          "P4 — question or feature request",
        ],
      },
      {
        name: "sites",
        label: "Affected sites or feeders",
        kind: "text",
        required: false,
        placeholder: "Substation 12, Feeder 4C",
      },
      {
        name: "body",
        label: "What are you seeing?",
        kind: "textarea",
        required: true,
        hint: "The timestamp of the last good reading beats any description of the symptom.",
        placeholder: "Last good interval landed at 04:15 UTC; the console shows an empty window since…",
      },
    ],
    alternates: [
      {
        kind: "phone",
        label: "P1 pager",
        detail: "+1 512 555 0148 — rings the on-call engineer. P1 only, please.",
        href: "tel:+15125550148",
      },
      {
        kind: "link",
        label: "status.culvert.io",
        detail: "Regional ingest health, updated every 60 seconds. Check before writing.",
        href: "https://status.culvert.io",
      },
    ],
  },
  {
    id: "partnerships",
    icon: "handshake",
    name: "Partnerships",
    belongsHere: "Meter and SCADA vendors, integrators, resellers, and joint deployments.",
    owner: "Marta Ellingsen",
    ownerRole: "Head of Ecosystem, Lisbon",
    ownerNote:
      "Marta answers slowly and specifically. She will not send a generic partner deck — she will tell you whether the integration is worth either side building.",
    email: "partners@culvert.io",
    coverageDays: WEEKDAYS,
    openUtc: h(8),
    closeUtc: h(17),
    coverageLabel: "Mon–Fri, 08:00–17:00 UTC (Lisbon business hours)",
    slaMinutes: 1080,
    slaLabel: "within 2 working days on the Lisbon calendar",
    wrongDesk:
      "Want to resell into a region we already cover? Utility sales owns that, and answers in hours rather than days.",
    fields: [
      {
        name: "email",
        label: "Work email",
        kind: "email",
        required: true,
        placeholder: "you@vendor.example",
      },
      {
        name: "org",
        label: "Organisation",
        kind: "text",
        required: true,
        placeholder: "Northgate Metering",
      },
      {
        name: "kind",
        label: "Kind of partnership",
        kind: "select",
        required: true,
        options: [
          "Meter or SCADA hardware",
          "Systems integrator",
          "Reseller in a region we do not cover",
          "Analytics or data platform",
        ],
      },
      {
        name: "body",
        label: "What would the integration do?",
        kind: "textarea",
        required: true,
        hint: "Name one customer who has asked for it. That is the whole evaluation.",
        placeholder: "Two of our municipal customers already run Culvert and want our headend to…",
      },
    ],
    alternates: [
      {
        kind: "link",
        label: "Integration reference",
        detail: "Ingest schema, headend adapters, and the certification checklist.",
        href: "https://docs.culvert.io/integrations",
      },
      {
        kind: "link",
        label: "Partner directory",
        detail: "The 31 vendors already certified — check before proposing an overlap.",
        href: "https://culvert.io/partners",
      },
    ],
  },
  {
    id: "recruiting",
    icon: "briefcase",
    name: "Recruiting",
    belongsHere: "Applications, referrals, and questions about how hiring here actually runs.",
    owner: "Priya Raman",
    ownerRole: "Talent Lead",
    ownerNote:
      "Priya answers every message, including the ones that end in a no. The slow number below is the honest one, not a hedge.",
    email: "jobs@culvert.io",
    coverageDays: WEEKDAYS,
    openUtc: h(12),
    closeUtc: h(20),
    coverageLabel: "Mon–Fri, 12:00–20:00 UTC",
    slaMinutes: 1440,
    slaLabel: "within 3 working days",
    wrongDesk:
      "Recruiting agencies: this desk deletes unsolicited candidate lists unread. Nothing personal — we hire direct.",
    fields: [
      {
        name: "email",
        label: "Email",
        kind: "email",
        required: true,
        placeholder: "you@example.com",
      },
      {
        name: "role",
        label: "Role you are aiming at",
        kind: "select",
        required: true,
        options: [
          "Ingest Engineer (Austin)",
          "Field Reliability Engineer (remote, US)",
          "Data Platform Engineer (Lisbon)",
          "Regulatory Analyst (Lisbon)",
          "Nothing posted fits — introducing myself",
        ],
      },
      {
        name: "link",
        label: "Portfolio, repository, or CV link",
        kind: "text",
        required: false,
        placeholder: "https://",
      },
      {
        name: "body",
        label: "What should Priya read first?",
        kind: "textarea",
        required: true,
        hint: "One system you kept running under load beats a list of technologies.",
        placeholder: "I ran the AMI migration for a 400,000-meter utility and owned the cutover weekend…",
      },
    ],
    alternates: [
      {
        kind: "link",
        label: "Open roles",
        detail: "Four listed, each with the band and the interview loop written out.",
        href: "https://culvert.io/careers",
      },
      {
        kind: "link",
        label: "How we interview",
        detail: "Three stages, no take-home longer than two hours, always paid.",
        href: "https://culvert.io/careers/process",
      },
    ],
  },
  {
    id: "press",
    icon: "newspaper",
    name: "Press",
    belongsHere: "Interviews, outage commentary, funding questions, and fact-checks on deadline.",
    owner: "Tomas Krall",
    ownerRole: "Communications",
    ownerNote:
      "Tomas will confirm or correct a figure on the record. If your deadline is inside three hours, put it in the subject line and he will jump the queue.",
    email: "press@culvert.io",
    coverageDays: WEEKDAYS,
    openUtc: h(9),
    closeUtc: h(18),
    coverageLabel: "Mon–Fri, 09:00–18:00 UTC",
    slaMinutes: 180,
    slaLabel: "within 3 desk hours, faster on a stated deadline",
    wrongDesk:
      "Analyst briefings and RFP questionnaires are not press — those go to Utility sales, who hold the numbers.",
    fields: [
      {
        name: "email",
        label: "Email",
        kind: "email",
        required: true,
        placeholder: "you@outlet.example",
      },
      {
        name: "outlet",
        label: "Outlet",
        kind: "text",
        required: true,
        placeholder: "Grid Monthly",
      },
      {
        name: "deadline",
        label: "Your deadline",
        kind: "text",
        required: true,
        hint: "Date and hour in your own zone. Tomas schedules backwards from it.",
        placeholder: "Friday 09:00, London",
      },
      {
        name: "body",
        label: "What is the story?",
        kind: "textarea",
        required: true,
        placeholder: "Following up on the February ERCOT interval-data gap — I have three figures to check…",
      },
    ],
    alternates: [
      {
        kind: "link",
        label: "Press kit",
        detail: "Logos, founder photography, and the boilerplate paragraph.",
        href: "https://culvert.io/press",
      },
      {
        kind: "mail",
        label: "Tomas directly",
        detail: "tomas@culvert.io — for deadlines under three hours.",
        href: "mailto:tomas@culvert.io",
      },
    ],
  },
];

/* ------------------------------------------------------------------ dispatch arithmetic */

type Window = { start: number; end: number };

function coverageWindows(desk: Desk): Window[] {
  return desk.coverageDays
    .map((day) => ({ start: day * 1440 + desk.openUtc, end: day * 1440 + desk.closeUtc }))
    .sort((a, b) => a.start - b.start);
}

export type Dispatch = {
  /** Wall-clock minutes between sending and the reply landing. */
  waitMinutes: number;
  /** Wall-clock minutes spent waiting for the desk to open before the SLA clock even starts. */
  queueMinutes: number;
};

/**
 * Walks the desk's coverage windows forward from the send time, spending SLA minutes only while the
 * desk is open. Windows repeat weekly, so up to four passes are considered — the slowest fixture
 * (Recruiting, 1440 desk minutes against a 40-hour week) settles inside two.
 */
export function dispatch(sendUtcMow: number, desk: Desk): Dispatch {
  const windows = coverageWindows(desk);
  let remaining = desk.slaMinutes;
  let cursor = sendUtcMow;
  let clockStarts = -1;

  for (let pass = 0; pass < 4; pass++) {
    for (const window of windows) {
      const start = window.start + pass * WEEK_MINUTES;
      const end = window.end + pass * WEEK_MINUTES;
      if (end <= cursor) continue;
      const from = Math.max(cursor, start);
      if (clockStarts < 0) clockStarts = from;
      const available = end - from;
      if (available >= remaining) {
        return { waitMinutes: from + remaining - sendUtcMow, queueMinutes: clockStarts - sendUtcMow };
      }
      remaining -= available;
      cursor = end;
    }
  }
  // Unreachable for these fixtures; kept so the function is total rather than throwing into a render.
  return { waitMinutes: desk.slaMinutes, queueMinutes: 0 };
}

/** Sender-local minute of week → UTC minute of week. */
export function toUtcMinuteOfWeek(localMinuteOfWeek: number, offsetMinutes: number): number {
  const raw = localMinuteOfWeek - offsetMinutes;
  return ((raw % WEEK_MINUTES) + WEEK_MINUTES) % WEEK_MINUTES;
}

export type Stamp = { day: number; hour: number; minute: number; daysAhead: number };

/** Where a wait of `waitMinutes` lands, expressed back in the sender's own week. */
export function landsAt(sendLocalMinuteOfWeek: number, waitMinutes: number): Stamp {
  const absolute = sendLocalMinuteOfWeek + waitMinutes;
  const dayIndex = Math.floor(absolute / 1440);
  return {
    day: dayIndex % 7,
    hour: Math.floor((absolute % 1440) / 60),
    minute: absolute % 60,
    daysAhead: dayIndex - Math.floor(sendLocalMinuteOfWeek / 1440),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function clockLabel(hour: number, minute: number): string {
  return `${pad(hour)}:${pad(minute)}`;
}

export function stampLabel(stamp: Stamp): string {
  return `${DAYS_SHORT[stamp.day]} ${clockLabel(stamp.hour, stamp.minute)}`;
}

export function relativeDayLabel(daysAhead: number): string {
  if (daysAhead === 0) return "same day";
  if (daysAhead === 1) return "next day";
  return `${daysAhead} days later`;
}

/** "45m" · "4h 20m" · "3d 6h" — always tabular, never a vague "soon". */
export function durationLabel(minutes: number): string {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${pad(mins)}m`;
  return `${mins}m`;
}

/**
 * A reference the visitor can quote back, derived from the message itself rather than from a clock
 * or a random seed — same desk plus same contents always yields the same code, on server and client.
 */
export function referenceCode(deskId: string, seed: string): string {
  const source = `${deskId}|${seed}`;
  let acc = 0;
  for (let i = 0; i < source.length; i++) {
    acc = (acc * 31 + source.charCodeAt(i)) % 1679616; // 36^4
  }
  return `CV-${acc.toString(36).toUpperCase().padStart(4, "0")}`;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
