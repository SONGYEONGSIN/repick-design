// 결정론적 목업 데이터 — 난수·현재시각 기반 동적 생성 금지(고정 리터럴만 사용).
// 모든 시각은 고정 기준시각(NOW) 기준 상대 오프셋으로 계산한다.
// 제품: Rivet — 실시간 고객 이벤트 인텔리전스 플랫폼 (CDP / 프로덕트 애널리틱스).

export type EventCategory = "conversion" | "signup" | "engagement" | "churn" | "error";
export type Source = "web" | "ios" | "android" | "server";
export type Period = "today" | "7d" | "30d";

export interface RivetEvent {
  id: string;
  category: EventCategory;
  /** 서술형 행동 — "결제를 완료했습니다" */
  action: string;
  /** 코드성 이벤트 키 — mono 표기 */
  eventName: string;
  /** 사용자명. null이면 익명/서버 이벤트 → 이니셜/아이콘 대체 */
  user: string | null;
  source: Source;
  /** 기준시각 대비 경과 초 */
  secondsAgo: number;
  at: Date;
  /** 수집 지연시간(ms) */
  latencyMs: number;
  props: { label: string; value: string }[];
}

interface RawEvent extends Omit<RivetEvent, "id" | "at"> {
  seq: number;
}

const SEC = 1000;

/** 대시보드 스냅샷 기준 시각 (고정값 — 실제 시계 미사용). */
export const NOW = new Date("2026-07-15T14:32:10+09:00");

/** seq를 결정론적 이벤트 ID로. */
function eventId(seq: number): string {
  const base = (seq * 2654435761) % 0xffffff;
  return `evt_${base.toString(16).padStart(6, "0")}`;
}

