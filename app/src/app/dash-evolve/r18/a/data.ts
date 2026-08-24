/**
 * Quorum — Trust & Safety 심사 큐의 결정론적 더미 데이터.
 *
 * 난수원과 현재 시각원은 쓰지 않는다 — 날짜는 항상 인자를 준 생성자로만 만든다.
 * 변동이 필요한 시계열은 인자 있는 선형 합동 생성기(LCG)로 만들고, 신고 총계는
 * 사유별 건수의 합으로 계산해 부분합 = 총합 정합을 코드 차원에서 보장한다.
 */

export type Severity = "high" | "medium" | "low";
export type DecisionKind = "keep" | "remove" | "escalate";
export type SurfaceKind = "post" | "comment" | "profile" | "listing" | "clip";
export type PeriodKey = "24h" | "7d" | "30d";

export type ReasonKey =
  | "scam"
  | "spam"
  | "misinfo"
  | "harassment"
  | "graphic"
  | "impersonation"
  | "copyright"
  | "selfharm";

export type ReasonSlice = { key: ReasonKey; count: number };

export type SimilarCase = {
  key: string;
  caseId: string;
  surface: SurfaceKind;
  decision: DecisionKind;
  similarity: number;
  decidedOn: string;
  reviewer: string;
};

export type HistoryEntry = {
  date: string;
  action: string;
  note: string;
};

export type AccountSignal = {
  label: string;
  value: string;
  note: string;
};

export type ReviewItem = {
  id: string;
  surface: SurfaceKind;
  headline: string;
  excerpt: string;
  authorName: string;
  authorHandle: string;
  authorTint: number;
  severity: Severity;
  slaMinutes: number;
  slaBudget: number;
  queuedLabel: string;
  classifier: number;
  reasons: ReasonSlice[];
  reports: number;
  series: Record<PeriodKey, number[]>;
  history: HistoryEntry[];
  signals: AccountSignal[];
  similar: SimilarCase[];
};

/* ------------------------------------------------------------------ 메타 */

export const REASON_META: Record<ReasonKey, { label: string; fill: string; swatch: string }> = {
  scam: { label: "사기·금전 요구", fill: "bg-violet-700", swatch: "bg-violet-700" },
  harassment: { label: "괴롭힘·모욕", fill: "bg-violet-600", swatch: "bg-violet-600" },
  spam: { label: "스팸·도배", fill: "bg-violet-400", swatch: "bg-violet-400" },
  misinfo: { label: "허위 정보", fill: "bg-violet-300", swatch: "bg-violet-300" },
  graphic: { label: "폭력·수위", fill: "bg-violet-800", swatch: "bg-violet-800" },
  impersonation: { label: "사칭", fill: "bg-violet-500", swatch: "bg-violet-500" },
  copyright: { label: "저작권", fill: "bg-zinc-400", swatch: "bg-zinc-400" },
  selfharm: { label: "자해 위험", fill: "bg-violet-900", swatch: "bg-violet-900" },
};

export const SURFACE_META: Record<SurfaceKind, string> = {
  post: "게시물",
  comment: "댓글",
  profile: "프로필",
  listing: "거래글",
  clip: "짧은 영상",
};

export const SEVERITY_META: Record<Severity, { label: string; text: string; chip: string }> = {
  high: { label: "높음", text: "text-violet-800", chip: "bg-violet-50 text-violet-800 ring-violet-200" },
  medium: { label: "보통", text: "text-zinc-700", chip: "bg-zinc-50 text-zinc-700 ring-zinc-200" },
  low: { label: "낮음", text: "text-zinc-600", chip: "bg-white text-zinc-600 ring-zinc-200" },
};

export const DECISION_META: Record<DecisionKind, { label: string; short: string; chip: string }> = {
  keep: { label: "유지 승인", short: "유지", chip: "bg-white text-zinc-700 ring-zinc-300" },
  remove: { label: "게시 차단", short: "차단", chip: "bg-violet-600 text-white ring-violet-600" },
  escalate: { label: "상급 보류", short: "보류", chip: "bg-violet-50 text-violet-800 ring-violet-300" },
};

/* ------------------------------------------------------- 결정론 생성기 */

