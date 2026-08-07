/**
 * Deterministic copy + fixture data for the Cordwell "About" page. No Math.random/Date.now/new
 * Date anywhere in this route — every count, year, and string below is a hardcoded literal so the
 * route hydrates identically on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export type Member = { name: string; role: string; initials: string; accent: string };

export type Pod = {
  id: string;
  name: string;
  headcount: number;
  blurb: string;
  members: Member[];
};

export const PODS: Pod[] = [
  {
    id: "platform",
    name: "Platform",
    headcount: 14,
    blurb: "Owns the ingest pipeline, the query engine, and the on-call rotation that keeps both awake at 3am.",
    members: [
      { name: "Renata Cole", role: "Staff Engineer", initials: "RC", accent: "#e11d48" },
      { name: "Idris Faw", role: "Backend Engineer", initials: "IF", accent: "#be123c" },
      { name: "Yuki Tanabe", role: "Site Reliability Engineer", initials: "YT", accent: "#9f1239" },
      { name: "Marco Reyes", role: "Backend Engineer", initials: "MR", accent: "#e11d48" },
    ],
  },
  {
    id: "product",
    name: "Product & Design",
    headcount: 9,
    blurb: "Turns support tickets into wireframes and wireframes into things people stop filing tickets about.",
    members: [
      { name: "Petra Lindqvist", role: "Head of Product", initials: "PL", accent: "#be123c" },
      { name: "Dara Osei", role: "Product Designer", initials: "DO", accent: "#9f1239" },
      { name: "Wen Zhu", role: "Product Manager", initials: "WZ", accent: "#e11d48" },
    ],
  },
  {
    id: "growth",
    name: "Growth & Success",
    headcount: 11,
    blurb: "Answers the phone before the third ring and reads changelogs out loud to customers who'd rather not.",
    members: [
      { name: "Tomas Herrera", role: "Customer Success Lead", initials: "TH", accent: "#9f1239" },
      { name: "Aiko Sato", role: "Solutions Engineer", initials: "AS", accent: "#e11d48" },
      { name: "Femi Adigun", role: "Account Executive", initials: "FA", accent: "#be123c" },
    ],
  },
  {
    id: "operations",
    name: "Operations & Finance",
    headcount: 6,
    blurb: "Makes sure payroll runs, invoices go out, and the SOC 2 auditor leaves happy every single year.",
    members: [
      { name: "Greta Almqvist", role: "Head of Finance", initials: "GA", accent: "#e11d48" },
      { name: "Kwame Boateng", role: "People Operations", initials: "KB", accent: "#9f1239" },
    ],
  },
];

export type ValueTab = {
  id: string;
  label: string;
  title: string;
  body: string;
};

export const VALUE_TABS: ValueTab[] = [
  {
    id: "measure",
    label: "Measure first",
    title: "Say the number, not the vibe",
    body: "“It feels faster” is not a status update. Every performance claim in a Cordwell changelog ships with the benchmark that produced it, not the adjective someone felt like using.",
  },
  {
    id: "own",
    label: "Own the pager",
    title: "The person who wrote it carries it",
    body: "Engineers who ship an alert are the ones who get paged for it for the first two weeks. Ownership that ends at merge is not ownership — it's authorship with none of the accountability.",
  },
  {
    id: "boring",
    label: "Boring first",
    title: "Fix the boring thing before the flashy one",
    body: "The unglamorous bug in the export flow ships before the feature nobody asked for yet. Reliability is a precondition for trust, not a feature you add once trust is already gone.",
  },
  {
    id: "explain",
    label: "No re-explaining",
    title: "Never make a customer explain twice",
    body: "Support context travels with the account. If an engineer needs the backstory to fix a bug, they read the notes — nobody makes the customer retell it on a second call.",
  },
];

export type StatSet = { key: "company" | "culture"; label: string; stats: { label: string; value: string }[] };

export const STAT_SETS: StatSet[] = [
  {
    key: "company",
    label: "Company",
    stats: [
      { label: "Founded", value: "2019" },
      { label: "Team", value: "40" },
      { label: "Customers", value: "610" },
      { label: "Uptime, trailing 12mo", value: "99.97%" },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    stats: [
      { label: "Remote-first since", value: "2019" },
      { label: "Median tenure", value: "2.6 yrs" },
      { label: "Internal promotions, 2025", value: "9" },
      { label: "Countries represented", value: "11" },
    ],
  },
];

export const MILESTONES: { year: string; text: string }[] = [
  { year: "2019", text: "Cordwell starts as a two-person weekend project to graph one customer's Postgres slow-query log." },
  { year: "2021", text: "First 100 paying customers. The pager rotation grows from one founder to three engineers." },
  { year: "2023", text: "Series A. Platform pod splits from Product pod for the first time." },
  { year: "2025", text: "610 customers, 99.97% trailing uptime, and a pager rotation nobody dreads anymore." },
];
