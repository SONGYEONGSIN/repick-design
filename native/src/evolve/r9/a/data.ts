// native/src/evolve/r8/a/data.ts — auto-native-r8 candidate a (Meetup Spot Picker).
//
// Deterministic dummy data: no Math.random / Date.now / argument-less new Date() anywhere.
// Every date and hour is a fixed literal string.
//
// The one thing that is NOT a literal here: walk minutes. They are COMPUTED from the fixed
// coordinates below, so the picture and the numbers can never disagree — a marker that sits
// halfway between the two people literally reads as an even split, and the shaded "even for
// both" band on the map is the exact level set of the same predicate the code classifies with
// (see fairBandOutline). Hand-authoring the minutes would let the map lie.

export interface Point {
  x: number;
  y: number;
}

export type OriginId = "home" | "work";
export type SlotId = "afternoon" | "evening" | "night";

export interface Origin {
  id: OriginId;
  label: string;
  area: string;
  point: Point;
}

export interface Slot {
  id: SlotId;
  label: string;
  long: string;
}

export interface Spot {
  id: string;
  /** Full name, used in the sheet. */
  name: string;
  /** Short name, used on the map where space is scarce. */
  short: string;
  kind: string;
  point: Point;
  address: string;
  landmark: string;
  attributes: string[];
  hoursLabel: string;
  open: Record<SlotId, boolean>;
  note: Record<SlotId, string>;
}

// ── The deal this screen belongs to ────────────────────────────────────────────
export const ORDER_REF = "Order #4821 · Sony WH-1000XM5";
export const PEER_NAME = "Jordan Lee";
export const PEER_SHORT = "Jordan";
export const PEER_AREA = "Seogyo-dong";
export const MEET_DATE = "Sat, Aug 22";

/** Where the other person starts from. Fixed — only your own starting point is switchable. */
export const PEER_POINT: Point = { x: 0.78, y: 0.22 };

/**
 * Map scale. Coordinates live in an abstract 0..1 square; one unit is about 1.7 km, and a
 * relaxed walk covers it in 22 minutes. No map SDK, no network — the canvas is drawn from
 * these numbers.
 */
export const MINUTES_PER_UNIT = 22;

/** A spot is "even for both" when the two walks are within this many minutes of each other. */
export const EVEN_GAP = 3;

export const ORIGIN_BY_ID: Record<OriginId, Origin> = {
  home: { id: "home", label: "Home", area: "Yeonnam-dong", point: { x: 0.16, y: 0.74 } },
  work: { id: "work", label: "Work", area: "Hongdae office", point: { x: 0.52, y: 0.16 } },
};

export const ORIGINS: Origin[] = [ORIGIN_BY_ID.home, ORIGIN_BY_ID.work];

export const SLOT_BY_ID: Record<SlotId, Slot> = {
  afternoon: { id: "afternoon", label: "2 PM", long: "Saturday 2 PM" },
  evening: { id: "evening", label: "7 PM", long: "Saturday 7 PM" },
  night: { id: "night", label: "10 PM", long: "Saturday 10 PM" },
};

export const SLOTS: Slot[] = [SLOT_BY_ID.afternoon, SLOT_BY_ID.evening, SLOT_BY_ID.night];

export const DEFAULT_ORIGIN: OriginId = "home";
export const DEFAULT_SLOT: SlotId = "evening";

