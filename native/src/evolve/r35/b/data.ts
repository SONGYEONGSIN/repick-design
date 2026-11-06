// native/src/evolve/r35/b/data.ts
// Deterministic dummy data for the Local Pickup Zones screen. No Math.random,
// no Date.now, no argument-less `new Date()` — every value below is a fixed
// literal so the screen renders identically on every run.

export type PickupZone = {
  id: string;
  label: string;
  areaNote: string;
  scheduleNote: string;
  enabled: boolean;
};

export const initialPickupZones: PickupZone[] = [
  {
    id: "zone-gangnam-exit3",
    label: "Gangnam Station Exit 3",
    areaNote: "Within 300m of the exit gate",
    scheduleNote: "Daily, 9:00 AM – 9:00 PM",
    enabled: true,
  },
  {
    id: "zone-hongdae-playground",
    label: "Hongdae Playground Entrance",
    areaNote: "Meet directly at the entrance plaza",
    scheduleNote: "Weekday evenings only, 6:00 – 9:00 PM",
    enabled: true,
  },
  {
    id: "zone-sinchon-exit2",
    label: "Sinchon Station Exit 2",
    areaNote: "Within 500m of the station",
    scheduleNote: "Weekends only",
    enabled: false,
  },
  {
    id: "zone-yeouido-north-gate",
    label: "Yeouido Park North Gate",
    areaNote: "No fixed radius — message to confirm a spot",
    scheduleNote: "By request only",
    enabled: true,
  },
  {
    id: "zone-konkuk-exit1",
    label: "Konkuk University Station Exit 1",
    areaNote: "Within 200m of the exit",
    scheduleNote: "Daily, 10:00 AM – 8:00 PM",
    enabled: false,
  },
  {
    id: "zone-seongsu-cafe-street",
    label: "Seongsu Café Street",
    areaNote: "Near the Exit 2 crosswalk",
    scheduleNote: "Daily, 11:00 AM – 7:00 PM",
    enabled: true,
  },
];
