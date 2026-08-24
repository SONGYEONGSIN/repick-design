export type GroupId = "condition" | "kit" | "age" | "use";

export type Option = {
  id: string;
  label: string;
  note: string;
  /** center multiplier — moves where the range sits */
  c: number;
  /** half-width multiplier — how much of the uncertainty this answer removes */
  t: number;
};

export type Group = {
  id: GroupId;
  index: string;
  label: string;
  ask: string;
  options: Option[];
};

export type Comp = {
  id: string;
  price: number;
  days: number;
  place: string;
  condition: string;
  kit: string;
  age: string;
  use: string;
};

export type Item = {
  id: string;
  name: string;
  category: string;
  retail: number;
  baseLow: number;
  baseHigh: number;
  axisMin: number;
  tags: { match: string; grade: string; verified: string; discount: string };
  comps: Comp[];
};

export type Selection = Partial<Record<GroupId, string>>;

export const FEE = 0.06;

export const GROUPS: Group[] = [
  {
    id: "condition",
    index: "01",
    label: "Condition",
    ask: "How does it look, and does everything still work?",
    options: [
      { id: "mint", label: "Mint", note: "No marks", c: 1.16, t: 0.74 },
      { id: "excellent", label: "Excellent", note: "Faint wear", c: 1.05, t: 0.72 },
      { id: "good", label: "Good", note: "Visible wear", c: 0.92, t: 0.7 },
      { id: "fair", label: "Fair", note: "Heavy wear", c: 0.76, t: 0.76 },
    ],
  },
  {
    id: "kit",
    index: "02",
    label: "What ships with it",
    ask: "Box, papers, cables, spare parts.",
    options: [
      { id: "full", label: "Full kit", note: "Box, papers, cables", c: 1.08, t: 0.8 },
      { id: "partial", label: "Partial", note: "Cable only", c: 0.99, t: 0.82 },
      { id: "bare", label: "Body only", note: "Nothing else", c: 0.9, t: 0.84 },
    ],
  },
  {
    id: "age",
    index: "03",
    label: "Age",
    ask: "When did it first become yours?",
    options: [
      { id: "fresh", label: "Under 1 year", note: "Current generation", c: 1.07, t: 0.84 },
      { id: "mid", label: "1 to 3 years", note: "One gen behind", c: 0.98, t: 0.82 },
      { id: "old", label: "Over 3 years", note: "Two gens behind", c: 0.88, t: 0.86 },
    ],
  },
  {
    id: "use",
    index: "04",
    label: "How hard it ran",
    ask: "Hours, charge cycles, shutter count.",
    options: [
      { id: "light", label: "Light", note: "Occasional", c: 1.05, t: 0.88 },
      { id: "normal", label: "Normal", note: "Weekly", c: 0.98, t: 0.86 },
      { id: "heavy", label: "Heavy", note: "Daily or pro", c: 0.9, t: 0.88 },
    ],
  },
];

