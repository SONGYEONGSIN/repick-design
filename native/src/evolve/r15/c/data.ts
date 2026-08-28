// native/src/evolve/r15/c/data.ts — deterministic dummy data for the Safe-Exchange Location Picker.
// No Math.random / Date.now / argument-less new Date() anywhere in this module.

export type ExchangeLocation = {
  id: string;
  name: string;
  category: string;
  detail: string;
  distanceMiles: number;
  travelMinutes: number;
};

// The other party in this in-person exchange. Fixed value, not read from any live session.
export const COUNTERPART_NAME = "Alex";

// The item being exchanged, for the synthesized instruction line.
export const ITEM_LABEL = "the Canon AE-1 film camera";

// Ordered nearest-first. Distances/times are fixed figures, not computed from geolocation.
export const EXCHANGE_LOCATIONS: ExchangeLocation[] = [
  {
    id: "pd-lobby",
    name: "Riverside PD Safe Exchange Zone",
    category: "Police station lobby",
    detail: "Camera-monitored lobby, open 24/7",
    distanceMiles: 0.6,
    travelMinutes: 4,
  },
  {
    id: "mall-info",
    name: "Northgate Mall Information Desk",
    category: "Mall directory desk",
    detail: "Staffed desk, mall hours 10am–9pm",
    distanceMiles: 1.1,
    travelMinutes: 7,
  },
  {
    id: "transit-entrance",
    name: "Elm Street Station Main Entrance",
    category: "Transit station entrance",
    detail: "Well-lit, station staff on site, 5am–1am",
    distanceMiles: 1.4,
    travelMinutes: 9,
  },
  {
    id: "bank-lobby",
    name: "First Harbor Bank — Downtown Branch",
    category: "Bank branch lobby",
    detail: "Staffed lobby, weekdays 9am–5pm",
    distanceMiles: 2.3,
    travelMinutes: 15,
  },
];

// Fixed normalization ceiling for the proximity rail (abstract, not a real map scale).
export const PROXIMITY_RAIL_MAX_MILES = 2.5;
