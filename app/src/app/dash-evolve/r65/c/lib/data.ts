// Fulcrum — workforce / headcount planning console for a People Ops team.
//
// Determinism note: every number on this page is derived at module-load time from the two
// per-record arrays below (EMPLOYEES, ALL_ROLES) via pure arithmetic over fixed indices. There is
// no Math.random() and no Date()/Date.now() anywhere in this file or its consumers — "today" is a
// fixed constant (NOW_IDX / TODAY_DAY, standing for 2026-11-24) and every id-shaped spread below
// uses plain modulo arithmetic seeded by a fixed per-department integer, not a PRNG. The hero
// number, every inline stat, and every bullet-row value are computed by filtering/summing these
// same two arrays — never authored as a separate headline figure that could silently drift from
// what the Pipeline table or a department's inspector panel actually lists.

export type DeptId =
  | "eng"
  | "product"
  | "design"
  | "sales"
  | "marketing"
  | "cs"
  | "people"
  | "finance"
  | "it";

export type Group = "Product & Engineering" | "Go-to-Market" | "Operations & Support";

export const LEVELS = ["Entry", "Mid", "Senior", "Lead"] as const;
export type Level = (typeof LEVELS)[number];

// ---------------------------------------------------------------------------
// Calendar — fixed, no Date(). Index 0 = Jun '25 ... index 17 = Nov '26 ("today").
// START_DAY[i] is the day offset of that month's first day from index 0; TODAY_DAY is the offset
// of 2026-11-24 itself (24 days into month index 17), giving realistic non-round "days open" math.
// ---------------------------------------------------------------------------
export const MONTH_LABELS = [
  "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25",
  "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26",
  "Aug '26", "Sep '26", "Oct '26", "Nov '26",
] as const;

export const START_DAY = [0, 30, 61, 92, 122, 153, 183, 214, 245, 273, 304, 334, 365, 395, 426, 457, 487, 518];
export const TODAY_DAY = 542; // 518 + 24 days into Nov '26
export const NOW_IDX = 17;

export type PeriodId = "qtd" | "ytd" | "t12m";
export interface PeriodDef {
  id: PeriodId;
  label: string;
  longLabel: string;
  startIdx: number;
}
export const PERIODS: PeriodDef[] = [
  { id: "qtd", label: "QTD", longLabel: "Quarter to date (Oct–Nov '26)", startIdx: 16 },
  { id: "ytd", label: "YTD", longLabel: "Year to date (Jan–Nov '26)", startIdx: 7 },
  { id: "t12m", label: "Trailing 12mo", longLabel: "Trailing 12 months (Dec '25–Nov '26)", startIdx: 6 },
];

export function elapsedDays(openedIdx: number, closedIdx: number | null): number {
  const endDay = closedIdx !== null ? START_DAY[closedIdx] : TODAY_DAY;
  return Math.max(0, endDay - START_DAY[openedIdx]);
}

// ---------------------------------------------------------------------------
// Departments — target is an authored planning input (the hiring goal leadership set); every
// other figure attached to a department (current headcount, ratio, level mix, recent activity) is
// computed below from EMPLOYEES, never typed in as a second, separately-authored number.
// ---------------------------------------------------------------------------
interface DeptGen {
  id: DeptId;
  name: string;
  group: Group;
  target: number;
  activeCount: number;
  departedCount: number;
  moveCount: number;
  seed: number;
}

const DEPT_GEN: DeptGen[] = [
  { id: "eng", name: "Engineering", group: "Product & Engineering", target: 95, activeCount: 82, departedCount: 9, moveCount: 6, seed: 0 },
  { id: "product", name: "Product", group: "Product & Engineering", target: 28, activeCount: 30, departedCount: 3, moveCount: 2, seed: 1 },
  { id: "design", name: "Design", group: "Product & Engineering", target: 20, activeCount: 19, departedCount: 3, moveCount: 1, seed: 2 },
  { id: "sales", name: "Sales", group: "Go-to-Market", target: 110, activeCount: 127, departedCount: 28, moveCount: 5, seed: 3 },
  { id: "marketing", name: "Marketing", group: "Go-to-Market", target: 32, activeCount: 25, departedCount: 5, moveCount: 2, seed: 4 },
  { id: "cs", name: "Customer Success", group: "Go-to-Market", target: 48, activeCount: 58, departedCount: 9, moveCount: 4, seed: 5 },
  { id: "people", name: "People Ops", group: "Operations & Support", target: 16, activeCount: 16, departedCount: 1, moveCount: 1, seed: 6 },
  { id: "finance", name: "Finance & Legal", group: "Operations & Support", target: 18, activeCount: 16, departedCount: 1, moveCount: 1, seed: 7 },
  { id: "it", name: "IT & Security", group: "Operations & Support", target: 14, activeCount: 16, departedCount: 2, moveCount: 1, seed: 8 },
];