const RAW_EVENTS: RawEvent[] = [
  {
    seq: 1,
    category: "conversion",
    action: "프로 연간 구독을 결제했습니다",
    eventName: "subscription.started",
    user: "김서연",
    source: "web",
    secondsAgo: 8,
    latencyMs: 62,
    props: [
      { label: "플랜", value: "Pro (연간)" },
      { label: "결제 금액", value: "₩588,000" },
      { label: "쿠폰", value: "SUMMER25" },
    ],
  },
  {
    seq: 2,
    category: "engagement",
    action: "상품을 장바구니에 담았습니다",
    eventName: "cart.item_added",
    user: "이준호",
    source: "ios",
    secondsAgo: 21,
    latencyMs: 44,
    props: [
      { label: "상품", value: "무선 이어버드 Pro" },
      { label: "수량", value: "1" },
      { label: "장바구니 합계", value: "₩139,000" },
    ],
  },
  {
    seq: 3,
    category: "signup",
    action: "회원가입을 완료했습니다",
    eventName: "user.signed_up",
    user: "박도현",
    source: "web",
    secondsAgo: 39,
    latencyMs: 71,
    props: [
      { label: "유입 채널", value: "구글 검색" },
      { label: "이메일 인증", value: "완료" },
    ],
  },
  {
    seq: 4,
    category: "error",
    action: "결제 웹훅 처리 중 오류가 발생했습니다",
    eventName: "webhook.delivery_failed",
    user: null,
    source: "server",
    secondsAgo: 54,
    latencyMs: 4120,
    props: [
      { label: "엔드포인트", value: "POST /hooks/stripe" },
      { label: "응답 코드", value: "504 Gateway Timeout" },
      { label: "재시도", value: "3회 예약됨" },
    ],
  },
  {
    seq: 5,
    category: "engagement",
    action: "제품 투어를 끝까지 완료했습니다",
    eventName: "onboarding.tour_completed",
    user: "정하늘",
    source: "android",
    secondsAgo: 76,
    latencyMs: 38,
    props: [
      { label: "단계", value: "5 / 5" },
      { label: "소요", value: "2분 14초" },
    ],
  },
  {
    seq: 6,
    category: "conversion",
    action: "단건 상품을 구매했습니다",
    eventName: "order.completed",
    user: "최민지",
    source: "web",
    secondsAgo: 95,
    latencyMs: 58,
    props: [
      { label: "주문번호", value: "#RV-40218" },
      { label: "결제 금액", value: "₩74,500" },
      { label: "결제 수단", value: "카카오페이" },
    ],
  },
  {
    seq: 7,
    category: "engagement",
    action: "대시보드를 조회했습니다",
    eventName: "page.viewed",
    user: "강태윤",
    source: "web",
    secondsAgo: 118,
    latencyMs: 29,
    props: [
      { label: "경로", value: "/app/insights" },
      { label: "세션 길이", value: "6분 02초" },
    ],
  },
  {
    seq: 8,
    category: "churn",
    action: "구독을 해지 예약했습니다",
    eventName: "subscription.canceled",
    user: "윤소라",
    source: "web",
    secondsAgo: 142,
    latencyMs: 66,
    props: [
      { label: "사유", value: "가격 부담" },
      { label: "만료 예정", value: "2026-08-01" },
      { label: "잔여 크레딧", value: "₩22,000" },
    ],
  },
  {
    seq: 9,
    category: "signup",
    action: "회원가입을 완료했습니다",
    eventName: "user.signed_up",
    user: "임재원",
    source: "android",
    secondsAgo: 173,
    latencyMs: 82,
    props: [
      { label: "유입 채널", value: "추천 링크" },
      { label: "추천인", value: "김서연" },
    ],
  },
  {
    seq: 10,
    category: "engagement",
    action: "리포트를 CSV로 내보냈습니다",
    eventName: "report.exported",
    user: "한지우",
    source: "web",
    secondsAgo: 204,
    latencyMs: 133,
    props: [
      { label: "리포트", value: "월간 코호트" },
      { label: "행 수", value: "12,480" },
    ],
  },
  {
    seq: 11,
    category: "conversion",
    action: "팀 좌석 3개를 추가했습니다",
    eventName: "seats.upgraded",
    user: "오세훈",
    source: "web",
    secondsAgo: 241,
    latencyMs: 74,
    props: [
      { label: "추가 좌석", value: "3" },
      { label: "월 추가액", value: "₩117,000" },
    ],
  },
  {
    seq: 12,
    category: "engagement",
    action: "푸시 알림을 열었습니다",
    eventName: "notification.opened",
    user: "서예린",
    source: "ios",
    secondsAgo: 288,
    latencyMs: 41,
    props: [
      { label: "캠페인", value: "장바구니 리마인더" },
      { label: "기기", value: "iPhone 16" },
    ],
  },
  {
    seq: 13,
    category: "error",
    action: "이벤트 스키마 검증에 실패했습니다",
    eventName: "ingest.schema_rejected",
    user: null,
    source: "server",
    secondsAgo: 336,
    latencyMs: 12,
    props: [
      { label: "이벤트", value: "checkout.step" },
      { label: "누락 속성", value: "cart_id" },
      { label: "드롭", value: "1건" },
    ],
  },
  {
    seq: 14,
    category: "engagement",
    action: "검색을 실행했습니다",
    eventName: "search.performed",
    user: "노은채",
    source: "android",
    secondsAgo: 402,
    latencyMs: 35,
    props: [
      { label: "질의", value: "여름 원피스" },
      { label: "결과 수", value: "248" },
    ],
  },
  {
    seq: 15,
    category: "conversion",
    action: "베이직에서 프로로 업그레이드했습니다",
    eventName: "subscription.upgraded",
    user: "배준영",
    source: "ios",
    secondsAgo: 471,
    latencyMs: 69,
    props: [
      { label: "이전 플랜", value: "Basic" },
      { label: "신규 플랜", value: "Pro (월간)" },
      { label: "차액", value: "₩29,000" },
    ],
  },
  {
    seq: 16,
    category: "signup",
    action: "회원가입을 완료했습니다",
    eventName: "user.signed_up",
    user: "문가은",
    source: "web",
    secondsAgo: 548,
    latencyMs: 77,
    props: [
      { label: "유입 채널", value: "인스타그램 광고" },
      { label: "이메일 인증", value: "대기중" },
    ],
  },
  {
    seq: 17,
    category: "engagement",
    action: "위시리스트에 추가했습니다",
    eventName: "wishlist.item_added",
    user: "신동하",
    source: "android",
    secondsAgo: 629,
    latencyMs: 47,
    props: [
      { label: "상품", value: "캔버스 토트백" },
      { label: "가격", value: "₩48,000" },
    ],
  },
  {
    seq: 18,
    category: "engagement",
    action: "결제 단계에 진입했습니다",
    eventName: "checkout.started",
    user: "황ري아", // placeholder replaced below
    source: "web",
    secondsAgo: 712,
    latencyMs: 31,
    props: [
      { label: "장바구니 합계", value: "₩212,000" },
      { label: "상품 수", value: "3" },
    ],
  },
  {
    seq: 19,
    category: "churn",
    action: "휴면 계정으로 전환됐습니다",
    eventName: "user.went_dormant",
    user: "권나래",
    source: "server",
    secondsAgo: 804,
    latencyMs: 18,
    props: [
      { label: "마지막 활동", value: "31일 전" },
      { label: "생애 결제", value: "₩0" },
    ],
  },
  {
    seq: 20,
    category: "conversion",
    action: "단건 상품을 구매했습니다",
    eventName: "order.completed",
    user: "조현우",
    source: "ios",
    secondsAgo: 906,
    latencyMs: 55,
    props: [
      { label: "주문번호", value: "#RV-40194" },
      { label: "결제 금액", value: "₩163,000" },
      { label: "결제 수단", value: "신용카드" },
    ],
  },
  {
    seq: 21,
    category: "engagement",
    action: "리뷰를 작성했습니다",
    eventName: "review.submitted",
    user: "유하람",
    source: "android",
    secondsAgo: 1015,
    latencyMs: 52,
    props: [
      { label: "평점", value: "4.5점" },
      { label: "상품", value: "무선 이어버드 Pro" },
    ],
  },
  {
    seq: 22,
    category: "signup",
    action: "회원가입을 완료했습니다",
    eventName: "user.signed_up",
    user: "장민석",
    source: "ios",
    secondsAgo: 1132,
    latencyMs: 80,
    props: [
      { label: "유입 채널", value: "직접 방문" },
      { label: "이메일 인증", value: "완료" },
    ],
  },
  {
    seq: 23,
    category: "engagement",
    action: "쿠폰을 적용했습니다",
    eventName: "coupon.applied",
    user: "백서율",
    source: "web",
    secondsAgo: 1268,
    latencyMs: 33,
    props: [
      { label: "코드", value: "WELCOME10" },
      { label: "할인", value: "₩10,000" },
    ],
  },
  {
    seq: 24,
    category: "conversion",
    action: "연간 플랜으로 갱신했습니다",
    eventName: "subscription.renewed",
    user: "곽지훈",
    source: "web",
    secondsAgo: 1421,
    latencyMs: 64,
    props: [
      { label: "플랜", value: "Team (연간)" },
      { label: "갱신 금액", value: "₩1,164,000" },
    ],
  },
  {
    seq: 25,
    category: "engagement",
    action: "앱을 실행했습니다",
    eventName: "app.opened",
    user: "명수아",
    source: "android",
    secondsAgo: 1583,
    latencyMs: 26,
    props: [
      { label: "버전", value: "3.14.0" },
      { label: "콜드 스타트", value: "820ms" },
    ],
  },
  {
    seq: 26,
    category: "engagement",
    action: "대시보드를 조회했습니다",
    eventName: "page.viewed",
    user: "천유빈",
    source: "web",
    secondsAgo: 1761,
    latencyMs: 30,
    props: [
      { label: "경로", value: "/app/funnels" },
      { label: "세션 길이", value: "3분 41초" },
    ],
  },
];

