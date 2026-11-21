"use client";

import type { Period } from "./data";
import { DIGEST } from "./data";
import { Card, SegmentedControl, StatTile } from "./ui";
import { TopicTimeline } from "./TopicTimeline";
import { Leaderboard } from "./Leaderboard";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

/**
 * The detail pane's main body. On purpose, this component never receives `pinnedId` — clicking a
 * call in the list rail cannot reach anything in here. `period` is its own, separate axis: it
 * swaps the whole digest dataset, independent of whatever call is spotlighted above it.
 */
export function CoachingDigest({
  id,
  period,
  onPeriodChange,
  hoveredTopic,
  onHoverTopic,
}: {
  id?: string;
  period: Period;
  onPeriodChange: (p: Period) => void;
  hoveredTopic: string | null;
  onHoverTopic: (topic: string | null) => void;
}) {
  const digest = DIGEST[period];

  return (
    <Card id={id} className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-50">Coaching digest</h2>
          <p className="mt-0.5 text-sm font-normal text-zinc-400">
            Team-wide call quality. Not affected by which call is spotlighted above.
          </p>
        </div>
        <SegmentedControl label="Digest period" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {digest.headline.map((h) => (
          <StatTile key={h.label} label={h.label} value={h.value} delta={h.delta} deltaGood={h.deltaGood} />
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <TopicTimeline
          topics={digest.topics}
          periodLabel={digest.label}
          hoveredTopic={hoveredTopic}
          onHover={onHoverTopic}
        />
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <Leaderboard period={period} periodLabel={digest.label} />
      </div>
    </Card>
  );
}
