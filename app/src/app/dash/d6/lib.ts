// 결 (GYEOL) — 감정·관계 저널 대시보드
// 순수 유틸/더미데이터. 서버·클라이언트 양쪽에서 import 가능 (React 컴포넌트 없음).

export type MoodKey = "joy" | "calm" | "tender" | "heavy";

export interface MoodMeta {
  key: MoodKey;
  label: string;
  description: string;
  tint: string;
  text: string;
  solid: string;
}

// 파스텔 틴트(배경) + 진한 텍스트(전경, AA 4.5:1+) + 중간톤 solid(장식용 SVG 전용, 텍스트 금지)
export const MOODS: Record<MoodKey, MoodMeta> = {
  joy: {
    key: "joy",
    label: "설렘",
    description: "가볍고 들뜬 하루",
    tint: "#F6E8C4",
    text: "#7A5A12",
    solid: "#D9A63B",
  },
  calm: {
    key: "calm",
    label: "잔잔함",
    description: "평온하고 고요한 하루",
    tint: "#E2EAD9",
    text: "#3E5B37",
    solid: "#7FA06E",
  },
  tender: {
    key: "tender",
    label: "다정함",
    description: "마음이 따뜻해진 하루",
    tint: "#F5E1E1",
    text: "#8A3A42",
    solid: "#CE7B82",
  },
  heavy: {
    key: "heavy",
    label: "먹먹함",
    description: "무겁고 가라앉은 하루",
    tint: "#E9E1EC",
    text: "#5A3A66",
    solid: "#8C6699",
  },
};

export const MOOD_ORDER: MoodKey[] = ["calm", "tender", "joy", "heavy"];

// ---- 시드 고정 PRNG (mulberry32) — 매 요청 동일한 더미 데이터 재현 ----
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DayMood {
  index: number;
  mood: MoodKey;
  intensity: number; // 0.55 ~ 1 — 점 크기 변주용
}

/** 90일치 결정론적 무드 데이터 생성 (가중치: 잔잔함 > 다정함 > 설렘 > 먹먹함) */
export function generateMoodDays(count: number): DayMood[] {
  const rand = mulberry32(19870611);
  const weighted: { mood: MoodKey; w: number }[] = [
    { mood: "calm", w: 0.34 },
    { mood: "tender", w: 0.26 },
    { mood: "joy", w: 0.22 },
    { mood: "heavy", w: 0.18 },
  ];
  const days: DayMood[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    let acc = 0;
    let picked: MoodKey = "calm";
    for (const w of weighted) {
      acc += w.w;
      if (r <= acc) {
        picked = w.mood;
        break;
      }
    }
    days.push({ index: i, mood: picked, intensity: 0.55 + rand() * 0.45 });
  }
  return days;
}

export interface SpiralPoint extends DayMood {
  x: number;
  y: number;
  r: number;
}

/**
 * 해바라기 씨앗 배열(phyllotaxis) 방식으로 날짜를 배치한다.
 * 표준 막대/선 그래프 대신, 유기적으로 피어나는 점 패턴으로 한 달의 결을 시각화.
 */
export function layoutSpiral(days: DayMood[], viewBox: number): SpiralPoint[] {
  const golden = 137.50776;
  const cx = viewBox / 2;
  const cy = viewBox / 2;
  const maxR = viewBox / 2 - viewBox * 0.07;
  const c = maxR / Math.sqrt(days.length || 1);
  const baseDot = days.length <= 10 ? 7 : days.length <= 34 ? 5 : 3.1;
  return days.map((d, i) => {
    const angle = i * golden * (Math.PI / 180);
    const radius = c * Math.sqrt(i + 0.5);
    return {
      ...d,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      r: baseDot * (0.72 + d.intensity * 0.4),
    };
  });
}

export function summarizeMoods(days: DayMood[]) {
  const counts: Record<MoodKey, number> = { joy: 0, calm: 0, tender: 0, heavy: 0 };
  for (const d of days) counts[d.mood]++;
  const total = days.length || 1;
  const dominant = MOOD_ORDER.reduce((best, key) =>
    counts[key] > counts[best] ? key : best,
  "calm" as MoodKey);
  return {
    counts,
    total,
    dominant,
    percents: MOOD_ORDER.map((key) => ({
      key,
      pct: Math.round((counts[key] / total) * 100),
    })),
  };
}

// ---- 관계 온도 ----
export type Trend = "up" | "down" | "flat";

export interface Relationship {
  id: string;
  name: string;
  relation: string;
  warmth: number; // 0-100
  trend: Trend;
  delta: string;
  lastContact: string;
  note: string;
  avatarHue: MoodKey;
}

