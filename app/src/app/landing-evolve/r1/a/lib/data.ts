import type { LucideIcon } from "lucide-react";
import {
  Ruler,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  Wallet,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (no toLocaleString → SSR-safe, no locale drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- color tokens (design DNA: dark near-monochrome + single accent) -----
export const ACCENT_HEX = "#6E56CF";
export const BG = "bg-[#0B0B0F]";
export const PANEL = "bg-white/[0.02]";
export const BORDER = "border-white/10";
export const FG = "text-white";
export const MUTED = "text-[#A1A1AA]";
export const ACCENT = "text-[#6E56CF]";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";

// --- motion --------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- domain --------------------------------------------------------------
export type Grade = "S" | "A" | "B";

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
  reasons: string[];
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "빈티지 울 더블코트",
    brand: "Aureum Vintage",
    category: "아우터",
    price: 89000,
    original: 148000,
    discount: 40,
    match: 96,
    grade: "S",
    reasons: ["미니멀 취향 일치", "관심 브랜드", "S등급 컨디션"],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    alt: "옷걸이에 가지런히 걸린 울 코트들",
  },
  {
    id: "bag",
    title: "레더 크로스백",
    brand: "Atelier Noir",
    category: "가방",
    price: 62000,
    original: 120000,
    discount: 48,
    match: 91,
    grade: "A",
    reasons: ["뉴트럴 톤 매칭", "예산 범위 내", "시세 48% 절감"],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "바닥에 놓인 가죽 크로스백과 액세서리",
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
    reasons: ["270mm 사이즈 일치", "캐주얼 취향 확장"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "화이트 톤의 클래식 로우 스니커즈 한 켤레",
  },
  {
    id: "blouse",
    title: "실크 오버핏 블라우스",
    brand: "Maison Blanche",
    category: "상의",
    price: 47000,
    original: 89000,
    discount: 47,
    match: 93,
    grade: "S",
    reasons: ["오버핏 선호 반영", "S등급 컨디션", "시세 47% 절감"],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    alt: "실크 블라우스를 입은 인물의 패션 컷",
  },
];

export type ScanFilter = {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

// 히어로 콘솔이 순차 하이라이트하는 매칭 기준 (결정론 순서)
export const SCAN_FILTERS: ScanFilter[] = [
  { id: "taste", label: "취향 프로필", detail: "미니멀 · 뉴트럴 톤 · 오버핏", icon: Sparkles },
  { id: "size", label: "사이즈", detail: "상의 100 · 하의 32 · 슈즈 270", icon: Ruler },
  { id: "budget", label: "예산", detail: "40,000 – 90,000원", icon: Wallet },
  { id: "condition", label: "컨디션 등급", detail: "S · A 등급 우선 선별", icon: ShieldCheck },
  { id: "price", label: "시세 대비", detail: "정가 대비 40% 이상 절감", icon: TrendingDown },
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
    title: "취향을 읽습니다",
    desc: "찜 · 스킵 · 구매 이력을 실시간으로 반영해 당신만의 취향 프로필을 매초 갱신합니다.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "수만 개를 걸러냅니다",
    desc: "사이즈 · 예산 · 컨디션 · 시세를 한 번에 대조해 지금 살 만한 매물만 남깁니다.",
    icon: SlidersHorizontal,
  },
  {
    index: "03",
    title: "검수하고 보냅니다",
    desc: "전문 검수팀이 실측과 하자 확인을 마친 매물만 매칭 결과에 올립니다.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

export const TOTAL_SCANNED = 128412;
export const TOTAL_MATCHED = 12;
