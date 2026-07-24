import type { LucideIcon } from "lucide-react";
import { Move, ScanSearch, ArrowUpDown } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const discountPct = (retail: number, repick: number) =>
  Math.round((1 - repick / retail) * 100);

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

// --- domain: wardrobe rail -------------------------------------------------
// 레일은 "일반 옷장"(왼쪽, 정보 빈약 · 밀집 · 무채도) → "AI 큐레이션 캡슐"(오른쪽,
// 여유로운 간격 · 컬러 · 근거 태그 풍부)로 이어진다. 두 구간은 서로 다른 매물이며
// 동일 이미지를 좌우로 대응시키지 않는다(1:1 before/after 페어링 금지 — 구간 단위
// 전환만 표현).

export type RailGeneric = {
  id: string;
  kind: "generic";
  title: string;
  meta: string;
  image: { src: string; alt: string };
};

export type RailCurated = {
  id: string;
  kind: "curated";
  title: string;
  brand: string;
  image: { src: string; alt: string };
  retail: number;
  repick: number;
  match: number;
  grade: "S" | "A";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  tags: [string, string];
};

export type RailItem = RailGeneric | RailCurated;

// 일반 옷장 구간 — 5개, 판매자 자가 설명뿐인 밀집 매물
const GENERIC: RailGeneric[] = [
  {
    id: "g-dress",
    kind: "generic",
    title: "원피스 여러 벌",
    meta: "설명 없음 · 상태 불명",
    image: {
      src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=70",
      alt: "파스텔 톤 빈티지 원피스가 여러 벌 걸려 있는 옷걸이 랙",
    },
  },
  {
    id: "g-jacket",
    kind: "generic",
    title: "캐주얼 재킷 모음",
    meta: "사진 1장 · 사이즈 미기재",
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=70",
      alt: "다양한 색상의 캐주얼 재킷이 걸려 있는 옷걸이 랙",
    },
  },
  {
    id: "g-coat",
    kind: "generic",
    title: "코트 무더기",
    meta: "판매자 임의 가격",
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=70",
      alt: "옷걸이에 빽빽하게 걸린 여러 벌의 코트",
    },
  },
  {
    id: "g-bag",
    kind: "generic",
    title: "잡화 · 가방",
    meta: "컨디션 자가 신고",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=500&q=70",
      alt: "바닥에 정리 없이 놓인 가죽 소재 크로스백",
    },
  },
  {
    id: "g-sneaker",
    kind: "generic",
    title: "스니커즈 한 켤레",
    meta: "검수 이력 없음",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=500&q=70",
      alt: "박스 없이 놓인 화이트 톤 클래식 스니커즈",
    },
  },
];

