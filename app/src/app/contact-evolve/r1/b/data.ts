/**
 * Deterministic fixtures and clock arithmetic for the Havelock contact page.
 *
 * The whole subject of this page is *when* a human will answer, so the one thing it must not do is
 * read a real clock: `new Date()` is banned by the gate and would make the server and client render
 * different sentences. Instead the page has a single fixed reference moment — Tuesday 14:20 UTC —
 * and the reader supplies the other half by choosing their own UTC offset. Every clock, countdown
 * and expected-reply time below is derived from those two numbers, which is why the reader's
 * timezone choice recomputes the entire page rather than relabelling it.
 *
 * Minutes are the only unit. Two flavours appear:
 *   - *minute of day* (0..1439), used for anything compared against a desk's shift window;
 *   - *absolute minute* (day index * 1440 + minute of day), used whenever an answer can land on a
 *     later calendar day than the message. Day index 0 is Monday.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/**
 * Display type is set with the literal `var(--font-display-mono)` at each call site rather than
 * from a constant here. The gate's `no-unlisted-font` rule reads the text immediately after
 * `fontFamily:` and only recognises the literal — a constant, however correct at runtime, reads to
 * the checker as an unknown family and hard-fails the route.
 */
export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** The fixed "now". Tuesday (day index 1), 14:20 UTC. */
export const REF_DAY = 1;
export const REF_UTC_MIN = 14 * 60 + 20;
export const REF_ABS_UTC = REF_DAY * 1440 + REF_UTC_MIN;
export const REF_LABEL = "Tuesday 14:20 UTC";

