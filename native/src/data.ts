export type MatchFactor = { label: string; value: number }; // 0-100, deterministic fixed value
export type Match = { id: string; title: string; grade: string; price: string; score: number; factors: MatchFactor[] };

// Deterministic dummy data (no Math.random/Date.now). factors average ≈ score.
export const MATCHES: Match[] = [
  {
    id: "m1", title: "Vintage camera · Contax T2", grade: "S", price: "₩480,000", score: 96,
    factors: [{ label: "Condition", value: 98 }, { label: "Price", value: 92 }, { label: "Rarity", value: 99 }, { label: "Demand", value: 95 }],
  },
  {
    id: "m2", title: "Leather jacket · Schott 618", grade: "A", price: "₩210,000", score: 91,
    factors: [{ label: "Condition", value: 90 }, { label: "Price", value: 94 }, { label: "Rarity", value: 88 }, { label: "Demand", value: 92 }],
  },
  {
    id: "m3", title: "Mechanical watch · Seiko SARB", grade: "A", price: "₩175,000", score: 88,
    factors: [{ label: "Condition", value: 86 }, { label: "Price", value: 90 }, { label: "Rarity", value: 84 }, { label: "Demand", value: 92 }],
  },
  {
    id: "m4", title: "Rug · Persian Nain 60x90", grade: "B", price: "₩95,000", score: 82,
    factors: [{ label: "Condition", value: 80 }, { label: "Price", value: 88 }, { label: "Rarity", value: 78 }, { label: "Demand", value: 82 }],
  },
];
