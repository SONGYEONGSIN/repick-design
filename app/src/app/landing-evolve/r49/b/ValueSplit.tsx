import { Reveal } from "./Reveal";
import { formatCount, formatUsd, percentChangeFromStart, periodLabel, weekAt } from "./data";
import { ACCENT_TINT_TEXT, CAPTION, GHOST_TEXT, INK_CLASS, MUTED_TEXT, PROSE_WIDTH_14 } from "./tokens";

/**
 * "Manipulation = felt value": this section says, in words, what the hero already demonstrated
 * — dragging the playhead recomputes matches found, average payout and items sold live. Columns
 * two and three read the numbers straight off the SAME week record the hero scrubber currently
 * points at, never a restated fixed copy, so this section stays correct for wherever the
 * playhead currently sits (including after a visitor has already dragged it).
 */
export function ValueSplit({ weekIndex }: { weekIndex: number }) {
  const current = weekAt(weekIndex);
  const delta = percentChangeFromStart(weekIndex, "matchesFound");
  const label = periodLabel(weekIndex);

  return (
    <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px]">
        <p className={`${CAPTION} ${ACCENT_TINT_TEXT}`}>How the scrubber works</p>
        <h2
          id="value-heading"
          className={`mt-2 text-[clamp(1.6rem,6vw,1.9rem)] lg:text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] ${INK_CLASS}`}
        >
          One playhead, twelve weeks, zero guessing.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Reveal className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                01
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>A fixed window, one point in it</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                The last 12 weeks never change. What changes is which single week you&apos;re
                looking at — drag the playhead left for history, right for right now, the same
                way you&apos;d scrub a video.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                02
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>Every number moves together</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Right now the playhead sits on {label}, reading{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{formatCount(current.matchesFound)} matches</span>,{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{formatCount(current.itemsSold)} items sold</span> and{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{formatUsd(current.avgPayout)}</span> average payout — all
                three from one drag.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                03
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>The trend is the proof, not a chart for its own sake</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Matches found are{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>
                  {delta >= 0 ? "up" : "down"} {Math.abs(delta)}%
                </span>{" "}
                versus 12 weeks ago at the point you&apos;ve selected — scrub further and that
                number recomputes again, live.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
