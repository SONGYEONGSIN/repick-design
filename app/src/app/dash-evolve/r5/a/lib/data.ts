import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  CandlestickChart,
  CalendarClock,
  CheckSquare,
  FileBarChart2,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { pad2, roundTo, stepBackDays, wave } from "./math";

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자                                              */
/* ---------------------------------------------------------------------- */

export const BRAND = {
  name: "Ballast",
  tagline: "Treasury FX & Cash Risk Desk",
};

export type Entity = { id: string; name: string; plan: string };

export const ENTITIES: Entity[] = [
  { id: "group", name: "Nordkap Treasury", plan: "그룹 연결" },
  { id: "amers", name: "Nordkap Americas", plan: "지역 북" },
  { id: "apac", name: "Nordkap APAC", plan: "지역 북" },
];

export const CURRENT_USER = {
  name: "한서준",
  role: "Treasury Risk Analyst",
  avatarId: "1500648767791-00dcc994a43e",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* 내비게이션                                                                */
/* ---------------------------------------------------------------------- */

export type NavItem = {
  id: string;
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
};

export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "desk",
    title: "데스크",
    items: [
      { id: "fx-desk", label: "FX 데스크", Icon: CandlestickChart, active: true },
      { id: "cash", label: "현금 포지션", Icon: Wallet },
      { id: "hedge", label: "헤지 전략", Icon: ShieldCheck },
    ],
  },
  {
    id: "ops",
    title: "운영",
    items: [
      { id: "approvals", label: "결제 승인", Icon: CheckSquare, badge: "3" },
      { id: "settlement", label: "정산 캘린더", Icon: CalendarClock },
      { id: "reports", label: "리포트", Icon: FileBarChart2 },
    ],
  },
  {
    id: "settings",
    title: "설정",
    items: [
      { id: "alerts", label: "알림 규칙", Icon: BellRing },
      { id: "users", label: "사용자 관리", Icon: Users, disabled: true },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 상품(FX 페어) — 워치리스트 + 차트 + 상세 패널 공용                            */
/* ---------------------------------------------------------------------- */

export type Exposure = "Long" | "Short" | "Flat";

export type Instrument = {
  id: string;
  pair: string;
  base: string;
  quote: string;
  decimals: number;
  last: number;
  dayLow: number;
  dayHigh: number;
  volatility20d: number;
  forwardPoints: number;
  exposure: Exposure;
  exposureAmountUsd: number;
  /** 헤지 비율(%). 노출이 Flat이면 해당 없음(null). */
  hedgeRatioPct: number | null;
  seed: number;
};

const RAW_INSTRUMENTS: Omit<Instrument, "seed"> [] = [
  { id: "usdkrw", pair: "USD/KRW", base: "USD", quote: "KRW", decimals: 2, last: 1391.2, dayLow: 1386.4, dayHigh: 1394.8, volatility20d: 6.8, forwardPoints: 42.5, exposure: "Long", exposureAmountUsd: 28_400_000, hedgeRatioPct: 72 },
  { id: "eurusd", pair: "EUR/USD", base: "EUR", quote: "USD", decimals: 4, last: 1.0842, dayLow: 1.0812, dayHigh: 1.0868, volatility20d: 7.1, forwardPoints: -18.2, exposure: "Short", exposureAmountUsd: 6_200_000, hedgeRatioPct: 55 },
  { id: "usdjpy", pair: "USD/JPY", base: "USD", quote: "JPY", decimals: 2, last: 156.3, dayLow: 155.1, dayHigh: 157.05, volatility20d: 9.4, forwardPoints: 65.0, exposure: "Long", exposureAmountUsd: 14_700_000, hedgeRatioPct: 38 },
  { id: "gbpusd", pair: "GBP/USD", base: "GBP", quote: "USD", decimals: 4, last: 1.2687, dayLow: 1.2645, dayHigh: 1.2721, volatility20d: 8.0, forwardPoints: -9.4, exposure: "Short", exposureAmountUsd: 3_100_000, hedgeRatioPct: 61 },
  { id: "usdcnh", pair: "USD/CNH", base: "USD", quote: "CNH", decimals: 4, last: 7.198, dayLow: 7.182, dayHigh: 7.214, volatility20d: 4.2, forwardPoints: 120.0, exposure: "Long", exposureAmountUsd: 9_800_000, hedgeRatioPct: 84 },
  { id: "audusd", pair: "AUD/USD", base: "AUD", quote: "USD", decimals: 4, last: 0.6521, dayLow: 0.6488, dayHigh: 0.6552, volatility20d: 10.1, forwardPoints: -6.8, exposure: "Flat", exposureAmountUsd: 0, hedgeRatioPct: null },
  { id: "usdsgd", pair: "USD/SGD", base: "USD", quote: "SGD", decimals: 4, last: 1.3402, dayLow: 1.3376, dayHigh: 1.3428, volatility20d: 3.6, forwardPoints: 31.0, exposure: "Long", exposureAmountUsd: 5_400_000, hedgeRatioPct: 90 },
  { id: "eurkrw", pair: "EUR/KRW", base: "EUR", quote: "KRW", decimals: 2, last: 1508.4, dayLow: 1501.2, dayHigh: 1514.6, volatility20d: 8.9, forwardPoints: 58.0, exposure: "Short", exposureAmountUsd: 4_000_000, hedgeRatioPct: 47 },
  { id: "usdhkd", pair: "USD/HKD", base: "USD", quote: "HKD", decimals: 4, last: 7.812, dayLow: 7.8095, dayHigh: 7.8145, volatility20d: 0.6, forwardPoints: 4.2, exposure: "Long", exposureAmountUsd: 2_100_000, hedgeRatioPct: 95 },
  { id: "nzdusd", pair: "NZD/USD", base: "NZD", quote: "USD", decimals: 4, last: 0.5978, dayLow: 0.5942, dayHigh: 0.6011, volatility20d: 9.8, forwardPoints: -5.1, exposure: "Flat", exposureAmountUsd: 0, hedgeRatioPct: null },
];

export const INSTRUMENTS: Instrument[] = RAW_INSTRUMENTS.map((inst, i) => ({
  ...inst,
  seed: (i + 1) * 1.37,
}));

export function instrumentById(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}

/* ---------------------------------------------------------------------- */
/* 가격 시계열 — 결정론적 파형(Math.random/Date.now 미사용), 마지막 값은 last로 고정  */
/* ---------------------------------------------------------------------- */

export type Period = "1D" | "1W" | "1M" | "YTD";
export const PERIODS: Period[] = ["1D", "1W", "1M", "YTD"];
export const PERIOD_LABEL: Record<Period, string> = { "1D": "1일", "1W": "1주", "1M": "1개월", YTD: "연초 이후" };

export type SeriesPoint = { label: string; full: string; value: number };

const MONTH_KO = ["1월", "2월", "3월", "4월", "5월", "6월", "7월"];

function labelsFor(period: Period): { label: string; full: string }[] {
  if (period === "1D") {
    return Array.from({ length: 24 }, (_, h) => ({
      label: `${pad2(h)}:00`,
      full: `07/17 ${pad2(h)}:00`,
    }));
  }
  if (period === "1W") {
    return Array.from({ length: 7 }, (_, i) => {
      const { month, day } = stepBackDays(7, 17, 6 - i);
      return { label: `${pad2(month)}/${pad2(day)}`, full: `2026-${pad2(month)}-${pad2(day)}` };
    });
  }
  if (period === "1M") {
    return Array.from({ length: 30 }, (_, i) => {
      const { month, day } = stepBackDays(7, 17, 29 - i);
      return { label: `${pad2(month)}/${pad2(day)}`, full: `2026-${pad2(month)}-${pad2(day)}` };
    });
  }
  // YTD: 2026년 1월~7월(오늘)
  return MONTH_KO.map((label, i) => ({ label, full: `2026년 ${i + 1}월` }));
}

const PERIOD_AMPLITUDE_FACTOR: Record<Period, number> = { "1D": 0.28, "1W": 0.55, "1M": 1.0, YTD: 1.9 };

export function generateSeries(instrument: Instrument, period: Period): SeriesPoint[] {
  const labels = labelsFor(period);
  const n = labels.length;
  const amplitude = instrument.last * (instrument.volatility20d / 100) * PERIOD_AMPLITUDE_FACTOR[period] * 0.4;
  const raw = Array.from({ length: n }, (_, i) => wave(instrument.seed, i, n));
  const lastRaw = raw[n - 1];
  return labels.map(({ label, full }, i) => ({
    label,
    full,
    value: roundTo(instrument.last + (raw[i] - lastRaw) * amplitude, instrument.decimals),
  }));
}

/* ---------------------------------------------------------------------- */
/* 포지션 / 거래 — 하단 정렬 가능 테이블. entity별 헤지 및 노출 포지션.           */
/* ---------------------------------------------------------------------- */

export type PositionStatus = "오픈" | "정산완료";

export type Position = {
  id: string;
  instrumentId: string;
  entity: string;
  side: "Long" | "Short";
  notionalUsd: number;
  avgRate: number;
  pnlUsd: number;
  status: PositionStatus;
  updatedLabel: string;
};

export const POSITIONS: Position[] = [
  { id: "PX-3001", instrumentId: "usdkrw", entity: "Nordkap KR HQ", side: "Long", notionalUsd: 12_000_000, avgRate: 1378.5, pnlUsd: 148_400, status: "오픈", updatedLabel: "07/15" },
  { id: "PX-3002", instrumentId: "usdkrw", entity: "Nordkap KR HQ", side: "Long", notionalUsd: 8_500_000, avgRate: 1402.1, pnlUsd: -95_600, status: "오픈", updatedLabel: "07/12" },
  { id: "PX-3003", instrumentId: "eurusd", entity: "Nordkap EU Sub", side: "Short", notionalUsd: 6_200_000, avgRate: 1.091, pnlUsd: 42_100, status: "오픈", updatedLabel: "07/16" },
  { id: "PX-3004", instrumentId: "usdjpy", entity: "Nordkap JP Sub", side: "Long", notionalUsd: 9_800_000, avgRate: 154.2, pnlUsd: 131_700, status: "오픈", updatedLabel: "07/14" },
  { id: "PX-3005", instrumentId: "usdjpy", entity: "Nordkap JP Sub", side: "Long", notionalUsd: 4_900_000, avgRate: 157.8, pnlUsd: -46_900, status: "오픈", updatedLabel: "07/10" },
  { id: "PX-3006", instrumentId: "gbpusd", entity: "Nordkap UK Sub", side: "Short", notionalUsd: 3_100_000, avgRate: 1.275, pnlUsd: 19_500, status: "오픈", updatedLabel: "07/13" },
  { id: "PX-3007", instrumentId: "usdcnh", entity: "Nordkap CN Sub", side: "Long", notionalUsd: 9_800_000, avgRate: 7.241, pnlUsd: -58_300, status: "오픈", updatedLabel: "07/11" },
  { id: "PX-3008", instrumentId: "usdsgd", entity: "Nordkap SG Sub", side: "Long", notionalUsd: 5_400_000, avgRate: 1.3355, pnlUsd: 18_900, status: "정산완료", updatedLabel: "07/09" },
  { id: "PX-3009", instrumentId: "eurkrw", entity: "Nordkap EU Sub", side: "Short", notionalUsd: 4_000_000, avgRate: 1522.6, pnlUsd: 56_800, status: "오픈", updatedLabel: "07/16" },
  { id: "PX-3010", instrumentId: "usdhkd", entity: "Nordkap HK Sub", side: "Long", notionalUsd: 2_100_000, avgRate: 7.8065, pnlUsd: 1_200, status: "정산완료", updatedLabel: "07/08" },
  { id: "PX-3011", instrumentId: "usdkrw", entity: "Nordkap KR HQ", side: "Long", notionalUsd: 7_900_000, avgRate: 1391.2, pnlUsd: 0, status: "오픈", updatedLabel: "07/17" },
  { id: "PX-3012", instrumentId: "gbpusd", entity: "Nordkap UK Sub", side: "Short", notionalUsd: 1_800_000, avgRate: 1.261, pnlUsd: -13_400, status: "정산완료", updatedLabel: "07/07" },
  { id: "PX-3013", instrumentId: "eurusd", entity: "Nordkap EU Sub", side: "Short", notionalUsd: 2_600_000, avgRate: 1.079, pnlUsd: -13_600, status: "오픈", updatedLabel: "07/15" },
];

export type SortKey = "instrument" | "entity" | "notional" | "pnl" | "updated";

export function comparePositions(a: Position, b: Position, key: SortKey, dir: "asc" | "desc"): number {
  let result = 0;
  switch (key) {
    case "instrument":
      result = a.instrumentId.localeCompare(b.instrumentId);
      break;
    case "entity":
      result = a.entity.localeCompare(b.entity);
      break;
    case "pnl":
      result = a.pnlUsd - b.pnlUsd;
      break;
    case "updated":
      result = a.updatedLabel.localeCompare(b.updatedLabel);
      break;
    case "notional":
    default:
      result = a.notionalUsd - b.notionalUsd;
      break;
  }
  return dir === "asc" ? result : -result;
}

/* ---------------------------------------------------------------------- */
/* 최근 체결 — 우측 상세 패널. 종목별 결정론적 생성.                             */
/* ---------------------------------------------------------------------- */

export type Fill = {
  id: string;
  side: "매수" | "매도";
  sizeUsd: number;
  rate: number;
  venue: string;
  timeLabel: string;
};

const VENUES = ["JP모건", "씨티은행", "스탠다드차타드", "KEB하나은행", "BofA", "도이치뱅크"];
const FILL_TIMES = ["14:32", "13:58", "13:21", "12:47", "11:59", "11:15"];
const FILL_SIZES = [1_200_000, 800_000, 2_400_000, 450_000, 1_800_000, 600_000];

export function generateFills(instrument: Instrument): Fill[] {
  return FILL_TIMES.map((timeLabel, i) => {
    const offset = wave(instrument.seed + i * 0.31, i, FILL_TIMES.length) * instrument.last * 0.0025;
    return {
      id: `${instrument.id}-fill-${i}`,
      side: i % 2 === 0 ? "매수" : "매도",
      sizeUsd: FILL_SIZES[i],
      rate: roundTo(instrument.last + offset, instrument.decimals),
      venue: VENUES[(i + Math.round(instrument.seed)) % VENUES.length],
      timeLabel,
    };
  });
}
