'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

type HotspotDef = {
  id: string;
  label: string;
  metric: string;
  desc: string;
};

type TourStep = {
  id: string;
  tabNumber: string;
  tabLabel: string;
  hotspots: HotspotDef[];
};

const tourSteps: TourStep[] = [
  {
    id: 'inventory',
    tabNumber: '01',
    tabLabel: '재고 관리',
    hotspots: [
      {
        id: 'auto-tag',
        label: 'AI 자동 카테고리 태깅',
        metric: '82% 빠른 등록',
        desc: '촬영한 사진만으로 카테고리·브랜드·상태등급을 자동 인식해 등록 시간을 82% 줄여요.',
      },
      {
        id: 'live-status',
        label: '실시간 재고 상태',
        metric: '실시간 동기화',
        desc: '판매 대기 · 매칭 중 · 판매 완료 상태가 실시간으로 갱신돼 재고 파악이 한눈에 가능해요.',
      },
      {
        id: 'bulk-upload',
        label: '일괄 업로드',
        metric: '최대 500건 한 번에',
        desc: '엑셀/CSV로 수백 건을 한 번에 업로드하고 자동 검수까지 마쳐요.',
      },
    ],
  },
  {
    id: 'pricing',
    tabNumber: '02',
    tabLabel: 'AI 프라이싱',
    hotspots: [
      {
        id: 'market-price',
        label: '실거래가 기반 산출',
        metric: '90일 데이터 분석',
        desc: '최근 90일 실거래 데이터를 분석해 판매 확률이 가장 높은 가격대를 제안해요.',
      },
      {
        id: 'simulate',
        label: '가격 시뮬레이션',
        metric: '예상 판매일 즉시 계산',
        desc: '가격을 조정하면 예상 판매 소요일이 슬라이더에 맞춰 즉시 다시 계산돼요.',
      },
      {
        id: 'compare',
        label: '경쟁 매물 비교',
        metric: '동일 카테고리 비교',
        desc: '동일 카테고리 경쟁 매물과 가격·상태를 나란히 비교해 근거 있는 가격을 정해요.',
      },
    ],
  },
  {
    id: 'matching',
    tabNumber: '03',
    tabLabel: '매칭 현황',
    hotspots: [
      {
        id: 'channel-score',
        label: '채널별 매칭 확률',
        metric: '6개 채널 자동 비교',
        desc: '판매 채널마다 성사 가능성을 계산해 확률이 가장 높은 채널에 우선 노출해요.',
      },
      {
        id: 'alert',
        label: '매칭 알림',
        metric: '즉시 알림 발송',
        desc: '구매 의사가 높은 매칭이 발생하면 담당자에게 즉시 알림을 보내요.',
      },
      {
        id: 'timeline',
        label: '매칭 이력 추적',
        metric: '전체 흐름 타임라인',
        desc: '제안부터 협상, 성사까지 전체 매칭 흐름을 타임라인으로 확인할 수 있어요.',
      },
    ],
  },
  {
    id: 'settlement',
    tabNumber: '04',
    tabLabel: '정산 리포트',
    hotspots: [
      {
        id: 'auto-settle',
        label: '자동 정산 생성',
        metric: '거래 즉시 생성',
        desc: '거래가 성사되는 즉시 정산서가 자동 생성돼 회계팀의 반복 업무가 줄어요.',
      },
      {
        id: 'report',
        label: '월별 리포트 다운로드',
        metric: '회계 시스템 연동',
        desc: '판매·정산 데이터를 월별로 정리해 사내 회계 시스템에 바로 연동할 수 있어요.',
      },
      {
        id: 'invoice',
        label: '세금계산서 발행',
        metric: '원클릭 발행 요청',
        desc: '정산과 동시에 세금계산서 발행까지 버튼 하나로 요청할 수 있어요.',
      },
    ],
  },
];

const roiStats = [
  { value: '-42%', label: '평균 재고 보유 기간 단축' },
  { value: '94%', label: 'AI 매칭 정확도' },
  { value: '2.3배', label: '기존 채널 대비 판매 전환율' },
  { value: '87%', label: '입고 대비 판매 완료 회수율' },
];

const clients = ['CIRCLE MARKET', '루프스토어', '리씨클컴퍼니', '빈티지웍스', '그린클로짓', '셀렉트인벤토리'];

type MockupProps = {
  hotspots: HotspotDef[];
  activeHotspot: string | null;
  visitedIds: string[];
  onSelect: (id: string) => void;
};

