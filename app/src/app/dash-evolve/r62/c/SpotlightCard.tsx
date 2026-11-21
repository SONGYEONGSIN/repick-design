"use client";

import Image from "next/image";
import { MousePointerClick, X } from "lucide-react";
import type { Call } from "./data";
import { formatCompactUSD, formatMinutes, repById } from "./data";
import { Card, FOCUS, FieldLabel, ScoreBadge, SentimentBadge, TalkRatioBar } from "./ui";

/**
 * The ONE consumer of `pinnedId`. Clicking a row in the list rail updates only this card — the
 * Coaching Digest below it never changes because of a row click; it always describes the whole
 * team's period, never whichever call someone last opened. See ClearcallClient's comment on
 * `pinnedId` for the full rationale.
 */
export function SpotlightCard({ call, onClear }: { call: Call | null; onClear: () => void }) {
  if (!call) {
    return (
      <Card className="flex min-h-[148px] flex-col items-center justify-center gap-2 text-center">
        <MousePointerClick className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="max-w-sm text-sm font-normal text-zinc-400">
          Select a call from the list to spotlight it here. The coaching digest below always reflects the
          whole team, not a single call.
        </p>
      </Card>
    );
  }

  const rep = repById(call.repId);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <FieldLabel>Spotlight</FieldLabel>
          <h2 className="mt-1 truncate text-lg font-semibold text-zinc-50">{call.title}</h2>
          <p className="mt-0.5 truncate text-sm font-normal text-zinc-400">
            {call.account} · {call.stage}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear spotlight"
          className={`${FOCUS} shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-50`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {rep && (
        <div className="mt-3 flex min-w-0 items-center gap-2">
          <Image
            src={`https://images.unsplash.com/photo-${rep.avatarId}`}
            alt={`Portrait of ${rep.name}`}
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 truncate text-sm font-medium text-zinc-300">{rep.name}</span>
          <span className="shrink-0 text-zinc-400" aria-hidden="true">
            ·
          </span>
          <span className="shrink-0 whitespace-nowrap text-xs font-normal text-zinc-400">{call.date}</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ScoreBadge score={call.score} />
        <SentimentBadge sentiment={call.sentiment} />
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>Rep talk ratio</FieldLabel>
          <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-zinc-50">
            {call.talkRatioRep}%
          </span>
        </div>
        <div className="mt-1.5">
          <TalkRatioBar value={call.talkRatioRep} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <FieldLabel>Deal value</FieldLabel>
          <p className="mt-0.5 truncate font-mono text-sm font-semibold tabular-nums text-zinc-50">
            {formatCompactUSD(call.dealValue)}
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <FieldLabel>Duration</FieldLabel>
          <p className="mt-0.5 truncate font-mono text-sm font-semibold tabular-nums text-zinc-50">
            {formatMinutes(call.durationMin)}
          </p>
        </div>
      </div>
    </Card>
  );
}
