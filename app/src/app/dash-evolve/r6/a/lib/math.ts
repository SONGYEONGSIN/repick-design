/**
 * 결정론적 수학 유틸 — Math.random/Date.now 미사용.
 * SVG 좌표는 반드시 이 round2를 거쳐 소수 2자리로 반올림한다(하이드레이션 안전).
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
