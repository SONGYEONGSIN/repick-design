"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PinOff, Lightbulb } from "lucide-react";
import {
  CATEGORY_META,
  INCIDENTS,
  formatDate,
  formatSignedCompactUSD,
  getDefaultCategory,
  type CategoryId,
  type StoreId,
} from "./data";
import { Avatar, Card, Pill, Tabs, cn, FOCUS_RING } from "./ui";

export function Spotlight({
  storeId,
  storeName,
  pinnedId,
  onClearPin,
}: {
  storeId: StoreId;
  storeName: string;
  pinnedId: CategoryId | null;
  onClearPin: () => void;
}) {
  const [tab, setTab] = useState<"causes" | "guidance">("causes");
  const [cursor, setCursor] = useState(0);

  // The category actually shown — the pin if one exists, otherwise the
  // store's largest loss driver. This panel never renders an empty
  // "select a bar" placeholder; it always has real content.
  const isPinned = pinnedId !== null;
  const activeCategory = pinnedId ?? getDefaultCategory(storeId);

  // Resets the mover cursor whenever the shown category or store
  // changes. Adjusted during render (React's documented pattern for
  // state that tracks a prop) rather than in an effect, so there's no
  // extra render tick and no synchronous setState-in-effect.
  const trackKey = `${storeId}:${activeCategory}`;
  const [prevTrackKey, setPrevTrackKey] = useState(trackKey);
  if (trackKey !== prevTrackKey) {
    setPrevTrackKey(trackKey);
    setCursor(0);
  }

  const movers = useMemo(
    () =>
      INCIDENTS.filter((i) => i.storeId === storeId && i.category === activeCategory).sort(
        (a, b) => Math.abs(b.impact) - Math.abs(a.impact),
      ),
    [storeId, activeCategory],
  );

  const meta = CATEGORY_META[activeCategory];
  const CategoryIcon = meta.icon;
  const categoryTotal = movers.reduce((sum, m) => sum + m.impact, 0);
  const openCount = movers.filter((m) => m.status === "open").length;
  const mover = movers[cursor];

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn("text-[11px] font-medium uppercase tracking-wide", isPinned ? "text-teal-300" : "text-zinc-400")}>
            {isPinned ? "Pinned bridge step" : "Largest driver — auto"}
          </p>
          <h2 className="mt-1 flex items-center gap-1.5 text-base font-semibold text-zinc-50">
            <CategoryIcon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            {meta.label}
          </h2>
        </div>
        {isPinned && (
          <button
            type="button"
            onClick={onClearPin}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-md border border-white/10 px-2 text-xs font-medium text-zinc-400 hover:text-zinc-100",
              FOCUS_RING,
            )}
          >
            <PinOff className="h-3 w-3" aria-hidden="true" />
            Unpin
          </button>
        )}
      </div>

      <p className="mt-1 text-sm text-zinc-400">
        {storeName} · {movers.length} incident{movers.length === 1 ? "" : "s"} · category total{" "}
        <span className="font-medium tabular-nums text-zinc-200">{formatSignedCompactUSD(categoryTotal)}</span>
      </p>

      <div className="mt-4" id="spotlight-tabpanel">
        <Tabs
          label="Spotlight view"
          panelId="spotlight-tabpanel-content"
          items={[
            { id: "causes", label: "Top causes" },
            { id: "guidance", label: "Guidance" },
          ]}
          value={tab}
          onChange={(id) => setTab(id as "causes" | "guidance")}
        />
      </div>

      <div id="spotlight-tabpanel-content" role="tabpanel" aria-label={tab === "causes" ? "Top causes" : "Guidance"} className="mt-4 flex-1">
        {tab === "causes" ? (
          movers.length === 0 ? (
            <p className="text-sm text-zinc-400">No logged incidents for this category yet.</p>
          ) : (
            <>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-50">{mover.description}</p>
                    <p className="text-xs text-zinc-400">{formatDate(mover.loggedDate)}</p>
                  </div>
                  <Pill tone={mover.impact >= 0 ? "up" : "down"}>{formatSignedCompactUSD(mover.impact)}</Pill>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="flex items-center gap-1.5 text-zinc-400">
                      <Avatar name={mover.investigator} className="h-5 w-5 text-[10px]" />
                      Investigator
                    </dt>
                    <dd className="mt-0.5 pl-6 font-medium text-zinc-100">{mover.investigator}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-400">Status</dt>
                    <dd className="mt-0.5 font-medium text-zinc-100">{mover.status === "resolved" ? "Resolved" : "Open"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-zinc-400">Share of this step</dt>
                    <dd className="mt-0.5 font-medium tabular-nums text-zinc-100">{shareOfCategory(mover.impact, categoryTotal)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Cause {cursor + 1} of {movers.length} · {openCount} open
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={movers.length < 2}
                    onClick={() => setCursor((c) => (c - 1 + movers.length) % movers.length)}
                    aria-label="Previous cause"
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-40",
                      FOCUS_RING,
                    )}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={movers.length < 2}
                    onClick={() => setCursor((c) => (c + 1) % movers.length)}
                    aria-label="Next cause"
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-40",
                      FOCUS_RING,
                    )}
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="flex gap-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
            <Lightbulb className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" />
            <p className="text-sm text-zinc-300">{meta.guidance}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function shareOfCategory(value: number, categoryTotal: number): string {
  if (categoryTotal === 0) return "—";
  const pct = (Math.abs(value) / Math.abs(categoryTotal)) * 100;
  return `${pct.toFixed(0)}%`;
}
