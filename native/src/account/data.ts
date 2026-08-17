// native/src/account/data.ts — auto-native-r2 candidate c (Account & Preferences)
// Deterministic dummy data only — no Math.random / Date.now / argument-less new Date().
// Adjustable settings below start from a fixed initial value; the *change* happens via
// user interaction (useState in Preferences.tsx) — that is fine, determinism only governs
// the initial/dummy data, not runtime interaction.

export type Profile = {
  name: string;
  initials: string;
  handle: string;
  memberSince: string;
  savedCount: number;
  activeWatchCount: number;
};

// Distinct from WATCHLIST/MATCHES — this is the signed-in identity shown on the settings screen,
// not a listing. Numbers are fixed narrative facts, not derived from this screen's own toggles.
export const PROFILE: Profile = {
  name: "Jordan Lee",
  initials: "JL",
  handle: "@jordan.lee",
  memberSince: "Member since Mar 2024",
  savedCount: 18,
  activeWatchCount: 6,
};

export type ToggleRow = {
  kind: "toggle";
  id: string;
  label: string;
  description: string;
  initial: boolean;
};

export type StepperRow = {
  kind: "stepper";
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit: "%" | "KRW";
};

export type SegmentedRow = {
  kind: "segmented";
  id: string;
  label: string;
  description: string;
  options: readonly string[];
  initial: number; // selected option index
};

export type DisplayRow = {
  kind: "display";
  id: string;
  label: string;
  value: string;
};

export type ActionRow = {
  kind: "action";
  id: string;
  label: string;
  description: string;
  tone: "default" | "destructive";
};

export type SettingRow = ToggleRow | StepperRow | SegmentedRow | DisplayRow | ActionRow;

export type SettingSection = {
  key: string;
  title: string;
  footer: string;
  data: SettingRow[];
};

// Three grouped sections. Order = Notifications → Price Alert Thresholds → Account, matching the
// brief's macro skeleton (identity card → grouped preference sections, no pinned bottom bar).
export const SECTIONS: SettingSection[] = [
  {
    key: "notifications",
    title: "Notifications",
    footer: "Alerts are sent to this device and your email on file.",
    data: [
      {
        kind: "toggle",
        id: "push",
        label: "Push notifications",
        description: "Alerts on this device",
        initial: true,
      },
      {
        kind: "toggle",
        id: "email",
        label: "Email digest",
        description: "Weekly summary of saved items",
        initial: false,
      },
      {
        kind: "toggle",
        id: "newMatch",
        label: "New match alerts",
        description: "AI finds a new match for a saved search",
        initial: true,
      },
      {
        kind: "segmented",
        id: "frequency",
        label: "Alert frequency",
        description: "How often price-drop alerts are sent",
        options: ["Instant", "Daily", "Weekly"],
        initial: 0,
      },
    ],
  },
  {
    key: "thresholds",
    title: "Price Alert Thresholds",
    footer: "Thresholds apply to every item on your watchlist.",
    data: [
      {
        kind: "stepper",
        id: "dropPct",
        label: "Notify when price drops below",
        description: "Percent below the price it had when saved",
        min: 5,
        max: 50,
        step: 5,
        initial: 20,
        unit: "%",
      },
      {
        kind: "stepper",
        id: "priceCap",
        label: "Only alert under",
        description: "Skip alerts for items priced above this",
        min: 50000,
        max: 500000,
        step: 25000,
        initial: 150000,
        unit: "KRW",
      },
      {
        kind: "toggle",
        id: "auctionStyle",
        label: "Include auction-style listings",
        description: "Also watch bid-based listings for drops",
        initial: true,
      },
    ],
  },
  {
    key: "account",
    title: "Account",
    footer: "Sign-out applies to this device only.",
    data: [
      {
        kind: "segmented",
        id: "currency",
        label: "Currency",
        description: "Prices shown across the app",
        options: ["KRW", "USD"],
        initial: 0,
      },
      {
        kind: "toggle",
        id: "faceId",
        label: "Face ID unlock",
        description: "Use device biometrics to open repick",
        initial: false,
      },
      {
        kind: "display",
        id: "memberId",
        label: "Member ID",
        value: "RPK-208441",
      },
      {
        kind: "action",
        id: "signout",
        label: "Sign out",
        description: "You'll need to sign in again on this device",
        tone: "destructive",
      },
    ],
  },
];

// Union of every row's runtime value: boolean (toggle) | number (stepper amount, or segmented
// selected index) | undefined (display/action rows carry no adjustable value).
export type SettingsState = Record<string, boolean | number>;

// Builds the initial interactive state from the fixed SECTIONS data above — pure function of
// fixed input, no randomness, safe to call from useState(() => initialSettingsState()).
export function initialSettingsState(): SettingsState {
  const state: SettingsState = {};
  for (const section of SECTIONS) {
    for (const row of section.data) {
      if (row.kind === "toggle") state[row.id] = row.initial;
      else if (row.kind === "stepper") state[row.id] = row.initial;
      else if (row.kind === "segmented") state[row.id] = row.initial;
    }
  }
  return state;
}

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
export function formatKRW(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩${digits}`;
}

// Renders a stepper row's current value with its unit — the one shared formatting rule for
// both stepper rows (percent vs. KRW), so the screen never hand-formats a number inline.
export function formatStepperValue(row: StepperRow, value: number): string {
  return row.unit === "%" ? `${value}%` : formatKRW(value);
}

export function clampStep(value: number, row: StepperRow): number {
  return Math.min(row.max, Math.max(row.min, value));
}

// 0–100 fill position for the row's visual track — pure arithmetic, deterministic.
export function trackFillPct(value: number, row: StepperRow): number {
  if (row.max === row.min) return 0;
  return ((value - row.min) / (row.max - row.min)) * 100;
}