function HotspotPin({
  number,
  label,
  active,
  visited,
  onClick,
}: {
  number: number;
  label: string;
  active: boolean;
  visited: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`핫스팟 ${number}: ${label} 설명 보기`}
      className={`absolute -top-2.5 -right-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-bold shadow-sm transition-all before:absolute before:-inset-3 before:content-[''] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
        active
          ? 'scale-110 border-emerald-700 bg-emerald-700 text-white'
          : visited
            ? 'border-emerald-300 bg-white text-emerald-700'
            : 'animate-pulse border-emerald-700 bg-emerald-700 text-white'
      }`}
    >
      {number}
    </button>
  );
}

function statusTone(tone: 'amber' | 'sky' | 'emerald') {
  if (tone === 'amber') return 'bg-amber-50 text-amber-600';
  if (tone === 'sky') return 'bg-sky-50 text-sky-600';
  return 'bg-emerald-50 text-emerald-700';
}

function InventoryMockup({ hotspots, activeHotspot, visitedIds, onSelect }: MockupProps) {
  const [h1, h2, h3] = hotspots;
  const items: Array<{ name: string; category: string; status: string; tone: 'amber' | 'sky' | 'emerald' }> = [
    { name: '빈티지 가죽 자켓', category: '여성 아우터', status: '판매 대기', tone: 'amber' },
    { name: '오디오테크니카 턴테이블', category: '가전 · 음향', status: '매칭 중', tone: 'sky' },
    { name: '원목 스탠드조명', category: '가구 · 조명', status: '판매 완료', tone: 'emerald' },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-6 text-center sm:gap-8">
          <div>
            <p className="text-[11px] text-slate-500">전체 재고</p>
            <p className="font-mono text-lg font-bold text-slate-900">128</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">신규 입고</p>
            <p className="font-mono text-lg font-bold text-slate-900">14</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">판매 대기</p>
            <p className="font-mono text-lg font-bold text-slate-900">32</p>
          </div>
        </div>
        <div className="relative">
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            + 일괄 업로드
          </span>
          {h3 && (
            <HotspotPin
              number={3}
              label={h3.label}
              active={activeHotspot === h3.id}
              visited={visitedIds.includes(h3.id)}
              onClick={() => onSelect(h3.id)}
            />
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-500">
          <span>상품 정보</span>
          <span>상태</span>
        </div>
        {items.map((it, i) => (
          <div
            key={it.name}
            className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-xs font-bold text-emerald-700">
                {it.name.slice(0, 1)}
                {i === 0 && h1 && (
                  <HotspotPin
                    number={1}
                    label={h1.label}
                    active={activeHotspot === h1.id}
                    visited={visitedIds.includes(h1.id)}
                    onClick={() => onSelect(h1.id)}
                  />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{it.name}</p>
                <p className="truncate text-xs text-slate-500">{it.category}</p>
              </div>
            </div>
            <span className="relative shrink-0">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(it.tone)}`}>
                {it.status}
              </span>
              {i === 0 && h2 && (
                <HotspotPin
                  number={2}
                  label={h2.label}
                  active={activeHotspot === h2.id}
                  visited={visitedIds.includes(h2.id)}
                  onClick={() => onSelect(h2.id)}
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingMockup({ hotspots, activeHotspot, visitedIds, onSelect }: MockupProps) {
  const [h1, h2, h3] = hotspots;
  const trend = [38, 52, 46, 61, 58, 70, 64];
  const competitors = [
    { name: '경쟁 매물 A', price: '74,000원' },
    { name: '경쟁 매물 B', price: '69,500원' },
  ];

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-slate-500">AI 추천가</p>
        <p className="font-mono text-3xl font-bold text-emerald-600">68,000원</p>
      </div>
      <div className="relative mb-4 rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-medium text-slate-500">최근 90일 실거래가 추이</p>
        <div className="flex h-24 items-end gap-2">
          {trend.map((v, i) => (
            <div
              key={i}
              style={{ height: `${v}%` }}
              className={`flex-1 rounded-t ${i === trend.length - 1 ? 'bg-emerald-500' : 'bg-emerald-200'}`}
            />
          ))}
        </div>
        {h1 && (
          <HotspotPin
            number={1}
            label={h1.label}
            active={activeHotspot === h1.id}
            visited={visitedIds.includes(h1.id)}
            onClick={() => onSelect(h1.id)}
          />
        )}
      </div>
      <div className="relative mb-4 rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-xs font-medium text-slate-500">가격 시뮬레이션</p>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500">
          <span>58,000</span>
          <span>78,000</span>
        </div>
        {h2 && (
          <HotspotPin
            number={2}
            label={h2.label}
            active={activeHotspot === h2.id}
            visited={visitedIds.includes(h2.id)}
            onClick={() => onSelect(h2.id)}
          />
        )}
      </div>
      <div className="relative rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-xs font-medium text-slate-500">경쟁 매물 비교</p>
        <div className="space-y-1.5">
          {competitors.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{c.name}</span>
              <span className="font-mono text-slate-700">{c.price}</span>
            </div>
          ))}
        </div>
        {h3 && (
          <HotspotPin
            number={3}
            label={h3.label}
            active={activeHotspot === h3.id}
            visited={visitedIds.includes(h3.id)}
            onClick={() => onSelect(h3.id)}
          />
        )}
      </div>
    </div>
  );
}

function MatchingMockup({ hotspots, activeHotspot, visitedIds, onSelect }: MockupProps) {
  const [h1, h2, h3] = hotspots;
  const channels = [
    { name: '자사몰', pct: 92 },
    { name: '중고마켓 A', pct: 78 },
    { name: '리퍼브 전문관', pct: 65 },
    { name: '오픈마켓 B', pct: 41 },
  ];
  const timeline = ['제안', '협상', '성사'];

  return (
    <div>
      <div className="relative mb-4 rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-medium text-slate-500">채널별 매칭 확률</p>
        <div className="space-y-2.5">
          {channels.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-600">{c.name}</span>
                <span className="font-mono font-semibold text-slate-700">{c.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  style={{ width: `${c.pct}%` }}
                  className={`h-1.5 rounded-full ${c.pct >= 70 ? 'bg-emerald-500' : 'bg-slate-300'}`}
                />
              </div>
            </div>
          ))}
        </div>
        {h1 && (
          <HotspotPin
            number={1}
            label={h1.label}
            active={activeHotspot === h1.id}
            visited={visitedIds.includes(h1.id)}
            onClick={() => onSelect(h1.id)}
          />
        )}
      </div>
      <div className="relative mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <span aria-hidden="true" className="mt-0.5 text-base">
          🔔
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-emerald-800">자사몰에서 매칭 성사 직전이에요</p>
          <p className="mt-0.5 text-xs text-emerald-700">구매자가 결제 페이지에 진입했어요 · 방금 전</p>
        </div>
        {h2 && (
          <HotspotPin
            number={2}
            label={h2.label}
            active={activeHotspot === h2.id}
            visited={visitedIds.includes(h2.id)}
            onClick={() => onSelect(h2.id)}
          />
        )}
      </div>
      <div className="relative rounded-xl border border-slate-200 p-4">
        <p className="mb-3 text-xs font-medium text-slate-500">매칭 이력</p>
        <div className="flex items-center">
          {timeline.map((t, i) => (
            <div key={t} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    i < 2 ? 'bg-emerald-700 text-white' : 'border-2 border-slate-200 text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[11px] text-slate-500">{t}</span>
              </div>
              {i < timeline.length - 1 && <span className="mx-2 h-px flex-1 bg-slate-200" />}
            </div>
          ))}
        </div>
        {h3 && (
          <HotspotPin
            number={3}
            label={h3.label}
            active={activeHotspot === h3.id}
            visited={visitedIds.includes(h3.id)}
            onClick={() => onSelect(h3.id)}
          />
        )}
      </div>
    </div>
  );
}

function SettlementMockup({ hotspots, activeHotspot, visitedIds, onSelect }: MockupProps) {
  const [h1, h2, h3] = hotspots;
  const rows = [
    { date: '07.05', item: '오디오테크니카 턴테이블', amount: 138000, status: '정산 완료' },
    { date: '07.04', item: '빈티지 가죽 자켓', amount: 61200, status: '정산 완료' },
    { date: '07.03', item: '원목 스탠드조명', amount: 19800, status: '정산 대기' },
  ];

  return (
    <div>
      <div className="relative mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs text-emerald-700">이번 달 정산 예정 금액</p>
        <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">219,000원</p>
        {h1 && (
          <HotspotPin
            number={1}
            label={h1.label}
            active={activeHotspot === h1.id}
            visited={visitedIds.includes(h1.id)}
            onClick={() => onSelect(h1.id)}
          />
        )}
      </div>
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-500">
          <span>날짜</span>
          <span>상품</span>
          <span>금액</span>
          <span>상태</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.item}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-sm last:border-0"
          >
            <span className="font-mono text-xs text-slate-500">{r.date}</span>
            <span className="truncate text-slate-700">{r.item}</span>
            <span className="font-mono text-slate-900">{r.amount.toLocaleString('ko-KR')}원</span>
            <span
              className={`justify-self-end rounded-full px-2 py-0.5 text-[10px] font-medium ${
                r.status === '정산 완료' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="relative">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            ⬇ 월별 리포트
          </span>
          {h2 && (
            <HotspotPin
              number={2}
              label={h2.label}
              active={activeHotspot === h2.id}
              visited={visitedIds.includes(h2.id)}
              onClick={() => onSelect(h2.id)}
            />
          )}
        </span>
        <span className="relative">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            🧾 세금계산서 발행
          </span>
          {h3 && (
            <HotspotPin
              number={3}
              label={h3.label}
              active={activeHotspot === h3.id}
              visited={visitedIds.includes(h3.id)}
              onClick={() => onSelect(h3.id)}
            />
          )}
        </span>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-emerald-700"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      />
    </div>
  );
}

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [visited, setVisited] = useState<Record<string, string[]>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const current = tourSteps[activeStep];
  const currentVisited = visited[current.id] ?? [];
  const activeHotspotDef = current.hotspots.find((h) => h.id === activeHotspot) ?? null;
  const totalHotspots = tourSteps.reduce((sum, s) => sum + s.hotspots.length, 0);
  const totalVisited = Object.values(visited).reduce((sum, arr) => sum + arr.length, 0);

  function goToStep(index: number) {
    setActiveStep(index);
    setActiveHotspot(null);
  }

  function selectHotspot(stepId: string, hotspotId: string) {
    setActiveHotspot(hotspotId);
    setVisited((prev) => {
      const list = prev[stepId] ?? [];
      if (list.includes(hotspotId)) return prev;
      return { ...prev, [stepId]: [...list, hotspotId] };
    });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tourSteps.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tourSteps.length) % tourSteps.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tourSteps.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      goToStep(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  }

  const mockupProps: MockupProps = {
    hotspots: current.hotspots,
    activeHotspot,
    visitedIds: currentVisited,
    onSelect: (id) => selectHotspot(current.id, id),
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <style>{`
        @keyframes tourFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              r
            </span>
            <span className="text-base font-semibold tracking-tight">
              repick <span className="font-normal text-slate-500">Business</span>
            </span>
          </div>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <a href="#tour" className="hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded">
              제품 둘러보기
            </a>
            <a href="#roi" className="hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded">
              도입효과
            </a>
            <a href="#demo" className="hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded">
              도입문의
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            데모 요청
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section
          className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          style={{
            backgroundImage:
              'radial-gradient(oklch(85% 0.05 165 / 0.5) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
              <span aria-hidden="true">🖱️</span> 인터랙티브 데모 · 약 3분 소요
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
              가입 없이,
              <br className="sm:hidden" /> 지금 대시보드를 눌러보세요
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              셀러 대시보드가 재고를 어떻게 팔리는 가격, 팔리는 채널로 연결하는지 — AI가 만든 실제
              화면을 아래에서 직접 클릭하며 확인해보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#tour"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                지금 둘러보기 ↓
              </a>
              <a
                href="#demo"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                담당자와 상담하기
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">카드 등록 없이 · 핫스팟 12곳 · 클릭만으로 체험</p>
          </div>
        </section>

        {/* TOUR */}
        <section id="tour" aria-labelledby="tour-heading" className="border-t border-slate-200 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-700">PRODUCT TOUR</p>
                <h2 id="tour-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  화면을 눌러 기능을 확인하세요
                </h2>
              </div>
              <div className="w-full sm:w-56">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>전체 진행률</span>
                  <span className="font-mono">
                    {totalVisited}/{totalHotspots}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    style={{ width: `${(totalVisited / totalHotspots) * 100}%` }}
                    className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div role="tablist" aria-label="대시보드 투어 단계" className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {tourSteps.map((s, i) => {
                const done = (visited[s.id]?.length ?? 0) === s.hotspots.length;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${s.id}`}
                    aria-selected={activeStep === i}
                    aria-controls={`panel-${s.id}`}
                    tabIndex={activeStep === i ? 0 : -1}
                    onClick={() => goToStep(i)}
                    onKeyDown={(e) => handleTabKeyDown(e, i)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      activeStep === i
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    <span className="font-mono text-xs">{s.tabNumber}</span>
                    {s.tabLabel}
                    {done && (
                      <span aria-hidden="true">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              {/* mockup */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="ml-3 truncate rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
                    app.repick.co.kr/business/dashboard/{current.id}
                  </span>
                </div>
                <div
                  key={current.id}
                  role="tabpanel"
                  id={`panel-${current.id}`}
                  aria-labelledby={`tab-${current.id}`}
                  tabIndex={-1}
                  className="p-5 [animation:tourFade_0.3s_ease] sm:p-7"
                >
                  {current.id === 'inventory' && <InventoryMockup {...mockupProps} />}
                  {current.id === 'pricing' && <PricingMockup {...mockupProps} />}
                  {current.id === 'matching' && <MatchingMockup {...mockupProps} />}
                  {current.id === 'settlement' && <SettlementMockup {...mockupProps} />}
                </div>
              </div>

              {/* info panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    이 화면에서 확인할 기능
                  </p>
                  <span className="font-mono text-xs text-slate-500">
                    {currentVisited.length}/{current.hotspots.length}
                  </span>
                </div>
                <ul className="mb-5 space-y-2">
                  {current.hotspots.map((h, i) => {
                    const isVisited = currentVisited.includes(h.id);
                    const isActive = activeHotspot === h.id;
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          onClick={() => selectHotspot(current.id, h.id)}
                          aria-pressed={isActive}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                            isActive
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                              isVisited ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isVisited ? '✓' : i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium">{h.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div key={activeHotspot ?? 'empty'} className="rounded-xl bg-slate-50 p-4 [animation:tourFade_0.25s_ease]">
                  {activeHotspotDef ? (
                    <>
                      <p className="mb-1 text-xs font-semibold text-emerald-700">{activeHotspotDef.metric}</p>
                      <h3 className="mb-1.5 text-base font-bold text-slate-900">{activeHotspotDef.label}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{activeHotspotDef.desc}</p>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-500">
                      왼쪽 화면의 번호가 매겨진 초록 버튼이나 위 목록을 눌러 이 화면의 기능을 하나씩
                      확인해보세요.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goToStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition active:scale-[0.98] hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                ← 이전 화면
              </button>

              <nav aria-label="투어 단계 바로가기" className="flex items-center gap-2">
                {tourSteps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-label={`${i + 1}단계 ${s.tabLabel}로 이동`}
                    aria-current={i === activeStep ? 'step' : undefined}
                    className={`relative h-2 rounded-full transition-all before:absolute before:-inset-3 before:content-[''] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      i === activeStep ? 'w-6 bg-emerald-700' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </nav>

              {activeStep < tourSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeStep + 1)}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  다음 화면 →
                </button>
              ) : (
                <a
                  href="#demo"
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  데모 요청하기 →
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ROI */}
        <section id="roi" aria-labelledby="roi-heading" className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-wide text-emerald-700">MEASURED RESULTS</p>
            <h2 id="roi-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              방금 눌러본 기능이 만드는 숫자
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roiStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-mono text-4xl font-black text-emerald-600">{s.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTS */}
        <section aria-labelledby="clients-heading" className="border-t border-slate-200 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 id="clients-heading" className="text-center text-xs font-semibold tracking-wide text-slate-500">
              REFERENCE · 도입 기업 (일부)
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-sm font-semibold tracking-wide text-slate-500">
              {clients.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO FORM */}
        <section id="demo" aria-labelledby="demo-heading" className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-xs font-semibold tracking-wide text-emerald-700">DEMO ACCESS</p>
              <h2 id="demo-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                도입 상담 신청
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                방금 둘러본 대시보드를 팀 전체 규모로 확인하고 싶다면, 영업일 기준 1일 이내 담당 엔지니어가
                회신드립니다.
              </p>

              <form className="mt-8 grid gap-5" action="#" method="post">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="회사명" name="company" placeholder="주식회사 리픽" required autoComplete="organization" />
                  <FormField label="담당자명" name="name" placeholder="홍길동" required autoComplete="name" />
                </div>
                <FormField label="이메일" name="email" type="email" placeholder="you@company.com" required autoComplete="email" />
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="현재 취급 재고 규모, 판매 채널, 궁금하신 점을 남겨주세요."
                    className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  요청 제출 →
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>repick Business © 2026</span>
          <span>가입 없이 체험할 수 있는 인터랙티브 셀러 대시보드 데모</span>
        </div>
      </footer>
    </div>
  );
}
