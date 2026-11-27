import type { Listing, Profile, Tag } from "./lib";
import { TAGS, TAG_LABELS, decidedCount, matchPercent } from "./lib";

interface ValueSplitProps {
  decisions: Record<string, "like" | "pass">;
  profile: Profile;
  ranked: Listing[];
  topTrait: Tag;
}

const displayFace = { fontFamily: "var(--font-display-wide)" };

/**
 * The mechanism, spelled out as a 3-way split. This section re-reads the SAME `profile`/`ranked`
 * values Hero computed from the same shared `lib.ts` functions — nothing here is a second,
 * hand-typed number that merely looks similar, so the live chain holds past the fold too.
 */
export default function ValueSplit({ decisions, profile, ranked, topTrait }: ValueSplitProps) {
  const decided = decidedCount(decisions);
  const sortedTags = [...TAGS].sort((a, b) => profile[b] - profile[a]).slice(0, 6);
  const maxWeight = Math.max(...sortedTags.map((t) => profile[t]), 1);
  const top3 = ranked.slice(0, 3);

  return (
    <section className="border-b border-zinc-200 px-4 py-14 sm:px-8 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <h2
          className="max-w-[640px] text-[clamp(1.7rem,3.2vw+0.9rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-900"
          style={displayFace}
        >
          How your profile sharpens with every tap
        </h2>
        <p className="mt-3 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-600">
          No sliders, no checklists — three plain steps run every time you decide on a card.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="min-w-0">
            <span className="text-[12px] font-semibold uppercase text-lime-800" style={{ letterSpacing: "0.12em" }}>
              Step 1
            </span>
            <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em] text-zinc-900">You decide</h3>
            <p className="mt-2 text-[14px] font-normal leading-[1.6] text-zinc-600">
              One card at a time — Pass or Like, mouse or arrow keys. Final once made, no going back
              to re-pick.
            </p>
            <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13.5px] font-normal text-zinc-700">
              <span className="tabular-nums font-semibold text-zinc-900">{decided}</span> of{" "}
              <span className="tabular-nums font-semibold text-zinc-900">10</span> decided so far.
            </p>
          </div>

          <div className="min-w-0">
            <span className="text-[12px] font-semibold uppercase text-lime-800" style={{ letterSpacing: "0.12em" }}>
              Step 2
            </span>
            <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em] text-zinc-900">Profile updates</h3>
            <p className="mt-2 text-[14px] font-normal leading-[1.6] text-zinc-600">
              Each decision reweights the category, price tier and style tags that card carried.
            </p>
            <ul className="mt-4 space-y-2" aria-label="Current tag weights, highest first">
              {sortedTags.map((tag) => {
                const isTop = tag === topTrait;
                const widthPct = Math.max(6, Math.round((profile[tag] / maxWeight) * 100));
                return (
                  <li key={tag} className="flex items-center gap-2.5">
                    <span
                      className="w-[88px] shrink-0 truncate text-[12px] font-semibold uppercase text-zinc-600"
                      style={{ letterSpacing: "0.12em" }}
                    >
                      {TAG_LABELS[tag]}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                      <span
                        className={`block h-full rounded-full ${isTop ? "bg-lime-700" : "bg-zinc-400"}`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </span>
                    <span className="w-[2.5rem] shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-zinc-700">
                      {profile[tag]}
                      {isTop ? <span className="ml-1 text-[10.5px] font-semibold text-lime-800">top</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0">
            <span className="text-[12px] font-semibold uppercase text-lime-800" style={{ letterSpacing: "0.12em" }}>
              Step 3
            </span>
            <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em] text-zinc-900">Picks re-rank</h3>
            <p className="mt-2 text-[14px] font-normal leading-[1.6] text-zinc-600">
              The remaining, not-yet-seen listings reorder live by fit to your current profile.
            </p>
            {top3.length === 0 ? (
              <p className="mt-4 text-[13.5px] font-normal text-zinc-500">
                You&apos;ve seen the whole deck — nothing left to re-rank.
              </p>
            ) : (
              <ol className="mt-4 space-y-2">
                {top3.map((listing, i) => (
                  <li
                    key={listing.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="tabular-nums text-[12.5px] font-semibold text-zinc-500">{i + 1}</span>
                      <span className="truncate text-[13.5px] font-semibold text-zinc-900">{listing.title}</span>
                    </span>
                    <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-lime-800">
                      {matchPercent(profile, listing)}%
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
