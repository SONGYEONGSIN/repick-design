/**
 * Deterministic copy + fixture data for the Ordinal "About" page. No Math.random / Date.now /
 * new Date anywhere in this route — every count is derived at module scope from these literal
 * arrays (via .length / .filter), so server and client always compute the same numbers.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export type Person = {
  name: string;
  role: string;
  initials: string;
  accent: string;
  function: "leadership" | "platform" | "policy" | "customer-ops";
  region: "na" | "eu" | "apac" | "remote";
};

export const PEOPLE: Person[] = [
  { name: "Priya Nakamura", role: "Chief Executive Officer", initials: "PN", accent: "#60a5fa", function: "leadership", region: "na" },
  { name: "Elias Vantongeren", role: "Head of Engineering", initials: "EV", accent: "#3b82f6", function: "leadership", region: "eu" },
  { name: "Sana Okafor", role: "Head of Product", initials: "SO", accent: "#818cf8", function: "leadership", region: "na" },
  { name: "Marcus Deighton", role: "Staff Platform Engineer", initials: "MD", accent: "#38bdf8", function: "platform", region: "eu" },
  { name: "Ines Callaghan", role: "Platform Engineer", initials: "IC", accent: "#60a5fa", function: "platform", region: "remote" },
  { name: "Tobias Reinholt", role: "Site Reliability Engineer", initials: "TR", accent: "#3b82f6", function: "platform", region: "eu" },
  { name: "Yara Elmasry", role: "Policy Systems Designer", initials: "YE", accent: "#818cf8", function: "policy", region: "apac" },
  { name: "Devon Ashworth", role: "Compliance Engineer", initials: "DA", accent: "#38bdf8", function: "policy", region: "na" },
  { name: "Naledi Mokoena", role: "Policy Systems Designer", initials: "NM", accent: "#60a5fa", function: "policy", region: "na" },
  { name: "Harriet Sundqvist", role: "Customer Operations Lead", initials: "HS", accent: "#3b82f6", function: "customer-ops", region: "eu" },
  { name: "Omar Fadel", role: "Implementation Manager", initials: "OF", accent: "#818cf8", function: "customer-ops", region: "na" },
  { name: "Wren Castellano", role: "Solutions Engineer", initials: "WC", accent: "#38bdf8", function: "customer-ops", region: "apac" },
];

export type GroupKey = "function" | "region";

export type Node = { id: string; label: string; blurb: string };

export const FUNCTION_NODES: Node[] = [
  { id: "leadership", label: "Leadership", blurb: "Sets the roadmap and carries the pager when the roadmap is wrong." },
  { id: "platform", label: "Platform Engineering", blurb: "Builds the enforcement engine that turns a written rule into a step nobody can skip." },
  { id: "policy", label: "Policy & Compliance Design", blurb: "Translates a customer's approval chain into the state machine the platform runs." },
  { id: "customer-ops", label: "Customer Operations", blurb: "Sits with a customer's ops team until their process actually fits in the system." },
];

export const REGION_NODES: Node[] = [
  { id: "na", label: "North America", blurb: "Remote-first hub anchored around the New York and Austin time zones." },
  { id: "eu", label: "Europe", blurb: "Engineering-heavy pod spanning Berlin, Lisbon, and Stockholm." },
  { id: "apac", label: "Asia-Pacific", blurb: "Smallest pod, closest to the customers with the strictest audit requirements." },
  { id: "remote", label: "Remote-distributed", blurb: "No fixed city — hired for the role, not the zip code." },
];

export function peopleFor(group: GroupKey, nodeId: string): Person[] {
  return PEOPLE.filter((p) => p[group] === nodeId);
}

export type ValueItem = {
  id: string;
  ordinal: string;
  label: string;
  title: string;
  body: string;
  practice: string;
};

export const VALUES: ValueItem[] = [
  {
    id: "exception",
    ordinal: "01",
    label: "Specify the exception",
    title: "The exception is part of the rule, not an escape from it",
    body: "A policy that only describes the happy path isn't a policy — it's a wish. Every workflow Ordinal ships names its exceptions explicitly: what happens when the approver is out, when the amount crosses a second threshold, when the request is late.",
    practice: "Every workflow template in Ordinal requires at least one named exception path before it can be published — the editor blocks publish otherwise.",
  },
  {
    id: "override",
    ordinal: "02",
    label: "Name every override",
    title: "An override with no name attached is just a bug with better manners",
    body: "Software should make skipping a step possible when a real human needs to, but that skip has to have a face on it. Ordinal never lets a step disappear silently — it lets someone override it, on the record.",
    practice: "The override dialog requires a reason and an identity before it submits; both are written into the same audit row as the step it bypassed.",
  },
  {
    id: "audit",
    ordinal: "03",
    label: "Audit trails aren't a fallback",
    title: "The record is a feature, not something you dig for after an incident",
    body: "Most systems log an audit trail nobody reads until something goes wrong. Ordinal's audit view is a normal screen a customer's compliance lead opens on a Tuesday, not a forensic tool they open in a panic.",
    practice: "Every workflow run has a shareable, permanent audit page — the same page an auditor and the customer's own team both look at.",
  },
  {
    id: "edge-case",
    ordinal: "04",
    label: "Design for who breaks it",
    title: "Build for the person the process wasn't written for",
    body: "Approval chains are usually written for the typical request. Ordinal is built for the atypical one — the request that's ten times the usual size, or from someone who left the company yesterday, because that's the request that actually needed the process.",
    practice: "Every new workflow spec review includes a written answer to \"what does the largest and the smallest version of this request look like\" before it ships.",
  },
  {
    id: "visible",
    ordinal: "05",
    label: "Structure should be visible",
    title: "If a rule is enforced silently, it wasn't communicated — it was hidden",
    body: "Enforcement without visibility just moves confusion downstream. Anyone waiting on a step in an Ordinal workflow can see exactly where the request sits and why, not just that it's \"pending.\"",
    practice: "Every pending step shows the named approver, the rule that put it there, and how long it's been waiting — to the requester, not only the admin.",
  },
];

export type Milestone = { year: string; text: string };

export const MILESTONES: Milestone[] = [
  { year: "2018", text: "Ordinal starts after its founders spend eighteen months running a healthcare ops team's approval chain out of a spreadsheet and a shared inbox." },
  { year: "2020", text: "The enforcement engine ships. An approval chain stops being a document someone might read and becomes a sequence software actually runs." },
  { year: "2022", text: "Series A. Policy & Compliance Design splits out of engineering — writing a workflow spec turns out to be its own discipline, not a side task." },
  { year: "2025", text: "84 regulated customers later, the audit-log format Ordinal built gets referenced in two industry compliance guidelines it didn't write." },
];

export type Stat = { label: string; value: string };

export const STATS: Stat[] = [
  { label: "Founded", value: "2018" },
  { label: "Regulated customers", value: "84" },
  { label: "Countries on the team", value: "4" },
  { label: "Median approval time, cut", value: "61%" },
];
