/**
 * 날짜/숫자 포맷 유틸.
 * 모든 날짜는 'YYYY-MM-DD' ISO 문자열로 저장하고 UTC 앵커로 파싱한다.
 * 서버(UTC)와 클라이언트(로컬 tz)의 렌더 결과가 갈리지 않도록
 * Intl.DateTimeFormat에 timeZone: 'UTC'를 명시해 하이드레이션 불일치를 방지한다.
 */

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const dateFormatterWithWeekday = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function formatDate(iso: string): string {
  return dateFormatter.format(parseISODate(iso));
}

export function formatDateLong(iso: string): string {
  return dateFormatterWithWeekday.format(parseISODate(iso));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function dayDiff(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO).getTime();
  const to = parseISODate(toISO).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

/** 오늘(TODAY_ISO) 기준 D-day 라벨. */
export function formatDday(todayISO: string, dueISO: string): string {
  const diff = dayDiff(todayISO, dueISO);
  if (diff === 0) return "D-DAY";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}
