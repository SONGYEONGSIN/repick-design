"use client";

import { Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTION_TYPE_META, type Question, type QuestionType } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

const ADDABLE_TYPES: QuestionType[] = ["short_text", "multiple_choice", "rating", "nps"];

export default function CommandPalette({
  questions,
  onClose,
  onJumpToQuestion,
  onAddQuestion,
}: {
  questions: Question[];
  onClose: () => void;
  onJumpToQuestion: (id: string) => void;
  onAddQuestion: (type: QuestionType) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedQuestions = useMemo(
    () => (q === "" ? questions : questions.filter((item) => item.label.toLowerCase().includes(q) || item.prompt.toLowerCase().includes(q))),
    [q, questions],
  );
  const matchedTypes = useMemo(() => (q === "" ? ADDABLE_TYPES : ADDABLE_TYPES.filter((t) => QUESTION_TYPE_META[t].label.toLowerCase().includes(q))), [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a question, or add one…"
            aria-label="Search questions or question types"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-500 dark:placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Jump to question</EyebrowLabel>
            </div>
            {matchedQuestions.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching questions.</p>
            ) : (
              matchedQuestions.map((item) => {
                const idx = questions.indexOf(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onJumpToQuestion(item.id)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <span className={cx("shrink-0 text-xs font-medium tabular-nums", TEXT_CAPTION)}>Q{idx + 1}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Add a question</EyebrowLabel>
            </div>
            {matchedTypes.map((type) => {
              const meta = QUESTION_TYPE_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onAddQuestion(type)}
                  className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <span className="flex items-center gap-2.5">
                    <meta.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className="truncate">Add “{meta.label}” question</span>
                  </span>
                  <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>
                    <Plus size={10} aria-hidden="true" />
                    New
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
