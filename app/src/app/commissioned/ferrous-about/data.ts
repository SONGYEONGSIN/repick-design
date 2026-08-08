// Ferrous — the company, told to someone who was evaluating the product and clicked "About".
//
// The reader is a prospective customer, not an investor and not a candidate. They want one thing
// answered before they will list an item or buy one: how proven is this place. So the page is
// organised around four measures — and around the rule that no measure appears without the person
// who is answerable for it.
//
// That constraint is enforced here rather than in the components. Every pillar names an owner and a
// principle; every principle names an owner; every milestone names the person who did the work.
// The current figures are not typed a second time: `PILLARS` reads them out of the last milestone,
// so the headline and the history cannot drift apart the way two hand-kept copies always do.
//
// Determinism: fixed literals, integer and `toFixed` arithmetic, no `Intl`, no clock. `CURRENT_YEAR`
// is a constant — reading the wall clock here would change the copy on New Year's Day and break
// hydration on the way there.

export const BRAND = "Ferrous";
export const FOUNDED_YEAR = 2017;
export const CURRENT_YEAR = 2026;
export const HEADCOUNT = 38;
export const PLACES = "Rotterdam and Lisbon";
export const CONTACT = "people@ferrous.market";

/** Space Grotesk, the one display face this work uses: a grotesk with squared bowls and true
 *  tabular figures, so a column of counts and a column of percentages line up without help. */
export const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

export const FOCUS_PAGE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50";
export const FOCUS_CARD =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
export const FOCUS_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Thousands separators by hand. `Intl` would resolve differently on the server and in a browser
 *  set to another locale, and the mismatch shows up as a hydration error, not a wrong comma. */
