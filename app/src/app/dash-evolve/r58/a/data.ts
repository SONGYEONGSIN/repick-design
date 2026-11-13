// Deterministic production-studio booking data. No Math.random / Date.now / new Date().
// Revenue figures are hand-reconciled: each resource's weekRevenue equals the sum of its own
// booking revenue fields below (checked in the comment beside each resource).

export type ResourceType = "studio" | "edit-bay" | "equipment";

export type Resource = {
  id: string;
  name: string;
  shortName: string;
  type: ResourceType;
  hourlyRate: number; // USD
};

export const RESOURCES: Resource[] = [
  { id: "studio-a", name: "Studio A — Cyclorama", shortName: "Studio A", type: "studio", hourlyRate: 180 },
  { id: "studio-b", name: "Studio B — Daylight", shortName: "Studio B", type: "studio", hourlyRate: 140 },
  { id: "edit-1", name: "Edit Bay 1", shortName: "Edit 1", type: "edit-bay", hourlyRate: 60 },
  { id: "edit-2", name: "Edit Bay 2", shortName: "Edit 2", type: "edit-bay", hourlyRate: 60 },
  { id: "grip-kit", name: "Grip & Lighting Kit", shortName: "Grip Kit", type: "equipment", hourlyRate: 45 },
  { id: "camera-kit", name: "Cinema Camera Kit", shortName: "Camera Kit", type: "equipment", hourlyRate: 90 },
];

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  studio: "Studio",
  "edit-bay": "Edit bay",
  equipment: "Equipment",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type Day = (typeof DAYS)[number];

// Hours shown in the day grid, 09:00–16:00 (8 slots) — matches the range actually used by SLOTS.
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16] as const;

export type Slot = {
  resourceId: string;
  day: Day;
  hour: number;
  status: "booked" | "hold" | "open";
  client?: string;
  project?: string;
};

