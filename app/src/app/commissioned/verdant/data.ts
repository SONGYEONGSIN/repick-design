/**
 * Verdant — deterministic dummy data for a personal money dashboard.
 *
 * Rules held here: money is integer cents, the calendar is anchored to a constant
 * (day 0 = 2026-08-31, no `new Date`), every derived number comes from a pure
 * function, and every user facing string carries both languages.
 */

export type Lang = "en" | "ko";
export type Bi = { readonly en: string; readonly ko: string };
export type PeriodId = "week" | "month" | "year";
export type Direction = "in" | "out";
export type CategoryKey = "housing" | "food" | "transport" | "subs" | "health" | "leisure";
export type KindKey = "salary" | "card" | "transfer" | "debit" | "refund";
export type CardId = "everyday" | "travel";
export type SortKey = "party" | "amount" | "date";
export type SortDir = "asc" | "desc";
export type Swatch = "lime" | "emerald" | "zinc" | "limeHatch" | "emeraldHatch" | "zincDim";

/* ---------------------------------------------------------------- lexicon */

export const CATEGORY: Record<CategoryKey, Bi> = {
  housing: { en: "Housing & bills", ko: "주거·공과금" },
  food: { en: "Food & groceries", ko: "식비·장보기" },
  transport: { en: "Transport", ko: "교통" },
  subs: { en: "Subscriptions", ko: "구독" },
  health: { en: "Health", ko: "건강" },
  leisure: { en: "Leisure", ko: "여가" },
};

export const CATEGORY_ORDER: readonly CategoryKey[] = [
  "housing",
  "food",
  "transport",
  "subs",
  "health",
  "leisure",
];

export const CATEGORY_SWATCH: Record<CategoryKey, Swatch> = {
  housing: "lime",
  food: "emerald",
  transport: "zinc",
  subs: "emeraldHatch",
  health: "zincDim",
  leisure: "limeHatch",
};

export const KIND: Record<KindKey, Bi> = {
  salary: { en: "Salary", ko: "급여" },
  card: { en: "Card", ko: "카드" },
  transfer: { en: "Transfer", ko: "이체" },
  debit: { en: "Direct debit", ko: "자동이체" },
  refund: { en: "Refund", ko: "환불" },
};

