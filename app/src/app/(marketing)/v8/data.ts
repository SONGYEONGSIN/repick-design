import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Ruler,
  Wallet,
  ShieldCheck,
  TrendingUp,
  BadgeCheck,
  Sparkles,
  Gauge as GaugeIcon,
  Timer,
  Check,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ---------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain: 매칭 정확도 다이얼 (히어로 게이지) ----------------------------

export type Criterion = {
  id: string;
  label: string;
  icon: LucideIcon;
  score: number;
  weight: string;
  evidence: string;
};

// 5개 기준 — 평균 96(다이얼 중앙 최종값)과 일치하도록 고정
export const CRITERIA: Criterion[] = [
  {
    id: "taste",
    label: "취향 프로필",
    icon: Heart,
    score: 98,
    weight: "가중 22%",
    evidence: "최근 찜한 상품 87건의 컬러·핏 패턴을 학습해 선호 실루엣을 추정했습니다.",
  },
  {
    id: "size",
    label: "사이즈",
    icon: Ruler,
    score: 99,
    weight: "가중 20%",
    evidence: "등록하신 실측 사이즈와 판매자 실측값의 오차가 0.5cm 이내로 일치합니다.",
  },
  {
    id: "budget",
    label: "예산",
    icon: Wallet,
    score: 94,
    weight: "가중 18%",
    evidence: "설정하신 10만~20만원 구간 안에서 가장 조건이 좋은 매물로 선별했습니다.",
  },
  {
    id: "condition",
    label: "컨디션 등급",
    icon: ShieldCheck,
    score: 97,
    weight: "가중 22%",
    evidence: "전문 검수팀이 9개 항목을 실측해 S등급 기준 충족을 확인했습니다.",
  },
  {
    id: "market",
    label: "시세",
    icon: TrendingUp,
    score: 92,
    weight: "가중 18%",
    evidence: "최근 3개월 동일 브랜드 실거래 178건과 대조해 적정가임을 검증했습니다.",
  },
];

export const TOTAL_MATCH = Math.round(
  CRITERIA.reduce((sum, c) => sum + c.score, 0) / CRITERIA.length,
);

// --- domain: 제품 프리뷰 (항상 노출 — hover 게이팅 금지) --------------------

export type Product = {
  id: string;
  image: { src: string; alt: string };
  title: string;
  brand: string;
  retail: number;
  repick: number;
  match: number;
  grade: "S" | "A";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  tags: [string, string];
  daysAgo: number; // 신상품순 정렬용 — 낮을수록 최근
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      alt: "베이지 톤 오버사이즈 트렌치코트를 입은 인물의 패션 컷",
    },
    title: "오버사이즈 트렌치코트",
    brand: "Aureum Vintage",
    retail: 268000,
    repick: 132000,
    match: 91,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 지민",
    sellerMeta: "거래 154건",
    tags: ["오버핏 취향 반영", "A등급 이상만"],
    daysAgo: 6,
  },
  {
    id: "shoulderbag",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "가죽 소재 미니 숄더백을 가까이서 촬영한 사진",
    },
    title: "레더 미니 숄더백",
    brand: "Atelier Noir",
    retail: 214000,
    repick: 104000,
    match: 90,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 서연",
    sellerMeta: "거래 132건",
    tags: ["뉴트럴 컬러 매칭", "정품 인증 확인"],
    daysAgo: 2,
  },
  {
    id: "hitop",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "하이탑 레더 스니커즈 한 켤레를 나란히 놓은 사진",
    },
    title: "하이탑 레더 스니커즈",
    brand: "Runway Archive",
    retail: 236000,
    repick: 112000,
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 민재",
    sellerMeta: "거래 189건",
    tags: ["실측 사이즈 오차 0.5cm", "밑창 마모 6%"],
    daysAgo: 1,
  },
  {
    id: "crossbag",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
    },
    title: "미니 크로스바디백",
    brand: "Noir & Co.",
    retail: 268000,
    repick: 129000,
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 은우",
    sellerMeta: "거래 143건",
    tags: ["데일리 사용 빈도 반영", "정품 감정 통과"],
    daysAgo: 9,
  },
  {
    id: "knit",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
      alt: "니트 소재 상의를 입은 인물의 패션 컷",
    },
    title: "캐시미어 브이넥 니트",
    brand: "Studio Aren",
    retail: 246000,
    repick: 118000,
    match: 92,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 리나",
    sellerMeta: "거래 127건",
    tags: ["소재·핏 취향 반영", "보풀 밀도 낮음"],
    daysAgo: 4,
  },
  {
    id: "sneaker2",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
      alt: "화이트 톤의 클래식 스니커즈 한 켤레",
    },
    title: "레더 로우탑 스니커즈",
    brand: "Fielder Studio",
    retail: 298000,
    repick: 139000,
    match: 95,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 준서",
    sellerMeta: "거래 189건",
    tags: ["270mm 실측 일치", "밑창 마모 3%"],
    daysAgo: 12,
  },
];

export type SortMode = "match" | "discount" | "new";

export const SORTS: { id: SortMode; label: string; icon: LucideIcon }[] = [
  { id: "match", label: "매칭순", icon: GaugeIcon },
  { id: "discount", label: "할인율순", icon: TrendingUp },
  { id: "new", label: "신상품순", icon: Timer },
];

export const discountRate = (p: Product) =>
  Math.round((1 - p.repick / p.retail) * 100);

export function sortProducts(products: Product[], mode: SortMode): Product[] {
  const list = [...products];
  if (mode === "match") return list.sort((a, b) => b.match - a.match);
  if (mode === "discount")
    return list.sort((a, b) => discountRate(b) - discountRate(a));
  return list.sort((a, b) => a.daysAgo - b.daysAgo);
}

// --- domain: 가치 3분할 -----------------------------------------------------

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "다섯 기준을 동시에 계산합니다",
    desc: "취향 프로필·사이즈·예산·컨디션 등급·시세를 각각 독립적으로 채점한 뒤 가중 평균해 하나의 매칭 점수로 합칩니다.",
    icon: GaugeIcon,
  },
  {
    index: "02",
    title: "숫자로 증명합니다",
    desc: "감으로 고르지 않습니다. 실측 검수 9개 항목과 실거래가 대조 데이터가 매칭 점수의 근거로 함께 제시됩니다.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "기준을 눌러보면 근거가 열립니다",
    desc: "다이얼의 각 기준을 선택하면 해당 점수가 어떤 데이터로 산출됐는지 바로 옆 패널에서 확인할 수 있습니다.",
    icon: Sparkles,
  },
];

// --- domain: 소셜프루프 (토글 시 실시간 반영) --------------------------------

export type Stat = { value: string; label: string };

export const PROOF_WEEK: Stat[] = [
  { value: "3,400+", label: "이번 주 매칭" },
  { value: "94%", label: "이번 주 평균 정확도" },
  { value: "81초", label: "이번 주 평균 매칭 시간" },
];

export const PROOF_TOTAL: Stat[] = [
  { value: "128,000+", label: "누적 매칭" },
  { value: "96%", label: "누적 평균 정확도" },
  { value: "9/9", label: "실측 검수 항목" },
];

export { BadgeCheck, Check, Sparkles };
