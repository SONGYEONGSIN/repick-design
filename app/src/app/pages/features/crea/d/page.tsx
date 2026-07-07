'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type FeedTag = '학습' | '매칭' | '검증' | '알림';

interface FeedEvent {
  id: number;
  tag: FeedTag;
  title: string;
  detail: string;
  time: string;
}

const TAGS: FeedTag[] = ['학습', '매칭', '검증', '알림'];

const TAG_STYLE: Record<FeedTag, { badge: string; dot: string }> = {
  학습: { badge: 'bg-violet-500/15 text-violet-300 ring-violet-400/30', dot: 'bg-violet-400' },
  매칭: { badge: 'bg-sky-500/15 text-sky-300 ring-sky-400/30', dot: 'bg-sky-400' },
  검증: { badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30', dot: 'bg-emerald-400' },
  알림: { badge: 'bg-amber-500/15 text-amber-300 ring-amber-400/30', dot: 'bg-amber-400' },
};

const TAG_STYLE_LIGHT: Record<FeedTag, string> = {
  학습: 'bg-violet-50 text-violet-700',
  매칭: 'bg-sky-50 text-sky-700',
  검증: 'bg-emerald-50 text-emerald-700',
  알림: 'bg-amber-50 text-amber-700',
};

const POOL: Record<FeedTag, { title: string; detail: string }[]> = {
  학습: [
    { title: '취향 학습 갱신', detail: '미니멀 원목 가구 선호 패턴 감지' },
    { title: '취향 학습 갱신', detail: '최근 7일 클릭 데이터로 카테고리 가중치 재계산' },
    { title: '취향 학습 갱신', detail: '빈티지 조명 3회 찜 → 관심 태그 상위 등록' },
    { title: '취향 학습 갱신', detail: '선호 가격대 28만~45만원 구간으로 조정' },
  ],
  매칭: [
    { title: 'AI 매칭 성사', detail: '북유럽 원목 책상, 일치도 94%로 포착' },
    { title: 'AI 매칭 성사', detail: '매물 87,412건 중 상위 0.3% 후보 3건 추출' },
    { title: 'AI 매칭 성사', detail: '캠핑 체어 신규 등록과 즉시 대조 완료' },
    { title: 'AI 매칭 성사', detail: '취향 벡터 91% 근접 매물 1건 발견' },
  ],
  검증: [
    { title: '신뢰 검증 완료', detail: '판매자 거래 이력 42건, 신원 확인 통과' },
    { title: '신뢰 검증 완료', detail: '사진 12장 분석 → 상태 등급 A- 확정' },
    { title: '신뢰 검증 완료', detail: '시세 대비 가격 적정성 합리적 판정' },
    { title: '신뢰 검증 완료', detail: '허위매물 위험도 0.8%, 안전 매물' },
  ],
  알림: [
    { title: '실시간 알림 발송', detail: '찜한 스탠드 조명, 가격 12% 하락 감지' },
    { title: '실시간 알림 발송', detail: '관심 카테고리 신규 매칭 알림 전송' },
    { title: '실시간 알림 발송', detail: '가격 하락 알림 214명에게 즉시 전송' },
    { title: '실시간 알림 발송', detail: '원목 테이블, 24시간 내 재입고 알림' },
  ],
};

const SEED: FeedEvent[] = [
  { id: -5, tag: '알림', title: '실시간 알림 발송', detail: '찜한 스탠드 조명, 가격 12% 하락 감지', time: '방금 전' },
  { id: -4, tag: '검증', title: '신뢰 검증 완료', detail: '사진 12장 분석 → 상태 등급 A- 확정', time: '5초 전' },
  { id: -3, tag: '매칭', title: 'AI 매칭 성사', detail: '북유럽 원목 책상, 일치도 94%로 포착', time: '11초 전' },
  { id: -2, tag: '학습', title: '취향 학습 갱신', detail: '미니멀 원목 가구 선호 패턴 감지', time: '18초 전' },
  { id: -1, tag: '매칭', title: 'AI 매칭 성사', detail: '매물 87,412건 중 상위 0.3% 후보 3건 추출', time: '24초 전' },
];

const MAX_ITEMS = 6;

function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function LiveFeedPanel() {
  const [items, setItems] = useState<FeedEvent[]>(SEED);
  const [matchCount, setMatchCount] = useState(1204);
  const idRef = useRef(0);
  const cursorRef = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const tag = TAGS[cursorRef.current % TAGS.length];
      cursorRef.current += 1;
      const pool = POOL[tag];
      const choice = pool[Math.floor(Math.random() * pool.length)];
      idRef.current += 1;

      const next: FeedEvent = {
        id: idRef.current,
        tag,
        title: choice.title,
        detail: choice.detail,
        time: formatClock(new Date()),
      };

      setItems((prev) => [next, ...prev].slice(0, MAX_ITEMS));
      if (tag === '매칭') setMatchCount((c) => c + 1);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-slate-950/40 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="tracking-wide text-rose-400">LIVE</span>
          <span className="hidden text-slate-600 sm:inline">·</span>
          <span className="hidden font-mono text-slate-500 sm:inline">
            오늘 {matchCount.toLocaleString('ko-KR')}건 매칭
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-400">AI 매칭 엔진 실시간 로그</p>

      <ul aria-label="실시간 매칭 로그" className="relative flex h-[380px] flex-col gap-2 overflow-hidden">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="feed-item flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
            style={{ opacity: Math.max(1 - i * 0.15, 0.2) }}
          >
            <span
              className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TAG_STYLE[item.tag].badge}`}
            >
              {item.tag}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-slate-100">{item.title}</span>
              <span className="block truncate text-xs text-slate-400">{item.detail}</span>
            </span>
            <span className="shrink-0 font-mono text-[11px] text-slate-500">{item.time}</span>
          </li>
        ))}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent"
        />
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-4">
        {TAGS.map((tag) => (
          <span key={tag} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full ${TAG_STYLE[tag].dot}`} aria-hidden="true" />
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        * 위 피드는 repick AI 매칭 엔진의 동작 방식을 실시간처럼 시각화한 데모입니다.
      </p>
    </div>
  );
}

