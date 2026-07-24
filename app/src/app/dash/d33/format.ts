/**
 * 포맷 유틸. 날짜는 'YYYY-MM-DD' ISO 문자열을 UTC 앵커로 파싱해
 * 서버(UTC)/클라이언트(로컬 tz) 렌더가 갈리지 않게 한다(하이드레이션 안정).
 * 통화는 ₩ 글리프가 있는 Pretendard(전역 font-sans) + tabular-nums로 렌더한다
 * (Geist Mono엔 ₩ 글리프가 없으므로 금액에는 mono를 쓰지 않는다).
 */

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(parseISODate(iso));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 한국식 압축 통화 표기: ₩1.6억 / ₩4,800만 / ₩9,600 */
export function formatKRWCompact(value: number): string {
  if (value >= 100_000_000) {
    const eok = Math.round((value / 100_000_000) * 10) / 10;
    return `₩${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }
  if (value >= 10_000) {
    const man = Math.round(value / 10_000);
    return `₩${numberFormatter.format(man)}만`;
  }
  return `₩${numberFormatter.format(value)}`;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function dayDiff(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO).getTime();
  const to = parseISODate(toISO).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

/** 오늘(todayISO) 기준 D-day 라벨. */
export function formatDday(todayISO: string, dueISO: string): string {
  const diff = dayDiff(todayISO, dueISO);
  if (diff === 0) return "D-DAY";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

/** 소수 2자리 반올림 — SVG 좌표 하이드레이션 안정용. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
