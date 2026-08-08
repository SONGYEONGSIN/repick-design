/**
 * Deterministic copy + fixture data for the Sextant "About" page. No Math.random/Date.now/new
 * Date anywhere in this route — every count, year, and string below is a hardcoded literal so the
 * route hydrates identically on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export const COMPANY = {
  name: "Sextant",
  founded: "2019",
  customers: "340+",
  headcount: 16,
  regionCount: 4,
};

export type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  region: string;
  initials: string;
  accent: string;
};

// 16 people, split 6 / 5 / 3 / 2 across the four regions in REGIONS below — the two datasets are
// meant to agree, since the region chart and the people directory describe the same company.
export const PEOPLE: Person[] = [
  { id: "p1", name: "Renata Cole", role: "Co-founder, CEO", team: "Leadership", region: "North America", initials: "RC", accent: "#083344" },
  { id: "p2", name: "Idris Faw", role: "Co-founder, CTO", team: "Leadership", region: "North America", initials: "IF", accent: "#0e4a5c" },
  { id: "p3", name: "Priya Nandan", role: "Staff Engineer", team: "Data Platform", region: "North America", initials: "PN", accent: "#155e75" },
  { id: "p4", name: "Marco Reyes", role: "Backend Engineer", team: "Data Platform", region: "North America", initials: "MR", accent: "#0e7490" },
  { id: "p5", name: "Hana Wexler", role: "Product Manager", team: "Product", region: "North America", initials: "HW", accent: "#0891b2" },
  { id: "p6", name: "Owen Bracht", role: "Revenue Lead", team: "Revenue", region: "North America", initials: "OB", accent: "#06b6d4" },
  { id: "p7", name: "Sofia Almeida", role: "Engineering Manager", team: "Data Platform", region: "Europe", initials: "SA", accent: "#083344" },
  { id: "p8", name: "Tobias Lindqvist", role: "Backend Engineer", team: "Data Platform", region: "Europe", initials: "TL", accent: "#0e4a5c" },
  { id: "p9", name: "Camille Dubray", role: "Product Designer", team: "Design", region: "Europe", initials: "CD", accent: "#155e75" },
  { id: "p10", name: "Femi Adebayo", role: "Customer Success Lead", team: "Customer Success", region: "Europe", initials: "FA", accent: "#0e7490" },
  { id: "p11", name: "Ingrid Solstad", role: "Data Scientist", team: "Data Platform", region: "Europe", initials: "IS", accent: "#0891b2" },
  { id: "p12", name: "Wen Zhao", role: "Backend Engineer", team: "Data Platform", region: "Asia-Pacific", initials: "WZ", accent: "#083344" },
  { id: "p13", name: "Aiko Tanabe", role: "Solutions Engineer", team: "Customer Success", region: "Asia-Pacific", initials: "AT", accent: "#0e4a5c" },
  { id: "p14", name: "Nikhil Rao", role: "Operations Lead", team: "Operations", region: "Asia-Pacific", initials: "NR", accent: "#155e75" },
  { id: "p15", name: "Beatriz Nogueira", role: "Support Engineer", team: "Customer Success", region: "Latin America", initials: "BN", accent: "#083344" },
  { id: "p16", name: "Diego Salcedo", role: "Backend Engineer", team: "Data Platform", region: "Latin America", initials: "DS", accent: "#0e4a5c" },
];

export type Region = {
  id: string;
  name: string;
  count: number;
  hub: string;
  coverage: string;
  handoff: string;
};

export const REGIONS: Region[] = [
  { id: "na", name: "North America", count: 6, hub: "Austin, TX", coverage: "06:00–15:00 CT", handoff: "Hands off on-call to Europe at 15:00 CT" },
  { id: "eu", name: "Europe", count: 5, hub: "Lisbon, PT", coverage: "08:00–17:00 WET", handoff: "Hands off on-call to Asia-Pacific at 17:00 WET" },
  { id: "apac", name: "Asia-Pacific", count: 3, hub: "Singapore", coverage: "09:00–18:00 SGT", handoff: "Hands off on-call to North America at 18:00 SGT" },
  { id: "latam", name: "Latin America", count: 2, hub: "São Paulo, BR", coverage: "09:00–18:00 BRT", handoff: "Pairs with North America on weekend coverage" },
];

export type Principle = {
  id: string;
  number: string;
  title: string;
  body: string;
};

export const PRINCIPLES: Principle[] = [
  {
    id: "instrument",
    number: "01",
    title: "Instrument before you argue",
    body: "If a debate about the roadmap can't be settled by a query someone in the room can run, it isn't ready to be a debate. We've killed more features by looking at usage than by voting on them.",
  },
  {
    id: "baseline",
    number: "02",
    title: "Baseline, then move",
    body: "Every metric we ship gets a documented baseline before launch. Without one, \"it's up\" and \"it's down\" are both just noise wearing a number.",
  },
  {
    id: "show-work",
    number: "03",
    title: "Show your work",
    body: "Every figure in the product links back to the query that produced it. Customers audit us the way we'd audit anyone handling their revenue numbers — that link is not optional.",
  },
  {
    id: "boring",
    number: "04",
    title: "Prefer the boring answer",
    body: "A dip in retention is usually a broken webhook, not a market shift. We check the boring explanation first, every time, even when the interesting one is more fun to write up.",
  },
  {
    id: "correlation",
    number: "05",
    title: "Correlation earns a question, not a headline",
    body: "\"Correlated with\" goes in a footnote until someone runs the follow-up experiment. It never goes in a customer-facing chart on its own.",
  },
  {
    id: "expire",
    number: "06",
    title: "Decisions expire",
    body: "Every call we make ships with a revisit date, not just a rationale. Stale certainty is the failure mode we watch for hardest, because it's the one that never announces itself.",
  },
];

export const MILESTONES: { year: string; text: string }[] = [
  { year: "2019", text: "Founded by Renata Cole and Idris Faw after both spent a year reconciling the same billing spreadsheet by hand at two different companies." },
  { year: "2021", text: "Shipped the reconciliation engine that ties usage, billing, and support events to one customer record — the feature the rest of the product now sits on." },
  { year: "2023", text: "Opened the Lisbon office and moved on-call to a genuine four-region follow-the-sun rotation." },
  { year: "2025", text: "Crossed 340 customers and stopped counting logo lists as a metric that meant anything internally." },
];
