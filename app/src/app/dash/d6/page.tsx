import type { Metadata } from "next";
import { BookOpen, Home, Sparkles, Users } from "lucide-react";
import { MoodSpiralPanel, RelationshipGrid } from "./client";
import {
  HEADER_STATS,
  INSIGHTS,
  JOURNAL_ENTRIES,
  MOODS,
  TODAY_LABEL,
  WEEKLY_RHYTHM,
} from "./lib";
import "./d6.css";

export const metadata: Metadata = {
  title: "결(GYEOL) — 오늘의 결",
  description: "감정의 결과 관계의 온도를 매일 기록하는 개인 저널 대시보드.",
};

const NAV_ITEMS = [
  { key: "today", label: "오늘", href: "#d6-top", Icon: Home, current: true },
  { key: "journal", label: "기록", href: "#d6-journal-heading", Icon: BookOpen, current: false },
  {
    key: "relationships",
    label: "관계",
    href: "#d6-relationship-heading",
    Icon: Users,
    current: false,
  },
  { key: "insights", label: "인사이트", href: "#d6-insights-heading", Icon: Sparkles, current: false },
] as const;

const maxRhythm = Math.max(...WEEKLY_RHYTHM.map((d) => d.value));

export default function Dashboard() {
  return (
    <div className="d6-root d6-paper-texture min-h-screen font-sans">
      <a
        href="#d6-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--ink)]"
      >
        본문 바로가기
      </a>

      <div className="mx-auto flex max-w-[1400px]">
        <aside
          aria-label="사이드바"
          className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:border-[var(--line)] lg:bg-[var(--paper-soft)]/60 lg:px-6 lg:py-8"
        >
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[var(--ink)]">결</span>
              <span className="d6-font-display text-sm text-[var(--ink-faint)]">GYEOL</span>
            </div>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">감정과 관계의 결을 기록해요</p>

            <nav aria-label="주 메뉴" className="mt-10">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ key, label, href, Icon, current }) => (
                  <li key={key}>
                    <a
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                        current
                          ? "d6-nav-current text-[var(--ink)]"
                          : "text-[var(--ink-soft)] hover:bg-[var(--paper-card)]"
                      }`}
                    >
                      <Icon aria-hidden="true" size={18} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-card)] px-3 py-2.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              style={{ backgroundColor: "var(--mood-tender-tint)", color: "var(--mood-tender-text)" }}
            >
              다
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--ink)]">다인님의 결</p>
              <p className="truncate text-xs text-[var(--ink-soft)]">개인 워크스페이스</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <main id="d6-main" className="mx-auto max-w-5xl px-4 pt-8 pb-28 sm:px-6 lg:px-10 lg:pb-16">
            <header id="d6-top" className="relative overflow-hidden rounded-[40px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <span
                  className="d6-blob absolute -top-10 -left-14 h-64 w-64"
                  style={{ backgroundColor: "var(--mood-joy-tint)", opacity: 0.7 }}
                />
                <span
                  className="d6-blob absolute -top-16 right-0 h-56 w-72"
                  style={{ backgroundColor: "var(--mood-tender-tint)", opacity: 0.55 }}
                />
                <span
                  className="d6-blob absolute top-20 left-1/3 h-40 w-40"
                  style={{ backgroundColor: "var(--mood-calm-tint)", opacity: 0.5 }}
                />
              </div>

              <div className="relative px-2 py-6 sm:px-4">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="text-sm text-[var(--ink-soft)]">{TODAY_LABEL}</p>
                    <h1 className="mt-2 max-w-xl text-3xl font-semibold text-balance text-[var(--ink)] sm:text-4xl">
                      안녕하세요, 다인님. 오늘의 결을 살펴볼까요?
                    </h1>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--paper-card)] px-3 py-2 lg:hidden">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ backgroundColor: "var(--mood-tender-tint)", color: "var(--mood-tender-text)" }}
                    >
                      다
                    </span>
                    <span className="text-sm font-medium text-[var(--ink)]">다인님의 결</span>
                  </div>
                </div>

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                  <div>
                    <dt className="text-xs text-[var(--ink-soft)]">이번 달 기록</dt>
                    <dd className="mt-0.5 flex items-baseline gap-1">
                      <span className="d6-font-display d6-tabular text-3xl text-[var(--ink)]">
                        {HEADER_STATS.entriesThisMonth}
                      </span>
                      <span className="text-sm text-[var(--ink-soft)]">개</span>
                    </dd>
                  </div>
                  <div aria-hidden="true" className="hidden h-10 w-px self-center bg-[var(--line-strong)] sm:block" />
                  <div>
                    <dt className="text-xs text-[var(--ink-soft)]">관계 평균 온도</dt>
                    <dd className="mt-0.5 flex items-baseline gap-1">
                      <span className="d6-font-display d6-tabular text-3xl text-[var(--ink)]">
                        {HEADER_STATS.avgWarmth}
                      </span>
                      <span className="text-sm text-[var(--ink-soft)]">도</span>
                    </dd>
                  </div>
                  <div aria-hidden="true" className="hidden h-10 w-px self-center bg-[var(--line-strong)] sm:block" />
                  <div>
                    <dt className="text-xs text-[var(--ink-soft)]">연속 기록</dt>
                    <dd className="mt-0.5 flex items-baseline gap-1">
                      <span className="d6-font-display d6-tabular text-3xl text-[var(--ink)]">
                        {HEADER_STATS.streakDays}
                      </span>
                      <span className="text-sm text-[var(--ink-soft)]">일째</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </header>

            <div className="mt-8">
              <MoodSpiralPanel />
            </div>

            <RelationshipGrid />

            <section aria-labelledby="d6-journal-heading" className="mt-14">
              <h2 id="d6-journal-heading" className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
                최근 기록
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                짧은 문장으로 남긴 하루의 결이에요.
              </p>

              <ol className="mt-7 flex flex-col gap-8 border-l border-dashed border-[var(--line-strong)] pl-6 sm:pl-8">
                {JOURNAL_ENTRIES.map((entry) => {
                  const mood = MOODS[entry.mood];
                  return (
                    <li key={entry.id} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 -left-[calc(1.5rem+5px)] h-2.5 w-2.5 rounded-full sm:-left-[calc(2rem+5px)]"
                        style={{ backgroundColor: mood.solid }}
                      />
                      <p className="text-xs text-[var(--ink-soft)]">
                        {entry.dateLabel}
                        {entry.tag ? ` · ${entry.tag}` : ""}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: mood.tint, color: mood.text }}
                        >
                          {mood.label}
                        </span>
                        <span className="font-semibold text-[var(--ink)]">{entry.title}</span>
                      </p>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                        {entry.excerpt}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section
              aria-labelledby="d6-insights-heading"
              className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="d6-card p-6 sm:p-8">
                <h2 id="d6-insights-heading" className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
                  패턴 인사이트
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  기록을 바탕으로 결이 알려주는 이야기예요.
                </p>
                <ul className="mt-5 flex flex-col gap-4">
                  {INSIGHTS.map((text) => (
                    <li key={text} className="flex gap-3 text-sm leading-relaxed text-[var(--ink)]">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--clay-solid)" }}
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d6-card p-6 sm:p-8">
                <h3 className="text-base font-semibold text-[var(--ink)]">이번 주 기록 리듬</h3>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  요일별로 얼마나 자주 마음을 기록했는지 보여줘요.
                </p>
                <div
                  role="img"
                  aria-label={`요일별 기록 수. ${WEEKLY_RHYTHM.map((d) => `${d.day}요일 ${d.value}개`).join(", ")}`}
                  className="mt-7 flex items-end gap-2.5 sm:gap-3"
                >
                  {WEEKLY_RHYTHM.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        aria-hidden="true"
                        className="flex h-24 w-full items-end overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--paper-soft)" }}
                      >
                        <div
                          className="w-full rounded-full"
                          style={{
                            height: `${(d.value / maxRhythm) * 100}%`,
                            backgroundColor: "var(--mood-calm-solid)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--ink-soft)]">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--ink-soft)]">
              결은 당신이 남긴 기록을 안전하게 지켜요. 모든 통계는 오늘 오전 기준 스냅샷이에요.
            </footer>
          </main>
        </div>
      </div>

      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-[var(--line)] bg-[var(--paper-card)]/95 px-2 py-2 backdrop-blur-sm lg:hidden"
      >
        {NAV_ITEMS.map(({ key, label, href, Icon, current }) => (
          <a
            key={key}
            href={href}
            aria-current={current ? "page" : undefined}
            className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
              current ? "d6-nav-current text-[var(--ink)]" : "text-[var(--ink-soft)]"
            }`}
          >
            <Icon aria-hidden="true" size={20} />
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
