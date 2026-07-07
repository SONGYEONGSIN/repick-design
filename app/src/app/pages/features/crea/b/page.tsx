'use client';

import { useEffect, useState } from 'react';

interface Stage {
  label: string;
  icon: string;
  headline: string;
  description: string;
  stat: string;
}

const STAGES: Stage[] = [
  {
    label: '취향 학습',
    icon: '👀',
    headline: '찜하고, 클릭하고, 구매한 흔적을 읽습니다',
    description:
      '찜 목록과 클릭 패턴, 지난 구매 이력을 모아 취향의 지문을 만듭니다. 아무것도 입력하지 않아도 repick은 이미 당신을 압니다.',
    stat: '평균 47회의 행동 데이터로 취향 프로필을 완성해요',
  },
  {
    label: 'AI 매칭',
    icon: '🧠',
    headline: '수만 개 매물 속에서 당신의 것만 골라냅니다',
    description:
      '전국 중고 매물 데이터베이스를 실시간으로 스캔해 취향 프로필과의 일치도를 계산합니다. 사람이 하루 종일 뒤져도 못 찾을 상품을 몇 초 만에 찾아냅니다.',
    stat: '평균 12,400개 매물 → 32개로 압축돼요',
  },
  {
    label: '신뢰 검증',
    icon: '🛡️',
    headline: '상태, 가격, 판매자까지 세 번 확인합니다',
    description:
      '사진 속 흠집까지 살피는 상태 판독, 동일 모델 시세 대비 적정가 계산, 판매자 거래 이력 검증을 모두 통과해야 추천 목록에 오릅니다.',
    stat: '검증 통과율 61% — 나머지는 조용히 걸러져요',
  },
  {
    label: '실시간 알림',
    icon: '🔔',
    headline: '가격이 떨어지는 순간, 가장 먼저 알려드립니다',
    description:
      '검증까지 마친 상품이라도 끝이 아닙니다. 가격이 내려가거나 더 나은 매물이 뜨면 그 순간 다시 알림으로 찾아갑니다.',
    stat: '평균 알림 도달 시간 3분 이내예요',
  },
];

const STAGE_STYLES = [
  {
    text: 'text-slate-600',
    ring: 'border-slate-500 bg-slate-500',
    chip: 'bg-slate-100 text-slate-700',
    line: 'bg-slate-500',
    border: 'border-slate-300',
    card: 'border-slate-300',
  },
  {
    text: 'text-violet-600',
    ring: 'border-violet-500 bg-violet-500',
    chip: 'bg-violet-100 text-violet-700',
    line: 'bg-violet-500',
    border: 'border-violet-300',
    card: 'border-violet-300',
  },
  {
    text: 'text-emerald-600',
    ring: 'border-emerald-500 bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-700',
    line: 'bg-emerald-500',
    border: 'border-emerald-300',
    card: 'border-emerald-300',
  },
  {
    text: 'text-amber-600',
    ring: 'border-amber-500 bg-amber-500',
    chip: 'bg-amber-100 text-amber-700',
    line: 'bg-amber-500',
    border: 'border-amber-300',
    card: 'border-amber-300',
  },
];

const AUTOPLAY_MS = 4200;

