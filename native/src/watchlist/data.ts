// native/src/watchlist/data.ts — 관심목록 결정론 더미
// (랜덤·현재시각 등 비결정 API 금지 — 전부 고정값·순수 계산)

export type WatchItem = {
  id: string;
  title: string;
  original: number; // 관심 등록 시점 가격(원) — 고정값
  current: number; // 현재 가격(원) — 고정값
  alertOn: boolean; // 가격 알림 초기 상태 — 결정론 고정값
};

// AI 매칭 결과(MATCHES)와 구분되는 관심목록 도메인 데이터.
export const WATCHLIST: WatchItem[] = [
  { id: "w1", title: "필름 카메라 · Olympus mju II", original: 320000, current: 289000, alertOn: true },
  { id: "w2", title: "데님 자켓 · Levi's Type III", original: 145000, current: 145000, alertOn: false },
  { id: "w3", title: "빈티지 앰프 · Marantz 2270", original: 890000, current: 940000, alertOn: true },
  { id: "w4", title: "만년필 · Pilot Custom 823", original: 260000, current: 228000, alertOn: false },
  { id: "w5", title: "라운지 체어 · Eames Soft Pad", original: 1200000, current: 1150000, alertOn: true },
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
