"use client";

import {
  DESKS,
  clock,
  duration,
  hourCoverage,
  isDeskOpen,
  localSegments,
  minutesOfShiftLeft,
  minutesUntilOpen,
  mod,
  type SendContext,
} from "./data";

const pct = (minutes: number) => `${((minutes / 1440) * 100).toFixed(2)}%`;

/**
 * The reader's own 24 hours, with every desk's shift drawn on it.
 *
 * Two things move over this strip: a fixed grey rule at the reference moment, and an amber rule at
 * the hour the reader picked. Both are drawn once, as an overlay across the whole block, so they
 * stay aligned with every track at every breakpoint — the tracks are always the full width of the
 * card and the row labels sit above them rather than beside them.
 *
 * The bars are decorative in the accessibility sense: each row states its window and its status in
 * words on the line above, and the coverage strip is followed by a sentence naming the hours with a
 * gap. Nothing here is carried by colour alone.
 */
export default function CoverageRibbon({ ctx }: { ctx: SendContext }) {
  const nowLocalMin = mod(ctx.nowAbsLocal, 1440);
  const sendLocalMin = mod(ctx.sendAbsLocal, 1440);
  const coverage = hourCoverage(ctx.offsetMin);
  const thinHours = coverage
    .map((count, hour) => ({ count, hour }))
    .filter((h) => h.count === 0)
    .map((h) => clock(h.hour * 60));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-sm font-normal text-zinc-300">
          One day, on your clock. Every time below is {ctx.zone.short}.
        </p>
        <p className="text-xs font-normal text-zinc-400">
          Grey rule: right now, {clock(nowLocalMin)}. Amber rule: the hour you picked,{" "}
          {clock(sendLocalMin)}
          {ctx.isTomorrow ? " tomorrow" : ""}.
        </p>
      </div>

      <div className="relative mt-6">
        <div className="space-y-5">
          <div aria-hidden="true" className="flex justify-between text-[11px] font-normal tabular-nums text-zinc-400">
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-sm font-semibold text-zinc-100">Desks on shift, hour by hour</h4>
              <p className="text-xs font-normal text-zinc-400">
                Shaded only if a desk covers the whole hour
              </p>
            </div>
            <div
              aria-hidden="true"
              className="mt-2 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-px"
            >
              {coverage.map((count, hour) => (
                <span
                  key={hour}
                  className={`h-6 rounded-[2px] ${
                    count === 0
                      ? "bg-zinc-900 ring-1 ring-inset ring-zinc-700"
                      : count === 1
                        ? "bg-amber-400/40"
                        : "bg-amber-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-400">
              {thinHours.length === 0
                ? "Every hour of your day is covered by at least one regional desk."
                : `Hours where part of the hour has no regional desk: ${thinHours.join(", ")}. The Sev-1 bridge carries ${thinHours.length === 1 ? "it" : "them"}.`}
            </p>
          </div>

          {DESKS.map((desk) => {
            const open = isDeskOpen(desk, ctx.sendUtcMin);
            const left = minutesOfShiftLeft(desk, ctx.sendUtcMin);
            const untilOpen = minutesUntilOpen(desk, ctx.sendUtcMin);
            const segments = localSegments(desk, ctx.offsetMin);
            const localOpen = clock(mod(desk.openUtc + ctx.offsetMin, 1440));
            const localClose = clock(mod(desk.closeUtc + ctx.offsetMin, 1440));

            return (
              <div key={desk.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-sm font-semibold text-zinc-100">
                    {desk.name}
                    <span className="ml-2 font-normal text-zinc-400">{desk.city}</span>
                  </h4>
                  <p className="text-xs font-normal tabular-nums text-zinc-300">
                    {desk.alwaysOn
                      ? "Open at every hour on this strip"
                      : `${localOpen} to ${localClose} your time`}
                    <span className="text-zinc-400">
                      {" · "}
                      {desk.alwaysOn
                        ? "always on"
                        : open
                          ? `on shift at ${clock(sendLocalMin)}, ${duration(left)} left`
                          : `closed at ${clock(sendLocalMin)}, opens in ${duration(untilOpen)}`}
                    </span>
                  </p>
                </div>
                <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-zinc-900 ring-1 ring-inset ring-zinc-800">
                  {segments.map((segment) => (
                    <span
                      key={`${desk.id}-${segment.start}`}
                      aria-hidden="true"
                      className={`absolute inset-y-0 transition-[left,width] duration-300 ease-out motion-reduce:transition-none ${
                        desk.alwaysOn
                          ? "bg-amber-400/20 ring-1 ring-inset ring-amber-400/70"
                          : open
                            ? "bg-amber-300"
                            : "bg-amber-400/45"
                      }`}
                      style={{ left: pct(segment.start), width: pct(segment.end - segment.start) }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-6">
          <span
            className="absolute inset-y-0 w-px bg-zinc-400/50"
            style={{ left: pct(nowLocalMin) }}
          />
          <span
            className="absolute inset-y-0 w-0.5 bg-amber-400 transition-[left] duration-200 ease-out motion-reduce:transition-none"
            style={{ left: pct(sendLocalMin) }}
          />
        </div>
      </div>

      <p className="mt-6 text-xs font-normal leading-relaxed text-zinc-400" style={{ fontFamily: "var(--font-display-mono)" }}>
        Shifts are fixed to standard time. We do not shuffle the rota for daylight saving, so the
        strip you are reading is the one the desks work to.
      </p>
    </div>
  );
}
