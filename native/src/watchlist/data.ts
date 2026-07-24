// native/src/watchlist/data.ts — 관심목록 결정론 더미
// (랜덤·현재시각 등 비결정 API 금지 — 전부 고정값·순수 계산)

export type WatchItem = {
  id: string;
  title: string;
  original: number; // 관심 등록 시점 가격(원) — 고정값
  current: number; // 현재 가격(원) — 고정값
  alertOn: boolean; // 가격 알림 초기 상태 — 결정론 고정값
  priceSeries: number[]; // 최근 12일 가격 추세(원) — 결정론 고정값, 마지막 = current
};

// AI 매칭 결과(MATCHES)와 구분되는 관심목록 도메인 데이터.
// priceSeries: 랜덤·현재시각 없이 손으로 고정한 12포인트 추세(마지막 = current).
export const WATCHLIST: WatchItem[] = [
  {
    id: "w1", title: "필름 카메라 · Olympus mju II", original: 320000, current: 289000, alertOn: true,
    priceSeries: [320000, 316000, 312000, 305000, 301000, 298000, 296000, 294000, 292000, 291000, 290000, 289000],
  },
  {
    id: "w2", title: "데님 자켓 · Levi's Type III", original: 145000, current: 145000, alertOn: false,
    priceSeries: [145000, 146000, 145000, 144000, 145000, 146000, 145000, 145000, 144000, 145000, 145000, 145000],
  },
  {
    id: "w3", title: "빈티지 앰프 · Marantz 2270", original: 890000, current: 940000, alertOn: true,
    priceSeries: [890000, 895000, 900000, 908000, 915000, 920000, 925000, 928000, 932000, 936000, 938000, 940000],
  },
  {
    id: "w4", title: "만년필 · Pilot Custom 823", original: 260000, current: 228000, alertOn: false,
    priceSeries: [260000, 255000, 250000, 246000, 242000, 239000, 236000, 234000, 231000, 230000, 229000, 228000],
  },
  {
    id: "w5", title: "라운지 체어 · Eames Soft Pad", original: 1200000, current: 1150000, alertOn: true,
    priceSeries: [1200000, 1195000, 1188000, 1182000, 1178000, 1172000, 1168000, 1164000, 1160000, 1156000, 1153000, 1150000],
  },
];

// 천단위 구분 원화 표기 — toLocaleString 미사용(환경 독립·결정론 보장).
export function formatKRW(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩${digits}`;
}

export type PriceChange = { kind: "drop" | "rise" | "flat"; label: string };

// 원가 대비 현재가 변동 → 배지 텍스트(결정론 계산, 부수효과 없음).
export function priceChange(item: WatchItem): PriceChange {
  const delta = item.current - item.original;
  if (delta < 0) return { kind: "drop", label: `인하 ${formatKRW(-delta)}` };
  if (delta > 0) return { kind: "rise", label: `인상 ${formatKRW(delta)}` };
  return { kind: "flat", label: "변동 없음" };
}

// 시계열 등락률(%) — (마지막-처음)/처음, 소수 1자리. 결정론 순수 계산.
export function seriesChangePct(series: number[]): number {
  if (series.length < 2 || series[0] === 0) return 0;
  const delta = series[series.length - 1] - series[0];
  return Math.round((delta / series[0]) * 1000) / 10;
}

// 등락 텍스트 병기 — 색이 아닌 부호(+/−)로 방향(단일 액센트 DNA · "색만으로 전달 금지").
export function pctLabel(series: number[]): string {
  const p = seriesChangePct(series);
  const sign = p > 0 ? "+" : ""; // 음수는 이미 '-' 포함
  return `${sign}${p.toFixed(1)}%`;
}
