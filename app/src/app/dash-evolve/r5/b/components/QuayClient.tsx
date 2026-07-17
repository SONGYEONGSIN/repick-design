"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CONVERSATIONS,
  QUEUE_DEFS,
  customerById,
  matchesQueue,
  queueCounts,
  type Conversation,
  type QueueId,
  type Status,
} from "../lib/data";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import QueueRail from "./QueueRail";
import ConversationList, { type SortMode } from "./ConversationList";
import ThreadPane from "./ThreadPane";
import CustomerPanel from "./CustomerPanel";
import CommandPalette from "./CommandPalette";
import { cn } from "../lib/format";

const QUEUE_LABEL: Record<QueueId, string> = Object.fromEntries(QUEUE_DEFS.map((q) => [q.id, q.label])) as Record<
  QueueId,
  string
>;

let replySeq = 0;

export default function QuayClient() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeQueue, setActiveQueue] = useState<QueueId>("inbox");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => CONVERSATIONS.filter((c) => matchesQueue(c, "inbox"))[0]?.id ?? null,
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => queueCounts(conversations), [conversations]);

  const queueFiltered = useMemo(
    () => conversations.filter((c) => matchesQueue(c, activeQueue)),
    [conversations, activeQueue],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = queueFiltered;
    if (q) {
      list = list.filter((c) => {
        const customer = customerById(c.customerId);
        return (
          c.subject.toLowerCase().includes(q) ||
          customer.name.toLowerCase().includes(q) ||
          customer.email.toLowerCase().includes(q)
        );
      });
    }
    const sorted = [...list].sort((a, b) => {
      if (sortMode === "unread" && a.unread !== b.unread) return a.unread ? -1 : 1;
      return b.sortRank - a.sortRank;
    });
    return sorted;
  }, [queueFiltered, search, sortMode]);

  const selected = useMemo(() => conversations.find((c) => c.id === selectedId) ?? null, [conversations, selectedId]);

  function handleSelectQueue(id: QueueId) {
    setActiveQueue(id);
    const next = conversations.filter((c) => matchesQueue(c, id));
    if (!next.some((c) => c.id === selectedId)) {
      setSelectedId(next[0]?.id ?? null);
    }
  }

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
    setMobileShowThread(true);
  }

  function handleStatusChange(id: string, status: Status) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function handleSendReply(id: string, body: string) {
    replySeq += 1;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `local-${id}-${replySeq}`,
                  from: "agent",
                  authorName: "Dana Whitfield",
                  body,
                  timestamp: "Just now",
                },
              ],
            }
          : c,
      ),
    );
  }

  function handleNewConversation() {
    setPaletteOpen(true);
  }

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-white text-zinc-900">
      <AppSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <AppTopbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onNewConversation={handleNewConversation}
        />

        <main id="main-content" className="flex min-h-0 flex-1 overflow-hidden">
          <h1 className="sr-only">Quay shared inbox — {QUEUE_LABEL[activeQueue]}</h1>

          {/* Queue rail: horizontal scroller on small screens, fixed column from lg up. */}
          <div className="hidden lg:flex lg:h-full">
            <QueueRail counts={counts} active={activeQueue} onSelect={handleSelectQueue} />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1">
            {/* Conversation list: always present on lg+, toggled with thread below lg. */}
            <div
              className={cn(
                "h-full min-h-0 w-full lg:block lg:w-auto",
                mobileShowThread ? "hidden" : "block",
              )}
            >
              <div className="flex h-full flex-col lg:hidden">
                <MobileQueueChips counts={counts} active={activeQueue} onSelect={handleSelectQueue} />
                <div className="min-h-0 flex-1">
                  <ConversationList
                    conversations={visible}
                    selectedId={selectedId}
                    onSelect={handleSelectConversation}
                    search={search}
                    onSearchChange={setSearch}
                    sortMode={sortMode}
                    onSortChange={setSortMode}
                    queueLabel={QUEUE_LABEL[activeQueue]}
                    className="w-full border-r-0"
                  />
                </div>
              </div>
              <div className="hidden h-full lg:block">
                <ConversationList
                  conversations={visible}
                  selectedId={selectedId}
                  onSelect={handleSelectConversation}
                  search={search}
                  onSearchChange={setSearch}
                  sortMode={sortMode}
                  onSortChange={setSortMode}
                  queueLabel={QUEUE_LABEL[activeQueue]}
                  className="w-80 shrink-0"
                />
              </div>
            </div>

            <div className={cn("h-full min-h-0 min-w-0 flex-1", mobileShowThread ? "block" : "hidden lg:block")}>
              <ThreadPane
                conversation={selected}
                onStatusChange={handleStatusChange}
                onSendReply={handleSendReply}
                onOpenMeta={() => setMetaOpen(true)}
                onBack={() => setMobileShowThread(false)}
              />
            </div>
          </div>

          {selected ? (
            <div className="hidden h-full 2xl:block">
              <CustomerPanel customer={customerById(selected.customerId)} />
            </div>
          ) : null}
        </main>
      </div>

      {selected && metaOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end 2xl:hidden">
          <button type="button" aria-label="Close customer details" onClick={() => setMetaOpen(false)} className="absolute inset-0 bg-zinc-900/40" />
          <div className="relative h-full shadow-xl">
            <CustomerPanel customer={customerById(selected.customerId)} onClose={() => setMetaOpen(false)} />
          </div>
        </div>
      ) : null}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectConversation={handleSelectConversation} />
    </div>
  );
}

function MobileQueueChips({
  counts,
  active,
  onSelect,
}: {
  counts: ReturnType<typeof queueCounts>;
  active: QueueId;
  onSelect: (id: QueueId) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-zinc-200 bg-zinc-50/70 px-3 py-2.5">
      {QUEUE_DEFS.map((q) => {
        const isActive = q.id === active;
        const c = counts[q.id];
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.id)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isActive ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-zinc-200 bg-white text-zinc-600",
            )}
          >
            {q.label}
            {c.unread > 0 ? <span className="tabular-nums">{c.unread}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
