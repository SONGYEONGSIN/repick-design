/**
 * Formatting utilities. Numbers use Intl.NumberFormat(ko-KR); time values are
 * rendered together with tabular-nums. All pure functions (no Date.now/Math.random).
 */

const numberFormatter = new Intl.NumberFormat("en-US");
const percentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

/** seconds → "4m 12s" / "1h 08m" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}h ${String(remMinutes).padStart(2, "0")}m`;
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

/** minutes → "12m" / "1h 08m" (for wait times etc., seconds aren't needed) */
export function formatWaitMinutes(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const remMinutes = totalMinutes % 60;
    return `${hours}h ${String(remMinutes).padStart(2, "0")}m`;
  }
  return `${totalMinutes}m`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

/** Round to 2 decimal places — for stable SVG coordinate hydration. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
