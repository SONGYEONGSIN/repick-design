'use client';

import { useEffect, useRef, useState } from 'react';

interface Post {
  id: number;
  category: '신발' | '의류';
  categoryEmoji: string;
  seller: string;
  initial: string;
  name: string;
  listPrice: number;
  salePrice: number;
  save: number;
  match: number;
  tag: string;
  timeAgo: string;
  likes: number;
  aiComment: string;
  gradFrom: string;
  gradTo: string;
}

const POSTS: Post[] = [
  {
    id: 1,
    category: '신발',
    categoryEmoji: '👟',
    seller: '민서마켓',
    initial: '민',
    name: "나이키 에어포스1 '07",
    listPrice: 139000,
    salePrice: 68000,
    save: 71000,
    match: 96,
    tag: 'NEW',
    timeAgo: '방금 전',
    likes: 482,
    aiComment: '취향 벡터 96% 일치 · 지금이 이번 달 최저가예요',
    gradFrom: 'from-sky-400',
    gradTo: 'to-indigo-600',
  },
  {
    id: 2,
    category: '의류',
    categoryEmoji: '👕',
    seller: '빈티지클로젯',
    initial: '빈',
    name: '리바이스 501 오리지널 데님',
    listPrice: 98000,
    salePrice: 42000,
    save: 56000,
    match: 94,
    tag: '가격↓',
    timeAgo: '12분 전',
    likes: 317,
    aiComment: '찜한 데님 스타일과 92% 유사 · 오늘만 5,000원 추가 하락',
    gradFrom: 'from-indigo-400',
    gradTo: 'to-violet-600',
  },
  {
    id: 3,
    category: '의류',
    categoryEmoji: '👕',
    seller: '노르딕웨어',
    initial: '노',
    name: '아크네 스튜디오 하프집업 니트',
    listPrice: 320000,
    salePrice: 158000,
    save: 162000,
    match: 92,
    tag: 'HOT',
    timeAgo: '28분 전',
    likes: 601,
    aiComment: '같은 브랜드 3건 연속 관심 · 재고 1개 남음',
    gradFrom: 'from-fuchsia-400',
    gradTo: 'to-purple-600',
  },
  {
    id: 4,
    category: '신발',
    categoryEmoji: '👟',
    seller: '런닝맨스토어',
    initial: '런',
    name: '뉴발란스 990v5',
    listPrice: 219000,
    salePrice: 121000,
    save: 98000,
    match: 90,
    tag: '-',
    timeAgo: '41분 전',
    likes: 254,
    aiComment: '최근 찜한 러닝화와 색상 계열이 일치해요',
    gradFrom: 'from-cyan-400',
    gradTo: 'to-sky-600',
  },
  {
    id: 5,
    category: '의류',
    categoryEmoji: '👕',
    seller: '스트릿마켓',
    initial: '스',
    name: '스투시 로고 후드집업',
    listPrice: 145000,
    salePrice: 79000,
    save: 66000,
    match: 89,
    tag: 'NEW',
    timeAgo: '1시간 전',
    likes: 198,
    aiComment: '신규 등록 3분 만에 포착 · 사이즈 재고 2개',
    gradFrom: 'from-amber-400',
    gradTo: 'to-rose-500',
  },
  {
    id: 6,
    category: '의류',
    categoryEmoji: '👕',
    seller: '클래식클로젯',
    initial: '클',
    name: '폴로 랄프로렌 코듀로이 셔츠',
    listPrice: 128000,
    salePrice: 55000,
    save: 73000,
    match: 87,
    tag: '-',
    timeAgo: '2시간 전',
    likes: 143,
    aiComment: '가을 시즌 관심 카테고리와 일치해요',
    gradFrom: 'from-violet-400',
    gradTo: 'to-indigo-600',
  },
  {
    id: 7,
    category: '신발',
    categoryEmoji: '👟',
    seller: '올드스쿨슈즈',
    initial: '올',
    name: '컨버스 척테일러 70s',
    listPrice: 89000,
    salePrice: 39000,
    save: 50000,
    match: 85,
    tag: '가격↓',
    timeAgo: '3시간 전',
    likes: 210,
    aiComment: '어제보다 3,000원 추가 하락을 감지했어요',
    gradFrom: 'from-teal-400',
    gradTo: 'to-cyan-600',
  },
  {
    id: 8,
    category: '의류',
    categoryEmoji: '👕',
    seller: '아웃도어라이프',
    initial: '아',
    name: '파타고니아 레트로X 플리스',
    listPrice: 259000,
    salePrice: 132000,
    save: 127000,
    match: 83,
    tag: '-',
    timeAgo: '5시간 전',
    likes: 176,
    aiComment: '겨울 대비 관심이 급상승한 카테고리예요',
    gradFrom: 'from-rose-400',
    gradTo: 'to-fuchsia-600',
  },
];

