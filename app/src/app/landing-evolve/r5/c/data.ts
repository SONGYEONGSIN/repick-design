import type { LucideIcon } from "lucide-react";
import { Search, ArrowUpDown, ShieldCheck } from "lucide-react";

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
  "text-[0.7rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain: live matching index -----------------------------------------

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: { src: string; alt: string };
  retail: number;
  repick: number;
  grade: "S" | "A" | "B";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  verified: boolean;
};

export const discountPct = (l: Listing) =>
  Math.round((1 - l.repick / l.retail) * 100);

export const LISTINGS: Record<string, Listing> = {
  jacket: {
    id: "jacket",
    title: "빈티지 트위드 숏자켓",
    brand: "Atelier Given",
    category: "자켓",
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
      alt: "옷걸이에 가지런히 걸린 트위드 자켓",
    },
    retail: 156000,
    repick: 76000,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 하늘",
    sellerMeta: "거래 171건",
    verified: true,
  },
  trench: {
    id: "trench",
    title: "오버사이즈 더블 트렌치코트",
    brand: "Aureum Vintage",
    category: "아우터",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
      alt: "베이지 톤 오버사이즈 트렌치코트를 입은 인물의 패션 컷",
    },
    retail: 268000,
    repick: 132000,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 지민",
    sellerMeta: "거래 203건",
    verified: true,
  },
  knit: {
    id: "knit",
    title: "캐시미어 브이넥 니트",
    brand: "Studio Aren",
    category: "니트",
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      alt: "옅은 뉴트럴 톤의 니트웨어",
    },
    retail: 246000,
    repick: 98000,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 리나",
    sellerMeta: "거래 127건",
    verified: true,
  },
  blouse: {
    id: "blouse",
    title: "실크 롱슬리브 블라우스",
    brand: "Noir & Co.",
    category: "블라우스",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
      alt: "실크 블라우스를 입은 인물의 패션 컷",
    },
    retail: 189000,
    repick: 89000,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 서연",
    sellerMeta: "거래 96건",
    verified: true,
  },
  sneakerLow: {
    id: "sneakerLow",
    title: "레더 로우탑 스니커즈",
    brand: "Fielder Studio",
    category: "스니커즈",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80",
      alt: "화이트 톤의 클래식 스니커즈 한 켤레",
    },
    retail: 298000,
    repick: 139000,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 준서",
    sellerMeta: "거래 189건",
    verified: true,
  },
  sneakerHigh: {
    id: "sneakerHigh",
    title: "하이탑 레더 스니커즈",
    brand: "Runway Archive",
    category: "스니커즈",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
      alt: "하이탑 스니커즈 한 켤레를 나란히 놓은 사진",
    },
    retail: 236000,
    repick: 112000,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 민재",
    sellerMeta: "거래 154건",
    verified: true,
  },
  bagCrossbody: {
    id: "bagCrossbody",
    title: "미니 크로스바디백",
    brand: "Noir & Co.",
    category: "가방",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=600&q=80",
      alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
    },
    retail: 268000,
    repick: 129000,
    grade: "S",
    gradeLabel: "새 상품급",
    seller: "검증 셀러 · 은우",
    sellerMeta: "거래 143건",
    verified: true,
  },
  bagShoulder: {
    id: "bagShoulder",
    title: "레더 미니 숄더백",
    brand: "Atelier Noir",
    category: "가방",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
      alt: "가죽 소재 미니 숄더백을 가까이서 촬영한 사진",
    },
    retail: 214000,
    repick: 104000,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 채원",
    sellerMeta: "거래 88건",
    verified: true,
  },
  dress: {
    id: "dress",
    title: "플로럴 프린트 미디 원피스",
    brand: "Aureum Vintage",
    category: "원피스",
    image: {
      src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      alt: "파스텔 톤 빈티지 원피스가 걸려 있는 옷걸이 랙",
    },
    retail: 172000,
    repick: 79000,
    grade: "B",
    gradeLabel: "사용감 보통 · 검수 통과",
    seller: "검증 셀러 · 다은",
    sellerMeta: "거래 112건",
    verified: true,
  },
  jewelry: {
    id: "jewelry",
    title: "빈티지 실버 주얼리 세트",
    brand: "Atelier Noir",
    category: "액세서리",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
      alt: "테이블 위에 놓인 빈티지 액세서리",
    },
    retail: 98000,
    repick: 42000,
    grade: "A",
    gradeLabel: "사용감 적음",
    seller: "검증 셀러 · 도윤",
    sellerMeta: "거래 67건",
    verified: true,
  },
};

export type QueryMatch = {
  listingId: string;
  match: number;
  reasonTags: [string, string];
};

export type Query = {
  id: string;
  label: string;
  summary: string;
  // 매칭순 기본 정렬 — 배열 순서 자체가 매칭% 내림차순 (결정론적 고정 데이터)
  results: QueryMatch[];
};