function PreferenceBars() {
  const data = [
    { label: '원목 가구', pct: 82, color: 'bg-violet-400' },
    { label: '미니멀 조명', pct: 67, color: 'bg-violet-400/80' },
    { label: '빈티지 소품', pct: 54, color: 'bg-violet-400/60' },
  ];
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {data.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>{row.label}</span>
            <span className="font-mono">{row.pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchRing() {
  return (
    <div className="flex items-center gap-5">
      <div
        className="relative h-24 w-24 shrink-0 rounded-full"
        style={{ background: 'conic-gradient(#38bdf8 94%, #e2e8f0 0)' }}
        aria-hidden="true"
      >
        <div className="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-lg font-bold text-slate-900">94%</span>
          <span className="text-[10px] text-slate-500">일치도</span>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        북유럽 원목 책상
        <br />
        87,412건 중 최상위 후보
      </p>
    </div>
  );
}

function VerifyChecklist() {
  const checks = ['판매자 신원·거래 이력 확인', '사진 12장 기반 상태 등급 산정', '시세 대비 가격 적정성 판정'];
  return (
    <ul className="flex w-full max-w-xs flex-col gap-2.5">
      {checks.map((c) => (
        <li key={c} className="flex items-center gap-2.5 text-sm text-slate-600">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </span>
          {c}
        </li>
      ))}
    </ul>
  );
}

function NotifyBell() {
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center" aria-hidden="true">
        <span className="ping-ring absolute h-full w-full rounded-full bg-amber-300/40" />
        <span className="ping-ring absolute h-full w-full rounded-full bg-amber-300/30 [animation-delay:0.6s]" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🔔
        </span>
      </div>
      <p className="text-sm text-slate-500">
        가격 하락 · 신규 매칭
        <br />
        발견 즉시 알려드려요
      </p>
    </div>
  );
}

const FEATURES: { tag: FeedTag; title: string; desc: string; visual: ReactNode }[] = [
  {
    tag: '학습',
    title: '취향 학습 — 말하지 않아도 압니다',
    desc: '찜, 클릭, 머무른 시간까지. repick은 따로 설정하지 않아도 행동 데이터만으로 취향을 읽어냅니다. 쓸수록 더 정교해져요.',
    visual: <PreferenceBars />,
  },
  {
    tag: '매칭',
    title: 'AI 매칭 — 수만 개 중 당신의 것 하나',
    desc: '매일 새로 올라오는 수만 건의 매물을 실시간으로 대조합니다. 취향 벡터와 90% 이상 겹치는 매물만 골라 보여드려요.',
    visual: <MatchRing />,
  },
  {
    tag: '검증',
    title: '신뢰 검증 — 안심하고 결제할 수 있도록',
    desc: '판매자 이력, 상품 상태, 시세 적정성까지 3단계로 확인합니다. 검증을 통과한 매물만 당신에게 도착해요.',
    visual: <VerifyChecklist />,
  },
  {
    tag: '알림',
    title: '실시간 알림 — 가장 먼저 아는 사람',
    desc: '가격이 떨어지거나 딱 맞는 매물이 올라오면, 망설일 틈 없이 바로 알려드립니다. 좋은 매물은 오래 기다려주지 않으니까요.',
    visual: <NotifyBell />,
  },
];

export default function Landing() {
  return (
    <div className="min-h-full bg-white">
      <style>{`
        @keyframes feedIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feed-item {
          animation: feedIn 0.4s ease-out;
          animation-fill-mode: backwards;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.55); opacity: 0.55; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ping-ring {
          animation: ringPulse 2s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .feed-item { animation: none !important; }
          .ping-ring { animation: none !important; }
        }
      `}</style>

      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs text-white">
              r
            </span>
            repick
          </span>
          <a
            href="#cta"
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            무료로 시작하기
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                지금 이 순간에도 매칭은 계속됩니다
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                누군가에게 딱 맞는 매물이,
                <br />
                지금 이 순간 발견되고 있어요
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
                취향을 학습하고, 수만 개 매물 중 최적을 찾아내고, 신뢰를 검증한 뒤, 가장 먼저 알려드립니다. repick의
                AI가 쉬지 않고 일하는 모습을 아래 실시간 피드로 그대로 보여드릴게요.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#cta"
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  무료로 시작하기
                </a>
                <a
                  href="#features"
                  className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  매칭 흐름 살펴보기
                </a>
              </div>
            </div>

            <LiveFeedPanel />
          </div>
        </section>

        <section id="features" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                매물 한 건이 당신에게 오기까지
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                피드에 뜬 네 가지 태그, 그 안에서 실제로 무슨 일이 벌어지는지 보여드릴게요.
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-14">
              {FEATURES.map((f, i) => (
                <article
                  key={f.tag}
                  className="grid items-center gap-8 rounded-2xl border border-slate-100 bg-white p-6 sm:grid-cols-2 sm:p-8"
                >
                  <div className={i % 2 === 1 ? 'sm:order-2' : ''}>
                    <span
                      className={`mb-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TAG_STYLE_LIGHT[f.tag]}`}
                    >
                      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${TAG_STYLE[f.tag].dot}`} aria-hidden="true" />
                      {f.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{f.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                  <div className={`flex justify-center py-2 ${i % 2 === 1 ? 'sm:order-1' : ''}`}>{f.visual}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            당신의 다음 매물, 지금 찾고 있어요
          </h2>
          <p className="mt-3 text-sm text-slate-500">가입은 무료입니다. AI가 당신을 위해 일하는 걸 직접 확인해보세요.</p>
          <a
            href="#cta"
            className="mt-7 inline-block rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            무료로 시작하기
          </a>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          © repick · 위 실시간 피드는 매칭 엔진의 동작 방식을 시각화한 데모이며, 실제 매물 데이터와 연동 시 동일한
          방식으로 동작합니다.
        </p>
      </footer>
    </div>
  );
}
