"use client";

import { useMemo, useState } from "react";
import { Sprout, Flower2, TriangleAlert, Moon } from "lucide-react";
import { fieldNotes, noteFilters, type NoteTag } from "./data";

const TAG_META: Record<NoteTag, { icon: typeof Sprout; label: string }> = {
  "new-growth": { icon: Sprout, label: "신초" },
  flowering: { icon: Flower2, label: "개화" },
  alert: { icon: TriangleAlert, label: "경고" },
  dormant: { icon: Moon, label: "휴면" },
};

export default function FieldNotes() {
  const [filter, setFilter] = useState<"all" | NoteTag>("all");

  const filtered = useMemo(
    () => (filter === "all" ? fieldNotes : fieldNotes.filter((n) => n.tag === filter)),
    [filter],
  );

  return (
    <div>
      <div role="group" aria-label="관찰 기록 상태 필터" className="mb-5 flex flex-wrap gap-2">
        {noteFilters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`lin-focus min-h-[44px] border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-[var(--lin-sage-deep)] bg-[var(--lin-sage-deep)] text-[var(--lin-card)]"
                  : "border-[var(--lin-border-strong)] bg-[var(--lin-card)] text-[var(--lin-ink-muted)] hover:border-[var(--lin-sage-deep)]"
              }`}
            >
              <span>{f.labelKo}</span>
              <span className="plate-serif ml-1.5 text-[10px] italic opacity-80">{f.label}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mb-4 text-xs text-[var(--lin-ink-muted)]">
        {filtered.length}건의 기록이 표시됨
      </p>

      <ol className="flex flex-col gap-3">
        {filtered.map((note) => {
          const meta = TAG_META[note.tag];
          const Icon = meta.icon;
          return (
            <li key={note.id} className="lin-card flex gap-3 p-4">
              <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lin-sage-deep)]" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-[var(--lin-ink-muted)]">
                  <time dateTime={note.date}>{note.date}</time>
                  <span aria-hidden="true">·</span>
                  <span>{note.zone}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase tracking-wide">{meta.label}</span>
                </div>
                <p className="plate-serif mt-1 text-sm italic text-[var(--lin-ink)]">{note.specimen}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--lin-ink)]">{note.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
