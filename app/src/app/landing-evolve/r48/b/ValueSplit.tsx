import { Reveal } from "./Reveal";
import { formatDays, formatUsd, type PathSummary } from "./trade-math";
import { ACCENT_TEXT, CAPTION, GHOST_TEXT, INK_CLASS, MUTED_TEXT, PROSE_WIDTH_14 } from "./tokens";

/**
 * "Manipulation = felt value": this section says, in words, what the hero already demonstrated
 * — every click on a step node recomputes the headline payout and days-to-cash live. The two
 * numbers quoted in columns two and three are read straight off the same PathSummary object the
 * tree produced, never restated as fixed copy, so they stay correct for whatever path is
 * currently chosen.
 */
export function ValueSplit({ summary }: { summary: PathSummary }) {
  const payoutLine =
    summary.stage === "leaf"
      ? `${formatUsd(summary.leaf.payout)}, in ${formatDays(summary.leaf.days).toLowerCase()}`
      : `somewhere between ${formatUsd(summary.range.low)} and ${formatUsd(summary.range.high)}, once you pick a second step`;
  const branchLine = summary.branch.fullLabel;

  return (
    <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px]">
        <p className={`${CAPTION} ${ACCENT_TEXT}`}>How the simulator works</p>
        <h2
          id="value-heading"
          className={`mt-2 text-[clamp(1.6rem,6vw,1.9rem)] lg:text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] ${INK_CLASS}`}
        >
          Two clicks, and the number stops being a guess.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Reveal className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                01
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>Three fixed exit paths, not a vibe</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Sell now, list for the best offer, or trade in for credit — the same three
                methods on every listing, each with its own typical payout and wait before you
                touch anything.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                02
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>Your path narrows the range live</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Pick a method and the tree above lights up that branch — right now that reads{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{branchLine}</span>. A second
                click commits the exact outcome instead of a range.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`text-3xl font-extrabold ${GHOST_TEXT}`}>
                03
              </p>
              <h3 className={`text-lg font-semibold ${INK_CLASS}`}>The payout is a direct function of that path</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Not three fixed buckets — the headline number above is reading{" "}
                <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{payoutLine}</span>, derived
                straight from the two steps you just chose.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