export function group(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------------------------

export type MemberId = "solheim" | "reguero" | "mori" | "okonjo" | "raman" | "kowalczyk";

export interface Member {
  id: MemberId;
  name: string;
  initials: string;
  role: string;
  /** Visible without expanding — the one thing that explains why they hold what they hold. */
  line: string;
  /** Revealed on expand. Where they came from, in their own register. */
  background: string;
  based: string;
}

export const MEMBERS: Member[] = [
  {
    id: "solheim",
    name: "Marit Solheim",
    initials: "MS",
    role: "Co-founder and chief executive",
    line: "Ran returns for a Nordic electronics chain and kept the photographs of everything sent back.",
    background:
      "Six years of watching perfectly serviceable things get written off because nobody could say, in writing, what condition they were in. Ferrous started as an argument about that.",
    based: "Rotterdam",
  },
  {
    id: "reguero",
    name: "Tomás Reguero",
    initials: "TR",
    role: "Co-founder and head of grading",
    line: "Appraised string instruments for fifteen years before a marketplace ever asked him to.",
    background:
      "An appraiser learns to describe damage without deciding whether it matters — that separation is the whole of our rubric, and it is his. He still grades on Thursdays.",
    based: "Rotterdam",
  },
  {
    id: "mori",
    name: "Ayaka Mori",
    initials: "AM",
    role: "Head of trust operations",
    line: "Wrote the rubric that every grade, model-written or not, is still checked against.",
    background:
      "Joined in 2019 to handle the first hundred disputes personally. Rewrote the rubric twice on the strength of what they had in common, and settles the remaining ones out of our margin rather than the seller's.",
    based: "Rotterdam",
  },
  {
    id: "okonjo",
    name: "Dele Okonjo",
    initials: "DO",
    role: "Head of model research",
    line: "Builds the model that reads the photographs, and publishes what it is unsure of.",
    background:
      "Came from medical imaging, where a model that hides its uncertainty is a liability rather than a feature. Set the confidence threshold below which a person still grades every item, and has never raised it.",
    based: "Rotterdam",
  },
  {
    id: "raman",
    name: "Priya Raman",
    initials: "PR",
    role: "Head of seller experience",
    line: "Tells sellers no, and then tells them exactly what would make it a yes.",
    background:
      "Holds the refusal rate on purpose: the person who owns how sellers feel is the person who should own how often we turn them away, or the number quietly drifts toward whatever is comfortable.",
    based: "Lisbon",
  },
  {
    id: "kowalczyk",
    name: "Janek Kowalczyk",
    initials: "JK",
    role: "Head of engineering",
    line: "Keeps nine years of photographs and grades queryable, and out of anyone else's hands.",
    background:
      "Every grade we have ever written is still retrievable next to the photographs it was written from. That archive is the only reason any number on this page can be checked rather than believed.",
    based: "Rotterdam",
  },
];

export function member(id: MemberId): Member {
  const found = MEMBERS.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown member: ${id}`);
  return found;
}

// ---------------------------------------------------------------------------------------------
// Principles — six rules, one per lead. Four of them surface as a measure.
// ---------------------------------------------------------------------------------------------

export type PillarId = "graded" | "refused" | "agreed" | "disputed";

export interface Principle {
  id: string;
  /** The rule, stated as what we do. Doubles as the row heading. */
  does: string;
  /** The same rule stated as what it forbids — the half that costs us something. */
  refuses: string;
  /** Why the refusal is worth what it costs. */
  because: string;
  owner: MemberId;
  /** The measure this rule shows up as, if it shows up as one at all. */
  pillar: PillarId | null;
}

export const PRINCIPLES: Principle[] = [
  {
    id: "grade-first",
    does: "We grade every item before it is listed.",
    refuses: "We do not let a seller write their own condition grade, and we do not publish a listing while a grade is pending.",
    because: "A grade written by the person who wants the sale is not a grade. Nothing goes up until someone with no stake in the price has described the wear.",
    owner: "reguero",
    pillar: "graded",
  },
  {
    id: "refuse-unverifiable",
    does: "We refuse what we cannot verify.",
    refuses: "We do not list an item without a serial or maker's mark, a sharp photograph of the worst part of it, and a working test where one applies.",
    because: "Turning away one submission in nine is the most expensive thing we do and the reason the two numbers below it are what they are.",
    owner: "raman",
    pillar: "refused",
  },
  {
    id: "publish-uncertainty",
    does: "We publish the model's uncertainty alongside the grade.",
    refuses: "We do not round a borderline grade up, and we do not let the model file a grade it is unsure of without a person looking first.",
    because: "A confident wrong grade costs a buyer more than an honest range. The threshold that sends an item to a human is published and has not moved since 2021.",
    owner: "okonjo",
    pillar: "agreed",
  },
  {
    id: "settle-from-margin",
    does: "We settle a disputed sale within five working days, out of our margin.",
    refuses: "We do not hold a buyer's money while we decide, and we do not ask a seller to argue their case in public.",
    because: "We wrote the grade, so the mistake is ours to pay for. Making either side wait would only teach them to stop reporting it.",
    owner: "mori",
    pillar: "disputed",
  },
  {
    id: "paid-on-completion",
    does: "We take a share of a completed sale, and nothing else.",
    refuses: "We do not sell placement, we do not charge to list, and we take no cut from the buyer.",
    because: "Every other revenue line we have been offered would have paid us for listings rather than for sales, and a marketplace paid for listings stops refusing them.",
    owner: "solheim",
    pillar: null,
  },
  {
    id: "keep-the-archive",
    does: "We keep every photograph and every grade we have ever written.",
    refuses: "We do not sell or license the archive, and we do not train on a private message between a buyer and a seller.",
    because: "The archive is what makes an old grade checkable years later. Selling it once would end that, and it is the only asset here that cannot be rebuilt.",
    owner: "kowalczyk",
    pillar: null,
  },
];

export function principleFor(pillar: PillarId): Principle {
  const found = PRINCIPLES.find((p) => p.pillar === pillar);
  if (!found) throw new Error(`No principle for pillar: ${pillar}`);
  return found;
}

// ---------------------------------------------------------------------------------------------
// The record — six milestones, each carrying the reading of all four measures at that point.
// ---------------------------------------------------------------------------------------------

export interface Milestone {
  year: number;
  title: string;
  body: string;
  /** The person who did this, not the person who announced it. */
  by: MemberId;
  readings: Record<PillarId, number>;
}

export const MILESTONES: Milestone[] = [
  {
    year: 2017,
    title: "Two people and a storage unit",
    body: "Marit and Tomás rented a unit on the Rotterdam docks and graded 640 items by hand, photographing every one of them from nine angles because they could not agree on which angle mattered. Those photographs are still the training set.",
    by: "solheim",
    readings: { graded: 640, refused: 24.0, agreed: 81.0, disputed: 2.1 },
  },
  {
    year: 2019,
    title: "The first model, and the rubric it had to obey",
    body: "Sixty-one thousand hand-graded items in, a model finally shipped — as a proposal a grader confirmed, never as the last word. Ayaka wrote the rubric it had to argue against, and joined to answer the first hundred disputes herself.",
    by: "mori",
    readings: { graded: 61_000, refused: 19.4, agreed: 87.5, disputed: 1.38 },
  },
  {
    year: 2021,
    title: "The millionth item, and a published threshold",
    body: "The model passed the volume the team could ever have reached by hand. Rather than quietly widen its remit we published the confidence level below which a person still grades every item. It has not moved since.",
    by: "okonjo",
    readings: { graded: 1_020_000, refused: 16.1, agreed: 90.4, disputed: 0.86 },
  },
  {
    year: 2023,
    title: "Rubric v3, and the refusal rule",
    body: "We started sending listings back: no serial, no sharp photograph of the wear, no listing. One submission in seven that year. Disputes fell under half a percent inside two quarters and have not come back up.",
    by: "raman",
    readings: { graded: 2_460_000, refused: 13.6, agreed: 92.9, disputed: 0.47 },
  },
  {
    year: 2024,
    title: "A second grading floor, in Lisbon",
    body: "Sellers across nine countries needed somewhere to send heavy things that was not Rotterdam. Lisbon grades to the same rubric, against the same archive, at the same threshold — a second floor rather than a second standard.",
    by: "kowalczyk",
    readings: { graded: 3_150_000, refused: 12.5, agreed: 93.7, disputed: 0.39 },
  },
  {
    year: 2026,
    title: "Where it stands",
    body: "Thirty-eight people across two cities, 4.18 million graded items, and under a third of a percent of completed sales disputed. We have never charged to list and we have never sold placement.",
    by: "solheim",
    readings: { graded: 4_180_000, refused: 11.4, agreed: 94.6, disputed: 0.31 },
  },
];

/** The last milestone is the present. Everything the hero claims is read from here, so the headline
 *  figures and the history are the same numbers rather than two copies that agree today. */
export const NOW: Milestone = MILESTONES[MILESTONES.length - 1];

// ---------------------------------------------------------------------------------------------
// The four measures
// ---------------------------------------------------------------------------------------------

export interface Pillar {
  id: PillarId;
  label: string;
  /** What the number counts, in one clause. */
  meaning: string;
  unit: "count" | "percent";
  decimals: number;
  /** Reading the reader should not misread as a failure or a triumph on its own. */
  reading: string;
  owner: MemberId;
  value: number;
}

const PILLAR_SPEC: Array<Omit<Pillar, "value">> = [
  {
    id: "graded",
    label: "Items graded",
    meaning: "Condition reports written since 2017, every one still retrievable next to its photographs.",
    unit: "count",
    decimals: 0,
    reading: "Volume alone proves nothing — it is here because the three measures beside it are drawn from this many items rather than from a good quarter.",
    owner: "reguero",
  },
  {
    id: "refused",
    label: "Submissions refused",
    meaning: "Listings sent back to the seller because we could not verify what they were.",
    unit: "percent",
    decimals: 1,
    reading: "Falling from 24 percent because sellers learned what we need, not because the bar moved. The rubric has only ever tightened.",
    owner: "raman",
  },
  {
    id: "agreed",
    label: "Grade agreed on arrival",
    meaning: "Buyers who opened the parcel and confirmed the grade without asking for a correction.",
    unit: "percent",
    decimals: 1,
    reading: "The measure that would suffer first if we ever started rounding borderline grades up, which is why it sits next to the rule against it.",
    owner: "okonjo",
  },
  {
    id: "disputed",
    label: "Sales disputed",
    meaning: "Completed sales where the buyer contested the grade after it arrived.",
    unit: "percent",
    decimals: 2,
    reading: "Settled out of our margin within five working days, so this number has no incentive to be under-reported.",
    owner: "mori",
  },
];

export const PILLARS: Pillar[] = PILLAR_SPEC.map((spec) => ({ ...spec, value: NOW.readings[spec.id] }));

export function pillar(id: PillarId): Pillar {
  const found = PILLARS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown pillar: ${id}`);
  return found;
}