export const UI = {
  brand: { en: "Verdant", ko: "Verdant" },
  brandTag: { en: "Personal money", ko: "개인 자산 관리" },
  menu: { en: "Menu", ko: "메뉴" },
  preference: { en: "Preference", ko: "환경설정" },
  collapse: { en: "Collapse the menu", ko: "메뉴 접기" },
  expand: { en: "Expand the menu", ko: "메뉴 펼치기" },
  openMenu: { en: "Open the menu", ko: "메뉴 열기" },
  closeMenu: { en: "Close the menu", ko: "메뉴 닫기" },

  navOverview: { en: "Overview", ko: "한눈에" },
  navInsights: { en: "Insights", ko: "요약 진단" },
  navCashflow: { en: "Cash flow", ko: "현금 흐름" },
  navTransactions: { en: "Transactions", ko: "거래 내역" },
  navCards: { en: "Cards", ko: "카드" },
  navGoals: { en: "Goals", ko: "목표" },
  navSpending: { en: "Spending", ko: "지출 구성" },
  navUpcoming: { en: "Coming up", ko: "예정 지출" },
  navSettings: { en: "Settings", ko: "설정" },
  navHelp: { en: "Help center", ko: "도움말" },

  search: { en: "Search transactions", ko: "거래 검색" },
  searchHint: { en: "Search a merchant or a person", ko: "가맹점이나 사람 이름 검색" },
  searchKeyHint: { en: "Ctrl or Cmd, then F", ko: "Ctrl 또는 Cmd 후 F" },
  language: { en: "Language", ko: "언어" },
  insights: { en: "Insights", ko: "요약 진단" },
  insightsOpen: { en: "Show the three answers", ko: "세 가지 답 펼치기" },
  insightsClose: { en: "Hide the three answers", ko: "세 가지 답 접기" },
  notifications: { en: "Notifications", ko: "알림" },
  unread: { en: "unread", ko: "읽지 않음" },
  markRead: { en: "Mark all as read", ko: "모두 읽음 처리" },
  allRead: { en: "Nothing new right now.", ko: "새 알림이 없습니다." },
  role: { en: "Personal account", ko: "개인 계정" },

  title: { en: "Your money", ko: "내 돈" },
  subtitle: {
    en: "What came in, what left, and what is still yours.",
    ko: "들어온 돈, 나간 돈, 그리고 남은 돈.",
  },
  addTxn: { en: "Log a transaction", ko: "거래 기록하기" },
  periodGroup: { en: "Period", ko: "기간" },

  moneyIn: { en: "Money in", ko: "들어온 돈" },
  moneyOut: { en: "Money out", ko: "나간 돈" },
  kept: { en: "Kept", ko: "남은 돈" },
  keptNote: { en: "of what you earned", ko: "만큼을 지켰습니다" },
  cashflow: { en: "Cash flow", ko: "현금 흐름" },
  cashflowNote: {
    en: "Each bar is what you kept in that stretch. Below the dashed line you spent more than you earned.",
    ko: "막대 하나는 그 구간에 남긴 돈입니다. 파선 아래는 번 것보다 더 쓴 구간입니다.",
  },
  surplus: { en: "Kept, above the line", ko: "남김, 기준선 위" },
  deficit: { en: "Overspent, below the line", ko: "초과 지출, 기준선 아래" },
  breakEven: { en: "Break even", ko: "수지 균형" },
  net: { en: "Net", ko: "순액" },
  inShort: { en: "In", ko: "수입" },
  outShort: { en: "Ex", ko: "지출" },
  pickBar: { en: "Pick a bar to read the stretch", ko: "막대를 선택하면 구간이 읽힙니다" },
  clearBar: { en: "Clear the selected stretch", ko: "선택한 구간 해제" },

  transactions: { en: "Transactions", ko: "거래 내역" },
  txnCaption: {
    en: "Transactions in the selected period, newest first. Sortable by name, amount and date.",
    ko: "선택한 기간의 거래이며 최신순입니다. 이름·금액·날짜로 정렬할 수 있습니다.",
  },
  colName: { en: "Name", ko: "이름" },
  colType: { en: "Type", ko: "유형" },
  colAmount: { en: "Amount", ko: "금액" },
  colDate: { en: "Date", ko: "날짜" },
  colDetail: { en: "Detail", ko: "상세" },
  selectRow: { en: "Select this transaction", ko: "이 거래 선택" },
  selectAll: { en: "Select every listed transaction", ko: "표시된 거래 모두 선택" },
  selected: { en: "selected", ko: "건 선택" },
  clearSelection: { en: "Clear the selection", ko: "선택 해제" },
  showAll: { en: "Show every row", ko: "전체 행 보기" },
  showLess: { en: "Show fewer rows", ko: "행 줄이기" },
  showing: { en: "Showing", ko: "표시" },
  of: { en: "of", ko: "/" },
  rows: { en: "rows", ko: "행" },
  noRows: {
    en: "No transaction matches this filter.",
    ko: "이 조건에 맞는 거래가 없습니다.",
  },
  filteredBy: { en: "Filtered by", ko: "필터" },
  clearFilter: { en: "Clear the filter", ko: "필터 해제" },
  detailOf: { en: "Details for", ko: "상세 정보" },
  reference: { en: "Reference", ko: "참조번호" },
  paidWith: { en: "Paid with", ko: "결제 수단" },
  note: { en: "Note", ko: "메모" },

  card: { en: "Card", ko: "카드" },
  cardPick: { en: "Pick a card", ko: "카드 선택" },
  linked: { en: "Linked to the main account", ko: "주거래 계좌 연결" },
  reveal: { en: "Show the card number", ko: "카드 번호 보기" },
  conceal: { en: "Hide the card number", ko: "카드 번호 가리기" },
  expires: { en: "Expires", ko: "유효기간" },
  spentOnCard: { en: "Spent on this card", ko: "이 카드로 쓴 돈" },
  ofSpending: { en: "of everything you spent", ko: "전체 지출 중" },

  goals: { en: "Goals", ko: "목표" },
  saved: { en: "Saved so far", ko: "지금까지 모은 돈" },
  addedThis: { en: "added", ko: "적립" },
  goalPick: { en: "Pick a goal", ko: "목표 선택" },
  target: { en: "Target", ko: "목표액" },
  toGo: { en: "to go", ko: "남음" },
  months: { en: "months", ko: "개월" },
  perMonth: { en: "per month", ko: "월 적립" },
  funded: { en: "funded", ko: "달성" },

  spending: { en: "Where it goes", ko: "어디로 나가나" },
  spendingNote: {
    en: "Pick a slice to filter the transaction table.",
    ko: "조각을 선택하면 거래 표가 걸러집니다.",
  },
  totalSpent: { en: "Total spent", ko: "지출 합계" },
  showAllCats: { en: "Show every category", ko: "전체 분류 보기" },
  showTopCats: { en: "Show the top four", ko: "상위 4개만 보기" },
  share: { en: "share", ko: "비중" },
  vsPrevPp: { en: "pp vs the period before", ko: "%p, 직전 기간 대비" },

  upcoming: { en: "Coming up", ko: "예정 지출" },
  dueIn: { en: "in", ko: "뒤" },
  days: { en: "days", ko: "일" },
  tomorrow: { en: "tomorrow", ko: "내일" },
  afterThese: { en: "Left after these", ko: "이 지출 뒤 남는 돈" },

  settingsTitle: { en: "Settings", ko: "설정" },
  compactRows: { en: "Compact table rows", ko: "표 행 좁게" },
  currentLang: { en: "Interface language", ko: "인터페이스 언어" },
  helpTitle: { en: "What this screen answers", ko: "이 화면이 답하는 것" },
  help1: { en: "Where the money leaks", ko: "돈이 어디로 새는가" },
  help2: { en: "How far the goals still are", ko: "목표까지 얼마나 남았나" },
  help3: { en: "What is left this period", ko: "이번 기간에 남은 것" },

  up: { en: "up", ko: "증가" },
  down: { en: "down", ko: "감소" },
  flat: { en: "flat", ko: "변동 없음" },
  biggestLine: { en: "the single biggest line", ko: "가장 큰 항목" },
} satisfies Record<string, Bi>;

