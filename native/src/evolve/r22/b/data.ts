// native/src/evolve/r22/b/data.ts
//
// Deterministic dummy data for the Active Sessions screen. No Math.random,
// no Date.now, no argumentless `new Date()` — every "last active" value is a
// fixed, pre-written label rather than something computed at render time.

export type DeviceKind = "mobile" | "tablet" | "desktop";

export const DEVICE_KIND_LABEL: Record<DeviceKind, string> = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Computer",
};

export type Session = {
  id: string;
  deviceLabel: string;
  deviceKind: DeviceKind;
  isCurrent: boolean;
  location: string;
  lastActiveLabel: string;
};

// The current device is modeled separately (CURRENT_SESSION) from the list
// of other sessions (OTHER_SESSIONS) so the screen can pin it above the
// virtualized list without duplicating it inside the FlatList's own data.
export const CURRENT_SESSION: Session = {
  id: "s-current",
  deviceLabel: "iPhone 15 Pro",
  deviceKind: "mobile",
  isCurrent: true,
  location: "Seoul, South Korea",
  lastActiveLabel: "Active now",
};

export const INITIAL_OTHER_SESSIONS: Session[] = [
  {
    id: "s-macbook",
    deviceLabel: "MacBook Air",
    deviceKind: "desktop",
    isCurrent: false,
    location: "Seoul, South Korea",
    lastActiveLabel: "Last active 2 hours ago",
  },
  {
    id: "s-ipad",
    deviceLabel: "iPad Pro",
    deviceKind: "tablet",
    isCurrent: false,
    location: "Busan, South Korea",
    lastActiveLabel: "Last active yesterday",
  },
  {
    id: "s-galaxy",
    deviceLabel: "Galaxy S23",
    deviceKind: "mobile",
    isCurrent: false,
    location: "Incheon, South Korea",
    lastActiveLabel: "Last active 3 days ago",
  },
  {
    id: "s-chrome-win",
    deviceLabel: "Chrome on Windows",
    deviceKind: "desktop",
    isCurrent: false,
    location: "Daejeon, South Korea",
    lastActiveLabel: "Last active 6 days ago",
  },
];
