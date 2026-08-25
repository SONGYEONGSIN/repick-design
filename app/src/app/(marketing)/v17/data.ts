// Negotiation engine — pure functions and typed constants only, no JSX.
//
// The whole page's argument is: an AI buyer-agent negotiates on the visitor's behalf, anchored to
// comparable sales, and it will not cross the ceiling the visitor stated even when the seller would
// have accepted more room. Every number below is derived deterministically from (listing, target
// ceiling, style) — no Math.random, no Date.now, no argument-less `new Date()`. Timestamps are a
// fixed lookup table, not wall-clock time.

export type StyleId = "patient" | "fast";

export type Listing = {
  id: string;
  name: string;
  category: string;
  glyph: string; // short mark used on the generative "photo" panel
  retail: number;
  ask: number;
  floor: number; // seller's true minimum — never shown to the visitor directly
  fair: number; // AI's comp-derived fair value
  compCount: number;
  matchPct: number;
  grade: string;
  verified: string;
  condition: string;
  kit: string;
  targetMin: number;
  targetMax: number;
  targetStep: number;
  targetDefault: number;
};

export type Style = {
  id: StyleId;
  label: string;
  blurb: string;
  fractions: number[]; // cumulative concession fraction reached by each round
};

export type Message = {
  id: string;
  from: "agent" | "seller";
  time: string;
  text: string;
  amount: number;
  tag?: string; // agent-only reasoning tag, revealed on hover/focus
};

export type Outcome = {
  dealMade: boolean;
  price: number | null;
  savingsVsAsk: number;
  savingsVsAskPct: number;
  savingsVsRetailPct: number;
  ceilingHeadroomPct: number; // % of the ceiling left unspent when a deal closes
  gapToFloor: number; // when no deal: how much the ceiling would need to rise
  note: string;
};

export const STYLES: Style[] = [
  {
    id: "patient",
    label: "Patient",
    blurb: "Three rounds, small moves — holds out for fair value.",
    fractions: [0.4, 0.7, 1.0],
  },
  {
    id: "fast",
    label: "Fast close",
    blurb: "Two rounds, bigger moves — trades a little value for speed.",
    fractions: [0.55, 1.0],
  },
];

export const LISTINGS: Listing[] = [
  {
    id: "meridian",
    name: "Meridian A7",
    category: "Mirrorless camera",
    glyph: "A7",
    retail: 2400,
    ask: 1180,
    floor: 940,
    fair: 1030,
    compCount: 16,
    matchPct: 94,
    grade: "B+",
    verified: "Serial verified",
    condition: "light marks, shutter tested at 4,200 actuations",
    kit: "body, battery, one lens",
    targetMin: 800,
    targetMax: 1180,
    targetStep: 25,
    targetDefault: 1050,
  },
  {
    id: "continuum",
    name: "Continuum 14",
    category: "Ultralight laptop",
    glyph: "C14",
    retail: 2180,
    ask: 1090,
    floor: 860,
    fair: 945,
    compCount: 21,
    matchPct: 90,
    grade: "B",
    verified: "Serial verified",
    condition: "light keyboard shine, screen mint, battery at 91%",
    kit: "charger included, no original box",
    targetMin: 700,
    targetMax: 1090,
    targetStep: 25,
    targetDefault: 980,
  },
  {
    id: "basalt",
    name: "Basalt Turntable",
    category: "Belt-drive turntable",
    glyph: "BT",
    retail: 890,
    ask: 460,
    floor: 350,
    fair: 385,
    compCount: 11,
    matchPct: 88,
    grade: "B+",
    verified: "Owner ID verified",
    condition: "new stylus fitted, faint mark on the plinth base",
    kit: "dust cover, original cartridge",
    targetMin: 280,
    targetMax: 460,
    targetStep: 20,
    targetDefault: 400,
  },
];

const TIME_TABLE = ["14:02", "14:03", "14:05", "14:06", "14:08", "14:09", "14:11"];

export function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function money(n: number): string {
  const v = Math.round(n);
  const sign = v < 0 ? "-" : "";
  return sign + "$" + Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.retail - listing.ask) / listing.retail) * 100);
}

export function styleOf(id: StyleId): Style {
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}

function naturalSettle(listing: Listing): number {
  return round5(clamp(listing.fair * 0.96, listing.floor, listing.ask));
}

/** Anchor the agent's opening offer safely below whatever the eventual settle number is. */
function anchorFor(listing: Listing, settle: number): number {
  const raw = round5(listing.floor + (listing.fair - listing.floor) * 0.3);
  return clamp(raw, listing.floor, Math.max(listing.floor, settle - 10));
}

export type Transcript = {
  messages: Message[];
  outcome: Outcome;
};

const AGENT_TAGS_DEAL = [
  "Anchored to comp sales",
  "Condition-grade adjusted",
  "Verification + kit factored",
];
const AGENT_TAGS_NO_DEAL = ["Opens under ceiling", "Steps toward ceiling", "Ceiling reached"];

