"use client";

import { MousePointer2 } from "lucide-react";
import type { TopicSlice } from "./data";
import { TOPIC_MOMENTS, TOPIC_SHADES } from "./data";
import { FOCUS, FieldLabel } from "./ui";

/**
 * Ephemeral, non-persistent topic inspector. `hoveredTopic` is set by mouse hover OR keyboard
 * focus landing on a segment of the stacked bar below — never by click, and it is cleared again on
 * mouse-leave/blur. It deliberately never touches `pinnedId`: inspecting a topic and spotlighting a
 * call are two independently-scoped selections. Each segment's share is also printed as
 * always-visible legend text, so the key values never live only inside the hover state.
 */
export function TopicTimeline({
  topics,
  periodLabel,
  hoveredTopic,
  onHover,
}: {
  topics: TopicSlice[];
  periodLabel: string;
  hoveredTopic: string | null;
  onHover: (topic: string | null) => void;
}) {
  const hovered = topics.find((t) => t.topic === hoveredTopic) ?? null;

  return (
    <div className="min-w-0">
      <FieldLabel>Topic mix — {periodLabel}</FieldLabel>

      <div className="mt-2 flex h-8 w-full min-w-0 overflow-hidden rounded-lg border border-white/10">
        {topics.map((t, i) => (
          <button
            key={t.topic}
            type="button"
            style={{ flexBasis: `${t.pct}%` }}
            onMouseEnter={() => onHover(t.topic)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(t.topic)}
            onBlur={() => onHover(null)}
            aria-label={`${t.topic}: ${t.pct}% of ${periodLabel.toLowerCase()}'s calls, average score ${t.avgScore}`}
            className={`${FOCUS} h-full shrink-0 grow-0 transition-opacity ${TOPIC_SHADES[i % TOPIC_SHADES.length]} ${
              hoveredTopic === null || hoveredTopic === t.topic ? "opacity-100" : "opacity-40"
            }`}
          />
        ))}
      </div>

      <ul className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-1.5" aria-label="Topic mix legend">
        {topics.map((t, i) => (
          <li key={t.topic} className="flex min-w-0 items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${TOPIC_SHADES[i % TOPIC_SHADES.length]}`} aria-hidden="true" />
            <span className="truncate text-xs font-normal text-zinc-300">{t.topic}</span>
            <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-zinc-400">{t.pct}%</span>
          </li>
        ))}
      </ul>

      <div
        aria-live="polite"
        className="mt-3 flex min-h-[64px] items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3"
      >
        {hovered ? (
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-zinc-50">{hovered.topic}</span>
              <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-sky-400">
                avg score {hovered.avgScore}
              </span>
            </div>
            <p className="mt-1 text-xs font-normal text-zinc-400">{TOPIC_MOMENTS[hovered.topic]}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-normal text-zinc-400">
            <MousePointer2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Hover or focus a segment above to inspect its average score and a representative moment.
          </div>
        )}
      </div>
    </div>
  );
}
