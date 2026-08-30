"use client";

import { type MatchPair, aggregateStats } from "./data";
import { COLOR } from "./theme";
import { Eyebrow, Folio, Reveal } from "./ui";

function StatBar({
  label,
  value,
  display,
  description,
}: {
  label: string;
  value: number;
  display: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: COLOR.border, background: COLOR.bgCard }}>
      <p className="text-[11px] font-semibold uppercase" style={{ color: COLOR.muted, letterSpacing: "0.12em" }}>
        {label}
      </p>
      <p
        className="mt-2 font-extrabold"
        style={{ fontFamily: "var(--font-display-mono)", color: COLOR.fg, fontSize: "2.25rem", letterSpacing: "-0.02em" }}
      >
        {display}
      </p>
      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: COLOR.border }}
        role="img"
        aria-label={`${label}: ${display}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.max(4, Math.min(100, value))}%`, background: COLOR.accent }}
        />
      </div>
      <p className="mt-3 text-[13px] font-normal" style={{ color: COLOR.mutedDim, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}

export default function ValueSplit({
  matches,
  categoryLabel,
}: {
  matches: MatchPair[];
  categoryLabel: string;
}) {
  const stats = aggregateStats(matches);
  const speedScore = Math.round(((5 - stats.speedDays) / 5) * 100);

  return (
    <section className="border-b px-6 py-16 md:px-12 md:py-24" style={{ borderColor: COLOR.border, background: COLOR.bgElevated }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>Why these pairs, not others</Eyebrow>
            <h2
              className="mt-3 max-w-[22ch] font-extrabold"
              style={{
                fontFamily: "var(--font-display-mono)",
                color: COLOR.fg,
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)",
              }}
            >
              Three numbers behind every thread.
            </h2>
          </div>
          <Folio index={3} total={5} label="Fig. 03" />
        </div>

        <p className="mt-4 text-[15px] font-normal" style={{ color: COLOR.muted, lineHeight: 1.6, maxWidth: "500px" }}>
          Move the filter above and these recalculate from the {stats.count}{" "}
          live pairs currently on the board — nothing here is a fixed
          illustration.
        </p>

        <Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <StatBar
              label="Avg. price fit"
              value={stats.priceFit}
              display={`${stats.priceFit}%`}
              description={`How close the matched price lands to the buyer's stated budget, averaged across ${stats.count} ${categoryLabel.toLowerCase()} pairs.`}
            />
            <StatBar
              label="Avg. condition confidence"
              value={stats.conditionConf}
              display={`${stats.conditionConf}%`}
              description="Derived from the AI condition grade against the buyer's stated minimum, not the seller's own description."
            />
            <StatBar
              label="Avg. time to match"
              value={speedScore}
              display={`${stats.speedDays}d`}
              description="Estimated days from first contact to an accepted offer, based on this category's recent matches."
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
