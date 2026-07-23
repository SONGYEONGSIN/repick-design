import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Layers,
  Gem,
  Sparkles,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (no toLocaleString locale drift)
export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion tokens ---------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (DNA: near-monochrome dark + single accent, always-on) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain: swipe-deck listings ------------------------------------------
// 결정론적 고정 배열 — 스와이프는 이 배열 인덱스를 (i + N) % N 으로 순환할 뿐,
// Math.random/Date.now 등 비결정 소스는 전혀 쓰지 않는다.
export type Grade = "S" | "A";

export type Listing = {
  id: string;
  category: string;
  icon: LucideIcon;
  title: string;
  brand: string;
  size: string;
  image: { src: string; alt: string };
  match: number;
  grade: Grade;
  gradeLabel: string;
  verifiedSeller: string;
  sellerMeta: string;
  retail: number;
  repick: number;
  topReason: string;
  reasons: [string, string, string];
};

const discount = (retail: number, repick: number) =>
  Math.round(((retail - repick) / retail) * 100);

export const DECK: Listing[] = [
  {
    id: "coat-01",
    category: "아우터",
    icon: Shirt,
    title: "핸드메이드 더블 브레스티드 코트",
    brand: "Maison Blanche",
    size: "M (66)",
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
      alt: "옷걸이에 가지런히 걸린 코트들",
    },
    match: 95,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 도윤",
    sellerMeta: "거래 214건 · 재구매율 38%",
    retail: 358000,
    repick: 179000,
    topReason: "오버핏 취향 프로필 일치",
    reasons: [
      "S등급 컨디션 실측 완료",
      "최근 거래가 대조 검증",
      "찜 이력 기반 우선 매칭",
    ],
  },
  {
    id: "bag-01",
    category: "가방",
    icon: ShoppingBag,
    title: "레더 스퀘어 크로스백",
    brand: "Atelier Noir",
    size: "One Size",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=1000&q=80",
      alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
    },
    match: 92,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 서연",
    sellerMeta: "거래 132건 · 평점 4.9",
    retail: 342000,
    repick: 168000,
    topReason: "미니멀 컬러 취향 일치",
    reasons: [
      "S등급 실측·하자 0건",
      "정품 감정 서류 확인",
      "리테일가 대비 절감폭 최대",
    ],
  },
  {
    id: "shoes-01",
    category: "신발",
    icon: Footprints,
    title: "레더 러너 스니커즈",
    brand: "Fielder Co.",
    size: "270mm",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1000&q=80",
      alt: "화이트 톤의 클래식 스니커즈 한 켤레",
    },
    match: 94,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 하린",
    sellerMeta: "거래 156건 · 재구매율 32%",
    retail: 328000,
    repick: 156000,
    topReason: "270mm 사이즈 정확 일치",
    reasons: [
      "실측 사이즈 오차 0.5cm",
      "밑창 마모율 6% 검수",
      "리셀가 대조 검증 완료",
    ],
  },
  {
    id: "top-01",
    category: "상의",
    icon: Layers,
    title: "실크 시그니처 블라우스",
    brand: "Noir Studio",
    size: "S (55)",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
      alt: "실크 블라우스를 입은 인물의 패션 컷",
    },
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 서연",
    sellerMeta: "거래 132건 · 평점 4.9",
    retail: 468000,
    repick: 218000,
    topReason: "뉴트럴 톤 취향 반영",
    reasons: [
      "프리미엄 라인 전담 검수",
      "정품 감정 서류 확인",
      "찜 이력 기반 우선 매칭",
    ],
  },
  {
    id: "acc-01",
    category: "액세서리",
    icon: Gem,
    title: "빈티지 골드 체인 목걸이",
    brand: "Aureum Vintage",
    size: "Free",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80",
      alt: "테이블 위에 놓인 빈티지 액세서리",
    },
    match: 89,
    grade: "A",
    gradeLabel: "사용감 적음",
    verifiedSeller: "검증 셀러 · 지민",
    sellerMeta: "거래 118건 · 평점 4.7",
    retail: 156000,
    repick: 79000,
    topReason: "빈티지 무드 취향 매칭",
    reasons: [
      "변색·흠집 여부 사전 확인",
      "정품 각인 확대 촬영 제공",
      "시세 대비 절반 이하",
    ],
  },
] as const;

