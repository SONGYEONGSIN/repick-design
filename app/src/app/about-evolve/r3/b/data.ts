/**
 * Deterministic copy + fixture data for the Millrace "About" page. No Math.random/Date.now/new
 * Date anywhere in this route — every stat, year, and string below is a hardcoded literal so the
 * route hydrates identically on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const COMPANY_NAME = "Millrace";

export type Chapter = { id: string; number: string; title: string };

export const CHAPTERS: Chapter[] = [
  { id: "bottleneck", number: "01", title: "The Bottleneck" },
  { id: "turn", number: "02", title: "The Turn" },
  { id: "values", number: "03", title: "What We Build For" },
  { id: "proof", number: "04", title: "Proof In The Ledger" },
  { id: "people", number: "05", title: "The People" },
  { id: "headed", number: "06", title: "Where We're Headed" },
];

export type HeroStat = { value: string; label: string };

export const HERO_STATS: HeroStat[] = [
  { value: "99.2%", label: "invoice match accuracy" },
  { value: "4.1M", label: "invoices matched monthly" },
  { value: "11 days", label: "median rollout to first close" },
];

export type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  before: string;
  bioBack: string;
};

export const PEOPLE: Person[] = [
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Co-founder & CEO",
    initials: "PN",
    color: "#047857",
    before: "Controller, Meridian Freight",
    bioBack:
      "Priya ran month-end close at a 400-person logistics company for six years before deciding the close itself was the product worth building. She still reviews the top ten flagged exceptions every Friday.",
  },
  {
    id: "dev-okonkwo",
    name: "Dev Okonkwo",
    role: "Co-founder & CTO",
    initials: "DO",
    color: "#0f766e",
    before: "Staff engineer, a payments processor",
    bioBack:
      "Dev built matching pipelines for a payments processor and got tired of watching finance teams do by hand what the systems could already prove. He wrote Millrace's first matcher on a Saturday; it has been rewritten twice since.",
  },
  {
    id: "renee-castillo",
    name: "Renee Castillo",
    role: "Head of Product",
    initials: "RC",
    color: "#059669",
    before: "AP operations lead",
    bioBack:
      "Renee spent three years running AP operations before moving into product. She sits in on two customer close calls a month, unscheduled, because the roadmap she trusts is the one built from what she hears there.",
  },
  {
    id: "samuel-iwu",
    name: "Samuel Iwu",
    role: "Staff Engineer, Matching",
    initials: "SI",
    color: "#0d9488",
    before: "ML engineer, fraud detection",
    bioBack:
      "Samuel owns the fingerprint-matching engine end to end, from the fuzzy-match scoring model to the exception queue that catches what it can't resolve. He keeps a running list of the strangest invoices Millrace has ever seen.",
  },
  {
    id: "talia-grant",
    name: "Talia Grant",
    role: "Customer Success Lead",
    initials: "TG",
    color: "#065f46",
    before: "Implementation consultant, ERP systems",
    bioBack:
      "Talia has walked forty finance teams through their first close on Millrace. Her rule: no rollout ships until someone on the customer's team can explain the matching logic back to her, unprompted.",
  },
  {
    id: "omar-farouk",
    name: "Omar Farouk",
    role: "Finance & Ops Lead",
    initials: "OF",
    color: "#115e59",
    before: "Senior accountant",
    bioBack:
      "Omar runs Millrace's own books on Millrace, which means every bug he can't explain becomes the loudest bug in the building. He closes the company's own books in a single day.",
  },
];

export type ValueEntry = { title: string; body: string };
export type ValuePair = { id: string; buildFor: ValueEntry; pushBackOn: ValueEntry };

export const VALUE_PAIRS: ValuePair[] = [
  {
    id: "close-speed",
    buildFor: {
      title: "A close that finishes before the coffee gets cold",
      body: "Match confidence a controller can defend to an auditor, not a dashboard that just looks finished.",
    },
    pushBackOn: {
      title: "Reconciliation theater",
      body: "Progress bars and green checkmarks that describe how the tool feels, not whether the ledger actually matches.",
    },
  },
  {
    id: "exceptions",
    buildFor: {
      title: "Exceptions that explain themselves",
      body: "Every unmatched line shows the exact reason it didn't match — amount drift, vendor alias, timing window — in language a controller already uses.",
    },
    pushBackOn: {
      title: "A queue with no reasoning attached",
      body: "A pile of “needs review” rows and a shrug. An exception without a reason is just a second manual reconciliation.",
    },
  },
  {
    id: "support",
    buildFor: {
      title: "Support engineers who open the actual PDF",
      body: "If a match looks wrong, the person answering your ticket looks at the same invoice you're looking at before they answer.",
    },
    pushBackOn: {
      title: "Macros that ask if you've tried refreshing",
      body: "Canned responses that resolve the ticket, not the invoice. We measure support on invoices fixed, not tickets closed.",
    },
  },
  {
    id: "roadmap",
    buildFor: {
      title: "A roadmap finance teams can veto",
      body: "Every feature ships to a design-partner council of controllers first. If they can't use it during a real close, it doesn't ship.",
    },
    pushBackOn: {
      title: "Feature velocity nobody asked for",
      body: "Shipping fast for its own sake, then asking finance teams to bend their close process around the software instead of the reverse.",
    },
  },
];

export type ProofStat = { value: string; label: string };
export type ProofCategory = { id: string; label: string; stats: ProofStat[] };

export const PROOF_CATEGORIES: ProofCategory[] = [
  {
    id: "reliability",
    label: "Reliability",
    stats: [
      { value: "99.2%", label: "match accuracy across every connected ERP" },
      { value: "<0.3%", label: "false-match rate, checked against auditor sample" },
      { value: "7 yrs", label: "audit trail retained per invoice" },
    ],
  },
  {
    id: "adoption",
    label: "Adoption",
    stats: [
      { value: "340", label: "finance teams reconciling on Millrace" },
      { value: "11 days", label: "median time from kickoff to first automated close" },
      { value: "62", label: "NPS across finance and controller users" },
    ],
  },
  {
    id: "scale",
    label: "Scale",
    stats: [
      { value: "4.1M", label: "invoices matched every month" },
      { value: "$2.8B", label: "reconciled per quarter across all customers" },
      { value: "18", label: "ERPs and AP systems connected out of the box" },
    ],
  },
];
