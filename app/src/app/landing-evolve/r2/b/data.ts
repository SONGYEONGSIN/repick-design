// Proof Deck — candidate r2/b
// Deterministic data + tokens. No Math.random / Date.now / new Date.
// Design DNA: dark near-monochrome, single accent #6E56CF, exactly 3 font weights.

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// SSR-safe thousands separator (no toLocaleString → no locale drift).
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// SVG coordinates rounded to 2 decimals (DNA constraint).
export const round2 = (n: number) => Math.round(n * 100) / 100;

// --- tokens --------------------------------------------------------------
export const ACCENT = "#6E56CF";
export const BG = "#0B0B0F";
export const EASE = [0.16, 1, 0.3, 1] as const;

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";

// tracking scale (DNA): eyebrow 0.28em / caption 0.16em / stat 0.12em
export const TRACK_EYEBROW = "tracking-[0.28em]";
export const TRACK_CAPTION = "tracking-[0.16em]";
export const TRACK_STAT = "tracking-[0.12em]";

// --- proof deck ----------------------------------------------------------
export type Perspective = "buyer" | "seller";

export type ProofView = {
  metric: string; // headline metric label
  value: number; // count-up target
  prefix?: string;
  suffix?: string;
  useComma?: boolean;
  caption: string; // Fig-style evidence caption
  series: number[]; // chart data (deterministic)
  seriesLabels?: string[];
};

export type Proof = {
  id: string;
  fig: string; // "01"
  eyebrow: string;
  chart: "line" | "vbar" | "hbar";
  buyer: ProofView;
  seller: ProofView;
};

export const PROOFS: Proof[] = [
  {
    id: "proof-accuracy",
    fig: "01",
    eyebrow: "매칭 정확도",
    chart: "line",
    buyer: {
      metric: "AI 취향 매칭 적중률",
      value: 94,
      suffix: "%",
      caption:
        "Fig. 01 — 최근 12주간 찜·스킵 피드백을 반영한 추천 카드의 저장·구매 전환율. 주 단위로 우상향.",
      series: [78, 80, 83, 82, 86, 88, 87, 90, 91, 92, 93, 94],
    },
    seller: {
      metric: "판매 성사 예측 정확도",
      value: 91,
      suffix: "%",
      caption:
        "Fig. 01 — AI가 '팔릴 매물'로 예측한 등록 상품의 실제 판매 성사율. 12주 연속 개선.",
      series: [70, 73, 75, 79, 80, 83, 85, 86, 88, 89, 90, 91],
    },
  },
  {
    id: "proof-value",
    fig: "02",
    eyebrow: "금액 증명",
    chart: "vbar",
    buyer: {
      metric: "1인당 평균 절약액",
      value: 312000,
      prefix: "₩",
      useComma: true,
      caption:
        "Fig. 02 — 동일 상품 시세 대비 RE:픽 매칭가로 아낀 금액의 사용자 평균. 카테고리별 누적.",
      series: [42, 58, 71, 86, 100],
      seriesLabels: ["의류", "가방", "슈즈", "가전", "전체"],
    },
    seller: {
      metric: "월평균 정산 금액",
      value: 1240000,
      prefix: "₩",
      useComma: true,
      caption:
        "Fig. 02 — 인증 판매자가 RE:픽 매칭 판매로 받은 월 정산액 평균. 등록 6개월 코호트 기준.",
      series: [34, 61, 79, 90, 100],
      seriesLabels: ["1월", "2월", "3월", "4월", "누적"],
    },
  },
  {
    id: "proof-inspection",
    fig: "03",
    eyebrow: "검수 신뢰도",
    chart: "hbar",
    buyer: {
      metric: "출고 전 검수 통과 항목",
      value: 12,
      suffix: "단계",
      caption:
        "Fig. 03 — 실측·정품·하자·기능 등 12개 항목을 모두 통과한 매물만 매칭 결과에 노출.",
      series: [100, 100, 98, 100, 99, 100],
      seriesLabels: ["실측", "정품", "하자", "기능", "부속", "외관"],
    },
    seller: {
      metric: "평균 상품 등록 소요",
      value: 3,
      suffix: "분",
      caption:
        "Fig. 03 — 사진 한 장이면 AI가 시세·등급·설명을 자동 완성. 항목별 자동화 완성도.",
      series: [96, 98, 94, 100, 97, 99],
      seriesLabels: ["시세", "등급", "설명", "태그", "사진", "노출"],
    },
  },
];

// aggregate proof (perspective-independent) for the summary slide
export type Aggregate = {
  value: number;
  prefix?: string;
  suffix?: string;
  useComma?: boolean;
  label: string;
};

export const AGGREGATES: Aggregate[] = [
  { value: 128000, suffix: "+", useComma: true, label: "누적 재판매 건수" },
  { value: 47, suffix: "만", label: "누적 매칭 카드 발행" },
  { value: 98, suffix: "%", label: "재매칭 만족도" },
];

// --- products (rich cards) ----------------------------------------------
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

export const fmtValue = (v: {
  value: number;
  prefix?: string;
  suffix?: string;
  useComma?: boolean;
}) => `${v.prefix ?? ""}${v.useComma ? comma(v.value) : v.value}${v.suffix ?? ""}`;
