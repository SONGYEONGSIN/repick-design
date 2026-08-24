/**
 * Tenure — renewal desk dataset.
 *
 * Everything here is hand-authored or derived by pure arithmetic from hand-authored inputs.
 * No randomness and no clock reads of any kind — the same bytes render on the server and on the
 * client, which is also what keeps hydration stable. Dates are integer arithmetic over an authored
 * renewal year/month, never a Date instance.
 *
 * Consistency contracts held by construction:
 *   - `arr`      === licensed[12] * unitPrice
 *   - `priorArr` === licensed[0]  * priorUnitPrice
 *   - the monthly ticket counts are COUNTED from the generated ticket log, never authored twice
 *   - pipeline totals in the UI are `reduce`d from the same array the list renders
 *
 * All company names, people, and email addresses are invented for this fixture.
 */

export const MONTHS = 13; // T-12 … T-0 (renewal month)

export type TicketSeverity = "S1" | "S2" | "S3";
export type TicketStatus = "해결" | "진행" | "보류";
export type EventKind = "usage" | "support" | "commercial" | "stakeholder";

export type ContractEvent = {
  monthIndex: number;
  kind: EventKind;
  title: string;
  note: string;
};

export type Ticket = {
  id: string;
  monthIndex: number;
  day: number;
  title: string;
  severity: TicketSeverity;
  status: TicketStatus;
  assignee: string;
  assigneeInitials: string;
};

type RawContract = {
  id: string;
  company: string;
  segment: "Enterprise" | "Mid-Market" | "Growth";
  plan: string;
  ownerName: string;
  ownerEmail: string;
  renewYear: number;
  renewMonth: number;
  renewDay: number;
  daysOut: number;
  unitPrice: number;
  priorUnitPrice: number;
  runsPerSeat: number;
  baseRisk: number;
  licensed: number[];
  active: number[];
  ticketCounts: number[];
  events: ContractEvent[];
};

export type Contract = RawContract & {
  ownerInitials: string;
  arr: number;
  priorArr: number;
  ticketLog: Ticket[];
  ticketsByMonth: number[];
  openByMonth: number[];
  utilization: number[];
  runs: number[];
  risk: number[];
};

/** Expands `[[index, value], …]` into a 13-slot step series. */
function steps(pairs: Array<[number, number]>): number[] {
  const out: number[] = [];
  let current = pairs[0][1];
  for (let i = 0; i < MONTHS; i += 1) {
    for (const [at, value] of pairs) {
      if (at === i) current = value;
    }
    out.push(current);
  }
  return out;
}

/** Korean names: family name + first syllable of the given name. */
function initialsOf(name: string): string {
  return name.slice(0, 2);
}

/** Fixed seasonality applied to run volume so usage is not a straight multiple of seats. */
const SEASON = [1, 0.97, 1.04, 1.08, 0.92, 0.99, 1.06, 1.11, 0.95, 1.02, 1.07, 0.98, 1.03];

const TICKET_TITLES = [
  "SSO 세션이 조기 만료됨",
  "리포트 CSV 내보내기 실패",
  "웹훅 재시도 큐 적체",
  "대시보드 초기 로딩 10초 초과",
  "권한 그룹 동기화 누락",
  "API 레이트 리밋 초과 경보",
  "감사 로그 검색 결과 누락",
  "월간 청구 금액 불일치 문의",
  "SAML 인증서 갱신 절차 문의",
  "데이터 보존 정책 적용 오류",
  "알림 이메일 미발송 구간 발생",
  "좌석 자동 회수 규칙 문의",
  "IP 허용 목록 반영 지연",
  "샌드박스 환경 배포 실패",
];

const TICKET_DAYS = [4, 9, 13, 18, 21, 26, 6, 15, 23, 28];
const SEV_POOL: TicketSeverity[] = ["S3", "S2", "S3", "S1", "S2", "S3", "S2"];
const SUPPORT_ASSIGNEES = ["오세라", "남기훈", "최윤도", "표하람"];