const POSTS_BY_ID = new Map(POSTS.map((p) => [p.id, p]));

const STORIES: { key: string; label: string; emoji: string }[] = [
  { key: '전체', label: '전체', emoji: '✨' },
  { key: '신발', label: '신발', emoji: '👟' },
  { key: '의류', label: '의류', emoji: '👕' },
  { key: '가방', label: '가방', emoji: '👜' },
  { key: '가구', label: '가구', emoji: '🛋️' },
];

const NAV_ITEMS = [
  { label: '홈', icon: '🏠', active: true },
  { label: 'AI 추천', icon: '✨', active: false },
  { label: '찜', icon: '❤️', active: false },
  { label: '설정', icon: '⚙️', active: false },
];

const TAG_RIBBON: Record<string, string> = {
  'NEW': 'bg-emerald-500',
  '가격↓': 'bg-rose-500',
  'HOT': 'bg-amber-500',
};

const BASE_WISHLIST = 5;
const BASE_SAVE_AMOUNT = 498000;

function won(n: number): string {
  return n.toLocaleString('ko-KR');
}

function discountPct(list: number, sale: number): number {
  return Math.round((1 - sale / list) * 100);
}

function PostCard({
  post,
  liked,
  saved,
  pulsing,
  shared,
  onToggleLike,
  onToggleSave,
  onImageTap,
  onSkip,
  onShare,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  pulsing: boolean;
  shared: boolean;
  onToggleLike: (id: number) => void;
  onToggleSave: (id: number) => void;
  onImageTap: (id: number) => void;
  onSkip: (post: Post) => void;
  onShare: (id: number) => void;
}) {
  const likeCount = post.likes + (liked ? 1 : 0);
  const ribbon = TAG_RIBBON[post.tag];

  return (
    <article className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mb-5">
      <header className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${post.gradFrom} ${post.gradTo} text-xs font-bold text-white`}
            aria-hidden="true"
          >
            {post.initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-900">{post.seller}</span>
            <span className="block text-xs text-slate-400">
              {post.categoryEmoji} {post.category} · {post.timeAgo}
            </span>
          </span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
          🎯 {post.match}% 일치
        </span>
      </header>

      <button
        type="button"
        onClick={() => onImageTap(post.id)}
        aria-pressed={liked}
        aria-label={`${post.name} 이미지, 더블 탭하여 좋아요, 현재 좋아요 ${likeCount}개`}
        className={`relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${post.gradFrom} ${post.gradTo} text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:aspect-[16/10]`}
      >
        {ribbon && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm ${ribbon}`}
          >
            {post.tag}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center text-7xl opacity-80" aria-hidden="true">
          {post.categoryEmoji}
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10">
          <span className="block text-base font-bold text-white sm:text-lg">{post.name}</span>
        </span>
        {pulsing && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="heart-pop text-7xl text-white drop-shadow-lg">❤️</span>
          </span>
        )}
      </button>

      <div className="flex items-center gap-1 px-2 pt-1.5 sm:px-3">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          aria-pressed={liked}
          aria-label={`좋아요, 현재 ${likeCount}개`}
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span className={liked ? 'text-rose-500' : 'text-slate-400'} aria-hidden="true">
            {liked ? '❤️' : '🤍'}
          </span>
          <span className="tabular-nums text-slate-600">{likeCount.toLocaleString('ko-KR')}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(post.id)}
          aria-pressed={saved}
          aria-label={saved ? '찜 취소' : '찜하기'}
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span className={saved ? 'text-indigo-600' : 'text-slate-400'} aria-hidden="true">
            {saved ? '🔖' : '📑'}
          </span>
          <span className="text-slate-600">{saved ? '찜함' : '찜'}</span>
        </button>

        <button
          type="button"
          onClick={() => onShare(post.id)}
          aria-label="링크 공유"
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span aria-hidden="true">🔗</span>
          <span>{shared ? '복사됨' : '공유'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSkip(post)}
          aria-label="관심없음, 피드에서 제외"
          className="ml-auto flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span aria-hidden="true">🚫</span>
          <span>관심없음</span>
        </button>
      </div>

      <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
        <p className="text-sm text-slate-700">
          <span className="mr-1.5 text-slate-400 line-through">{won(post.listPrice)}원</span>
          <span className="font-bold text-slate-900">{won(post.salePrice)}원</span>
          <span className="ml-1.5 font-bold text-rose-500">{discountPct(post.listPrice, post.salePrice)}%↓</span>
        </p>
        <p className="mt-2 rounded-lg bg-indigo-50 px-2.5 py-2 text-xs italic leading-relaxed text-indigo-700">
          <span className="mr-1 not-italic font-bold">repick AI ·</span>
          {post.aiComment}
        </p>
      </div>
    </article>
  );
}

