/**
 * Deterministic copy + fixture data for the Talus "Careers" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export type Team = "engineering" | "design" | "sales" | "support";
export type Location = "remote" | "berlin" | "toronto";

export const TEAM_LABELS: Record<Team, string> = {
  engineering: "Engineering",
  design: "Design",
  sales: "Sales",
  support: "Support",
};

export const LOCATION_LABELS: Record<Location, string> = {
  remote: "Remote",
  berlin: "Berlin",
  toronto: "Toronto",
};

export type Role = {
  id: string;
  title: string;
  team: Team;
  location: Location;
  compNote: string;
  responsibilities: string[];
};

/**
 * Rendered as an always-visible card grid — every title, team, and location shows before any
 * facet checkbox is touched. The careers content contract ("real job titles visible without a
 * click") is satisfied at the grid level; the per-card <details> below only ever adds extra
 * responsibilities copy, never the title itself.
 */
export const ROLES: Role[] = [
  {
    id: "r1",
    title: "Senior Backend Engineer",
    team: "engineering",
    location: "remote",
    compNote: "L4 band",
    responsibilities: ["Own the ingestion service that processes 40M events/day", "On-call one week in five"],
  },
  {
    id: "r2",
    title: "Engineering Manager, Platform",
    team: "engineering",
    location: "berlin",
    compNote: "L5 band",
    responsibilities: ["Manage a team of six backend engineers", "Run the weekly reliability review"],
  },
  {
    id: "r3",
    title: "Product Designer",
    team: "design",
    location: "remote",
    compNote: "L3 band",
    responsibilities: ["Own the onboarding flow end to end", "Pair weekly with the research lead"],
  },
  {
    id: "r4",
    title: "Account Executive",
    team: "sales",
    location: "toronto",
    compNote: "L3 band",
    responsibilities: ["Close mid-market deals in the $20-80K ARR range", "Travel roughly once a month"],
  },
  {
    id: "r5",
    title: "Support Engineer",
    team: "support",
    location: "remote",
    compNote: "L2 band",
    responsibilities: ["Triage and resolve tier-2 tickets", "Write one runbook improvement per month"],
  },
  {
    id: "r6",
    title: "Staff Engineer, Data",
    team: "engineering",
    location: "remote",
    compNote: "L5 band",
    responsibilities: ["Set technical direction for the analytics pipeline", "Mentor two senior engineers"],
  },
  {
    id: "r7",
    title: "Sales Development Rep",
    team: "sales",
    location: "berlin",
    compNote: "L2 band",
    responsibilities: ["Book 15 qualified meetings per month", "Report to the Berlin sales lead"],
  },
  {
    id: "r8",
    title: "UX Researcher",
    team: "design",
    location: "toronto",
    compNote: "L3 band",
    responsibilities: ["Run 4-6 customer interviews per sprint", "Own the quarterly usability report"],
  },
];

export type Level = { key: string; label: string; base: string; equity: string; summary: string };

/**
 * Rendered by the level range-slider — the slider only ever selects one of these five fixed
 * records, never computes a number, so a displayed comp band always matches a real published
 * level.
 */
export const LEVELS: Level[] = [
  { key: "L1", label: "L1 — Associate", base: "$70K–$85K", equity: "0.01%–0.03%", summary: "Entry-level individual contributor, typically 0-2 years experience." },
  { key: "L2", label: "L2 — Mid", base: "$95K–$115K", equity: "0.03%–0.06%", summary: "Independently owns small-to-medium projects with light guidance." },
  { key: "L3", label: "L3 — Senior", base: "$125K–$150K", equity: "0.06%–0.10%", summary: "Owns a domain end to end and mentors L1-L2 teammates informally." },
  { key: "L4", label: "L4 — Staff", base: "$155K–$185K", equity: "0.10%–0.16%", summary: "Sets technical or functional direction across multiple teams." },
  { key: "L5", label: "L5 — Principal / Manager", base: "$190K–$225K", equity: "0.16%–0.25%", summary: "Owns an org-level outcome, whether as an IC or as a people manager." },
];
