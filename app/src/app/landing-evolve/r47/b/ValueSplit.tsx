import { CHECKPOINTS } from "./checkpoint-data";
import { formatRange, type Verdict } from "./checkpoint-math";
import { Reveal } from "./Reveal";
import { CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, PROSE_WIDTH_14, ACCENT_TEXT } from "./tokens";

/**
 * "Manipulation = felt value": this section exists to say, in words, what the hero already
 * demonstrated — every confirm/flag/undo on a checkpoint card recomputes the trust score and
 * the price range live. The two numbers quoted in column two and three are read straight off
 * the same Verdict object the deck produced, not restated as fixed copy.
 */
export function ValueSplit({ verdict }: { verdict: Verdict }) {
  return (
    <section className="border-b border-zinc-200 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px]">
        <p className={`${CAPTION} ${ACCENT_TEXT}`}>How the run works</p>
        <h2 id="value-heading" className={`${DISPLAY} mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-zinc-900`}>
          Three things happen on every card you touch.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Reveal className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`${DISPLAY} text-3xl font-extrabold ${GHOST_TEXT}`}>
                01
              </p>
              <h3 className="text-lg font-semibold text-zinc-900">Four fixed checks, not a vibe</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Condition, authenticity, damage and function — the same four checks on every
                listing on repick, each carrying its own AI baseline score before anyone
                touches it.
              </p>
              <ul className="mt-1 flex flex-col gap-1.5">
                {CHECKPOINTS.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                    <c.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`${DISPLAY} text-3xl font-extrabold ${GHOST_TEXT}`}>
                02
              </p>
              <h3 className="text-lg font-semibold text-zinc-900">Your trust score moves live</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Confirm a card and its score ticks up. Flag one and it drops hard. No submit
                button, no waiting on a queue — the deck above reads{" "}
                <span className="font-semibold tabular-nums text-zinc-900">{verdict.avgScore}/100</span> right
                now, from {verdict.resolvedCount} of {verdict.total} checkpoints you&apos;ve resolved.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3">
              <p aria-hidden="true" className={`${DISPLAY} text-3xl font-extrabold ${GHOST_TEXT}`}>
                03
              </p>
              <h3 className="text-lg font-semibold text-zinc-900">The price range tightens with you</h3>
              <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
                The resale estimate is a direct function of that same score — not three fixed
                buckets. At Grade {verdict.gradeLetter}, this unit is currently reading{" "}
                <span className="font-semibold tabular-nums text-zinc-900">
                  {formatRange(verdict.priceLow, verdict.priceHigh)}
                </span>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