/** Deterministic ticket log: month counts in, individual tickets out. */
function buildTicketLog(raw: RawContract, seed: number): Ticket[] {
  const out: Ticket[] = [];
  let k = seed;
  for (let m = 0; m < MONTHS; m += 1) {
    const count = raw.ticketCounts[m];
    for (let n = 0; n < count; n += 1) {
      const assignee = SUPPORT_ASSIGNEES[(k + m) % SUPPORT_ASSIGNEES.length];
      const status: TicketStatus =
        m <= 8 ? "해결" : (["해결", "진행", "보류"] as TicketStatus[])[(k + n + m) % 3];
      out.push({
        id: `${raw.id}-t${m}-${n}`,
        monthIndex: m,
        day: TICKET_DAYS[(k + n * 4) % TICKET_DAYS.length],
        title: TICKET_TITLES[k % TICKET_TITLES.length],
        severity: SEV_POOL[(k + m) % SEV_POOL.length],
        status,
        assignee,
        assigneeInitials: initialsOf(assignee),
      });
      k += 1;
    }
  }
  return out;
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

/**
 * Renewal risk as of month `i` — the number the vantage scrubber recomputes.
 * Utilisation pulls it down; a falling seat trend and fresh tickets push it up; `baseRisk`
 * carries the qualitative signals (sponsor churn, procurement posture) the series cannot see.
 */
function riskSeries(raw: RawContract, ticketsByMonth: number[], utilization: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < MONTHS; i += 1) {
    const trend3 = i >= 3 ? (raw.active[i] - raw.active[i - 3]) / raw.active[i - 3] : 0;
    const trend6 = i >= 6 ? (raw.active[i] - raw.active[i - 6]) / raw.active[i - 6] : 0;
    const score =
      50 -
      utilization[i] * 40 -
      trend3 * 68 -
      trend6 * 30 +
      ticketsByMonth[i] * 3.4 +
      (i > 0 ? ticketsByMonth[i - 1] : 0) * 1.7 +
      raw.baseRisk;
    out.push(clamp(Math.round(score), 6, 96));
  }
  return out;
}

function build(raw: RawContract, seed: number): Contract {
  const ticketLog = buildTicketLog(raw, seed);
  const ticketsByMonth = Array.from({ length: MONTHS }, (_, m) =>
    ticketLog.reduce((sum, t) => (t.monthIndex === m ? sum + 1 : sum), 0),
  );
  const openByMonth = Array.from({ length: MONTHS }, (_, m) =>
    ticketLog.reduce((sum, t) => (t.monthIndex === m && t.status !== "해결" ? sum + 1 : sum), 0),
  );
  const utilization = raw.active.map((a, i) => a / raw.licensed[i]);
  const runs = raw.active.map((a, i) => Math.round(a * raw.runsPerSeat * SEASON[i]));
  return {
    ...raw,
    ownerInitials: initialsOf(raw.ownerName),
    arr: raw.licensed[MONTHS - 1] * raw.unitPrice,
    priorArr: raw.licensed[0] * raw.priorUnitPrice,
    ticketLog,
    ticketsByMonth,
    openByMonth,
    utilization,
    runs,
    risk: riskSeries(raw, ticketsByMonth, utilization),
  };
}

