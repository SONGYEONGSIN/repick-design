"use client";

import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { completing, completionRatePct, defaultsForType, nf, pf1, QUESTION_TYPE_META, type Question, type QuestionType } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, TRANSITION, cx, rateTone } from "./tokens";
import { Badge, EyebrowLabel, FunnelBar, SegmentedControl, Switch } from "./ui";

const TYPE_OPTIONS: { value: QuestionType; label: string; Icon: (typeof QUESTION_TYPE_META)["nps"]["Icon"] }[] = (Object.keys(QUESTION_TYPE_META) as QuestionType[]).map((t) => ({
  value: t,
  label: QUESTION_TYPE_META[t].label,
  Icon: QUESTION_TYPE_META[t].Icon,
}));

export default function QuestionRail({
  questions,
  selectedId,
  onSelectId,
  onUpdateQuestion,
}: {
  questions: Question[];
  selectedId: string;
  onSelectId: (id: string) => void;
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void;
}) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function moveFocus(fromId: string, key: string) {
    const ids = questions.map((q) => q.id);
    const idx = ids.indexOf(fromId);
    let nextIdx = idx;
    if (key === "ArrowDown") nextIdx = Math.min(ids.length - 1, idx + 1);
    else if (key === "ArrowUp") nextIdx = Math.max(0, idx - 1);
    else if (key === "Home") nextIdx = 0;
    else if (key === "End") nextIdx = ids.length - 1;
    else return;
    const nextId = ids[nextIdx];
    onSelectId(nextId);
    btnRefs.current[nextId]?.focus();
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-0.5">
        <EyebrowLabel>{questions.length} questions</EyebrowLabel>
        <EyebrowLabel>Use ↑ / ↓ to navigate</EyebrowLabel>
      </div>

      <ul className="flex flex-col gap-1.5">
        {questions.map((q, i) => {
          const selected = q.id === selectedId;
          const rate = completionRatePct(q);
          const dropoff = q.dropoff;
          const settingsId = `question-settings-${q.id}`;

          return (
            <li key={q.id} className={cx("overflow-hidden rounded-xl border", selected ? "border-blue-300 dark:border-blue-500/40" : BORDER, "bg-white dark:bg-zinc-900", TRANSITION)}>
              <button
                ref={(el) => {
                  btnRefs.current[q.id] = el;
                }}
                type="button"
                aria-expanded={selected}
                aria-controls={settingsId}
                onClick={() => onSelectId(q.id)}
                onKeyDown={(e) => {
                  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
                    e.preventDefault();
                    moveFocus(q.id, e.key);
                  }
                }}
                className={cx("flex w-full flex-col gap-2 px-3 py-2.5 text-left", TRANSITION, FOCUS_RING_INSET, selected ? "bg-blue-50/70 dark:bg-blue-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]")}
              >
                <span className="flex items-center gap-2.5">
                  <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-lg", selected ? ACCENT_SUBTLE : cx("bg-zinc-100 dark:bg-zinc-800", TEXT_CAPTION))}>
                    <TypeRowIcon type={q.type} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("flex items-center gap-1.5 truncate text-sm font-medium", TEXT_PRIMARY)}>
                      <span className={cx("shrink-0 text-xs font-semibold tabular-nums", TEXT_CAPTION)}>Q{i + 1}</span>
                      <span className="truncate">{q.label}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {q.required ? <Badge tone={TONE.info}>Required</Badge> : null}
                    <ChevronDown size={15} aria-hidden="true" className={cx(TEXT_CAPTION, "transition-transform duration-150 motion-reduce:transition-none", selected && "rotate-180")} />
                  </span>
                </span>

                <span className="flex items-center gap-2.5 pl-9">
                  <span className="min-w-0 flex-1">
                    <FunnelBar ratePct={rate} />
                  </span>
                  <span className={cx("shrink-0 text-[11px] font-medium tabular-nums", rate === undefined ? TEXT_CAPTION : TONE[rateTone(rate)].text)}>
                    {rate === undefined ? "Not live yet" : `${pf1.format(rate)}% · -${nf.format(dropoff ?? 0)}`}
                  </span>
                </span>
              </button>

              {selected ? (
                <div id={settingsId} className={cx("border-t px-3.5 py-3.5", BORDER, "bg-zinc-50/70 dark:bg-zinc-950/40")}>
                  <h3 className={cx("text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Question settings</h3>

                  <div className="mt-2.5">
                    <span className={cx("mb-1.5 block text-xs font-medium", TEXT_SECONDARY)}>Question type</span>
                    <SegmentedControl<QuestionType>
                      ariaLabel={`Question type for ${q.label}`}
                      value={q.type}
                      onChange={(type) => onUpdateQuestion(q.id, { type, ...defaultsForType(type) })}
                      options={TYPE_OPTIONS}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center gap-2.5">
                    <Switch checked={q.required} onChange={(v) => onUpdateQuestion(q.id, { required: v })} label={`Require an answer for ${q.label}`} id={`required-toggle-${q.id}`} />
                    <label htmlFor={`required-toggle-${q.id}`} className={cx("text-sm font-medium", TEXT_PRIMARY)}>
                      Required
                    </label>
                  </div>

                  <div className="mt-3.5">
                    <span className={cx("mb-1.5 block text-xs font-medium", TEXT_SECONDARY)}>Conditional logic</span>
                    {q.logic && q.logic.length > 0 ? (
                      <ul className="flex flex-col gap-1.5">
                        {q.logic.map((b, bi) => {
                          const targetIdx = questions.findIndex((tq) => tq.id === b.targetId);
                          return (
                            <li key={bi} className={cx("rounded-lg border px-2.5 py-1.5 text-xs", TONE.attn.bg, TONE.attn.border, TONE.attn.text)}>
                              If <span className="font-semibold">{b.conditionLabel}</span> → skip to{" "}
                              <span className="font-semibold">{targetIdx >= 0 ? `Q${targetIdx + 1}` : b.targetId}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className={cx("text-xs", TEXT_CAPTION)}>No branching — always continues to the next question.</p>
                    )}
                  </div>

                  {rate !== undefined ? (
                    <p className={cx("mt-3.5 text-xs", TEXT_CAPTION)}>
                      {nf.format(q.entering ?? 0)} respondents reached this question · {nf.format(completing(q) ?? 0)} continued · {nf.format(dropoff ?? 0)} dropped off.
                    </p>
                  ) : (
                    <p className={cx("mt-3.5 text-xs", TEXT_CAPTION)}>This question has no live analytics yet — publish the survey to start collecting responses.</p>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TypeRowIcon({ type }: { type: QuestionType }) {
  const Icon = QUESTION_TYPE_META[type].Icon;
  return <Icon size={14} aria-hidden="true" />;
}
