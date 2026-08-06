/**
 * Deterministic copy + fixture data for the Portage "About" page. Nothing here calls
 * Math.random/Date.now/new Date — every year, count, and detail string is a hardcoded literal so
 * the route hydrates identically on server and client.
 */

export type ValueCategory = "product" | "people" | "craft";

export const VALUE_CATEGORIES: { key: ValueCategory; label: string }[] = [
  { key: "product", label: "Product" },
  { key: "people", label: "People" },
  { key: "craft", label: "Craft" },
];

export type CompanyValue = {
  id: string;
  title: string;
  body: string;
  category: ValueCategory;
};

export const VALUES: CompanyValue[] = [
  {
    id: "fix-the-boring-thing",
    title: "Fix the boring thing first",
    body: "The unglamorous bug in the returns flow ships before the flashy feature nobody asked for yet. Reliability is a feature, not a prerequisite to one.",
    category: "product",
  },
  {
    id: "say-the-number",
    title: "Say the number, not the vibe",
    body: "“It feels faster” is not a status update. We instrument before we celebrate, and the changelog shows the measurement, not the adjective.",
    category: "craft",
  },
  {
    id: "no-repeat",
    title: "Never make a customer explain twice",
    body: "Support notes travel with the account. If an engineer needs the backstory, they read it — nobody makes the customer retell it on a second call.",
    category: "people",
  },
  {
    id: "write-it-down",
    title: "Write it down before you ship it",
    body: "A design doc is cheaper than a rollback. We slow down at the whiteboard so the warehouse floor doesn’t slow down at 2 a.m.",
    category: "craft",
  },
];

export type Milestone = {
  year: string;
  title: string;
  summary: string;
  detail: string;
};

export const MILESTONES: Milestone[] = [
  {
    year: "2018",
    title: "Founded in a rented warehouse bay",
    summary: "Two co-founders, one folding table, and a client who needed their pick lists off paper.",
    detail:
      "Mara and Priya rented half a warehouse bay in Ohio for six weeks to watch how orders actually moved — not how the org chart said they moved. The first version of Portage was a shared spreadsheet with a script bolted on. It stayed in production for four months longer than either of them likes to admit.",
  },
  {
    year: "2019",
    title: "Passed 100 customers",
    summary: "Mostly small kitchenware and hardware manufacturers who found us by word of mouth.",
    detail:
      "No outbound sales team existed yet — customer 40 referred customer 41. The support inbox was Mara’s personal email until customer 63, when Lin Marsh joined as the first hire outside the founding pair, brought on specifically to own it.",
  },
  {
    year: "2020",
    title: "Shipped the returns module",
    summary: "Built in one sprint after a customer asked for it during a renewal call — twice.",
    detail:
      "A customer had mentioned wanting returns handled inside Portage in March, then again in September, phrased almost identically. That repetition became the trigger for the “never make a customer explain twice” value — the module shipped six weeks later.",
  },
  {
    year: "2022",
    title: "Opened the partner marketplace",
    summary: "Regional carriers could finally see a manufacturer’s dock schedule before quoting a rate.",
    detail:
      "Before the marketplace, carriers quoted blind and manufacturers absorbed the guesswork. Opening dock schedules to vetted partners cut average quote turnaround from three days to same-afternoon for the first twelve partner carriers.",
  },
  {
    year: "2024",
    title: "Crossed 10,000 orders routed per day",
    summary: "Across roughly 900 manufacturers, most still under 50 employees.",
    detail:
      "The milestone mattered less than what didn’t change alongside it: the support team stayed at four people. The routing engine that started as Mara’s warehouse-bay script had been rewritten three times by then, but the founding promise — a five-person team should ship like fifty — held.",
  },
  {
    year: "2026",
    title: "Opened an office in Lisbon",
    summary: "The first Portage location outside North America, anchoring a small EU support team.",
    detail:
      "European manufacturers had been signing up on their own for two years before Portage had anyone on the ground to support them in a closer time zone. Sam Rutter moved from partnerships to lead the opening.",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  accent: string;
};

// Fixed hex values (not Math.random) — each person gets one stable color, never recomputed.
export const TEAM: TeamMember[] = [
  { name: "Mara Voss", role: "Co-founder & CEO", initials: "MV", accent: "#b45309" },
  { name: "Priya Anand", role: "Co-founder & CTO", initials: "PA", accent: "#92400e" },
  { name: "Dez Okafor", role: "Head of Operations", initials: "DO", accent: "#78716c" },
  { name: "Lin Marsh", role: "Head of Support", initials: "LM", accent: "#a16207" },
  { name: "Sam Rutter", role: "Head of Partnerships", initials: "SR", accent: "#57534e" },
];

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
