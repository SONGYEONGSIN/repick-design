// native/src/evolve/r58/c/data.ts
// Deterministic dummy data for the "Select a Pickup Locker" screen.
// No Math.random / Date.now / bare new Date() — every value below is a fixed
// literal or a pure computation over fixed literals.

export type LockerAvailability = "open" | "limited" | "full";

export interface LockerOption {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  hours: string;
  availability: LockerAvailability;
  // number of free compartments right now (0 when availability === "full")
  freeSlots: number;
}

export const ORDER_ITEM_LABEL = "Vintage Leather Messenger Bag";
export const ORDER_ID = "ORD-48213";

export const LOCKER_OPTIONS: LockerOption[] = [
  {
    id: "lkr-maple-station",
    name: "Maple Street Station Lockers",
    address: "118 Maple St, Concourse Level",
    distanceMiles: 0.4,
    hours: "24 hours",
    availability: "open",
    freeSlots: 6,
  },
  {
    id: "lkr-harbor-market",
    name: "Harbor Market Lockers",
    address: "27 Harbor Market Walk",
    distanceMiles: 0.9,
    hours: "6:00 AM - 11:00 PM",
    availability: "open",
    freeSlots: 4,
  },
  {
    id: "lkr-civic-plaza",
    name: "Civic Plaza Lockers",
    address: "500 Civic Plaza, Entrance B",
    distanceMiles: 1.2,
    hours: "7:00 AM - 10:00 PM",
    availability: "limited",
    freeSlots: 1,
  },
  {
    id: "lkr-riverside-depot",
    name: "Riverside Depot Lockers",
    address: "9 Riverside Depot Rd",
    distanceMiles: 1.6,
    hours: "24 hours",
    availability: "full",
    freeSlots: 0,
  },
  {
    id: "lkr-union-court",
    name: "Union Court Lockers",
    address: "73 Union Court, Lower Level",
    distanceMiles: 2.1,
    hours: "8:00 AM - 9:00 PM",
    availability: "open",
    freeSlots: 8,
  },
];
