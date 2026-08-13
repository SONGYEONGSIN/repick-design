export type Lang = "en" | "ko";
export type Bi = { readonly en: string; readonly ko: string };
export type Direction = "in" | "out";
export type StreamFilter = Direction | "all";
export type StatusKey = "settled" | "pending" | "review";
export type PeriodId = "7d" | "30d" | "90d";
export type AccountId = "operating" | "payroll" | "reserve";
export type MethodKey = "ach" | "wire" | "card" | "internal" | "check";
export type CategoryKey =
  | "invoice"
  | "settlement"
  | "marketplace"
  | "rebate"
  | "interest"
  | "sweepIn"
  | "payroll"
  | "software"
  | "rent"
  | "inventory"
  | "logistics"
  | "utilities"
  | "tax"
  | "marketing"
  | "fees"
  | "capex";

/* ---------------------------------------------------------------- lexicon */

export const CATEGORY: Record<CategoryKey, Bi> = {
  invoice: { en: "Client invoices", ko: "거래처 청구" },
  settlement: { en: "Card settlements", ko: "카드 정산" },
  marketplace: { en: "Marketplace payouts", ko: "마켓 정산금" },
  rebate: { en: "Supplier rebates", ko: "공급사 리베이트" },
  interest: { en: "Interest", ko: "이자" },
  sweepIn: { en: "Internal funding", ko: "내부 자금 이동" },
  payroll: { en: "Payroll", ko: "급여" },
  software: { en: "Software", ko: "소프트웨어" },
  rent: { en: "Rent", ko: "임대료" },
  inventory: { en: "Inventory", ko: "재고 매입" },
  logistics: { en: "Logistics", ko: "물류" },
  utilities: { en: "Utilities", ko: "공과금" },
  tax: { en: "Taxes", ko: "세금" },
  marketing: { en: "Marketing", ko: "마케팅" },
  fees: { en: "Bank fees", ko: "은행 수수료" },
  capex: { en: "Equipment", ko: "설비" },
};

export const METHOD: Record<MethodKey, Bi> = {
  ach: { en: "ACH", ko: "자동이체" },
  wire: { en: "Wire", ko: "전신송금" },
  card: { en: "Card", ko: "카드" },
  internal: { en: "Internal", ko: "내부이체" },
  check: { en: "Check", ko: "수표" },
};

export const STATUS: Record<StatusKey, Bi> = {
  settled: { en: "Settled", ko: "완료" },
  pending: { en: "Pending", ko: "대기" },
  review: { en: "Review", ko: "확인 필요" },
};

export const UI = {
  wordmarkTag: { en: "Business banking", ko: "비즈니스 뱅킹" },
  pageTitle: { en: "Where the money moved", ko: "돈이 어디로 움직였나" },
  language: { en: "Language", ko: "언어" },
  period: { en: "Period", ko: "기간" },
  accounts: { en: "Accounts", ko: "계좌" },
  moneyIn: { en: "Money in", ko: "들어온 돈" },
  moneyOut: { en: "Money out", ko: "나간 돈" },
  net: { en: "Net movement", ko: "순이동" },
  versus: { en: "vs previous", ko: "직전 기간 대비" },
  up: { en: "up", ko: "증가" },
  down: { en: "down", ko: "감소" },
  flat: { en: "flat", ko: "변동 없음" },
  chartTitle: { en: "Daily in and out", ko: "기간별 입출금" },
  chartAbove: { en: "In, above the line", ko: "입금, 기준선 위" },
  chartBelow: { en: "Out, below the line", ko: "출금, 기준선 아래" },
  streamTitle: { en: "Movement stream", ko: "이동 스트림" },
  streamNote: { en: "Newest first", ko: "최신순" },
  filterAll: { en: "All", ko: "전체" },
  filterIn: { en: "In", ko: "입금" },
  filterOut: { en: "Out", ko: "출금" },
  filterGroup: { en: "Filter the stream", ko: "스트림 필터" },
  cameFrom: { en: "Came from", ko: "들어온 곳" },
  wentTo: { en: "Went to", ko: "나간 곳" },
  scheduled: { en: "Leaving next", ko: "곧 나갈 돈" },
  balance: { en: "Available balance", ko: "사용 가능 잔액" },
  holder: { en: "Ledgerline business account", ko: "레저라인 사업자 계좌" },
  detailOpen: { en: "Show detail", ko: "상세 보기" },
  detailClose: { en: "Hide detail", ko: "상세 닫기" },
  method: { en: "Method", ko: "수단" },
  reference: { en: "Reference", ko: "참조번호" },
  after: { en: "Balance after", ko: "거래 후 잔액" },
  category: { en: "Category", ko: "분류" },
  posted: { en: "Posted", ko: "처리일" },
  status: { en: "Status", ko: "상태" },
  count: { en: "movements", ko: "건" },
  share: { en: "share", ko: "비중" },
  empty: { en: "No movement in this window.", ko: "이 기간에는 이동이 없습니다." },
  totalIn: { en: "Total in", ko: "입금 합계" },
  totalOut: { en: "Total out", ko: "출금 합계" },
  fresh: { en: "new", ko: "신규" },
} satisfies Record<string, Bi>;

