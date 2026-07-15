// 결정론적 포맷터 — 난수·현재시각 기반 동적 값 사용 금지. 전달받은 값만 포맷한다.
// 서버·클라이언트 렌더 결과가 항상 동일해 하이드레이션이 안정적이다.

const numberFormatter = new Intl.NumberFormat("ko-KR");
const compactFormatter = new Intl.NumberFormat("ko-KR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const krwFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});
const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 큰 수치를 한국어 축약(예: 2.8M → 284만)으로. 히어로/칩 보조 표기용. */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function formatKRW(value: number): string {
  // ₩ 글리프는 Pretendard(tabular-nums)로 렌더 — Geist Mono엔 ₩ 글리프가 없다.
  return krwFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSigned(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

/** 수집 지연시간 — ms/초 단위로 사람이 읽기 쉽게. */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** 고정 기준시각(now) 대비 상대 시간 — 현재시각 미사용, 결정론적. */
export function formatRelative(date: Date, now: Date): string {
  const diffSec = Math.round((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 5) return "방금";
  if (diffSec < 60) return `${diffSec}초 전`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}일 전`;
}
