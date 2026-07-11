// 결정론적 더미 데이터 — Math.random / Date.now 사용 금지.
// 앵커: 2026-01-12(월) "오늘" 기준으로 고정.

export type Period = "today" | "week" | "month";

export type EventTypeId = "discovery" | "demo" | "onboarding" | "office-hours";

export type MeetingStatus = "confirmed" | "pending" | "rescheduled";

export type MeetingLocation = "video" | "phone" | "in_person";

export type MemberStatus = "available" | "in_meeting" | "offline";

export const TODAY = new Date(2026, 0, 12); // 2026-01-12, 월요일

export const PERIOD_LABEL: Record<Period, string> = {
  today: "오늘",
  week: "이번주",
  month: "이번달",
};

// ── 이벤트 타입 ─────────────────────────────────────────────

interface EventTypeDef {
  id: EventTypeId;
  name: string;
  durationMin: number;
  accent: "indigo" | "blue" | "emerald" | "amber";
  counts: Record<Period, number>;
  conversionRate: number; // %
  heatWeight: number; // 히트맵 상대 밀도 가중치
}

export const EVENT_TYPES: EventTypeDef[] = [
  {
    id: "discovery",
    name: "디스커버리 콜",
    durationMin: 30,
    accent: "indigo",
    counts: { today: 6, week: 42, month: 168 },
    conversionRate: 38.4,
    heatWeight: 1.0,
  },
  {
    id: "demo",
    name: "제품 데모",
    durationMin: 45,
    accent: "blue",
    counts: { today: 4, week: 27, month: 109 },
    conversionRate: 52.1,
    heatWeight: 0.65,
  },
  {
    id: "onboarding",
    name: "온보딩 세션",
    durationMin: 60,
    accent: "emerald",
    counts: { today: 2, week: 15, month: 61 },
    conversionRate: 71.6,
    heatWeight: 0.35,
  },
  {
    id: "office-hours",
    name: "오피스 아워",
    durationMin: 20,
    accent: "amber",
    counts: { today: 1, week: 8, month: 34 },
    conversionRate: 24.9,
    heatWeight: 0.2,
  },
];

export const ACCENT_CLASSES: Record<
  EventTypeDef["accent"],
  { dot: string; text: string; bg: string; ring: string; bar: string }
> = {
  indigo: {
    dot: "bg-indigo-500",
    text: "text-indigo-700",
    bg: "bg-indigo-50",
    ring: "ring-indigo-200",
    bar: "bg-indigo-500",
  },
  blue: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    bar: "bg-blue-500",
  },
  emerald: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    bar: "bg-emerald-500",
  },
  amber: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    bar: "bg-amber-500",
  },
};

function totalForPeriod(period: Period): number {
  return EVENT_TYPES.reduce((sum, t) => sum + t.counts[period], 0);
}

function weightedConversion(period: Period): number {
  const total = totalForPeriod(period);
  const weighted = EVENT_TYPES.reduce(
    (sum, t) => sum + t.counts[period] * t.conversionRate,
    0,
  );
  return Math.round((weighted / total) * 10) / 10;
}

// ── KPI ─────────────────────────────────────────────────────

export interface PeriodKpi {
  meetingsTotal: number;
  meetingsDeltaPct: number; // 전 기간 대비 %p 아닌 증감률(%)
  conversionRate: number;
  conversionDeltaPt: number; // %p
  noShowRate: number;
  noShowDeltaPt: number; // %p
}

export const PERIOD_KPI: Record<Period, PeriodKpi> = {
  today: {
    meetingsTotal: totalForPeriod("today"),
    meetingsDeltaPct: 8.3,
    conversionRate: weightedConversion("today"),
    conversionDeltaPt: 1.2,
    noShowRate: 3.8,
    noShowDeltaPt: -0.6,
  },
  week: {
    meetingsTotal: totalForPeriod("week"),
    meetingsDeltaPct: 12.4,
    conversionRate: weightedConversion("week"),
    conversionDeltaPt: -0.8,
    noShowRate: 5.4,
    noShowDeltaPt: 0.3,
  },
  month: {
    meetingsTotal: totalForPeriod("month"),
    meetingsDeltaPct: 6.7,
    conversionRate: weightedConversion("month"),
    conversionDeltaPt: 2.1,
    noShowRate: 6.2,
    noShowDeltaPt: -0.4,
  },
};

// 어제 대비(오늘 미팅) / 지난주 대비(이번주 미팅) — 항상 노출되는 고정 카드용
export const YESTERDAY_MEETINGS = 12;
export const LAST_WEEK_MEETINGS = 82;

// ── 예약 추이 (최근 30일) ────────────────────────────────────

export interface TrendPoint {
  dateISO: string;
  label: string; // "1/12" 형태
  bookings: number;
  conversionRate: number;
}

const WEEKDAY_FACTOR = [0.42, 1.0, 1.08, 1.1, 1.05, 0.95, 0.5]; // 일~토