/* ------------------------------------------------------------------ dates */

function monthLength(month: number): number {
  if (month === 1) return 28;
  if (month === 3 || month === 5 || month === 8 || month === 10) return 30;
  return 31;
}

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

/** Day 0 is the anchor, 2026-07-31. Negative days point at the future. */
export function dayDate(day: number): { year: number; month: number; date: number } {
  let year = 2026;
  let month = 6;
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
  if (lang === "ko") return `${d.month + 1}.${d.date}`;
  return `${MONTH_EN[d.month] ?? ""} ${d.date}`;
}

export function dateFull(day: number, lang: Lang): string {
  const d = dayDate(day);
  if (lang === "ko") return `${d.year}.${d.month + 1}.${d.date}`;
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

/** USD, hand formatted: comma thousands, two decimals, no Intl. */
export function formatMoney(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  const tail = frac < 10 ? `0${frac}` : `${frac}`;
  return `${negative ? "-" : ""}$${groupDigits(String(whole))}.${tail}`;
}

export function formatSigned(cents: number, dir: Direction): string {
  return `${dir === "in" ? "+" : "-"}${formatMoney(Math.abs(cents))}`;
}

export function formatNet(cents: number): string {
  return `${cents >= 0 ? "+" : "-"}${formatMoney(Math.abs(cents))}`;
}

export function formatPct(value: number): string {
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

export function deltaOf(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function formatDelta(current: number, previous: number, lang: Lang): string {
  const delta = deltaOf(current, previous);
  if (delta === null) return UI.fresh[lang];
  const rounded = Math.round(delta * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

export function deltaWord(current: number, previous: number, lang: Lang): string {
  const delta = deltaOf(current, previous);
  if (delta === null) return UI.fresh[lang];
  if (delta > 0.05) return UI.up[lang];
  if (delta < -0.05) return UI.down[lang];
  return UI.flat[lang];
}

/* --------------------------------------------------------------- accounts */

export type Account = {
  id: AccountId;
  name: Bi;
  kind: Bi;
  last4: string;
  balance: number;
};

const OPERATING: Account = {
  id: "operating",
  name: { en: "Operating", ko: "운영 계좌" },
  kind: { en: "Checking", ko: "입출금" },
  last4: "4417",
  balance: 4281905,
};

const PAYROLL: Account = {
  id: "payroll",
  name: { en: "Payroll", ko: "급여 계좌" },
  kind: { en: "Checking", ko: "입출금" },
  last4: "2038",
  balance: 1596340,
};

const RESERVE: Account = {
  id: "reserve",
  name: { en: "Reserve", ko: "예비비 계좌" },
  kind: { en: "Savings", ko: "저축" },
  last4: "7761",
  balance: 12050000,
};

export const ACCOUNTS: readonly Account[] = [OPERATING, PAYROLL, RESERVE];

export function accountOf(id: AccountId): Account {
  return ACCOUNTS.find((a) => a.id === id) ?? OPERATING;
}

/* ---------------------------------------------------------------- periods */

export type Period = {
  id: PeriodId;
  days: number;
  buckets: number;
  span: number;
  label: Bi;
  short: Bi;
};

const P30: Period = {
  id: "30d",
  days: 30,
  buckets: 10,
  span: 3,
  label: { en: "last 30 days", ko: "지난 30일" },
  short: { en: "30D", ko: "30일" },
};

export const PERIODS: readonly Period[] = [
  {
    id: "7d",
    days: 7,
    buckets: 7,
    span: 1,
    label: { en: "last 7 days", ko: "지난 7일" },
    short: { en: "7D", ko: "7일" },
  },
  P30,
  {
    id: "90d",
    days: 90,
    buckets: 9,
    span: 10,
    label: { en: "last 90 days", ko: "지난 90일" },
    short: { en: "90D", ko: "90일" },
  },
];

export function periodOf(id: PeriodId): Period {
  return PERIODS.find((p) => p.id === id) ?? P30;
}

/** Hand set baselines for the window immediately before the selected one. */
export const BASELINE: Record<AccountId, Record<PeriodId, { in: number; out: number }>> = {
  operating: {
    "7d": { in: 3102400, out: 3118900 },
    "30d": { in: 5842300, out: 6905400 },
    "90d": { in: 9204600, out: 9760300 },
  },
  payroll: {
    "7d": { in: 2600000, out: 2588300 },
    "30d": { in: 5200000, out: 5166800 },
    "90d": { in: 7750000, out: 7702400 },
  },
  reserve: {
    "7d": { in: 1480300, out: 120000 },
    "30d": { in: 1402700, out: 640000 },
    "90d": { in: 2640800, out: 1900000 },
  },
};

/* ----------------------------------------------------------- transactions */

export type Txn = {
  id: string;
  account: AccountId;
  day: number;
  dir: Direction;
  cents: number;
  party: Bi;
  memo: Bi;
  cat: CategoryKey;
  method: MethodKey;
  last4: string;
  status: StatusKey;
  ref: string;
  balanceAfter: number;
};

type TxnSeed = Omit<Txn, "balanceAfter">;

const SEEDS: readonly TxnSeed[] = [
  {
    id: "op-01",
    account: "operating",
    day: 0,
    dir: "in",
    cents: 1284000,
    party: { en: "Northgate Timber Co.", ko: "노스게이트 팀버" },
    memo: { en: "Invoice 2291 paid in full", ko: "청구서 2291 전액 입금" },
    cat: "invoice",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "INV-2291",
  },
  {
    id: "op-02",
    account: "operating",
    day: 0,
    dir: "out",
    cents: 96450,
    party: { en: "Cloudreach Ops", ko: "클라우드리치 옵스" },
    memo: { en: "Team plan, 24 seats", ko: "팀 요금제 24석" },
    cat: "software",
    method: "card",
    last4: "8802",
    status: "settled",
    ref: "SUB-4410",
  },
  {
    id: "op-03",
    account: "operating",
    day: 1,
    dir: "out",
    cents: 412300,
    party: { en: "Harbor Freight Logistics", ko: "하버 프레이트 물류" },
    memo: { en: "Two pallets, coastal route", ko: "팔레트 2건 해안 노선" },
    cat: "logistics",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "BOL-7712",
  },
  {
    id: "op-04",
    account: "operating",
    day: 1,
    dir: "in",
    cents: 348900,
    party: { en: "Terminal settlement", ko: "카드 단말기 정산" },
    memo: { en: "Storefront batch, 61 sales", ko: "매장 정산 61건" },
    cat: "settlement",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "BAT-0918",
  },
  {
    id: "op-05",
    account: "operating",
    day: 2,
    dir: "out",
    cents: 1850000,
    party: { en: "Riverbend Property", ko: "리버벤드 프로퍼티" },
    memo: { en: "Workshop lease, August", ko: "작업장 임대료 8월분" },
    cat: "rent",
    method: "wire",
    last4: "4417",
    status: "settled",
    ref: "LSE-08",
  },
  {
    id: "op-06",
    account: "operating",
    day: 3,
    dir: "in",
    cents: 762400,
    party: { en: "Milbrook Interiors", ko: "밀브룩 인테리어" },
    memo: { en: "Invoice 2288, awaiting clearing", ko: "청구서 2288 정산 대기" },
    cat: "invoice",
    method: "ach",
    last4: "4417",
    status: "pending",
    ref: "INV-2288",
  },
  {
    id: "op-07",
    account: "operating",
    day: 3,
    dir: "out",
    cents: 238700,
    party: { en: "Stackline Supply", ko: "스택라인 서플라이" },
    memo: { en: "Hardware restock", ko: "부자재 재입고" },
    cat: "inventory",
    method: "card",
    last4: "8802",
    status: "settled",
    ref: "PO-5531",
  },
  {
    id: "op-08",
    account: "operating",
    day: 4,
    dir: "out",
    cents: 64900,
    party: { en: "Metro Power and Water", ko: "메트로 전력수도" },
    memo: { en: "Workshop utilities", ko: "작업장 공과금" },
    cat: "utilities",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "UTL-0731",
  },
  {
    id: "op-09",
    account: "operating",
    day: 5,
    dir: "in",
    cents: 1046500,
    party: { en: "Northline Market", ko: "노스라인 마켓" },
    memo: { en: "Marketplace payout, week 30", ko: "마켓 정산금 30주차" },
    cat: "marketplace",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "PAY-3390",
  },
  {
    id: "op-10",
    account: "operating",
    day: 5,
    dir: "out",
    cents: 179300,
    party: { en: "Pinecrest Media", ko: "파인크레스트 미디어" },
    memo: { en: "Campaign spend, flagged for review", ko: "캠페인 집행 확인 요청" },
    cat: "marketing",
    method: "card",
    last4: "8802",
    status: "review",
    ref: "CMP-118",
  },
  {
    id: "op-11",
    account: "operating",
    day: 6,
    dir: "out",
    cents: 12500,
    party: { en: "Ledgerline", ko: "레저라인" },
    memo: { en: "Account service fee", ko: "계좌 유지 수수료" },
    cat: "fees",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "FEE-07",
  },
  {
    id: "op-12",
    account: "operating",
    day: 6,
    dir: "in",
    cents: 42800,
    party: { en: "Stackline Supply", ko: "스택라인 서플라이" },
    memo: { en: "Volume rebate, quarter two", ko: "2분기 물량 리베이트" },
    cat: "rebate",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "CR-0221",
  },
  {
    id: "op-13",
    account: "operating",
    day: 8,
    dir: "out",
    cents: 523400,
    party: { en: "Stackline Supply", ko: "스택라인 서플라이" },
    memo: { en: "Oak panel order", ko: "오크 패널 발주" },
    cat: "inventory",
    method: "wire",
    last4: "4417",
    status: "settled",
    ref: "PO-5502",
  },
  {
    id: "op-14",
    account: "operating",
    day: 11,
    dir: "in",
    cents: 934200,
    party: { en: "Ashgrove Dental Group", ko: "애시그로브 치과그룹" },
    memo: { en: "Invoice 2274, fit out phase one", ko: "청구서 2274 1차 시공" },
    cat: "invoice",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "INV-2274",
  },
  {
    id: "op-15",
    account: "operating",
    day: 16,
    dir: "out",
    cents: 2640000,
    party: { en: "Payroll account", ko: "급여 계좌" },
    memo: { en: "Funding transfer for July run", ko: "7월 급여 자금 이체" },
    cat: "payroll",
    method: "internal",
    last4: "2038",
    status: "settled",
    ref: "TRF-0716",
  },
  {
    id: "op-16",
    account: "operating",
    day: 19,
    dir: "in",
    cents: 588300,
    party: { en: "Terminal settlement", ko: "카드 단말기 정산" },
    memo: { en: "Storefront batch, 44 sales", ko: "매장 정산 44건" },
    cat: "settlement",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "BAT-0902",
  },
  {
    id: "op-17",
    account: "operating",
    day: 23,
    dir: "out",
    cents: 341900,
    party: { en: "Harbor Freight Logistics", ko: "하버 프레이트 물류" },
    memo: { en: "Inbound freight, mill order", ko: "제재소 발주 입고 운임" },
    cat: "logistics",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "BOL-7688",
  },
  {
    id: "op-18",
    account: "operating",
    day: 27,
    dir: "in",
    cents: 1412700,
    party: { en: "Fairmont Clinics", ko: "페어몬트 클리닉" },
    memo: { en: "Invoice 2260, four locations", ko: "청구서 2260 4개 지점" },
    cat: "invoice",
    method: "wire",
    last4: "4417",
    status: "settled",
    ref: "INV-2260",
  },
  {
    id: "op-19",
    account: "operating",
    day: 29,
    dir: "out",
    cents: 88200,
    party: { en: "Gridpoint Analytics", ko: "그리드포인트 애널리틱스" },
    memo: { en: "Reporting add on", ko: "리포팅 부가 서비스" },
    cat: "software",
    method: "card",
    last4: "8802",
    status: "settled",
    ref: "SUB-4388",
  },
  {
    id: "op-20",
    account: "operating",
    day: 32,
    dir: "out",
    cents: 1850000,
    party: { en: "Riverbend Property", ko: "리버벤드 프로퍼티" },
    memo: { en: "Workshop lease, July", ko: "작업장 임대료 7월분" },
    cat: "rent",
    method: "wire",
    last4: "4417",
    status: "settled",
    ref: "LSE-07",
  },
  {
    id: "op-21",
    account: "operating",
    day: 41,
    dir: "in",
    cents: 1168400,
    party: { en: "Northgate Timber Co.", ko: "노스게이트 팀버" },
    memo: { en: "Invoice 2241 paid in full", ko: "청구서 2241 전액 입금" },
    cat: "invoice",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "INV-2241",
  },
  {
    id: "op-22",
    account: "operating",
    day: 52,
    dir: "out",
    cents: 726500,
    party: { en: "Stackline Supply", ko: "스택라인 서플라이" },
    memo: { en: "Seasonal stock build", ko: "시즌 재고 확보" },
    cat: "inventory",
    method: "wire",
    last4: "4417",
    status: "settled",
    ref: "PO-5460",
  },
  {
    id: "op-23",
    account: "operating",
    day: 63,
    dir: "in",
    cents: 2043900,
    party: { en: "Northline Market", ko: "노스라인 마켓" },
    memo: { en: "Marketplace payout, spring run", ko: "마켓 정산금 봄 시즌" },
    cat: "marketplace",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "PAY-3301",
  },
  {
    id: "op-24",
    account: "operating",
    day: 71,
    dir: "out",
    cents: 154800,
    party: { en: "State revenue office", ko: "국세 납부" },
    memo: { en: "Quarterly sales tax", ko: "분기 부가세" },
    cat: "tax",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "TAX-Q2",
  },
  {
    id: "op-25",
    account: "operating",
    day: 85,
    dir: "in",
    cents: 879600,
    party: { en: "Milbrook Interiors", ko: "밀브룩 인테리어" },
    memo: { en: "Invoice 2209 paid in full", ko: "청구서 2209 전액 입금" },
    cat: "invoice",
    method: "ach",
    last4: "4417",
    status: "settled",
    ref: "INV-2209",
  },
  {
    id: "pr-01",
    account: "payroll",
    day: 1,
    dir: "out",
    cents: 2418600,
    party: { en: "Salary batch", ko: "급여 지급" },
    memo: { en: "Semi monthly run, 24 people", ko: "정기 급여 24명" },
    cat: "payroll",
    method: "internal",
    last4: "2038",
    status: "settled",
    ref: "RUN-0716",
  },
  {
    id: "pr-02",
    account: "payroll",
    day: 2,
    dir: "in",
    cents: 2640000,
    party: { en: "Operating account", ko: "운영 계좌" },
    memo: { en: "Funding transfer received", ko: "자금 이체 수령" },
    cat: "sweepIn",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "TRF-0716",
  },
  {
    id: "pr-03",
    account: "payroll",
    day: 5,
    dir: "out",
    cents: 186400,
    party: { en: "Federal tax deposit", ko: "원천세 납부" },
    memo: { en: "Withholding, second half", ko: "원천징수 후반기분" },
    cat: "tax",
    method: "ach",
    last4: "2038",
    status: "settled",
    ref: "PTX-07B",
  },
  {
    id: "pr-04",
    account: "payroll",
    day: 15,
    dir: "out",
    cents: 2411200,
    party: { en: "Salary batch", ko: "급여 지급" },
    memo: { en: "Semi monthly run, 24 people", ko: "정기 급여 24명" },
    cat: "payroll",
    method: "internal",
    last4: "2038",
    status: "settled",
    ref: "RUN-0701",
  },
  {
    id: "pr-05",
    account: "payroll",
    day: 16,
    dir: "in",
    cents: 2640000,
    party: { en: "Operating account", ko: "운영 계좌" },
    memo: { en: "Funding transfer received", ko: "자금 이체 수령" },
    cat: "sweepIn",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "TRF-0701",
  },
  {
    id: "pr-06",
    account: "payroll",
    day: 20,
    dir: "out",
    cents: 178900,
    party: { en: "Federal tax deposit", ko: "원천세 납부" },
    memo: { en: "Withholding, first half", ko: "원천징수 전반기분" },
    cat: "tax",
    method: "ach",
    last4: "2038",
    status: "settled",
    ref: "PTX-07A",
  },
  {
    id: "pr-07",
    account: "payroll",
    day: 45,
    dir: "out",
    cents: 2388700,
    party: { en: "Salary batch", ko: "급여 지급" },
    memo: { en: "Semi monthly run, 23 people", ko: "정기 급여 23명" },
    cat: "payroll",
    method: "internal",
    last4: "2038",
    status: "settled",
    ref: "RUN-0616",
  },
  {
    id: "pr-08",
    account: "payroll",
    day: 46,
    dir: "in",
    cents: 2600000,
    party: { en: "Operating account", ko: "운영 계좌" },
    memo: { en: "Funding transfer received", ko: "자금 이체 수령" },
    cat: "sweepIn",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "TRF-0616",
  },
  {
    id: "rs-01",
    account: "reserve",
    day: 3,
    dir: "in",
    cents: 41900,
    party: { en: "Ledgerline", ko: "레저라인" },
    memo: { en: "Monthly interest credited", ko: "월 이자 지급" },
    cat: "interest",
    method: "internal",
    last4: "7761",
    status: "settled",
    ref: "INT-07",
  },
  {
    id: "rs-02",
    account: "reserve",
    day: 5,
    dir: "in",
    cents: 1500000,
    party: { en: "Operating account", ko: "운영 계좌" },
    memo: { en: "Surplus sweep", ko: "잉여 자금 스윕" },
    cat: "sweepIn",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "SWP-0726",
  },
  {
    id: "rs-03",
    account: "reserve",
    day: 20,
    dir: "out",
    cents: 900000,
    party: { en: "State revenue office", ko: "국세 납부" },
    memo: { en: "Set aside released for tax", ko: "세금 납부용 인출" },
    cat: "tax",
    method: "wire",
    last4: "7761",
    status: "settled",
    ref: "ESC-06",
  },
  {
    id: "rs-04",
    account: "reserve",
    day: 33,
    dir: "in",
    cents: 39600,
    party: { en: "Ledgerline", ko: "레저라인" },
    memo: { en: "Monthly interest credited", ko: "월 이자 지급" },
    cat: "interest",
    method: "internal",
    last4: "7761",
    status: "settled",
    ref: "INT-06",
  },
  {
    id: "rs-05",
    account: "reserve",
    day: 40,
    dir: "in",
    cents: 1200000,
    party: { en: "Operating account", ko: "운영 계좌" },
    memo: { en: "Surplus sweep", ko: "잉여 자금 스윕" },
    cat: "sweepIn",
    method: "internal",
    last4: "4417",
    status: "settled",
    ref: "SWP-0621",
  },
  {
    id: "rs-06",
    account: "reserve",
    day: 70,
    dir: "out",
    cents: 2400000,
    party: { en: "Cutwell Machinery", ko: "컷웰 머시너리" },
    memo: { en: "Mill upgrade, final payment", ko: "제재 라인 개선 잔금" },
    cat: "capex",
    method: "wire",
    last4: "7761",
    status: "settled",
    ref: "CAP-0512",
  },
  {
    id: "rs-07",
    account: "reserve",
    day: 88,
    dir: "in",
    cents: 37800,
    party: { en: "Ledgerline", ko: "레저라인" },
    memo: { en: "Monthly interest credited", ko: "월 이자 지급" },
    cat: "interest",
    method: "internal",
    last4: "7761",
    status: "settled",
    ref: "INT-05",
  },
];

function buildTransactions(): Txn[] {
  const built: Txn[] = [];
  for (const account of ACCOUNTS) {
    const rows = SEEDS.filter((s) => s.account === account.id).sort((a, b) =>
      a.day === b.day ? (a.id < b.id ? -1 : 1) : a.day - b.day,
    );
    let running = account.balance;
    for (const row of rows) {
      built.push({ ...row, balanceAfter: running });
      running = row.dir === "in" ? running - row.cents : running + row.cents;
    }
  }
  return built;
}

export const TRANSACTIONS: readonly Txn[] = buildTransactions();

/* -------------------------------------------------------------- scheduled */

export type Scheduled = {
  id: string;
  account: AccountId;
  day: number;
  cents: number;
  party: Bi;
  cat: CategoryKey;
  method: MethodKey;
};

export const SCHEDULED: readonly Scheduled[] = [
  {
    id: "sc-01",
    account: "operating",
    day: -2,
    cents: 96450,
    party: { en: "Cloudreach Ops", ko: "클라우드리치 옵스" },
    cat: "software",
    method: "card",
  },
  {
    id: "sc-02",
    account: "operating",
    day: -6,
    cents: 2640000,
    party: { en: "Payroll account", ko: "급여 계좌" },
    cat: "payroll",
    method: "internal",
  },
  {
    id: "sc-03",
    account: "operating",
    day: -9,
    cents: 341900,
    party: { en: "Harbor Freight Logistics", ko: "하버 프레이트 물류" },
    cat: "logistics",
    method: "ach",
  },
  {
    id: "sc-04",
    account: "payroll",
    day: -1,
    cents: 2418600,
    party: { en: "Salary batch", ko: "급여 지급" },
    cat: "payroll",
    method: "internal",
  },
  {
    id: "sc-05",
    account: "payroll",
    day: -5,
    cents: 186400,
    party: { en: "Federal tax deposit", ko: "원천세 납부" },
    cat: "tax",
    method: "ach",
  },
  {
    id: "sc-06",
    account: "reserve",
    day: -4,
    cents: 1500000,
    party: { en: "Operating account", ko: "운영 계좌" },
    cat: "sweepIn",
    method: "internal",
  },
];

/* ------------------------------------------------------------ aggregation */

export type Totals = {
  inCents: number;
  outCents: number;
  netCents: number;
  inCount: number;
  outCount: number;
};

export function txnsFor(account: AccountId, period: PeriodId): Txn[] {
  const days = periodOf(period).days;
  return TRANSACTIONS.filter((t) => t.account === account && t.day >= 0 && t.day < days);
}

export function totalsOf(rows: readonly Txn[]): Totals {
  let inCents = 0;
  let outCents = 0;
  let inCount = 0;
  let outCount = 0;
  for (const row of rows) {
    if (row.dir === "in") {
      inCents += row.cents;
      inCount += 1;
    } else {
      outCents += row.cents;
      outCount += 1;
    }
  }
  return { inCents, outCents, netCents: inCents - outCents, inCount, outCount };
}

export type Group = { key: CategoryKey; label: Bi; cents: number; count: number };

export function byCategory(rows: readonly Txn[], dir: Direction): Group[] {
  const map = new Map<CategoryKey, Group>();
  for (const row of rows) {
    if (row.dir !== dir) continue;
    const found = map.get(row.cat);
    if (found) {
      found.cents += row.cents;
      found.count += 1;
    } else {
      map.set(row.cat, { key: row.cat, label: CATEGORY[row.cat], cents: row.cents, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.cents - a.cents);
}

export type DayGroup = { day: number; rows: Txn[]; inCents: number; outCents: number };

export function byDay(rows: readonly Txn[]): DayGroup[] {
  const map = new Map<number, DayGroup>();
  for (const row of rows) {
    const found = map.get(row.day);
    const target = found ?? { day: row.day, rows: [], inCents: 0, outCents: 0 };
    target.rows.push(row);
    if (row.dir === "in") target.inCents += row.cents;
    else target.outCents += row.cents;
    map.set(row.day, target);
  }
  return [...map.values()].sort((a, b) => a.day - b.day);
}

export type Bucket = { day: number; span: number; inCents: number; outCents: number };

export function bucketsOf(rows: readonly Txn[], period: PeriodId): Bucket[] {
  const p = periodOf(period);
  const list: Bucket[] = [];
  for (let i = 0; i < p.buckets; i += 1) {
    const newest = (p.buckets - 1 - i) * p.span;
    const oldest = newest + p.span - 1;
    let inCents = 0;
    let outCents = 0;
    for (const row of rows) {
      if (row.day < newest || row.day > oldest) continue;
      if (row.dir === "in") inCents += row.cents;
      else outCents += row.cents;
    }
    list.push({ day: newest, span: p.span, inCents, outCents });
  }
  return list;
}