// ── Candidate places ───────────────────────────────────────────────────────────
export const SPOTS: Spot[] = [
  {
    id: "s1",
    name: "Hapjeong Station Exit 4",
    short: "Hapjeong Exit 4",
    kind: "Subway exit",
    point: { x: 0.46, y: 0.5 },
    address: "Yanghwa-ro 21-gil, gate level",
    landmark: "Inside the gate beside the ticket machines. Stay on the paid side — there is a bench.",
    attributes: ["CCTV", "Staffed booth", "Indoor", "Step-free"],
    hoursLabel: "Open until 11:30 PM",
    open: { afternoon: true, evening: true, night: true },
    note: {
      afternoon: "The concourse is busy on Saturday afternoons — meet by the west pillar.",
      evening: "Rush hour thins out near 8 PM and the gate area stays lit.",
      night: "Last train is 11:40 PM. The staff booth is manned until close.",
    },
  },
  {
    id: "s2",
    name: "Mapo Police Station lobby",
    short: "Mapo Police",
    kind: "Police station",
    point: { x: 0.66, y: 0.66 },
    address: "31 Seogang-ro, public lobby",
    landmark: "Left of the front desk, at the marked safe-trade table.",
    attributes: ["Safe-trade zone", "Staffed 24h", "CCTV", "Indoor"],
    hoursLabel: "Open 24 hours",
    open: { afternoon: true, evening: true, night: true },
    note: {
      afternoon: "Quietest right after lunch — the desk handles walk-ins first.",
      evening: "Shift change at 8 PM, so expect a short wait at the desk.",
      night: "Lobby stays open and staffed all night. The safest of the five.",
    },
  },
  {
    id: "s3",
    name: "Cafe Norm, 2nd floor",
    short: "Cafe Norm",
    kind: "Cafe",
    point: { x: 0.4, y: 0.33 },
    address: "12 Donggyo-ro 27-gil, 2F",
    landmark: "Window seats at the top of the stairs. Two tables fit a large box.",
    attributes: ["Seating", "CCTV", "Indoor", "Power outlets"],
    hoursLabel: "Open until 9 PM",
    open: { afternoon: true, evening: true, night: false },
    note: {
      afternoon: "The second floor is half empty on Saturdays.",
      evening: "Fills up after 7 PM — the window seats go first.",
      night: "Closed. Last order is 8:30 PM.",
    },
  },
  {
    id: "s4",
    name: "Yeonnam 24h Mart",
    short: "Yeonnam Mart",
    kind: "Convenience store",
    point: { x: 0.14, y: 0.4 },
    address: "8 Seongmisan-ro 29-gil",
    landmark: "The bench outside the front window, under the awning.",
    attributes: ["Open 24h", "CCTV", "Bright at night"],
    hoursLabel: "Open 24 hours",
    open: { afternoon: true, evening: true, night: true },
    note: {
      afternoon: "The bench sits in full sun until about 4 PM.",
      evening: "Awning lights come on at dusk; the street stays busy.",
      night: "Bright all night, but there is nowhere to sit indoors.",
    },
  },
  {
    id: "s5",
    name: "Riverside Mall atrium",
    short: "Riverside Mall",
    kind: "Mall atrium",
    point: { x: 0.7, y: 0.4 },
    address: "1F atrium, north entrance",
    landmark: "By the information desk, under the skylight.",
    attributes: ["Security desk", "CCTV", "Indoor", "Seating"],
    hoursLabel: "Open until 9:30 PM",
    open: { afternoon: true, evening: true, night: false },
    note: {
      afternoon: "A weekend market runs in the atrium until 5 PM.",
      evening: "Quiet once the food court closes at 8 PM.",
      night: "Closed. The shutters come down at 9:30 PM.",
    },
  },
];

// ── City canvas (unit coordinates, drawn as plain rectangles — no map SDK) ──────
const BLOCK_SIZE = 0.3;
const BLOCK_XS = [-0.59, -0.23, 0.13, 0.49, 0.85, 1.21];
const BLOCK_YS = [-0.55, -0.19, 0.17, 0.53, 0.89, 1.25];

export interface Block {
  id: string;
  x: number;
  y: number;
  size: number;
}

/** City blocks; the gaps between them read as streets. Extends past the unit square so the
 *  grid still bleeds off every edge once it is scaled into a real device width. */
export const CITY_BLOCKS: Block[] = BLOCK_XS.flatMap((x) =>
  BLOCK_YS.map((y) => ({ id: `b${x}-${y}`, x, y, size: BLOCK_SIZE })),
);

