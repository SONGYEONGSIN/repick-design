// native/src/evolve/r34/b/data.ts
// Deterministic dummy data for the Saved Shipping Addresses screen.
// No Math.random / Date.now / no-arg `new Date()` — every value below is a fixed literal.

export type AddressStatus = "normal" | "verifying" | "locked";

export interface AddressRecord {
  id: string;
  label: string;
  recipient: string;
  line1: string;
  line2: string;
  phone: string;
  status: AddressStatus;
}

// Exactly one entry is "locked" (the account's current primary address).
// The rest are deterministically split across "normal" and "verifying".
export const initialAddresses: AddressRecord[] = [
  {
    id: "addr-home",
    label: "Home",
    recipient: "Priya Natarajan",
    line1: "482 Birchwood Lane",
    line2: "Austin, TX 78701",
    phone: "(512) 555-0142",
    status: "locked",
  },
  {
    id: "addr-office",
    label: "Office",
    recipient: "Priya Natarajan",
    line1: "1200 Congress Ave, Suite 450",
    line2: "Austin, TX 78701",
    phone: "(512) 555-0198",
    status: "normal",
  },
  {
    id: "addr-studio",
    label: "Weekend Studio",
    recipient: "Priya Natarajan",
    line1: "77 Lakeshore Drive, Unit 3B",
    line2: "Round Rock, TX 78664",
    phone: "(512) 555-0173",
    status: "verifying",
  },
  {
    id: "addr-parents",
    label: "Parents' House",
    recipient: "Anand Natarajan",
    line1: "19 Maple Crest Court",
    line2: "San Marcos, TX 78666",
    phone: "(512) 555-0120",
    status: "normal",
  },
  {
    id: "addr-warehouse",
    label: "Warehouse Pickup",
    recipient: "Priya Natarajan",
    line1: "500 Freight Row, Dock 12",
    line2: "Austin, TX 78741",
    phone: "(512) 555-0186",
    status: "verifying",
  },
  {
    id: "addr-old-apt",
    label: "Old Apartment",
    recipient: "Priya Natarajan",
    line1: "14 Pecan Street, Apt 2",
    line2: "Austin, TX 78702",
    phone: "(512) 555-0111",
    status: "normal",
  },
];

// Fixed template appended by the header's "Add address" action. Deterministic:
// the suffix is derived only from how many rows already exist, never from time
// or randomness.
export const newAddressTemplate: Omit<AddressRecord, "id" | "label"> = {
  recipient: "Jordan Lee",
  line1: "100 Harbor Way",
  line2: "Seattle, WA 98101",
  phone: "(206) 555-0199",
  status: "normal",
};