// AI 큐레이션 캡슐 구간 — 5개, 실측 근거 + 매칭 태그가 풍부한 매물
const CURATED: RailCurated[] = [
  {
    id: "c-trench",
    kind: "curated",
    title: "오버사이즈 트렌치코트",
    brand: "Aureum Vintage",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=75",
      alt: "베이지 톤 오버사이즈 트렌치코트를 입은 인물의 패션 컷",
    },
    retail: 268000,
    repick: 132000,
    match: 91,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 지민",
    sellerMeta: "거래 118건 · 평점 4.8",
    tags: ["오버핏 취향 반영", "A등급 이상만"],
  },
  {
    id: "c-shoulder",
    kind: "curated",
    title: "레더 미니 숄더백",
    brand: "Atelier Noir",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=75",
      alt: "가죽 소재 미니 숄더백을 가까이서 촬영한 사진",
    },
    retail: 214000,
    repick: 104000,
    match: 90,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 서연",
    sellerMeta: "거래 143건 · 평점 4.8",
    tags: ["뉴트럴 컬러 매칭", "정품 인증 확인"],
  },
  {
    id: "c-sneaker",
    kind: "curated",
    title: "하이탑 레더 스니커즈",
    brand: "Runway Archive",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=75",
      alt: "하이탑 레더 스니커즈 한 켤레를 나란히 놓은 사진",
    },
    retail: 236000,
    repick: 112000,
    match: 94,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 민재",
    sellerMeta: "거래 189건 · 재구매율 41%",
    tags: ["실측 사이즈 오차 0.5cm", "밑창 마모 6%"],
  },
  {
    id: "c-setup",
    kind: "curated",
    title: "미니멀 니트 셋업",
    brand: "Studio Aren",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=75",
      alt: "뉴트럴 톤 미니멀 셋업을 입은 인물의 패션 컷",
    },
    retail: 246000,
    repick: 118000,
    match: 96,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 리나",
    sellerMeta: "거래 127건 · 평점 4.9",
    tags: ["소재 취향 반영", "보풀 밀도 실측 완료"],
  },
  {
    id: "c-blouse",
    kind: "curated",
    title: "실크 블라우스",
    brand: "Noir & Co.",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=75",
      alt: "실크 블라우스를 입은 인물의 패션 컷",
    },
    retail: 189000,
    repick: 92000,
    match: 93,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 은우",
    sellerMeta: "거래 96건 · 평점 4.9",
    tags: ["이염 여부 실측", "핏 취향 반영"],
  },
];

export const GENERIC_COUNT = GENERIC.length;
export const RAIL_ITEMS: RailItem[] = [...GENERIC, ...CURATED];
export const CURATED_ITEMS: RailCurated[] = CURATED;

// --- value 3-split ---------------------------------------------------------
export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "레일을 밀면 캡슐이 시작됩니다",
    desc: "일반 매물 구간에서 손끝으로 한 번만 밀어도 AI가 재검수한 큐레이션 캡슐 구간으로 넘어갑니다. 이동 자체가 곧 AI가 다시 고르는 과정입니다.",
    icon: Move,
  },
  {
    index: "02",
    title: "옷걸이를 넘겨도 근거는 남습니다",
    desc: "매칭%, 컨디션 등급, 인증 배지, before/after 할인율은 카드가 바뀌어도 hover 없이 항상 카드 위에 상주합니다.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "정렬 기준을 바꾸면 순위가 바뀝니다",
    desc: "매칭 정확도순, 할인율순 — 아래 프리뷰에서 기준을 바꿀 때마다 실제 순위가 즉시 재계산됩니다.",
    icon: ArrowUpDown,
  },
];

// --- top stat band -----------------------------------------------------
export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "132,000+", label: "누적 재판매" },
  { value: "9/9", label: "실측 검수 항목" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

// --- social proof toggle: 구매자 vs 판매자 ---------------------------------
export type Audience = "buyer" | "seller";

export type AudienceProof = {
  quote: string;
  authorName: string;
  authorMeta: string;
  stats: Stat[];
};

export const AUDIENCE_PROOF: Record<Audience, AudienceProof> = {
  buyer: {
    quote:
      "레일을 오른쪽으로 밀었을 뿐인데 가격이 반으로 줄어 있었어요. 그때부터 이 서비스를 믿게 됐습니다.",
    authorName: "한지호",
    authorMeta: "프로덕트 디자이너 · 구매자",
    stats: [
      { value: "-49%", label: "평균 매칭가 절감률" },
      { value: "92초", label: "평균 매칭 소요" },
      { value: "4.9/5", label: "구매 만족도" },
    ],
  },
  seller: {
    quote:
      "옷장 사진만 올렸는데 AI가 9개 항목을 검수해서 등급을 매겨줬어요. 판매 속도가 확실히 빨라졌습니다.",
    authorName: "오세인",
    authorMeta: "인증 셀러",
    stats: [
      { value: "3.2일", label: "평균 판매 완료" },
      { value: "171건", label: "누적 거래" },
      { value: "35%", label: "평균 재구매율" },
    ],
  },
};
