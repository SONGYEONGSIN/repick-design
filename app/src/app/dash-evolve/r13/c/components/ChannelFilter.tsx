"use client";

import { Check } from "lucide-react";
import { CHANNELS, type ChannelId } from "../data";
import { BORDER, BORDER_STRONG, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { CardHeader } from "./ui";

export default function ChannelFilter({
  activeChannels,
  onToggle,
  onSelectAll,
  onClear,
  counts,
}: {
  activeChannels: Set<ChannelId>;
  onToggle: (id: ChannelId) => void;
  onSelectAll: () => void;
  onClear: () => void;
  counts: Record<ChannelId, number>;
}) {
  const allSelected = activeChannels.size === CHANNELS.length;
  return (
    <div>
      <CardHeader
        title="Channels"
        description="Filter the calendar and queue"
        action={
          <div className="flex items-center gap-1 text-xs font-medium">
            <button type="button" onClick={onSelectAll} disabled={allSelected} className={cx("rounded-md px-2 py-1", TRANSITION, FOCUS_RING, allSelected ? "text-zinc-600" : cx(TEXT_CAPTION, "hover:text-zinc-100"))}>
              All
            </button>
            <span aria-hidden="true" className="text-zinc-700">
              /
            </span>
            <button
              type="button"
              onClick={onClear}
              disabled={activeChannels.size === 0}
              className={cx("rounded-md px-2 py-1", TRANSITION, FOCUS_RING, activeChannels.size === 0 ? "text-zinc-600" : cx(TEXT_CAPTION, "hover:text-zinc-100"))}
            >
              None
            </button>
          </div>
        }
      />

      <ul className="mt-3 flex flex-col gap-1.5">
        {CHANNELS.map((c) => {
          const active = activeChannels.has(c.id);
          const Icon = c.Icon;
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(c.id)}
                className={cx(
                  "flex min-h-10 w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm",
                  TRANSITION,
                  FOCUS_RING,
                  active ? cx(BORDER_STRONG, "bg-white/[0.06]") : cx(BORDER, "opacity-60 hover:opacity-100"),
                )}
              >
                <Icon size={15} aria-hidden="true" className={cx("shrink-0", active ? "text-orange-400" : TEXT_CAPTION)} />
                <span className={cx("min-w-0 flex-1 truncate font-medium", TEXT_PRIMARY)}>{c.label}</span>
                <span className={cx("shrink-0 text-xs", NUM, TEXT_CAPTION)}>{counts[c.id]}</span>
                {active ? <Check size={14} aria-hidden="true" className="shrink-0 text-orange-400" /> : <span className="w-[14px] shrink-0" aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
