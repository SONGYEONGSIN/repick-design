// 결정론적 목업 데이터 — 난수·현재시각 기반 동적 생성 금지(고정 리터럴/산술만 사용).
// 제품: Cadence — 소셜/콘텐츠 발행 스케줄링 SaaS (Buffer/Later급).
// 스냅샷 기준일: 2026-07-15 (수) — 아래 TODAY_ISO 상수로 고정.

export type ChannelId = "instagram" | "x" | "linkedin" | "tiktok" | "youtube";
export type PostStatus = "published" | "scheduled" | "needs_review" | "draft";
export type PostFormat = "image" | "video" | "carousel" | "text";

export interface ChannelInfo {
  id: ChannelId;
  label: string;
  handle: string;
  followers: number;
  /** 7/8 ~ 7/14 일별 도달수(고정 실적). */
  weeklyReach: number[];
  /** 전주 대비 도달 증감률(%). */
  deltaPct: number;
}

export interface Post {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  hour: number;
  minute: number;
  /** "HH:MM" 표기 */
  timeLabel: string;
  channel: ChannelId;
  status: PostStatus;
  format: PostFormat;
  title: string;
  author: string;
  reach: number | null;
  engagementRate: number | null;
  caption: string;
}

export interface DayMeta {
  /** YYYY-MM-DD */
  date: string;
  /** 0=일 .. 6=토 */
  weekday: number;
  dayOfMonth: number;
  month: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const TODAY_ISO = "2026-07-15";
export const TODAY_LABEL = "2026년 7월 15일 (수)";

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

/** 주간 뷰에 노출되는 시간대(08시~20시, 13개 행). */
export const WEEK_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// ── 채널 메타 + 실적 ──────────────────────────────────────────────────
export const CHANNELS: ChannelInfo[] = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@cadence.studio",
    followers: 128_400,
    weeklyReach: [22_400, 24_100, 23_600, 26_800, 29_200, 27_500, 31_200],
    deltaPct: 8.2,
  },
  {
    id: "x",
    label: "X",
    handle: "@cadenceapp",
    followers: 64_200,
    weeklyReach: [9_800, 10_200, 8_800, 11_400, 12_100, 10_600, 11_900],
    deltaPct: 3.1,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Cadence Inc.",
    followers: 41_800,
    weeklyReach: [5_200, 5_600, 5_100, 6_400, 7_200, 6_800, 7_600],
    deltaPct: 11.4,
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@cadence",
    followers: 96_700,
    weeklyReach: [31_200, 33_800, 29_600, 38_400, 42_100, 39_800, 45_200],
    deltaPct: 14.9,
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "Cadence 스튜디오",
    followers: 58_900,
    weeklyReach: [14_200, 15_800, 13_600, 16_900, 18_400, 17_100, 19_800],
    deltaPct: 9.6,
  },
];

export const CHANNEL_ORDER: ChannelId[] = ["instagram", "x", "linkedin", "tiktok", "youtube"];

/** 성과 차트/스파크라인의 일자 라벨 (7/8~7/14). */
export const WEEKLY_REACH_LABELS = ["7/8", "7/9", "7/10", "7/11", "7/12", "7/13", "7/14"];

// ── 게시물 (튜플 형식으로 간결하게 정의 후 매핑) ───────────────────────
type RawPost = [
  id: string,
  date: string,
  hour: number,
  minute: number,
  channel: ChannelId,
  status: PostStatus,
  format: PostFormat,
  title: string,
  author: string,
  reach: number | null,
  engagementRate: number | null,
  caption: string,
];

