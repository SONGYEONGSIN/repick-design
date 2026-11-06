// Pure, deterministic math for the "Pulse" verification-confidence waveform device.
// No Math.random(), no Date.now(), no new Date() — every coordinate is a fixed function of the
// toggle state (`active`) and the constants below, rounded to 2 decimals so server and client
// render byte-identical path strings and hydration never mismatches.

export type CheckId =
  | "condition"
  | "authenticity"
  | "sellerHistory"
  | "priceBenchmark"
  | "photoMatch";

export interface CheckConfig {
  id: CheckId;
  label: string;
  shortLabel: string;
  detail: string;
  /** Share of the composite score and share of the waveform's horizontal span. Sums to 1. */
  weight: number;
  /** Contribution to the composite score (0-100) when this check is switched on. */
  onScore: number;
  /** Contribution to the composite score (0-100) when this check is switched off. */
  offScore: number;
  /** Secondary-harmonic texture weight (0-1) — gives each check's band a distinct grain. */
  harmonic: number;
}

export const CHECKS: CheckConfig[] = [
  {
    id: "condition",
    label: "Condition Scan",
    shortLabel: "Condition",
    detail: "Wear, flaws and structural integrity read from the submitted photo set.",
    weight: 0.22,
    onScore: 96,
    offScore: 16,
    harmonic: 0.1,
  },
  {
    id: "authenticity",
    label: "Authenticity Check",
    shortLabel: "Authenticity",
    detail: "Stitching, hardware and material signatures matched against brand references.",
    weight: 0.24,
    onScore: 94,
    offScore: 16,
    harmonic: 0.3,
  },
  {
    id: "sellerHistory",
    label: "Seller History",
    shortLabel: "Seller",
    detail: "Return rate, response time and listing accuracy on record for this seller.",
    weight: 0.18,
    onScore: 90,
    offScore: 16,
    harmonic: 0.15,
  },
  {
    id: "priceBenchmark",
    label: "Price Benchmark",
    shortLabel: "Price fit",
    detail: "Asking price checked against recent resale of the same model and condition.",
    weight: 0.16,
    onScore: 88,
    offScore: 16,
    harmonic: 0.22,
  },
  {
    id: "photoMatch",
    label: "Photo Match",
    shortLabel: "Photo match",
    detail: "Submitted photos checked frame-by-frame against the written description.",
    weight: 0.2,
    onScore: 93,
    offScore: 16,
    harmonic: 0.18,
  },
];

export type ActiveChecks = Record<CheckId, boolean>;

export const DEFAULT_ACTIVE: ActiveChecks = {
  condition: true,
  authenticity: true,
  sellerHistory: true,
  priceBenchmark: true,
  photoMatch: true,
};

const WIDTH = 800;
const HEIGHT = 168;
const BASELINE = 84;
const MAX_AMP = 52;
const CYCLES = 16;
const STEP = 5;

/** Horizontal span each check owns, proportional to its weight. Mirrors the toggle row widths. */
const SEGMENTS: { check: CheckConfig; start: number; end: number }[] = (() => {
  let cursor = 0;
  const segs = CHECKS.map((check) => {
    const start = cursor;
    cursor += check.weight * WIDTH;
    return { check, start, end: cursor };
  });
  segs[segs.length - 1].end = WIDTH;
  return segs;
})();

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function segmentAt(x: number) {
  for (const seg of SEGMENTS) {
    if (x < seg.end) return seg;
  }
  return SEGMENTS[SEGMENTS.length - 1];
}

function boxcar(values: number[], radius: number): number[] {
  const out = new Array(values.length);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = i + k;
      if (j >= 0 && j < values.length) {
        sum += values[j];
        count += 1;
      }
    }
    out[i] = sum / count;
  }
  return out;
}

/** Weighted composite verification confidence, 0-100, rounded to an integer. */
export function computeComposite(active: ActiveChecks): number {
  const raw = CHECKS.reduce(
    (sum, check) => sum + check.weight * (active[check.id] ? check.onScore : check.offScore),
    0,
  );
  return Math.round(raw);
}

/**
 * repick's suggested offer floor for a listing, derived purely from the composite confidence
 * score above — not a market refresh, the same formula run again against the live toggle state.
 */
export function computeOfferFloor(composite: number, listedPrice: number): number {
  return Math.round(listedPrice * (0.6 + 0.4 * (composite / 100)));
}

interface Point {
  x: number;
  y: number;
}

/** Builds the SVG `d` path for the waveform, as a smooth Catmull-Rom spline through N samples. */
export function buildWavePath(active: ActiveChecks): string {
  const sampleCount = Math.floor(WIDTH / STEP) + 1;
  const rawScore: number[] = new Array(sampleCount);
  const rawHarm: number[] = new Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const x = i * STEP;
    const seg = segmentAt(x);
    rawScore[i] = active[seg.check.id] ? seg.check.onScore : seg.check.offScore;
    rawHarm[i] = seg.check.harmonic;
  }

  const smoothScore = boxcar(rawScore, 2);
  const smoothHarm = boxcar(rawHarm, 2);

  const points: Point[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const x = i * STEP;
    const angle = (2 * Math.PI * CYCLES * x) / WIDTH;
    const ampPx = (smoothScore[i] / 100) * MAX_AMP;
    const harm = smoothHarm[i];
    const y =
      BASELINE - ampPx * Math.sin(angle) - ampPx * harm * 0.3 * Math.sin(2 * angle + 0.6);
    points.push({ x: round2(x), y: round2(y) });
  }

  const n = points.length;
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, n - 1)];
    const cp1x = round2(p1.x + (p2.x - p0.x) / 6);
    const cp1y = round2(p1.y + (p2.y - p0.y) / 6);
    const cp2x = round2(p2.x - (p3.x - p1.x) / 6);
    const cp2y = round2(p2.y - (p3.y - p1.y) / 6);
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export const WAVE_VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`;
export const WAVE_BASELINE = BASELINE;
export const WAVE_WIDTH = WIDTH;
export const WAVE_HEIGHT = HEIGHT;