function lcg(seed: number): () => number {
  let state = (seed * 2654435761) % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

function series(seed: number, length: number, base: number, spread: number): number[] {
  const next = lcg(seed);
  const out: number[] = [];
  for (let i = 0; i < length; i += 1) {
    const wave = 0.55 + 0.45 * Math.abs(((i * 7) % length) / length - 0.5) * 2;
    out.push(Math.max(1, Math.round(base + next() * spread * wave)));
  }
  return out;
}

const REVIEWERS = ["조민서", "허유정", "남기웅", "배소윤", "문재원"];
const CASE_DATES = ["2026-08-21", "2026-08-19", "2026-08-14", "2026-08-07", "2026-07-30", "2026-07-22"];

function buildSimilar(seed: number, caseId: string, surface: SurfaceKind): SimilarCase[] {
  const next = lcg(seed + 977);
  const surfaces: SurfaceKind[] = ["post", "comment", "profile", "listing", "clip"];
  return [0, 1, 2, 3].map((i) => {
    const a = next();
    const b = next();
    const c = next();
    const d = next();
    return {
      key: `${caseId}-s${i}`,
      caseId: `CS-${3100 + Math.round(a * 640)}`,
      surface: i === 0 ? surface : surfaces[Math.round(b * 4)],
      decision: c < 0.5 ? "remove" : c < 0.82 ? "keep" : "escalate",
      similarity: 96 - i * 6 - Math.round(d * 4),
      decidedOn: CASE_DATES[(i + seed) % CASE_DATES.length],
      reviewer: REVIEWERS[(i * 2 + seed) % REVIEWERS.length],
    };
  });
}

/* ------------------------------------------------------------ 축 라벨 */

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  "24h": "24시간",
  "7d": "7일",
  "30d": "30일",
};

