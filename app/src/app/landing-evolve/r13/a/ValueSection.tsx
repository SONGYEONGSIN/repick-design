import Reveal from "./Reveal";
import Radar from "./Radar";
import {
  VALUE_PARTS,
  LISTINGS,
  DEFAULT_SELECTED,
  WEIGHT_LEVELS,
  DEFAULT_LEVEL,
  idealProfile,
  matchPercent,
  listingVector,
  cx,
  EYEBROW,
  CAPTION,
  STAT,
} from "./data";

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

/**
 * Value in three parts, each tied to the radar mechanic itself (shape → overlap → re-sort). The
 * left figure is one frozen frame of that mechanic — the same boots card the hero ranks, drawn with
 * the default Balanced / Price·Condition·Authenticity profile — so the abstraction on the right has a
 * concrete referent beside it. Scroll reveals are gated in `Reveal`.
 */
export default function ValueSection() {
  const level = WEIGHT_LEVELS.find((l) => l.id === DEFAULT_LEVEL) ?? WEIGHT_LEVELS[1];
  const ideal = idealProfile(DEFAULT_SELECTED, level.demand);
  const item = LISTINGS[0];
  const match = matchPercent(listingVector(item), ideal);

  return (
    <section id="value" aria-labelledby="value-title" className="border-b border-white/10 bg-[#0B0B0F] py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* left — the mechanic, frozen */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className={cx(EYEBROW, "text-[#fbbf24]")}>One score, fully shown</p>
            <h2
              id="value-title"
              style={GROTESK}
              className="mt-3 text-[clamp(1.8rem,4.4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.015em] text-white"
            >
              A match you can see the geometry of.
            </h2>
            <figure className="mt-8 max-w-[380px] rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="group mx-auto h-52 w-52">
                <Radar listingValues={listingVector(item)} idealValues={ideal} match={match} />
              </div>
              <figcaption className={cx(CAPTION, "mt-4 text-[#A1A1AA]")}>
                Fig. 1 — {item.title}, {match}% match at Balanced weight. Amber is
                the buyer&apos;s ideal; the pale shape is the item.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* right — three parts */}
        <div className="lg:col-span-7 lg:pt-6">
          <ol className="flex flex-col gap-10">
            {VALUE_PARTS.map((part, i) => {
              const Icon = part.icon;
              return (
                <Reveal key={part.kicker} delay={i * 0.06}>
                  <li className="flex gap-5">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b45309]/40 bg-[#b45309]/10 text-[#fbbf24]"
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className={cx(STAT, "text-[#fbbf24]")}>
                        {String(i + 1).padStart(2, "0")} · {part.kicker}
                      </p>
                      <h3 style={GROTESK} className="mt-1 text-xl font-extrabold tracking-[-0.01em] text-white sm:text-2xl">
                        {part.title}
                      </h3>
                      <p className="mt-2 max-w-[460px] text-[0.95rem] font-normal leading-[1.65] text-[#A1A1AA]">
                        {part.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
