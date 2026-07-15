// 결정론적 숫자/날짜 포맷터 — Intl 기반, ko-KR 로케일
const numberFormatter = new Intl.NumberFormat("ko-KR");
const percentFormatter = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" });
const dateWeekdayFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

/** iso: "YYYY-MM-DD" 형태의 고정 문자열만 받는다 (동적 Date 생성 금지) */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

export function formatDateLong(iso: string): string {
  return dateWeekdayFormatter.format(new Date(`${iso}T00:00:00`));
}
