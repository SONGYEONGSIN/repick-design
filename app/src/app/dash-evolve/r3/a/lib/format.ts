export const numberFormatter = new Intl.NumberFormat("en-US");
export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});
export const hoursFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function dayToPercent(day: number, totalDays: number): number {
  return Math.round((day / totalDays) * 10000) / 100;
}

export function formatDayRange(startDay: number, durationDays: number, weeks: { index: number; label: string; startDay: number }[]): string {
  const endDay = startDay + durationDays - 1;
  const startLabel = dayOffsetToLabel(startDay, weeks);
  const endLabel = dayOffsetToLabel(endDay, weeks);
  return `${startLabel} – ${endLabel}`;
}

// Approximate a human label for an arbitrary day offset by locating the nearest week tick.
export function dayOffsetToLabel(day: number, weeks: { index: number; label: string; startDay: number }[]): string {
  let closest = weeks[0];
  for (const w of weeks) {
    if (w.startDay <= day) closest = w;
  }
  const diff = day - closest.startDay;
  if (diff === 0) return closest.label;
  return `${closest.label} +${diff}d`;
}