export const ITEMS: Item[] = [
  {
    id: "x2",
    name: "Aperture X2",
    category: "Compact camera",
    retail: 1290,
    baseLow: 410,
    baseHigh: 980,
    axisMin: 200,
    tags: {
      match: "92% comp match",
      grade: "Grade B+ baseline",
      verified: "Serial verified",
      discount: "-46% vs retail",
    },
    comps: [
      { id: "x2-1", price: 1005, days: 4, place: "Seoul", condition: "mint", kit: "full", age: "fresh", use: "light" },
      { id: "x2-2", price: 902, days: 9, place: "Busan", condition: "mint", kit: "partial", age: "mid", use: "normal" },
      { id: "x2-3", price: 774, days: 12, place: "Incheon", condition: "mint", kit: "bare", age: "old", use: "heavy" },
      { id: "x2-4", price: 880, days: 6, place: "Seoul", condition: "excellent", kit: "full", age: "mid", use: "light" },
      { id: "x2-5", price: 812, days: 15, place: "Daegu", condition: "excellent", kit: "partial", age: "fresh", use: "heavy" },
      { id: "x2-6", price: 690, days: 21, place: "Seoul", condition: "excellent", kit: "bare", age: "old", use: "normal" },
      { id: "x2-7", price: 668, days: 8, place: "Gwangju", condition: "good", kit: "full", age: "old", use: "normal" },
      { id: "x2-8", price: 596, days: 17, place: "Seoul", condition: "good", kit: "partial", age: "mid", use: "heavy" },
      { id: "x2-9", price: 640, days: 24, place: "Daejeon", condition: "good", kit: "bare", age: "fresh", use: "light" },
      { id: "x2-10", price: 545, days: 11, place: "Seoul", condition: "fair", kit: "full", age: "mid", use: "normal" },
      { id: "x2-11", price: 470, days: 19, place: "Busan", condition: "fair", kit: "partial", age: "old", use: "light" },
      { id: "x2-12", price: 418, days: 27, place: "Seoul", condition: "fair", kit: "bare", age: "fresh", use: "heavy" },
    ],
  },
  {
    id: "loop",
    name: "Loop Pro",
    category: "Noise-cancelling headphones",
    retail: 549,
    baseLow: 122,
    baseHigh: 318,
    axisMin: 60,
    tags: {
      match: "88% comp match",
      grade: "Grade B baseline",
      verified: "Pairing verified",
      discount: "-60% vs retail",
    },
    comps: [
      { id: "lp-1", price: 336, days: 3, place: "Seoul", condition: "mint", kit: "full", age: "fresh", use: "light" },
      { id: "lp-2", price: 300, days: 7, place: "Suwon", condition: "mint", kit: "partial", age: "mid", use: "normal" },
      { id: "lp-3", price: 252, days: 14, place: "Seoul", condition: "mint", kit: "bare", age: "old", use: "heavy" },
      { id: "lp-4", price: 292, days: 5, place: "Busan", condition: "excellent", kit: "full", age: "mid", use: "light" },
      { id: "lp-5", price: 268, days: 10, place: "Seoul", condition: "excellent", kit: "partial", age: "fresh", use: "heavy" },
      { id: "lp-6", price: 226, days: 18, place: "Incheon", condition: "excellent", kit: "bare", age: "old", use: "normal" },
      { id: "lp-7", price: 218, days: 9, place: "Seoul", condition: "good", kit: "full", age: "old", use: "normal" },
      { id: "lp-8", price: 192, days: 22, place: "Daegu", condition: "good", kit: "partial", age: "mid", use: "heavy" },
      { id: "lp-9", price: 208, days: 16, place: "Seoul", condition: "good", kit: "bare", age: "fresh", use: "light" },
      { id: "lp-10", price: 176, days: 12, place: "Ulsan", condition: "fair", kit: "full", age: "mid", use: "normal" },
      { id: "lp-11", price: 150, days: 25, place: "Seoul", condition: "fair", kit: "partial", age: "old", use: "light" },
      { id: "lp-12", price: 128, days: 30, place: "Jeonju", condition: "fair", kit: "bare", age: "fresh", use: "heavy" },
    ],
  },
  {
    id: "ridge",
    name: "Ridge 14",
    category: "Ultralight laptop",
    retail: 2180,
    baseLow: 620,
    baseHigh: 1490,
    axisMin: 300,
    tags: {
      match: "90% comp match",
      grade: "Grade B+ baseline",
      verified: "Serial verified",
      discount: "-52% vs retail",
    },
    comps: [
      { id: "rg-1", price: 1548, days: 5, place: "Seoul", condition: "mint", kit: "full", age: "fresh", use: "light" },
      { id: "rg-2", price: 1390, days: 11, place: "Seongnam", condition: "mint", kit: "partial", age: "mid", use: "normal" },
      { id: "rg-3", price: 1180, days: 19, place: "Seoul", condition: "mint", kit: "bare", age: "old", use: "heavy" },
      { id: "rg-4", price: 1342, days: 7, place: "Busan", condition: "excellent", kit: "full", age: "mid", use: "light" },
      { id: "rg-5", price: 1236, days: 13, place: "Seoul", condition: "excellent", kit: "partial", age: "fresh", use: "heavy" },
      { id: "rg-6", price: 1050, days: 20, place: "Daejeon", condition: "excellent", kit: "bare", age: "old", use: "normal" },
      { id: "rg-7", price: 1015, days: 8, place: "Seoul", condition: "good", kit: "full", age: "old", use: "normal" },
      { id: "rg-8", price: 902, days: 23, place: "Incheon", condition: "good", kit: "partial", age: "mid", use: "heavy" },
      { id: "rg-9", price: 968, days: 15, place: "Seoul", condition: "good", kit: "bare", age: "fresh", use: "light" },
      { id: "rg-10", price: 826, days: 10, place: "Gwangju", condition: "fair", kit: "full", age: "mid", use: "normal" },
      { id: "rg-11", price: 712, days: 26, place: "Seoul", condition: "fair", kit: "partial", age: "old", use: "light" },
      { id: "rg-12", price: 634, days: 29, place: "Busan", condition: "fair", kit: "bare", age: "fresh", use: "heavy" },
    ],
  },
];