const HOUR_TICKS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}시`);
const WEEK_TICKS = ["화", "수", "목", "금", "토", "일", "월"];
const MONTH_TICKS = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(2026, 6, 26 + i);
  return `${day.getMonth() + 1}/${day.getDate()}`;
});

export const PERIOD_TICKS: Record<PeriodKey, string[]> = {
  "24h": HOUR_TICKS,
  "7d": WEEK_TICKS,
  "30d": MONTH_TICKS,
};

/* -------------------------------------------------------------- 시드 */

type Seed = {
  id: string;
  surface: SurfaceKind;
  headline: string;
  excerpt: string;
  authorName: string;
  authorHandle: string;
  severity: Severity;
  slaMinutes: number;
  slaBudget: number;
  queuedLabel: string;
  classifier: number;
  reasons: ReasonSlice[];
  history: HistoryEntry[];
  signals: AccountSignal[];
};

const SEEDS: Seed[] = [
  {
    id: "CS-4821",
    surface: "post",
    headline: "수익 인증 이미지와 외부 결제 링크를 반복 게시",
    excerpt:
      "「3주 만에 원금 회복했습니다. 자리 얼마 안 남았어요 — 아래 링크로 상담 신청하시면 종목 리스트 무료로 드립니다.」 동일 링크가 11개 게시물에 반복 삽입됨.",
    authorName: "한도윤",
    authorHandle: "@doyun_han",
    severity: "high",
    slaMinutes: 18,
    slaBudget: 240,
    queuedLabel: "14분 전 접수",
    classifier: 94,
    reasons: [
      { key: "scam", count: 34 },
      { key: "spam", count: 21 },
      { key: "misinfo", count: 9 },
    ],
    history: [
      { date: "2026-08-11", action: "경고 1회", note: "금융 상품 홍보 가이드 위반" },
      { date: "2026-06-02", action: "콘텐츠 삭제", note: "외부 결제 링크 유도" },
    ],
    signals: [
      { label: "계정 개설", value: "4개월", note: "신규 계정 구간" },
      { label: "30일 신고", value: "81건", note: "동일 유형 73%" },
      { label: "삭제율", value: "38%", note: "게시물 29건 중 11건" },
    ],
  },
  {
    id: "CS-4809",
    surface: "comment",
    headline: "라이브 채팅에서 특정 이용자를 지목한 모욕 발언",
    excerpt:
      "방송 중 동일 대상에게 6분 동안 22개 댓글이 연속 게시됨. 신고자 다수가 대상 본인이 아닌 제3자.",
    authorName: "서가온",
    authorHandle: "@gaon.seo",
    severity: "high",
    slaMinutes: 41,
    slaBudget: 240,
    queuedLabel: "37분 전 접수",
    classifier: 88,
    reasons: [
      { key: "harassment", count: 47 },
      { key: "graphic", count: 6 },
    ],
    history: [{ date: "2026-07-28", action: "댓글 제한 24시간", note: "반복 모욕" }],
    signals: [
      { label: "계정 개설", value: "2년 1개월", note: "장기 이용자" },
      { label: "30일 신고", value: "59건", note: "괴롭힘 92%" },
      { label: "삭제율", value: "12%", note: "댓글 412건 중 49건" },
    ],
  },
  {
    id: "CS-4796",
    surface: "profile",
    headline: "공식 고객센터를 사칭한 프로필 및 DM 발송",
    excerpt:
      "프로필명 「Quorum 고객지원 센터」, 소개글에 본인 확인을 요구하는 외부 폼 주소 기재. 최근 24시간 DM 발송 340건.",
    authorName: "민재하",
    authorHandle: "@jaeha_min",
    severity: "high",
    slaMinutes: 55,
    slaBudget: 240,
    queuedLabel: "1시간 전 접수",
    classifier: 97,
    reasons: [
      { key: "impersonation", count: 38 },
      { key: "scam", count: 17 },
    ],
    history: [
      { date: "2026-08-18", action: "프로필 강제 초기화", note: "브랜드 사칭" },
      { date: "2026-08-03", action: "경고 2회", note: "DM 스팸" },
    ],
    signals: [
      { label: "계정 개설", value: "19일", note: "고위험 신규 구간" },
      { label: "30일 신고", value: "55건", note: "사칭 69%" },
      { label: "삭제율", value: "61%", note: "게시물 18건 중 11건" },
    ],
  },
  {
    id: "CS-4782",
    surface: "listing",
    headline: "중고 거래글에서 선입금을 유도한 정황",
    excerpt:
      "「직거래 불가, 오늘 안에 입금하시면 5만원 더 빼드립니다.」 동일 상품 사진이 다른 계정 3곳에서도 검색됨.",
    authorName: "노은결",
    authorHandle: "@eungyeol",
    severity: "medium",
    slaMinutes: 96,
    slaBudget: 480,
    queuedLabel: "2시간 전 접수",
    classifier: 76,
    reasons: [
      { key: "scam", count: 22 },
      { key: "spam", count: 8 },
    ],
    history: [],
    signals: [
      { label: "계정 개설", value: "11개월", note: "정상 구간" },
      { label: "30일 신고", value: "30건", note: "사기 73%" },
      { label: "삭제율", value: "9%", note: "거래글 44건 중 4건" },
    ],
  },
  {
    id: "CS-4771",
    surface: "clip",
    headline: "짧은 영상 중반부 수위 논란 장면",
    excerpt:
      "0:14~0:21 구간에 대한 신고가 집중됨. 자동 분류기는 경계값(0.58)으로 사람 판단 대기 상태.",
    authorName: "백시하",
    authorHandle: "@siha_baek",
    severity: "medium",
    slaMinutes: 132,
    slaBudget: 480,
    queuedLabel: "3시간 전 접수",
    classifier: 58,
    reasons: [
      { key: "graphic", count: 19 },
      { key: "harassment", count: 5 },
      { key: "misinfo", count: 3 },
    ],
    history: [{ date: "2026-05-09", action: "연령 제한 적용", note: "수위 경계" }],
    signals: [
      { label: "계정 개설", value: "3년 4개월", note: "장기 이용자" },
      { label: "30일 신고", value: "27건", note: "수위 70%" },
      { label: "삭제율", value: "4%", note: "영상 96건 중 4건" },
    ],
  },
  {
    id: "CS-4768",
    surface: "post",
    headline: "검증되지 않은 의약 정보 확산",
    excerpt:
      "출처 없는 통계 이미지와 함께 특정 성분의 효능을 단정. 인용된 기관은 해당 자료 발표 사실을 확인해 주지 않음.",
    authorName: "오태림",
    authorHandle: "@taerim_oh",
    severity: "medium",
    slaMinutes: 148,
    slaBudget: 480,
    queuedLabel: "3시간 전 접수",
    classifier: 71,
    reasons: [
      { key: "misinfo", count: 26 },
      { key: "harassment", count: 4 },
    ],
    history: [{ date: "2026-04-17", action: "정보 라벨 부착", note: "출처 불명 통계" }],
    signals: [
      { label: "계정 개설", value: "5년 2개월", note: "장기 이용자" },
      { label: "30일 신고", value: "30건", note: "허위 정보 87%" },
      { label: "삭제율", value: "6%", note: "게시물 210건 중 13건" },
    ],
  },
  {
    id: "CS-4755",
    surface: "comment",
    headline: "다계정에서 동일 문구를 반복 게시",
    excerpt:
      "9개 계정이 같은 시간대에 동일한 홍보 문구를 게시. 문구 편집 거리 기준 유사도 0.97.",
    authorName: "정하람",
    authorHandle: "@haram.j",
    severity: "low",
    slaMinutes: 210,
    slaBudget: 720,
    queuedLabel: "5시간 전 접수",
    classifier: 91,
    reasons: [
      { key: "spam", count: 31 },
      { key: "scam", count: 2 },
    ],
    history: [{ date: "2026-08-09", action: "속도 제한", note: "군집 게시 탐지" }],
    signals: [
      { label: "계정 개설", value: "1년 7개월", note: "정상 구간" },
      { label: "30일 신고", value: "33건", note: "스팸 94%" },
      { label: "삭제율", value: "22%", note: "댓글 168건 중 37건" },
    ],
  },
  {
    id: "CS-4741",
    surface: "post",
    headline: "타 창작자 일러스트를 출처 없이 게재",
    excerpt: "원작자 계정에서 권리 침해 신고 접수. 워터마크가 잘린 흔적 확인됨.",
    authorName: "윤소민",
    authorHandle: "@somin_yoon",
    severity: "low",
    slaMinutes: 268,
    slaBudget: 720,
    queuedLabel: "6시간 전 접수",
    classifier: 64,
    reasons: [
      { key: "copyright", count: 14 },
      { key: "impersonation", count: 3 },
    ],
    history: [],
    signals: [
      { label: "계정 개설", value: "8개월", note: "정상 구간" },
      { label: "30일 신고", value: "17건", note: "저작권 82%" },
      { label: "삭제율", value: "14%", note: "게시물 58건 중 8건" },
    ],
  },
  {
    id: "CS-4736",
    surface: "profile",
    headline: "자해 암시 문구가 포함된 소개글",
    excerpt:
      "위기 대응 팀 동시 배정 대상. 삭제보다 지원 리소스 안내 흐름이 우선하며, 판단 결과와 무관하게 안내 메시지가 자동 발송된다.",
    authorName: "강별하",
    authorHandle: "@byeolha",
    severity: "high",
    slaMinutes: 26,
    slaBudget: 120,
    queuedLabel: "22분 전 접수",
    classifier: 83,
    reasons: [
      { key: "selfharm", count: 12 },
      { key: "graphic", count: 2 },
    ],
    history: [],
    signals: [
      { label: "계정 개설", value: "1년 0개월", note: "정상 구간" },
      { label: "30일 신고", value: "14건", note: "위기 신호 86%" },
      { label: "삭제율", value: "0%", note: "게시물 31건 중 0건" },
    ],
  },
  {
    id: "CS-4722",
    surface: "clip",
    headline: "게임 방송 중 광고 링크 도배",
    excerpt: "영상 설명란과 고정 댓글에 단축 링크 14개. 링크 도착지는 동일 도메인.",
    authorName: "임채운",
    authorHandle: "@chaewoon_im",
    severity: "low",
    slaMinutes: 310,
    slaBudget: 720,
    queuedLabel: "7시간 전 접수",
    classifier: 79,
    reasons: [
      { key: "spam", count: 18 },
      { key: "scam", count: 4 },
    ],
    history: [{ date: "2026-07-02", action: "링크 차단", note: "단축 도메인 남용" }],
    signals: [
      { label: "계정 개설", value: "2년 9개월", note: "장기 이용자" },
      { label: "30일 신고", value: "22건", note: "스팸 91%" },
      { label: "삭제율", value: "17%", note: "영상 71건 중 12건" },
    ],
  },
];

export const REVIEW_ITEMS: ReviewItem[] = SEEDS.map((seed, index) => {
  const reports = seed.reasons.reduce((sum, slice) => sum + slice.count, 0);
  const base = Math.max(1, Math.round(reports / 14));
  const spread = Math.max(3, Math.round(reports / 3));
  return {
    ...seed,
    authorTint: index % 3,
    reports,
    reasons: [...seed.reasons].sort((a, b) => b.count - a.count),
    series: {
      "24h": series(index + 11, 24, base, spread),
      "7d": series(index + 41, 7, base * 5, spread * 3),
      "30d": series(index + 71, 30, base * 3, spread * 2),
    },
    similar: buildSimilar(index + 3, seed.id, seed.surface),
  };
});

/** 세션 시작 전 오늘 이미 처리된 건수 — 카운터가 0에서 시작하지 않도록. */
export const RESOLVED_BEFORE_SESSION = 138;

/** 오늘 처리량 7일 추이 (스파크라인). */
export const THROUGHPUT_TREND = [122, 148, 131, 176, 159, 144, 138];

export const AVATAR_TINTS = ["bg-violet-600", "bg-zinc-700", "bg-violet-800"];

export const numberFormat = new Intl.NumberFormat("ko-KR");

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}
