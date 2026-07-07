'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

interface ProductItem {
  name: string;
  category: string;
  list: string;
  sale: string;
  save: string;
  match: number;
  tag: string;
}

interface StatItem {
  label: string;
  value: string;
  unit: string;
  delta: string;
  note: string;
  accent: boolean;
}

interface PriceItem {
  name: string;
  before: string;
  after: string;
  dropPct: string;
}

interface AlertItem {
  time: string;
  tag: string;
  desc: string;
}

interface TextMessage {
  id: string;
  role: 'user' | 'assistant';
  kind: 'text';
  text: string;
}

interface ProductsMessage {
  id: string;
  role: 'assistant';
  kind: 'products';
  text: string;
  items: ProductItem[];
}

interface StatsMessage {
  id: string;
  role: 'assistant';
  kind: 'stats';
  text: string;
  items: StatItem[];
}

interface PriceWatchMessage {
  id: string;
  role: 'assistant';
  kind: 'pricewatch';
  text: string;
  items: PriceItem[];
}

interface AlertsMessage {
  id: string;
  role: 'assistant';
  kind: 'alerts';
  text: string;
  items: AlertItem[];
}

type ChatMessage = TextMessage | ProductsMessage | StatsMessage | PriceWatchMessage | AlertsMessage;

const NAV_ITEMS = [
  { label: 'AI 어시스턴트', icon: '✦', active: true },
  { label: '추천', icon: '🛍️', active: false },
  { label: '찜', icon: '❤️', active: false },
  { label: '설정', icon: '⚙️', active: false },
];

const QUICK_QUESTIONS: { id: string; label: string; icon: string }[] = [
  { id: 'today', label: '오늘 추천할 만한 거 있어?', icon: '🛍️' },
  { id: 'save', label: '이번 주 얼마나 절약했어?', icon: '💰' },
  { id: 'wish', label: '찜한 상품 가격 내렸어?', icon: '❤️' },
  { id: 'alerts', label: '최근 알림 뭐 있었어?', icon: '🔔' },
];

const PRODUCTS: ProductItem[] = [
  { name: '아디다스 삼바 OG', category: '신발', list: '139,000', sale: '79,000', save: '60,000', match: 95, tag: 'NEW' },
  { name: '폴로 랄프로렌 옥스포드 셔츠', category: '의류', list: '89,000', sale: '38,000', save: '51,000', match: 91, tag: '가격↓' },
  { name: '칼하트 디트로이트 재킷', category: '아우터', list: '245,000', sale: '132,000', save: '113,000', match: 88, tag: 'HOT' },
];

const STATS: StatItem[] = [
  { label: '오늘의 추천', value: '24', unit: '건', delta: '+6', note: 'VS 어제', accent: false },
  { label: '찜한 아이템', value: '8', unit: '건', delta: '+2', note: 'VS 어제', accent: false },
  { label: '예상 절약액', value: '612,400', unit: '원', delta: '+18%', note: 'VS 지난주', accent: true },
  { label: 'AI 매칭률', value: '91', unit: '%', delta: '+3%p', note: 'VS 지난주', accent: true },
];

const PRICE_WATCH: PriceItem[] = [
  { name: '뉴발란스 990v5', before: '235,000', after: '219,000', dropPct: '−7%' },
  { name: '스투시 로고 후드집업', before: '98,000', after: '79,000', dropPct: '−19%' },
  { name: '아크네 스튜디오 니트', before: '178,000', after: '158,000', dropPct: '−11%' },
];

const ALERTS: AlertItem[] = [
  { time: '09:14', tag: 'MATCH', desc: '아디다스 삼바 조건 일치 (매칭 95%)' },
  { time: '08:52', tag: 'PRICE↓', desc: '뉴발란스 990v5 16,000원 하락' },
  { time: '08:30', tag: 'WISH', desc: '아크네 니트 찜 목록에 추가됨' },
  { time: '07:58', tag: 'ALERT', desc: '칼하트 재킷 재입고 감지' },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    kind: 'text',
    text: '안녕하세요, 승우님. 오늘도 취향 데이터를 계속 학습하고 있어요. 궁금한 걸 편하게 물어보세요.',
  },
  {
    id: 'm1',
    role: 'assistant',
    kind: 'stats',
    text: '지금까지 모은 오늘의 요약이에요.',
    items: STATS,
  },
];

