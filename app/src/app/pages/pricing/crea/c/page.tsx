'use client';

import { useMemo, useState } from 'react';

type TierId = 'free' | 'pro' | 'business';

interface QuizOption {
  label: string;
  desc: string;
  tier: TierId;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface TierFeature {
  label: string;
  included: boolean;
}

interface TierInfo {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  cta: string;
  popular?: boolean;
  features: TierFeature[];
}

const QUIZ: QuizQuestion[] = [
  {
    question: '한 달에 중고거래, 몇 번이나 하세요?',
    options: [
      { label: '가끔 구경만 해요', desc: '한두 번 둘러보는 정도예요', tier: 'free' },
      { label: '득템 사냥 중이에요', desc: '매주 여러 번 확인해요', tier: 'pro' },
      { label: '재고를 여러 개 굴려요', desc: '팀이나 사업자로 거래해요', tier: 'business' },
    ],
  },
  {
    question: '가격이 떨어지면 바로 알고 싶나요?',
    options: [
      { label: '아니요, 천천히 볼게요', desc: '주간 추천이면 충분해요', tier: 'free' },
      { label: '네, 실시간으로요', desc: '놓치면 손해니까요', tier: 'pro' },
      { label: '팀 전체가 봐야 해요', desc: '대시보드로 공유하고 싶어요', tier: 'business' },
    ],
  },
  {
    question: '매칭 데이터를 다른 시스템과 연결하나요?',
    options: [
      { label: '아니요, 혼자 써요', desc: '개인 용도예요', tier: 'free' },
      { label: '앱 알림이면 충분해요', desc: '바로 확인하는 편이에요', tier: 'pro' },
      { label: 'API로 연동하고 싶어요', desc: '내부 시스템에 붙일 거예요', tier: 'business' },
    ],
  },
];

const TIERS: Record<TierId, TierInfo> = {
  free: {
    name: 'Free',
    price: '₩0',
    tagline: '가볍게 둘러보고 싶다면',
    cta: '무료로 시작하기',
    features: [
      { label: '기본 AI 큐레이션', included: true },
      { label: '주간 추천 리스트', included: true },
      { label: '실시간 가격 하락 알림', included: false },
      { label: '무제한 매칭', included: false },
      { label: '팀 시트 · 셀러 대시보드', included: false },
      { label: 'API 연동', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: '₩9,900',
    period: '/월',
    tagline: '득템을 놓치고 싶지 않다면',
    cta: 'Pro 시작하기',
    popular: true,
    features: [
      { label: '기본 AI 큐레이션', included: true },
      { label: '무제한 매칭', included: true },
      { label: '실시간 가격 하락 알림', included: true },
      { label: '가격 추적 히스토리', included: true },
      { label: '팀 시트 · 셀러 대시보드', included: false },
      { label: 'API 연동', included: false },
    ],
  },
  business: {
    name: 'Business',
    price: '문의',
    tagline: '팀과 재고를 함께 굴린다면',
    cta: '영업팀에 문의하기',
    features: [
      { label: '기본 AI 큐레이션', included: true },
      { label: '무제한 매칭', included: true },
      { label: '실시간 가격 하락 알림', included: true },
      { label: '팀 시트', included: true },
      { label: '셀러 대시보드', included: true },
      { label: 'API 연동', included: true },
    ],
  },
};

const TIER_ORDER: TierId[] = ['free', 'pro', 'business'];

const REASON: Record<TierId, string> = {
  free: '지금은 가볍게 둘러보는 정도시네요. Free로 시작해도 AI 추천은 충분히 받아보실 수 있어요.',
  pro: '자주 득템을 노리고, 실시간 정보가 중요하시군요. Pro가 가장 잘 맞아요.',
  business: '팀 단위로 재고와 매칭을 다루시네요. Business로 대시보드와 API까지 활용해보세요.',
};

const FAQ: { q: string; a: string }[] = [
  {
    q: '구독은 언제든 해지할 수 있나요?',
    a: '네, Pro는 언제든 해지할 수 있어요. 해지 즉시 다음 결제부터 청구되지 않아요.',
  },
  {
    q: 'Free에서 Pro로 업그레이드하면 무엇이 달라지나요?',
    a: '무제한 매칭, 실시간 가격 하락 알림, 가격 추적 히스토리가 추가돼요.',
  },
  {
    q: 'Business 요금은 어떻게 책정되나요?',
    a: '팀 규모와 필요한 매칭 볼륨에 따라 맞춤 견적을 드려요. 영업팀에 문의해주세요.',
  },
];

function computeRecommendation(answers: TierId[]): TierId {
  const counts: Record<TierId, number> = { free: 0, pro: 0, business: 0 };
  answers.forEach((t) => {
    counts[t] += 1;
  });

  const priority: TierId[] = ['pro', 'free', 'business'];
  let best: TierId = 'pro';
  let bestCount = -1;
  for (const tier of priority) {
    if (counts[tier] > bestCount) {
      bestCount = counts[tier];
      best = tier;
    }
  }
  return best;
}

export default function Landing() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(TierId | null)[]>([null, null, null]);
  const [done, setDone] = useState(false);

  const recommended = useMemo(() => {
    if (!done) return null;
    return computeRecommendation(answers.filter((a): a is TierId => a !== null));
  }, [done, answers]);

  function handleSelect(tier: TierId) {
    const next = [...answers];
    next[step] = tier;
    setAnswers(next);

    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function resetQuiz() {
    setAnswers([null, null, null]);
    setStep(0);
    setDone(false);
  }

  const currentQuestion = QUIZ[step];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="text-sm font-bold tracking-tight text-slate-900">repick</span>
        <span className="text-xs font-medium text-slate-400">Pricing</span>
      </header>

      <main>
        {/* Hero + Quiz */}
        <section id="quiz" className="scroll-mt-6 px-4 pb-16 pt-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo-600">
              PRICING QUIZ
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              질문 3개, 그리고 당신의 플랜
            </h1>
            <p className="mt-3 text-base text-slate-500">
              AI가 취향을 큐레이션하듯, 요금제도 골라드릴게요. 30초면 충분해요.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            {!done ? (
              <div>
                <div className="mb-6 flex items-center justify-center gap-2">
                  {QUIZ.map((_, i) => (
                    <span
                      key={i}
                      className={
                        'h-1.5 rounded-full transition-all ' +
                        (i < step
                          ? 'w-6 bg-indigo-600'
                          : i === step
                            ? 'w-8 bg-indigo-400'
                            : 'w-6 bg-slate-200')
                      }
                    />
                  ))}
                </div>
                <p className="text-center text-xs font-medium text-slate-400">
                  질문 {step + 1} / {QUIZ.length}
                </p>
                <p className="mt-2 text-center text-lg font-semibold text-slate-900 sm:text-xl">
                  {currentQuestion.question}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[step] === opt.tier;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelect(opt.tier)}
                        className={
                          'w-full rounded-2xl border px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
                          (selected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40')
                        }
                      >
                        <span className="block text-sm font-semibold text-slate-900">
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              recommended && (
                <div aria-live="polite" className="text-center">
                  <p className="text-xs font-semibold tracking-[0.2em] text-indigo-600">
                    ✦ AI 매칭 완료
                  </p>
                  <p className="mt-3 text-sm text-slate-500">당신에게 맞는 플랜은</p>
                  <p className="mt-1 text-3xl font-bold text-indigo-600">
                    {TIERS[recommended].name}
                  </p>
                  <p className="mx-auto mt-4 max-w-sm text-sm text-slate-600">
                    {REASON[recommended]}
                  </p>

                  <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <a
                      href="#compare"
                      className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      {TIERS[recommended].cta}
                    </a>
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      다시 하기
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Full comparison */}
        <section id="compare" className="scroll-mt-6 bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                플랜을 직접 비교해보세요
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                퀴즈 없이도 언제든 원하는 플랜을 고를 수 있어요.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {TIER_ORDER.map((id) => {
                const tier = TIERS[id];
                const isRecommended = done && recommended === id;
                return (
                  <div
                    key={id}
                    className={
                      'relative flex flex-col rounded-3xl border bg-white p-6 transition ' +
                      (tier.popular
                        ? 'border-indigo-500 shadow-md'
                        : 'border-slate-200') +
                      (isRecommended
                        ? ' ring-2 ring-indigo-500 ring-offset-2 ring-offset-white'
                        : '')
                    }
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                        인기
                      </span>
                    )}
                    {isRecommended && (
                      <span className="absolute -top-3 right-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        당신의 추천
                      </span>
                    )}

                    <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{tier.tagline}</p>

                    <p className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-sm text-slate-400">{tier.period}</span>
                      )}
                    </p>

                    <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                      {tier.features.map((f) => (
                        <li
                          key={f.label}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span
                            className={
                              'mt-0.5 font-semibold ' +
                              (f.included ? 'text-indigo-600' : 'text-slate-300')
                            }
                            aria-hidden="true"
                          >
                            {f.included ? '✓' : '–'}
                          </span>
                          <span className={f.included ? '' : 'text-slate-400'}>
                            {f.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className={
                        'mt-7 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
                        (tier.popular
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900')
                      }
                    >
                      {tier.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              자주 묻는 질문
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    {item.q}
                    <span
                      className="ml-4 shrink-0 text-slate-400 transition group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-900 px-4 py-16 text-center sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              지금 나에게 맞는 플랜을 시작해보세요
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              언제든 업그레이드하거나 해지할 수 있어요.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="#compare"
                className="w-full rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:w-auto"
              >
                무료로 시작하기
              </a>
              <a
                href="#quiz"
                onClick={resetQuiz}
                className="w-full rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:w-auto"
              >
                퀴즈 다시 풀기
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
