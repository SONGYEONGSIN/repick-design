/**
 * Formatting utilities. No `new Date()` anywhere — hours are plain decimal numbers (8, 9.5, 13 …)
 * formatted with simple arithmetic, and every calendar date on the page is one of the fixed literal
 * strings in data.ts. This keeps server and client renders identical (hydration-safe) without ever
 * touching the wall clock.
 */

/** Decimal 24h hour (e.g. 9.5) → "9:30 AM". */
export function formatHourLabel(hour: number): string {
  const h24 = Math.floor(hour);
  const minutes = Math.round((hour - h24) * 60);
  const period = h24 >= 12 ? "PM" : "AM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const mm = minutes === 0 ? "00" : String(minutes).padStart(2, "0");
  return `${h12}:${mm} ${period}`;
}

export function formatTimeRange(startHour: number, durationHours: number): string {
  return `${formatHourLabel(startHour)}–${formatHourLabel(startHour + durationHours)}`;
}

/** Compact range for narrow cells, e.g. "9–11a" / "1–3p". */
export function formatTimeRangeCompact(startHour: number, durationHours: number): string {
  const fmt = (h: number) => {
    const h24 = Math.floor(h);
    const period = h24 >= 12 ? "p" : "a";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    const minutes = Math.round((h - h24) * 60);
    return minutes === 0 ? `${h12}${period}` : `${h12}:${String(minutes).padStart(2, "0")}${period}`;
  };
  return `${fmt(startHour)}–${fmt(startHour + durationHours)}`;
}

export function formatHours(n: number): string {
  return Number.isInteger(n) ? `${n}h` : `${n.toFixed(1)}h`;
}

export function formatPercent(n: number): string {
  return `${n}%`;
}
