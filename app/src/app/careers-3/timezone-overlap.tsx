import { hourToPct, overlapHours, type Office } from "./data";

/**
 * A deterministic, data-driven horizontal timeline per office: a UTC track (0-24h), the office's
 * own working-hours band in amber, and — layered on top — the hours that actually overlap with HQ
 * (Austin) in solid amber, with HQ's own band traced as a thin outline for reference. Every number
 * comes from the fixed `workStart`/`workEnd` integers in data.ts; nothing reads the visitor's or
 * server's clock. The bar is decorative reinforcement only — the same fact ("3h overlap with HQ" /
 * "Home base" / "No live overlap") is always stated in text right above it, so color never carries
 * meaning alone.
 */
export default function TimezoneOverlap({ offices, hq }: { offices: Office[]; hq: Office }) {
  const hqStartPct = hourToPct(hq.workStart);
  const hqWidthPct = hourToPct(hq.workEnd) - hqStartPct;

  return (
    <div className="space-y-5">
      {offices.map((office) => {
        const isHq = office.id === hq.id;
        const overlap = overlapHours(hq, office);
        const officeStartPct = hourToPct(office.workStart);
        const officeWidthPct = hourToPct(office.workEnd) - officeStartPct;
        const overlapStartHour = Math.max(hq.workStart, office.workStart);
        const overlapEndHour = Math.min(hq.workEnd, office.workEnd);
        const overlapStartPct = hourToPct(overlapStartHour);
        const overlapWidthPct = Math.max(0, hourToPct(overlapEndHour) - overlapStartPct);

        return (
          <div key={office.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-zinc-900">{office.city}</span>
              <span className="text-sm font-normal tabular-nums text-zinc-600">
                {isHq ? "Home base" : overlap > 0 ? `${overlap}h overlap with HQ` : "No live overlap — async handoff"}
              </span>
            </div>
            <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
              <div
                className="absolute inset-y-0 rounded-full bg-amber-200"
                style={{ left: `${officeStartPct}%`, width: `${officeWidthPct}%` }}
              />
              {!isHq && (
                <div
                  className="absolute inset-y-0 border-x-2 border-zinc-900/40"
                  style={{ left: `${hqStartPct}%`, width: `${hqWidthPct}%` }}
                />
              )}
              {overlapWidthPct > 0 && (
                <div
                  className="absolute inset-y-0 rounded-full bg-amber-600"
                  style={{ left: `${overlapStartPct}%`, width: `${overlapWidthPct}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-between text-xs font-normal tabular-nums text-zinc-500" aria-hidden="true">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00 UTC</span>
      </div>
    </div>
  );
}
