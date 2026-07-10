/**
 * 포맷 헬퍼 — 항상 명시적 로케일/타임존을 지정해 서버·클라이언트 렌더 결과가
 * 항상 동일하도록 한다 (hydration-safe, I01/I02/R01 대응).
 */

const KRW_FORMATTER = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const KRW_SIGNED_FORMATTER = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

const DATE_SHORT_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

const DATE_FULL_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "Asia/Seoul",
});

export function formatKRW(amount: number): string {
  return KRW_FORMATTER.format(amount);
}

export function formatSignedKRW(amount: number): string {
  return KRW_SIGNED_FORMATTER.format(amount);
}

export function formatDateShort(date: Date): string {
  return DATE_SHORT_FORMATTER.format(date);
}

export function formatDateFull(date: Date): string {
  return DATE_FULL_FORMATTER.format(date);
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}