/* ------------------------------------------------------------------ dates */

const MONTH_EN: readonly string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthLength(month: number): number {
  if (month === 1) return 28;
  if (month === 3 || month === 5 || month === 8 || month === 10) return 30;
  return 31;
}

/** Day 0 is the anchor, 2026-08-31. Negative days point at the future. */
export function dayDate(day: number): { year: number; month: number; date: number } {
  let year = 2026;
  let month = 7;
  let date = 31 - day;
  while (date < 1) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    date += monthLength(month);
  }
  while (date > monthLength(month)) {
    date -= monthLength(month);
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return { year, month, date };
}

export function dateShort(day: number, lang: Lang): string {
  const d = dayDate(day);
  if (lang === "ko") return `${d.month + 1}월 ${d.date}일`;
  return `${MONTH_EN[d.month] ?? ""} ${d.date}`;
}

export function dateFull(day: number, lang: Lang): string {
  const d = dayDate(day);
  if (lang === "ko") return `${d.year}년 ${d.month + 1}월 ${d.date}일`;
  return `${MONTH_EN[d.month] ?? ""} ${d.date}, ${d.year}`;
}

/* --------------------------------------------------------------- numerics */

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function groupDigits(whole: string): string {
  const parts: string[] = [];
  let rest = whole;
  while (rest.length > 3) {
    parts.unshift(rest.slice(-3));
    rest = rest.slice(0, -3);
  }
  parts.unshift(rest);
  return parts.join(",");
}

/** USD, hand formatted: comma thousands, two decimals, no Intl anywhere. */
export function formatMoney(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  const tail = frac < 10 ? `0${frac}` : `${frac}`;
  return `${negative ? "-" : ""}$${groupDigits(String(whole))}.${tail}`;
}

export function formatSigned(cents: number): string {
  return `${cents >= 0 ? "+" : "-"}${formatMoney(Math.abs(cents))}`;
}

export function formatDirected(cents: number, dir: Direction): string {
  return `${dir === "in" ? "+" : "-"}${formatMoney(Math.abs(cents))}`;
}

/** Axis sized money: $2.7k above a thousand, whole dollars below it. */
export function formatCompact(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.round(cents));
  if (abs >= 100000) return `${sign}$${Math.round(abs / 10000) / 10}k`;
  return `${sign}$${Math.round(abs / 100)}`;
}

