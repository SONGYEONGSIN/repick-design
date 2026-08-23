// Disclosure 03 — quarterly miss report data.
// Every figure here is a fixed literal. No dates, no randomness, no clocks.

export type PeriodId = "p1" | "p2" | "p3";
export type LensId = "all" | "customer";
export type ClassId =
  | "authenticity"
  | "grade"
  | "price"
  | "completeness"
  | "service"
  | "brief";

export interface PeriodMeta {
  id: PeriodId;
  label: string;
  short: string;
  appraisals: number;
  misses: number;
  internal: number;
  customer: number;
  compiled: string;
  note: string;
}

export interface ClassPeriodStat {
  cases: number;
  internal: number;
  customer: number;
  remedied: number;
  pending: number;
  medianDays: number;
}

export interface FailureClass {
  id: ClassId;
  index: string;
  name: string;
  definition: string;
  stats: Record<PeriodId, ClassPeriodStat>;
  worstRef: string;
  worstLogged: string;
  worstHeadline: string;
  worstBody: string;
  worstOutcome: string;
  guardrail: string;
  guardrailShipped: string;
  stillOpen: string;
}

export interface Listing {
  ref: string;
  title: string;
  meta: string;
  matchPct: number;
  grade: string;
  certification: string;
  discountPct: number;
  firstGrade: string;
  firstBand: number;
  confidence: number;
  finalGrade: string;
  finalBand: number;
  verdict: string;
  caughtBy: string;
  daysToClose: number;
  found: string;
  settled: string;
}

export const PERIODS: PeriodMeta[] = [
  {
    id: "p1",
    label: "Q4 2025",
    short: "Q4 2025",
    appraisals: 36140,
    misses: 1481,
    internal: 1123,
    customer: 358,
    compiled: "compiled 2026-01-14",
    note: "The first quarter we published a miss report at all. It reads badly on purpose.",
  },
  {
    id: "p2",
    label: "Q1 2026",
    short: "Q1 2026",
    appraisals: 39522,
    misses: 1362,
    internal: 1069,
    customer: 293,
    compiled: "compiled 2026-04-16",
    note: "Hand inspection was extended to every item over 400 dollars in the middle of this quarter.",
  },
  {
    id: "p3",
    label: "Q2 2026",
    short: "Q2 2026",
    appraisals: 41904,
    misses: 1286,
    internal: 1037,
    customer: 249,
    compiled: "compiled 2026-07-18",
    note: "Third report in a row above the ceiling we published. The gap is closing slowly, not quickly.",
  },
];

export const TARGETS: Record<LensId, number> = { all: 2.5, customer: 0.4 };

export const LENSES: { id: LensId; label: string; caption: string }[] = [
  {
    id: "all",
    label: "Every miss we logged",
    caption: "Includes the ones we caught ourselves before anyone else saw them.",
  },
  {
    id: "customer",
    label: "The ones that reached the buyer",
    caption: "The subset we did not catch. This is the number that actually cost someone something.",
  },
];

