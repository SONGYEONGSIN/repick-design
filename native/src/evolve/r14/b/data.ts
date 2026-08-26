// native/src/evolve/r14/b/data.ts — deterministic dummy data for InviteRewardsScreen
// No Math.random / Date.now / argument-less `new Date()` anywhere below (GENERATION.md §5).

export type MilestoneStatus = "achieved" | "next" | "locked";

export type Milestone = {
  id: string;
  threshold: number; // invites required to unlock
  title: string; // reward name
  detail: string; // reward description
  creditWon?: number; // present only for cash-credit rewards, used in the earned-so-far tally
};

// A referral code the app would normally mint server-side — fixed literal here, not generated
// at render time.
export const INVITE_CODE = "REPICK-4Q7K2X";

export const CURRENT_INVITES = 4;

export const MILESTONES: Milestone[] = [
  {
    id: "m1",
    threshold: 1,
    title: "First invite bonus",
    detail: "5,000 KRW credit added to your wallet",
    creditWon: 5000,
  },
  {
    id: "m3",
    threshold: 3,
    title: "Referrer badge",
    detail: "A referrer badge appears on your profile",
  },
  {
    id: "m5",
    threshold: 5,
    title: "Selling fee discount",
    detail: "0.5% off your selling fee for the next 3 months",
  },
  {
    id: "m10",
    threshold: 10,
    title: "Bigger credit",
    detail: "50,000 KRW credit added to your wallet",
    creditWon: 50000,
  },
  {
    id: "m15",
    threshold: 15,
    title: "Top Referrer status",
    detail: "Priority support and an exclusive profile badge",
  },
] as const;

export function statusFor(milestone: Milestone, invites: number, nextId: string | null): MilestoneStatus {
  if (invites >= milestone.threshold) return "achieved";
  if (milestone.id === nextId) return "next";
  return "locked";
}

// The first milestone not yet reached — null if every milestone is already achieved.
export function nextMilestoneOf(invites: number): Milestone | null {
  return MILESTONES.find((m) => invites < m.threshold) ?? null;
}

export function creditEarnedSoFar(invites: number): number {
  return MILESTONES.filter((m) => invites >= m.threshold && m.creditWon).reduce(
    (sum, m) => sum + (m.creditWon ?? 0),
    0,
  );
}

export function badgesEarnedSoFar(invites: number): number {
  return MILESTONES.filter((m) => invites >= m.threshold && !m.creditWon).length;
}

export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Visible gap between ₩ and the digits, matching the vetted convention from
  // native/src/payout/data.ts — the glyph's stroke otherwise crowds the adjacent digit.
  return `₩ ${withCommas}`;
}

export const SHARE_FEEDBACK = `Invite code ${INVITE_CODE} is ready to send — share it anywhere.`;
export const COPY_FEEDBACK = `Invite code ${INVITE_CODE} copied.`;