function buildTrend(days: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    const idxFromOldest = days - 1 - i;
    const base = 9 + idxFromOldest * 0.15;
    const bookings = Math.round(base * WEEKDAY_FACTOR[weekday]);
    const conversionRate =
      Math.round((41 + (weekday % 4) * 2.1 + idxFromOldest * 0.05) * 10) / 10;
    points.push({
      dateISO: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      bookings,
      conversionRate,
    });
  }
  return points;
}

export const TREND_30D = buildTrend(30);

export function trendForPeriod(period: Period): TrendPoint[] {
  if (period === "today") return TREND_30D.slice(-7);
  if (period === "week") return TREND_30D.slice(-14);
  return TREND_30D;
}

// ── 주간 캘린더 히트맵 ────────────────────────────────────────

export const HEAT_DAYS = ["월", "화", "수", "목", "금"];
export const HEAT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

const HEAT_DAY_WEIGHT = [1.0, 0.95, 1.05, 0.9, 0.65];
const HEAT_HOUR_WEIGHT = [0.3, 0.6, 0.9, 1.0, 0.45, 0.7, 1.0, 0.85, 0.4];
const HEAT_BASE = 8;

export function heatValue(
  dayIdx: number,
  hourIdx: number,
  eventTypeId: EventTypeId | "all",
): number {
  const multiplier =
    eventTypeId === "all"
      ? EVENT_TYPES.reduce((s, t) => s + t.heatWeight, 0)
      : (EVENT_TYPES.find((t) => t.id === eventTypeId)?.heatWeight ?? 1);
  return Math.round(
    HEAT_BASE * HEAT_DAY_WEIGHT[dayIdx] * HEAT_HOUR_WEIGHT[hourIdx] * multiplier,
  );
}

export function heatMax(eventTypeId: EventTypeId | "all"): number {
  let max = 0;
  for (let d = 0; d < HEAT_DAYS.length; d++) {
    for (let h = 0; h < HEAT_HOURS.length; h++) {
      max = Math.max(max, heatValue(d, h, eventTypeId));
    }
  }
  return max;
}

// ── 팀원 가용성 ────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  status: MemberStatus;
  bookedToday: number;
  capacityToday: number;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "이서연",
    role: "고객 성공 리드",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces",
    status: "available",
    bookedToday: 4,
    capacityToday: 6,
  },
  {
    id: "tm-2",
    name: "조민준",
    role: "세일즈 AE",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
    status: "in_meeting",
    bookedToday: 6,
    capacityToday: 6,
  },
  {
    id: "tm-3",
    name: "박민지",
    role: "온보딩 스페셜리스트",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces",
    status: "available",
    bookedToday: 2,
    capacityToday: 5,
  },
  {
    id: "tm-4",
    name: "김도윤",
    role: "지원 엔지니어",
    avatarUrl:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=96&h=96&fit=crop&crop=faces",
    status: "offline",
    bookedToday: 0,
    capacityToday: 4,
  },
  {
    id: "tm-5",
    name: "윤하은",
    role: "솔루션 컨설턴트",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=96&h=96&fit=crop&crop=faces",
    status: "available",
    bookedToday: 3,
    capacityToday: 7,
  },
];

export const MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  available: "예약 가능",
  in_meeting: "미팅 중",
  offline: "오프라인",
};

// ── 다가오는 미팅 리스트 ──────────────────────────────────────

export interface UpcomingMeeting {
  id: string;
  guestName: string;
  guestEmail: string;
  eventTypeId: EventTypeId;
  dateISO: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  status: MeetingStatus;
  location: MeetingLocation;
  hostId: string;
}

