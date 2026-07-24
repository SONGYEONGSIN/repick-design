import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Layers,
  Scale,
  ScanSearch,
  ShieldCheck,
  Clock,
  Target,
  Sparkles,
  Table2,
  BadgeCheck,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion --------------------------------------------------------------
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

// --- domain: comparison table ---------------------------------------------

export type Listing = {
  title: string;
  brand: string;
  retail: number;
  repick: number;
  match: number;
  grade: "S" | "A";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
};

export type RowValue = {
  general: { value: string; sub: string };
  repick: { value: string; sub: string };
  evidence: string;
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  image: { src: string; alt: string };
  listing: Listing;
  // same length/order as ROWS
  rows: RowValue[];
};

export type RowMeta = {
  id: string;
  label: string;
  icon: LucideIcon;
};

// 비교 기준 5행 — 모든 카테고리에서 동일 순서로 유지, 값만 카테고리별로 재계산됨
export const ROWS: RowMeta[] = [
  { id: "price", label: "가격 근거", icon: Scale },
  { id: "condition", label: "컨디션 확인", icon: ScanSearch },
  { id: "trust", label: "판매자 신뢰", icon: ShieldCheck },
  { id: "time", label: "검색 시간", icon: Clock },
  { id: "fit", label: "취향 적합도", icon: Target },
];

export const CATEGORIES: Category[] = [
  {
    id: "outer",
    label: "아우터",
    icon: Shirt,
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      alt: "옷걸이에 가지런히 걸린 울 코트들",
    },
    listing: {
      title: "울 싱글 브레스티드 코트",
      brand: "Atelier Given",
      retail: 312000,
      repick: 148000,
      match: 96,
      grade: "S",
      gradeLabel: "새 상품급",
      seller: "검증 셀러 · 하늘",
      sellerMeta: "거래 171건 · 재구매율 35%",
    },
    rows: [
      {
        general: { value: "오차 ±38%", sub: "판매자 임의 책정" },
        repick: { value: "-53%", sub: "실거래 시세 기반" },
        evidence:
          "이 코트는 최근 3개월 동일 브랜드 실거래 178건과 대조해 148,000원으로 책정됐습니다.",
      },
      {
        general: { value: "3/9 항목", sub: "판매자 자가 신고" },
        repick: { value: "9/9 항목", sub: "전문 검수팀 실측" },
        evidence:
          "마모율 4%, 안감 손상 없음, 단추 유실 없음 등 9개 항목을 실측해 S등급을 산정했습니다.",
      },
      {
        general: { value: "평점 비공개", sub: "익명 개인 거래" },
        repick: { value: "4.8/5", sub: "실명 인증 · 정품 감정" },
        evidence: "하늘 셀러는 171건 거래·재구매율 35%로 정품 감정을 통과한 인증 셀러입니다.",
      },
      {
        general: { value: "평균 58분", sub: "무한 스크롤 탐색" },
        repick: { value: "92초", sub: "AI 즉시 매칭 제안" },
        evidence: "취향·사이즈·예산 프로필이 있으면 다음 매칭까지 92초면 충분합니다.",
      },
      {
        general: { value: "적합도 24%", sub: "카테고리만 필터링" },
        repick: { value: "매칭 96%", sub: "취향·사이즈·예산 반영" },
        evidence: "오버핏 실루엣 선호와 예산 구간을 반영해 96% 적합도로 매칭됐습니다.",
      },
    ],
  },
  {
    id: "bag",
    label: "가방",
    icon: ShoppingBag,
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
    },
    listing: {
      title: "미니 크로스바디백",
      brand: "Noir & Co.",
      retail: 268000,
      repick: 129000,
      match: 93,
      grade: "S",
      gradeLabel: "새 상품급",
      seller: "검증 셀러 · 은우",
      sellerMeta: "거래 143건 · 평점 4.8",
    },
    rows: [
      {
        general: { value: "오차 ±42%", sub: "판매자 임의 책정" },
        repick: { value: "-52%", sub: "실거래 시세 기반" },
        evidence:
          "동일 라인 최근 거래 96건과 대조해 129,000원으로 책정됐습니다.",
      },
      {
        general: { value: "2/9 항목", sub: "판매자 자가 신고" },
        repick: { value: "9/9 항목", sub: "전문 검수팀 실측" },
        evidence:
          "금속 장식 산화 여부, 지퍼 작동, 밑면 마모 등 9개 항목을 실측해 S등급을 산정했습니다.",
      },
      {
        general: { value: "평점 비공개", sub: "익명 개인 거래" },
        repick: { value: "4.8/5", sub: "실명 인증 · 정품 감정" },
        evidence: "은우 셀러는 143건 거래·평점 4.8로 정품 감정을 통과한 인증 셀러입니다.",
      },
      {
        general: { value: "평균 46분", sub: "무한 스크롤 탐색" },
        repick: { value: "81초", sub: "AI 즉시 매칭 제안" },
        evidence: "뉴트럴 톤·미니멀 취향 프로필이 있으면 다음 매칭까지 81초면 충분합니다.",
      },
      {
        general: { value: "적합도 19%", sub: "카테고리만 필터링" },
        repick: { value: "매칭 93%", sub: "취향·사이즈·예산 반영" },
        evidence: "데일리 사용 빈도와 컬러 취향을 반영해 93% 적합도로 매칭됐습니다.",
      },
    ],
  },
  {
    id: "shoes",
    label: "신발",
    icon: Footprints,
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
      alt: "화이트 톤의 클래식 스니커즈 한 켤레",
    },
    listing: {
      title: "레더 로우탑 스니커즈",
      brand: "Fielder Studio",
      retail: 298000,
      repick: 139000,
      match: 95,
      grade: "S",
      gradeLabel: "새 상품급",
      seller: "검증 셀러 · 준서",
      sellerMeta: "거래 189건 · 재구매율 41%",
    },
    rows: [
      {
        general: { value: "오차 ±31%", sub: "판매자 임의 책정" },
        repick: { value: "-53%", sub: "실거래 시세 기반" },
        evidence:
          "같은 사이즈·컨디션 리셀 거래 121건과 대조해 139,000원으로 책정됐습니다.",
      },
      {
        general: { value: "4/9 항목", sub: "판매자 자가 신고" },
        repick: { value: "9/9 항목", sub: "전문 검수팀 실측" },
        evidence:
          "밑창 마모율 3%, 실측 사이즈 오차 0.5cm, 접착 상태 등 9개 항목을 실측했습니다.",
      },
      {
        general: { value: "평점 비공개", sub: "익명 개인 거래" },
        repick: { value: "4.9/5", sub: "실명 인증 · 정품 감정" },
        evidence: "준서 셀러는 189건 거래·재구매율 41%로 정품 감정을 통과한 인증 셀러입니다.",
      },
      {
        general: { value: "평균 63분", sub: "무한 스크롤 탐색" },
        repick: { value: "104초", sub: "AI 즉시 매칭 제안" },
        evidence: "270mm 사이즈·캐주얼 취향 프로필이 있으면 다음 매칭까지 104초면 충분합니다.",
      },
      {
        general: { value: "적합도 21%", sub: "카테고리만 필터링" },
        repick: { value: "매칭 95%", sub: "취향·사이즈·예산 반영" },
        evidence: "실측 사이즈와 캐주얼 취향을 반영해 95% 적합도로 매칭됐습니다.",
      },
    ],
  },
  {
    id: "top",
    label: "상의",
    icon: Layers,
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
      alt: "실크 블라우스를 입은 인물의 패션 컷",
    },
    listing: {
      title: "캐시미어 브이넥 니트",
      brand: "Studio Aren",
      retail: 246000,
      repick: 118000,
      match: 92,
      grade: "S",
      gradeLabel: "새 상품급",
      seller: "검증 셀러 · 리나",
      sellerMeta: "거래 127건 · 평점 4.9",
    },
    rows: [
      {
        general: { value: "오차 ±36%", sub: "판매자 임의 책정" },
        repick: { value: "-52%", sub: "실거래 시세 기반" },
        evidence:
          "동일 소재 라인 최근 거래 84건과 대조해 118,000원으로 책정됐습니다.",
      },
      {
        general: { value: "3/9 항목", sub: "판매자 자가 신고" },
        repick: { value: "9/9 항목", sub: "전문 검수팀 실측" },
        evidence:
          "보풀 밀도, 이염 여부, 넥라인 늘어짐 등 9개 항목을 실측해 S등급을 산정했습니다.",
      },
      {
        general: { value: "평점 비공개", sub: "익명 개인 거래" },
        repick: { value: "4.9/5", sub: "실명 인증 · 정품 감정" },
        evidence: "리나 셀러는 127건 거래·평점 4.9로 정품 감정을 통과한 인증 셀러입니다.",
      },
      {
        general: { value: "평균 41분", sub: "무한 스크롤 탐색" },
        repick: { value: "77초", sub: "AI 즉시 매칭 제안" },
        evidence: "뉴트럴 톤·니트 소재 취향 프로필이 있으면 다음 매칭까지 77초면 충분합니다.",
      },
      {
        general: { value: "적합도 23%", sub: "카테고리만 필터링" },
        repick: { value: "매칭 92%", sub: "취향·사이즈·예산 반영" },
        evidence: "소재·핏 취향과 예산 구간을 반영해 92% 적합도로 매칭됐습니다.",
      },
    ],
  },
];