export const CLASSES: FailureClass[] = [
  {
    id: "authenticity",
    index: "01",
    name: "Authenticity call reversed",
    definition:
      "The model cleared an item as genuine and a later inspection disagreed with it.",
    stats: {
      p1: { cases: 58, internal: 39, customer: 19, remedied: 19, pending: 0, medianDays: 4 },
      p2: { cases: 41, internal: 30, customer: 11, remedied: 11, pending: 0, medianDays: 3 },
      p3: { cases: 34, internal: 27, customer: 7, remedied: 7, pending: 0, medianDays: 2 },
    },
    worstRef: "Case A-2261",
    worstLogged: "logged 2026-05-09",
    worstHeadline: "A counterfeit diver cleared photo review at 0.94 confidence and shipped.",
    worstBody:
      "The dial print was right, the case back was right, and the model had never been shown that movement. The buyer opened the case, sent three macro frames, and was correct within an hour. Two more items from the same seller were already in transit when the message arrived.",
    worstOutcome:
      "Three refunds inside 48 hours, return freight and inspection paid by us, seller removed and reported. The two in transit were recalled before delivery.",
    guardrail:
      "Photo-only clearance no longer exists for mechanical watches. Every one goes to hand inspection regardless of price.",
    guardrailShipped: "shipped 2026-05-22",
    stillOpen:
      "Hand inspection is one room and four people. At this volume it adds 1.8 days to listing time and we have not solved that.",
  },
  {
    id: "grade",
    index: "02",
    name: "Condition grade too generous",
    definition:
      "The model graded an item above the grade a person gave it on re-inspection.",
    stats: {
      p1: { cases: 566, internal: 434, customer: 132, remedied: 132, pending: 0, medianDays: 7 },
      p2: { cases: 522, internal: 421, customer: 101, remedied: 99, pending: 2, medianDays: 5 },
      p3: { cases: 487, internal: 402, customer: 85, remedied: 81, pending: 4, medianDays: 4 },
    },
    worstRef: "Case G-4417",
    worstLogged: "logged 2026-04-02",
    worstHeadline: "A lens graded A-minus had a fungus bloom that none of our frames could show.",
    worstBody:
      "Every listed photo was shot at f/8 against a light box, which is how we had always shot glass. The bloom was only visible wide open against a white wall. The buyer found it in ninety seconds with a phone.",
    worstOutcome:
      "Full refund, item relisted at C with the bloom written into the first line of the description rather than the last.",
    guardrail:
      "Glass now requires one backlit wide-open frame before a grade is computed. Items without that frame are held, not guessed.",
    guardrailShipped: "shipped 2026-04-19",
    stillOpen:
      "We still cannot see early-stage fungus in any photograph. The frame requirement moves the catch rate. It does not close the class.",
  },
  {
    id: "price",
    index: "03",
    name: "Price band above comparable sales",
    definition:
      "The band floor sat above the median of comparable sales that closed in the next 30 days.",
    stats: {
      p1: { cases: 425, internal: 330, customer: 95, remedied: 95, pending: 0, medianDays: 6 },
      p2: { cases: 388, internal: 314, customer: 74, remedied: 72, pending: 2, medianDays: 4 },
      p3: { cases: 361, internal: 300, customer: 61, remedied: 58, pending: 3, medianDays: 3 },
    },
    worstRef: "Case P-1908",
    worstLogged: "logged 2026-02-27",
    worstHeadline: "We held a discontinued amplifier 22 percent over market for six weeks.",
    worstBody:
      "The comparable set was four sales, three of them from a single estate, all lifted by the same pair of bidders. The model treated a thin market as a confident one, which is the failure mode it has whenever data is scarce.",
    worstOutcome:
      "Band withdrawn, nineteen listings repriced in one afternoon, six buyers who had already paid received the difference back without asking for it.",
    guardrail:
      "A band now needs six closes from four distinct sellers inside 18 months. Below that we decline to price the item.",
    guardrailShipped: "shipped 2026-03-11",
    stillOpen:
      "11.2 percent of submissions are now declined instead of priced. Sellers dislike it and say so. We would rather be useless than confidently wrong.",
  },
  {
    id: "completeness",
    index: "04",
    name: "Completeness misread",
    definition:
      "Box, papers, cables or accessories recorded differently from what actually shipped.",
    stats: {
      p1: { cases: 249, internal: 187, customer: 62, remedied: 62, pending: 0, medianDays: 8 },
      p2: { cases: 231, internal: 178, customer: 53, remedied: 52, pending: 1, medianDays: 6 },
      p3: { cases: 218, internal: 171, customer: 47, remedied: 44, pending: 3, medianDays: 5 },
    },
    worstRef: "Case C-3350",
    worstLogged: "logged 2026-06-13",
    worstHeadline: "Papers recorded as present turned out to be a photocopy.",
    worstBody:
      "The scan was sharp enough to read every word and not sharp enough to see the paper it was printed on. The listing said full set for eleven days before anybody noticed, including us.",
    worstOutcome:
      "Buyer kept the item at a renegotiated price 31 percent lower, with the difference paid by us rather than taken from the seller.",
    guardrail:
      "Any document claim now needs one raking-light frame. A full set is a claim we have to evidence, not a checkbox someone ticks.",
    guardrailShipped: "shipped 2026-06-24",
    stillOpen:
      "Papers issued before 2014 vary too much to template. Field accuracy on those sits at 71 percent and we publish that number rather than hide behind an average.",
  },
  {
    id: "service",
    index: "05",
    name: "Service history misparsed",
    definition:
      "Dates, parts or service houses read incorrectly from a document or a stamp.",
    stats: {
      p1: { cases: 106, internal: 80, customer: 26, remedied: 26, pending: 0, medianDays: 9 },
      p2: { cases: 108, internal: 84, customer: 24, remedied: 23, pending: 1, medianDays: 7 },
      p3: { cases: 121, internal: 96, customer: 25, remedied: 23, pending: 2, medianDays: 6 },
    },
    worstRef: "Case S-0721",
    worstLogged: "logged 2026-01-30",
    worstHeadline: "A 2019 service read as 2013, so we listed a serviced piece as overdue.",
    worstBody:
      "A stamped nine with a broken descender. The model read it, no person checked it, and the seller lost 14 percent on work that had actually been done and paid for six years earlier.",
    worstOutcome:
      "Seller compensated at the corrected band, listing rerun at our cost, and the stamp added to the training set together with its correction.",
    guardrail:
      "Any parsed date that moves a band by more than 8 percent is now read a second time by a person before it can publish.",
    guardrailShipped: "shipped 2026-02-08",
    stillOpen:
      "This is the one class that got worse this quarter, from 108 cases to 121. Volume of handwritten books rose faster than the second-read rota. We are behind on it.",
  },
  {
    id: "brief",
    index: "06",
    name: "Match sent against the wrong brief",
    definition:
      "The item met every filter and missed what the buyer had actually asked for in writing.",
    stats: {
      p1: { cases: 77, internal: 53, customer: 24, remedied: 24, pending: 0, medianDays: 5 },
      p2: { cases: 72, internal: 42, customer: 30, remedied: 29, pending: 1, medianDays: 4 },
      p3: { cases: 65, internal: 41, customer: 24, remedied: 22, pending: 2, medianDays: 3 },
    },
    worstRef: "Case M-5502",
    worstLogged: "logged 2026-05-28",
    worstHeadline: "Someone asked for a gift and we sent them an investment.",
    worstBody:
      "The brief said gift, under budget, does not need to hold value. The model optimised for resale strength, because resale strength is what it reaches for whenever the text is short and it has to fill in the rest.",
    worstOutcome:
      "No money changed hands and nobody complained. It is counted on this page anyway, because a match nobody wanted is still a wrong answer we produced.",
    guardrail:
      "Free-text briefs under twelve words now trigger one clarifying question instead of a ranked list of guesses.",
    guardrailShipped: "shipped 2026-06-05",
    stillOpen:
      "We do not know how many people closed the tab rather than correct us. That number is not in this report and we cannot estimate it honestly.",
  },
];