export default function Landing() {
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState('전체');
  const [viewedCats, setViewedCats] = useState<Set<string>>(new Set(['전체']));
  const [pulseId, setPulseId] = useState<number | null>(null);
  const [sharedId, setSharedId] = useState<number | null>(null);
  const [lastRemoved, setLastRemoved] = useState<{ post: Post; index: number } | null>(null);

  const undoTimerRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const shareTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current);
    };
  }, []);

  function toggleLike(id: number) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSave(id: number) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleImageTap(id: number) {
    if (!likedIds.has(id)) {
      setLikedIds((prev) => new Set(prev).add(id));
    }
    setPulseId(id);
    if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => setPulseId((cur) => (cur === id ? null : cur)), 700);
  }

  function handleShare(id: number) {
    setSharedId(id);
    if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current);
    shareTimerRef.current = window.setTimeout(() => setSharedId((cur) => (cur === id ? null : cur)), 1500);
  }

  function handleSkip(post: Post) {
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    setLastRemoved({ post, index: idx });
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setLastRemoved(null), 5000);
  }

  function handleUndo() {
    if (!lastRemoved) return;
    const { post, index } = lastRemoved;
    setPosts((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, post);
      return next;
    });
    setLastRemoved(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }

  function handleReset() {
    setPosts(POSTS);
    setLastRemoved(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }

  function handleSelectCategory(key: string) {
    setActiveCategory(key);
    setViewedCats((prev) => new Set(prev).add(key));
  }

  const visiblePosts = posts.filter((p) => activeCategory === '전체' || p.category === activeCategory);

  const savedCount = BASE_WISHLIST + savedIds.size;
  const savedAmount =
    BASE_SAVE_AMOUNT +
    Array.from(savedIds).reduce((sum, id) => sum + (POSTS_BY_ID.get(id)?.save ?? 0), 0);

  const stats = [
    { label: '오늘의 추천', value: '24', unit: '건', delta: '+6', note: '어제 대비', accent: false },
    {
      label: '찜한 아이템',
      value: String(savedCount),
      unit: '건',
      delta: savedIds.size > 0 ? `+${savedIds.size}` : '−',
      note: savedIds.size > 0 ? '방금 추가' : '변동 없음',
      accent: false,
    },
    { label: '예상 절약액', value: won(savedAmount), unit: '원', delta: '+18%', note: '지난주 대비', accent: true },
    { label: 'AI 매칭률', value: '91', unit: '%', delta: '+3%p', note: '지난주 대비', accent: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(0.4); opacity: 0; }
          15% { transform: scale(1.15); opacity: 1; }
          30% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .heart-pop { animation: heartPop 0.7s ease-out forwards; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toast-in { animation: toastIn 0.2s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .heart-pop, .toast-in { animation: none !important; }
        }
      `}</style>

      {/* 모바일 상단 바 */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs text-white">
            r
          </span>
          repick
        </span>
        <span className="relative text-lg" aria-hidden="true">
          🔔
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
        </span>
      </header>

      <div className="mx-auto flex max-w-[1280px] md:min-h-screen">
        {/* 데스크톱 좌측 네비 */}
        <nav
          aria-label="주요 메뉴"
          className="hidden shrink-0 flex-col justify-between border-r border-slate-200 bg-white md:flex md:w-20 xl:w-64"
        >
          <div>
            <div className="hidden items-center gap-2 border-b border-slate-100 px-6 py-5 xl:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                r
              </span>
              <span className="text-sm font-bold tracking-tight text-slate-900">repick</span>
            </div>
            <div className="flex items-center justify-center border-b border-slate-100 py-5 xl:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                r
              </span>
            </div>
            <ul className="flex flex-col gap-1 px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    aria-current={item.active ? 'page' : undefined}
                    className={`flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 xl:justify-start ${
                      item.active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden border-t border-slate-100 px-6 py-5 xl:block">
            <p className="text-xs text-slate-400">서연님</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">● PRO 멤버십</p>
          </div>
        </nav>

        {/* 메인 피드 */}
        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          <div className="mx-auto max-w-lg px-3 pt-4 sm:px-4 sm:pt-6 lg:max-w-xl">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              서연님, 오늘의 피드예요 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              좋아요·찜·관심없음으로 반응할수록 AI 추천이 더 정교해져요.
            </p>

            {/* 요약 스탯 */}
            <section aria-label="요약 지표" className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                  <p
                    className={`mt-1 text-lg font-bold tabular-nums sm:text-xl ${
                      s.accent ? 'text-indigo-600' : 'text-slate-900'
                    }`}
                  >
                    {s.value}
                    <span className="ml-0.5 text-xs font-normal text-slate-400">{s.unit}</span>
                  </p>
                  <p className="mt-1 text-[10px] tabular-nums text-slate-400">
                    <span className={s.accent ? 'font-semibold text-indigo-600' : 'font-semibold text-slate-500'}>
                      {s.delta}
                    </span>{' '}
                    {s.note}
                  </p>
                </div>
              ))}
            </section>

            {/* 스토리 하이라이트 */}
            <section aria-label="카테고리 하이라이트" className="mt-5 sm:mt-6">
              <h2 className="sr-only">카테고리 하이라이트</h2>
              <ul className="-mx-3 flex gap-4 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4">
                {STORIES.map((s) => {
                  const isActive = activeCategory === s.key;
                  const isViewed = viewedCats.has(s.key);
                  return (
                    <li key={s.key} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(s.key)}
                        aria-pressed={isActive}
                        className="flex w-16 flex-col items-center gap-1.5 rounded-xl p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <span
                          className={`flex h-14 w-14 items-center justify-center rounded-full p-[2px] ${
                            isActive
                              ? 'bg-indigo-600'
                              : isViewed
                                ? 'bg-slate-200'
                                : 'bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400'
                          }`}
                        >
                          <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-slate-50 text-xl">
                            {s.emoji}
                          </span>
                        </span>
                        <span
                          className={`truncate text-[11px] ${isActive ? 'font-bold text-indigo-600' : 'text-slate-500'}`}
                        >
                          {s.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 피드 */}
            <section aria-label="오늘의 AI 추천 피드" className="mt-5 sm:mt-6">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-bold text-slate-900">오늘의 AI 추천</h2>
                <span className="text-xs text-slate-400">{visiblePosts.length}건 표시 중</span>
              </div>

              {visiblePosts.length > 0 ? (
                visiblePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    liked={likedIds.has(post.id)}
                    saved={savedIds.has(post.id)}
                    pulsing={pulseId === post.id}
                    shared={sharedId === post.id}
                    onToggleLike={toggleLike}
                    onToggleSave={toggleSave}
                    onImageTap={handleImageTap}
                    onSkip={handleSkip}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
                  <span className="text-4xl" aria-hidden="true">
                    {posts.length === 0 ? '🎉' : '🧭'}
                  </span>
                  <p className="text-sm font-semibold text-slate-700">
                    {posts.length === 0 ? '오늘 추천을 모두 확인했어요!' : '아직 이 카테고리엔 추천이 없어요'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {posts.length === 0
                      ? '새로고침하면 피드를 다시 볼 수 있어요.'
                      : '취향 학습이 진행되면 곧 추천이 채워질 거예요.'}
                  </p>
                  <button
                    type="button"
                    onClick={posts.length === 0 ? handleReset : () => handleSelectCategory('전체')}
                    className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {posts.length === 0 ? '피드 새로고침' : '전체 보기'}
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* 데스크톱 우측 사이드 */}
        <aside
          aria-label="최근 활동 및 저장한 아이템"
          className="hidden w-80 shrink-0 border-l border-slate-200 bg-white px-6 py-6 lg:block"
        >
          <h2 className="text-sm font-bold text-slate-900">최근 활동</h2>
          <ul className="mt-3 flex flex-col gap-3">
            <li className="text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">repick AI</span>가 지난 1시간 동안 매물{' '}
              <span className="font-semibold text-slate-700">1,204건</span>을 분석했어요.
            </li>
            <li className="text-xs leading-relaxed text-slate-500">
              찜한 <span className="font-semibold text-slate-700">데님 스타일</span>과 유사한 신규 매물{' '}
              <span className="font-semibold text-indigo-600">3건</span>이 등록됐어요.
            </li>
            <li className="text-xs leading-relaxed text-slate-500">
              어제보다 가격이 내린 매물이{' '}
              <span className="font-semibold text-rose-500">6건</span> 있어요.
            </li>
          </ul>

          <h3 className="mt-6 text-sm font-bold text-slate-900">저장한 아이템 · {savedCount}건</h3>
          {savedIds.size > 0 ? (
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {Array.from(savedIds).map((id) => {
                const p = POSTS_BY_ID.get(id);
                if (!p) return null;
                return (
                  <li key={id}>
                    <span
                      className={`flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br ${p.gradFrom} ${p.gradTo} text-lg`}
                      title={p.name}
                      aria-hidden="true"
                    >
                      {p.categoryEmoji}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-400">피드에서 🔖 찜을 누르면 여기 모여요.</p>
          )}

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">알림 설정</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              가격 하락 · 신규 매칭 · 재입고 알림을 실시간으로 받아보세요.
            </p>
            <a
              href="#"
              className="mt-2 inline-block text-xs font-semibold text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              알림 관리 →
            </a>
          </div>
        </aside>
      </div>

      {/* 모바일 하단 탭바 */}
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white py-2 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              item.active ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      {/* 실행취소 토스트 */}
      {lastRemoved && (
        <div
          role="status"
          aria-live="polite"
          className="toast-in fixed inset-x-4 bottom-20 z-50 flex items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg sm:inset-x-auto sm:right-6 sm:w-80 md:bottom-6"
        >
          <span className="text-xs">‘{lastRemoved.post.name}’ 관심없음으로 표시했어요</span>
          <button
            type="button"
            onClick={handleUndo}
            className="shrink-0 text-xs font-bold text-indigo-300 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            실행취소
          </button>
        </div>
      )}
    </div>
  );
}
