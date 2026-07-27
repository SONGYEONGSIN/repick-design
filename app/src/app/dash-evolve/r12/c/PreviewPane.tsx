"use client";

import { ArrowLeft, ArrowRight, Monitor, Smartphone, Star } from "lucide-react";
import { useState } from "react";
import type { Question } from "./data";
import LogicMap from "./LogicMap";
import { ACCENT_SOLID, BORDER, FOCUS_RING, FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, SegmentedControl } from "./ui";

type View = "preview" | "logic";
type Device = "mobile" | "desktop";

export default function PreviewPane({ questions, selectedIndex, onSelectIndex }: { questions: Question[]; selectedIndex: number; onSelectIndex: (i: number) => void }) {
  const [view, setView] = useState<View>("preview");
  const [device, setDevice] = useState<Device>("mobile");
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string>>({});

  const q = questions[selectedIndex];
  const total = questions.length;
  const progressPct = Math.round(((selectedIndex + 1) / total) * 100);
  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === total - 1;

  function setAnswer(value: string) {
    setDemoAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-4">
      <CardHeader
        title={view === "preview" ? "Live preview" : "Logic map"}
        titleId="preview-pane-heading"
        description={view === "preview" ? "Renders exactly what the selected question looks like to a respondent." : "How respondents branch between questions."}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {view === "preview" ? (
              <SegmentedControl<Device>
                ariaLabel="Preview device width"
                value={device}
                onChange={setDevice}
                options={[
                  { value: "mobile", label: "Mobile", Icon: Smartphone },
                  { value: "desktop", label: "Desktop", Icon: Monitor },
                ]}
              />
            ) : null}
            <SegmentedControl<View>
              ariaLabel="Preview view"
              value={view}
              onChange={setView}
              options={[
                { value: "preview", label: "Preview" },
                { value: "logic", label: "Logic map" },
              ]}
            />
          </div>
        }
      />

      {view === "logic" ? (
        <LogicMap questions={questions} selectedId={q.id} />
      ) : (
        <div className="flex flex-1 items-start justify-center py-2">
          <div className={cx("w-full transition-[max-width] duration-200 ease-out motion-reduce:transition-none", device === "mobile" ? "max-w-[380px]" : "max-w-[640px]")}>
            <div className={cx("rounded-[28px] border p-6 sm:p-7", BORDER, "bg-zinc-50 dark:bg-zinc-950")}>
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
                    Question {selectedIndex + 1} of {total}
                  </span>
                  <span className={cx("text-[11px] font-semibold tabular-nums", TEXT_CAPTION)}>{progressPct}%</span>
                </div>
                <div role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Survey progress" className={cx("h-1.5 w-full overflow-hidden rounded-full", "bg-zinc-200 dark:bg-zinc-800")}>
                  <div className={cx("h-full rounded-full bg-blue-600 dark:bg-blue-400", TRANSITION)} style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <h3 className={cx("text-lg font-semibold leading-snug tracking-tight sm:text-xl", TEXT_PRIMARY)}>
                {q.prompt}
                {q.required ? (
                  <span aria-hidden="true" className="ml-1 text-rose-600 dark:text-rose-400">
                    *
                  </span>
                ) : null}
              </h3>
              {q.required ? <span className="sr-only"> (required)</span> : null}
              {q.helperText ? <p className={cx("mt-1.5 text-sm", TEXT_SECONDARY)}>{q.helperText}</p> : null}

              <div className="mt-5">
                <AnswerControl question={q} value={demoAnswers[q.id]} onChange={setAnswer} />
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => onSelectIndex(selectedIndex - 1)}
                  className={cx(
                    "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium",
                    BORDER,
                    "bg-white dark:bg-zinc-900",
                    TEXT_SECONDARY,
                    TRANSITION,
                    FOCUS_RING,
                    isFirst ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                  )}
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => onSelectIndex(selectedIndex + 1)}
                  className={cx("inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium", ACCENT_SOLID, TRANSITION, FOCUS_RING, isLast && "cursor-not-allowed opacity-50")}
                >
                  {isLast ? "Submit" : "Next"}
                  {!isLast ? <ArrowRight size={15} aria-hidden="true" /> : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function AnswerControl({ question, value, onChange }: { question: Question; value: string | undefined; onChange: (v: string) => void }) {
  if (question.type === "nps") {
    const scores = Array.from({ length: 11 }, (_, i) => i);
    return (
      <div>
        <div role="radiogroup" aria-label="Score, 0 to 10" className="grid grid-cols-6 gap-1.5 sm:grid-cols-11 sm:gap-1">
          {scores.map((s) => {
            const selected = value === String(s);
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(String(s))}
                className={cx(
                  "flex h-9 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? cx(ACCENT_SOLID, "border-transparent") : cx(BORDER, "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"),
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className={cx("mt-1.5 flex justify-between text-[11px]", TEXT_CAPTION)}>
          <span>Not at all likely</span>
          <span>Extremely likely</span>
        </div>
      </div>
    );
  }

  if (question.type === "multiple_choice") {
    return (
      <div role="radiogroup" aria-label={question.prompt} className="flex flex-col gap-2">
        {(question.options ?? []).map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={cx(
                "flex min-h-11 items-center gap-2.5 rounded-lg border px-3.5 py-2 text-left text-sm font-medium",
                TRANSITION,
                FOCUS_RING,
                selected ? "border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200" : cx(BORDER, "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"),
              )}
            >
              <span
                aria-hidden="true"
                className={cx("grid h-4 w-4 shrink-0 place-items-center rounded-full border-2", selected ? "border-blue-600 dark:border-blue-400" : "border-zinc-300 dark:border-zinc-600")}
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" /> : null}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "rating") {
    const rating = value ? Number(value) : 0;
    return (
      <div>
        <div role="radiogroup" aria-label="Rating, 1 to 5" className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = n <= rating;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`Rate ${n} of 5`}
                onClick={() => onChange(String(n))}
                className={cx("grid h-11 w-11 place-items-center rounded-lg border", TRANSITION, FOCUS_RING, BORDER, "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-white/5")}
              >
                <Star size={20} aria-hidden="true" className={selected ? "fill-amber-400 text-amber-400" : "fill-none text-zinc-300 dark:text-zinc-600"} />
              </button>
            );
          })}
          {rating > 0 ? <span className={cx("ml-1 text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>{rating}/5</span> : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="preview-short-text" className="sr-only">
        {question.prompt}
      </label>
      <textarea
        id="preview-short-text"
        rows={3}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className={cx(
          "w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm",
          BORDER,
          "bg-white text-zinc-900 placeholder:text-zinc-500 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400",
          FOCUS_RING_INSET,
        )}
      />
    </div>
  );
}