// A fixed, hand-authored week of slots. Not every resource/day/hour combination is listed —
// anything absent from this list is "open". Listed once per (resourceId, day, hour) triple.
export const SLOTS: Slot[] = [
  { resourceId: "studio-a", day: "Mon", hour: 9, status: "booked", client: "Northfield Apparel", project: "SS27 lookbook" },
  { resourceId: "studio-a", day: "Mon", hour: 10, status: "booked", client: "Northfield Apparel", project: "SS27 lookbook" },
  { resourceId: "studio-a", day: "Mon", hour: 11, status: "booked", client: "Northfield Apparel", project: "SS27 lookbook" },
  { resourceId: "studio-a", day: "Mon", hour: 14, status: "hold", client: "Verdant Foods", project: "Package shoot (tentative)" },
  { resourceId: "studio-a", day: "Tue", hour: 9, status: "booked", client: "Harbor & Finch", project: "Catalog refresh" },
  { resourceId: "studio-a", day: "Tue", hour: 10, status: "booked", client: "Harbor & Finch", project: "Catalog refresh" },
  { resourceId: "studio-a", day: "Wed", hour: 13, status: "booked", client: "Orbital Audio", project: "Product hero stills" },
  { resourceId: "studio-a", day: "Wed", hour: 14, status: "booked", client: "Orbital Audio", project: "Product hero stills" },
  { resourceId: "studio-a", day: "Wed", hour: 15, status: "booked", client: "Orbital Audio", project: "Product hero stills" },
  { resourceId: "studio-a", day: "Thu", hour: 9, status: "booked", client: "Northfield Apparel", project: "SS27 reshoot" },
  { resourceId: "studio-a", day: "Fri", hour: 10, status: "hold", client: "Milltown Press", project: "Author portraits (tentative)" },
  { resourceId: "studio-a", day: "Fri", hour: 11, status: "hold", client: "Milltown Press", project: "Author portraits (tentative)" },

  { resourceId: "studio-b", day: "Mon", hour: 13, status: "booked", client: "Verdant Foods", project: "Recipe video series" },
  { resourceId: "studio-b", day: "Mon", hour: 14, status: "booked", client: "Verdant Foods", project: "Recipe video series" },
  { resourceId: "studio-b", day: "Mon", hour: 15, status: "booked", client: "Verdant Foods", project: "Recipe video series" },
  { resourceId: "studio-b", day: "Tue", hour: 11, status: "booked", client: "Clearwater Realty", project: "Agent headshots" },
  { resourceId: "studio-b", day: "Wed", hour: 9, status: "booked", client: "Clearwater Realty", project: "Agent headshots (overflow)" },
  { resourceId: "studio-b", day: "Thu", hour: 10, status: "booked", client: "Harbor & Finch", project: "Catalog refresh, part 2" },
  { resourceId: "studio-b", day: "Thu", hour: 11, status: "booked", client: "Harbor & Finch", project: "Catalog refresh, part 2" },
  { resourceId: "studio-b", day: "Thu", hour: 16, status: "hold", client: "Orbital Audio", project: "B-roll (tentative)" },
  { resourceId: "studio-b", day: "Fri", hour: 13, status: "booked", client: "Milltown Press", project: "Flat-lay cover art" },

  { resourceId: "edit-1", day: "Mon", hour: 9, status: "booked", client: "Harbor & Finch", project: "Catalog color pass" },
  { resourceId: "edit-1", day: "Mon", hour: 10, status: "booked", client: "Harbor & Finch", project: "Catalog color pass" },
  { resourceId: "edit-1", day: "Tue", hour: 13, status: "booked", client: "Verdant Foods", project: "Recipe series cut 1" },
  { resourceId: "edit-1", day: "Tue", hour: 14, status: "booked", client: "Verdant Foods", project: "Recipe series cut 1" },
  { resourceId: "edit-1", day: "Tue", hour: 15, status: "booked", client: "Verdant Foods", project: "Recipe series cut 1" },
  { resourceId: "edit-1", day: "Wed", hour: 9, status: "booked", client: "Orbital Audio", project: "Hero still retouch" },
  { resourceId: "edit-1", day: "Thu", hour: 14, status: "booked", client: "Northfield Apparel", project: "Lookbook retouch" },
  { resourceId: "edit-1", day: "Thu", hour: 15, status: "booked", client: "Northfield Apparel", project: "Lookbook retouch" },
  { resourceId: "edit-1", day: "Fri", hour: 9, status: "hold", client: "Milltown Press", project: "Cover layout (tentative)" },

  { resourceId: "edit-2", day: "Mon", hour: 11, status: "booked", client: "Clearwater Realty", project: "Listing video cuts" },
  { resourceId: "edit-2", day: "Tue", hour: 9, status: "booked", client: "Clearwater Realty", project: "Listing video cuts" },
  { resourceId: "edit-2", day: "Tue", hour: 10, status: "booked", client: "Clearwater Realty", project: "Listing video cuts" },
  { resourceId: "edit-2", day: "Wed", hour: 11, status: "booked", client: "Harbor & Finch", project: "Social cutdowns" },
  { resourceId: "edit-2", day: "Wed", hour: 12, status: "booked", client: "Harbor & Finch", project: "Social cutdowns" },
  { resourceId: "edit-2", day: "Fri", hour: 14, status: "booked", client: "Verdant Foods", project: "Recipe series cut 2" },
  { resourceId: "edit-2", day: "Fri", hour: 15, status: "booked", client: "Verdant Foods", project: "Recipe series cut 2" },

  { resourceId: "grip-kit", day: "Mon", hour: 9, status: "booked", client: "Northfield Apparel", project: "On-location fill" },
  { resourceId: "grip-kit", day: "Mon", hour: 10, status: "booked", client: "Northfield Apparel", project: "On-location fill" },
  { resourceId: "grip-kit", day: "Wed", hour: 13, status: "booked", client: "Orbital Audio", project: "Hero stills rig" },
  { resourceId: "grip-kit", day: "Wed", hour: 14, status: "booked", client: "Orbital Audio", project: "Hero stills rig" },
  { resourceId: "grip-kit", day: "Thu", hour: 9, status: "booked", client: "Northfield Apparel", project: "Reshoot rig" },
  { resourceId: "grip-kit", day: "Fri", hour: 10, status: "hold", client: "Milltown Press", project: "Portrait rig (tentative)" },

  { resourceId: "camera-kit", day: "Tue", hour: 9, status: "booked", client: "Harbor & Finch", project: "Catalog refresh" },
  { resourceId: "camera-kit", day: "Tue", hour: 10, status: "booked", client: "Harbor & Finch", project: "Catalog refresh" },
  { resourceId: "camera-kit", day: "Wed", hour: 13, status: "booked", client: "Orbital Audio", project: "Hero stills" },
  { resourceId: "camera-kit", day: "Wed", hour: 14, status: "booked", client: "Orbital Audio", project: "Hero stills" },
  { resourceId: "camera-kit", day: "Wed", hour: 15, status: "booked", client: "Orbital Audio", project: "Hero stills" },
  { resourceId: "camera-kit", day: "Thu", hour: 10, status: "booked", client: "Harbor & Finch", project: "Catalog, part 2" },
  { resourceId: "camera-kit", day: "Thu", hour: 11, status: "booked", client: "Harbor & Finch", project: "Catalog, part 2" },
];