export default function Landing() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const stage = STAGES[currentStage];
  const style = STAGE_STYLES[currentStage];
  const leftPercent = ((currentStage + 0.5) / STAGES.length) * 100;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const id = window.setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % STAGES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, reducedMotion]);

  function goToStage(index: number) {
    setCurrentStage(index);
    setIsPlaying(false);
  }

  return (
    <div id="top" className="rpk-root min-h-screen bg-stone-50 text-stone-900">
      <style>{`
        @keyframes rpk-pop {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rpk-chip-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpk-scan {
          0% { left: -20%; }
          100% { left: 110%; }
        }
        @keyframes rpk-bounce-in {
          0% { opacity: 0; transform: translateY(-8px) scale(0.92); }
          60% { opacity: 1; transform: translateY(2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .rpk-chip-in { animation: rpk-chip-in 0.4s ease-out both; }
        .rpk-delay-1 { animation-delay: 0.1s; }
        .rpk-delay-2 { animation-delay: 0.2s; }
        .rpk-scan { animation: rpk-scan 1.6s ease-in-out infinite; }
        .rpk-bounce-in { animation: rpk-bounce-in 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .rpk-root *,
          .rpk-root *::before,
          .rpk-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <a
        href="#pipeline"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-violet-700 focus:shadow-lg"
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-stone-900">repick</span>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#pipeline"
              className="hidden rounded text-stone-600 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:inline"
            >
              흐름 보기
            </a>
            <a
              href="#cta"
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              무료로 시작하기
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
            Features, as a flow
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            기능이 아니라, 하나의 흐름입니다
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
            중고 상품 하나가 당신 손에 닿기까지, repick 안에서 무슨 일이 일어나는지 아래에서 직접
            지켜보세요.
          </p>
        </section>

        <section
          id="pipeline"
          aria-labelledby="pipeline-heading"
          className="mx-auto max-w-4xl px-4 pb-20 sm:px-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="pipeline-heading" className="text-lg font-semibold text-stone-900 sm:text-xl">
              상품 하나가 지나가는 4단계
            </h2>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-pressed={isPlaying}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
              {isPlaying ? '자동 재생 중' : '자동 재생 멈춤'}
            </button>
          </div>

          <p className="mt-2 text-xs text-stone-400 sm:hidden">→ 옆으로 스크롤해 4단계를 확인하세요</p>

          <div className="mt-6 overflow-x-auto pb-2">
            <div className="min-w-[680px] md:min-w-0">
              {/* station row */}
              <div className="relative">
                <div
                  className="absolute left-[12.5%] right-[12.5%] top-[22px] h-0.5 bg-stone-200"
                  aria-hidden="true"
                />
                <div
                  className={`absolute top-[22px] h-0.5 transition-all duration-700 ease-in-out ${style.line}`}
                  style={{ left: '12.5%', width: `calc(${leftPercent}% - 12.5%)` }}
                  aria-hidden="true"
                />
                <div className="relative grid grid-cols-4">
                  {STAGES.map((s, i) => {
                    const active = currentStage === i;
                    const passed = currentStage > i;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => goToStage(i)}
                        aria-current={active ? 'step' : undefined}
                        className="flex flex-col items-center gap-2 rounded-lg py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg transition-colors duration-500 ${
                            active || passed
                              ? `${STAGE_STYLES[i].ring} text-white`
                              : 'border-stone-300 bg-white text-stone-400'
                          }`}
                        >
                          {s.icon}
                        </span>
                        <span
                          className={`text-center text-[11px] font-medium sm:text-xs ${
                            active ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* traveling product card */}
              <div className="relative mt-6 min-h-[220px] sm:min-h-[200px]">
                <div
                  className="absolute top-0 -translate-x-1/2 transition-[left] duration-700 ease-in-out"
                  style={{ left: `${leftPercent}%` }}
                >
                  <div
                    key={currentStage}
                    className={`w-52 rounded-2xl border-2 bg-white p-4 shadow-xl transition-colors duration-500 sm:w-60 ${style.card}`}
                    style={{ animation: 'rpk-pop 0.5s ease-out' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-xl">
                        👟
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.chip}`}>
                        STEP {currentStage + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-stone-900">빈티지 러닝화 · 260</p>

                    {currentStage === 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rpk-chip-in rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">
                          찜 12
                        </span>
                        <span className="rpk-chip-in rpk-delay-1 rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">
                          클릭 34
                        </span>
                        <span className="rpk-chip-in rpk-delay-2 rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">
                          최근 구매 스니커즈
                        </span>
                      </div>
                    )}

                    {currentStage === 1 && (
                      <div className="relative mt-3 overflow-hidden rounded-lg bg-violet-50 p-2">
                        <div className="rpk-scan pointer-events-none absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
                        <p className="relative text-[11px] font-semibold text-violet-700">일치율 94%</p>
                        <p className="relative text-[11px] text-violet-500">12,400개 중 32개로 압축</p>
                      </div>
                    )}

                    {currentStage === 2 && (
                      <ul className="mt-3 space-y-1 text-[11px] font-medium text-emerald-700">
                        <li className="rpk-chip-in">✓ 상태 A급</li>
                        <li className="rpk-chip-in rpk-delay-1">✓ 정가 대비 −32%</li>
                        <li className="rpk-chip-in rpk-delay-2">✓ 판매자 인증</li>
                      </ul>
                    )}

                    {currentStage === 3 && (
                      <div className="rpk-bounce-in mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2">
                        <p className="text-[11px] font-semibold text-amber-700">🔔 가격이 5% 내렸어요</p>
                        <p className="text-[11px] text-amber-600">지금이 놓치지 않을 타이밍</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* detail panel */}
          <div
            aria-live="polite"
            className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${style.text}`}>
              STEP {currentStage + 1} · {stage.label}
            </p>
            <h3 className="mt-2 text-lg font-bold text-stone-900 sm:text-xl">{stage.headline}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">{stage.description}</p>
            <p className="mt-3 text-xs font-medium text-stone-400">{stage.stat}</p>
          </div>
        </section>

        <section
          aria-labelledby="recap-heading"
          className="border-t border-stone-200 bg-white py-16"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 id="recap-heading" className="text-center text-lg font-semibold text-stone-900 sm:text-xl">
              네 단계, 한눈에
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STAGES.map((s, i) => (
                <div key={s.label} className={`rounded-xl border bg-stone-50 p-4 ${STAGE_STYLES[i].border}`}>
                  <span className="text-xl" aria-hidden="true">
                    {s.icon}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-stone-900">{s.label}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{s.stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="bg-stone-900 py-16 text-center text-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">지금, 당신의 흐름을 시작하세요</h2>
            <p className="mt-3 text-sm text-stone-300 sm:text-base">
              취향을 등록하는 순간부터, 나머지는 repick의 파이프라인이 대신 움직입니다.
            </p>
            <a
              href="#top"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-50 py-8 text-center text-xs text-stone-400">
        © repick — 취향학습 · AI매칭 · 신뢰검증 · 실시간알림
      </footer>
    </div>
  );
}