const RAW: RawContract[] = [
  {
    id: "novalift",
    company: "노바리프트",
    segment: "Enterprise",
    plan: "Scale — 연간 선결제",
    ownerName: "정하윤",
    ownerEmail: "hayoon.jeong@tenure.example",
    renewYear: 2026,
    renewMonth: 9,
    renewDay: 30,
    daysOut: 37,
    unitPrice: 1_290_000,
    priorUnitPrice: 1_340_000,
    runsPerSeat: 34,
    baseRisk: 9,
    licensed: steps([
      [0, 140],
      [6, 200],
    ]),
    active: [116, 121, 124, 128, 131, 136, 152, 158, 151, 143, 136, 128, 121],
    ticketCounts: [1, 0, 2, 1, 3, 2, 4, 5, 6, 4, 5, 6, 4],
    events: [
      {
        monthIndex: 1,
        kind: "usage",
        title: "파일럿 팀 3곳 온보딩 완료",
        note: "물류·재무·CS 조직이 공용 워크스페이스로 합류했습니다.",
      },
      {
        monthIndex: 4,
        kind: "commercial",
        title: "200석 확장 계약 체결",
        note: "좌석 단가를 1,340,000원에서 1,290,000원으로 조정하며 60석을 선구매했습니다.",
      },
      {
        monthIndex: 6,
        kind: "stakeholder",
        title: "도입 스폰서 이직",
        note: "운영본부장 교체 이후 격주 리뷰가 중단된 상태입니다.",
      },
      {
        monthIndex: 9,
        kind: "support",
        title: "S1 장애 2건 연속 발생",
        note: "웹훅 재시도 큐 적체로 야간 배치가 두 차례 지연됐습니다.",
      },
      {
        monthIndex: 12,
        kind: "usage",
        title: "활성 좌석 6개월 연속 감소",
        note: "선구매한 200석 중 121석만 사용 중이라 감축 요구가 예상됩니다.",
      },
    ],
  },
  {
    id: "orbitpay",
    company: "오르빗페이",
    segment: "Growth",
    plan: "Team — 분기 청구",
    ownerName: "문태경",
    ownerEmail: "taekyung.mun@tenure.example",
    renewYear: 2026,
    renewMonth: 10,
    renewDay: 15,
    daysOut: 52,
    unitPrice: 940_000,
    priorUnitPrice: 1_010_000,
    runsPerSeat: 26,
    baseRisk: 5,
    licensed: steps([
      [0, 60],
      [9, 75],
    ]),
    active: [48, 52, 55, 57, 59, 58, 56, 58, 59, 66, 69, 71, 73],
    ticketCounts: [2, 1, 1, 0, 2, 1, 1, 2, 0, 1, 2, 1, 1],
    events: [
      {
        monthIndex: 2,
        kind: "usage",
        title: "정산 자동화 워크플로 가동",
        note: "일 마감 배치가 수기 절차를 대체하면서 주간 실행량이 두 배로 늘었습니다.",
      },
      {
        monthIndex: 4,
        kind: "stakeholder",
        title: "신규 챔피언 지정",
        note: "재무 플랫폼 리드가 사내 확산을 직접 맡기로 했습니다.",
      },
      {
        monthIndex: 7,
        kind: "support",
        title: "권한 그룹 동기화 이슈 종결",
        note: "디렉터리 매핑 규칙을 재정의해 재발 없이 마무리됐습니다.",
      },
      {
        monthIndex: 9,
        kind: "commercial",
        title: "75석 중간 증설",
        note: "정산팀 신규 인원을 흡수하며 15석을 추가했습니다.",
      },
      {
        monthIndex: 12,
        kind: "usage",
        title: "좌석 활용률 97% 도달",
        note: "다음 기간 증설 여지가 커 상향 제안 대상입니다.",
      },
    ],
  },
  {
    id: "curbside",
    company: "커브사이드랩",
    segment: "Mid-Market",
    plan: "Team — 연간",
    ownerName: "배소민",
    ownerEmail: "somin.bae@tenure.example",
    renewYear: 2026,
    renewMonth: 11,
    renewDay: 4,
    daysOut: 72,
    unitPrice: 720_000,
    priorUnitPrice: 700_000,
    runsPerSeat: 18,
    baseRisk: 11,
    licensed: steps([[0, 90]]),
    active: [74, 71, 69, 66, 63, 61, 58, 55, 52, 49, 47, 44, 41],
    ticketCounts: [1, 1, 0, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1],
    events: [
      {
        monthIndex: 0,
        kind: "commercial",
        title: "직전 갱신 시 단가 3% 인상",
        note: "구매팀이 인상 폭에 대한 이의를 기록으로 남겼습니다.",
      },
      {
        monthIndex: 3,
        kind: "stakeholder",
        title: "현장 운영조직 재편",
        note: "지점 단위 팀 두 곳이 통합되며 사용 계정이 정리됐습니다.",
      },
      {
        monthIndex: 5,
        kind: "usage",
        title: "주간 실행량 30% 감소",
        note: "재고 연동 워크플로가 내부 도구로 이관된 정황이 있습니다.",
      },
      {
        monthIndex: 8,
        kind: "commercial",
        title: "경쟁 제품 검토 언급",
        note: "분기 리뷰에서 대체 도구 벤치마크 진행 사실이 공유됐습니다.",
      },
      {
        monthIndex: 11,
        kind: "usage",
        title: "90석 중 44석만 활성",
        note: "좌석 감축 없이는 갱신이 어렵다는 신호가 명확합니다.",
      },
    ],
  },
  {
    id: "seum",
    company: "세움로지스",
    segment: "Mid-Market",
    plan: "Scale — 연간",
    ownerName: "임가온",
    ownerEmail: "gaon.lim@tenure.example",
    renewYear: 2026,
    renewMonth: 11,
    renewDay: 28,
    daysOut: 96,
    unitPrice: 610_000,
    priorUnitPrice: 640_000,
    runsPerSeat: 41,
    baseRisk: 6,
    licensed: steps([
      [0, 110],
      [4, 130],
    ]),
    active: [96, 101, 104, 108, 118, 121, 119, 123, 126, 124, 120, 116, 113],
    ticketCounts: [0, 1, 2, 1, 1, 0, 2, 1, 1, 2, 3, 2, 3],
    events: [
      {
        monthIndex: 2,
        kind: "usage",
        title: "배차 예측 모듈 도입",
        note: "야간 배치 실행량이 계약 기간 중 최고치를 기록했습니다.",
      },
      {
        monthIndex: 4,
        kind: "commercial",
        title: "130석으로 확장",
        note: "단가를 640,000원에서 610,000원으로 낮추며 20석을 추가했습니다.",
      },
      {
        monthIndex: 7,
        kind: "stakeholder",
        title: "분기 비즈니스 리뷰 정상 진행",
        note: "운영 KPI 3종이 목표치를 상회했습니다.",
      },
      {
        monthIndex: 9,
        kind: "support",
        title: "청구 금액 불일치 문의 접수",
        note: "중간 증설분의 일할 계산 방식에 대한 확인 요청이었습니다.",
      },
      {
        monthIndex: 12,
        kind: "usage",
        title: "활성 좌석 3개월 완만한 감소",
        note: "성수기 종료 후의 계절 효과인지 검증이 필요합니다.",
      },
    ],
  },
  {
    id: "hanbit",
    company: "한빛머티리얼즈",
    segment: "Enterprise",
    plan: "Scale — 연간 선결제",
    ownerName: "정하윤",
    ownerEmail: "hayoon.jeong@tenure.example",
    renewYear: 2026,
    renewMonth: 12,
    renewDay: 9,
    daysOut: 107,
    unitPrice: 1_050_000,
    priorUnitPrice: 1_030_000,
    runsPerSeat: 29,
    baseRisk: 7,
    licensed: steps([[0, 240]]),
    active: [198, 204, 210, 207, 213, 219, 224, 221, 228, 232, 229, 226, 222],
    ticketCounts: [2, 3, 1, 2, 2, 1, 3, 2, 2, 3, 4, 3, 5],
    events: [
      {
        monthIndex: 1,
        kind: "stakeholder",
        title: "전사 표준 도구로 지정",
        note: "생산·품질 부문이 사내 표준 절차서에 제품을 명시했습니다.",
      },
      {
        monthIndex: 4,
        kind: "usage",
        title: "품질 검사 워크플로 확대",
        note: "3개 공장으로 배포 범위가 넓어졌습니다.",
      },
      {
        monthIndex: 6,
        kind: "support",
        title: "감사 로그 요건 미충족 지적",
        note: "내부 감사에서 보존 기간 설정 오류가 발견됐습니다.",
      },
      {
        monthIndex: 9,
        kind: "support",
        title: "월간 티켓 4건으로 증가",
        note: "권한·감사 영역에 문의가 집중되고 있습니다.",
      },
      {
        monthIndex: 12,
        kind: "commercial",
        title: "보안 부가 모듈 견적 요청",
        note: "갱신과 함께 감사 모듈을 묶는 안을 검토 중입니다.",
      },
    ],
  },
  {
    id: "deltagrove",
    company: "델타그로브",
    segment: "Growth",
    plan: "Team — 분기 청구",
    ownerName: "문태경",
    ownerEmail: "taekyung.mun@tenure.example",
    renewYear: 2027,
    renewMonth: 1,
    renewDay: 6,
    daysOut: 135,
    unitPrice: 860_000,
    priorUnitPrice: 900_000,
    runsPerSeat: 22,
    baseRisk: 8,
    licensed: steps([
      [0, 45],
      [8, 60],
    ]),
    active: [38, 41, 39, 42, 44, 43, 43, 44, 47, 51, 54, 56, 58],
    ticketCounts: [1, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0, 1, 2],
    events: [
      {
        monthIndex: 0,
        kind: "commercial",
        title: "45석으로 초기 계약",
        note: "마케팅 조직 단독 도입으로 시작했습니다.",
      },
      {
        monthIndex: 3,
        kind: "usage",
        title: "캠페인 자동화 템플릿 도입",
        note: "반복 작업 비중이 줄고 주간 실행량이 안정화됐습니다.",
      },
      {
        monthIndex: 5,
        kind: "support",
        title: "알림 미발송 구간 발생",
        note: "이틀간 이메일 알림이 누락됐고 크레딧으로 정산했습니다.",
      },
      {
        monthIndex: 8,
        kind: "commercial",
        title: "60석 증설 및 단가 인하",
        note: "세일즈 조직 합류에 맞춰 단가를 860,000원으로 조정했습니다.",
      },
      {
        monthIndex: 11,
        kind: "stakeholder",
        title: "경영진 스폰서 확보",
        note: "성장 총괄이 다음 기간 예산을 이미 반영했습니다.",
      },
    ],
  },
  {
    id: "brixton",
    company: "브릭스톤 미디어",
    segment: "Mid-Market",
    plan: "Team — 연간",
    ownerName: "배소민",
    ownerEmail: "somin.bae@tenure.example",
    renewYear: 2027,
    renewMonth: 1,
    renewDay: 31,
    daysOut: 160,
    unitPrice: 540_000,
    priorUnitPrice: 560_000,
    runsPerSeat: 15,
    baseRisk: 10,
    licensed: steps([[0, 150]]),
    active: [128, 124, 131, 127, 119, 122, 116, 113, 118, 109, 104, 98, 94],
    ticketCounts: [1, 2, 1, 3, 2, 4, 3, 2, 3, 4, 3, 5, 4],
    events: [
      {
        monthIndex: 2,
        kind: "usage",
        title: "제작 파이프라인 이관 완료",
        note: "외주 편집 인력까지 포함해 계정이 최대치에 근접했습니다.",
      },
      {
        monthIndex: 4,
        kind: "support",
        title: "대용량 업로드 지연 반복",
        note: "월 3건 이상 성능 티켓이 접수되기 시작했습니다.",
      },
      {
        monthIndex: 7,
        kind: "stakeholder",
        title: "제작본부 인력 감축",
        note: "조직 개편으로 외주 계정이 대거 비활성화됐습니다.",
      },
      {
        monthIndex: 9,
        kind: "commercial",
        title: "예산 20% 삭감 통보",
        note: "구매팀이 갱신 금액 재협상 의사를 공식화했습니다.",
      },
      {
        monthIndex: 12,
        kind: "usage",
        title: "활성 좌석 100석 아래로",
        note: "150석 계약 대비 활용률이 63%까지 떨어졌습니다.",
      },
    ],
  },
  {
    id: "fineloop",
    company: "파인루프",
    segment: "Growth",
    plan: "Team — 월 청구",
    ownerName: "임가온",
    ownerEmail: "gaon.lim@tenure.example",
    renewYear: 2027,
    renewMonth: 2,
    renewDay: 18,
    daysOut: 178,
    unitPrice: 780_000,
    priorUnitPrice: 820_000,
    runsPerSeat: 31,
    baseRisk: 6,
    licensed: steps([
      [0, 30],
      [5, 40],
      [11, 55],
    ]),
    active: [26, 28, 29, 29, 30, 34, 36, 35, 37, 39, 38, 41, 46],
    ticketCounts: [0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    events: [
      {
        monthIndex: 1,
        kind: "usage",
        title: "연구 데이터 파이프라인 연결",
        note: "실험 로그 수집이 제품 안으로 들어왔습니다.",
      },
      {
        monthIndex: 4,
        kind: "commercial",
        title: "40석으로 1차 증설",
        note: "연구 인력 채용에 맞춰 10석을 추가했습니다.",
      },
      {
        monthIndex: 6,
        kind: "stakeholder",
        title: "연구소장 분기 리뷰 참석",
        note: "다음 기간 전사 확산 계획을 직접 공유했습니다.",
      },
      {
        monthIndex: 9,
        kind: "support",
        title: "샌드박스 배포 실패 1건",
        note: "당일 우회 절차로 해소돼 영향은 제한적이었습니다.",
      },
      {
        monthIndex: 11,
        kind: "commercial",
        title: "55석으로 2차 증설",
        note: "임상 데이터 팀 합류를 전제로 15석을 선반영했습니다.",
      },
    ],
  },
];

export const CONTRACTS: Contract[] = RAW.map((raw, index) => build(raw, index * 7 + 3));

/* ── formatting ─────────────────────────────────────────────────────────── */

const KRW = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});
const PLAIN = new Intl.NumberFormat("ko-KR");

export const krw = (value: number): string => KRW.format(value);
export const krwEok = (value: number): string => `₩${(value / 100_000_000).toFixed(2)}억`;
export const num = (value: number): string => PLAIN.format(value);
export const pct = (ratio: number): string => `${Math.round(ratio * 100)}%`;

/** Month labels for a contract, index 0 = T-12, index 12 = renewal month. */
export function monthLabels(contract: Contract): Array<{ long: string; short: string }> {
  const base = contract.renewYear * 12 + (contract.renewMonth - 1);
  const out: Array<{ long: string; short: string }> = [];
  for (let i = 0; i < MONTHS; i += 1) {
    const t = base - (MONTHS - 1 - i);
    const year = Math.floor(t / 12);
    const month = (t % 12) + 1;
    out.push({ long: `${year}년 ${month}월`, short: `${month}월` });
  }
  return out;
}

export function vantageLabel(index: number): string {
  return index === MONTHS - 1 ? "갱신 시점" : `T-${MONTHS - 1 - index}`;
}

export function renewalLabel(contract: Contract): string {
  return `${contract.renewYear}년 ${contract.renewMonth}월 ${contract.renewDay}일`;
}
