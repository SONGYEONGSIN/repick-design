// Shared data + constants for the Northlane careers route. All copy is hardcoded English strings —
// no Math.random/Date.now/new Date anywhere, per page-brief-core §2 (deterministic rendering).

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQS: FaqItem[] = [
  {
    question: "What's the interview process like?",
    answer:
      "Five steps, usually two to three weeks door to door: a 30-minute intro call with a recruiter, a role-specific exercise you can complete asynchronously, two conversations with the team you'd join, and a final call with the hiring manager. We send you the full list of steps and who you'll meet before the first call, not after.",
  },
  {
    question: "Is remote work available?",
    answer:
      "Yes — Northlane has been fully remote since we were founded. The team is spread across 9 countries, we cover a co-working desk if you want one, and we get together in person twice a year for a full week.",
  },
  {
    question: "Do you sponsor visas?",
    answer:
      "For a subset of roles, yes. We hold sponsoring entities in the United States and the United Kingdom. Every open role below states whether that specific requisition can sponsor — if it doesn't say so, assume it can't, and ask your recruiter to confirm before you apply.",
  },
  {
    question: "How is compensation decided, and can I negotiate?",
    answer:
      "Pay is set by level and location band, not by negotiation, so two people doing the same job at the same level are paid the same. What is negotiable is which level your offer lands at — that's a conversation about scope and past responsibilities, and we're upfront about which evidence would move it.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "A person reads every application — no resume-screening software rejects you automatically. You'll hear back within 5 business days either way, including a no, and a no always comes with one concrete reason.",
  },
  {
    question: "Do you hire outside the countries you're already in?",
    answer:
      "Often. We hire through an employer-of-record partner in most countries where local law allows it. If you're outside our current 9, apply anyway and your recruiter will confirm eligibility before any offer conversation starts.",
  },
];

export type Role = {
  title: string;
  level: string;
  location: string;
  type: string;
};

export type Department = {
  name: string;
  slug: string;
  roles: Role[];
};

export const DEPARTMENTS: Department[] = [
  {
    name: "Engineering",
    slug: "engineering",
    roles: [
      { title: "Senior Backend Engineer, Platform", level: "L4", location: "Remote — US / Canada", type: "Full-time" },
      { title: "Frontend Engineer, Dashboards", level: "L3", location: "Remote — US / EU", type: "Full-time" },
      { title: "Staff Engineer, Data Pipeline", level: "L5", location: "Remote — US", type: "Full-time" },
      { title: "Engineering Manager, Integrations", level: "L5", location: "Remote — US / EU", type: "Full-time" },
    ],
  },
  {
    name: "Product",
    slug: "product",
    roles: [
      { title: "Senior Product Manager, Onboarding", level: "L4", location: "Remote — US", type: "Full-time" },
      { title: "Product Manager, Integrations", level: "L3", location: "Remote — US / EU", type: "Full-time" },
    ],
  },
  {
    name: "Design",
    slug: "design",
    roles: [
      { title: "Senior Product Designer", level: "L4", location: "Remote — US / EU", type: "Full-time" },
      { title: "Design Systems Designer", level: "L3", location: "Remote — US", type: "Full-time" },
    ],
  },
  {
    name: "Sales",
    slug: "sales",
    roles: [
      { title: "Account Executive, Mid-Market", level: "L4", location: "Remote — US", type: "Full-time" },
      { title: "Sales Development Representative", level: "L2", location: "Remote — US", type: "Full-time" },
    ],
  },
  {
    name: "Customer Success",
    slug: "customer-success",
    roles: [
      { title: "Customer Success Manager", level: "L3", location: "Remote — US / EU", type: "Full-time" },
      { title: "Technical Support Engineer", level: "L2", location: "Remote — US", type: "Full-time" },
    ],
  },
];

export type CompBand = {
  level: string;
  track: string;
  base: string;
  equity: string;
};

export const COMP_BANDS: CompBand[] = [
  { level: "L2 — Associate", track: "Support Engineer, SDR", base: "$70,000 – $85,000", equity: "0.02% – 0.05%" },
  { level: "L3 — Mid", track: "Engineer, PM, Designer, CSM", base: "$110,000 – $135,000", equity: "0.05% – 0.10%" },
  { level: "L4 — Senior", track: "Senior Engineer, Senior PM, Senior Designer, AE", base: "$150,000 – $180,000", equity: "0.10% – 0.18%" },
  { level: "L5 — Staff / Lead", track: "Staff Engineer, Engineering Manager", base: "$190,000 – $225,000", equity: "0.18% – 0.30%" },
  { level: "L6 — Principal", track: "Principal Engineer, Director", base: "$230,000 – $270,000", equity: "0.30% – 0.45%" },
];
