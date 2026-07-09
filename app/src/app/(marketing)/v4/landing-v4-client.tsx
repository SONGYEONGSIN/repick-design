"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Bot,
  Check,
  ChevronDown,
  Coins,
  Crown,
  Feather,
  Footprints,
  Gem,
  Heart,
  Menu,
  Pencil,
  Quote,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Shirt,
  Sparkles,
  Wallet,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const MotionLink = motion.create(Link);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const wonFormatter = new Intl.NumberFormat("ko-KR");
const formatWon = (value: number) => `${wonFormatter.format(value)}원`;

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

type Dim = "style" | "budget" | "category";

type QuizOption = {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
};

type Question = {
  dim: Dim;
  prompt: string;
  aiLine: string;
  options: QuizOption[];
};

const QUESTIONS: Question[] = [
  {
    dim: "style",
    prompt: "요즘 어떤 무드에 끌리세요?",
    aiLine: "안녕하세요, RE:픽 AI 큐레이터예요. 취향부터 알려주실래요?",
    options: [
      { value: "vintage", label: "빈티지", icon: Feather },
      { value: "minimal", label: "미니멀", icon: Gem },
      { value: "street", label: "스트릿", icon: Zap },
      { value: "formal", label: "포멀", icon: Crown },
    ],
  },
  {
    dim: "budget",
    prompt: "이번엔 예산을 어느 정도로 볼까요?",
    aiLine: "좋아요, 취향 확인했어요. 예산대는 어느 쪽에 가까우세요?",
    options: [
      { value: "low", label: "5만원 이하", icon: Coins },
      { value: "mid", label: "5~10만원", icon: Wallet },
      { value: "high", label: "10만원 이상", icon: Banknote },
    ],
  },
  {
    dim: "category",
    prompt: "마지막으로, 어떤 카테고리부터 볼까요?",
    aiLine: "거의 다 왔어요. 지금 가장 필요한 카테고리는요?",
    options: [
      { value: "outer", label: "아우터", icon: Shirt },
      { value: "bag", label: "가방", icon: ShoppingBag },
      { value: "shoes", label: "신발", icon: Footprints },
    ],
  },
];

const DIM_LABELS: Record<Dim, string> = {
  style: "무드",
  budget: "예산",
  category: "카테고리",
};

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  original: number;
  style: string;
  budget: string;
  category: string;
  image: string;
  alt: string;
};

const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "오버사이즈 울 코트",
    brand: "Aureum Vintage",
    price: 89000,
    original: 148000,
    style: "vintage",
    budget: "mid",
    category: "outer",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    alt: "옷걸이에 가지런히 걸린 코트들",
  },
  {
    id: "crossbag",
    title: "레더 크로스백",
    brand: "Atelier Noir",
    price: 62000,
    original: 120000,
    style: "minimal",
    budget: "mid",
    category: "bag",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
  },
  {
    id: "sneakers",
    title: "클래식 스니커즈",
    brand: "Runway Archive",
    price: 54000,
    original: 98000,
    style: "minimal",
    budget: "mid",
    category: "shoes",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "화이트 톤의 클래식 스니커즈 한 켤레",
  },
  {
    id: "blouse",
    title: "실크 블라우스",
    brand: "Maison Blanche",
    price: 47000,
    original: 89000,
    style: "formal",
    budget: "low",
    category: "outer",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    alt: "실크 블라우스를 입은 인물의 패션 컷",
  },
  {
    id: "hoodie",
    title: "스트릿 후드 집업",
    brand: "Neo Block",
    price: 38000,
    original: 72000,
    style: "street",
    budget: "low",
    category: "outer",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    alt: "옷걸이에 걸린 다양한 색상의 의류가 줄지어 있는 모습",
  },
  {
    id: "cardigan",
    title: "파스텔 니트 가디건",
    brand: "Soft Atelier",
    price: 45000,
    original: 79000,
    style: "minimal",
    budget: "low",
    category: "outer",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    alt: "파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙",
  },
  {
    id: "totebag",
    title: "스퀘어 토트백",
    brand: "Studio Form",
    price: 71000,
    original: 132000,
    style: "formal",
    budget: "mid",
    category: "bag",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    alt: "가죽 소재 크로스백과 액세서리를 가까이서 촬영한 사진",
  },
  {
    id: "canvas-sneakers",
    title: "캔버스 스니커즈",
    brand: "Street Archive",
    price: 33000,
    original: 59000,
    style: "street",
    budget: "low",
    category: "shoes",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    alt: "다양한 색상의 의류가 걸려 있는 옷걸이 랙",
  },
];