// --- section 2: always-visible proof grid (no hover-gated reveal) --------
export type PreviewCard = {
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
  tags: [string, string];
};

export const PREVIEW_CARDS: PreviewCard[] = [
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
    tags: ["오버핏 취향 반영", "A등급 이상만"],
  },
  {
    id: "bag2",
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
    tags: ["뉴트럴 컬러 매칭", "정품 인증 확인"],
  },
  {
    id: "sneaker",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "하이탑 스니커즈 한 켤레를 나란히 놓은 사진",
    },
    title: "하이탑 레더 스니커즈",
    brand: "Runway Archive",
    retail: 236000,
    repick: 112000,
    match: 94,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 민재",
    tags: ["실측 사이즈 오차 0.5cm", "밑창 마모 6%"],
  },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "탭을 바꾸면 표 전체가 다시 계산됩니다",
    desc: "카테고리를 고르면 가격 근거·컨디션·신뢰도·검색 시간·적합도 다섯 행이 그 카테고리의 실제 데이터로 즉시 재계산됩니다.",
    icon: Table2,
  },
  {
    index: "02",
    title: "행을 열면 더 깊은 근거가 나옵니다",
    desc: "기본 대조값은 언제나 표에 그대로 남아 있고, 행을 확장하면 실제 매물 사진·매칭%·등급·인증·before/after 할인율까지 확인할 수 있습니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "다섯 기준 모두 숫자로 증명합니다",
    desc: "가격, 컨디션, 신뢰, 시간, 적합도 — 짐작이 끼어들 자리 없이 다섯 기준 전부를 실측·실거래 데이터로 대조합니다.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "9/9", label: "실측 검수 항목" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

export { Sparkles, BadgeCheck };