export const withDiscount = (l: Listing) => discount(l.retail, l.repick);

// --- domain: product preview grid (다른 레이아웃 — 정적 그리드) -----------------
export const PREVIEW: Listing[] = [
  {
    id: "preview-outer",
    category: "아우터",
    icon: Shirt,
    title: "베이직 울 반코트",
    brand: "Atelier Blanc",
    size: "M (66)",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      alt: "옷걸이에 걸린 베이직 톤 아우터",
    },
    match: 89,
    grade: "A",
    gradeLabel: "사용감 적음",
    verifiedSeller: "검증 셀러 · 지민",
    sellerMeta: "거래 118건 · 평점 4.7",
    retail: 178000,
    repick: 92000,
    topReason: "오버핏 실루엣 선호 반영",
    reasons: ["A등급 이상만 매칭", "실측 오차 1cm 이내", "리테일가 대비 절감"],
  },
  {
    id: "preview-bag",
    category: "가방",
    icon: ShoppingBag,
    title: "탑핸들 시그니처백",
    brand: "Maison Blanche",
    size: "One Size",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      alt: "가죽 소재의 탑핸들 시그니처 백",
    },
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 지민",
    sellerMeta: "거래 118건 · 평점 4.7",
    retail: 580000,
    repick: 276000,
    topReason: "프리미엄 셀러 우선 노출",
    reasons: ["정품 감정 완료 매물만", "재판매 시세 추적 반영", "찜 이력 기반 매칭"],
  },
  {
    id: "preview-shoes",
    category: "신발",
    icon: Footprints,
    title: "리미티드 하이엔드 스니커즈",
    brand: "Noir Studio",
    size: "265mm",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      alt: "한정판 하이엔드 스니커즈 클로즈업",
    },
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 도윤",
    sellerMeta: "거래 214건 · 재구매율 38%",
    retail: 540000,
    repick: 252000,
    topReason: "한정판 정품 감정 완료",
    reasons: ["박스·부속품 실사 확인", "리셀 시세 대비 절감폭 최대", "사이즈 265mm 일치"],
  },
  {
    id: "preview-top",
    category: "상의",
    icon: Layers,
    title: "캐시미어 니트",
    brand: "Aureum Vintage",
    size: "M (66)",
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      alt: "옅은 뉴트럴 톤의 니트웨어",
    },
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    verifiedSeller: "검증 셀러 · 하린",
    sellerMeta: "거래 156건 · 재구매율 32%",
    retail: 296000,
    repick: 142000,
    topReason: "S등급 컨디션 실측 완료",
    reasons: ["보풀·이염 여부 사전 확인", "관심 브랜드 알림 매칭", "시세 대비 절반 이하"],
  },
] as const;

// --- value split -----------------------------------------------------------
export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "카드를 넘길수록 취향이 좁혀집니다",
    desc: "넘긴 방향과 머문 시간을 반영해 다음 장에 올라올 매물의 우선순위가 실시간으로 재정렬됩니다.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "매 장마다 검수 근거가 따라붙습니다",
    desc: "전문 검수팀이 실측·하자를 확인해 S · A 등급과 판매자 인증을 카드 정면에 항상 표기합니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "숫자는 숨지 않습니다",
    desc: "매칭률·등급·인증·할인율은 드래그 중에도, 카드가 넘어간 뒤에도 늘 같은 자리에서 보입니다.",
    icon: ShieldCheck,
  },
];

// --- social proof ------------------------------------------------------------
export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "-52%", label: "평균 절감율" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];
