// Deterministic content for the Tallwood "About Us" page. No Math.random / Date.now / new Date
// anywhere in this file or its consumers — every value below is a fixed literal so server and
// client render identical markup.

export type Department = "Engineering" | "Design" | "Product" | "Ops" | "Research";

export const DEPARTMENTS: Department[] = [
  "Engineering",
  "Design",
  "Product",
  "Ops",
  "Research",
];

export interface Person {
  id: string;
  name: string;
  role: string;
  department: Department;
  office: string;
  bio: string;
}

export const PEOPLE: Person[] = [
  {
    id: "p01",
    name: "Marta Coelho",
    role: "VP of Engineering",
    department: "Engineering",
    office: "Lisbon",
    bio: "Marta has spent a decade building systems that page people at 3 a.m. as rarely as possible. She leads the platform team and still reviews the on-call runbook every quarter.",
  },
  {
    id: "p02",
    name: "Julian Ferreira",
    role: "Staff Engineer",
    department: "Engineering",
    office: "Lisbon",
    bio: "Julian owns the ingestion pipeline that keeps Tallwood's dashboards a few seconds behind reality instead of a few minutes. He is happiest debugging a race condition with a whiteboard.",
  },
  {
    id: "p03",
    name: "Priya Nathan",
    role: "Backend Engineer",
    department: "Engineering",
    office: "Remote",
    bio: "Priya joined from a logistics company where she learned that alerting fatigue is a design problem, not a tooling problem. She now writes most of Tallwood's alert-quality heuristics.",
  },
  {
    id: "p04",
    name: "Owen Baptiste",
    role: "Infrastructure Engineer",
    department: "Engineering",
    office: "Boston",
    bio: "Owen keeps the ingestion clusters running across three cloud regions and has an unreasonably strong opinion about which one has the best support turnaround.",
  },
  {
    id: "p05",
    name: "Sana Okafor",
    role: "Head of Design",
    department: "Design",
    office: "Boston",
    bio: "Sana came from an agency background and pushed Tallwood toward fewer, calmer screens. Her rule: if a dashboard needs a legend to explain its own colors, it goes back to the drawing board.",
  },
  {
    id: "p06",
    name: "Théo Lindqvist",
    role: "Product Designer",
    department: "Design",
    office: "Lisbon",
    bio: "Théo designs the alert and incident views, which means he spends a lot of time asking on-call engineers what they actually looked at during the last outage, not what the spec said they'd look at.",
  },
  {
    id: "p07",
    name: "Renata Alves",
    role: "Design Systems Lead",
    department: "Design",
    office: "Remote",
    bio: "Renata maintains the component library every team pulls from. She measures her job by how few new components got shipped this quarter, not how many.",
  },
  {
    id: "p08",
    name: "Marcus Whitfield",
    role: "VP of Product",
    department: "Product",
    office: "Boston",
    bio: "Marcus has shipped monitoring tools since before the term \"observability\" existed. He still keeps a printout of Tallwood's first customer email pinned above his desk.",
  },
  {
    id: "p09",
    name: "Yuki Tanaka",
    role: "Product Manager",
    department: "Product",
    office: "Singapore",
    bio: "Yuki runs the roadmap for Tallwood's APAC customers and is the reason the product now handles time zones without anyone filing a support ticket about it.",
  },
  {
    id: "p10",
    name: "Diego Fontes",
    role: "Product Manager",
    department: "Product",
    office: "Remote",
    bio: "Diego spent three years as an SRE before switching to product, which mostly means he vetoes features that would make his old job harder.",
  },
  {
    id: "p11",
    name: "Grace Milbourne",
    role: "Head of Customer Ops",
    department: "Ops",
    office: "Boston",
    bio: "Grace built Tallwood's support playbook from a spreadsheet she kept as the first support hire. It is now a small team, but the spreadsheet's instincts survived.",
  },
  {
    id: "p12",
    name: "Faizan Rahman",
    role: "Customer Success Lead",
    department: "Ops",
    office: "Singapore",
    bio: "Faizan handles renewals across the APAC book of business and has the highest response rate to the quarterly customer survey of anyone on the team, including sales.",
  },
  {
    id: "p13",
    name: "Ines Cardoso",
    role: "People Operations Lead",
    department: "Ops",
    office: "Lisbon",
    bio: "Ines runs hiring and onboarding for all four offices and wrote the remote-work handbook that most new hires say they actually read cover to cover.",
  },
  {
    id: "p14",
    name: "Halim Sørensen",
    role: "Research Scientist",
    department: "Research",
    office: "Remote",
    bio: "Halim works on the anomaly-detection models behind Tallwood's alerting. He publishes a public write-up of every model change, including the ones that didn't work.",
  },
  {
    id: "p15",
    name: "Camille Duarte",
    role: "Applied Researcher",
    department: "Research",
    office: "Lisbon",
    bio: "Camille studies why teams ignore alerts that later turn out to matter, and turns those findings into changes the alerting team actually ships.",
  },
];

export interface Office {
  id: string;
  city: string;
  region: string;
  note: string;
  headcount: number;
  x: number;
  y: number;
  isRemote?: boolean;
}

// x/y are fixed percentage coordinates on a schematic (not geographically precise) grid map.
export const OFFICES: Office[] = [
  {
    id: "boston",
    city: "Boston, USA",
    region: "Americas",
    note: "Headquarters. Product, Ops and part of the engineering team.",
    headcount: 19,
    x: 24,
    y: 34,
  },
  {
    id: "lisbon",
    city: "Lisbon, Portugal",
    region: "Europe",
    note: "Engineering and design hub, opened in the company's second year.",
    headcount: 16,
    x: 47,
    y: 32,
  },
  {
    id: "singapore",
    city: "Singapore",
    region: "Asia-Pacific",
    note: "Customer success and product for the APAC region.",
    headcount: 8,
    x: 78,
    y: 58,
  },
  {
    id: "remote",
    city: "Distributed",
    region: "Americas & Europe",
    note: "Fully remote teammates across 9 countries, on record for every planning cycle.",
    headcount: 12,
    x: 0,
    y: 0,
    isRemote: true,
  },
];

export interface ValuePillar {
  id: string;
  title: string;
  body: string;
}

export const VALUES: ValuePillar[] = [
  {
    id: "evidence",
    title: "Ship with evidence",
    body: "A change ships with the dashboard that proves it worked, not a promise that it will. If we can't measure it in production within a day, it isn't done.",
  },
  {
    id: "slow-feature",
    title: "Slow is a feature",
    body: "We would rather miss a launch date than ship an alert that pages someone incorrectly at 3 a.m. Reliability work competes for the same roadmap slot as everything else, and often wins.",
  },
  {
    id: "written-down",
    title: "Write it down",
    body: "Decisions live in documents, not group chats. Anyone who joins six months later should be able to read why a system looks the way it does without asking.",
  },
  {
    id: "default-trust",
    title: "Default to trust",
    body: "Every team, including support and people ops, can see the same production data engineering sees. Access is the default; restriction is the exception that needs a reason.",
  },
];
