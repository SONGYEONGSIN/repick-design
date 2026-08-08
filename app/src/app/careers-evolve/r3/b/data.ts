/**
 * Deterministic copy + fixture data for the Loomwork "Careers" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export type Department = "engineering" | "product" | "revenue" | "operations";
export type Location = "remote" | "austin" | "lisbon";

export const DEPARTMENT_LABELS: Record<Department, string> = {
  engineering: "Engineering",
  product: "Product & Design",
  revenue: "Revenue",
  operations: "Operations",
};

export const LOCATION_LABELS: Record<Location, string> = {
  remote: "Remote",
  austin: "Austin, TX",
  lisbon: "Lisbon, PT",
};

export type Role = {
  id: string;
  title: string;
  department: Department;
  location: Location;
  band: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

/**
 * Rendered as an always-visible kanban board — every department column (and, in the location
 * grouping, every location column) renders open, with every title on screen before any control is
 * touched. This satisfies the careers content contract at the board's default state: nothing here
 * requires a click to reveal a job title.
 */
export const ROLES: Role[] = [
  {
    id: "r1",
    title: "Senior Platform Engineer",
    department: "engineering",
    location: "remote",
    band: "Band III",
    summary: "Own the workflow execution engine that runs every automation Loomwork customers publish.",
    responsibilities: [
      "Design and operate the durable execution layer behind customer workflow runs",
      "Set the on-call rotation's reliability targets and carry a share of it",
      "Review architecture proposals from across the platform group",
    ],
    requirements: ["5+ years building backend systems at scale", "Comfortable owning production incidents end to end"],
  },
  {
    id: "r2",
    title: "Frontend Engineer, Workflow Canvas",
    department: "engineering",
    location: "austin",
    band: "Band II",
    summary: "Build the drag-and-drop canvas customers use to wire steps, branches, and approvals together.",
    responsibilities: [
      "Ship features on the canvas editor used by every Loomwork customer",
      "Pair with design on interaction details for a direct-manipulation UI",
      "Keep the canvas render path fast on workflows with hundreds of nodes",
    ],
    requirements: ["Strong React fundamentals", "Portfolio or code samples showing complex interactive UI"],
  },
  {
    id: "r3",
    title: "Staff Engineer, Data Pipelines",
    department: "engineering",
    location: "remote",
    band: "Band IV",
    summary: "Set technical direction for the event pipeline that feeds every workflow trigger.",
    responsibilities: [
      "Define the roadmap for ingestion, backfill, and replay across the pipeline",
      "Mentor two senior engineers and review their design docs",
      "Represent data infrastructure in cross-team planning",
    ],
    requirements: ["8+ years, with a track record setting technical direction", "Experience with high-throughput event systems"],
  },
  {
    id: "r4",
    title: "Engineering Manager, Integrations",
    department: "engineering",
    location: "lisbon",
    band: "Band IV",
    summary: "Lead the team that builds and maintains Loomwork's 40-plus third-party connectors.",
    responsibilities: [
      "Manage a team of five integration engineers",
      "Prioritize the connector roadmap against customer demand",
      "Run the team's weekly incident and reliability review",
    ],
    requirements: ["Prior experience managing an engineering team", "Comfortable balancing partner API constraints with roadmap"],
  },
  {
    id: "r5",
    title: "Product Designer",
    department: "product",
    location: "remote",
    band: "Band III",
    summary: "Own end-to-end design for the workflow builder, from first sketch to shipped detail.",
    responsibilities: [
      "Design the builder experience alongside the canvas engineering team",
      "Run usability sessions with customers building real workflows",
      "Maintain the shared component library used across the product",
    ],
    requirements: ["Portfolio showing complex B2B product work", "Comfortable presenting design rationale to engineering leads"],
  },
  {
    id: "r6",
    title: "Product Manager, Automation",
    department: "product",
    location: "austin",
    band: "Band III",
    summary: "Define what Loomwork automates next, working from support tickets and sales calls alike.",
    responsibilities: [
      "Own the roadmap for the automation and triggers surface",
      "Turn customer research into scoped, sequenced specs",
      "Partner with engineering leads on release planning",
    ],
    requirements: ["3+ years of B2B SaaS product management", "Comfortable reading usage data to prioritize"],
  },
  {
    id: "r7",
    title: "Account Executive, Mid-Market",
    department: "revenue",
    location: "austin",
    band: "Band III",
    summary: "Run full-cycle deals with operations and IT teams at 200-2,000 person companies.",
    responsibilities: [
      "Manage a pipeline of mid-market opportunities from discovery to close",
      "Run technical demos of the workflow builder for buying committees",
      "Forecast accurately against a quarterly number",
    ],
    requirements: ["3+ years closing mid-market B2B SaaS deals", "Comfortable running a multi-stakeholder sales process"],
  },
  {
    id: "r8",
    title: "Customer Success Manager",
    department: "revenue",
    location: "lisbon",
    band: "Band II",
    summary: "Own onboarding and renewal for a book of 30-40 mid-market accounts.",
    responsibilities: [
      "Guide new customers through their first three live workflows",
      "Run quarterly business reviews and flag renewal risk early",
      "Feed recurring feature requests back to product",
    ],
    requirements: ["2+ years in a customer success or account management role", "Comfortable owning a renewal number"],
  },
  {
    id: "r9",
    title: "Sales Development Representative",
    department: "revenue",
    location: "austin",
    band: "Band I",
    summary: "Generate qualified pipeline for the mid-market account executive team.",
    responsibilities: [
      "Book 15+ qualified meetings per month from inbound and outbound",
      "Research target accounts and personalize outreach",
      "Log activity and notes cleanly for the AE handoff",
    ],
    requirements: ["0-2 years of sales or customer-facing experience", "Comfortable with high daily outreach volume"],
  },
  {
    id: "r10",
    title: "People Operations Partner",
    department: "operations",
    location: "austin",
    band: "Band III",
    summary: "Run the people programs — onboarding, performance cycles, and policy — for a 120-person company.",
    responsibilities: [
      "Own onboarding logistics for every new hire across three offices",
      "Coordinate the twice-yearly performance review cycle",
      "Keep employee-facing policy documentation current",
    ],
    requirements: ["3+ years in a people operations or HR generalist role", "Comfortable working across three time zones"],
  },
  {
    id: "r11",
    title: "Finance & Billing Analyst",
    department: "operations",
    location: "remote",
    band: "Band II",
    summary: "Own usage-based billing accuracy and monthly close for the finance team.",
    responsibilities: [
      "Reconcile usage-based invoices against the metering pipeline",
      "Support monthly close and quarterly board reporting",
      "Investigate and resolve billing disputes with customers",
    ],
    requirements: ["2+ years in finance, accounting, or billing operations", "Advanced spreadsheet skills"],
  },
  {
    id: "r12",
    title: "Technical Support Engineer",
    department: "operations",
    location: "lisbon",
    band: "Band II",
    summary: "Resolve escalated technical tickets and write the runbooks that prevent the next one.",
    responsibilities: [
      "Triage and resolve tier-2 workflow and integration tickets",
      "Reproduce customer-reported bugs and file clear reports",
      "Write one runbook or macro improvement per month",
    ],
    requirements: ["2+ years in a technical support or implementation role", "Comfortable reading logs and API responses"],
  },
];

