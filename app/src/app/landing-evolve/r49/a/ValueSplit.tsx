import { Percent, ShieldCheck, Target } from "lucide-react";
import Reveal from "./Reveal";
import type { SearchStats } from "./search-math";
import { ACCENT_TINT_TEXT, HEADLINE_FONT, MUTED_TEXT, PANEL_BORDER } from "./tokens";

interface ValueSplitProps {
  query: string;
  stats: SearchStats | null;
}

/**
 * Section 3: value in three parts — "manipulation = felt value". Every number on
 * this card is read live from the SAME ranked result set the hero search device
 * produces (passed down as `stats`, computed once in LandingClient), never a
 * hardcoded duplicate — so typing a narrower query up in the hero visibly moves
 * these three figures too. With nothing typed differently from the default, proof
 * is already on; the search just sharpens it.
 *
 * Intro paragraph width: 14px body text -> 0.44 * 14 = 6.16px/char ->
 * max-w-[430px] -> 430 / 6.16 ≈ 69.8 chars/line.
 */
export default function ValueSplit({ query, stats }: ValueSplitProps) {
  const trimmedQuery = query.trim() || "all listings";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2
          className="max-w-[460px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.01em] text-white sm:text-[32px]"
          style={HEADLINE_FONT}
        >
          Your search, scored three ways
        </h2>
        <p className={`mt-2 max-w-[430px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          Currently scoring “{trimmedQuery}” — change the search above and every
          number below recomputes from the same result set, live.
        </p>
      </Reveal>

      {stats === null ? (
        <Reveal delay={0.1} className="mt-8">
          <p className={`text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
            No current results to score — broaden the search above to see this update.
          </p>
        </Reveal>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Reveal delay={0} className="min-w-0">
              <StatCard
                icon={Target}
                label="Top match right now"
                value={`${stats.topMatchPercent}%`}
                body="The highest AI match percentage among this search's results — recomputed every keystroke."
              />
            </Reveal>
            <Reveal delay={0.06} className="min-w-0">
              <StatCard
                icon={Percent}
                label="Average discount in this set"
                value={`${stats.avgDiscountPercent}%`}
                body="Mean before/after discount across every result this query currently returns."
              />
            </Reveal>
            <Reveal delay={0.12} className="min-w-0">
              <StatCard
                icon={ShieldCheck}
                label="Verified sellers in this set"
                value={`${stats.verifiedSharePercent}%`}
                body="Share of this query's results that come from an identity-checked seller."
              />
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-10">
            <div className={`min-w-0 rounded-2xl border ${PANEL_BORDER} bg-[#15141C] p-6 sm:p-7`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                Live search snapshot
              </p>
              <p className="tabular-nums mt-2 text-[34px] font-extrabold leading-none tracking-[-0.01em] text-white sm:text-[40px]">
                {stats.count}
                <span className="text-[16px] font-normal text-[#A1A1AA]">
                  {" "}
                  match{stats.count === 1 ? "" : "es"}
                </span>
              </p>
              <p className={`mt-2 max-w-[430px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
                That&apos;s the live count for{" "}
                <span className={`font-semibold ${ACCENT_TINT_TEXT}`}>“{trimmedQuery}”</span> —
                search something else above and this number, the three stats above it,
                and the closing offer below all move with it.
              </p>
            </div>
          </Reveal>
        </>
      )}
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  body,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className={`min-w-0 flex h-full flex-col gap-3 rounded-2xl border ${PANEL_BORDER} bg-[#15141C] p-5`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#231A3D]">
        <Icon className="h-4 w-4 text-[#BCA7F3]" aria-hidden="true" />
      </span>
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">{label}</p>
      <p className="tabular-nums text-[32px] font-extrabold leading-none tracking-[-0.01em] text-white">
        {value}
      </p>
      <p className={`text-[13px] font-normal leading-[1.5] ${MUTED_TEXT}`}>{body}</p>
    </div>
  );
}