function scoreProduct(product: Product, answers: Record<Dim, string | null>) {
  let score = 0;
  if (answers.style && product.style === answers.style) score += 1;
  if (answers.budget && product.budget === answers.budget) score += 1;
  if (answers.category && product.category === answers.category) score += 1;
  return score;
}

const WHY_ITEMS = [
  {
    icon: Wand2,
    title: "질문 3개, 스크롤 0번",
    desc: "취향을 말로 설명하지 않아도 돼요. 칩을 고르면 AI가 후보를 바로 좁힙니다.",
  },
  {
    icon: Sparkles,
    title: "답이 바뀌면 추천도 바뀌어요",
    desc: "선택을 바꾸면 옆 패널의 상품이 실시간으로 재정렬됩니다. 눈으로 확인하고 결정하세요.",
  },
  {
    icon: ShieldCheck,
    title: "검증된 상태만 후보에 올라요",
    desc: "전문 검수팀이 실측한 상품만 매칭 후보가 됩니다. 골라도, 믿고 받을 수 있어요.",
  },
];

const STATS = [
  { label: "평균 응답 시간", value: "32초" },
  { label: "재추천 정확도", value: "94%" },
  { label: "사용자 만족도", value: "4.9 / 5" },
];

const TESTIMONIALS = [
  {
    quote: "질문 3개 답했을 뿐인데 진짜 제 스타일만 나와서 놀랐어요.",
    name: "김도윤",
    role: "프리랜서 디자이너",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "고르는 게 아니라 답하는 거라 오히려 편해요. 상태 등급도 정확하고요.",
    name: "이서현",
    role: "마케터",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "답변 바꿔가며 추천이 바뀌는 걸 보는 재미가 있어요. 빈티지 찾는 시간이 확 줄었어요.",
    name: "박지민",
    role: "사진작가",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
];

const FAQS = [
  {
    question: "질문에 오래 고민해야 하나요?",
    answer:
      "아니에요, 3개 질문 모두 30초면 충분해요. 답을 바꾸면 추천도 그 자리에서 바로 바뀝니다.",
  },
  {
    question: "정확한 취향을 몰라도 답할 수 있나요?",
    answer:
      "대략적인 느낌만 있어도 됩니다. 이후 찜하거나 넘기는 행동까지 반영해 추천이 계속 정교해져요.",
  },
  {
    question: "가격은 어떻게 책정되나요?",
    answer:
      "시세 데이터와 실측 상태 등급을 기반으로 산정합니다. 원가와 할인율을 매물마다 투명하게 함께 표기해요.",
  },
  {
    question: "상품 상태는 어떻게 확인할 수 있나요?",
    answer:
      "전문 검수팀이 실측 사이즈와 하자 여부를 직접 확인한 뒤, 등급과 실측 사진을 함께 제공합니다.",
  },
  {
    question: "반품이나 환불도 가능한가요?",
    answer:
      "상품 설명과 실물 상태가 다르면 반품 및 환불을 지원합니다. 마이페이지 고객센터에서 바로 안내받을 수 있어요.",
  },
];

const NAV_LINKS = [
  { href: "#quiz", label: "취향 테스트" },
  { href: "#why", label: "이렇게 다릅니다" },
  { href: "#showcase", label: "전체 추천" },
  { href: "#testimonials", label: "후기" },
  { href: "#faq", label: "FAQ" },
];

const FOOTER_COLUMNS = [
  {
    title: "제품",
    links: [
      { label: "취향 테스트", href: "#quiz" },
      { label: "이렇게 다릅니다", href: "#why" },
      { label: "전체 추천", href: "#showcase" },
      { label: "앱 다운로드", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "채용", href: "#" },
      { label: "뉴스룸", href: "#" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "고객센터", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Quiz option group (roving-tabindex radiogroup)                      */
/* ------------------------------------------------------------------ */

function QuizOptionGroup({
  question,
  selected,
  onSelect,
  autoFocus,
}: {
  question: Question;
  selected: string | null;
  onSelect: (value: string) => void;
  autoFocus: boolean;
}) {
  const [focusIndex, setFocusIndex] = useState(() => {
    const idx = question.options.findIndex((option) => option.value === selected);
    return idx >= 0 ? idx : 0;
  });
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      buttonRefs.current[focusIndex]?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const moveFocus = (nextIndex: number) => {
    const count = question.options.length;
    const clamped = (nextIndex + count) % count;
    setFocusIndex(clamped);
    buttonRefs.current[clamped]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={question.prompt}
      className="flex flex-wrap gap-2.5"
    >
      {question.options.map((option, index) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={focusIndex === index ? 0 : -1}
            onClick={() => {
              setFocusIndex(index);
              onSelect(option.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveFocus(index + 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveFocus(index - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                moveFocus(0);
              } else if (event.key === "End") {
                event.preventDefault();
                moveFocus(question.options.length - 1);
              }
            }}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${focusRing} ${
              isSelected
                ? "border-orange-700 bg-orange-50 text-orange-800"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
            }`}
          >
            <option.icon className="h-4 w-4" aria-hidden="true" />
            {option.label}
            {isSelected && <Check className="h-4 w-4 text-orange-700" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Landing                                                              */
/* ------------------------------------------------------------------ */

export default function LandingV4Client() {
  const prefersReducedMotion = useReducedMotion();

  const [answers, setAnswers] = useState<Record<Dim, string | null>>({
    style: null,
    budget: null,
    category: null,
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentIndex = useMemo(() => {
    const idx = QUESTIONS.findIndex((q) => !answers[q.dim]);
    return idx === -1 ? QUESTIONS.length : idx;
  }, [answers]);

  const answeredCount = currentIndex;
  const isComplete = answeredCount === QUESTIONS.length;

  const handleSelect = (dim: Dim, value: string) => {
    setHasInteracted(true);
    setAnswers((prev) => ({ ...prev, [dim]: value }));
  };

  const handleEdit = (dimIndex: number) => {
    setHasInteracted(true);
    setAnswers((prev) => {
      const next = { ...prev };
      for (let i = dimIndex; i < QUESTIONS.length; i += 1) {
        next[QUESTIONS[i].dim] = null;
      }
      return next;
    });
  };

  const handleReset = () => {
    setHasInteracted(true);
    setAnswers({ style: null, budget: null, category: null });
  };

  const rankedProducts = useMemo(() => {
    return [...PRODUCTS]
      .map((product) => ({ product, score: scoreProduct(product, answers) }))
      .sort((a, b) => b.score - a.score);
  }, [answers]);

  const topMatches = rankedProducts.slice(0, 4);
  const hasAnyAnswer = answeredCount > 0;

  const liveSummary = isComplete
    ? `질문 3/3 완료 · 취향에 맞는 상품 ${topMatches.filter((m) => m.score > 0).length}개를 찾았어요.`
    : hasAnyAnswer
      ? `질문 ${answeredCount}/3 답변 완료 · 추천 상품이 갱신됐어요.`
      : "AI 큐레이터가 질문할 준비를 마쳤어요.";

  // Mobile navigation drawer
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (mobileNavOpen) {
      closeButtonRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE },
    },
  };
  const staggerContainer = (stagger = 0.1): Variants => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  });
  const bubbleVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 14, scale: prefersReducedMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.4, ease: EASE },
    },
    exit: { opacity: prefersReducedMotion ? 1 : 0, transition: { duration: 0.15 } },
  };

  const hoverLiftCard = prefersReducedMotion ? undefined : { y: -6 };
  const hoverLiftSmall = prefersReducedMotion ? undefined : { y: -3 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (id: string) => {
    setLikedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#main-content"
            aria-label="RE:픽 홈"
            className={`inline-flex items-center gap-1.5 rounded-md text-2xl font-bold tracking-tight text-stone-900 ${focusRing}`}
          >
            <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </a>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition motion-safe:hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0 active:bg-stone-950 md:inline-flex ${focusRing}`}
            >
              무료로 시작
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 md:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              key="mobile-nav-overlay"
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-stone-900/50 md:hidden"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            />
            <motion.div
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="주요 메뉴"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 border-l border-stone-200 bg-stone-50 px-6 py-6 shadow-2xl md:hidden"
              initial={{ x: prefersReducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : "100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-stone-900">메뉴</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="메뉴 닫기"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 ${focusRing}`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="모바일 주요 메뉴" className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`rounded-md px-2 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 ${focusRing}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
              >
                무료로 시작
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content" className="bg-stone-50">
        {/* Hero / Quiz */}
        <section id="quiz" aria-labelledby="hero-heading" className="border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-600 shadow-sm">
                <Bot className="h-4 w-4 text-orange-700" aria-hidden="true" />
                AI 큐레이터와 30초 대화
              </p>
              <h1
                id="hero-heading"
                className="mt-6 text-balance text-[clamp(2.25rem,5.4vw,4rem)] font-sans leading-[1.08] tracking-[-0.01em] text-stone-900"
              >
                질문 3개면,
                <br className="hidden sm:block" />
                당신의 취향을{" "}
                <em className="text-orange-700 not-italic font-semibold">압니다</em>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                설명은 넘길게요. 아래 질문에 답해보세요. 오른쪽 추천 상품이 답을
                고를 때마다 실시간으로 바뀝니다.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8">
              {/* Chat thread */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="sr-only">AI 큐레이터 취향 질문</h2>
                <ol className="flex list-none flex-col gap-6">
                  <AnimatePresence initial={false}>
                    {QUESTIONS.map((question, index) => {
                      if (index > currentIndex) return null;
                      const answerValue = answers[question.dim];
                      const selectedOption = question.options.find(
                        (option) => option.value === answerValue,
                      );
                      const isActive = index === currentIndex;

                      return (
                        <motion.li
                          key={question.dim}
                          layout={!prefersReducedMotion}
                          variants={bubbleVariant}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          className="flex flex-col gap-3"
                        >
                          {/* AI bubble */}
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-stone-50"
                            >
                              <Bot className="h-4.5 w-4.5" aria-hidden="true" />
                            </span>
                            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-stone-200 bg-stone-50 px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-400">
                                AI 큐레이터
                              </p>
                              <p className="mt-1 text-base leading-snug text-stone-800">
                                {question.aiLine}
                              </p>
                            </div>
                          </div>

                          {/* Options or answered reply */}
                          {selectedOption ? (
                            <div className="flex items-center justify-end gap-2 pl-12">
                              <span className="inline-flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tr-sm bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white">
                                <selectedOption.icon className="h-4 w-4" aria-hidden="true" />
                                {selectedOption.label}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEdit(index)}
                                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 ${focusRing}`}
                                aria-label={`${DIM_LABELS[question.dim]} 답변 바꾸기`}
                              >
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                          ) : isActive ? (
                            <div className="pl-12">
                              <QuizOptionGroup
                                question={question}
                                selected={answerValue}
                                onSelect={(value) => handleSelect(question.dim, value)}
                                autoFocus={hasInteracted}
                              />
                            </div>
                          ) : null}
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>

                  {isComplete && (
                    <motion.li
                      variants={bubbleVariant}
                      initial="hidden"
                      animate="show"
                      className="flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-700 text-white"
                      >
                        <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-orange-200 bg-orange-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-orange-700">
                          AI 큐레이터
                        </p>
                        <p className="mt-1 text-base leading-snug text-stone-800">
                          완성이에요! 오른쪽에서 지금 당신에게 맞는 상품을 확인해보세요.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <MotionLink
                            href="/dashboard"
                            whileHover={hoverButton}
                            whileTap={tapButton}
                            className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
                          >
                            무료로 시작하기
                            <ArrowRight
                              className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </MotionLink>
                          <button
                            type="button"
                            onClick={handleReset}
                            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 ${focusRing}`}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            다시 선택하기
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  )}
                </ol>

                {/* Progress */}
                <div className="mt-8 flex items-center gap-2 border-t border-stone-200 pt-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    진행률
                  </span>
                  <ol className="flex items-center gap-1.5" aria-hidden="true">
                    {QUESTIONS.map((question, index) => (
                      <li
                        key={question.dim}
                        className={`h-1.5 w-8 rounded-full transition-colors ${
                          index < answeredCount ? "bg-orange-700" : "bg-stone-200"
                        }`}
                      />
                    ))}
                  </ol>
                  <span className="text-xs font-semibold tabular-nums text-stone-500">
                    {answeredCount}/{QUESTIONS.length}
                  </span>
                </div>
              </motion.div>

              {/* Live result panel */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="flex flex-col rounded-[2rem] border border-stone-200 bg-stone-900 p-6 text-stone-50 shadow-xl sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-stone-300">
                    <Sparkles className="h-4 w-4 text-orange-400" aria-hidden="true" />
                    실시간 매칭 결과
                  </h2>
                  {hasAnyAnswer && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-50 ${focusRingOnDark}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      초기화
                    </button>
                  )}
                </div>

                <p aria-live="polite" aria-atomic="true" className="mt-1 text-sm text-stone-400">
                  {liveSummary}
                </p>

                <ul className="mt-5 grid flex-1 grid-cols-2 gap-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {topMatches.map(({ product, score }) => {
                      const matchPercent = hasAnyAnswer
                        ? Math.min(99, 62 + score * 13)
                        : null;
                      const isLiked = !!likedProducts[product.id];
                      return (
                        <motion.li
                          key={product.id}
                          layout={!prefersReducedMotion}
                          initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.94 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE }}
                          className="group relative overflow-hidden rounded-2xl border border-stone-700 bg-stone-800"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.alt}
                              fill
                              sizes="(min-width: 1024px) 12vw, 40vw"
                              className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                            />
                            {matchPercent !== null && (
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-stone-900 shadow-sm">
                                {matchPercent}%
                              </span>
                            )}
                            <button
                              type="button"
                              aria-label={`${product.title} ${isLiked ? "찜 목록에서 빼기" : "찜하기"}`}
                              aria-pressed={isLiked}
                              onClick={() => toggleLike(product.id)}
                              className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition motion-safe:hover:scale-110 ${focusRingOnDark} ${
                                isLiked ? "text-orange-700" : "text-stone-700"
                              }`}
                            >
                              <Heart className="h-3.5 w-3.5" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <div className="p-2.5">
                            <p className="truncate text-xs font-semibold text-stone-100">{product.title}</p>
                            <p className="mt-0.5 text-xs font-semibold tabular-nums text-orange-300">
                              {formatWon(product.price)}
                            </p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <p className="mt-5 text-xs leading-relaxed text-stone-400">
                  {hasAnyAnswer
                    ? "질문에 답할수록 매칭률이 정교해져요."
                    : "아직 인기 상품을 보여드리고 있어요. 왼쪽 질문에 답해보세요."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why interactive */}
        <section id="why" aria-labelledby="why-heading" className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
                이렇게 다릅니다
              </p>
              <h2
                id="why-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                설명 대신, 직접 해보게 했어요
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                기능을 나열하는 대신 방금 겪어본 그 경험이 어떻게 만들어지는지 보여드릴게요.
              </p>
            </motion.div>

            <motion.ul
              className="mt-16 grid gap-6 sm:grid-cols-3"
              variants={staggerContainer(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {WHY_ITEMS.map((item) => (
                <motion.li
                  key={item.title}
                  variants={fadeUp}
                  whileHover={hoverLiftSmall}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-3xl border border-stone-200 bg-stone-50 p-8"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-stone-600">{item.desc}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Full showcase, ranked live by quiz answers */}
        <section id="showcase" aria-labelledby="showcase-heading" className="border-b border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">전체 추천</p>
              <h2
                id="showcase-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                {hasAnyAnswer ? "당신의 답변으로 다시 정렬했어요" : "질문에 답하면 이 순서가 바뀌어요"}
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                8개 후보 전체를 매칭 점수 순으로 보여드려요.{" "}
                <a href="#quiz" className={`rounded-md font-semibold text-stone-900 underline underline-offset-4 ${focusRing}`}>
                  질문으로 돌아가기
                </a>
              </p>
            </motion.div>

            <motion.ul
              layout={!prefersReducedMotion}
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={staggerContainer(0.06)}
            >
              <AnimatePresence initial={false}>
                {rankedProducts.map(({ product, score }, rank) => {
                  const isLiked = !!likedProducts[`full-${product.id}`];
                  const matchPercent = hasAnyAnswer ? Math.min(99, 62 + score * 13) : null;
                  return (
                    <motion.li
                      key={product.id}
                      layout={!prefersReducedMotion}
                      variants={fadeUp}
                      whileHover={hoverLiftCard}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className={`group overflow-hidden rounded-3xl border bg-white ${
                        rank === 0 && hasAnyAnswer ? "border-orange-300 ring-1 ring-orange-200" : "border-stone-200"
                      }`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                        />
                        {matchPercent !== null && (
                          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold tabular-nums text-stone-900 shadow-sm backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                            매칭 {matchPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={`${product.title} ${isLiked ? "찜 목록에서 빼기" : "찜하기"}`}
                          aria-pressed={isLiked}
                          onClick={() => toggleLike(`full-${product.id}`)}
                          className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition motion-safe:hover:scale-110 ${focusRing} ${
                            isLiked ? "text-orange-700" : "text-stone-700"
                          }`}
                        >
                          <Heart className="h-4 w-4" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-stone-600">{product.brand}</p>
                        <h3 className="mt-1 text-base font-semibold text-stone-900">{product.title}</h3>
                        <div className="mt-3 flex flex-wrap items-baseline gap-2 tabular-nums">
                          <span className="text-lg font-semibold text-stone-900">{formatWon(product.price)}</span>
                          <span className="text-sm text-stone-500 line-through">{formatWon(product.original)}</span>
                          <span className="text-sm font-semibold text-orange-700">
                            -{Math.round((1 - product.price / product.original) * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </div>
        </section>

        {/* Stats */}
        <section aria-labelledby="stats-heading" className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <h2 id="stats-heading" className="sr-only">
              RE:픽 이용 지표
            </h2>
            <motion.dl
              className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="text-center">
                  <dt className="text-sm text-stone-500">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-stone-900 font-sans">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" aria-labelledby="testimonials-heading" className="border-b border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">후기</p>
              <h2
                id="testimonials-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                답부터 해본 사람들의 이야기
              </h2>
            </motion.div>

            <motion.ul
              className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {TESTIMONIALS.map((t) => (
                <motion.li
                  key={t.name}
                  variants={fadeUp}
                  whileHover={hoverLiftSmall}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-3xl border border-stone-200 bg-white p-8"
                >
                  <Quote className="h-6 w-6 text-orange-700" aria-hidden="true" />
                  <blockquote className="mt-4 font-sans text-xl leading-snug tracking-[-0.01em] text-stone-800">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figure className="mt-6 flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={`${t.name}의 프로필 사진`}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <figcaption>
                      <span className="block text-sm font-semibold text-stone-900">{t.name}</span>
                      <span className="block text-sm text-stone-500">{t.role}</span>
                    </figcaption>
                  </figure>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">FAQ</p>
              <h2
                id="faq-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                궁금한 점, 먼저 답해드릴게요
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                더 궁금하신 내용은 고객센터에서 바로 확인하실 수 있어요.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 max-w-3xl divide-y divide-stone-200 overflow-hidden rounded-3xl border border-stone-200 bg-stone-50"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {FAQS.map((item) => (
                <motion.div key={item.question} variants={fadeUp}>
                  <details className="group px-6 py-5 sm:px-8">
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-semibold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                    >
                      {item.question}
                      <ChevronDown
                        className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 motion-safe:group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-stone-600">{item.answer}</p>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" aria-labelledby="cta-heading" className="mx-6 my-24 lg:mx-8">
          <div className="relative isolate overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80"
                alt="빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/75" />
            </div>
            <motion.div
              className="relative mx-auto max-w-2xl px-6 py-24 text-center sm:py-32"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <h2
                id="cta-heading"
                className="text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-50"
              >
                아직 답을 안 해보셨다면
                <br />
                지금 <em className="text-orange-300 not-italic font-semibold">질문 3개</em>만 답해보세요
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
                가입은 1분이면 충분해요. 언제든 해지할 수 있어요.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <motion.a
                  href="#quiz"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  질문으로 돌아가기
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-stone-50">
                <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
                  RE:
                </span>
                픽
              </p>
              <p className="mt-3 max-w-xs text-sm text-stone-400">
                AI가 취향을 학습해 당신에게 맞는 중고만 다시 골라주는 리커머스.
              </p>
              <ul className="mt-6 flex gap-4 text-sm">
                <li>
                  <a
                    href="https://instagram.com/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://threads.net/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Threads
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-semibold text-stone-50">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={`rounded-md text-sm text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-sm text-stone-400 sm:flex-row">
            <p>© 2026 RE:픽. All rights reserved.</p>
            <ul className="flex gap-6">
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
