/**
 * Deterministic copy + fixture data for the Solmark "About" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export type Region = "americas" | "emea" | "apac";

export const REGIONS: { key: Region; label: string }[] = [
  { key: "americas", label: "Americas" },
  { key: "emea", label: "EMEA" },
  { key: "apac", label: "APAC" },
];

export type Office = { region: Region; city: string; country: string; opened: string; headcount: number };

export const OFFICES: Office[] = [
  { region: "americas", city: "Austin", country: "United States", opened: "2018", headcount: 62 },
  { region: "americas", city: "Toronto", country: "Canada", opened: "2021", headcount: 14 },
  { region: "americas", city: "Sao Paulo", country: "Brazil", opened: "2023", headcount: 9 },
  { region: "emea", city: "Lisbon", country: "Portugal", opened: "2019", headcount: 28 },
  { region: "emea", city: "Amsterdam", country: "Netherlands", opened: "2022", headcount: 11 },
  { region: "apac", city: "Singapore", country: "Singapore", opened: "2020", headcount: 19 },
  { region: "apac", city: "Sydney", country: "Australia", opened: "2024", headcount: 6 },
];

export type Role = "engineering" | "operations" | "customer";

export const ROLES: { key: Role; label: string }[] = [
  { key: "engineering", label: "Engineering" },
  { key: "operations", label: "Operations" },
  { key: "customer", label: "Customer-facing" },
];

export type Person = { role: Role; name: string; title: string; initials: string; accent: string };

export const PEOPLE: Person[] = [
  { role: "engineering", name: "Nadia Okonjo", title: "Head of Engineering", initials: "NO", accent: "#c026d3" },
  { role: "engineering", name: "Bram Vandersteen", title: "Staff Engineer, Routing", initials: "BV", accent: "#a21caf" },
  { role: "engineering", name: "Yara Haddad", title: "Backend Engineer", initials: "YH", accent: "#c026d3" },
  { role: "engineering", name: "Theo Papadakis", title: "Backend Engineer", initials: "TP", accent: "#a21caf" },
  { role: "operations", name: "Simone Achterberg", title: "Head of Global Ops", initials: "SA", accent: "#a21caf" },
  { role: "operations", name: "Rafael Cortez", title: "Carrier Operations Lead", initials: "RC", accent: "#c026d3" },
  { role: "operations", name: "Mei Lin Foo", title: "Customs & Compliance", initials: "MF", accent: "#a21caf" },
  { role: "customer", name: "Declan Boyle", title: "Head of Customer Success", initials: "DB", accent: "#c026d3" },
  { role: "customer", name: "Priyanka Rao", title: "Solutions Engineer", initials: "PR", accent: "#a21caf" },
  { role: "customer", name: "Otto Lindgren", title: "Support Engineer", initials: "OL", accent: "#c026d3" },
];

export type Pillar = { id: string; title: string; body: string };

/**
 * Rendered by the culture-pillars carousel, one at a time. Order here is the fixed rotation order
 * — the carousel advances by index, never by any random pick.
 */
export const PILLARS: Pillar[] = [
  {
    id: "the-shipment-is-real",
    title: "The shipment is real, even when the dashboard is down",
    body: "A container doesn't stop moving because our status page turned red. Every incident review starts from what actually happened at the port, not what our own tooling showed.",
  },
  {
    id: "customs-doesnt-wait",
    title: "Customs doesn't wait for a sprint planning meeting",
    body: "A compliance deadline that slips by a day can hold a shipment for a week. Anything customs-adjacent gets fixed same-day, ahead of the regular backlog, no exceptions.",
  },
  {
    id: "local-knowledge-wins",
    title: "Local knowledge beats a global template",
    body: "A rule that works for the Port of Long Beach can be wrong for Santos. Regional ops teams can override global defaults, and the override — not the template — is treated as correct.",
  },
  {
    id: "say-when-youre-wrong",
    title: "Say when you're wrong before the customer finds out",
    body: "An ETA that's about to slip gets flagged to the customer the moment we know, not the moment they ask. A late shipment is recoverable; a surprised customer is a much harder problem.",
  },
];
