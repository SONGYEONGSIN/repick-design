// Deterministic dummy data — no Math.random / Date.now / argument-less new Date().
// Defect-rate figures are generated from fixed trigonometric formulas keyed on stable
// indices, then rounded to 2 decimals, so the output never changes between renders.

export type Period = 30 | 60 | 90;

export interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  threshold: number;
  periods: Record<Period, BoxStats>;
}

export interface Batch {
  id: string;
  vendorId: string;
  date: string;
  units: number;
  defectRate: number;
  status: "pass" | "watch" | "fail";
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const VENDOR_SEED: { id: string; name: string; category: string; base: number; spread: number; threshold: number }[] = [
  { id: "northline", name: "Northline Metals", category: "Stamped brackets", base: 1.8, spread: 0.9, threshold: 3.5 },
  { id: "kestrel", name: "Kestrel Components", category: "Fasteners", base: 4.4, spread: 1.6, threshold: 3.5 },
  { id: "argus", name: "Argus Circuits", category: "PCB assembly", base: 2.6, spread: 1.1, threshold: 3.5 },
  { id: "hallmark", name: "Hallmark Coatings", category: "Surface finish", base: 3.9, spread: 1.3, threshold: 3.5 },
  { id: "vantage", name: "Vantage Optics", category: "Lens modules", base: 1.2, spread: 0.5, threshold: 3.5 },
  { id: "orbit", name: "Orbit Plastics", category: "Injection molding", base: 2.1, spread: 0.8, threshold: 3.5 },
  { id: "solace", name: "Solace Textiles", category: "Straps & webbing", base: 5.1, spread: 1.8, threshold: 3.5 },
  { id: "ferro", name: "Ferro Dynamics", category: "Motor housings", base: 2.9, spread: 1.0, threshold: 3.5 },
];

const PERIODS: Period[] = [30, 60, 90];

function statsFor(base: number, spread: number, periodIdx: number, vendorIdx: number): BoxStats {
  const drift = Math.sin(vendorIdx * 1.7 + periodIdx * 0.6) * 0.35;
  const median = round2(base + drift);
  const q1 = round2(median - spread * (0.45 + 0.05 * Math.cos(vendorIdx)));
  const q3 = round2(median + spread * (0.5 + 0.05 * Math.sin(periodIdx + vendorIdx)));
  const min = round2(Math.max(0, q1 - spread * 0.6));
  const max = round2(q3 + spread * 0.7);
  return { min, q1, median, q3, max };
}

export const VENDORS: Vendor[] = VENDOR_SEED.map((seed, vendorIdx) => {
  const periods = {} as Record<Period, BoxStats>;
  PERIODS.forEach((p, periodIdx) => {
    periods[p] = statsFor(seed.base, seed.spread, periodIdx, vendorIdx);
  });
  return { id: seed.id, name: seed.name, category: seed.category, threshold: seed.threshold, periods };
});

const BATCH_DATES = [
  "Jan 06", "Jan 20", "Feb 03", "Feb 17", "Mar 03", "Mar 17", "Mar 31", "Apr 14", "Apr 28", "May 12",
];

function statusFor(rate: number, threshold: number): Batch["status"] {
  if (rate >= threshold + 1) return "fail";
  if (rate >= threshold) return "watch";
  return "pass";
}

export const BATCHES: Batch[] = VENDORS.flatMap((vendor, vendorIdx) =>
  BATCH_DATES.map((date, batchIdx) => {
    const wobble = Math.sin(vendorIdx * 2.3 + batchIdx * 0.9) * 1.1;
    const rate = round2(Math.max(0.1, vendor.periods[90].median + wobble * 0.6));
    const units = 400 + ((vendorIdx * 37 + batchIdx * 53) % 260);
    return {
      id: `${vendor.id}-${batchIdx + 1}`,
      vendorId: vendor.id,
      date,
      units,
      defectRate: rate,
      status: statusFor(rate, vendor.threshold),
    };
  })
);

export function batchesFor(vendorId: string): Batch[] {
  return BATCHES.filter((b) => b.vendorId === vendorId);
}

// Fixed-shape sparkline series per vendor (last 10 batches' defect rate), used by the
// inspector panel's trend line. Derived directly from BATCHES so it stays in sync.
export function trendFor(vendorId: string): number[] {
  return batchesFor(vendorId).map((b) => b.defectRate);
}