export function money(n: number) {
  const v = Math.round(n);
  const sign = v < 0 ? "-" : "";
  return sign + "$" + Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function optionOf(groupId: GroupId, optionId: string | undefined) {
  if (!optionId) return undefined;
  const group = GROUPS.find((g) => g.id === groupId);
  return group?.options.find((o) => o.id === optionId);
}

export function labelOf(groupId: GroupId, optionId: string) {
  return optionOf(groupId, optionId)?.label ?? optionId;
}

export type Estimate = {
  low: number;
  high: number;
  mid: number;
  half: number;
  spread: number;
  baseHalf: number;
};

export function estimate(item: Item, sel: Selection): Estimate {
  const baseMid = (item.baseLow + item.baseHigh) / 2;
  const baseHalf = (item.baseHigh - item.baseLow) / 2;
  let c = 1;
  let t = 1;
  for (const g of GROUPS) {
    const o = optionOf(g.id, sel[g.id]);
    if (!o) continue;
    c *= o.c;
    t *= o.t;
  }
  const mid = baseMid * c;
  const half = baseHalf * t;
  return {
    low: Math.round(mid - half),
    high: Math.round(mid + half),
    mid: Math.round(mid),
    half: Math.round(half),
    spread: half / mid,
    baseHalf: Math.round(baseHalf),
  };
}

export type Confidence = { tier: string; blurb: string; step: number };

export function confidenceOf(spread: number): Confidence {
  if (spread >= 0.34) {
    return {
      tier: "Broad",
      blurb: "This is the market for the model, not the price of your unit.",
      step: 1,
    };
  }
  if (spread >= 0.26) {
    return {
      tier: "Coarse",
      blurb: "One trait known. Enough to plan, not enough to list.",
      step: 2,
    };
  }
  if (spread >= 0.19) {
    return {
      tier: "Narrow",
      blurb: "Close enough that a buyer will argue inside the band, not outside it.",
      step: 3,
    };
  }
  return {
    tier: "Tight",
    blurb: "Listing-grade. Pick any number in here and defend it.",
    step: 4,
  };
}

export function contributions(sel: Selection) {
  const weights = GROUPS.map((g) => {
    const o = optionOf(g.id, sel[g.id]);
    return { id: g.id, label: g.label, w: o ? Math.log(1 / o.t) : 0 };
  });
  const total = weights.reduce((s, x) => s + x.w, 0);
  let t = 1;
  for (const g of GROUPS) {
    const o = optionOf(g.id, sel[g.id]);
    if (o) t *= o.t;
  }
  const cut = 1 - t;
  const parts = weights
    .filter((x) => x.w > 0)
    .map((x) => ({
      id: x.id,
      label: x.label,
      width: total > 0 ? (x.w / total) * cut * 100 : 0,
    }));
  return { cut, parts, open: (1 - cut) * 100 };
}

export function pctText(spread: number) {
  return (Math.round(spread * 1000) / 10).toFixed(1);
}