// 검색 조건 칩 5종 — 선택 시 아래 인덱스가 이 고정 데이터로 즉시 재계산됨(Math.random/Date.now 없음)
export const QUERIES: Query[] = [
  {
    id: "jacket-budget",
    label: "빈티지 자켓 밑 8만원",
    summary: "예산 8만원 이하 · 자켓 · 아우터 무드",
    results: [
      { listingId: "jacket", match: 97, reasonTags: ["예산 8만원 이하 통과", "자켓 카테고리 정확 일치"] },
      { listingId: "dress", match: 74, reasonTags: ["예산 조건 충족", "빈티지 무드 유사도 높음"] },
      { listingId: "jewelry", match: 61, reasonTags: ["예산 여유 크게 남음", "동일 셀러 컬렉션"] },
    ],
  },
  {
    id: "sneaker-auth",
    label: "정품 인증 스니커즈",
    summary: "정품 감정 통과 · 스니커즈 카테고리",
    results: [
      { listingId: "sneakerLow", match: 98, reasonTags: ["정품 감정 통과", "거래 189건 인증 셀러"] },
      { listingId: "sneakerHigh", match: 95, reasonTags: ["정품 감정 통과", "실측 사이즈 오차 0.3cm"] },
      { listingId: "bagShoulder", match: 68, reasonTags: ["동일 인증 기준 통과", "가죽 제품군 근접 추천"] },
    ],
  },
  {
    id: "knit-s-grade",
    label: "니트 S급 컨디션",
    summary: "컨디션 등급 S · 니트 · 상의 카테고리",
    results: [
      { listingId: "knit", match: 99, reasonTags: ["컨디션 등급 S", "보풀·이염 없음 실측 확인"] },
      { listingId: "blouse", match: 70, reasonTags: ["상의 카테고리 근접", "등급 A(사용감 적음)"] },
      { listingId: "jacket", match: 55, reasonTags: ["등급 S 조건 충족", "카테고리는 자켓으로 상이"] },
    ],
  },
  {
    id: "bag-100k",
    label: "가죽 미니백 10만원대",
    summary: "10만원대 가격 · 가죽 가방 카테고리",
    results: [
      { listingId: "bagShoulder", match: 96, reasonTags: ["10만원대 가격 정확 일치", "가죽 소재 확인"] },
      { listingId: "bagCrossbody", match: 84, reasonTags: ["가격대 근접", "크로스바디 인기 상위"] },
      { listingId: "jewelry", match: 48, reasonTags: ["동일 셀러 컬렉션", "가격대는 상이"] },
    ],
  },
  {
    id: "dress-verified",
    label: "여름 원피스 정품 셀러",
    summary: "인증 판매자 · 원피스 카테고리",
    results: [
      { listingId: "dress", match: 93, reasonTags: ["정품 감정 통과", "원피스 카테고리 정확 일치"] },
      { listingId: "blouse", match: 77, reasonTags: ["상의 카테고리 근접", "동일 인증 기준 통과"] },
      { listingId: "knit", match: 58, reasonTags: ["여름 소재는 아님", "인증 셀러 조건은 충족"] },
    ],
  },
];

// --- section 2: always-visible rich preview cards (no hover-gated reveal) --
export type PreviewPick = {
  listingId: string;
  matchOverall: number;
  tags: [string, string];
};

export const PREVIEW_PICKS: PreviewPick[] = [
  { listingId: "trench", matchOverall: 91, tags: ["오버사이즈 실루엣 선호 반영", "가을 아우터 수요 1위"] },
  { listingId: "sneakerHigh", matchOverall: 94, tags: ["실측 사이즈 오차 0.3cm", "밑창 마모율 6%"] },
  { listingId: "bagShoulder", matchOverall: 90, tags: ["뉴트럴 컬러 매칭", "정품 인증 완료"] },
];

export const PREVIEW_DETAIL: Record<string, string> = {
  trench:
    "최근 90일 동일 브랜드 실거래 84건과 대조해 132,000원으로 책정됐고, 오버핏 선호 프로필과 실루엣 유사도 91%로 매칭됐습니다.",
  sneakerHigh:
    "전문 검수팀이 밑창 마모율·접착 상태·실측 사이즈 9개 항목을 실측해 S등급을 산정했고, 인증 셀러 민재의 거래 154건 이력을 함께 확인했습니다.",
  bagShoulder:
    "금속 장식 산화 여부와 지퍼 작동을 포함한 9개 항목 실측을 통과했고, 뉴트럴 톤 선호 프로필과 컬러 적합도 90%로 매칭됐습니다.",
};

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "조건 칩을 고르면 인덱스가 다시 계산됩니다",
    desc: "문장형 검색 조건을 선택하면 매칭 근거·AI 매칭%·정렬 순위까지 그 조건에 맞춰 즉시 재계산됩니다. 페이지 새로고침이 필요 없습니다.",
    icon: Search,
  },
  {
    index: "02",
    title: "정렬 기준을 바꾸면 순위가 뒤집힙니다",
    desc: "매칭 정확도순과 할인율 높은순 사이를 오가며 같은 결과를 다른 기준으로 다시 볼 수 있습니다. 조작이 곧 비교가 됩니다.",
    icon: ArrowUpDown,
  },
  {
    index: "03",
    title: "증명은 인덱스 밖으로 숨지 않습니다",
    desc: "매칭 근거, 컨디션 등급, 인증 판매자, before/after 할인율 — 네 가지 증명은 클릭이나 hover 없이 모든 행에 항상 노출됩니다.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "12,860+", label: "인증 매물 인덱스" },
  { value: "9/9", label: "실측 검수 항목" },
  { value: "93%", label: "평균 매칭 정확도" },
];
