// native/src/evolve/r1/c/data.ts — auto-native-r1 candidate c: taste-calibration deck
// + the precomputed transition table that turns one judgment into a profile update.
//
// Determinism: no random source and no clock reads anywhere. The deck is fixed, every
// (subject × decision) pair carries a fixed delta vector, and the profile is a pure
// left fold over the decision list — the same sequence always yields the same profile,
// and dropping the last decision (undo) is exact, not approximate.

export type Decision = "fit" | "pass";
export type SignalKey = "brand" | "price" | "condition";

/** One row of the transition table: what a single judgment does to the profile, and why. */
export type Effect = {
  brand: number; // points added to this subject's brand bucket
  price: number; // KRW added to the price ceiling
  condition: number; // points added to the condition-tolerance score
  note: string; // plain-language reason, shown verbatim in the profile panel
};

export type Subject = {
  id: string;
  brand: string;
  title: string;
  price: number;
  grade: "A" | "B" | "C";
  gradeNote: string;
  traits: string[];
  fit: Effect;
  pass: Effect;
};

/** The calibration deck — 8 secondhand lots, judged one at a time. */
export const DECK: Subject[] = [
  {
    id: "c1",
    brand: "Marantz",
    title: "Marantz 2270 Receiver",
    price: 940000,
    grade: "B",
    gradeNote: "Dial lamps replaced; one scratch across the faceplate",
    traits: ["1971", "Walnut case", "Serviced"],
    fit: {
      brand: 9,
      price: 90000,
      condition: 7,
      note: "You kept a ₩940,000 receiver, so the ceiling rose and Grade B stopped costing points.",
    },
    pass: {
      brand: -5,
      price: -60000,
      condition: -4,
      note: "Passing at ₩940,000 read as price resistance, so the ceiling came back down.",
    },
  },
  {
    id: "c2",
    brand: "Leica",
    title: "Leica Minilux Compact",
    price: 1180000,
    grade: "A",
    gradeNote: "Boxed with papers; no marks on the body",
    traits: ["Point and shoot", "Full set"],
    fit: {
      brand: 10,
      price: 140000,
      condition: -6,
      note: "A mint boxed pick raised the ceiling and narrowed what counts as acceptable wear.",
    },
    pass: {
      brand: -4,
      price: -110000,
      condition: 2,
      note: "Turning down a mint copy says condition is not what you are paying a premium for.",
    },
  },
  {
    id: "c3",
    brand: "Levi's",
    title: "Levi's Type III Trucker",
    price: 145000,
    grade: "C",
    gradeNote: "Hem repaired twice; cuffs fraying",
    traits: ["1980s", "Faded indigo"],
    fit: {
      brand: 6,
      price: -20000,
      condition: 12,
      note: "Accepting a twice-repaired Grade C widened your condition tolerance more than anything yet.",
    },
    pass: {
      brand: -3,
      price: 10000,
      condition: -9,
      note: "Visible repairs were a no, so the condition floor tightened toward clean lots.",
    },
  },
  {
    id: "c4",
    brand: "Braun",
    title: "Braun ET66 Calculator",
    price: 96000,
    grade: "C",
    gradeNote: "Case yellowed; every key still responds",
    traits: ["1987", "Original keys"],
    fit: {
      brand: 8,
      price: -30000,
      condition: 9,
      note: "A ₩96,000 keep with yellowed plastic moved you toward cheap, honest wear.",
    },
    pass: {
      brand: -6,
      price: 20000,
      condition: -6,
      note: "Skipping the cheapest lot lifted your floor rather than your ceiling.",
    },
  },
  {
    id: "c5",
    brand: "Marantz",
    title: "Marantz Model 1030 Amplifier",
    price: 420000,
    grade: "B",
    gradeNote: "Recapped last year; light rack rash on the ears",
    traits: ["1975", "Recapped"],
    fit: {
      brand: 11,
      price: -10000,
      condition: 5,
      note: "A second Marantz keep is the strongest brand signal in this session.",
    },
    pass: {
      brand: -8,
      price: 5000,
      condition: -2,
      note: "Passing a second Marantz weakened the brand lean you started the session with.",
    },
  },
  {
    id: "c6",
    brand: "Leica",
    title: "Leica CL Body",
    price: 1650000,
    grade: "B",
    gradeNote: "Brassing along the edges; meter reads accurate",
    traits: ["1974", "Meter tested"],
    fit: {
      brand: 9,
      price: 180000,
      condition: 8,
      note: "Paying ₩1,650,000 for a brassed body raised the ceiling and relaxed condition together.",
    },
    pass: {
      brand: -5,
      price: -90000,
      condition: -5,
      note: "The priciest lot was a pass, so the ceiling settled well below it.",
    },
  },
  {
    id: "c7",
    brand: "Braun",
    title: "Braun L470 Speaker Pair",
    price: 310000,
    grade: "B",
    gradeNote: "Drivers refoamed; grille cloth has aged",
    traits: ["Pair", "Refoamed"],
    fit: {
      brand: 7,
      price: -5000,
      condition: 6,
      note: "Refoamed drivers were fine by you, so serviced wear now scores in favour.",
    },
    pass: {
      brand: -6,
      price: 15000,
      condition: -7,
      note: "Serviced but aged was a pass, tightening tolerance for restored lots.",
    },
  },
  {
    id: "c8",
    brand: "Pilot",
    title: "Pilot Custom 823 Pen",
    price: 228000,
    grade: "A",
    gradeNote: "Nib tuned by a specialist; no visible wear",
    traits: ["Amber", "Nib tuned"],
    fit: {
      brand: 5,
      price: -40000,
      condition: -4,
      note: "A small mint keep pulled the ceiling down and the condition bar up.",
    },
    pass: {
      brand: -2,
      price: 25000,
      condition: 3,
      note: "Passing a mint small-ticket item widened the range you will still accept.",
    },
  },
];