export function negotiate(listing: Listing, target: number, styleId: StyleId): Transcript {
  const style = styleOf(styleId);
  const rounds = style.fractions.length;
  const dealPossible = target >= listing.floor;
  const messages: Message[] = [];
  let t = 0;

  messages.push({
    id: "open",
    from: "seller",
    time: TIME_TABLE[t++] ?? "14:02",
    text: `${money(listing.ask)} for the ${listing.name} — ${listing.condition}. Comes with ${listing.kit}.`,
    amount: listing.ask,
  });

  if (dealPossible) {
    const settle = clamp(Math.min(naturalSettle(listing), target), listing.floor, listing.ask);
    const anchor = anchorFor(listing, settle);

    for (let i = 0; i < rounds; i++) {
      const frac = style.fractions[i];
      const isLast = i === rounds - 1;
      const buyerOffer = round5(anchor + (settle - anchor) * frac);
      const sellerOffer = round5(listing.ask - (listing.ask - settle) * frac);
      const tag = AGENT_TAGS_DEAL[Math.min(i, AGENT_TAGS_DEAL.length - 1)];

      const buyerText = isLast
        ? `${money(buyerOffer)} — last move, based on the verified ${listing.grade} grade.`
        : i === 0
          ? `I can start at ${money(buyerOffer)}. That's anchored to ${listing.compCount} comparable sales averaging ${money(listing.fair)}.`
          : `${money(buyerOffer)}, factoring the ${listing.grade} grade and ${listing.verified.toLowerCase()}.`;

      messages.push({
        id: `agent-${i}`,
        from: "agent",
        time: TIME_TABLE[t++] ?? "14:02",
        text: buyerText,
        amount: buyerOffer,
        tag,
      });

      const sellerText = isLast
        ? `${money(sellerOffer)}. Deal.`
        : i === 0
          ? `${money(sellerOffer)} is more realistic for a ${listing.grade}-grade unit.`
          : `${money(sellerOffer)}. That's close to my number.`;

      messages.push({
        id: `seller-${i}`,
        from: "seller",
        time: TIME_TABLE[t++] ?? "14:02",
        text: sellerText,
        amount: sellerOffer,
      });
    }

    const savingsVsAsk = listing.ask - settle;
    const outcome: Outcome = {
      dealMade: true,
      price: settle,
      savingsVsAsk,
      savingsVsAskPct: Math.round((savingsVsAsk / listing.ask) * 100),
      savingsVsRetailPct: Math.round(((listing.retail - settle) / listing.retail) * 100),
      ceilingHeadroomPct: Math.max(0, Math.round(((target - settle) / target) * 100)),
      gapToFloor: 0,
      note: `Settled ${money(settle)} — ${Math.round(
        ((target - settle) / target) * 100,
      )}% under your ${money(target)} ceiling.`,
    };
    return { messages, outcome };
  }

  // No deal: ceiling sits below the seller's floor. Agent still negotiates up to the ceiling,
  // seller still concedes toward their floor, but the two never meet.
  const openND = clamp(round5(target * 0.9), 0, target);
  for (let i = 0; i < rounds; i++) {
    const frac = style.fractions[i];
    const isLast = i === rounds - 1;
    const buyerOffer = round5(openND + (target - openND) * frac);
    const sellerOffer = round5(listing.ask - (listing.ask - listing.floor) * frac);
    const tag = AGENT_TAGS_NO_DEAL[Math.min(i, AGENT_TAGS_NO_DEAL.length - 1)];

    const buyerText = isLast
      ? `${money(buyerOffer)} is as high as I can go — that's your ceiling.`
      : i === 0
        ? `I can start at ${money(buyerOffer)}, anchored to ${listing.compCount} comparable sales.`
        : `${money(buyerOffer)}, moving toward your ceiling.`;

    messages.push({
      id: `agent-${i}`,
      from: "agent",
      time: TIME_TABLE[t++] ?? "14:02",
      text: buyerText,
      amount: buyerOffer,
      tag,
    });

    const sellerText = isLast
      ? `${money(sellerOffer)} is my floor. Can't go lower than that.`
      : `${money(sellerOffer)}. Still moving, but not there yet.`;

    messages.push({
      id: `seller-${i}`,
      from: "seller",
      time: TIME_TABLE[t++] ?? "14:02",
      text: sellerText,
      amount: sellerOffer,
    });
  }

  const gap = listing.floor - target;
  const outcome: Outcome = {
    dealMade: false,
    price: null,
    savingsVsAsk: 0,
    savingsVsAskPct: 0,
    savingsVsRetailPct: 0,
    ceilingHeadroomPct: 0,
    gapToFloor: gap,
    note: `No deal — the seller's floor sits ${money(gap)} above your ${money(target)} ceiling.`,
  };
  return { messages, outcome };
}
