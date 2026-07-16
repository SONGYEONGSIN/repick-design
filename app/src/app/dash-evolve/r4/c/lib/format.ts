// 결정론적 숫자/날짜 포맷터 — Intl 기반, ko-KR 로케일. Math.random/Date.now/new Date() 사용 없음.

const numberFormatter = new Intl.NumberFormat("ko-KR");
const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" });

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** iso: "YYYY-MM-DD" 형태의 고정 문자열만 받는다 (동적 Date 생성 금지) */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** SVG 좌표용 — 하이드레이션 불일치 방지를 위해 소수 2자리로 반올림 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** "mm:ss" 형태의 체류시간 문자열을 초 단위 정수로 변환 (정렬용) */
export function parseDurationToSeconds(duration: string): number {
  const [m, s] = duration.split(":").map((n) => parseInt(n, 10));
  return m * 60 + s;
}