function buildAnswer(qId: string, id: string): ChatMessage {
  switch (qId) {
    case 'today':
      return {
        id,
        role: 'assistant',
        kind: 'products',
        text: '취향 프로필 기준으로 오늘 가장 잘 맞는 상품 3개를 골라봤어요. 매칭률 순이에요.',
        items: PRODUCTS,
      };
    case 'save':
      return {
        id,
        role: 'assistant',
        kind: 'stats',
        text: '이번 주 활동을 다시 정리해봤어요. 절약액이 지난주보다 늘었네요!',
        items: STATS,
      };
    case 'wish':
      return {
        id,
        role: 'assistant',
        kind: 'pricewatch',
        text: '찜해두신 상품 중 가격이 내려간 항목들이에요. 지금이 살 타이밍일 수도 있어요.',
        items: PRICE_WATCH,
      };
    case 'alerts':
      return {
        id,
        role: 'assistant',
        kind: 'alerts',
        text: '최근 감지된 알림을 시간순으로 정리했어요.',
        items: ALERTS,
      };
    default:
      return {
        id,
        role: 'assistant',
        kind: 'text',
        text: '아직 배우고 있는 질문이에요. 아래 빠른 질문 중 하나를 눌러보시겠어요?',
      };
  }
}

function matchQuestionId(raw: string): string | null {
  const text = raw.toLowerCase();
  if (text.includes('추천') || text.includes('오늘')) return 'today';
  if (text.includes('절약') || text.includes('얼마') || text.includes('매칭')) return 'save';
  if (text.includes('찜') || text.includes('가격')) return 'wish';
  if (text.includes('알림') || text.includes('최근')) return 'alerts';
  return null;
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'assistant') {
    return (
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
      >
        ✦
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-xs font-bold text-white"
    >
      나
    </span>
  );
}

