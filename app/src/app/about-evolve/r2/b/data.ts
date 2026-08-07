/**
 * Deterministic copy + fixture data for the Fenwick "About" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type YearStats = {
  year: number;
  headline: string;
  stats: { label: string; value: string }[];
};

/**
 * One entry per year on the scrubber. The slider only ever *selects* one of these five fixed
 * records — nothing is computed from the slider position, so the displayed numbers can never
 * drift from what's written here.
 */
export const YEAR_STATS: YearStats[] = [
  {
    year: 2020,
    headline: "Two engineers, one warehouse client, a spreadsheet pretending to be a database.",
    stats: [
      { label: "Team", value: "2" },
      { label: "Customers", value: "1" },
      { label: "Records synced / day", value: "40K" },
    ],
  },
  {
    year: 2021,
    headline: "The spreadsheet becomes a product. The product gets its first outside customer.",
    stats: [
      { label: "Team", value: "6" },
      { label: "Customers", value: "14" },
      { label: "Records synced / day", value: "2.1M" },
    ],
  },
  {
    year: 2022,
    headline: "First 100 customers. First time the on-call rotation needs more than one person.",
    stats: [
      { label: "Team", value: "15" },
      { label: "Customers", value: "108" },
      { label: "Records synced / day", value: "31M" },
    ],
  },
  {
    year: 2023,
    headline: "Series A closes. Fenwick moves off its own founder's laptop as a production host.",
    stats: [
      { label: "Team", value: "24" },
      { label: "Customers", value: "290" },
      { label: "Records synced / day", value: "180M" },
    ],
  },
  {
    year: 2025,
    headline: "34 people keep 640 customers' data in sync without anyone thinking about it.",
    stats: [
      { label: "Team", value: "34" },
      { label: "Customers", value: "640" },
      { label: "Records synced / day", value: "1.4B" },
    ],
  },
];

export type Person = { name: string; role: string; initials: string; accent: string; bio: string };

export const PEOPLE: Person[] = [
  { name: "Anders Bergstrom", role: "Co-founder & CEO", initials: "AB", accent: "#4d7c0f", bio: "Started Fenwick after spending a year manually reconciling two ERPs by hand for his last employer. Still keeps that spreadsheet framed on his desk." },
  { name: "Camila Duarte", role: "Head of Engineering", initials: "CD", accent: "#3f6212", bio: "Wrote the first version of the sync engine on a flight and has been rewriting it in smaller pieces ever since. Owns the on-call calendar." },
  { name: "Dmitri Volkov", role: "Staff Engineer", initials: "DV", accent: "#4d7c0f", bio: "Joined as customer #3's embedded engineer and never left. Knows more about SAP's undocumented rate limits than SAP does." },
  { name: "Esi Owusu", role: "Head of Product", initials: "EO", accent: "#3f6212", bio: "Runs product by reading every support ticket personally before it's tagged. Has read all 14,000 of them." },
  { name: "Farrah Delacroix", role: "Product Designer", initials: "FD", accent: "#4d7c0f", bio: "Redesigned the sync-status dashboard three times before customers stopped asking what a 'conflict' meant." },
  { name: "Gunnar Halvorsen", role: "Solutions Engineer", initials: "GH", accent: "#3f6212", bio: "Onboarded customer #200 in four hours flat, a record that still stands. Keeps a leaderboard nobody else can see." },
  { name: "Hana Kobayashi", role: "Backend Engineer", initials: "HK", accent: "#4d7c0f", bio: "Built the retry logic that turned a 2am pager storm into a Tuesday-morning Slack message instead." },
  { name: "Ines Marchetti", role: "Head of Finance", initials: "IM", accent: "#3f6212", bio: "Closed the Series A term sheet from a hospital waiting room and still made the board deck deadline." },
  { name: "Jonas Ekberg", role: "Customer Success Lead", initials: "JE", accent: "#4d7c0f", bio: "Answers renewal calls in three languages and has never lost a customer to a competitor without knowing exactly why." },
  { name: "Keiko Nishida", role: "People Operations", initials: "KN", accent: "#3f6212", bio: "Runs onboarding so tightly that new hires ship their first fix to production on day two, not week two." },
  { name: "Luca Ferraro", role: "Account Executive", initials: "LF", accent: "#4d7c0f", bio: "Sold the very first deal off a whiteboard photo, before Fenwick had a pricing page." },
  { name: "Marguerite Simo", role: "Support Engineer", initials: "MS", accent: "#3f6212", bio: "Wrote the internal runbook that's saved more outages than any single line of code the team has shipped." },
];

export type ValueItem = { id: string; title: string; body: string };

export const VALUES: ValueItem[] = [
  {
    id: "reconcile",
    title: "Trust the sync, not the screenshot",
    body: "A customer's dashboard is only as honest as the pipeline behind it. If the sync engine and the UI ever disagree, the UI is wrong until proven otherwise — never the other way around.",
  },
  {
    id: "slow-is-a-feature",
    title: "Slow and correct beats fast and wrong",
    body: "A sync that finishes in five seconds but drops a record is worse than one that takes five minutes and doesn't. We tell customers the honest number, even when it's the less exciting one.",
  },
  {
    id: "read-the-ticket",
    title: "Read the whole ticket before replying",
    body: "Half-read support tickets produce half-right answers that cost the customer a second email. Support replies are written after the full thread, not the first two lines.",
  },
  {
    id: "own-the-migration",
    title: "The team that breaks a migration fixes it live",
    body: "If a schema change breaks a customer's sync, the engineer who shipped it joins the incident call — not a rotating on-call stranger reading the diff for the first time.",
  },
];
