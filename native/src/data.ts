export type MatchFactor = { label: string; value: number }; // 0~100, 결정론 고정값
export type Match = { id: string; title: string; grade: string; price: string; score: number; factors: MatchFactor[] };

// 결정론적 더미 (Math.random/Date.now 금지). factors 평균 ≈ score.
export const MATCHES: Match[] = [
  {
    id: "m1", title: "빈티지 카메라 · Contax T2", grade: "S", price: "₩480,000", score: 96,
    factors: [{ label: "컨디션", value: 98 }, { label: "가격", value: 92 }, { label: "희소성", value: 99 }, { label: "수요", value: 95 }],
  },
  {
    id: "m2", title: "가죽 자켓 · Schott 618", grade: "A", price: "₩210,000", score: 91,
    factors: [{ label: "컨디션", value: 90 }, { label: "가격", value: 94 }, { label: "희소성", value: 88 }, { label: "수요", value: 92 }],
  },
  {
    id: "m3", title: "기계식 시계 · Seiko SARB", grade: "A", price: "₩175,000", score: 88,
    factors: [{ label: "컨디션", value: 86 }, { label: "가격", value: 90 }, { label: "희소성", value: 84 }, { label: "수요", value: 92 }],
  },
  {
    id: "m4", title: "러그 · 페르시안 나인 60x90", grade: "B", price: "₩95,000", score: 82,
    factors: [{ label: "컨디션", value: 80 }, { label: "가격", value: 88 }, { label: "희소성", value: 78 }, { label: "수요", value: 82 }],
  },
];
