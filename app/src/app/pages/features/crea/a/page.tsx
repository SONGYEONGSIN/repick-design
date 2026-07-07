'use client';

import { useMemo, useState } from 'react';

type TasteTag =
  | '빈티지'
  | '미니멀'
  | '스트리트'
  | '러블리'
  | '클래식'
  | '스포티'
  | '오버사이즈'
  | '데님';

type Condition = 'A' | 'A-' | 'B+' | 'B';

interface CatalogItem {
  id: string;
  name: string;
  icon: string;
  tags: TasteTag[];
  price: number;
  condition: Condition;
}

const ALL_TAGS: TasteTag[] = [
  '빈티지',
  '미니멀',
  '스트리트',
  '러블리',
  '클래식',
  '스포티',
  '오버사이즈',
  '데님',
];

const CATALOG: CatalogItem[] = [
  { id: '1', name: '요크넥 니트 가디건', icon: '🧶', tags: ['빈티지', '클래식'], price: 32000, condition: 'A' },
  { id: '2', name: '오버사이즈 코튼 후드', icon: '👕', tags: ['스트리트', '오버사이즈'], price: 28000, condition: 'B+' },
  { id: '3', name: '스트레이트 데님 팬츠', icon: '👖', tags: ['데님', '미니멀'], price: 45000, condition: 'A' },
  { id: '4', name: '레이스 트리밍 블라우스', icon: '👗', tags: ['러블리', '클래식'], price: 26000, condition: 'A-' },
  { id: '5', name: '코치 자켓', icon: '🧥', tags: ['스트리트', '빈티지'], price: 39000, condition: 'B+' },
  { id: '6', name: '미니멀 크로스백', icon: '👜', tags: ['미니멀'], price: 52000, condition: 'A' },
  { id: '7', name: '트랙 스포츠 세트업', icon: '🎽', tags: ['스포티', '오버사이즈'], price: 34000, condition: 'A' },
  { id: '8', name: '플리츠 미디 스커트', icon: '👗', tags: ['러블리', '클래식'], price: 22000, condition: 'B' },
  { id: '9', name: '청청 셋업', icon: '👖', tags: ['데님', '빈티지'], price: 58000, condition: 'A-' },
  { id: '10', name: '첼시 부츠', icon: '👢', tags: ['클래식', '미니멀'], price: 41000, condition: 'A' },
  { id: '11', name: '그래픽 프린트 스웨트', icon: '👕', tags: ['스트리트', '오버사이즈'], price: 19000, condition: 'B+' },
  { id: '12', name: '니트 베스트', icon: '🧥', tags: ['미니멀', '빈티지'], price: 24000, condition: 'A' },
];

const CARD_GRADIENTS = [
  'from-amber-100 to-orange-50',
  'from-stone-100 to-stone-50',
  'from-emerald-100 to-teal-50',
  'from-rose-100 to-pink-50',
  'from-sky-100 to-blue-50',
  'from-violet-100 to-purple-50',
];

const CONDITION_STYLE: Record<Condition, string> = {
  A: 'bg-emerald-50 text-emerald-700',
  'A-': 'bg-teal-50 text-teal-700',
  'B+': 'bg-amber-50 text-amber-700',
  B: 'bg-stone-100 text-stone-600',
};

interface RecommendedItem extends CatalogItem {
  match: number | null;
}

