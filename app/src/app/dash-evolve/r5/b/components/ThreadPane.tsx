"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Info, Send } from "lucide-react";
import type { Conversation, Status } from "../lib/data";
import { agentById, customerById } from "../lib/data";
import { Avatar, ChannelBadge, SegmentedControl } from "./ui";
import { cn } from "../lib/format";

export default function ThreadPane({
  conversation,
  onStatusChange,
  onSendReply,
  onOpenMeta,
  onBack,
  className = "",
}: {
  conversation: Conversation | null;
  onStatusChange: (id: string, status: Status) => void;
  onSendReply: (id: string, body: string) => void;
  onOpenMeta?: () => void;
  onBack?: () => void;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  if (!conversation) {
    return (
      <div className={cn("flex h-full flex-1 min-w-0 items-center justify-center bg-zinc-50/50 text-sm text-zinc-500", className)}>
        Select a conversation to view the thread.
      </div>
    );
  }

  const customer = customerById(conversation.customerId);
  const assignee = agentById(conversation.assigneeId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !conversation) return;
    onSendReply(conversation.id, body);
    setDraft("");
  }

  return (
    <div className={cn("flex h-full flex-1 min-w-0 flex-col bg-white", className)}>
      <div className="flex shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversation list"
            className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
        <Avatar avatarId={customer.avatarId} name={customer.name} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">{conversation.subject}</p>
          <p className="truncate text-xs text-zinc-500">
            {customer.name} · {assignee ? assignee.name : "Unassigned"}
          </p>
        </div>
        <ChannelBadge channel={conversation.channel} />
        <SegmentedControl
          ariaLabel="Conversation status"
          value={conversation.status}
          onChange={(v) => onStatusChange(conversation.id, v)}
          options={[
            { id: "open", label: "Open" },
            { id: "pending", label: "Pending" },
            { id: "resolved", label: "Resolved" },
          ]}
        />
        {onOpenMeta ? (
          <button
            type="button"
            onClick={onOpenMeta}
            aria-label="Show customer details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 2xl:hidden"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <ol className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-label="Message thread">
        {conversation.messages.map((m) => {
          const isAgent = m.from === "agent";
          return (
            <li key={m.id} className={cn("flex items-end gap-2.5", isAgent ? "flex-row-reverse" : "flex-row")}>
              {isAgent ? (
                <span className="mb-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white sm:flex">
                  {m.authorName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
              ) : (
                <Avatar avatarId={customer.avatarId} name={m.authorName} size={24} />
              )}
              <div className={cn("max-w-[75%]", isAgent ? "items-end text-right" : "items-start text-left")}>
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    isAgent ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md border border-zinc-200 bg-zinc-50 text-zinc-800",
                  )}
                >
                  {m.body}
                </div>
                <p className={cn("mt-1 text-[11px] text-zinc-500", isAgent ? "text-right" : "text-left")}>
                  {m.authorName} · {m.timestamp}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit} className="shrink-0 border-t border-zinc-200 p-3">
        <label htmlFor="reply-composer" className="sr-only">
          Reply to {customer.name}
        </label>
        <textarea
          id="reply-composer"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          rows={3}
          placeholder={`Reply to ${customer.name}…`}
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">⌘Enter to send</p>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-sm font-medium text-white outline-none transition-colors motion-reduce:transition-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
