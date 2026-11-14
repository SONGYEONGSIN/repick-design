// native/src/evolve/r56/b/data.ts
//
// Deterministic dummy data + pure helpers for the price-drop alert settings
// screen. Nothing here reads the clock or any random source — the "last
// saved" timestamp is a fixed string, matching the DNA's determinism rule.

export type DropThresholdMode = "percent" | "amount";

export interface DropThresholdRule {
  mode: DropThresholdMode;
  value: number;
}

export interface AlertChannelChoices {
  push: boolean;
  email: boolean;
  inApp: boolean;
}

export interface QuietHoursWindow {
  enabled: boolean;
  startLabel: string;
  endLabel: string;
}

export interface AlertPreferencesDraft {
  threshold: DropThresholdRule;
  channels: AlertChannelChoices;
  quietHours: QuietHoursWindow;
}

export const THRESHOLD_MODE_RULES: Record<
  DropThresholdMode,
  { title: string; min: number; max: number; step: number; format: (value: number) => string }
> = {
  percent: {
    title: "Percent off",
    min: 5,
    max: 70,
    step: 5,
    format: (value) => `${value}% off`,
  },
  amount: {
    title: "Dollar amount off",
    min: 5,
    max: 200,
    step: 5,
    format: (value) => `$${value} off`,
  },
};

export const CHANNEL_DEFINITIONS: ReadonlyArray<{
  key: keyof AlertChannelChoices;
  label: string;
  hint: string;
}> = [
  { key: "push", label: "Push notifications", hint: "Sent to this device right away." },
  { key: "email", label: "Email", hint: "A daily digest if more than one item drops." },
  { key: "inApp", label: "In-app alerts", hint: "Shown on your saved items list only." },
];

export const QUIET_HOURS_START_OPTIONS: ReadonlyArray<string> = ["9:00 PM", "10:00 PM", "11:00 PM"];
export const QUIET_HOURS_END_OPTIONS: ReadonlyArray<string> = ["6:00 AM", "7:00 AM", "8:00 AM"];

export const LAST_SAVED_AT_LABEL = "Last saved Nov 10, 2026 at 9:14 AM";

export const INITIAL_ALERT_PREFERENCES: AlertPreferencesDraft = {
  threshold: { mode: "percent", value: 15 },
  channels: { push: true, email: true, inApp: false },
  quietHours: { enabled: true, startLabel: "10:00 PM", endLabel: "7:00 AM" },
};

/** Clamps a threshold value into the min/max/step grid of the given mode. */
export function clampThresholdValue(mode: DropThresholdMode, value: number): number {
  const rule = THRESHOLD_MODE_RULES[mode];
  const snapped = Math.round(value / rule.step) * rule.step;
  return Math.min(rule.max, Math.max(rule.min, snapped));
}

/**
 * Structural equality between a working draft and a saved baseline. This is
 * the one place "has this form changed" gets decided — nothing else in the
 * screen is allowed to hand-flip a dirty flag.
 */
export function draftMatchesBaseline(a: AlertPreferencesDraft, b: AlertPreferencesDraft): boolean {
  return (
    a.threshold.mode === b.threshold.mode &&
    a.threshold.value === b.threshold.value &&
    a.channels.push === b.channels.push &&
    a.channels.email === b.channels.email &&
    a.channels.inApp === b.channels.inApp &&
    a.quietHours.enabled === b.quietHours.enabled &&
    a.quietHours.startLabel === b.quietHours.startLabel &&
    a.quietHours.endLabel === b.quietHours.endLabel
  );
}

/**
 * Whether a draft is actually savable: at least one channel chosen, and the
 * threshold sitting inside its mode's valid range (never 0 or negative).
 */
export function draftIsSavable(draft: AlertPreferencesDraft): boolean {
  const hasChannel = draft.channels.push || draft.channels.email || draft.channels.inApp;
  const rule = THRESHOLD_MODE_RULES[draft.threshold.mode];
  const thresholdInRange = draft.threshold.value >= rule.min && draft.threshold.value <= rule.max;
  return hasChannel && thresholdInRange;
}