export const HERO_LISTINGS: {
  ref: string;
  title: string;
  meta: string;
  matchPct: number;
  grade: string;
  certification: string;
  discountPct: number;
  stamp: string;
}[] = [
  {
    ref: "RP-8814",
    title: "Grand Seiko SBGA211",
    meta: "2019 · full set · one owner",
    matchPct: 94,
    grade: "A-",
    certification: "Hand inspected",
    discountPct: 22,
    stamp: "First call was A. Re-inspection found a crown-guard scuff, so it lists at A-minus.",
  },
  {
    ref: "RP-8790",
    title: "Leica M6 Classic",
    meta: "1998 · body only · new curtains",
    matchPct: 89,
    grade: "B+",
    certification: "Hand inspected",
    discountPct: 31,
    stamp: "First call held. Two inspectors agreed with the model and each other.",
  },
  {
    ref: "RP-8832",
    title: "Rolex Submariner 14060M",
    meta: "2007 · box, no papers",
    matchPct: 91,
    grade: "A",
    certification: "Movement opened",
    discountPct: 18,
    stamp: "We withdrew our own papers claim before this went live. The photocopy was ours to catch.",
  },
];

export const PREVIEW_LISTINGS: Listing[] = [
  {
    ref: "RP-9021",
    title: "Omega Speedmaster 3570.50",
    meta: "2014 · full set · unpolished",
    matchPct: 96,
    grade: "A",
    certification: "Movement opened",
    discountPct: 19,
    firstGrade: "A",
    firstBand: 4980,
    confidence: 91,
    finalGrade: "A",
    finalBand: 4980,
    verdict: "Call held",
    caughtBy: "Nobody. Nothing to catch.",
    daysToClose: 0,
    found: "Two inspectors agreed with the first call on grade and on band. It happens 96.9 percent of the time and it is not the interesting part of this page.",
    settled: "Listed as first called, at the price first proposed.",
  },
  {
    ref: "RP-9047",
    title: "Canon 50mm f/1.2 LTM",
    meta: "1961 · caps only · original glass",
    matchPct: 88,
    grade: "C+",
    certification: "Hand inspected",
    discountPct: 44,
    firstGrade: "B",
    firstBand: 1240,
    confidence: 86,
    finalGrade: "C+",
    finalBand: 980,
    verdict: "Corrected before listing",
    caughtBy: "Our re-inspection",
    daysToClose: 2,
    found: "The backlit frame we now require showed early haze across the rear element. Grade dropped one step and the band dropped 21 percent.",
    settled: "Corrected before anyone could buy it. The seller was told why, in writing, with the frame attached.",
  },
  {
    ref: "RP-9068",
    title: "Naim NAP 250 DR",
    meta: "2018 · original carton · serviced",
    matchPct: 84,
    grade: "B",
    certification: "Bench tested",
    discountPct: 27,
    firstGrade: "B",
    firstBand: 3150,
    confidence: 79,
    finalGrade: "B",
    finalBand: 2640,
    verdict: "Corrected after sale",
    caughtBy: "The buyer, not us",
    daysToClose: 4,
    found: "We priced from four comparable closes. The buyer sent us three more we had never indexed, all lower, all inside the window. He was right and our band was not.",
    settled: "Band corrected, difference of 510 dollars returned to the buyer, comparable index rebuilt for the whole category.",
  },
  {
    ref: "RP-9083",
    title: "Hasselblad 500C/M",
    meta: "1979 · body, back, waist-level finder",
    matchPct: 92,
    grade: "B+",
    certification: "Hand inspected",
    discountPct: 35,
    firstGrade: "A-",
    firstBand: 1860,
    confidence: 88,
    finalGrade: "B+",
    finalBand: 1690,
    verdict: "Corrected before listing",
    caughtBy: "Our re-inspection",
    daysToClose: 1,
    found: "The film back light seal was recorded as replaced. It had not been replaced. The seller believed it had, which is the common way this class of miss starts.",
    settled: "Grade and band corrected before the listing went live, replacement seal quoted in the description.",
  },
];

