export type Match = { id: string; title: string; grade: string; price: string; score: number };

// 결정론적 더미 (Math.random/Date.now 금지)
export const MATCHES: Match[] = [
  { id: "m1", title: "빈티지 카메라 · Contax T2", grade: "S", price: "₩480,000", score: 96 },
  { id: "m2", title: "가죽 자켓 · Schott 618", grade: "A", price: "₩210,000", score: 91 },
  { id: "m3", title: "기계식 시계 · Seiko SARB", grade: "A", price: "₩175,000", score: 88 },
  { id: "m4", title: "러그 · 페르시안 나인 60x90", grade: "B", price: "₩95,000", score: 82 },
];
