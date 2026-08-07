/**
 * Deterministic copy + fixture data for the Harborlight "Careers" page. No Math.random/Date.now/
 * new Date anywhere in this route — every literal below is hardcoded so the route hydrates
 * identically on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type Role = { title: string; team: string; location: string };

/**
 * Rendered as a plain, always-visible list — no filter, no toggle, no click required. The
 * simplest possible way to satisfy this round's careers delta (real job titles visible without
 * interaction): there is nothing to interact with in this section at all.
 */
export const ROLES: Role[] = [
  { title: "Full-Stack Engineer", team: "Engineering", location: "Remote" },
  { title: "Engineering Manager", team: "Engineering", location: "Remote" },
  { title: "Product Marketing Manager", team: "Marketing", location: "Austin, TX" },
  { title: "Payments Support Specialist", team: "Support", location: "Austin, TX" },
  { title: "Financial Analyst", team: "Finance", location: "Remote" },
  { title: "QA Engineer", team: "Engineering", location: "Remote" },
];

export type Quote = { name: string; role: string; body: string };

/**
 * Rendered one at a time by the team-quote carousel, fixed rotation order — the carousel
 * advances by index, never by any random pick.
 */
export const QUOTES: Quote[] = [
  {
    name: "Priya Chandran",
    role: "Engineering Manager, 3 years at Harborlight",
    body: "I've managed teams at two other startups before this one. The difference here is that nobody ships on a Friday afternoon and then goes quiet for the weekend — the on-call rotation is real, and so is the respect for it.",
  },
  {
    name: "Malik Osei",
    role: "Payments Support Specialist, 1 year at Harborlight",
    body: "Support isn't a stepping stone job here. Engineering pulls me into design reviews because I'm the one who's actually read every chargeback dispute we've ever had.",
  },
  {
    name: "Elena Vasquez",
    role: "Financial Analyst, 2 years at Harborlight",
    body: "I asked for a four-day work trial before accepting an offer, and they said yes without blinking. That told me more about how this place operates than any interview question could have.",
  },
];

export type Stage = { id: string; label: string; title: string; body: string };

export const STAGES: Stage[] = [
  { id: "apply", label: "Apply", title: "You apply, a real person reads it", body: "No resume-parsing bot makes the first cut. Someone on the hiring team reads every application within three business days." },
  { id: "call", label: "Intro call", title: "30 minutes, no technical questions", body: "This call is about fit and logistics — comp expectations, timeline, what you're looking for next. Technical depth comes later, not here." },
  { id: "interviews", label: "Interviews", title: "Three conversations, one day", body: "We bundle interviews into a single day whenever we can, so you're not spread across three weeks of back-and-forth scheduling." },
  { id: "decision", label: "Decision", title: "You hear back within a week", body: "Whether it's a yes or a no, you get an answer within seven days of your last conversation — with specific feedback if it's a no." },
];

export type EmploymentType = "full-time" | "contract";

export const BENEFITS: Record<EmploymentType, { label: string; value: string }[]> = {
  "full-time": [
    { label: "Health, dental, vision", value: "100% covered" },
    { label: "PTO", value: "Unlimited, 3-week minimum" },
    { label: "Equity", value: "Included in every offer" },
    { label: "Parental leave", value: "14 weeks paid" },
  ],
  contract: [
    { label: "Health, dental, vision", value: "Stipend toward your own plan" },
    { label: "PTO", value: "Built into the day rate" },
    { label: "Equity", value: "Not included" },
    { label: "Parental leave", value: "Not applicable" },
  ],
};
