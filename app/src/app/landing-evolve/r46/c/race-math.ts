// Pure formatting helpers for the payout race. All deterministic — no Math.random.

import { SIMULATED_DAYS_STANDARD, SIMULATED_SECONDS_INSTANT } from "./data";

/** progress is a number in [0, 1]. */
export function instantEtaLabel(progress: number): string {
  if (progress >= 1) return "Arrived";
  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * SIMULATED_SECONDS_INSTANT));
  return `${secondsLeft}s left`;
}

export function standardEtaLabel(progress: number): string {
  if (progress >= 1) return "Arrived";
  const daysLeft = Math.min(
    SIMULATED_DAYS_STANDARD,
    Math.max(1, Math.ceil((1 - progress) * SIMULATED_DAYS_STANDARD)),
  );
  const dayNumber = SIMULATED_DAYS_STANDARD - daysLeft + 1;
  return `Day ${dayNumber} of ${SIMULATED_DAYS_STANDARD}`;
}

export function instantOutcomeSentence(): string {
  return "Instant payout: funds available now.";
}

export function standardOutcomeSentence(): string {
  return `Standard payout: funds available in ${SIMULATED_DAYS_STANDARD} business days.`;
}