export interface Department {
  id: DeptId;
  name: string;
  group: Group;
  target: number;
}
export const DEPARTMENTS: Department[] = DEPT_GEN.map((d) => ({ id: d.id, name: d.name, group: d.group, target: d.target }));
export const GROUPS: Group[] = ["Product & Engineering", "Go-to-Market", "Operations & Support"];

export interface Employee {
  id: string;
  dept: DeptId;
  level: Level;
  hireIdx: number; // -1 means hired before the Jun '25 window opened
  departIdx: number | null;
  moveIdx: number | null; // an internal promotion/transfer that landed them in `dept`
}

function buildEmployees(): Employee[] {
  const out: Employee[] = [];
  for (const d of DEPT_GEN) {
    const legacyCutoff = Math.floor(d.activeCount * 0.6);
    const windowedCount = Math.max(1, d.activeCount - legacyCutoff);
    for (let i = 0; i < d.activeCount; i++) {
      const hireIdx =
        i < legacyCutoff ? -1 : Math.min(17, Math.floor(((i - legacyCutoff) * 18) / windowedCount));
      const moveIdx = i < d.moveCount ? 1 + ((i * 4 + d.seed * 2) % 17) : null;
      out.push({ id: `${d.id}-a${i}`, dept: d.id, level: LEVELS[i % LEVELS.length], hireIdx, departIdx: null, moveIdx });
    }
    for (let j = 0; j < d.departedCount; j++) {
      const departIdx = 1 + ((j * 5 + d.seed * 3) % 17);
      out.push({ id: `${d.id}-d${j}`, dept: d.id, level: LEVELS[j % LEVELS.length], hireIdx: -1, departIdx, moveIdx: null });
    }
  }
  return out;
}
export const EMPLOYEES: Employee[] = buildEmployees();

function isActiveAt(e: Employee, idx: number): boolean {
  if (e.hireIdx > idx) return false;
  if (e.departIdx !== null && e.departIdx <= idx) return false;
  return true;
}

export function headcountAt(idx: number, dept?: DeptId): number {
  let n = 0;
  for (const e of EMPLOYEES) {
    if (dept && e.dept !== dept) continue;
    if (isActiveAt(e, idx)) n++;
  }
  return n;
}

export function departuresInWindow(startIdx: number, endIdx: number, dept?: DeptId): number {
  let n = 0;
  for (const e of EMPLOYEES) {
    if (dept && e.dept !== dept) continue;
    if (e.departIdx !== null && e.departIdx >= startIdx && e.departIdx <= endIdx) n++;
  }
  return n;
}

export function hiresInWindow(startIdx: number, endIdx: number, dept?: DeptId): number {
  let n = 0;
  for (const e of EMPLOYEES) {
    if (dept && e.dept !== dept) continue;
    if (e.hireIdx >= startIdx && e.hireIdx <= endIdx) n++;
  }
  return n;
}

export function movesInWindow(startIdx: number, endIdx: number, dept?: DeptId): number {
  let n = 0;
  for (const e of EMPLOYEES) {
    if (dept && e.dept !== dept) continue;
    if (e.moveIdx !== null && e.moveIdx >= startIdx && e.moveIdx <= endIdx) n++;
  }
  return n;
}

export function avgHeadcount(startIdx: number, dept?: DeptId): number {
  return (headcountAt(NOW_IDX, dept) + headcountAt(startIdx - 1, dept)) / 2;
}

export function netChange(startIdx: number, dept?: DeptId): number {
  return headcountAt(NOW_IDX, dept) - headcountAt(startIdx - 1, dept);
}

export function attritionRate(startIdx: number, dept?: DeptId): number {
  const avg = avgHeadcount(startIdx, dept);
  if (avg <= 0) return 0;
  return (departuresInWindow(startIdx, NOW_IDX, dept) / avg) * 100;
}

export function mobilityRate(startIdx: number, dept?: DeptId): number {
  const now = headcountAt(NOW_IDX, dept);
  if (now <= 0) return 0;
  return (movesInWindow(startIdx, NOW_IDX, dept) / now) * 100;
}