const RAW_POSTS: RawPost[] = [
  ["cd-001", "2026-06-29", 10, 0, "instagram", "published", "image", "여름 신상 룩북 카드뉴스", "노유진", 18_420, 4.8, "7월 신상 라인업을 미리 만나보세요. 스와이프로 전체 룩 확인."],
  ["cd-002", "2026-07-01", 14, 30, "tiktok", "published", "video", "매장 비하인드 브이로그", "서준혁", 52_300, 7.1, "오프닝 준비 과정을 15초로 압축했어요."],
  ["cd-003", "2026-07-03", 9, 0, "linkedin", "published", "text", "2분기 브랜드 성장 회고", "백하은", 6_100, 3.2, "지난 분기 팀이 배운 세 가지 교훈을 정리했습니다."],
  ["cd-004", "2026-07-03", 18, 0, "youtube", "published", "video", "제품 언박싱 풀버전", "민재호", 24_700, 5.4, "구독자 요청으로 제작한 15분 풀 언박싱 영상."],
  ["cd-005", "2026-07-05", 11, 0, "x", "published", "text", "주간 팁 스레드 — 소재 기획", "강도윤", 8_300, 2.9, "콘텐츠 소재가 마르지 않는 법, 3개 스레드로 정리."],
  ["cd-006", "2026-07-06", 13, 0, "instagram", "published", "carousel", "고객 후기 캐러셀", "윤아름", 15_600, 6.2, "이번 주 가장 많이 태그된 후기 5개를 모았습니다."],
  ["cd-007", "2026-07-08", 9, 30, "instagram", "published", "video", "릴스 챌린지 참여 영상", "노유진", 41_200, 8.9, "이번 주 챌린지 해시태그로 도전한 팀 비하인드."],
  ["cd-008", "2026-07-08", 12, 0, "tiktok", "published", "video", "1분 트렌드 챌린지 리믹스", "서준혁", 68_900, 9.4, "인기 사운드에 맞춰 제품을 소개했어요."],
  ["cd-009", "2026-07-08", 15, 0, "linkedin", "published", "image", "팀 컬처 스냅샷", "백하은", 4_900, 2.6, "새로 합류한 팀원들과의 첫 스프린트 회고."],
  ["cd-010", "2026-07-08", 17, 30, "x", "published", "text", "실시간 Q&A 하이라이트", "강도윤", 7_200, 3.5, "어제 진행한 라이브 Q&A에서 나온 질문 모음."],
  ["cd-011", "2026-07-09", 10, 0, "youtube", "published", "video", "제작 과정 타임랩스", "민재호", 19_800, 5.0, "샘플 제작부터 완성까지 8시간을 2분으로."],
  ["cd-012", "2026-07-10", 9, 0, "instagram", "published", "carousel", "이달의 베스트셀러 TOP5", "윤아름", 22_100, 6.7, "이번 달 가장 많이 재구매된 상품을 소개합니다."],
  ["cd-013", "2026-07-10", 16, 30, "tiktok", "published", "video", "고객 리액션 모음", "서준혁", 37_600, 7.8, "언박싱 리액션 중 가장 웃겼던 순간들."],
  ["cd-014", "2026-07-12", 11, 0, "linkedin", "published", "text", "채용 공고 — 콘텐츠 매니저", "백하은", 3_800, 1.9, "콘텐츠 팀에 합류할 새 동료를 찾습니다."],
  ["cd-015", "2026-07-13", 14, 0, "x", "published", "text", "고객센터 응답시간 개선 안내", "강도윤", 5_600, 2.1, "평균 응답시간을 40% 단축했습니다."],
  ["cd-016", "2026-07-14", 10, 30, "instagram", "published", "image", "여름 캠페인 티저", "노유진", 26_300, 6.9, "내일 공개될 캠페인의 첫 번째 힌트."],
  ["cd-017", "2026-07-14", 19, 0, "youtube", "published", "video", "브랜드 스토리 다큐멘터리", "민재호", 15_400, 4.3, "창업 3년의 여정을 담은 미니 다큐."],
  ["cd-018", "2026-07-15", 9, 0, "instagram", "scheduled", "video", "여름 캠페인 런칭 릴스", "노유진", null, null, "오늘 오전 9시, 캠페인이 공개됩니다."],
  ["cd-019", "2026-07-15", 11, 30, "tiktok", "scheduled", "video", "캠페인 챌린지 안무 영상", "서준혁", null, null, "챌린지 참여 방법을 15초로 안내."],
  ["cd-020", "2026-07-15", 13, 0, "linkedin", "needs_review", "text", "캠페인 파트너십 발표문", "백하은", null, null, "검토 대기 — 파트너사 로고 사용 승인 필요."],
  ["cd-021", "2026-07-15", 16, 0, "x", "scheduled", "text", "캠페인 실시간 진행 스레드", "강도윤", null, null, "오늘 하루 캠페인 반응을 실시간으로 정리합니다."],
  ["cd-022", "2026-07-15", 19, 0, "youtube", "scheduled", "video", "캠페인 메이킹 필름", "민재호", null, null, "런칭 준비 과정을 담은 비하인드 영상."],
  ["cd-023", "2026-07-16", 10, 0, "instagram", "scheduled", "carousel", "캠페인 후기 1탄", "윤아름", null, null, "런칭 첫날 반응을 캐러셀로 정리."],
  ["cd-024", "2026-07-17", 13, 30, "tiktok", "scheduled", "video", "캠페인 인기 사운드 리믹스", "서준혁", null, null, "가장 많이 쓰인 사운드로 만든 하이라이트."],
  ["cd-025", "2026-07-17", 15, 0, "linkedin", "needs_review", "image", "캠페인 성과 미리보기", "백하은", null, null, "검토 대기 — 수치 최종 확인 필요."],
  ["cd-026", "2026-07-18", 17, 0, "youtube", "scheduled", "video", "크리에이터 협업 티저", "민재호", null, null, "다음 주 공개될 협업 영상 예고."],
  ["cd-027", "2026-07-20", 9, 30, "x", "scheduled", "text", "주간 요약 스레드", "강도윤", null, null, "지난주 캠페인 핵심 지표 3가지."],
  ["cd-028", "2026-07-21", 11, 0, "instagram", "scheduled", "image", "고객 스토리 하이라이트", "노유진", null, null, "캠페인에 참여한 고객 스토리를 모았습니다."],
  ["cd-029", "2026-07-22", 14, 0, "tiktok", "scheduled", "video", "메이킹 오브 챌린지", "서준혁", null, null, "챌린지 우승작 제작 비하인드."],
  ["cd-030", "2026-07-22", 18, 30, "youtube", "draft", "video", "월간 다이제스트 편집본", "민재호", null, null, "초안 — 컷 편집 진행 중, 자막 미완성."],
  ["cd-031", "2026-07-24", 10, 0, "linkedin", "scheduled", "text", "파트너십 확장 소식", "백하은", null, null, "이번 분기 신규 파트너 3곳을 소개합니다."],
  ["cd-032", "2026-07-26", 12, 0, "instagram", "scheduled", "carousel", "이주의 베스트 후기", "윤아름", null, null, "가장 많이 공유된 고객 후기를 모았습니다."],
  ["cd-033", "2026-07-27", 15, 30, "x", "scheduled", "text", "제품 로드맵 업데이트", "강도윤", null, null, "다음 분기 출시 예정 기능을 공유합니다."],
  ["cd-034", "2026-07-29", 11, 0, "tiktok", "scheduled", "video", "여름 시즌 마무리 챌린지", "서준혁", null, null, "시즌 캠페인을 마무리하는 챌린지 영상."],
  ["cd-035", "2026-07-30", 16, 0, "youtube", "needs_review", "video", "시즌 하이라이트 리캡", "민재호", null, null, "검토 대기 — 음악 라이선스 확인 필요."],
  ["cd-036", "2026-07-31", 9, 0, "instagram", "scheduled", "image", "8월 프리뷰 티저", "노유진", null, null, "다음 달 콘텐츠 캘린더를 살짝 공개합니다."],
  ["cd-037", "2026-07-31", 13, 0, "linkedin", "draft", "text", "채용 공고 초안 — 그로스 매니저", "백하은", null, null, "초안 — 직무 설명 검토 필요."],
  ["cd-038", "2026-08-01", 10, 30, "tiktok", "scheduled", "video", "8월 첫 챌린지 예고", "서준혁", null, null, "새로운 챌린지 포맷을 처음 공개합니다."],
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export const POSTS: Post[] = RAW_POSTS.map((raw) => {
  const [id, date, hour, minute, channel, status, format, title, author, reach, engagementRate, caption] = raw;
  return { id, date, hour, minute, timeLabel: `${pad2(hour)}:${pad2(minute)}`, channel, status, format, title, author, reach, engagementRate, caption };
});

// ── 달력 날짜 그리드 (2026-06-28 ~ 2026-08-01, 5주 = 35일) ─────────────
const MONTH_DAYS_2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function addDays(year: number, month: number, day: number, deltaDays: number): { y: number; m: number; d: number } {
  let y = year;
  let m = month;
  let d = day + deltaDays;
  while (d > MONTH_DAYS_2026[m - 1]) {
    d -= MONTH_DAYS_2026[m - 1];
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  while (d < 1) {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    d += MONTH_DAYS_2026[m - 1];
  }
  return { y, m, d };
}

export const CALENDAR_DAYS: DayMeta[] = Array.from({ length: 35 }, (_, i) => {
  const { y, m, d } = addDays(2026, 6, 28, i);
  const date = `${y}-${pad2(m)}-${pad2(d)}`;
  return {
    date,
    weekday: i % 7,
    dayOfMonth: d,
    month: m,
    isCurrentMonth: m === 7,
    isToday: date === TODAY_ISO,
  };
});

/** 5주 단위 청크. 주 단위 뷰 탐색(이전/다음)에 사용. */
export const CALENDAR_WEEKS: DayMeta[][] = Array.from({ length: 5 }, (_, w) => CALENDAR_DAYS.slice(w * 7, w * 7 + 7));

/** 오늘(7/15)이 포함된 주 인덱스. */
export const DEFAULT_WEEK_INDEX = CALENDAR_WEEKS.findIndex((week) => week.some((d) => d.isToday));

export function weekRangeLabel(week: DayMeta[]): string {
  const first = week[0];
  const last = week[6];
  return `${first.month}/${first.dayOfMonth} – ${last.month}/${last.dayOfMonth}`;
}
