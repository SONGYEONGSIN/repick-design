import type { LucideIcon } from "lucide-react";
import { Shirt, ShoppingBag, Footprints, Layers, Sparkles, ScanSearch, ShieldCheck } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

// --- domain: budget calculator ------------------------------------------
// 결정론적 프리셋 값 배열 — 예산 슬라이더/스테퍼는 이 인덱스만 순회한다 (랜덤 없음).
export const BUDGET_STEPS = [
  "10만원대",
  "20만원대",
  "35만원대",
  "60만원대",
] as const;

export type Grade = "S" | "A";

export type Tier = {
  title: string;
  brand: string;
  retail: number;
  repick: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  reasons: [string, string, string];
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  image: { src: string; alt: string };
  tiers: [Tier, Tier, Tier, Tier];
};

// 이미지·alt는 repick 메인 카탈로그와 동일한 실존 자산을 재사용(범주당 1장, 예산 구간별 텍스트만 갱신)
export const CATEGORIES: Category[] = [
  {
    id: "outer",
    label: "아우터",
    icon: Shirt,
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      alt: "옷걸이에 가지런히 걸린 코트들",
    },
    tiers: [
      {
        title: "베이직 울 반코트",
        brand: "Atelier Blanc",
        retail: 178000,
        repick: 92000,
        match: 89,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 지민",
        sellerMeta: "거래 118건 · 평점 4.7",
        reasons: [
          "오버핏 실루엣 선호 반영",
          "A등급 이상만 매칭",
          "리테일가 대비 절감",
        ],
      },
      {
        title: "빈티지 체스터 코트",
        brand: "Aureum Vintage",
        retail: 248000,
        repick: 129000,
        match: 92,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 하린",
        sellerMeta: "거래 156건 · 재구매율 32%",
        reasons: [
          "뉴트럴 톤 취향 일치",
          "실측 오차 1cm 이내",
          "관심 브랜드 알림 매칭",
        ],
      },
      {
        title: "핸드메이드 더블코트",
        brand: "Maison Blanche",
        retail: 358000,
        repick: 179000,
        match: 95,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 도윤",
        sellerMeta: "거래 214건 · 재구매율 38%",
        reasons: [
          "S등급 컨디션 실측 완료",
          "최근 거래가 대조 검증",
          "찜 이력 기반 우선 매칭",
        ],
      },
      {
        title: "캐시미어 블렌드 코트",
        brand: "Noir Studio",
        retail: 620000,
        repick: 298000,
        match: 97,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 서연",
        sellerMeta: "거래 132건 · 평점 4.9",
        reasons: [
          "프리미엄 라인 전담 검수",
          "하자 리포트 사전 제공",
          "시세 대비 최대폭 절감",
        ],
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
    tiers: [
      {
        title: "캔버스 토트백",
        brand: "Studio Nine",
        retail: 132000,
        repick: 68000,
        match: 87,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 유나",
        sellerMeta: "거래 94건 · 평점 4.7",
        reasons: [
          "예산 구간 정확히 적중",
          "데일리 취향 태그 매칭",
          "지퍼·바닥 마모 검수 완료",
        ],
      },
      {
        title: "레더 숄더백",
        brand: "Atelier Noir",
        retail: 236000,
        repick: 118000,
        match: 90,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 서연",
        sellerMeta: "거래 132건 · 평점 4.9",
        reasons: [
          "뉴트럴 컬러 매칭",
          "시세 대비 절반 이하",
          "정품 인증 서류 확인",
        ],
      },
      {
        title: "레더 스퀘어 크로스백",
        brand: "Atelier Noir",
        retail: 342000,
        repick: 168000,
        match: 94,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 서연",
        sellerMeta: "거래 132건 · 평점 4.9",
        reasons: [
          "미니멀 취향 프로필 일치",
          "S등급 실측·하자 0건",
          "리테일가 대비 절감폭 최대",
        ],
      },
      {
        title: "탑핸들 시그니처백",
        brand: "Maison Blanche",
        retail: 580000,
        repick: 276000,
        match: 96,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 지민",
        sellerMeta: "거래 118건 · 평점 4.7",
        reasons: [
          "프리미엄 셀러 우선 노출",
          "정품 감정 완료 매물만",
          "재판매 시세 추적 반영",
        ],
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
    tiers: [
      {
        title: "캔버스 로우 스니커즈",
        brand: "Runway Archive",
        retail: 118000,
        repick: 54000,
        match: 88,
        grade: "A",
        gradeLabel: "생활 흔적 소량",
        seller: "검증 셀러 · 민재",
        sellerMeta: "거래 87건 · 평점 4.8",
        reasons: [
          "270mm 사이즈 일치",
          "밑창 마모 8% 검수",
          "캐주얼 취향 확장 매칭",
        ],
      },
      {
        title: "클래식 로우 스니커즈",
        brand: "Runway Archive",
        retail: 214000,
        repick: 104000,
        match: 91,
        grade: "A",
        gradeLabel: "생활 흔적 소량",
        seller: "검증 셀러 · 민재",
        sellerMeta: "거래 87건 · 평점 4.8",
        reasons: [
          "화이트 톤 선호 반영",
          "시세 대비 48% 절감",
          "하자 리포트 사전 제공",
        ],
      },
      {
        title: "레더 러너 스니커즈",
        brand: "Fielder Co.",
        retail: 328000,
        repick: 156000,
        match: 94,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 하린",
        sellerMeta: "거래 156건 · 재구매율 32%",
        reasons: [
          "S등급 컨디션만 매칭",
          "실측 사이즈 오차 0.5cm",
          "리셀가 대조 검증 완료",
        ],
      },
      {
        title: "리미티드 하이엔드 스니커즈",
        brand: "Noir Studio",
        retail: 540000,
        repick: 252000,
        match: 96,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 도윤",
        sellerMeta: "거래 214건 · 재구매율 38%",
        reasons: [
          "한정판 정품 감정 완료",
          "박스·부속품 실사 확인",
          "리셀 시세 대비 절감폭 최대",
        ],
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
    tiers: [
      {
        title: "코튼 오버핏 셔츠",
        brand: "Studio Nine",
        retail: 96000,
        repick: 47000,
        match: 85,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 유나",
        sellerMeta: "거래 94건 · 평점 4.7",
        reasons: [
          "예산 구간 정확히 적중",
          "오버핏 실루엣 선호 반영",
          "핏 실측 데이터 제공",
        ],
      },
      {
        title: "실크 블라우스",
        brand: "Maison Blanche",
        retail: 188000,
        repick: 92000,
        match: 89,
        grade: "A",
        gradeLabel: "사용감 적음",
        seller: "검증 셀러 · 지민",
        sellerMeta: "거래 118건 · 평점 4.7",
        reasons: [
          "뉴트럴 톤 취향 일치",
          "소재 손상 여부 검수 완료",
          "시세 대비 절반 이하",
        ],
      },
      {
        title: "캐시미어 니트",
        brand: "Aureum Vintage",
        retail: 296000,
        repick: 142000,
        match: 93,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 하린",
        sellerMeta: "거래 156건 · 재구매율 32%",
        reasons: [
          "S등급 컨디션 실측 완료",
          "보풀·이염 여부 사전 확인",
          "관심 브랜드 알림 매칭",
        ],
      },
      {
        title: "실크 시그니처 블라우스",
        brand: "Noir Studio",
        retail: 468000,
        repick: 218000,
        match: 96,
        grade: "S",
        gradeLabel: "새 상품급",
        seller: "검증 셀러 · 서연",
        sellerMeta: "거래 132건 · 평점 4.9",
        reasons: [
          "프리미엄 라인 전담 검수",
          "정품 감정 서류 확인",
          "찜 이력 기반 우선 매칭",
        ],
      },
    ],
  },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "예산을 입력하면 계산이 시작됩니다",
    desc: "카테고리와 예산 구간만 고르면, 매장 신품가와 repick AI 매칭가를 즉시 대조해 보여줍니다.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "컨디션을 실측해 근거를 남깁니다",
    desc: "전문 검수팀이 실측·하자를 확인해 S · A 등급만 계산기에 반영합니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "숫자로 증명하고 끝냅니다",
    desc: "가정이 아니라 실제 거래된 시세와 대조한 절감액입니다. 짐작이 아니라 계산입니다.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "-52%", label: "평균 절감율" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];