/** Window the reply statistics were measured over. */
export const SAMPLE_WINDOW = "last 90 days";

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** 0..1439 -> "07:05". */
export function clock(minuteOfDay: number): string {
  const m = mod(Math.round(minuteOfDay), 1440);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/**
 * 3910 -> "3,910".
 *
 * Written out rather than delegated to `toLocaleString`, whose grouping depends on the ICU data of
 * whichever runtime renders it. A client component renders twice — once on the server, once in the
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

/** Minutes -> "41 min" / "1 hr 40 min" / "9 hr". */
export function duration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/* ------------------------------------------------------------------ zones */

export type Zone = {
  id: string;
  /** Shown in the select. */
  label: string;
  /** Shown inline in prose, where the city would be noise. */
  short: string;
  offsetMin: number;
};

/**
 * Nine offsets, including one half-hour offset on purpose: a UTC+05:30 reader is the case where a
 * desk's shift no longer starts on a local hour boundary, and the coverage strip below has to be
 * honest about that rather than rounding it away.
 */
export const ZONES: Zone[] = [
  { id: "la", label: "UTC-08:00 · Los Angeles", short: "UTC-08:00", offsetMin: -480 },
  { id: "denver", label: "UTC-07:00 · Denver", short: "UTC-07:00", offsetMin: -420 },
  { id: "ny", label: "UTC-05:00 · New York", short: "UTC-05:00", offsetMin: -300 },
  { id: "london", label: "UTC+00:00 · London, Accra", short: "UTC+00:00", offsetMin: 0 },
  { id: "porto", label: "UTC+01:00 · Porto, Berlin", short: "UTC+01:00", offsetMin: 60 },
  { id: "nairobi", label: "UTC+03:00 · Nairobi, Istanbul", short: "UTC+03:00", offsetMin: 180 },
  { id: "bengaluru", label: "UTC+05:30 · Bengaluru", short: "UTC+05:30", offsetMin: 330 },
  { id: "singapore", label: "UTC+08:00 · Singapore", short: "UTC+08:00", offsetMin: 480 },
  { id: "osaka", label: "UTC+09:00 · Osaka, Seoul", short: "UTC+09:00", offsetMin: 540 },
  { id: "auckland", label: "UTC+12:00 · Auckland", short: "UTC+12:00", offsetMin: 720 },
];

export const DEFAULT_ZONE_ID = "london";

export function zoneById(id: string): Zone {
  return ZONES.find((z) => z.id === id) ?? ZONES[3];
}

/* ------------------------------------------------------------------ desks */

export type DeskId = "apac" | "emea" | "amer" | "bridge";

export type Desk = {
  id: DeskId;
  name: string;
  city: string;
  utcLabel: string;
  /** Shift window as UTC minutes of day. Wraps past midnight when open > close. */
  openUtc: number;
  closeUtc: number;
  alwaysOn: boolean;
  /** The same window written in the desk's own local clock, for the reader who wants the ground truth. */
  homeWindow: string;
  roster: number;
  lead: string;
  languages: string;
  note: string;
};

export const DESKS: Desk[] = [
  {
    id: "apac",
    name: "APAC desk",
    city: "Osaka",
    utcLabel: "UTC+09:00",
    openUtc: 0,
    closeUtc: 9 * 60,
    alwaysOn: false,
    homeWindow: "09:00 to 18:00 in Osaka",
    roster: 6,
    lead: "Kenji Aoyama",
    languages: "English, Japanese, Korean",
    note: "First pass on ingest and SDK questions. Reads the overnight queue before anything else.",
  },
  {
    id: "emea",
    name: "EMEA desk",
    city: "Porto",
    utcLabel: "UTC+01:00",
    openUtc: 7 * 60,
    closeUtc: 16 * 60,
    alwaysOn: false,
    homeWindow: "08:00 to 17:00 in Porto",
    roster: 9,
    lead: "Dara Whitlock",
    languages: "English, Portuguese, German, Spanish",
    note: "Billing, contracts, and anything that eventually needs a signature.",
  },
  {
    id: "amer",
    name: "Americas desk",
    city: "Denver",
    utcLabel: "UTC-07:00",
    openUtc: 15 * 60,
    closeUtc: 23 * 60,
    alwaysOn: false,
    homeWindow: "08:00 to 16:00 in Denver",
    roster: 11,
    lead: "Tomas Ek",
    languages: "English, Spanish",
    note: "Migrations, and the deepest bench on query performance.",
  },
  {
    id: "bridge",
    name: "Sev-1 bridge",
    city: "On-call rota",
    utcLabel: "24/7",
    openUtc: 0,
    closeUtc: 0,
    alwaysOn: true,
    homeWindow: "No open, no close",
    roster: 2,
    lead: "Priya Raghunathan is on this week",
    languages: "English",
    note: "Paged for production incidents only. It is not a faster way to ask a question.",
  },
];

/** The three desks that keep hours. The bridge is excluded because it can never be the seam. */
export const REGIONAL_DESKS = DESKS.filter((d) => !d.alwaysOn);

export function deskById(id: DeskId): Desk {
  return DESKS.find((d) => d.id === id) ?? DESKS[3];
}

export function isDeskOpen(desk: Desk, utcMinuteOfDay: number): boolean {
  if (desk.alwaysOn) return true;
  const u = mod(utcMinuteOfDay, 1440);
  return desk.openUtc < desk.closeUtc
    ? u >= desk.openUtc && u < desk.closeUtc
    : u >= desk.openUtc || u < desk.closeUtc;
}

/** 0 when the desk is already open. */
export function minutesUntilOpen(desk: Desk, utcMinuteOfDay: number): number {
  if (isDeskOpen(desk, utcMinuteOfDay)) return 0;
  return mod(desk.openUtc - utcMinuteOfDay, 1440);
}

/** Minutes of shift left; 0 when the desk is closed, 1440 for the always-on bridge. */
export function minutesOfShiftLeft(desk: Desk, utcMinuteOfDay: number): number {
  if (desk.alwaysOn) return 1440;
  if (!isDeskOpen(desk, utcMinuteOfDay)) return 0;
  return mod(desk.closeUtc - utcMinuteOfDay, 1440);
}

/** The desk's shift drawn on the reader's local day. Wrapping shifts come back as two pieces. */
export function localSegments(desk: Desk, offsetMin: number): { start: number; end: number }[] {
  if (desk.alwaysOn) return [{ start: 0, end: 1440 }];
  const open = mod(desk.openUtc + offsetMin, 1440);
  const close = mod(desk.closeUtc + offsetMin, 1440);
  if (open === close) return [{ start: 0, end: 1440 }];
  return open < close
    ? [{ start: open, end: close }]
    : [
        { start: open, end: 1440 },
        { start: 0, end: close },
      ];
}

/**
 * Which desk picks a message up, and how long it sits first.
 *
 * When more than one desk is on shift the message goes to whichever has the longest shift left —
 * the handoff rule the desks actually use, so a message never lands on a desk that is about to
 * clock off. When none is on shift it is queued for whichever opens soonest.
 */
export function assignDesk(utcMinuteOfDay: number): { desk: Desk; waitMin: number } {
  const open = REGIONAL_DESKS.filter((d) => isDeskOpen(d, utcMinuteOfDay));
  if (open.length > 0) {
    const desk = open.reduce((best, d) =>
      minutesOfShiftLeft(d, utcMinuteOfDay) > minutesOfShiftLeft(best, utcMinuteOfDay) ? d : best,
    );
    return { desk, waitMin: 0 };
  }
  const next = REGIONAL_DESKS.reduce((best, d) =>
    minutesUntilOpen(d, utcMinuteOfDay) < minutesUntilOpen(best, utcMinuteOfDay) ? d : best,
  );
  return { desk: next, waitMin: minutesUntilOpen(next, utcMinuteOfDay) };
}

/**
 * How many regional desks cover each hour of the reader's local day, counted at quarter-hour
 * resolution and reported as the *worst* quarter in the hour.
 *
 * The conservative reading is deliberate. At UTC+05:30 a shift boundary falls in the middle of a
 * local hour, and taking the hour's opening minute would quietly claim cover for thirty minutes
 * that have none. The strip's caption states the rule so the reader can see it is a floor, not an
 * average.
 */
export function hourCoverage(offsetMin: number): number[] {
  return Array.from({ length: 24 }, (_, hour) => {
    let worst = REGIONAL_DESKS.length;
    for (let q = 0; q < 4; q++) {
      const utc = mod(hour * 60 + q * 15 - offsetMin, 1440);
      const count = REGIONAL_DESKS.filter((d) => isDeskOpen(d, utc)).length;
      if (count < worst) worst = count;
    }
    return worst;
  });
}

/* --------------------------------------------------------------- channels */

export type Channel = {
  id: string;
  name: string;
  how: string;
  /** Median minutes to a first human reply, counted from the moment a desk is on shift. */
  medianMin: number;
  p90Min: number;
  sampleN: number;
  /** True when the channel is answered around the clock rather than in desk hours. */
  alwaysOn: boolean;
  bestFor: string;
};

export const CHANNELS: Channel[] = [
  {
    id: "bridge",
    name: "Sev-1 phone bridge",
    how: "+1 720 555 0148, PIN in your runbook",
    medianMin: 2,
    p90Min: 6,
    sampleN: 212,
    alwaysOn: true,
    bestFor: "Ingest is down, or production data is wrong",
  },
  {
    id: "chat",
    name: "In-app chat",
    how: "Bottom right of any Havelock console",
    medianMin: 4,
    p90Min: 19,
    sampleN: 1284,
    alwaysOn: false,
    bestFor: "A question you can screenshot",
  },
  {
    id: "slack",
    name: "Slack Connect",
    how: "Enterprise plans, your named channel",
    medianMin: 12,
    p90Min: 48,
    sampleN: 640,
    alwaysOn: false,
    bestFor: "Ongoing work with your solutions engineer",
  },
  {
    id: "email",
    name: "Email",
    how: "support@havelock.io",
    medianMin: 41,
    p90Min: 154,
    sampleN: 3910,
    alwaysOn: false,
    bestFor: "Anything that travels with a log bundle",
  },
  {
    id: "security",
    name: "Security disclosure",
    how: "security@havelock.io, PGP key below",
    medianMin: 96,
    p90Min: 420,
    sampleN: 48,
    alwaysOn: false,
    bestFor: "Vulnerability reports and coordinated disclosure",
  },
];

/* ----------------------------------------------------------------- topics */

export type Topic = {
  id: string;
  code: string;
  label: string;
  deskId: DeskId;
  owner: string;
  ownerRole: string;
  /** Median minutes this specific queue takes once its desk is on shift. */
  firstReplyMin: number;
  extraField: { label: string; placeholder: string; hint: string } | null;
  note: string;
};

export const TOPICS: Topic[] = [
  {
    id: "platform",
    code: "PLT",
    label: "Pipeline errors or dropped events",
    deskId: "apac",
    owner: "Kenji Aoyama",
    ownerRole: "Platform Support lead, Osaka",
    firstReplyMin: 18,
    extraField: {
      label: "Workspace slug",
      placeholder: "orbital-freight",
      hint: "The part of your console URL after /w/.",
    },
    note: "Include a trace ID if you have one. Kenji's team measures a first reply roughly twice as fast when there is one.",
  },
  {
    id: "billing",
    code: "BIL",
    label: "Billing, invoices, or a plan change",
    deskId: "emea",
    owner: "Dara Whitlock",
    ownerRole: "Billing Operations lead, Porto",
    firstReplyMin: 41,
    extraField: {
      label: "Account ID",
      placeholder: "acct_8419",
      hint: "Front page of any invoice. It starts with acct_.",
    },
    note: "Dara answers billing herself. Nothing in this queue is autoresponded to.",
  },
  {
    id: "migration",
    code: "MIG",
    label: "Moving off another vendor",
    deskId: "amer",
    owner: "Tomas Ek",
    ownerRole: "Solutions Engineering, Denver",
    firstReplyMin: 65,
    extraField: {
      label: "What you are moving off",
      placeholder: "Datadog, Splunk, in-house Kafka",
      hint: "Naming the source lets Tomas bring the right second engineer to the first call.",
    },
    note: "Migrations start with a scoping call, not a quote. Expect two engineers on it.",
  },
  {
    id: "security",
    code: "SEC",
    label: "Security disclosure or compliance review",
    deskId: "bridge",
    owner: "Priya Raghunathan",
    ownerRole: "Security Response, follows the rota",
    firstReplyMin: 96,
    extraField: null,
    note: "Security response rides the always-on rota, so a disclosure never waits for a desk to open.",
  },
  {
    id: "press",
    code: "PRS",
    label: "Press, analysts, or partnerships",
    deskId: "emea",
    owner: "Mireille Fontana",
    ownerRole: "Communications, Porto",
    firstReplyMin: 240,
    extraField: null,
    note: "Not a support queue. Mireille answers inside a working day, not inside an hour.",
  },
];

/* ------------------------------------------------------- the send context */

export type SendContext = {
  offsetMin: number;
  zone: Zone;
  /** Absolute local minute of the reference moment. */
  nowAbsLocal: number;
  /** Absolute local minute of the hour the reader picked. */
  sendAbsLocal: number;
  /** UTC minute of day of that same moment. */
  sendUtcMin: number;
  /** True when the picked hour has already gone by today and lands tomorrow. */
  isTomorrow: boolean;
  /** True when the picked hour is the one currently in progress. */
  isNow: boolean;
};

/**
 * Resolves "the hour I would write" into a real moment.
 *
 * The reader picks an hour on their own clock, and the page reads it as *the next* time that hour
 * comes round: pick an hour already gone and the message is planned for tomorrow, which the copy
 * says out loud. The current hour is the one exception — it resolves to the reference moment itself
 * rather than to its already-past opening minute, so "match to right now" cannot produce a plan
 * that starts twenty minutes in the past.
 */
export function buildSendContext(zoneId: string, sendHour: number): SendContext {
  const zone = zoneById(zoneId);
  const nowAbsLocal = REF_ABS_UTC + zone.offsetMin;
  const dayStart = Math.floor(nowAbsLocal / 1440) * 1440;
  const nowHour = Math.floor((nowAbsLocal - dayStart) / 60);
  const candidate = dayStart + sendHour * 60;
  const isNow = sendHour === nowHour;
  const sendAbsLocal = candidate >= nowAbsLocal ? candidate : isNow ? nowAbsLocal : candidate + 1440;
  const sendAbsUtc = sendAbsLocal - zone.offsetMin;
  return {
    offsetMin: zone.offsetMin,
    zone,
    nowAbsLocal,
    sendAbsLocal,
    sendUtcMin: mod(sendAbsUtc, 1440),
    isTomorrow: Math.floor(sendAbsLocal / 1440) > Math.floor(nowAbsLocal / 1440),
    isNow,
  };
}

/** "today" / "tomorrow" / "Thursday", relative to the reader's local day. */
export function dayLabel(absLocal: number, nowAbsLocal: number): string {
  const diff = Math.floor(absLocal / 1440) - Math.floor(nowAbsLocal / 1440);
  if (diff <= 0) return "today";
  if (diff === 1) return "tomorrow";
  return DAY_NAMES[mod(Math.floor(absLocal / 1440), 7)];
}

export type Outcome = {
  desk: Desk;
  /** Minutes the message sits before any desk is on shift. */
  waitMin: number;
  /** waitMin plus the queue's own median. */
  totalMin: number;
  replyAbsLocal: number;
};

export function channelOutcome(channel: Channel, ctx: SendContext): Outcome {
  const assigned = assignDesk(ctx.sendUtcMin);
  const waitMin = channel.alwaysOn ? 0 : assigned.waitMin;
  const totalMin = waitMin + channel.medianMin;
  return {
    desk: channel.alwaysOn ? deskById("bridge") : assigned.desk,
    waitMin,
    totalMin,
    replyAbsLocal: ctx.sendAbsLocal + totalMin,
  };
}

export function topicOutcome(topic: Topic, ctx: SendContext): Outcome {
  const desk = deskById(topic.deskId);
  const waitMin = minutesUntilOpen(desk, ctx.sendUtcMin);
  const totalMin = waitMin + topic.firstReplyMin;
  return { desk, waitMin, totalMin, replyAbsLocal: ctx.sendAbsLocal + totalMin };
}

/** Ticket reference shown on the receipt. Derived, never generated — the gate bans randomness. */
export function ticketRef(topic: Topic, ctx: SendContext, sendHour: number): string {
  const zoneIndex = ZONES.findIndex((z) => z.id === ctx.zone.id) + 1;
  return `HVL-${topic.code}-${String(sendHour).padStart(2, "0")}${String(zoneIndex).padStart(2, "0")}`;
}

/* ------------------------------------------------------------ static copy */

export const OTHER_PATHS = [
  {
    id: "post",
    title: "Post",
    lines: ["Havelock Systems, Inc.", "1180 Blake Street, Suite 400", "Denver, CO 80204, United States"],
    foot: "Contracts and legal notices only. Nothing posted here reaches a desk.",
  },
  {
    id: "status",
    title: "Status",
    lines: ["status.havelock.io", "Incident history back to 2021", "RSS and webhook subscriptions"],
    foot: "Check this before the bridge. Half of Sev-1 calls are already posted there.",
  },
  {
    id: "security",
    title: "Security",
    lines: ["security@havelock.io", "PGP 9F2C 44A1 08D3 7E55", "Disclosure policy at /security"],
    foot: "90-day coordinated disclosure. We answer disclosure mail on the rota, not in desk hours.",
  },
  {
    id: "sales",
    title: "Sales",
    lines: ["sales@havelock.io", "Median first reply 3 working hours", "No queue, no bridge"],
    foot: "Deliberately outside the desks above, so it can never take a seat from a support case.",
  },
];
