"use client";

import { ClipboardList, TrendingDown, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import PreviewPane from "./PreviewPane";
import QuestionRail from "./QuestionRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { completing, nf, pf1, SURVEY, SURVEY_QUESTIONS, nextAddedQuestion, type Question, type QuestionType } from "./data";
import { CARD, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader } from "./ui";

export default function NudgeClient() {
  const [questions, setQuestions] = useState<Question[]>(SURVEY_QUESTIONS);
  const [selectedId, setSelectedId] = useState<string>(SURVEY_QUESTIONS[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectedIndex = Math.max(0, questions.findIndex((q) => q.id === selectedId));

  function handleUpdateQuestion(id: string, patch: Partial<Question>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function handleSelectIndex(i: number) {
    const clamped = Math.max(0, Math.min(questions.length - 1, i));
    setSelectedId(questions[clamped].id);
  }

  function handleAddQuestion(type: QuestionType) {
    setQuestions((prev) => {
      const created = nextAddedQuestion(type, prev.length);
      setSelectedId(created.id);
      return [...prev, created];
    });
    setPaletteOpen(false);
  }

  function handleJumpToQuestion(id: string) {
    setSelectedId(id);
    setPaletteOpen(false);
  }

  const stats = useMemo(() => {
    const first = questions[0];
    const last = questions[questions.length - 1];
    const started = first?.entering ?? 0;
    const finished = completing(last) ?? 0;
    const totalDropped = questions.reduce((sum, q) => sum + (q.dropoff ?? 0), 0);
    const overallRate = started > 0 ? Math.round((finished / started) * 1000) / 10 : 0;
    return { started, finished, totalDropped, overallRate };
  }, [questions]);

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-white dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>{SURVEY.title}</h1>
                <p className={cx("mt-0.5 max-w-2xl text-sm", TEXT_CAPTION)}>
                  {SURVEY.status} · {questions.length} questions · {SURVEY.audience}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InlineStat icon={Users} label="Started" value={nf.format(stats.started)} />
                <InlineStat icon={ClipboardList} label="Completed" value={`${nf.format(stats.finished)} (${pf1.format(stats.overallRate)}%)`} />
                <InlineStat icon={TrendingDown} label="Total dropped" value={nf.format(stats.totalDropped)} />
              </div>
            </header>

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr]">
              <Card className={cx(CARD, "min-w-0 p-4 sm:p-5")}>
                <CardHeader title="Questions" description="Select a question to edit its settings and preview it live." />
                <div className="mt-4">
                  <QuestionRail questions={questions} selectedId={selectedId} onSelectId={setSelectedId} onUpdateQuestion={handleUpdateQuestion} />
                </div>
              </Card>

              <div className="min-w-0">
                <PreviewPane questions={questions} selectedIndex={selectedIndex} onSelectIndex={handleSelectIndex} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette questions={questions} onClose={() => setPaletteOpen(false)} onJumpToQuestion={handleJumpToQuestion} onAddQuestion={handleAddQuestion} />
      ) : null}
    </div>
  );
}

function InlineStat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-0.5 truncate text-lg font-semibold tabular-nums", TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