// seq 18의 임시 이름 교정 (한글 조합 안전).
RAW_EVENTS[17].user = "황리아";

export const EVENTS: RivetEvent[] = RAW_EVENTS.map((raw) => ({
  ...raw,
  id: eventId(raw.seq),
  at: new Date(NOW.getTime() - raw.secondsAgo * SEC),
}));

// ── 히어로 스냅샷 (기간별 결정론적 값) ──────────────────────────────
export interface HeroSnapshot {
  totalEvents: number;
  deltaPct: number;
  activeUsers: number;
  conversionRate: number;
  errorRate: number;
}

export const HERO: Record<Period, HeroSnapshot> = {
  today: { totalEvents: 2_847_391, deltaPct: 12.4, activeUsers: 48_210, conversionRate: 3.8, errorRate: 0.42 },
  "7d": { totalEvents: 19_204_882, deltaPct: 6.1, activeUsers: 214_770, conversionRate: 3.6, errorRate: 0.51 },
  "30d": { totalEvents: 81_559_004, deltaPct: 9.7, activeUsers: 612_940, conversionRate: 3.9, errorRate: 0.47 },
};

// ── 처리량 추이 (기간별 시계열) ─────────────────────────────────────
export interface ThroughputPoint {
  label: string;
  events: number;
  errors: number;
}

