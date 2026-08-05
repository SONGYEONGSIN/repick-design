"use client";

import { useState } from "react";
import DivergenceChart from "./divergence-chart";
import Hero from "./hero";
import PercentileGauge from "./percentile-gauge";
import PositionsTable from "./positions-table";
import ScoreboardBand from "./scoreboard-band";
import { PROFILE, type BaselineKey, type RangeKey } from "./data";

export default function ProfileClient() {
  const [range, setRange] = useState<RangeKey>("1Y");
  const [baseline, setBaseline] = useState<BaselineKey>("index");
  const [following, setFollowing] = useState(false);

  const copiers = PROFILE.copiers + (following ? 1 : 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Hero following={following} onToggleFollow={() => setFollowing((f) => !f)} />

      <ScoreboardBand range={range} onRangeChange={setRange} baseline={baseline} onBaselineChange={setBaseline} copiers={copiers} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <DivergenceChart range={range} baseline={baseline} />
          </div>
          <div className="min-w-0">
            <PercentileGauge />
          </div>
        </div>

        <div className="mt-8">
          <PositionsTable baseline={baseline} />
        </div>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs font-normal text-zinc-400 sm:px-6 lg:px-8">
          Illustrative track record for demonstration purposes. Past performance does not guarantee future results; all
          figures are net of published fees.
        </div>
      </footer>
    </div>
  );
}