// ---------------------------------------------------------------------------
// Open-role pipeline — the single dataset the Pipeline table renders row-for-row. Stats that cite
// "new roles opened" or "avg time to fill" are computed by filtering this exact array, so they can
// never disagree with what the table lists.
// ---------------------------------------------------------------------------
export type RoleStatus = "Sourcing" | "Interviewing" | "Offer Extended" | "Filled" | "Withdrawn";

export interface RoleRecord {
  id: string;
  title: string;
  dept: DeptId;
  level: Level;
  status: RoleStatus;
  openedIdx: number;
  closedIdx: number | null;
}

export const ALL_ROLES: RoleRecord[] = [
  { id: "r1", title: "Staff Platform Engineer", dept: "eng", level: "Lead", status: "Interviewing", openedIdx: 14, closedIdx: null },
  { id: "r2", title: "Senior Backend Engineer", dept: "eng", level: "Senior", status: "Sourcing", openedIdx: 16, closedIdx: null },
  { id: "r3", title: "Frontend Engineer II", dept: "eng", level: "Mid", status: "Offer Extended", openedIdx: 15, closedIdx: null },
  { id: "r4", title: "Engineering Manager, Infra", dept: "eng", level: "Lead", status: "Sourcing", openedIdx: 9, closedIdx: null },
  { id: "r5", title: "Site Reliability Engineer", dept: "eng", level: "Senior", status: "Filled", openedIdx: 6, closedIdx: 9 },
  { id: "r6", title: "Machine Learning Engineer", dept: "eng", level: "Senior", status: "Filled", openedIdx: 3, closedIdx: 8 },
  { id: "r7", title: "Backend Engineer", dept: "eng", level: "Entry", status: "Withdrawn", openedIdx: 11, closedIdx: 13 },
  { id: "r8", title: "Data Platform Engineer", dept: "eng", level: "Senior", status: "Offer Extended", openedIdx: 13, closedIdx: null },

  { id: "r9", title: "Senior Product Manager", dept: "product", level: "Senior", status: "Interviewing", openedIdx: 15, closedIdx: null },
  { id: "r10", title: "Product Manager, Growth", dept: "product", level: "Mid", status: "Sourcing", openedIdx: 17, closedIdx: null },
  { id: "r11", title: "Product Manager, Platform", dept: "product", level: "Senior", status: "Filled", openedIdx: 5, closedIdx: 10 },
  { id: "r12", title: "Associate Product Manager", dept: "product", level: "Entry", status: "Filled", openedIdx: 12, closedIdx: 14 },

  { id: "r13", title: "Product Designer", dept: "design", level: "Mid", status: "Sourcing", openedIdx: 16, closedIdx: null },
  { id: "r14", title: "Design Systems Lead", dept: "design", level: "Lead", status: "Filled", openedIdx: 2, closedIdx: 7 },
  { id: "r15", title: "Senior Product Designer", dept: "design", level: "Senior", status: "Sourcing", openedIdx: 11, closedIdx: null },

  { id: "r16", title: "Enterprise Account Executive", dept: "sales", level: "Senior", status: "Interviewing", openedIdx: 15, closedIdx: null },
  { id: "r17", title: "Account Executive, Mid-Market", dept: "sales", level: "Mid", status: "Sourcing", openedIdx: 17, closedIdx: null },
  { id: "r18", title: "Account Executive, Mid-Market", dept: "sales", level: "Mid", status: "Sourcing", openedIdx: 16, closedIdx: null },
  { id: "r19", title: "Sales Development Rep", dept: "sales", level: "Entry", status: "Offer Extended", openedIdx: 14, closedIdx: null },
  { id: "r20", title: "Sales Development Rep", dept: "sales", level: "Entry", status: "Sourcing", openedIdx: 13, closedIdx: null },
  { id: "r21", title: "Sales Engineer", dept: "sales", level: "Senior", status: "Interviewing", openedIdx: 12, closedIdx: null },
  { id: "r22", title: "Enterprise Account Executive", dept: "sales", level: "Senior", status: "Sourcing", openedIdx: 4, closedIdx: null },
  { id: "r23", title: "Account Executive, SMB", dept: "sales", level: "Entry", status: "Filled", openedIdx: 7, closedIdx: 9 },
  { id: "r24", title: "Account Executive, SMB", dept: "sales", level: "Entry", status: "Filled", openedIdx: 9, closedIdx: 11 },
  { id: "r25", title: "Sales Development Rep", dept: "sales", level: "Entry", status: "Filled", openedIdx: 10, closedIdx: 11 },
  { id: "r26", title: "Regional Sales Manager", dept: "sales", level: "Lead", status: "Withdrawn", openedIdx: 6, closedIdx: 8 },
  { id: "r27", title: "Sales Engineer", dept: "sales", level: "Senior", status: "Filled", openedIdx: 13, closedIdx: 15 },

  { id: "r28", title: "Lifecycle Marketing Manager", dept: "marketing", level: "Mid", status: "Sourcing", openedIdx: 17, closedIdx: null },
  { id: "r29", title: "Content Strategist", dept: "marketing", level: "Mid", status: "Interviewing", openedIdx: 13, closedIdx: null },
  { id: "r30", title: "Field Marketing Manager", dept: "marketing", level: "Senior", status: "Filled", openedIdx: 4, closedIdx: 8 },
  { id: "r31", title: "Marketing Operations Manager", dept: "marketing", level: "Mid", status: "Withdrawn", openedIdx: 9, closedIdx: 11 },

  { id: "r32", title: "Customer Success Manager", dept: "cs", level: "Mid", status: "Sourcing", openedIdx: 16, closedIdx: null },
  { id: "r33", title: "Senior CSM, Enterprise", dept: "cs", level: "Senior", status: "Interviewing", openedIdx: 15, closedIdx: null },
  { id: "r34", title: "Support Engineer", dept: "cs", level: "Entry", status: "Offer Extended", openedIdx: 14, closedIdx: null },
  { id: "r35", title: "Customer Success Manager", dept: "cs", level: "Mid", status: "Filled", openedIdx: 9, closedIdx: 11 },
  { id: "r36", title: "Support Engineer", dept: "cs", level: "Entry", status: "Filled", openedIdx: 11, closedIdx: 12 },
  { id: "r37", title: "Onboarding Specialist", dept: "cs", level: "Entry", status: "Withdrawn", openedIdx: 15, closedIdx: 16 },
  { id: "r38", title: "Customer Success Manager", dept: "cs", level: "Mid", status: "Sourcing", openedIdx: 5, closedIdx: null },

  { id: "r39", title: "People Partner", dept: "people", level: "Mid", status: "Sourcing", openedIdx: 15, closedIdx: null },
  { id: "r40", title: "Technical Recruiter", dept: "people", level: "Mid", status: "Filled", openedIdx: 8, closedIdx: 10 },

  { id: "r41", title: "Senior Financial Analyst", dept: "finance", level: "Senior", status: "Interviewing", openedIdx: 14, closedIdx: null },
  { id: "r42", title: "Corporate Counsel", dept: "finance", level: "Lead", status: "Sourcing", openedIdx: 10, closedIdx: null },
  { id: "r43", title: "Accounts Payable Specialist", dept: "finance", level: "Entry", status: "Filled", openedIdx: 5, closedIdx: 7 },

  { id: "r44", title: "Security Engineer", dept: "it", level: "Senior", status: "Sourcing", openedIdx: 16, closedIdx: null },
  { id: "r45", title: "IT Systems Administrator", dept: "it", level: "Mid", status: "Filled", openedIdx: 7, closedIdx: 9 },
  { id: "r46", title: "IT Systems Administrator", dept: "it", level: "Mid", status: "Withdrawn", openedIdx: 3, closedIdx: 5 },
];