function iso(offsetDays: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  {
    id: "mt-01",
    guestName: "정하늘",
    guestEmail: "haneul.jung@northfield.io",
    eventTypeId: "discovery",
    dateISO: iso(0),
    time: "10:00",
    durationMin: 30,
    status: "confirmed",
    location: "video",
    hostId: "tm-1",
  },
  {
    id: "mt-02",
    guestName: "Liam Carter",
    guestEmail: "liam.carter@brightloop.co",
    eventTypeId: "demo",
    dateISO: iso(0),
    time: "13:30",
    durationMin: 45,
    status: "confirmed",
    location: "video",
    hostId: "tm-2",
  },
  {
    id: "mt-03",
    guestName: "한지우",
    guestEmail: "jiwoo.han@varda.kr",
    eventTypeId: "office-hours",
    dateISO: iso(0),
    time: "16:00",
    durationMin: 20,
    status: "pending",
    location: "phone",
    hostId: "tm-5",
  },
  {
    id: "mt-04",
    guestName: "오세훈",
    guestEmail: "sehoon.oh@fluxpay.com",
    eventTypeId: "onboarding",
    dateISO: iso(1),
    time: "09:30",
    durationMin: 60,
    status: "confirmed",
    location: "video",
    hostId: "tm-3",
  },
  {
    id: "mt-05",
    guestName: "Nora Bianchi",
    guestEmail: "nora.b@lumenworks.eu",
    eventTypeId: "discovery",
    dateISO: iso(1),
    time: "11:00",
    durationMin: 30,
    status: "confirmed",
    location: "video",
    hostId: "tm-1",
  },
  {
    id: "mt-06",
    guestName: "배수아",
    guestEmail: "sua.bae@granitehq.kr",
    eventTypeId: "demo",
    dateISO: iso(2),
    time: "14:00",
    durationMin: 45,
    status: "rescheduled",
    location: "video",
    hostId: "tm-2",
  },
  {
    id: "mt-07",
    guestName: "Marcus Webb",
    guestEmail: "marcus.webb@ionicdata.com",
    eventTypeId: "discovery",
    dateISO: iso(2),
    time: "15:30",
    durationMin: 30,
    status: "confirmed",
    location: "phone",
    hostId: "tm-5",
  },
  {
    id: "mt-08",
    guestName: "신동혁",
    guestEmail: "donghyuk.shin@cobaltway.io",
    eventTypeId: "onboarding",
    dateISO: iso(3),
    time: "10:30",
    durationMin: 60,
    status: "confirmed",
    location: "video",
    hostId: "tm-3",
  },
  {
    id: "mt-09",
    guestName: "Priya Nair",
    guestEmail: "priya.nair@sablecloud.io",
    eventTypeId: "demo",
    dateISO: iso(4),
    time: "09:00",
    durationMin: 45,
    status: "confirmed",
    location: "video",
    hostId: "tm-2",
  },
  {
    id: "mt-10",
    guestName: "황유진",
    guestEmail: "yujin.hwang@paperloom.kr",
    eventTypeId: "office-hours",
    dateISO: iso(4),
    time: "17:00",
    durationMin: 20,
    status: "pending",
    location: "video",
    hostId: "tm-5",
  },
  {
    id: "mt-11",
    guestName: "Tobias Reyes",
    guestEmail: "tobias.reyes@haltwork.com",
    eventTypeId: "discovery",
    dateISO: iso(7),
    time: "13:00",
    durationMin: 30,
    status: "confirmed",
    location: "video",
    hostId: "tm-1",
  },
  {
    id: "mt-12",
    guestName: "문가은",
    guestEmail: "gaeun.moon@driftline.kr",
    eventTypeId: "onboarding",
    dateISO: iso(8),
    time: "11:30",
    durationMin: 60,
    status: "confirmed",
    location: "in_person",
    hostId: "tm-3",
  },
  {
    id: "mt-13",
    guestName: "Elena Frost",
    guestEmail: "elena.frost@northfield.io",
    eventTypeId: "demo",
    dateISO: iso(11),
    time: "16:30",
    durationMin: 45,
    status: "confirmed",
    location: "video",
    hostId: "tm-2",
  },
  {
    id: "mt-14",
    guestName: "장민수",
    guestEmail: "minsu.jang@varda.kr",
    eventTypeId: "discovery",
    dateISO: iso(15),
    time: "10:00",
    durationMin: 30,
    status: "confirmed",
    location: "phone",
    hostId: "tm-1",
  },
  {
    id: "mt-15",
    guestName: "Sofia Alvarez",
    guestEmail: "sofia.alvarez@brightloop.co",
    eventTypeId: "office-hours",
    dateISO: iso(18),
    time: "15:00",
    durationMin: 20,
    status: "confirmed",
    location: "video",
    hostId: "tm-5",
  },
  {
    id: "mt-16",
    guestName: "조은서",
    guestEmail: "eunseo.jo@fluxpay.com",
    eventTypeId: "onboarding",
    dateISO: iso(23),
    time: "09:30",
    durationMin: 60,
    status: "confirmed",
    location: "video",
    hostId: "tm-3",
  },
];

export const STATUS_LABEL: Record<MeetingStatus, string> = {
  confirmed: "확정",
  pending: "대기",
  rescheduled: "일정 변경",
};

export const LOCATION_LABEL: Record<MeetingLocation, string> = {
  video: "화상 회의",
  phone: "전화",
  in_person: "대면",
};

// ── 포맷터 ────────────────────────────────────────────────

const numberFormatter = new Intl.NumberFormat("ko-KR");
const percentFormatter = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

export function formatNumber(n: number): string {
  return numberFormatter.format(n);
}

export function formatPercent(n: number): string {
  return `${percentFormatter.format(n)}%`;
}

export function formatSignedPercent(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${percentFormatter.format(n)}%`;
}

export function formatSignedPoint(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${percentFormatter.format(n)}%p`;
}

export function formatDateLong(dateISO: string): string {
  return dateFormatter.format(new Date(`${dateISO}T00:00:00`));
}

export function eventTypeById(id: EventTypeId): EventTypeDef {
  const found = EVENT_TYPES.find((t) => t.id === id);
  if (!found) throw new Error(`unknown event type: ${id}`);
  return found;
}

export function memberById(id: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}
