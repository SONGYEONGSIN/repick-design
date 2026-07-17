"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import type { Conversation } from "../lib/data";
import { customerById } from "../lib/data";
import { Avatar, ChannelIcon, StatusBadge } from "./ui";
import { SegmentedControl } from "./ui";
import { cn } from "../lib/format";

export type SortMode = "newest" | "unread";

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  queueLabel,
  className = "",
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  sortMode: SortMode;
  onSortChange: (v: SortMode) => void;
  queueLabel: string;
  className?: string;
}) {
  // Two instances of this component can be mounted at once (a CSS-toggled
  // mobile layout and a CSS-toggled desktop layout), so the search input's
  // id must be unique per instance to keep the DOM valid.
  const searchId = useId();

  return (
    <div className={cn("flex h-full flex-col border-r border-zinc-200 bg-white", className)}>
      <div className="shrink-0 border-b border-zinc-100 p-3">
        <div className="flex items-center justify-between gap-2 px-1 pb-2.5">
          <h2 className="text-sm font-semibold text-zinc-900">{queueLabel}</h2>
          <span className="text-xs tabular-nums text-zinc-500">{conversations.length}</span>
        </div>
        <div className="relative mb-2.5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <label htmlFor={searchId} className="sr-only">
            Search conversations
          </label>
          <input
            id={searchId}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search this queue…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          />
        </div>
        <SegmentedControl
          ariaLabel="Sort conversations"
          value={sortMode}
          onChange={onSortChange}
          options={[
            { id: "newest", label: "Newest" },
            { id: "unread", label: "Unread first" },
          ]}
        />
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto" aria-label={`${queueLabel} conversations`}>
        {conversations.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">No conversations match your search.</li>
        ) : (
          conversations.map((conv) => {
            const customer = customerById(conv.customerId);
            const selected = conv.id === selectedId;
            return (
              <li key={conv.id} className="border-b border-zinc-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-2.5 px-3 py-3 text-left outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                    selected ? "bg-indigo-50" : "hover:bg-zinc-50",
                  )}
                >
                  <span className="relative mt-0.5 shrink-0">
                    <Avatar avatarId={customer.avatarId} name={customer.name} size={36} />
                    {conv.unread ? (
                      <span
                        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className={cn("truncate text-sm", conv.unread ? "font-semibold text-zinc-900" : "font-medium text-zinc-800")}>
                        {customer.name}
                      </span>
                      <span
                        className={cn(
                          "ml-auto shrink-0 whitespace-nowrap text-[11px] tabular-nums",
                          selected ? "text-zinc-600" : "text-zinc-500",
                        )}
                      >
                        {conv.timestamp}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-xs",
                        conv.unread ? "font-medium text-zinc-800" : selected ? "text-zinc-600" : "text-zinc-500",
                      )}
                    >
                      {conv.subject}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5">
                      <ChannelIcon channel={conv.channel} className="h-3 w-3 shrink-0 text-zinc-400" />
                      <StatusBadge status={conv.status} />
                      {conv.priority === "urgent" ? (
                        <span className={cn("text-[11px] font-medium", selected ? "text-rose-700" : "text-rose-600")}>Urgent</span>
                      ) : null}
                      {conv.unread ? <span className="sr-only">Unread</span> : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
