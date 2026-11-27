"use client";

import {
  TIER_META,
  type Release,
  releaseRiskScore,
  releaseBlastRadius,
  releaseTier,
} from "./data";

export type Segment = "pending" | "approved";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function RiskPill({ tier }: { tier: ReturnType<typeof releaseTier> }) {
  const m = TIER_META[tier];
  return (
    <span className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${m.bg} ${m.text} ${m.border}`}>
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: m.dot }} aria-hidden="true" />
      {tier}
    </span>
  );
}

function QueueItem({ release, active, onSelect }: { release: Release; active: boolean; onSelect: () => void }) {
  const tier = releaseTier(release);
  const blast = releaseBlastRadius(release);
  const risk = releaseRiskScore(release);
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className={`flex w-full flex-col gap-1.5 border-l-2 px-4 py-3 text-left transition-colors duration-150 ease-out ${FOCUS_RING} ${
          active ? "border-l-blue-600 bg-blue-50" : "border-l-transparent hover:bg-zinc-50"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-zinc-900">{release.version}</span>
          <RiskPill tier={tier} />
        </div>
        <p className="truncate text-xs font-normal text-zinc-600">{release.title}</p>
        <div className="flex items-center justify-between gap-2 text-[11px] font-normal text-zinc-600">
          <span className="truncate">
            {release.requestedBy.initials} &middot; {release.env === "production" ? "Production" : "Staging"}
          </span>
          <span className="flex-shrink-0 tabular-nums">
            {release.status === "pending" ? release.requestedAt : release.approvedAt}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.04em] text-zinc-600">
          <span className="tabular-nums">Blast {blast}%</span>
          <span className="tabular-nums">Risk {risk}</span>
          {release.changeNote && <span className="text-amber-700">Changes requested</span>}
        </div>
      </button>
    </li>
  );
}

export function QueueRail({
  releases,
  segment,
  onSegmentChange,
  selectedId,
  onSelect,
  pendingCount,
  approvedCount,
}: {
  releases: Release[];
  segment: Segment;
  onSegmentChange: (s: Segment) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  pendingCount: number;
  approvedCount: number;
}) {
  const list = releases.filter((r) => r.status === segment);

  return (
    <div className="flex h-full min-h-0 w-full flex-shrink-0 flex-col border-r border-zinc-200 bg-white sm:w-[440px]">
      <div className="flex flex-shrink-0 flex-col gap-3 border-b border-zinc-200 px-4 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">Release queue</h2>
        <div role="group" aria-label="Queue view" className="flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSegmentChange("pending")}
            aria-pressed={segment === "pending"}
            className={`flex-1 rounded-md px-3 py-1.5 transition-colors duration-150 ease-out ${FOCUS_RING} ${
              segment === "pending" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Pending <span className="tabular-nums">({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onSegmentChange("approved")}
            aria-pressed={segment === "approved"}
            className={`flex-1 rounded-md px-3 py-1.5 transition-colors duration-150 ease-out ${FOCUS_RING} ${
              segment === "approved" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Approved <span className="tabular-nums">({approvedCount})</span>
          </button>
        </div>
      </div>
      <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto">
        {list.map((r) => (
          <QueueItem key={r.id} release={r} active={r.id === selectedId} onSelect={() => onSelect(r.id)} />
        ))}
        {list.length === 0 && (
          <li className="px-4 py-6 text-center text-sm font-normal text-zinc-500">No releases in this view.</li>
        )}
      </ul>
    </div>
  );
}
