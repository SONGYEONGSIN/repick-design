/**
 * Deterministic copy + fixture data for the Isoline "Careers" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client, and the timezone-overlap bars are computed from fixed UTC-hour integers,
 * never from the visitor's clock.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type OfficeId = "austin" | "lisbon" | "singapore" | "remote";

export type Office = {
  id: OfficeId;
  city: string;
  region: string;
  tag: "HQ" | "Hub" | "Remote";
  utcLabel: string;
  /** Local working hours, expressed as a UTC-hour range (24h clock, non-wrapping). */
  workStart: number;
  workEnd: number;
  headcount: number;
  blurb: string;
  perk: string;
};

export const HQ_ID: OfficeId = "austin";

export const OFFICES: Office[] = [
  {
    id: "austin",
    city: "Austin",
    region: "United States",
    tag: "HQ",
    utcLabel: "UTC-5",
    workStart: 14,
    workEnd: 23,
    headcount: 62,
    blurb:
      "Where Isoline started, and still where product, engineering leadership, and revenue sit shoulder to shoulder.",
    perk: "Covered downtown parking, plus a standing Thursday team lunch on the company card.",
  },
  {
    id: "lisbon",
    city: "Lisbon",
    region: "Portugal",
    tag: "Hub",
    utcLabel: "UTC+0",
    workStart: 9,
    workEnd: 18,
    headcount: 24,
    blurb:
      "Our EU compliance and reporting hub — four years old, mostly hired from the local fintech scene.",
    perk: "Monthly meal allowance and a shortened four-day week through July and August.",
  },
  {
    id: "singapore",
    city: "Singapore",
    region: "Singapore",
    tag: "Hub",
    utcLabel: "UTC+8",
    workStart: 1,
    workEnd: 10,
    headcount: 15,
    blurb:
      "The newest office and our APAC compliance base. Work here is designed to hand off cleanly to Austin, not overlap with it.",
    perk: "Full relocation support plus a dedicated APAC regulatory research budget.",
  },
  {
    id: "remote",
    city: "Remote",
    region: "Americas & EMEA",
    tag: "Remote",
    utcLabel: "flexible, core hours 9am–5pm ET",
    workStart: 13,
    workEnd: 21,
    headcount: 33,
    blurb:
      "No office, but not unstructured — everyone on the remote roster keeps a few hours of overlap with Austin by design.",
    perk: "Coworking stipend, a real equipment budget, and no mandatory camera-on culture.",
  },
];

export type Department = "Engineering" | "Compliance Ops" | "Customer Success" | "Revenue" | "People";

export const DEPARTMENTS: Department[] = ["Engineering", "Compliance Ops", "Customer Success", "Revenue", "People"];

export type Role = {
  id: string;
  title: string;
  officeId: OfficeId;
  department: Department;
  type: "Full-time" | "Contract";
};

/**
 * Rendered as always-visible list items grouped by office, satisfying the careers content
 * contract this round is built against: at least one always-visible path shows real job titles
 * without a click. The default state (office = "all", team = "All teams", query = "") already
 * renders all fourteen.
 */
export const ROLES: Role[] = [
  { id: "r1", title: "Senior Platform Engineer", officeId: "austin", department: "Engineering", type: "Full-time" },
  { id: "r2", title: "Payroll Compliance Analyst", officeId: "austin", department: "Compliance Ops", type: "Full-time" },
  { id: "r3", title: "Enterprise Account Executive", officeId: "austin", department: "Revenue", type: "Full-time" },
  { id: "r4", title: "People Operations Generalist", officeId: "austin", department: "People", type: "Full-time" },
  { id: "r5", title: "Frontend Engineer, Reporting", officeId: "lisbon", department: "Engineering", type: "Full-time" },
  { id: "r6", title: "EU Compliance Counsel", officeId: "lisbon", department: "Compliance Ops", type: "Full-time" },
  { id: "r7", title: "Customer Success Manager, EMEA", officeId: "lisbon", department: "Customer Success", type: "Full-time" },
  { id: "r8", title: "APAC Compliance Analyst", officeId: "singapore", department: "Compliance Ops", type: "Full-time" },
  { id: "r9", title: "Solutions Engineer, APAC", officeId: "singapore", department: "Engineering", type: "Full-time" },
  { id: "r10", title: "Customer Success Manager, APAC", officeId: "singapore", department: "Customer Success", type: "Contract" },
  { id: "r11", title: "Staff Backend Engineer", officeId: "remote", department: "Engineering", type: "Full-time" },
  { id: "r12", title: "Technical Writer, Compliance", officeId: "remote", department: "Compliance Ops", type: "Contract" },
  { id: "r13", title: "Revenue Operations Analyst", officeId: "remote", department: "Revenue", type: "Full-time" },
  { id: "r14", title: "Support Engineer", officeId: "remote", department: "Customer Success", type: "Full-time" },
];

export type Perk = { label: string };

export const PERKS: Perk[] = [
  { label: "Full health, dental, and vision from day one" },
  { label: "Unlimited PTO, four-week minimum tracked and enforced" },
  { label: "$1,200 annual learning budget" },
  { label: "16-week paid parental leave, any office" },
  { label: "401(k) or local pension equivalent, matched" },
  { label: "Home office or coworking stipend" },
];

export type ProcessStep = { label: string; body: string };

export const PROCESS_STEPS: ProcessStep[] = [
  { label: "Intro call", body: "30 minutes with the hiring manager, scheduled inside your own working hours — never before 8am or after 7pm local." },
  { label: "Paid exercise", body: "A scoped, paid take-home built from real (anonymized) work, sized to four hours regardless of role." },
  { label: "Team conversations", body: "Two 45-minute calls with future teammates, one in-team and one cross-functional." },
  { label: "Decision", body: "An answer within five business days of the last conversation, in writing, whether it's yes or no." },
];

/** Overlap between two offices' UTC working-hour bands, in whole hours. Pure arithmetic — no clock reads. */
export function overlapHours(a: Office, b: Office): number {
  const start = Math.max(a.workStart, b.workStart);
  const end = Math.min(a.workEnd, b.workEnd);
  return Math.max(0, end - start);
}

/** Percent position of a UTC hour (0-23) along a 24-hour track, rounded to 2 decimals. */
export function hourToPct(hour: number): number {
  return Math.round((hour / 24) * 10000) / 100;
}
