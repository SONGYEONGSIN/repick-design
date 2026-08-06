// Deterministic dummy data for the Fathom Labs careers page. No Math.random / Date.now / new Date
// anywhere in this module — "postedRank" is a hand-assigned integer used only to order the
// "Newest" sort, not a timestamp.

export type Team = "Engineering" | "Design" | "Product" | "Support" | "Sales" | "Operations";

export type Location =
  | "Remote — US"
  | "Remote — EU"
  | "Remote — APAC"
  | "San Francisco (HQ)";

export type Employment = "Full-time" | "Contract";

export type Role = {
  id: string;
  title: string;
  team: Team;
  location: Location;
  type: Employment;
  /** Lower = posted more recently. Hand-assigned, not a timestamp. */
  postedRank: number;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const TEAMS: Team[] = [
  "Engineering",
  "Design",
  "Product",
  "Support",
  "Sales",
  "Operations",
];

export const LOCATIONS: Location[] = [
  "Remote — US",
  "Remote — EU",
  "Remote — APAC",
  "San Francisco (HQ)",
];

export const ROLES: Role[] = [
  {
    id: "backend-senior",
    title: "Senior Backend Engineer, Ingest",
    team: "Engineering",
    location: "Remote — US",
    type: "Full-time",
    postedRank: 1,
    summary:
      "Own the pipeline that ingests trace and log data from customer clusters at sustained rates above two million events per second.",
    responsibilities: [
      "Design and operate the ingest path that accepts trace, log, and metric data from customer agents.",
      "Set the reliability bar for a system that cannot lose data during a customer's own outage.",
      "Pair with the Support team to turn recurring ingest incidents into permanent fixes.",
      "Review architecture proposals from across the Engineering team as a senior voice, not a gatekeeper.",
    ],
    requirements: [
      "Production experience with a distributed system that handles ordered, high-volume writes.",
      "Comfortable owning an on-call rotation and writing the postmortem the next morning.",
      "Have shipped in Go, Rust, or a comparable systems language.",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer, Alerting",
    team: "Design",
    location: "Remote — EU",
    type: "Full-time",
    postedRank: 2,
    summary:
      "Design the surfaces where an on-call engineer decides, at 3am, whether an alert is real. Clarity here is the whole job.",
    responsibilities: [
      "Design alert triage, escalation, and incident-timeline surfaces used under real time pressure.",
      "Run studies with on-call engineers to find where an interface adds seconds to a decision.",
      "Maintain the shared component library alongside the two other designers on the team.",
      "Partner directly with engineering — no handoff document, just a shared Figma file and a Slack thread.",
    ],
    requirements: [
      "A portfolio with at least one dense, data-heavy product — dashboards, trading tools, ops consoles.",
      "Comfortable presenting rationale to engineers who will ask why, not just what.",
      "Working proficiency with Figma prototyping for interaction-heavy flows.",
    ],
  },
  {
    id: "staff-sre",
    title: "Staff Site Reliability Engineer",
    team: "Engineering",
    location: "San Francisco (HQ)",
    type: "Full-time",
    postedRank: 3,
    summary:
      "Fathom's own infrastructure is the largest customer of Fathom. Keep it boring on purpose.",
    responsibilities: [
      "Own capacity planning and failure-mode review for the query and storage tiers.",
      "Set the incident-response process the rest of Engineering follows during a live outage.",
      "Chair the monthly reliability review and track error-budget spend across services.",
      "Mentor two engineers rotating through the reliability track this year.",
    ],
    requirements: [
      "Eight or more years operating production infrastructure at meaningful scale.",
      "Direct experience running an error-budget or SLO program, not just reading about one.",
      "Based within commuting distance of San Francisco or open to relocation.",
    ],
  },
  {
    id: "support-engineer",
    title: "Support Engineer, APAC Hours",
    team: "Support",
    location: "Remote — APAC",
    type: "Full-time",
    postedRank: 4,
    summary:
      "Be the first Fathom engineer a customer talks to when their production dashboard goes dark.",
    responsibilities: [
      "Triage and resolve customer-reported incidents during APAC business hours.",
      "Reproduce hard-to-pin-down ingest and query bugs and file them with enough detail to fix on the first pass.",
      "Write the public status updates during an incident — plain language, no jargon, no spin.",
      "Feed recurring questions back into the docs team as gaps to close.",
    ],
    requirements: [
      "Two or more years in a technical support or solutions-engineering role for a developer product.",
      "Comfortable reading logs, stack traces, and query plans without hand-holding.",
      "Able to work core hours in at least one APAC timezone.",
    ],
  },
  {
    id: "pm-platform",
    title: "Product Manager, Platform",
    team: "Product",
    location: "Remote — US",
    type: "Full-time",
    postedRank: 5,
    summary:
      "Decide what the ingest and query platform builds next, using the incident data our own customers generate.",
    responsibilities: [
      "Own the roadmap for the ingestion platform shared across all Fathom products.",
      "Turn support tickets and sales-loss reasons into a prioritized, defensible backlog.",
      "Write specs precise enough that engineering doesn't need a follow-up meeting to start.",
      "Report platform health and roadmap progress to the leadership team monthly.",
    ],
    requirements: [
      "Three or more years as a PM on infrastructure, data, or developer-tools products.",
      "Can read a system architecture diagram and ask a sharp question about it.",
      "Written and verbal communication that holds up without a slide deck.",
    ],
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer, Dashboards",
    team: "Engineering",
    location: "Remote — EU",
    type: "Full-time",
    postedRank: 6,
    summary:
      "Build the dashboards engineers stare at during an outage. Every millisecond of render time is a millisecond added to someone's incident.",
    responsibilities: [
      "Build and maintain the real-time dashboard and query-explorer surfaces.",
      "Keep first paint and interaction latency inside the budget the team holds itself to.",
      "Work directly from Figma files with the Design team — no separate spec document.",
      "Add test coverage for the charting primitives other teams build on top of.",
    ],
    requirements: [
      "Strong TypeScript and React fundamentals, including performance profiling.",
      "Experience with canvas- or SVG-based data visualization at scale.",
      "Have worked on a product where render performance was a stated requirement, not an afterthought.",
    ],
  },
  {
    id: "technical-recruiter",
    title: "Technical Recruiter",
    team: "Operations",
    location: "Remote — US",
    type: "Full-time",
    postedRank: 7,
    summary:
      "Hire the next twenty engineers without letting the bar slip or the process drag past three weeks.",
    responsibilities: [
      "Own full-cycle recruiting for Engineering and Product roles.",
      "Partner with hiring managers to keep job descriptions honest about the actual work.",
      "Track time-to-offer and candidate feedback, and fix the stage that's leaking good candidates.",
      "Represent Fathom's culture accurately to candidates — no overselling the free snacks.",
    ],
    requirements: [
      "Three or more years recruiting for engineering roles at a technical product company.",
      "Comfortable pushing back on a hiring manager's ask when the process isn't working.",
      "Organized enough to run six concurrent searches without candidates falling through.",
    ],
  },
  {
    id: "account-executive",
    title: "Enterprise Account Executive",
    team: "Sales",
    location: "Remote — US",
    type: "Full-time",
    postedRank: 8,
    summary:
      "Sell observability to engineering leaders who have already been burned by a tool that didn't hold up under load.",
    responsibilities: [
      "Own a book of enterprise prospects from first call through signed contract.",
      "Run technical evaluations alongside a solutions engineer, not around them.",
      "Forecast accurately — leadership plans headcount off your number.",
      "Feed lost-deal reasons back to Product with enough specificity to act on.",
    ],
    requirements: [
      "Four or more years closing enterprise software deals above fifty thousand dollars annual value.",
      "Comfortable in technical conversations with engineering VPs, not just procurement.",
      "A track record you can walk through deal by deal, not just a quota-attainment slide.",
    ],
  },
  {
    id: "data-infra-engineer",
    title: "Data Infrastructure Engineer",
    team: "Engineering",
    location: "San Francisco (HQ)",
    type: "Full-time",
    postedRank: 9,
    summary:
      "Own the columnar storage layer that lets customers query a year of trace data in under a second.",
    responsibilities: [
      "Maintain and extend the columnar storage engine behind Fathom's query product.",
      "Design compaction and retention strategies that hold cost flat as data volume grows.",
      "Benchmark query paths against real customer workloads, not synthetic ones.",
      "Work in-office three days a week alongside the rest of the storage team.",
    ],
    requirements: [
      "Experience building or operating a columnar or time-series storage engine.",
      "Comfortable reasoning about disk, memory, and network tradeoffs at the systems level.",
      "Based in or willing to relocate to the San Francisco Bay Area.",
    ],
  },
  {
    id: "design-systems-lead",
    title: "Design Systems Lead",
    team: "Design",
    location: "Remote — US",
    type: "Contract",
    postedRank: 10,
    summary:
      "A six-month engagement to rebuild Fathom's component library into something the whole product team can move fast inside.",
    responsibilities: [
      "Audit the current component library and propose a consolidated token and component set.",
      "Ship the rebuilt system incrementally, alongside real product surfaces, not in isolation.",
      "Document usage clearly enough that engineers reach for it before writing custom CSS.",
      "Hand off a system the in-house team can maintain after the contract ends.",
    ],
    requirements: [
      "Prior experience leading a design-system rebuild inside a live product, start to finish.",
      "Fluent in both design tooling and enough front-end code to pair with engineers directly.",
      "Available for a six-month contract, roughly thirty hours a week.",
    ],
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    team: "Support",
    location: "Remote — EU",
    type: "Full-time",
    postedRank: 11,
    summary:
      "Keep our largest accounts renewing because the product earned it, not because the contract locked them in.",
    responsibilities: [
      "Own renewal and expansion for a portfolio of mid-market and enterprise accounts.",
      "Run quarterly reviews that surface real usage data, not a generic slide template.",
      "Escalate product gaps that put a renewal at risk directly to Product leadership.",
      "Build the onboarding playbook new CSMs will use after you.",
    ],
    requirements: [
      "Three or more years in customer success or account management for technical software.",
      "Comfortable owning a revenue number, not just a satisfaction score.",
      "Based in a European timezone with overlap into US morning hours.",
    ],
  },
  {
    id: "developer-advocate",
    title: "Developer Advocate",
    team: "Product",
    location: "Remote — APAC",
    type: "Full-time",
    postedRank: 12,
    summary:
      "Write the docs, talks, and sample repos that get an engineer from signup to a working integration in under an hour.",
    responsibilities: [
      "Write and maintain integration guides for the languages and frameworks customers actually use.",
      "Speak at engineering conferences and meetups across the APAC region.",
      "Build and keep working the sample applications linked from the documentation.",
      "Report recurring integration friction back to Engineering as prioritized bug reports.",
    ],
    requirements: [
      "Have shipped production code in at least two backend languages.",
      "Comfortable writing in public — docs, blog posts, or conference talks.",
      "Based in an APAC timezone with some flexibility for US-hours meetings.",
    ],
  },
];

export type Benefit = {
  label: string;
  detail: string;
};

export const BENEFITS: Benefit[] = [
  { label: "Unlimited", detail: "paid time off, with a 15-day minimum we enforce" },
  { label: "100%", detail: "of health, dental, and vision premiums covered" },
  { label: "$2,000", detail: "annual budget for courses, books, or conferences" },
  { label: "16 weeks", detail: "paid leave for any parent, birth or adoptive" },
  { label: "6 years", detail: "average tenure of the founding engineering team" },
  { label: "4", detail: "company-wide meeting-free days every month" },
];

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