// Seed profile — what the three signup questions already implied. The panel is never
// empty: the proof of "what has been learned" exists before the first judgment.
const BRAND_ORDER = ["Marantz", "Braun", "Leica", "Levi's", "Pilot"]; // fixed order → deterministic ties
const SEED_BRANDS: Record<string, number> = { Marantz: 14, Braun: 10, Leica: 6, "Levi's": 4, Pilot: 2 };
const SEED_CEILING = 620000;
const SEED_CONDITION = 46;

export type Profile = {
  judged: number;
  brands: Record<string, number>;
  ceiling: number; // KRW
  condition: number; // 0..100 tolerance score
};

export type BrandLead = { name: string; score: number; runnerUp: string; gap: number };

export type SignalRow = {
  key: SignalKey;
  label: string;
  readout: string; // what the system currently believes
  hint: string; // the evidence behind that belief
  strength: number; // 0..100, drives the meter
  delta: number; // strength change caused by the most recent judgment (0 = unchanged)
};

export type CalibrationState = {
  profile: Profile;
  rows: SignalRow[];
  caption: string; // what produced the latest update
  note: string; // one sentence: which signal moved and why
  summary: string; // end-of-deck recap of the whole profile
  lastPick: string | null; // title of the most recent judgment, for the undo label
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Thousands-separated KRW — avoids toLocaleString so output is environment-independent. */
export function formatWon(won: number): string {
  return `₩${Math.round(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Compact KRW for meters and captions: 940000 → ₩940K, 1180000 → ₩1.18M. */
export function shortWon(won: number): string {
  if (won >= 1000000) return `₩${(Math.round(won / 10000) / 100).toFixed(2)}M`;
  return `₩${Math.round(won / 1000)}K`;
}

/** Pure left fold: decision i applies the transition-table row of DECK[i]. */
export function foldDecisions(decisions: Decision[]): Profile {
  const brands: Record<string, number> = {};
  for (const name of BRAND_ORDER) brands[name] = SEED_BRANDS[name];
  let ceiling = SEED_CEILING;
  let condition = SEED_CONDITION;
  let judged = 0;
  const limit = Math.min(decisions.length, DECK.length);
  for (let i = 0; i < limit; i++) {
    const subject = DECK[i];
    const effect = decisions[i] === "fit" ? subject.fit : subject.pass;
    brands[subject.brand] = brands[subject.brand] + effect.brand;
    ceiling = clamp(ceiling + effect.price, 80000, 2400000);
    condition = clamp(condition + effect.condition, 0, 100);
    judged += 1;
  }
  return { judged, brands, ceiling, condition };
}

/** Leading brand + runner-up. Ties resolve by BRAND_ORDER, so the result is deterministic. */
export function brandLead(p: Profile): BrandLead {
  let best = { name: "", score: Number.NEGATIVE_INFINITY };
  let second = { name: "", score: Number.NEGATIVE_INFINITY };
  for (const name of BRAND_ORDER) {
    const score = p.brands[name];
    if (score > best.score) {
      second = best;
      best = { name, score };
    } else if (score > second.score) {
      second = { name, score };
    }
  }
  return { name: best.name, score: best.score, runnerUp: second.name, gap: Math.max(0, best.score - second.score) };
}

export function conditionReadout(score: number): string {
  if (score >= 68) return "Grade C and up";
  if (score >= 42) return "Grade B and up";
  return "Grade A only";
}

const SIGNAL_META: { key: SignalKey; label: string }[] = [
  { key: "brand", label: "Brand affinity" },
  { key: "price", label: "Price ceiling" },
  { key: "condition", label: "Condition tolerance" },
];

function strengthOf(p: Profile, key: SignalKey): number {
  if (key === "brand") return clamp(20 + brandLead(p).gap * 4, 0, 100);
  if (key === "price") return clamp(24 + p.judged * 9, 0, 100);
  return clamp(p.condition, 0, 100);
}

function readoutOf(p: Profile, key: SignalKey): string {
  if (key === "brand") {
    const lead = brandLead(p);
    return lead.gap === 0 ? `Split ${lead.name} / ${lead.runnerUp}` : `Leans ${lead.name}`;
  }
  if (key === "price") return `Up to ${shortWon(p.ceiling)}`;
  return conditionReadout(p.condition);
}

function hintOf(p: Profile, key: SignalKey): string {
  if (key === "brand") {
    const lead = brandLead(p);
    return lead.gap === 0 ? `No separation from ${lead.runnerUp} yet` : `Ahead of ${lead.runnerUp} by ${lead.gap} pts`;
  }
  if (key === "price") {
    const moved = p.ceiling - SEED_CEILING;
    if (moved > 0) return `Up ${shortWon(moved)} from signup`;
    if (moved < 0) return `Down ${shortWon(-moved)} from signup`;
    return "Unchanged from signup";
  }
  return `Tolerance ${p.condition} of 100`;
}

/**
 * Everything the screen renders, derived from the decision list alone.
 * Deltas come from re-folding the list without its last entry, so the "what just moved"
 * markers are computed, never stored — undo can never leave a stale delta behind.
 */
export function readCalibration(decisions: Decision[]): CalibrationState {
  const profile = foldDecisions(decisions);
  const previous = foldDecisions(decisions.slice(0, -1));
  const rows: SignalRow[] = [];
  for (const meta of SIGNAL_META) {
    const strength = strengthOf(profile, meta.key);
    rows.push({
      key: meta.key,
      label: meta.label,
      readout: readoutOf(profile, meta.key),
      hint: hintOf(profile, meta.key),
      strength,
      delta: strength - strengthOf(previous, meta.key),
    });
  }

  const count = Math.min(decisions.length, DECK.length);
  const lead = brandLead(profile);
  const summary = `Your picker now leans ${lead.name}, tops out at ${shortWon(profile.ceiling)}, and accepts ${conditionReadout(profile.condition)}.`;

  if (count === 0) {
    return {
      profile,
      rows,
      caption: "Starting point · signup answers",
      note: "No judgments yet — this profile comes from the three questions you answered at signup.",
      summary,
      lastPick: null,
    };
  }

  const subject = DECK[count - 1];
  const decision = decisions[count - 1];
  const effect = decision === "fit" ? subject.fit : subject.pass;
  return {
    profile,
    rows,
    caption: `${decision === "fit" ? "Fits me" : "Not for me"} · ${subject.title}`,
    note: effect.note,
    summary,
    lastPick: subject.title,
  };
}
