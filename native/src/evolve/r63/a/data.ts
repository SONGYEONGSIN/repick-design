// native/src/evolve/r63/a/data.ts — auto-native-r63 candidate a.
// Deterministic dummy data for SavedAddressesScreen. No Math.random / Date.now /
// bare `new Date()` anywhere below.

export type SavedAddress = {
  id: string;
  /** Short user-facing tag for the address, e.g. "Home", "Work". */
  label: string;
  recipientName: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
};

export const INITIAL_ADDRESSES: readonly SavedAddress[] = [
  {
    id: "addr-home",
    label: "Home",
    recipientName: "Priya Nandakumar",
    street: "48 Larkspur Lane",
    city: "Asheville",
    region: "NC",
    postalCode: "28801",
  },
  {
    id: "addr-work",
    label: "Work",
    recipientName: "Priya Nandakumar",
    street: "900 Riverbend Office Park, Suite 220",
    city: "Asheville",
    region: "NC",
    postalCode: "28803",
  },
  {
    id: "addr-mom",
    label: "Mom's House",
    recipientName: "Lakshmi Nandakumar",
    street: "17 Chestnut Court",
    city: "Hendersonville",
    region: "NC",
    postalCode: "28739",
  },
  {
    id: "addr-cabin",
    label: "Lake Cabin",
    recipientName: "Priya Nandakumar",
    street: "6 Pinehollow Trail",
    city: "Lake Lure",
    region: "NC",
    postalCode: "28746",
  },
] as const;

// Exactly one address starts as the default shipping destination.
export const INITIAL_DEFAULT_ADDRESS_ID: string = "addr-home";
