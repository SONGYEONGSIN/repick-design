// Hopline — deterministic dashboard data.
// No Math.random / Date.now / new Date(). Every figure below is a fixed constant
// or a pure derivation of one, so server and client render identically.

export type Lang = "ko" | "en";
export type PeriodId = "7d" | "28d" | "90d";

export const PERIOD_IDS: PeriodId[] = ["7d", "28d", "90d"];

export const REPORT_STAMP = "2026-08-12 09:40";

export const nf = new Intl.NumberFormat("en-US");

export function fmtInt(n: number): string {
  return nf.format(Math.round(n));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtDelta(n: number, digits = 1): string {
  return `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(digits)}%`;
}

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

/* ------------------------------------------------------------------ */
/* 2. Reading band — total clicks per period                           */
/* ------------------------------------------------------------------ */

export type Period = {
  id: PeriodId;
  labels: string[];
  values: number[];
  total: number;
  deltaPct: number;
  unique: number;
  uniqueDeltaPct: number;
  brokenClicks: number;
  brokenDeltaPct: number;
  activeLinks: number;
  activeDelta: number;
};

type RawPeriod = Omit<Period, "id" | "total">;

const RAW_7D: RawPeriod = {
  labels: ["08/06", "08/07", "08/08", "08/09", "08/10", "08/11", "08/12"],
  values: [6120, 6740, 7010, 6480, 7320, 7860, 6680],
  deltaPct: 18.4,
  unique: 34920,
  uniqueDeltaPct: 14.2,
  brokenClicks: 1498,
  brokenDeltaPct: 212.6,
  activeLinks: 45,
  activeDelta: 3,
};

const RAW_28D: RawPeriod = {
  labels: [
    "07/16",
    "07/18",
    "07/20",
    "07/22",
    "07/24",
    "07/26",
    "07/28",
    "07/30",
    "08/01",
    "08/03",
    "08/05",
    "08/07",
    "08/09",
    "08/11",
  ],
  values: [
    11800, 12400, 12050, 13200, 12760, 11940, 12580, 13410, 12890, 13720, 12330,
    13060, 12470, 12330,
  ],
  deltaPct: 9.2,
  unique: 128640,
  uniqueDeltaPct: 7.8,
  brokenClicks: 2140,
  brokenDeltaPct: 96.4,
  activeLinks: 45,
  activeDelta: 6,
};

const RAW_90D: RawPeriod = {
  labels: [
    "05/15",
    "05/21",
    "05/27",
    "06/02",
    "06/08",
    "06/14",
    "06/20",
    "06/26",
    "07/02",
    "07/08",
    "07/14",
    "07/20",
    "07/26",
    "08/01",
    "08/07",
  ],
  values: [
    33200, 34100, 33650, 35200, 34800, 33900, 34500, 35600, 34200, 33700, 34900,
    35100, 34300, 33850, 34100,
  ],
  deltaPct: -3.6,
  unique: 372410,
  uniqueDeltaPct: -1.9,
  brokenClicks: 3960,
  brokenDeltaPct: 41.2,
  activeLinks: 45,
  activeDelta: 11,
};

function mkPeriod(id: PeriodId, raw: RawPeriod): Period {
  return { id, ...raw, total: sum(raw.values) };
}

export const PERIODS: Record<PeriodId, Period> = {
  "7d": mkPeriod("7d", RAW_7D),
  "28d": mkPeriod("28d", RAW_28D),
  "90d": mkPeriod("90d", RAW_90D),
};

export const BASE_TOTAL = PERIODS["7d"].total;

/* ------------------------------------------------------------------ */
/* 4. Audience — devices, tech, hour-of-week heatmap                   */
/* ------------------------------------------------------------------ */

export type Slice = { id: string; pct: number; tone: string };

export const DEVICES: Slice[] = [
  { id: "mobile", pct: 62.4, tone: "orange-600" },
  { id: "desktop", pct: 28.9, tone: "orange-400" },
  { id: "tablet", pct: 8.7, tone: "orange-200" },
];

export const BROWSERS: Slice[] = [
  { id: "chrome", pct: 47.8, tone: "orange-600" },
  { id: "safari", pct: 32.1, tone: "orange-600" },
  { id: "edge", pct: 8.6, tone: "orange-600" },
  { id: "firefox", pct: 6.4, tone: "orange-600" },
  { id: "otherBrowser", pct: 5.1, tone: "orange-600" },
];

export const OPERATING: Slice[] = [
  { id: "ios", pct: 41.2, tone: "orange-600" },
  { id: "android", pct: 24.8, tone: "orange-600" },
  { id: "macos", pct: 16.3, tone: "orange-600" },
  { id: "windows", pct: 13.9, tone: "orange-600" },
  { id: "otherOs", pct: 3.8, tone: "orange-600" },
];

// Hour-of-week intensity: deterministic product of a weekday weight and a
// two-hour-bucket weight. Same numbers on every render, on every machine.
const DAY_WEIGHT = [0.62, 1.28, 1.0, 0.94, 1.08, 0.72, 0.58];
const HOUR_WEIGHT = [
  0.18, 0.12, 0.22, 0.55, 1.05, 1.42, 1.18, 0.96, 1.1, 1.34, 0.88, 0.42,
];

export const HEAT: number[][] = DAY_WEIGHT.map((d) =>
  HOUR_WEIGHT.map((h) => Math.round(d * h * 180)),
);

export function heatAt(day: number, hour: number): number {
  return HEAT[day]?.[hour] ?? 0;
}

export const HEAT_CELLS = DAY_WEIGHT.length * HOUR_WEIGHT.length;

export const HEAT_AVG =
  Math.round((sum(HEAT.map((row) => sum(row))) / HEAT_CELLS) * 10) / 10;

function findPeak(): { day: number; hour: number; value: number } {
  let day = 0;
  let hour = 0;
  let value = -1;
  HEAT.forEach((row, di) => {
    row.forEach((v, hi) => {
      if (v > value) {
        value = v;
        day = di;
        hour = hi;
      }
    });
  });
  return { day, hour, value };
}

export const HEAT_PEAK = findPeak();
export const HEAT_MAX = HEAT_PEAK.value;

export function heatRatio(value: number): string {
  return (value / HEAT_AVG).toFixed(1);
}

// Hour buckets are two hours wide: index 0 => 00:00-02:00.
export function hourRange(index: number): string {
  const start = index * 2;
  const end = start + 2;
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(start)}:00-${pad(end)}:00`;
}

export const SEND_SLOT = { day: 1, hour: 3 };
export const SEND_RATIO = heatRatio(heatAt(SEND_SLOT.day, SEND_SLOT.hour));
export const PEAK_RATIO = heatRatio(HEAT_MAX);

/* ------------------------------------------------------------------ */
/* 3. To-do cards — every prescription is derived from a metric above  */
/* ------------------------------------------------------------------ */

export type TodoId = "broken" | "mobile" | "timing";
export type TodoStatus = "open" | "queued" | "snoozed" | "dismissed";
export type Severity = "critical" | "warning" | "opportunity";

export type Todo = {
  id: TodoId;
  severity: Severity;
  marker: string;
  bars: number[];
  highlight: number[];
};

export const TODOS: Todo[] = [
  {
    id: "broken",
    severity: "critical",
    marker: "08/07",
    bars: [212, 224, 218, 231, 214, 209, 214],
    highlight: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "mobile",
    severity: "opportunity",
    marker: "08/09",
    bars: [71.2, 44.0],
    highlight: [0],
  },
  {
    id: "timing",
    severity: "warning",
    marker: "08/11",
    bars: HOUR_WEIGHT.map((h) => Math.round(h * 100)),
    highlight: [5],
  },
];

/* ------------------------------------------------------------------ */
/* 5. Sources -> links flow                                            */
/* ------------------------------------------------------------------ */

export const FLOW_SOURCE_IDS = [
  "instagram",
  "newsletter",
  "x",
  "direct",
  "search",
];

export const FLOW_LINK_IDS = [
  "/launch",
  "/summer",
  "/spring-promo",
  "/pricing",
];

const FLOW_BASE: { s: string; l: string; v: number }[] = [
  { s: "instagram", l: "/launch", v: 6180 },
  { s: "instagram", l: "/summer", v: 3180 },
  { s: "instagram", l: "/spring-promo", v: 1240 },
  { s: "newsletter", l: "/launch", v: 2610 },
  { s: "newsletter", l: "/pricing", v: 2940 },
  { s: "newsletter", l: "/summer", v: 1480 },
  { s: "x", l: "/launch", v: 1820 },
  { s: "x", l: "/spring-promo", v: 2110 },
  { s: "direct", l: "/summer", v: 2240 },
  { s: "direct", l: "/pricing", v: 820 },
  { s: "search", l: "/launch", v: 630 },
  { s: "search", l: "/pricing", v: 480 },
];

export const FLOW_H = 320;
const FLOW_PAD = 16;
const FLOW_AVAIL = 248;
export const FLOW_W = 640;
export const FLOW_X1 = 200;
export const FLOW_X2 = 440;

export type FlowNode = {
  id: string;
  total: number;
  y: number;
  h: number;
  center: number;
};

export type FlowRibbon = {
  key: string;
  s: string;
  l: string;
  value: number;
  w: number;
  d: string;
};

export type FlowLayout = {
  sources: FlowNode[];
  links: FlowNode[];
  ribbons: FlowRibbon[];
  total: number;
};

export function buildFlow(scale: number): FlowLayout {
  const rib = FLOW_BASE.map((r) => ({
    s: r.s,
    l: r.l,
    value: Math.max(1, Math.round(r.v * scale)),
  }));
  const total = rib.reduce((acc, r) => acc + r.value, 0);

  const layNodes = (
    ids: string[],
    pick: (r: { s: string; l: string; value: number }) => string,
  ): FlowNode[] => {
    const gap =
      ids.length > 1
        ? (FLOW_H - FLOW_PAD * 2 - FLOW_AVAIL) / (ids.length - 1)
        : 0;
    let cursor = FLOW_PAD;
    return ids.map((id) => {
      const t = rib
        .filter((r) => pick(r) === id)
        .reduce((acc, r) => acc + r.value, 0);
      const h = (FLOW_AVAIL * t) / total;
      const node: FlowNode = {
        id,
        total: t,
        y: r2(cursor),
        h: r2(h),
        center: r2(cursor + h / 2),
      };
      cursor += h + gap;
      return node;
    });
  };

  const sources = layNodes(FLOW_SOURCE_IDS, (r) => r.s);
  const links = layNodes(FLOW_LINK_IDS, (r) => r.l);
  const keyOf = (r: { s: string; l: string }) => `${r.s}>${r.l}`;

  const leftCursor = new Map(sources.map((n) => [n.id, n.y]));
  const rightCursor = new Map(links.map((n) => [n.id, n.y]));
  const startY = new Map<string, number>();
  const endY = new Map<string, number>();

  [...rib]
    .sort(
      (a, b) =>
        FLOW_SOURCE_IDS.indexOf(a.s) - FLOW_SOURCE_IDS.indexOf(b.s) ||
        FLOW_LINK_IDS.indexOf(a.l) - FLOW_LINK_IDS.indexOf(b.l),
    )
    .forEach((r) => {
      const w = (FLOW_AVAIL * r.value) / total;
      const at = leftCursor.get(r.s) ?? 0;
      startY.set(keyOf(r), at + w / 2);
      leftCursor.set(r.s, at + w);
    });

  [...rib]
    .sort(
      (a, b) =>
        FLOW_LINK_IDS.indexOf(a.l) - FLOW_LINK_IDS.indexOf(b.l) ||
        FLOW_SOURCE_IDS.indexOf(a.s) - FLOW_SOURCE_IDS.indexOf(b.s),
    )
    .forEach((r) => {
      const w = (FLOW_AVAIL * r.value) / total;
      const at = rightCursor.get(r.l) ?? 0;
      endY.set(keyOf(r), at + w / 2);
      rightCursor.set(r.l, at + w);
    });

  const ribbons: FlowRibbon[] = rib.map((r) => {
    const key = keyOf(r);
    const a = r2(startY.get(key) ?? 0);
    const b = r2(endY.get(key) ?? 0);
    return {
      key,
      s: r.s,
      l: r.l,
      value: r.value,
      w: r2((FLOW_AVAIL * r.value) / total),
      d: `M${FLOW_X1} ${a} C${FLOW_X1 + 96} ${a}, ${FLOW_X2 - 96} ${b}, ${FLOW_X2} ${b}`,
    };
  });

  return { sources, links, ribbons, total };
}

export const REFERRER_DELTA: Record<string, number> = {
  instagram: 24.6,
  newsletter: -8.2,
  x: 11.4,
  direct: 3.1,
  search: 47.9,
};

export const REFERRER_DOMAIN: Record<string, string> = {
  instagram: "instagram.com",
  newsletter: "mail.hoplinehq.com",
  x: "t.co",
  direct: "(no referrer)",
  search: "google.com",
};

/* ------------------------------------------------------------------ */
/* 6. Link table                                                       */
/* ------------------------------------------------------------------ */

export type LinkStatus = "live" | "broken" | "paused";

export type LinkRow = {
  slug: string;
  clicks: number;
  unique: number;
  mobilePct: number;
  status: LinkStatus;
  deltaPct: number;
  spark: number[];
};

export const LINKS: LinkRow[] = [
  {
    slug: "/launch",
    clicks: 12480,
    unique: 9120,
    mobilePct: 71.2,
    status: "live",
    deltaPct: 18.4,
    spark: [1420, 1610, 1780, 1690, 1920, 2140, 1920],
  },
  {
    slug: "/summer",
    clicks: 8340,
    unique: 6210,
    mobilePct: 58.4,
    status: "live",
    deltaPct: 6.2,
    spark: [1180, 1240, 1160, 1210, 1280, 1150, 1120],
  },
  {
    slug: "/spring-promo",
    clicks: 5020,
    unique: 3880,
    mobilePct: 63.1,
    status: "broken",
    deltaPct: -12.8,
    spark: [820, 790, 760, 720, 690, 640, 600],
  },
  {
    slug: "/pricing",
    clicks: 4760,
    unique: 3640,
    mobilePct: 39.5,
    status: "live",
    deltaPct: 2.4,
    spark: [640, 660, 690, 670, 700, 710, 690],
  },
  {
    slug: "/demo-call",
    clicks: 3910,
    unique: 3020,
    mobilePct: 44.8,
    status: "live",
    deltaPct: 9.6,
    spark: [480, 510, 540, 560, 590, 610, 620],
  },
  {
    slug: "/changelog",
    clicks: 2880,
    unique: 2140,
    mobilePct: 35.2,
    status: "live",
    deltaPct: -4.1,
    spark: [440, 430, 420, 410, 400, 390, 390],
  },
  {
    slug: "/beta-invite",
    clicks: 1940,
    unique: 1510,
    mobilePct: 52.6,
    status: "paused",
    deltaPct: -22.5,
    spark: [380, 340, 300, 270, 240, 220, 190],
  },
  {
    slug: "/press-kit",
    clicks: 1120,
    unique: 890,
    mobilePct: 41.3,
    status: "live",
    deltaPct: 1.8,
    spark: [150, 160, 155, 165, 160, 170, 160],
  },
];

export type ScaledLink = LinkRow & { c: number; u: number };

export function scaleLinks(period: Period): {
  rows: ScaledLink[];
  other: number;
} {
  const k = period.total / BASE_TOTAL;
  const rows: ScaledLink[] = LINKS.map((l) => ({
    ...l,
    c: Math.round(l.clicks * k),
    u: Math.round(l.unique * k),
  }));
  const other = period.total - rows.reduce((acc, r) => acc + r.c, 0);
  return { rows, other };
}

export type SortKey = "c" | "u" | "mobilePct" | "deltaPct";
export type SortDir = "asc" | "desc";

export function sortLinks(
  rows: ScaledLink[],
  key: SortKey,
  dir: SortDir,
): ScaledLink[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort(
    (a, b) => (a[key] - b[key]) * factor || a.slug.localeCompare(b.slug),
  );
}
