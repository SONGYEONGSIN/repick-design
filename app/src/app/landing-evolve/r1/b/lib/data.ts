/**
 * landing-evolve r1/b — 결정론 데이터.
 * Math.random / Date.now / new Date 금지 — 모든 값은 고정 문자열/숫자.
 */

export type ChapterId = "intro" | "match" | "inspect" | "deliver" | "proof" | "start";

export interface Chapter {
  id: ChapterId;
  no: string;
  label: string;
}

/** 진행률 레일의 정거장 — 서비스 여정(취향 → 매칭 → 검수 → 배송 → 신뢰 → 시작). */
export const CHAPTERS: Chapter[] = [
  { id: "intro", no: "00", label: "취향 등록" },
  { id: "match", no: "01", label: "AI 매칭" },
  { id: "inspect", no: "02", label: "전문 검수" },
  { id: "deliver", no: "03", label: "안심 배송" },
  { id: "proof", no: "04", label: "사용자 후기" },
  { id: "start", no: "05", label: "시작하기" },
];

/** 가치 3분할 — 여정이 지키는 세 가지 약속(정확·검증·안심). */
export const PROMISES = [
  {
    icon: "sparkles" as const,
    stat: "94%",
    label: "평균 매칭 정확도",
    desc: "취향·사이즈·예산을 벡터로 대조해 지금 살 만한 것만 남깁니다.",
  },
  {
    icon: "shield" as const,
    stat: "12단계",
    label: "전문 검수 항목",
    desc: "사람이 직접 실측하고 하자를 확인한 상품만 매칭합니다.",
  },
  {
    icon: "truck" as const,
    stat: "100%",
    label: "실측 사진 제공",
    desc: "실물을 보지 않아도 상태를 정확히 가늠할 수 있습니다.",
  },
];

/** 제품 프리뷰 — AI 매칭 챕터의 핵심 매물 카드. */
export const FEATURED_PRODUCT = {
  title: "빈티지 카멜 울 코트",
  brand: "Aureum Vintage",
  price: "89,000",
  original: "148,000",
  discount: 40,
  match: 94,
  grade: "A",
  gradeLabel: "사용감 적음",
  seller: "인증 판매자",
  sellerMeta: "누적 거래 312회 · 만족 98%",
  tags: ["취향 일치", "사이즈 딱 맞음", "예산 안쪽"],
  image:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  alt: "옷걸이에 가지런히 걸린 카멜 톤의 울 코트",
};

/** AI 매칭 스코어 근거 — 합성 점수 94를 구성하는 세부 지표. */
export const MATCH_SCORES = [
  { label: "취향 벡터 일치", value: 96 },
  { label: "사이즈 실측 대조", value: 100 },
  { label: "예산 적합도", value: 88 },
  { label: "브랜드 선호", value: 92 },
];

/** 검수 체크리스트 — 사람이 직접 확인하는 항목. */
export const INSPECTION_ITEMS = [
  "실측 사이즈 3부위 측정",
  "봉제·마감 상태 확인",
  "오염·변색 여부 점검",
  "정품 여부 인증",
  "지퍼·단추 작동 확인",
  "냄새·보풀 최종 점검",
];

/** 컨디션 등급 스케일 — 이번 매물은 A. */
export const GRADE_SCALE = [
  { grade: "S", desc: "미착용급" },
  { grade: "A", desc: "사용감 적음" },
  { grade: "B", desc: "생활 사용감" },
  { grade: "C", desc: "뚜렷한 사용감" },
];

/** 배송 추적 — 결정론 타임스탬프(고정 문자열). */
export const DELIVERY_STEPS = [
  { step: "검수 완료", time: "07/16 14:20", state: "done" as const },
  { step: "안전 포장", time: "07/16 17:05", state: "done" as const },
  { step: "물류센터 출고", time: "07/17 09:30", state: "done" as const },
  { step: "배송 중", time: "07/17 11:40", state: "active" as const },
  { step: "도착 예정", time: "07/18 오전", state: "todo" as const },
];

/** 소셜프루프 — 지표. */
export const STATS = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

/** 소셜프루프 — 후기(모노그램 아바타로 near-mono 유지). */
export const TESTIMONIALS = [
  {
    quote: "찜만 300개였는데, 이제 진짜 살 것만 봅니다.",
    name: "김도윤",
    role: "프리랜서 디자이너",
    initials: "김",
  },
  {
    quote: "검수 등급이 정확해 반품 걱정이 사라졌어요.",
    name: "이서현",
    role: "마케터",
    initials: "이",
  },
  {
    quote: "빈티지 찾는 시간이 반의 반으로 줄었습니다.",
    name: "박지민",
    role: "사진작가",
    initials: "박",
  },
];