export function formatValue(p: Pillar, value: number): string {
  return p.unit === "count" ? group(value) : `${value.toFixed(p.decimals)}%`;
}

// ---------------------------------------------------------------------------------------------
// Trajectory — the selected measure across the six milestones, as SVG geometry
// ---------------------------------------------------------------------------------------------

export const VIEW = { w: 640, h: 168, padX: 12, padTop: 16, padBottom: 16 } as const;

export interface TrajectoryPoint {
  year: number;
  value: number;
  x: number;
  y: number;
}

export interface Trajectory {
  points: TrajectoryPoint[];
  line: string;
  area: string;
  baseline: number;
}

/** Pure geometry from fixed data. Coordinates are rounded to two decimals so the string the server
 *  renders is byte-identical to the one the browser computes. */
export function trajectory(id: PillarId): Trajectory {
  const values = MILESTONES.map((m) => m.readings[id]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = VIEW.w - VIEW.padX * 2;
  const innerH = VIEW.h - VIEW.padTop - VIEW.padBottom;
  const yearSpan = CURRENT_YEAR - FOUNDED_YEAR;
  const baseline = VIEW.h - VIEW.padBottom;

  const points = MILESTONES.map((m) => ({
    year: m.year,
    value: m.readings[id],
    x: round2(VIEW.padX + ((m.year - FOUNDED_YEAR) / yearSpan) * innerW),
    y: round2(VIEW.padTop + (1 - (m.readings[id] - min) / span) * innerH),
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L${last.x} ${baseline} L${first.x} ${baseline} Z`;

  return { points, line, area, baseline };
}

// ---------------------------------------------------------------------------------------------
// Open roles — the careers half of the closing section
// ---------------------------------------------------------------------------------------------

export interface Role {
  title: string;
  where: string;
  team: string;
}

export const ROLES: Role[] = [
  { title: "Grader, tools and hardware", where: "Rotterdam", team: "Grading" },
  { title: "Grader, tools and hardware", where: "Lisbon", team: "Grading" },
  { title: "Research engineer, vision", where: "Rotterdam or remote in the EU", team: "Model research" },
  { title: "Trust operations specialist", where: "Lisbon", team: "Trust operations" },
  { title: "Backend engineer, archive", where: "Rotterdam or remote in the EU", team: "Engineering" },
  { title: "Seller support lead, Iberia", where: "Lisbon", team: "Seller experience" },
];
