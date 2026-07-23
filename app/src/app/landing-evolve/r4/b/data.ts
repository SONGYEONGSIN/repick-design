import type { LucideIcon } from "lucide-react";
import { Fingerprint, ScanSearch, TrendingDown } from "lucide-react";

// --- utils -----------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// pointer-tilt showcase — max rotation in degrees, deterministic function of
// pointer position within the card bounds (no Math.random / Date.now).
export const MAX_TILT = 9;

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

// --- domain ------------------------------------------------------------
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
  reasons: [string, string, string];
  image: string;
  alt: string;
};

// 필름스트립 순서 = PRODUCTS 배열 순서(결정론). 스포트라이트 카드는 선택된
// 인덱스의 매물로 전환되고, 매칭%·등급·인증 배지·할인율은 항상 카드 정면에 노출된다.
export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "핸드메이드 울 더블코트",
    brand: "Maison Blanche",
    category: "아우터",
    price: 179000,
    original: 358000,
    discount: 50,
    match: 97,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 도윤",
    sellerMeta: "거래 214건 · 재구매율 38%",
    reasons: [
      "미니멀 · 뉴트럴 톤 취향 일치",
      "S등급 컨디션 실측 완료",
      "리테일가 대비 50% 절감",
    ],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    alt: "옷걸이에 가지런히 걸린 울 더블코트",
  },
  {
    id: "bag",
    title: "레더 스퀘어 크로스백",
    brand: "Atelier Noir",
    category: "가방",
    price: 168000,
    original: 342000,
    discount: 51,
    match: 94,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 서연",
    sellerMeta: "거래 132건 · 평점 4.9",
    reasons: [
      "뉴트럴 컬러 취향 매칭",
      "실측·하자 0건 확인",
      "시세 대비 절반 이하",
    ],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=1200&q=80",
    alt: "바닥에 놓인 레더 스퀘어 크로스백",
  },
  {
    id: "sneakers",
    title: "레더 러너 스니커즈",
    brand: "Fielder Co.",
    category: "신발",
    price: 156000,
    original: 328000,
    discount: 52,
    match: 91,
    grade: "A",
    gradeLabel: "생활 흔적 소량",
    seller: "검증 셀러 · 민재",
    sellerMeta: "거래 87건 · 평점 4.8",
    reasons: [
      "270mm 실측 사이즈 일치",
      "밑창 마모 8% 사전 검수",
      "리셀가 대비 절감폭 최대",
    ],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
    alt: "화이트 톤의 레더 러너 스니커즈 한 켤레",
  },
  {
    id: "blouse",
    title: "실크 시그니처 블라우스",
    brand: "Noir Studio",
    category: "상의",
    price: 218000,
    original: 468000,
    discount: 53,
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 지민",
    sellerMeta: "거래 118건 · 평점 4.7",
    reasons: [
      "프리미엄 라인 전담 검수",
      "정품 감정 서류 확인",
      "찜 이력 기반 우선 매칭",
    ],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
    alt: "실크 블라우스를 입은 인물의 패션 컷",
  },
  {
    id: "shoulderbag",
    title: "레더 미니 숄더백",
    brand: "Studio Nine",
    category: "가방",
    price: 68000,
    original: 132000,
    discount: 48,
    match: 88,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 유나",
    sellerMeta: "거래 94건 · 평점 4.7",
    reasons: [
      "예산 구간 정확히 적중",
      "지퍼·바닥 마모 검수 완료",
      "데일리 취향 태그 매칭",
    ],
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    alt: "가죽 소재 미니 숄더백을 가까이서 촬영한 사진",
  },
  {
    id: "knitcoat",
    title: "오버사이즈 니트 코트",
    brand: "Aureum Vintage",
    category: "아우터",
    price: 142000,
    original: 296000,
    discount: 52,
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 하린",
    sellerMeta: "거래 156건 · 재구매율 32%",
    reasons: [
      "오버핏 실루엣 선호 반영",
      "보풀·이염 여부 사전 확인",
      "관심 브랜드 알림 매칭",
    ],
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    alt: "니트 코트를 입은 모델이 카메라를 정면으로 바라보는 패션 인물 사진",
  },
];

export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "취향을 지문처럼 읽습니다",
    desc: "찜 · 스킵 · 실측 사이즈를 반영해 지금 당신의 취향에 맞는 매물만 필름스트립에 올립니다.",
    icon: Fingerprint,
  },
  {
    index: "02",
    title: "컨디션을 실측해 등급을 남깁니다",
    desc: "전문 검수팀이 실측·하자를 확인해 S · A 등급만 스포트라이트에 노출합니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "시세를 대조해 할인율로 증명합니다",
    desc: "리테일가와 최근 거래가를 대조한 할인율을 카드 정면에 항상 표기합니다.",
    icon: TrendingDown,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];
