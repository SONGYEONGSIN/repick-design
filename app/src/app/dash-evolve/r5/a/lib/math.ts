/**
 * 결정론적 수학 유틸 — Math.random/Date.now 미사용.
 * 차트 좌표는 반드시 이 round2를 거쳐 소수 2자리로 반올림한다(하이드레이션 안전).
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 시드 기반 결정론적 파형 — 같은 seed/index면 항상 같은 값. 난수 없음. */
export function wave(seed: number, i: number, n: number): number {
  const t = n <= 1 ? 0 : i / (n - 1);
  return (
    Math.sin(seed + t * Math.PI * 2.4) * 0.55 +
    Math.sin(seed * 1.6 + t * Math.PI * 5.3) * 0.3 +
    Math.cos(seed * 0.7 + t * Math.PI * 1.1) * 0.15
  );
}

const MONTH_LEN_2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** month(1-12)/day에서 n일 이전의 {month, day}를 순수 산술로 계산(Date 객체 미사용). */
export function stepBackDays(month: number, day: number, n: number): { month: number; day: number } {
  let m = month;
  let d = day;
  for (let i = 0; i < n; i++) {
    d -= 1;
    if (d < 1) {
      m -= 1;
      if (m < 1) m = 12;
      d = MONTH_LEN_2026[m - 1];
    }
  }
  return { month: m, day: d };
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
