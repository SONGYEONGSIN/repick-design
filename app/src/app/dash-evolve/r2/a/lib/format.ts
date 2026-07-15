// 결정론적 포맷터 — 난수·현재시각 기반 동적 값 사용 금지. 전달받은 값만 포맷한다.

const numberFormatter = new Intl.NumberFormat("ko-KR");
const compactFormatter = new Intl.NumberFormat("ko-KR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 큰 수치를 한국어 축약(예: 68,900 → 6.9만)으로. 카드/칩 보조 표기용. */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSigned(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** "2026-07-15" → "7월 15일" */
export function formatDateKo(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}

/** "2026-07-15" → "7/15" (표 등 좁은 공간용, tabular-nums와 함께 사용). */
export function formatDateShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
}