/** A converted rail line running along the middle street — the corridor Exit 4 opens onto. */
export const PARK = { x: -0.7, y: 0.47, w: 2.4, h: 0.06, label: "Gyeongui Line Forest" };

// ── Geometry ───────────────────────────────────────────────────────────────────
export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function walkMinutes(a: Point, b: Point): number {
  return Math.max(1, Math.round(distance(a, b) * MINUTES_PER_UNIT));
}

export interface SpotReading {
  spot: Spot;
  /** Walking minutes from your selected starting point. */
  you: number;
  /** Walking minutes from the other person's fixed starting point. */
  peer: number;
  /** Difference of the two displayed figures. */
  gap: number;
  total: number;
  /**
   * Even for both. Decided on the raw distance rather than the rounded minutes so that this
   * flag and the band drawn by fairBandOutline are literally the same predicate.
   */
  even: boolean;
  open: boolean;
  note: string;
}

export function readSpot(spot: Spot, origin: Point, slot: SlotId): SpotReading {
  const dYou = distance(origin, spot.point);
  const dPeer = distance(PEER_POINT, spot.point);
  const you = Math.max(1, Math.round(dYou * MINUTES_PER_UNIT));
  const peer = Math.max(1, Math.round(dPeer * MINUTES_PER_UNIT));
  return {
    spot,
    you,
    peer,
    gap: Math.abs(you - peer),
    total: you + peer,
    even: Math.abs(dYou - dPeer) * MINUTES_PER_UNIT <= EVEN_GAP,
    open: spot.open[slot],
    note: spot.note[slot],
  };
}

export function readAll(origin: Point, slot: SlotId): SpotReading[] {
  return SPOTS.map((spot) => readSpot(spot, origin, slot));
}

function leastWalking(list: SpotReading[]): SpotReading | undefined {
  let out: SpotReading | undefined;
  for (const r of list) {
    if (!out || r.total < out.total || (r.total === out.total && r.gap < out.gap)) out = r;
  }
  return out;
}

/**
 * The house recommendation: among the spots that are open at the chosen hour AND even for
 * both people, the one with the least total walking. Falls back to "open" and then to
 * "anything" so the screen is never left without a proposal to argue for.
 */
export function recommend(readings: SpotReading[]): SpotReading | undefined {
  return (
    leastWalking(readings.filter((r) => r.open && r.even)) ??
    leastWalking(readings.filter((r) => r.open)) ??
    leastWalking(readings)
  );
}

/**
 * Outline of the "even for both" region, in unit coordinates.
 *
 * The set of points whose two walks differ by at most EVEN_GAP minutes is exactly the region
 * between the two branches of a hyperbola with the two people as its foci — a narrow band when
 * they are far apart, a wide wedge when they are close. Drawing a straight band instead would
 * be wrong in the second case (from Work the two starting points are 3 minutes apart, and the
 * true region flares open). Sampled with cosh/sinh, which is deterministic.
 */
export function fairBandOutline(a: Point, b: Point, samples = 24): Point[] {
  const half = distance(a, b) / 2;
  const reach = EVEN_GAP / MINUTES_PER_UNIT / 2;
  if (half <= reach) return []; // every point is even — there is no boundary to draw
  const conj = Math.sqrt(half * half - reach * reach);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const ux = (b.x - a.x) / (2 * half);
  const uy = (b.y - a.y) / (2 * half);
  const span = 3.2; // far enough that both ends leave the canvas at any device size
  const at = (t: number, side: number): Point => {
    const along = side * reach * Math.cosh(t);
    const across = conj * Math.sinh(t);
    return { x: mid.x + ux * along - uy * across, y: mid.y + uy * along + ux * across };
  };
  const out: Point[] = [];
  for (let i = 0; i <= samples; i += 1) out.push(at(-span + (2 * span * i) / samples, 1));
  for (let i = samples; i >= 0; i -= 1) out.push(at(-span + (2 * span * i) / samples, -1));
  return out;
}