export const DEPARTMENTS = Object.keys(DEPARTMENT_LABELS) as Department[];
export const LOCATIONS = Object.keys(LOCATION_LABELS) as Location[];

/** Fixed order for the experience-bucket control — index doubles as the lookup key into COMP_MATRIX. */
export const EXPERIENCE_BUCKETS = ["0-1 yrs", "2-3 yrs", "4-6 yrs", "7-9 yrs", "10+ yrs"] as const;

export type CompCell = { band: string; base: string; equity: string; note?: string };

/**
 * Small deterministic lookup table behind the compensation panel. Two real inputs — department and
 * experience bucket — index into a fixed matrix of published figures. Nothing here is computed from
 * a formula at render time: the control only ever selects one of these twenty pre-written cells, so
 * the displayed band can never diverge from what is published in this file.
 */
export const COMP_MATRIX: Record<Department, CompCell[]> = {
  engineering: [
    { band: "Band I", base: "$78K-$90K", equity: "0.01%-0.02%" },
    { band: "Band II", base: "$98K-$112K", equity: "0.02%-0.04%" },
    { band: "Band III", base: "$128K-$148K", equity: "0.05%-0.08%" },
    { band: "Band IV", base: "$158K-$182K", equity: "0.08%-0.12%" },
    { band: "Band V", base: "$188K-$215K", equity: "0.12%-0.18%" },
  ],
  product: [
    { band: "Band I", base: "$74K-$85K", equity: "0.01%-0.02%" },
    { band: "Band II", base: "$92K-$105K", equity: "0.02%-0.04%" },
    { band: "Band III", base: "$120K-$138K", equity: "0.05%-0.08%" },
    { band: "Band IV", base: "$148K-$170K", equity: "0.08%-0.12%" },
    { band: "Band V", base: "$176K-$200K", equity: "0.12%-0.18%" },
  ],
  revenue: [
    { band: "Band I", base: "$55K-$62K", equity: "0.01%-0.02%", note: "plus uncapped commission" },
    { band: "Band II", base: "$68K-$78K", equity: "0.02%-0.04%", note: "plus uncapped commission" },
    { band: "Band III", base: "$88K-$102K", equity: "0.05%-0.08%", note: "plus uncapped commission" },
    { band: "Band IV", base: "$110K-$128K", equity: "0.08%-0.12%", note: "plus uncapped commission" },
    { band: "Band V", base: "$132K-$155K", equity: "0.12%-0.18%", note: "plus uncapped commission" },
  ],
  operations: [
    { band: "Band I", base: "$58K-$66K", equity: "0.01%-0.02%" },
    { band: "Band II", base: "$72K-$82K", equity: "0.02%-0.04%" },
    { band: "Band III", base: "$92K-$106K", equity: "0.05%-0.08%" },
    { band: "Band IV", base: "$112K-$130K", equity: "0.08%-0.12%" },
    { band: "Band V", base: "$134K-$152K", equity: "0.12%-0.18%" },
  ],
};

export const STATS = [
  { label: "Open roles", value: "12" },
  { label: "Departments", value: "4" },
  { label: "Hub cities", value: "3" },
];
