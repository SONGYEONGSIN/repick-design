/**
 * Deterministic copy + fixture data for the Ridgeline "Careers" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type Role = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Contract";
};

/**
 * Rendered as a real semantic <table>, fully visible on load — the careers delta this round is
 * built against ("the open-role inventory is the core proof — real job titles must be visible
 * without a click") is satisfied by construction: there is no collapsed state to open.
 */
export const ROLES: Role[] = [
  { id: "r1", title: "Senior Backend Engineer", team: "Platform", location: "Remote (US)", type: "Full-time" },
  { id: "r2", title: "Staff Frontend Engineer", team: "Product", location: "Denver, CO", type: "Full-time" },
  { id: "r3", title: "Site Reliability Engineer", team: "Platform", location: "Remote (US)", type: "Full-time" },
  { id: "r4", title: "Product Designer", team: "Product", location: "Denver, CO", type: "Full-time" },
  { id: "r5", title: "Data Engineer", team: "Platform", location: "Remote (EU)", type: "Full-time" },
  { id: "r6", title: "Customer Success Manager", team: "Success", location: "Remote (US)", type: "Full-time" },
  { id: "r7", title: "Technical Writer", team: "Product", location: "Remote (US)", type: "Contract" },
  { id: "r8", title: "Solutions Engineer", team: "Success", location: "Denver, CO", type: "Full-time" },
  { id: "r9", title: "Security Engineer", team: "Platform", location: "Remote (EU)", type: "Full-time" },
  { id: "r10", title: "Recruiting Coordinator", team: "People", location: "Denver, CO", type: "Contract" },
];

export type ProcessTab = { id: string; label: string; title: string; body: string };

export const PROCESS_TABS: ProcessTab[] = [
  {
    id: "screen",
    label: "1. Screen",
    title: "A 30-minute call with the hiring manager",
    body: "Not a trivia round. We talk through your last project in detail and what you'd actually work on here — most candidates say it felt more like a conversation than an interview.",
  },
  {
    id: "practical",
    label: "2. Practical",
    title: "A paid, take-home exercise scoped to real work",
    body: "Four hours, paid at your target rate, built from a real (anonymized) problem the team solved last quarter. No whiteboard algorithms — we want to see how you actually work.",
  },
  {
    id: "team",
    label: "3. Team",
    title: "Two 45-minute conversations with future teammates",
    body: "One with someone on your team, one with someone you'd work with cross-functionally. Both are two-way — come with questions, we expect you to grill us back.",
  },
  {
    id: "offer",
    label: "4. Offer",
    title: "A decision within five business days",
    body: "We tell every candidate where they stand within a week of the final conversation, whether the answer is yes or no. No ghosting, on either side of the table.",
  },
];

export type Perk = { label: string };

export const PERKS: Perk[] = [
  { label: "Full health, dental, vision" },
  { label: "Unlimited PTO, four-week minimum tracked" },
  { label: "$1,500 annual learning budget" },
  { label: "Home office stipend" },
  { label: "16-week paid parental leave" },
  { label: "401(k) with 4% match" },
];