export function newRolesOpened(startIdx: number, dept?: DeptId): number {
  return ALL_ROLES.filter((r) => (!dept || r.dept === dept) && r.openedIdx >= startIdx && r.openedIdx <= NOW_IDX).length;
}

function filledInWindow(startIdx: number, dept?: DeptId): RoleRecord[] {
  return ALL_ROLES.filter(
    (r) => r.status === "Filled" && r.closedIdx !== null && r.closedIdx >= startIdx && r.closedIdx <= NOW_IDX && (!dept || r.dept === dept)
  );
}

/** Count of roles actually filled within the window — callers use this to tell a genuine "0 days"
 * from "no roles were filled this period", which `avgTimeToFill` alone cannot distinguish. */
export function filledRolesCount(startIdx: number, dept?: DeptId): number {
  return filledInWindow(startIdx, dept).length;
}

export function avgTimeToFill(startIdx: number, dept?: DeptId): number {
  const rows = filledInWindow(startIdx, dept);
  if (rows.length === 0) return 0;
  const total = rows.reduce((s, r) => s + elapsedDays(r.openedIdx, r.closedIdx), 0);
  return total / rows.length;
}

// ---------------------------------------------------------------------------
// Monthly series for the hero/stat sparklines — every point is computed the same way the headline
// figure for that stat is, just evaluated one month at a time instead of across the whole window.
// ---------------------------------------------------------------------------
export function headcountSeries(startIdx: number, dept?: DeptId): number[] {
  const vals: number[] = [];
  for (let idx = startIdx - 1; idx <= NOW_IDX; idx++) vals.push(headcountAt(idx, dept));
  return vals;
}