function Landing() {
  const [selected, setSelected] = useState<TasteTag[]>([]);

  const toggleTag = (tag: TasteTag) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const recommendations = useMemo<RecommendedItem[]>(() => {
    if (selected.length === 0) {
      return CATALOG.slice(0, 6).map((item) => ({ ...item, match: null }));
    }

    return CATALOG.map((item) => {
      const overlap = item.tags.filter((tag) => selected.includes(tag));
      const match = Math.round((overlap.length / selected.length) * 100);
      return { ...item, match, overlapCount: overlap.length };
    })
      .filter((item) => (item.overlapCount ?? 0) > 0)
      .sort((a, b) => (b.match ?? 0) - (a.match ?? 0))
      .slice(0, 6);
  }, [selected]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight">repick</span>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 sm:flex">
            <a href="#demo" className="text-stone-900">
              기능
            </a>
            <a href="#more" className="rounded-sm hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
              더 알아보기
            </a>
          </nav>
          <a
            href="#start"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            무료로 시작하기
          </a>
        </div>
      </header>

      <main>
        {/* 히어로 */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-amber-700">기능 소개 · 취향 학습</p>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            설명 대신, 직접 눌러서 확인하세요
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            아래 태그를 눌러 취향을 알려주면, repick의 AI가 실시간으로 추천 결과를 다시
            계산합니다. 실제 서비스에서는 찜·클릭·구매 기록으로 이 학습이 자동으로 쌓여요.
          </p>
        </section>

        {/* 인터랙티브 데모 */}
        <section id="demo" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">① 취향 학습, 지금 체험해보기</h2>
              <p className="mt-1 text-sm text-stone-500">
                끌리는 태그를 원하는 만큼 골라보세요. 아래 추천이 즉시 바뀝니다.
              </p>
            </div>

            <div role="group" aria-label="취향 태그 선택" className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const isOn = selected.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isOn}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                      isOn
                        ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                        : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {isOn ? '✓ ' : ''}
                    {tag}
                  </button>
                );
              })}
            </div>

            <p aria-live="polite" className="mt-4 text-sm text-stone-600">
              {selected.length === 0 ? (
                <>
                  태그를 눌러보세요 — 지금은 <strong className="text-stone-900">인기순</strong>{' '}
                  아이템을 보여주고 있어요.
                </>
              ) : (
                <>
                  AI가{' '}
                  <strong className="text-amber-700">
                    {selected.join(', ')}
                  </strong>{' '}
                  취향을 학습해 {recommendations.length}개 아이템을 다시 골랐어요.
                </>
              )}
            </p>

            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="mt-2 text-xs font-medium text-stone-400 underline decoration-dotted underline-offset-2 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                태그 초기화
              </button>
            )}

            <div className="mt-6 border-t border-stone-100 pt-6">
              {recommendations.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 py-12 text-center">
                  <span className="text-3xl" aria-hidden="true">
                    🔍
                  </span>
                  <p className="text-sm text-stone-500">
                    일치하는 아이템이 없어요. 태그를 하나 줄여보세요.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((item, index) => (
                    <li key={item.id}>
                      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                        <div
                          className={`flex h-28 items-center justify-center bg-gradient-to-br text-5xl ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-stone-900">{item.name}</h3>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${CONDITION_STYLE[item.condition]}`}
                            >
                              상태 {item.condition}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-full px-2 py-0.5 text-[11px] ${
                                  selected.includes(tag)
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-100 text-stone-500'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-base font-bold text-stone-900">
                            {item.price.toLocaleString('ko-KR')}원
                          </p>
                          {item.match !== null && (
                            <div className="mt-1">
                              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-emerald-700">
                                <span>AI 매칭률</span>
                                <span>{item.match}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                                <div
                                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                                  style={{ width: `${item.match}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* 나머지 기능 요약 */}
        <section id="more" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-6 text-xl font-bold text-stone-900">나머지 기능도 이렇게 작동해요</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex flex-col gap-1.5" aria-hidden="true">
                <div className="h-2 w-full rounded-full bg-stone-200" />
                <div className="ml-auto h-2 w-3/4 rounded-full bg-stone-300" />
                <div className="ml-auto h-2 w-1/2 rounded-full bg-amber-500" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-stone-900">② AI 매칭</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                수만 개 매물 중, 학습된 취향과 가장 가까운 것만 걸러서 보여줘요.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <ul className="space-y-1.5 text-xs text-stone-600" aria-hidden="true">
                <li className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                  상태 확인
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                  가격 검증
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                  판매자 검증
                </li>
              </ul>
              <h3 className="mt-4 text-sm font-bold text-stone-900">③ 신뢰 검증</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                상태·가격·판매자를 AI가 3중으로 검증한 매물만 추천해요.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="relative inline-flex" aria-hidden="true">
                <span className="text-3xl">🔔</span>
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-600" />
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-stone-900">④ 실시간 알림</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                가격이 내려가거나 새 매칭이 뜨면, 바로 알려드려요.
              </p>
            </div>
          </div>
        </section>

        {/* 최종 CTA */}
        <section id="start" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-stone-900 px-6 py-12 text-center text-white">
            <p className="text-sm font-semibold text-amber-400">지금 방금 체험한 그대로</p>
            <h2 className="text-2xl font-bold sm:text-3xl">실제 서비스에서는 자동으로 학습돼요</h2>
            <p className="max-w-md text-sm leading-relaxed text-stone-300">
              가입 후 찜하고 둘러보는 것만으로 repick의 AI가 취향을 학습합니다.
            </p>
            <a
              href="#"
              className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        © repick — AI 중고 리커머스
      </footer>
    </div>
  );
}

export default Landing;
