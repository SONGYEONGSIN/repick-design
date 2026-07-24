import type { LucideIcon } from "lucide-react";
import { Sparkles, ScanSearch, TrendingDown } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const clamp = (v: number, lo = 0, hi = 100) =>
  Math.min(hi, Math.max(lo, v));

// --- motion --------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
// accent #6E56CF has presence at rest — never hover-only.
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- hero comparison images (before = 어수선한 일반 리스팅, after = 정제된 큐레이션) ---
export const BEFORE_IMG = {
  src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  alt: "정리되지 않은 채 빽빽하게 걸린 일반 중고 의류 행어 더미",
} as const;

export const AFTER_IMG = {
  src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
  alt: "repick AI가 선별해 단독으로 정돈해 보여주는 중고 의류 한 벌",
} as const;

// --- domain --------------------------------------------------------------
export type Grade = "S" | "A";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  reasons: string[];
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "핸드메이드 울 더블코트",
    brand: "Maison Blanche",
    category: "아우터",
    price: 78000,
    original: 148000,
    discount: 47,
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 도윤",
    sellerMeta: "거래 214건 · 재구매율 38%",
    reasons: ["미니멀 · 뉴트럴 톤 일치", "관심 브랜드 알림", "실측 오차 1cm 이내"],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "정돈된 배경에 단독으로 걸린 울 더블코트",
  },
  {
    id: "bag",
    title: "레더 스퀘어 크로스백",
    brand: "Atelier Noir",
    category: "가방",
    price: 62000,
    original: 120000,
    discount: 48,
    match: 91,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 서연",
    sellerMeta: "거래 132건 · 평점 4.9",
    reasons: ["뉴트럴 컬러 매칭", "예산 6만원대 적중", "시세 대비 48% 절감"],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "바닥에 놓인 가죽 스퀘어 크로스백",
  },
  {
    id: "sneakers",
    title: "클래식 로우 스니커즈",
    brand: "Runway Archive",
    category: "슈즈",
    price: 54000,
    original: 98000,
    discount: 45,
    match: 88,
    grade: "A",
    gradeLabel: "생활 흔적 소량",
    seller: "검증 셀러 · 민재",
    sellerMeta: "거래 87건 · 평점 4.8",
    reasons: ["270mm 사이즈 일치", "캐주얼 취향 확장", "밑창 마모 8% 검수"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "화이트 톤의 클래식 로우 스니커즈 한 켤레",
  },
  {
    id: "rack",
    title: "빈티지 울 체스터 코트",
    brand: "Aureum Vintage",
    category: "아우터",
    price: 89000,
    original: 152000,
    discount: 41,
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 하린",
    sellerMeta: "거래 156건 · 재구매율 32%",
    reasons: ["오버핏 선호 반영", "S등급 컨디션", "리테일가 41% 절감"],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    alt: "행어에 걸린 빈티지 울 체스터 코트",
  },
];

// 일반 중고거래 쪽(before)에 겹쳐 보이는 결핍 신호 — 무채색·정보 없음
export const BEFORE_GAPS = ["실측 정보 없음", "컨디션 불명", "시세 비교 불가"] as const;

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "취향을 검증합니다",
    desc: "찜 · 스킵 · 구매 이력을 실시간 반영해 지금 당신에게 맞는 것만 남깁니다.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "컨디션을 실측합니다",
    desc: "전문 검수팀이 실측과 하자를 확인해 S · A 등급만 매칭에 올립니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "시세를 대조합니다",
    desc: "최근 거래가와 리테일가를 대조해 지금 사도 손해 없는 매물만 보여줍니다.",
    icon: TrendingDown,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

export const PROOF: Stat[] = [
  { value: "2.4배", label: "구매 전환율 상승" },
  { value: "-63%", label: "탐색 시간 절감" },
  { value: "38%", label: "3개월 내 재구매율" },
];
