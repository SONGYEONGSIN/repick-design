// native/src/evolve/r13/a/data.ts — deterministic dummy data for PayoutScreen
// No Math.random / Date.now / argument-less `new Date()` anywhere below.

export type PresetAmount = {
  id: string;
  amountWon: number;
  displayLabel?: string;
};

export const AVAILABLE_BALANCE_WON = 486000;
export const PENDING_CLEARANCE_WON = 128000;
export const PENDING_CLEARANCE_ARRIVAL = "Aug 27, 2026";

export const MIN_WITHDRAWAL_WON = 10000;

export const BANK_ACCOUNT = {
  bankName: "KB Kookmin Bank",
  accountLast4: "1234",
  holderName: "Kang Jiho",
} as const;

export const PRESET_AMOUNTS: PresetAmount[] = [
  { id: "p1", amountWon: 50000 },
  { id: "p2", amountWon: 100000 },
  { id: "p3", amountWon: 200000 },
  { id: "max", amountWon: AVAILABLE_BALANCE_WON, displayLabel: "Max" },
];

export const ARRIVAL_ESTIMATE = "1-2 business days";

// Fixed literal, not generated at submit time — stands in for a server-assigned id.
export const PAYOUT_ID = "PYT-20260824-6031";

// Simulated network/processing delay before a submitted withdrawal resolves.
// A fixed duration, not a random one — see GENERATION.md §5.
export const PROCESSING_DELAY_MS = 900;

export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Visible gap between ₩ and the digits — the glyph's stroke otherwise
  // runs into the adjacent digit at body text size. See candidates/a.md.
  return `₩ ${withCommas}`;
}
