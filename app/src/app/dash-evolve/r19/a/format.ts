/** Renders a decimal hour (13.5 → "1:30 PM") without touching `Date` — every booking time in this
 *  route is a plain number, so formatting is pure arithmetic and stays deterministic. */
export function formatHour(hour: number): string {
  const totalMinutes = Math.round(hour * 60);
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatTimeRange(startHour: number, durationHours: number): string {
  return `${formatHour(startHour)}–${formatHour(startHour + durationHours)}`;
}

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return NUMBER_FORMAT.format(n);
}

const PERCENT_FORMAT = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
export function formatPercent(pct: number): string {
  return PERCENT_FORMAT.format(pct / 100);
}

const HOURS_FORMAT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
export function formatHours(h: number): string {
  return `${HOURS_FORMAT.format(h)} hrs`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