export function formatPct(value: number): string {
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

export function formatPp(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toFixed(1)}`;
}

export function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/* ---------------------------------------------------------------- periods */

export type Period = {
  id: PeriodId;
  days: number;
  label: Bi;
  short: Bi;
  vs: Bi;
  span: Bi;
};

const MONTH_PERIOD: Period = {
  id: "month",
  days: 31,
  label: { en: "This month", ko: "이번 달" },
  short: { en: "Month", ko: "월" },
  vs: { en: "vs last month", ko: "지난달 대비" },
  span: { en: "August 2026", ko: "2026년 8월" },
};

export const PERIODS: readonly Period[] = [
  {
    id: "week",
    days: 7,
    label: { en: "This week", ko: "이번 주" },
    short: { en: "Week", ko: "주" },
    vs: { en: "vs last week", ko: "지난주 대비" },
    span: { en: "Aug 25 to 31, 2026", ko: "2026년 8월 25~31일" },
  },
  MONTH_PERIOD,
  {
    id: "year",
    days: 366,
    label: { en: "Last 12 months", ko: "최근 12개월" },
    short: { en: "Year", ko: "연" },
    vs: { en: "vs the 12 months before", ko: "직전 12개월 대비" },
    span: { en: "Sep 2025 to Aug 2026", ko: "2025년 9월~2026년 8월" },
  },
];

export function periodOf(id: PeriodId): Period {
  return PERIODS.find((p) => p.id === id) ?? MONTH_PERIOD;
}

/* ------------------------------------------------------------- cash flow */

export type Bucket = { key: string; label: Bi; short: Bi; inCents: number; outCents: number };

const WEEK_FLOW: readonly Bucket[] = [
  {
    key: "d6",
    label: { en: "Aug 25", ko: "8월 25일" },
    short: { en: "25", ko: "25" },
    inCents: 0,
    outCents: 8120,
  },
  {
    key: "d5",
    label: { en: "Aug 26", ko: "8월 26일" },
    short: { en: "26", ko: "26" },
    inCents: 0,
    outCents: 17330,
  },
  {
    key: "d4",
    label: { en: "Aug 27", ko: "8월 27일" },
    short: { en: "27", ko: "27" },
    inCents: 60000,
    outCents: 42400,
  },
  {
    key: "d3",
    label: { en: "Aug 28", ko: "8월 28일" },
    short: { en: "28", ko: "28" },
    inCents: 0,
    outCents: 35670,
  },
  {
    key: "d2",
    label: { en: "Aug 29", ko: "8월 29일" },
    short: { en: "29", ko: "29" },
    inCents: 180000,
    outCents: 11600,
  },
  {
    key: "d1",
    label: { en: "Aug 30", ko: "8월 30일" },
    short: { en: "30", ko: "30" },
    inCents: 0,
    outCents: 9770,
  },
  {
    key: "d0",
    label: { en: "Aug 31", ko: "8월 31일" },
    short: { en: "31", ko: "31" },
    inCents: 0,
    outCents: 13510,
  },
];

const MONTH_FLOW: readonly Bucket[] = [
  {
    key: "w1",
    label: { en: "Aug 1 to 7", ko: "8월 1~7일" },
    short: { en: "W1", ko: "1주" },
    inCents: 174000,
    outCents: 143020,
  },
  {
    key: "w2",
    label: { en: "Aug 8 to 15", ko: "8월 8~15일" },
    short: { en: "W2", ko: "2주" },
    inCents: 240000,
    outCents: 96010,
  },
  {
    key: "w3",
    label: { en: "Aug 16 to 23", ko: "8월 16~23일" },
    short: { en: "W3", ko: "3주" },
    inCents: 180000,
    outCents: 240500,
  },
  {
    key: "w4",
    label: { en: "Aug 24 to 31", ko: "8월 24~31일" },
    short: { en: "W4", ko: "4주" },
    inCents: 240000,
    outCents: 141500,
  },
];

const YEAR_FLOW: readonly Bucket[] = [
  {
    key: "m09",
    label: { en: "September 2025", ko: "2025년 9월" },
    short: { en: "Sep", ko: "9월" },
    inCents: 642000,
    outCents: 548000,
  },
  {
    key: "m10",
    label: { en: "October 2025", ko: "2025년 10월" },
    short: { en: "Oct", ko: "10월" },
    inCents: 642000,
    outCents: 590560,
  },
  {
    key: "m11",
    label: { en: "November 2025", ko: "2025년 11월" },
    short: { en: "Nov", ko: "11월" },
    inCents: 642000,
    outCents: 729015,
  },
  {
    key: "m12",
    label: { en: "December 2025", ko: "2025년 12월" },
    short: { en: "Dec", ko: "12월" },
    inCents: 726000,
    outCents: 684520,
  },
  {
    key: "m01",
    label: { en: "January 2026", ko: "2026년 1월" },
    short: { en: "Jan", ko: "1월" },
    inCents: 642000,
    outCents: 518000,
  },
  {
    key: "m02",
    label: { en: "February 2026", ko: "2026년 2월" },
    short: { en: "Feb", ko: "2월" },
    inCents: 642000,
    outCents: 496050,
  },
  {
    key: "m03",
    label: { en: "March 2026", ko: "2026년 3월" },
    short: { en: "Mar", ko: "3월" },
    inCents: 642000,
    outCents: 781025,
  },
  {
    key: "m04",
    label: { en: "April 2026", ko: "2026년 4월" },
    short: { en: "Apr", ko: "4월" },
    inCents: 718000,
    outCents: 524000,
  },
  {
    key: "m05",
    label: { en: "May 2026", ko: "2026년 5월" },
    short: { en: "May", ko: "5월" },
    inCents: 642000,
    outCents: 601575,
  },
  {
    key: "m06",
    label: { en: "June 2026", ko: "2026년 6월" },
    short: { en: "Jun", ko: "6월" },
    inCents: 698000,
    outCents: 532040,
  },
  {
    key: "m07",
    label: { en: "July 2026", ko: "2026년 7월" },
    short: { en: "Jul", ko: "7월" },
    inCents: 642000,
    outCents: 814090,
  },
  {
    key: "m08",
    label: { en: "August 2026", ko: "2026년 8월" },
    short: { en: "Aug", ko: "8월" },
    inCents: 834000,
    outCents: 621030,
  },
];

export const FLOW: Record<PeriodId, readonly Bucket[]> = {
  week: WEEK_FLOW,
  month: MONTH_FLOW,
  year: YEAR_FLOW,
};

export type Totals = { inCents: number; outCents: number; netCents: number };

export function totalsOf(buckets: readonly Bucket[]): Totals {
  let inCents = 0;
  let outCents = 0;
  for (const b of buckets) {
    inCents += b.inCents;
    outCents += b.outCents;
  }
  return { inCents, outCents, netCents: inCents - outCents };
}

/** Hand set totals for the window immediately before the selected one. */
export const PREVIOUS: Record<PeriodId, Totals> = {
  week: { inCents: 240000, outCents: 161040, netCents: 78960 },
  month: { inCents: 642000, outCents: 814090, netCents: -172090 },
  year: { inCents: 7480000, outCents: 7120000, netCents: 360000 },
};

/* -------------------------------------------------------- spending mix */

const SPEND_WEIGHT: Record<PeriodId, Record<CategoryKey, number>> = {
  week: { housing: 8, food: 38, transport: 14, subs: 12, health: 4, leisure: 24 },
  month: { housing: 31, food: 24, transport: 10, subs: 9, health: 6, leisure: 20 },
  year: { housing: 34, food: 21, transport: 12, subs: 8, health: 9, leisure: 16 },
};

const SPEND_WEIGHT_PREV: Record<PeriodId, Record<CategoryKey, number>> = {
  week: { housing: 9, food: 31, transport: 16, subs: 12, health: 11, leisure: 21 },
  month: { housing: 29, food: 20, transport: 13, subs: 9, health: 8, leisure: 21 },
  year: { housing: 36, food: 19, transport: 13, subs: 7, health: 10, leisure: 15 },
};

export type Slice = {
  key: CategoryKey;
  label: Bi;
  cents: number;
  share: number;
  deltaPp: number;
  swatch: Swatch;
};

/** Weights are authored, cents are derived so the slices always sum to the total. */
export function spendBreakdown(period: PeriodId, outCents: number): Slice[] {
  const weights = SPEND_WEIGHT[period];
  const before = SPEND_WEIGHT_PREV[period];
  const rows: Slice[] = [];
  let used = 0;
  CATEGORY_ORDER.forEach((key, index) => {
    const last = index === CATEGORY_ORDER.length - 1;
    const cents = last ? outCents - used : Math.round((outCents * weights[key]) / 100);
    used += cents;
    rows.push({
      key,
      label: CATEGORY[key],
      cents,
      share: outCents === 0 ? 0 : (cents / outCents) * 100,
      deltaPp: weights[key] - before[key],
      swatch: CATEGORY_SWATCH[key],
    });
  });
  return rows.sort((a, b) => b.cents - a.cents);
}

/* ----------------------------------------------------------- transactions */

export type Txn = {
  id: string;
  day: number;
  dir: Direction;
  cents: number;
  party: Bi;
  kind: KindKey;
  cat: CategoryKey | null;
  card: CardId;
  note: Bi;
  ref: string;
};

export const TXNS: readonly Txn[] = [
  {
    id: "t01",
    day: 0,
    dir: "out",
    cents: 4820,
    party: { en: "Greenline Market", ko: "그린라인 마켓" },
    kind: "card",
    cat: "food",
    card: "everyday",
    note: { en: "Weekly groceries", ko: "주간 장보기" },
    ref: "GL-8841",
  },
  {
    id: "t02",
    day: 0,
    dir: "out",
    cents: 1290,
    party: { en: "Nimbus Drive", ko: "님버스 드라이브" },
    kind: "debit",
    cat: "subs",
    card: "everyday",
    note: { en: "Cloud storage, 2 TB", ko: "클라우드 저장소 2TB" },
    ref: "NB-0231",
  },
  {
    id: "t03",
    day: 1,
    dir: "out",
    cents: 6150,
    party: { en: "Halberd Fuel", ko: "할버드 주유소" },
    kind: "card",
    cat: "transport",
    card: "travel",
    note: { en: "Half a tank", ko: "주유 반 탱크" },
    ref: "HF-4420",
  },
  {
    id: "t04",
    day: 2,
    dir: "out",
    cents: 9600,
    party: { en: "Fernpost Pharmacy", ko: "펀포스트 약국" },
    kind: "card",
    cat: "health",
    card: "everyday",
    note: { en: "Prescription refill", ko: "처방약 재조제" },
    ref: "FP-1180",
  },
  {
    id: "t05",
    day: 2,
    dir: "in",
    cents: 180000,
    party: { en: "Alder & Vane Studio", ko: "앨더앤베인 스튜디오" },
    kind: "salary",
    cat: null,
    card: "everyday",
    note: { en: "Salary, second half of August", ko: "8월 후반기 급여" },
    ref: "PAY-0827",
  },
  {
    id: "t06",
    day: 3,
    dir: "out",
    cents: 34270,
    party: { en: "Brightpath Energy", ko: "브라이트패스 에너지" },
    kind: "debit",
    cat: "housing",
    card: "everyday",
    note: { en: "Electricity and gas", ko: "전기·가스 요금" },
    ref: "BP-0831",
  },
  {
    id: "t07",
    day: 4,
    dir: "out",
    cents: 21500,
    party: { en: "Solstice Cinema Club", ko: "솔스티스 시네마 클럽" },
    kind: "card",
    cat: "leisure",
    card: "travel",
    note: { en: "Two seats, late show", ko: "심야 상영 2석" },
    ref: "SC-7712",
  },
  {
    id: "t08",
    day: 4,
    dir: "out",
    cents: 18500,
    party: { en: "Rowan Table", ko: "로완 테이블" },
    kind: "card",
    cat: "food",
    card: "travel",
    note: { en: "Dinner out", ko: "외식" },
    ref: "RT-3390",
  },
  {
    id: "t09",
    day: 4,
    dir: "in",
    cents: 60000,
    party: { en: "Marrow Design Co.", ko: "매로우 디자인" },
    kind: "transfer",
    cat: null,
    card: "everyday",
    note: { en: "Side project, second invoice", ko: "사이드 프로젝트 2차 대금" },
    ref: "MD-0114",
  },
  {
    id: "t10",
    day: 5,
    dir: "out",
    cents: 15830,
    party: { en: "Coastline Transit", ko: "코스트라인 교통공사" },
    kind: "debit",
    cat: "transport",
    card: "everyday",
    note: { en: "Monthly travel pass", ko: "정기 교통권" },
    ref: "CT-0801",
  },
  {
    id: "t11",
    day: 6,
    dir: "out",
    cents: 6120,
    party: { en: "Kettle & Crumb", ko: "케틀앤크럼" },
    kind: "card",
    cat: "food",
    card: "everyday",
    note: { en: "Coffee and a pastry", ko: "커피와 페이스트리" },
    ref: "KC-2251",
  },
  {
    id: "t12",
    day: 9,
    dir: "out",
    cents: 185000,
    party: { en: "Ashfield Lettings", ko: "애시필드 임대" },
    kind: "debit",
    cat: "housing",
    card: "everyday",
    note: { en: "Rent, August", ko: "8월 월세" },
    ref: "AF-0822",
  },
  {
    id: "t13",
    day: 12,
    dir: "out",
    cents: 42900,
    party: { en: "Greenline Market", ko: "그린라인 마켓" },
    kind: "card",
    cat: "food",
    card: "everyday",
    note: { en: "Big shop, stocked the freezer", ko: "대량 장보기" },
    ref: "GL-8702",
  },
  {
    id: "t14",
    day: 15,
    dir: "in",
    cents: 180000,
    party: { en: "Alder & Vane Studio", ko: "앨더앤베인 스튜디오" },
    kind: "salary",
    cat: null,
    card: "everyday",
    note: { en: "Salary, first half of August", ko: "8월 전반기 급여" },
    ref: "PAY-0816",
  },
  {
    id: "t15",
    day: 17,
    dir: "out",
    cents: 8990,
    party: { en: "Orbit Sound", ko: "오빗 사운드" },
    kind: "debit",
    cat: "subs",
    card: "everyday",
    note: { en: "Music, family plan", ko: "음악 구독 패밀리" },
    ref: "OS-5510",
  },
  {
    id: "t16",
    day: 21,
    dir: "out",
    cents: 76400,
    party: { en: "Larkspur Clinic", ko: "라크스퍼 클리닉" },
    kind: "card",
    cat: "health",
    card: "everyday",
    note: { en: "Physio, three sessions", ko: "물리치료 3회" },
    ref: "LC-0904",
  },
  {
    id: "t17",
    day: 24,
    dir: "out",
    cents: 129000,
    party: { en: "Vessel Air", ko: "베슬 에어" },
    kind: "card",
    cat: "leisure",
    card: "travel",
    note: { en: "Two return seats, October", ko: "10월 왕복 2석" },
    ref: "VA-6621",
  },
  {
    id: "t18",
    day: 27,
    dir: "in",
    cents: 174000,
    party: { en: "Alder & Vane Studio", ko: "앨더앤베인 스튜디오" },
    kind: "salary",
    cat: null,
    card: "everyday",
    note: { en: "Half year bonus", ko: "반기 상여금" },
    ref: "BON-0804",
  },
  {
    id: "t23",
    day: 19,
    dir: "in",
    cents: 240000,
    party: { en: "Marrow Design Co.", ko: "매로우 디자인" },
    kind: "transfer",
    cat: null,
    card: "everyday",
    note: { en: "Side project, final milestone", ko: "사이드 프로젝트 최종 대금" },
    ref: "MD-0109",
  },
  {
    id: "t19",
    day: 40,
    dir: "in",
    cents: 12800,
    party: { en: "Vessel Air", ko: "베슬 에어" },
    kind: "refund",
    cat: null,
    card: "travel",
    note: { en: "Seat fee returned", ko: "좌석 수수료 환불" },
    ref: "VA-6410",
  },
  {
    id: "t20",
    day: 70,
    dir: "out",
    cents: 210000,
    party: { en: "Kestrel Movers", ko: "케스트럴 이사" },
    kind: "card",
    cat: "housing",
    card: "everyday",
    note: { en: "Move to the new flat", ko: "새 집 이사" },
    ref: "KM-2088",
  },
  {
    id: "t21",
    day: 96,
    dir: "in",
    cents: 180000,
    party: { en: "Alder & Vane Studio", ko: "앨더앤베인 스튜디오" },
    kind: "salary",
    cat: null,
    card: "everyday",
    note: { en: "Salary, second half of May", ko: "5월 후반기 급여" },
    ref: "PAY-0527",
  },
  {
    id: "t22",
    day: 120,
    dir: "out",
    cents: 96500,
    party: { en: "Northbrook Dental", ko: "노스브룩 치과" },
    kind: "card",
    cat: "health",
    card: "everyday",
    note: { en: "Two fillings", ko: "충치 치료 2건" },
    ref: "ND-3312",
  },
];

export function filterTxns(
  period: PeriodId,
  cat: CategoryKey | null,
  query: string,
): Txn[] {
  const days = periodOf(period).days;
  const needle = query.trim().toLowerCase();
  return TXNS.filter((t) => {
    if (t.day < 0 || t.day >= days) return false;
    if (cat !== null && t.cat !== cat) return false;
    if (needle.length === 0) return true;
    return (
      t.party.en.toLowerCase().includes(needle) ||
      t.party.ko.includes(needle) ||
      t.ref.toLowerCase().includes(needle)
    );
  });
}

function signedCents(t: Txn): number {
  return t.dir === "in" ? t.cents : -t.cents;
}

export function sortTxns(
  rows: readonly Txn[],
  key: SortKey,
  dir: SortDir,
  lang: Lang,
): Txn[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    let step = 0;
    if (key === "amount") step = signedCents(a) - signedCents(b);
    else if (key === "date") step = b.day - a.day;
    else {
      const left = a.party[lang];
      const right = b.party[lang];
      step = left < right ? -1 : left > right ? 1 : 0;
    }
    if (step === 0) step = a.id < b.id ? -1 : 1;
    return step * factor;
  });
}

export function sumOf(rows: readonly Txn[], ids: readonly string[]): number {
  let total = 0;
  for (const row of rows) {
    if (ids.includes(row.id)) total += signedCents(row);
  }
  return total;
}

/* ----------------------------------------------------------------- goals */

export type Goal = {
  id: string;
  name: Bi;
  note: Bi;
  savedCents: number;
  targetCents: number;
  monthlyCents: number;
  tone: "lime" | "emerald";
};

export const GOALS: readonly Goal[] = [
  {
    id: "safety",
    name: { en: "Safety net", ko: "비상금" },
    note: { en: "Six months of fixed costs", ko: "고정비 6개월치" },
    savedCents: 1240000,
    targetCents: 1800000,
    monthlyCents: 60000,
    tone: "lime",
  },
  {
    id: "home",
    name: { en: "Home deposit", ko: "전세 보증금" },
    note: { en: "Two bedrooms, north side", ko: "북측 방 두 개" },
    savedCents: 2850000,
    targetCents: 6000000,
    monthlyCents: 90000,
    tone: "emerald",
  },
];

export function goalOf(id: string): Goal {
  return GOALS.find((g) => g.id === id) ?? (GOALS[0] as Goal);
}

export function goalPct(goal: Goal): number {
  if (goal.targetCents === 0) return 0;
  return (goal.savedCents / goal.targetCents) * 100;
}

export function monthsLeft(goal: Goal): number {
  const gap = goal.targetCents - goal.savedCents;
  if (gap <= 0) return 0;
  if (goal.monthlyCents <= 0) return 0;
  return Math.ceil(gap / goal.monthlyCents);
}

export function savedTotal(): number {
  let total = 0;
  for (const goal of GOALS) total += goal.savedCents;
  return total;
}

/* ----------------------------------------------------------------- cards */

export type PaymentCard = {
  id: CardId;
  label: Bi;
  kind: Bi;
  last4: string;
  full: string;
  expiry: string;
  share: number;
};

export const CARDS: readonly PaymentCard[] = [
  {
    id: "everyday",
    label: { en: "Everyday", ko: "생활비" },
    kind: { en: "Debit", ko: "체크카드" },
    last4: "4172",
    full: "5219 8046 3315 4172",
    expiry: "09 / 29",
    share: 0.68,
  },
  {
    id: "travel",
    label: { en: "Travel", ko: "여행" },
    kind: { en: "Credit", ko: "신용카드" },
    last4: "9038",
    full: "4713 2260 8874 9038",
    expiry: "03 / 30",
    share: 0.32,
  },
];

export function cardOf(id: CardId): PaymentCard {
  return CARDS.find((c) => c.id === id) ?? (CARDS[0] as PaymentCard);
}

/* -------------------------------------------------------------- upcoming */

export type Due = { id: string; label: Bi; cat: CategoryKey; cents: number; inDays: number };

export const UPCOMING: readonly Due[] = [
  {
    id: "u1",
    label: { en: "Ashfield Lettings", ko: "애시필드 임대" },
    cat: "housing",
    cents: 185000,
    inDays: 2,
  },
  {
    id: "u2",
    label: { en: "Orbit Sound", ko: "오빗 사운드" },
    cat: "subs",
    cents: 8990,
    inDays: 5,
  },
  {
    id: "u3",
    label: { en: "Ridgeway Gym", ko: "리지웨이 짐" },
    cat: "health",
    cents: 6400,
    inDays: 9,
  },
];

export function upcomingTotal(): number {
  let total = 0;
  for (const due of UPCOMING) total += due.cents;
  return total;
}

/* ---------------------------------------------------------- notifications */

export type Alert = { id: string; title: Bi; body: Bi; day: number };

export const ALERTS: readonly Alert[] = [
  {
    id: "a1",
    title: { en: "Leisure is running hot", ko: "여가 지출이 빠릅니다" },
    body: {
      en: "Flights pushed leisure to a fifth of the month.",
      ko: "항공권 때문에 여가가 이번 달 지출의 5분의 1이 됐습니다.",
    },
    day: 1,
  },
  {
    id: "a2",
    title: { en: "Rent leaves in two days", ko: "이틀 뒤 월세가 나갑니다" },
    body: {
      en: "$1,850.00 to Ashfield Lettings.",
      ko: "애시필드 임대로 $1,850.00.",
    },
    day: 0,
  },
];
