// native/src/evolve/r31/b/data.ts
// Deterministic dummy data for the Security Activity Log screen.
// No Math.random / Date.now / bare `new Date()` anywhere — every timestamp is a
// fixed ISO string plus a pre-formatted display string computed by hand.

export type EntryKind =
  | "signIn"
  | "signInFailed"
  | "passwordChanged"
  | "deviceVerified";

export type EntrySeverity = "neutral" | "success" | "warning" | "danger";

export interface ActivityEntry {
  id: string;
  kind: EntryKind;
  severity: EntrySeverity;
  deviceName: string;
  location: string;
  timestampIso: string;
  displayTime: string;
  summary: string;
  isCurrentDevice: boolean;
  /** Set once "Sign Out Other Devices" has been run against this row's session. */
  sessionEndedIso?: string;
  sessionEndedDisplay?: string;
  /** Set once "Report Suspicious Activity" has been run against this row. */
  reportedIso?: string;
  reportedDisplay?: string;
}

// The fixed "current moment" the two action-bar buttons stamp onto the log
// when pressed. Chosen to sit just after the most recent entry below.
export const ACTION_NOW_ISO = "2026-10-06T09:00:00-07:00";
export const ACTION_NOW_DISPLAY = "Oct 6, 9:00 AM";

export const INITIAL_ENTRIES: ActivityEntry[] = [
  {
    id: "evt-1",
    kind: "signIn",
    severity: "neutral",
    deviceName: "MacBook Pro — Chrome",
    location: "Seattle, WA, USA",
    timestampIso: "2026-10-06T08:02:00-07:00",
    displayTime: "Oct 6, 8:02 AM",
    summary: "Signed in successfully",
    isCurrentDevice: true,
  },
  {
    id: "evt-2",
    kind: "passwordChanged",
    severity: "success",
    deviceName: "MacBook Pro — Chrome",
    location: "Seattle, WA, USA",
    timestampIso: "2026-10-04T19:45:00-07:00",
    displayTime: "Oct 4, 7:45 PM",
    summary: "Password changed",
    isCurrentDevice: false,
  },
  {
    id: "evt-3",
    kind: "deviceVerified",
    severity: "warning",
    deviceName: "iPad Air — Safari",
    location: "Portland, OR, USA",
    timestampIso: "2026-10-03T11:20:00-07:00",
    displayTime: "Oct 3, 11:20 AM",
    summary: "New device verified with an email code",
    isCurrentDevice: false,
  },
  {
    id: "evt-4",
    kind: "signInFailed",
    severity: "danger",
    deviceName: "Unknown device — Firefox",
    location: "Unknown location (VPN detected)",
    timestampIso: "2026-10-02T03:14:00-07:00",
    displayTime: "Oct 2, 3:14 AM",
    summary: "Failed sign-in — wrong password, 3 attempts",
    isCurrentDevice: false,
  },
  {
    id: "evt-5",
    kind: "signIn",
    severity: "neutral",
    deviceName: "iPhone 15 Pro — Safari",
    location: "Seattle, WA, USA",
    timestampIso: "2026-10-01T07:50:00-07:00",
    displayTime: "Oct 1, 7:50 AM",
    summary: "Signed in successfully",
    isCurrentDevice: false,
  },
  {
    id: "evt-6",
    kind: "signInFailed",
    severity: "danger",
    deviceName: "Unknown device — Chrome",
    location: "São Paulo, Brazil",
    timestampIso: "2026-09-29T22:05:00-07:00",
    displayTime: "Sep 29, 10:05 PM",
    summary: "Failed sign-in — wrong password",
    isCurrentDevice: false,
  },
  {
    id: "evt-7",
    kind: "signIn",
    severity: "neutral",
    deviceName: "Windows PC — Edge",
    location: "Austin, TX, USA",
    timestampIso: "2026-09-27T14:30:00-07:00",
    displayTime: "Sep 27, 2:30 PM",
    summary: "Signed in successfully",
    isCurrentDevice: false,
  },
];
