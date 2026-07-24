/**
 * 포맷 유틸. 숫자는 Intl.NumberFormat(ko-KR) 사용, 시간류는 tabular-nums와
 * 조합해 렌더한다. 전부 순수 함수(Date.now/Math.random 미사용).
 */

const numberFormatter = new Intl.NumberFormat("ko-KR");
const percentFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

/** 초 → "4분 12초" / "1시간 08분" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}시간 ${String(remMinutes).padStart(2, "0")}분`;
  }
  return `${minutes}분 ${String(seconds).padStart(2, "0")}초`;
}

/** 분 → "12분" / "1시간 08분" (대기시간 등, 초 단위 불필요) */
export function formatWaitMinutes(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const remMinutes = totalMinutes % 60;
    return `${hours}시간 ${String(remMinutes).padStart(2, "0")}분`;
  }
  return `${totalMinutes}분`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

/** 소수 2자리 반올림 — SVG 좌표 하이드레이션 안정용. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