function ProductCards({ items }: { items: ProductItem[] }) {
  return (
    <ul className="grid w-full gap-2.5 sm:grid-cols-2">
      {items.map((p) => (
        <li key={p.name} className="rounded-xl border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-stone-900">{p.name}</p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                p.tag === '-' ? 'bg-stone-100 text-stone-400' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {p.tag}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-stone-400">{p.category}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <span className="text-xs text-stone-400 line-through">{p.list}원</span>
              <p className="text-base font-bold text-stone-900">{p.sale}원</p>
            </div>
            <p className="shrink-0 text-xs font-semibold text-emerald-600">−{p.save}원</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-indigo-600" style={{ width: `${p.match}%` }} />
            </div>
            <span className="shrink-0 text-[11px] font-medium text-stone-500">매칭 {p.match}%</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <ul className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4">
      {items.map((s) => (
        <li key={s.label} className="rounded-xl border border-stone-200 bg-white p-3">
          <p className="text-[11px] text-stone-400">{s.label}</p>
          <p className={`mt-1 text-lg font-bold ${s.accent ? 'text-indigo-600' : 'text-stone-900'}`}>
            {s.value}
            <span className="ml-0.5 text-xs font-normal text-stone-400">{s.unit}</span>
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            <span className={s.accent ? 'text-emerald-600' : 'text-stone-500'}>{s.delta}</span> {s.note}
          </p>
        </li>
      ))}
    </ul>
  );
}

function PriceWatchList({ items }: { items: PriceItem[] }) {
  return (
    <ul className="w-full divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
      {items.map((p) => (
        <li key={p.name} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
          <p className="min-w-0 truncate text-sm font-medium text-stone-800">{p.name}</p>
          <div className="flex shrink-0 items-center gap-2 text-xs">
            <span className="text-stone-400 line-through">{p.before}원</span>
            <span className="font-semibold text-stone-900">{p.after}원</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">
              {p.dropPct}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AlertList({ items }: { items: AlertItem[] }) {
  return (
    <ul className="w-full divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
      {items.map((a, i) => (
        <li key={i} className="flex items-start gap-3 px-3.5 py-2.5 text-xs">
          <span className="shrink-0 pt-0.5 tabular-nums text-stone-400">{a.time}</span>
          <span className="shrink-0 rounded-full bg-indigo-100 px-1.5 py-0.5 font-semibold text-indigo-700">
            {a.tag}
          </span>
          <span className="text-stone-600">{a.desc}</span>
        </li>
      ))}
    </ul>
  );
}

function TypingRow() {
  return (
    <div className="flex gap-3" role="status" aria-label="AI 큐레이터가 답변을 작성하고 있어요">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-4 py-3">
        <span className="rpk-typing-dot h-1.5 w-1.5 rounded-full bg-stone-300" />
        <span className="rpk-typing-dot rpk-typing-delay-1 h-1.5 w-1.5 rounded-full bg-stone-300" />
        <span className="rpk-typing-dot rpk-typing-delay-2 h-1.5 w-1.5 rounded-full bg-stone-300" />
      </div>
    </div>
  );
}

export default function Landing() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState('');
  const seqRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  function nextId() {
    seqRef.current += 1;
    return `m${seqRef.current}`;
  }

  function pushAssistantAnswer(qId: string | null) {
    setIsTyping(true);
    const delay = 650 + Math.random() * 500;
    window.setTimeout(() => {
      const id = nextId();
      setMessages((prev) => [...prev, buildAnswer(qId ?? '', id)]);
      setIsTyping(false);
    }, delay);
  }

  function handleQuickQuestion(qId: string) {
    if (isTyping) return;
    setAskedIds((prev) => new Set(prev).add(qId));
    const q = QUICK_QUESTIONS.find((x) => x.id === qId);
    if (!q) return;
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', kind: 'text', text: q.label }]);
    pushAssistantAnswer(qId);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', kind: 'text', text: trimmed }]);
    setInputValue('');
    pushAssistantAnswer(matchQuestionId(trimmed));
  }

  return (
    <div className="rpk-root flex min-h-screen flex-col bg-stone-50 text-stone-900 md:flex-row">
      <style>{`
        @keyframes rpk-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        .rpk-typing-dot { animation: rpk-bounce 1.1s ease-in-out infinite; }
        .rpk-typing-delay-1 { animation-delay: 0.15s; }
        .rpk-typing-delay-2 { animation-delay: 0.3s; }
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
        href="#rpk-chat-log"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-indigo-700 focus:shadow-lg"
      >
        대화창으로 건너뛰기
      </a>

      {/* 데스크톱 좌측 네비 */}
      <nav aria-label="주요 메뉴" className="hidden w-60 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="border-b border-stone-200 px-6 py-6">
          <span className="text-lg font-bold tracking-tight text-stone-900">repick</span>
          <p className="mt-1 text-xs text-stone-400">AI 리커머스 큐레이터</p>
        </div>
        <ul className="flex-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                aria-current={item.active ? 'page' : undefined}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  item.active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <span aria-hidden="true" className="text-base">
                  {item.icon}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="border-t border-stone-200 px-6 py-5 text-xs">
          <p className="text-stone-400">플랜</p>
          <p className="mt-1 flex items-center gap-1.5 font-semibold text-indigo-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            PRO
          </p>
        </div>
      </nav>

      {/* 메인 컬럼 */}
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <header className="border-b border-stone-200 bg-white/90 px-4 py-5 backdrop-blur sm:px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-indigo-600">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
                실시간 분석 중
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                AI 큐레이터에게 물어보세요
              </h1>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base font-bold text-white sm:flex"
            >
              ✦
            </span>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 md:px-8">
          <div
            id="rpk-chat-log"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="AI 큐레이터와의 대화"
            className="flex flex-1 flex-col gap-5"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar role={message.role} />
                <div
                  className={`flex min-w-0 max-w-[85%] flex-col gap-3 sm:max-w-[80%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <p
                    className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                      message.role === 'user'
                        ? 'rounded-tr-sm bg-stone-900 text-white'
                        : 'rounded-tl-sm border border-stone-200 bg-white text-stone-800'
                    }`}
                  >
                    {message.text}
                  </p>

                  {message.kind === 'products' && <ProductCards items={message.items} />}
                  {message.kind === 'stats' && <StatGrid items={message.items} />}
                  {message.kind === 'pricewatch' && <PriceWatchList items={message.items} />}
                  {message.kind === 'alerts' && <AlertList items={message.items} />}
                </div>
              </div>
            ))}

            {isTyping && <TypingRow />}

            <div ref={bottomRef} />
          </div>
        </main>

        {/* 대화 입력 영역 */}
        <div className="sticky bottom-16 z-10 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 md:bottom-0 md:px-8">
          <div className="mx-auto w-full max-w-2xl">
            <div role="group" aria-label="빠른 질문" className="mb-2.5 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleQuickQuestion(q.id)}
                  disabled={isTyping}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                    askedIds.has(q.id)
                      ? 'border-stone-200 bg-stone-50 text-stone-400'
                      : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <span aria-hidden="true">{askedIds.has(q.id) ? '✓' : q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="rpk-chat-input" className="sr-only">
                AI 큐레이터에게 메시지 보내기
              </label>
              <input
                id="rpk-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="무엇이든 물어보세요..."
                className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                보내기
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 모바일 하단 네비 */}
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-stone-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              item.active ? 'text-indigo-700' : 'text-stone-400'
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