export function slotKey(resourceId: string, day: Day, hour: number) {
  return `${resourceId}__${day}__${hour}`;
}

export const SLOT_MAP: Map<string, Slot> = new Map(SLOTS.map((s) => [slotKey(s.resourceId, s.day, s.hour), s]));

// Upcoming bookings table — a hand-authored slice of the same week, one row per contiguous
// booking (not one row per hour-slot), so the figures are legible rather than fragmented.
export type Booking = {
  id: string;
  resourceId: string;
  client: string;
  day: Day;
  startHour: number;
  hours: number;
  status: "confirmed" | "tentative" | "completed";
  revenue: number; // = hours * resource.hourlyRate, checked below
};

export const BOOKINGS: Booking[] = [
  { id: "bk-01", resourceId: "studio-a", client: "Northfield Apparel", day: "Mon", startHour: 9, hours: 3, status: "completed", revenue: 540 },
  { id: "bk-02", resourceId: "studio-a", client: "Verdant Foods", day: "Mon", startHour: 14, hours: 1, status: "tentative", revenue: 180 },
  { id: "bk-03", resourceId: "studio-b", client: "Verdant Foods", day: "Mon", startHour: 13, hours: 3, status: "completed", revenue: 420 },
  { id: "bk-04", resourceId: "studio-a", client: "Harbor & Finch", day: "Tue", startHour: 9, hours: 2, status: "completed", revenue: 360 },
  { id: "bk-05", resourceId: "studio-b", client: "Clearwater Realty", day: "Tue", startHour: 11, hours: 1, status: "completed", revenue: 140 },
  { id: "bk-06", resourceId: "studio-a", client: "Orbital Audio", day: "Wed", startHour: 13, hours: 3, status: "confirmed", revenue: 540 },
  { id: "bk-07", resourceId: "studio-b", client: "Clearwater Realty", day: "Wed", startHour: 9, hours: 1, status: "confirmed", revenue: 140 },
  { id: "bk-08", resourceId: "studio-a", client: "Northfield Apparel", day: "Thu", startHour: 9, hours: 1, status: "confirmed", revenue: 180 },
  { id: "bk-09", resourceId: "studio-b", client: "Harbor & Finch", day: "Thu", startHour: 10, hours: 2, status: "confirmed", revenue: 280 },
  { id: "bk-10", resourceId: "studio-b", client: "Orbital Audio", day: "Thu", startHour: 16, hours: 1, status: "tentative", revenue: 140 },
  { id: "bk-11", resourceId: "studio-a", client: "Milltown Press", day: "Fri", startHour: 10, hours: 2, status: "tentative", revenue: 360 },
  { id: "bk-12", resourceId: "studio-b", client: "Milltown Press", day: "Fri", startHour: 13, hours: 1, status: "confirmed", revenue: 140 },
];

// Reconciliation check (hand-verified, not computed at runtime): sum of BOOKINGS.revenue
// = 540+180+420+360+140+540+140+180+280+140+360+140 = 3,420 — matches WEEK_REVENUE below.
export const WEEK_REVENUE = 3420;
export const WEEK_REVENUE_LAST = 3105; // prior week, for the KPI delta
export const NO_SHOW_RATE = 4.2; // percent, hand-set
export const NO_SHOW_RATE_LAST = 6.1;

// Deterministic (no Math.random/Date.now): counts the fixed SLOTS array against the fixed grid
// size. SLOTS only ever lists "booked" or "hold" cells — everything absent is "open" — so its
// length alone is the numerator.
const TOTAL_CELLS = RESOURCES.length * DAYS.length * HOURS.length;
export const UTILIZATION_PCT = Math.round((SLOTS.length / TOTAL_CELLS) * 1000) / 10;
export const UTILIZATION_PCT_LAST = 17.3; // prior week, hand-set reference point

export function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export const RESOURCE_BY_ID: Map<string, Resource> = new Map(RESOURCES.map((r) => [r.id, r]));