function series(labels: string[], events: number[], errors: number[]): ThroughputPoint[] {
  return labels.map((label, i) => ({ label, events: events[i], errors: errors[i] }));
}

const HOURS = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
const WEEK = ["월", "화", "수", "목", "금", "토", "일"];

export const THROUGHPUT: Record<Period, ThroughputPoint[]> = {
  today: series(
    HOURS,
    [61_200, 42_800, 33_100, 38_400, 96_700, 168_400, 214_900, 248_300, 236_100, 198_500, 154_200, 121_800],
    [180, 96, 74, 88, 260, 470, 690, 1_040, 720, 540, 410, 320],
  ),
  "7d": series(
    WEEK,
    [2_410_000, 2_680_000, 2_540_000, 2_910_000, 3_180_000, 2_760_000, 2_720_000],
    [10_800, 12_400, 11_100, 13_900, 18_200, 12_700, 11_500],
  ),
  "30d": series(
    ["1주", "2주", "3주", "4주"],
    [18_900_000, 20_400_000, 21_100_000, 21_150_000],
    [92_000, 104_000, 98_000, 89_000],
  ),
};

// ── 실시간 처리율(events/sec) 미니 스파크라인 ───────────────────────
export const INGEST_RATE_SERIES = [312, 348, 331, 402, 388, 421, 396, 447, 462, 438, 471, 489];
export const INGEST_RATE_NOW = 489;

// ── 유형 분포 (오늘 전체) ───────────────────────────────────────────
export interface CategoryShare {
  category: EventCategory;
  share: number;
  count: number;
}

export const CATEGORY_DISTRIBUTION: CategoryShare[] = [
  { category: "engagement", share: 62.1, count: 1_768_230 },
  { category: "signup", share: 13.8, count: 392_940 },
  { category: "conversion", share: 11.4, count: 324_602 },
  { category: "churn", share: 7.9, count: 224_944 },
  { category: "error", share: 4.8, count: 136_675 },
];

// ── 상위 소스 ───────────────────────────────────────────────────────
export interface SourceShare {
  source: Source;
  share: number;
  count: number;
  trend: number[];
}

export const SOURCE_DISTRIBUTION: SourceShare[] = [
  { source: "web", share: 51.2, count: 1_457_864, trend: [40, 44, 42, 47, 49, 51, 51] },
  { source: "ios", share: 27.4, count: 780_185, trend: [30, 28, 29, 27, 28, 27, 27] },
  { source: "android", share: 15.6, count: 444_193, trend: [18, 17, 18, 16, 15, 16, 16] },
  { source: "server", share: 5.8, count: 165_149, trend: [12, 11, 11, 10, 8, 6, 6] },
];