export function attritionRateSeries(startIdx: number, dept?: DeptId): number[] {
  const vals: number[] = [];
  for (let idx = startIdx; idx <= NOW_IDX; idx++) {
    const avg = (headcountAt(idx, dept) + headcountAt(idx - 1, dept)) / 2 || 1;
    const dep = departuresInWindow(idx, idx, dept);
    vals.push(Math.round((dep / avg) * 1000) / 10);
  }
  return vals;
}

export function newRolesSeries(startIdx: number, dept?: DeptId): number[] {
  const vals: number[] = [];
  for (let idx = startIdx; idx <= NOW_IDX; idx++) {
    vals.push(ALL_ROLES.filter((r) => r.openedIdx === idx && (!dept || r.dept === dept)).length);
  }
  return vals;
}

export function mobilityRateSeries(startIdx: number, dept?: DeptId): number[] {
  const vals: number[] = [];
  for (let idx = startIdx; idx <= NOW_IDX; idx++) {
    const now = headcountAt(idx, dept) || 1;
    const mv = movesInWindow(idx, idx, dept);
    vals.push(Math.round((mv / now) * 1000) / 10);
  }
  return vals;
}

export function timeToFillSeries(startIdx: number, dept?: DeptId): number[] {
  const overall = avgTimeToFill(startIdx, dept);
  const vals: number[] = [];
  let sum = 0;
  let count = 0;
  for (let idx = startIdx; idx <= NOW_IDX; idx++) {
    const rows = ALL_ROLES.filter((r) => r.status === "Filled" && r.closedIdx === idx && (!dept || r.dept === dept));
    for (const r of rows) {
      sum += elapsedDays(r.openedIdx, r.closedIdx);
      count++;
    }
    vals.push(count > 0 ? Math.round((sum / count) * 10) / 10 : overall);
  }
  return vals;
}

// ---------------------------------------------------------------------------
// Department-level breakdown used only by the ephemeral per-row inspector (BulletGrid). Entirely
// derived from EMPLOYEES — never a second, hand-typed level/headcount table.
// ---------------------------------------------------------------------------
export interface DeptActivityItem {
  kind: "hire" | "departure";
  level: Level;
  monthIdx: number;
}

export function levelBreakdown(dept: DeptId): { level: Level; count: number }[] {
  return LEVELS.map((level) => ({
    level,
    count: EMPLOYEES.filter((e) => e.dept === dept && e.level === level && isActiveAt(e, NOW_IDX)).length,
  }));
}

export function recentActivity(dept: DeptId): DeptActivityItem[] {
  const hires = EMPLOYEES.filter((e) => e.dept === dept && e.hireIdx >= 0)
    .sort((a, b) => b.hireIdx - a.hireIdx)
    .slice(0, 3)
    .map((e) => ({ kind: "hire" as const, level: e.level, monthIdx: e.hireIdx }));
  const departures = EMPLOYEES.filter((e) => e.dept === dept && e.departIdx !== null)
    .sort((a, b) => (b.departIdx as number) - (a.departIdx as number))
    .slice(0, 2)
    .map((e) => ({ kind: "departure" as const, level: e.level, monthIdx: e.departIdx as number }));
  return [...hires, ...departures].sort((a, b) => b.monthIdx - a.monthIdx);
}

// ---------------------------------------------------------------------------
// Shell boilerplate (workspace switcher, current user, notification feed) — decorative context,
// not part of the differentiating structure.
// ---------------------------------------------------------------------------
export const CURRENT_USER = { name: "Priya Natarajan", role: "VP, People Operations", initials: "PN" };
export const WORKSPACES = ["Northwind — All entities", "Northwind — NA", "Northwind — EMEA", "Northwind — APAC"];

export const NOTIFICATIONS = [
  { id: "n1", title: "Offer accepted: Senior Backend Engineer (Engineering)", time: "2h ago" },
  { id: "n2", title: "Sales headcount crossed 115% of its Q4 target", time: "Yesterday" },
  { id: "n3", title: "3 open roles have been open for 90+ days", time: "2 days ago" },
];

export function formatSigned(n: number): string {
  const r = Math.round(n);
  return `${r > 0 ? "+" : r < 0 ? "−" : "±"}${new Intl.NumberFormat("en-US").format(Math.abs(r))}`;
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