export const LIMITS: { index: string; bound: string; body: string }[] = [
  {
    index: "L1",
    bound: "92.4%",
    body: "Photo-only authentication agrees with hand inspection 92.4 percent of the time. That is not high enough to ship on, so for watches we no longer ship on it.",
  },
  {
    index: "L2",
    bound: "71%",
    body: "Service documents written before 2014 parse at 71 percent field accuracy. We flag those listings as parsed, not verified, and we do not price from them alone.",
  },
  {
    index: "L3",
    bound: "3.9%",
    body: "Items under 400 dollars skip hand inspection. 3.9 percent of those grades are never seen by a person, so we cannot tell you how many of them are wrong.",
  },
  {
    index: "L4",
    bound: "2,410",
    body: "This report counts appraisals. It does not count the 2,410 submissions we declined to price at all. Declining is not free for the seller and we have no measure of what it cost them.",
  },
];

export const VOICES: { quote: string; who: string }[] = [
  {
    quote:
      "They emailed me before I emailed them. The refund was already moving by the time I finished typing.",
    who: "Buyer, case C-3350, Seoul",
  },
  {
    quote:
      "I had never seen a marketplace publish how often it was wrong. I read that page before I read a single listing.",
    who: "Seller since 2024, Osaka",
  },
  {
    quote:
      "Mine is on this page. I still sell here, because I know exactly what I am trading against.",
    who: "Seller, case S-0721, Berlin",
  },
];

export function fmtInt(n: number): string {
  const s = Math.round(Math.abs(n)).toString();
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return n < 0 ? `-${grouped}` : grouped;
}

export function periodOf(id: PeriodId): PeriodMeta {
  return PERIODS.find((p) => p.id === id) ?? PERIODS[PERIODS.length - 1];
}

export function lensTotal(period: PeriodMeta, lens: LensId): number {
  return lens === "all" ? period.misses : period.customer;
}

export function missRate(period: PeriodMeta, lens: LensId): number {
  return (lensTotal(period, lens) / period.appraisals) * 100;
}

export function overBy(period: PeriodMeta, lens: LensId): number {
  return missRate(period, lens) - TARGETS[lens];
}

export function classCount(cls: FailureClass, id: PeriodId, lens: LensId): number {
  const s = cls.stats[id];
  return lens === "all" ? s.cases : s.customer;
}

export function classShare(cls: FailureClass, id: PeriodId, lens: LensId): number {
  const period = periodOf(id);
  return (classCount(cls, id, lens) / lensTotal(period, lens)) * 100;
}
