// native/src/detail/data.ts — 가격 히스토리 상세(결정론). Math.random/Date.now 금지.
export type PricePoint = { day: string; price: number };
export type ProductDetail = { title: string; grade: string; current: number; history: PricePoint[] };

// 14일 가격(원) 고정 배열 → history 생성(순수 map, 비결정 API 없음).
const PRICES = [520000, 515000, 510000, 505000, 500000, 498000, 495000, 492000, 490000, 487000, 485000, 483000, 481000, 480000];

export const DETAIL: ProductDetail = {
  title: "빈티지 카메라 · Contax T2",
  grade: "S",
  current: PRICES[PRICES.length - 1],
  history: PRICES.map((price, i) => {
    const ago = PRICES.length - 1 - i;
    return { day: ago === 0 ? "오늘" : `${ago}일 전`, price };
  }),
};

// 만원 단위 축 라벨: 480000 → "48만".
export function formatManwon(won: number): string {
  return `${Math.round(won / 10000)}만`;
}

// 천단위 구분 원화(환경 독립·결정론).
export function formatWon(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${won < 0 ? "-" : ""}₩${digits}`;
}

// 히스토리 등락률(%) — (마지막-처음)/처음, 소수 1자리.
export function historyChangePct(history: PricePoint[]): number {
  if (history.length < 2 || history[0].price === 0) return 0;
  const delta = history[history.length - 1].price - history[0].price;
  return Math.round((delta / history[0].price) * 1000) / 10;
}

// 등락 텍스트 병기(색 아닌 부호 — 단일 액센트 DNA).
export function pctText(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}