export const RELATIONSHIPS: Relationship[] = [
  {
    id: "seoyeon",
    name: "서연",
    relation: "친구",
    warmth: 82,
    trend: "up",
    delta: "+5",
    lastContact: "2일 전",
    note: "이번 주에 오랜만에 소리 내 웃었어요.",
    avatarHue: "tender",
  },
  {
    id: "minjun",
    name: "민준",
    relation: "가족",
    warmth: 91,
    trend: "flat",
    delta: "±0",
    lastContact: "어제",
    note: "매일 아침 안부를 묻는 사이예요.",
    avatarHue: "calm",
  },
  {
    id: "jiho",
    name: "지호",
    relation: "동료",
    warmth: 47,
    trend: "down",
    delta: "-9",
    lastContact: "3주 전",
    note: "요즘 대화가 부쩍 짧아졌어요.",
    avatarHue: "heavy",
  },
  {
    id: "haeun",
    name: "하은",
    relation: "연인",
    warmth: 88,
    trend: "up",
    delta: "+3",
    lastContact: "오늘",
    note: "작은 다정함이 계속 쌓이고 있어요.",
    avatarHue: "tender",
  },
  {
    id: "taeyun",
    name: "태윤",
    relation: "친구",
    warmth: 33,
    trend: "down",
    delta: "-14",
    lastContact: "두 달 전",
    note: "먼저 연락해볼까 고민 중이에요.",
    avatarHue: "heavy",
  },
  {
    id: "sua",
    name: "수아",
    relation: "동료",
    warmth: 65,
    trend: "up",
    delta: "+2",
    lastContact: "5일 전",
    note: "미뤄뒀던 점심 약속을 다시 잡았어요.",
    avatarHue: "joy",
  },
];

// ---- 최근 기록 ----
export interface JournalEntry {
  id: string;
  dateLabel: string;
  mood: MoodKey;
  title: string;
  excerpt: string;
  tag?: string;
}

const TODAY = new Date("2026-07-11T09:00:00+09:00");
const fmt = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });

export const TODAY_LABEL = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(TODAY);

function dateLabel(daysAgo: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysAgo);
  return fmt.format(d);
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j1",
    dateLabel: dateLabel(1),
    mood: "calm",
    title: "비 오는 창가에서",
    excerpt: "빗소리를 들으며 아무 생각 없이 커피를 마셨다. 오랜만에 마음이 잔잔했다.",
  },
  {
    id: "j2",
    dateLabel: dateLabel(2),
    mood: "tender",
    title: "엄마와의 통화",
    excerpt: "별일 아닌 이야기를 30분 넘게 했다. 끊고 나니 괜히 웃음이 났다.",
    tag: "민준",
  },
  {
    id: "j3",
    dateLabel: dateLabel(4),
    mood: "heavy",
    title: "회의실에서",
    excerpt: "말하지 못한 서운함이 하루 종일 목에 걸려 있었다.",
    tag: "지호",
  },
  {
    id: "j4",
    dateLabel: dateLabel(6),
    mood: "joy",
    title: "지호의 생일",
    excerpt: "오랜만에 다 같이 모여 웃었다. 이런 순간들이 쌓여 결이 된다.",
  },
  {
    id: "j5",
    dateLabel: dateLabel(8),
    mood: "calm",
    title: "혼자 걷는 저녁",
    excerpt: "특별한 일 없이 걸었는데 마음이 정리됐다.",
  },
];

// ---- 인사이트 ----
export const INSIGHTS: string[] = [
  "저녁 8시 이후 기록에서 '다정함'이 평소보다 3배 더 자주 나타나요.",
  "지호님과의 온도가 3주 연속 낮아지고 있어요. 짧은 안부라도 먼저 건네볼까요?",
  "이번 달 가장 많이 핀 결은 잔잔함이에요 — 지난달보다 마음이 차분해졌어요.",
];

export const WEEKLY_RHYTHM = [
  { day: "월", value: 2 },
  { day: "화", value: 1 },
  { day: "수", value: 3 },
  { day: "목", value: 2 },
  { day: "금", value: 4 },
  { day: "토", value: 1 },
  { day: "일", value: 3 },
];

// ---- 헤더 스탯 ----
export const HEADER_STATS = {
  entriesThisMonth: 18,
  avgWarmth: Math.round(
    RELATIONSHIPS.reduce((sum, r) => sum + r.warmth, 0) / RELATIONSHIPS.length,
  ),
  streakDays: 5,
};

// ---- 관계 온도 아크 게이지 경로 ----
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** 180°(왼쪽) → 360°(오른쪽), 위쪽으로 열리는 반원 게이지 경로 */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function warmthArcPath(cx: number, cy: number, r: number, value: number): string {
  const end = 180 + (Math.max(0, Math.min(100, value)) / 100) * 180;
  return describeArc(cx, cy, r, 180, end);
}

export const WARMTH_TRACK = (cx: number, cy: number, r: number) =>
  describeArc(cx, cy, r, 180, 360);
