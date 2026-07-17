// Two-proportion z-test, computed with plain arithmetic so results stay
// deterministic across renders. Standard Abramowitz & Stegun 7.1.26 erf
// approximation — no external stats library needed for a dummy dashboard.

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export interface ZTestResult {
  rateA: number;
  rateB: number;
  diffPct: number; // percentage points, B - A
  upliftPct: number; // relative uplift of the leading side vs the trailing side
  se: number;
  zScore: number;
  pValue: number;
  significant: boolean;
  leader: "a" | "b" | "tie";
}

export function twoProportionZTest(
  visitorsA: number,
  conversionsA: number,
  visitorsB: number,
  conversionsB: number
): ZTestResult {
  const rateA = visitorsA > 0 ? conversionsA / visitorsA : 0;
  const rateB = visitorsB > 0 ? conversionsB / visitorsB : 0;
  const pooled =
    visitorsA + visitorsB > 0 ? (conversionsA + conversionsB) / (visitorsA + visitorsB) : 0;
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / visitorsA + 1 / visitorsB)) || 1e-9;
  const z = (rateB - rateA) / se;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  const leader: "a" | "b" | "tie" =
    Math.abs(rateA - rateB) < 0.0005 ? "tie" : rateB > rateA ? "b" : "a";
  const trailing = leader === "a" ? rateB : rateA;
  const leading = leader === "a" ? rateA : rateB;
  const upliftPct = leader === "tie" || trailing <= 0 ? 0 : ((leading - trailing) / trailing) * 100;
  return {
    rateA: rateA * 100,
    rateB: rateB * 100,
    diffPct: (rateB - rateA) * 100,
    upliftPct,
    se,
    zScore: z,
    pValue,
    significant: pValue < 0.05,
    leader,
  };
}

// Single-proportion 95% confidence interval (Wald), in percentage points.
export function confidenceInterval95(rate: number, visitors: number): [number, number] {
  const p = rate / 100;
  const margin = visitors > 0 ? 1.96 * Math.sqrt((p * (1 - p)) / visitors) * 100 : 0;
  return [Math.max(0, rate - margin), Math.min(100, rate + margin)];
}
