// Deterministic dummy data — no Math.random / Date.now / argument-less new Date().

export interface Member {
  name: string;
  role: string;
  status: "active" | "leave";
}

export interface Team {
  id: string;
  name: string;
  headcount: number;
  openPositions: number;
  members: Member[];
}

export interface Department {
  id: string;
  name: string;
  teams: Team[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: "engineering",
    name: "Engineering",
    teams: [
      {
        id: "platform",
        name: "Platform",
        headcount: 18,
        openPositions: 2,
        members: [
          { name: "Priya Nandan", role: "Staff Engineer", status: "active" },
          { name: "Wes Okafor", role: "Senior Engineer", status: "active" },
          { name: "Lina Park", role: "Engineer II", status: "active" },
          { name: "Theo Marsh", role: "Engineer II", status: "leave" },
          { name: "Suri Bhatt", role: "Engineer I", status: "active" },
        ],
      },
      {
        id: "mobile",
        name: "Mobile",
        headcount: 11,
        openPositions: 1,
        members: [
          { name: "Devon Cruz", role: "Senior Engineer", status: "active" },
          { name: "Amara Solis", role: "Engineer II", status: "active" },
          { name: "Kit Fenwick", role: "Engineer I", status: "active" },
        ],
      },
      {
        id: "data",
        name: "Data",
        headcount: 9,
        openPositions: 0,
        members: [
          { name: "Noor Kessler", role: "Data Engineer", status: "active" },
          { name: "Ravi Deol", role: "Analytics Engineer", status: "active" },
        ],
      },
      {
        id: "security",
        name: "Security",
        headcount: 6,
        openPositions: 1,
        members: [
          { name: "Elin Bakr", role: "Security Engineer", status: "active" },
          { name: "Marcus Ide", role: "Security Engineer", status: "leave" },
        ],
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    teams: [
      {
        id: "enterprise",
        name: "Enterprise",
        headcount: 14,
        openPositions: 3,
        members: [
          { name: "Odessa Vance", role: "Account Executive", status: "active" },
          { name: "Guy Lindqvist", role: "Account Executive", status: "active" },
          { name: "Faye Umeh", role: "Solutions Engineer", status: "active" },
        ],
      },
      {
        id: "mid-market",
        name: "Mid-Market",
        headcount: 10,
        openPositions: 1,
        members: [
          { name: "Nate Osei", role: "Account Executive", status: "active" },
          { name: "Bea Halvorsen", role: "Account Executive", status: "leave" },
        ],
      },
      {
        id: "sdr",
        name: "SDR",
        headcount: 12,
        openPositions: 2,
        members: [
          { name: "Jonah Reyes", role: "SDR", status: "active" },
          { name: "Mira Achebe", role: "SDR", status: "active" },
        ],
      },
    ],
  },
  {
    id: "support",
    name: "Support",
    teams: [
      {
        id: "tier-1",
        name: "Tier 1",
        headcount: 16,
        openPositions: 2,
        members: [
          { name: "Camron Diaz", role: "Support Associate", status: "active" },
          { name: "Sana Okon", role: "Support Associate", status: "active" },
        ],
      },
      {
        id: "tier-2",
        name: "Tier 2",
        headcount: 8,
        openPositions: 0,
        members: [
          { name: "Idris Falk", role: "Support Engineer", status: "active" },
          { name: "Tova Ren", role: "Support Engineer", status: "active" },
        ],
      },
    ],
  },
  {
    id: "product",
    name: "Product",
    teams: [
      {
        id: "design",
        name: "Design",
        headcount: 7,
        openPositions: 1,
        members: [
          { name: "Yuki Hartmann", role: "Product Designer", status: "active" },
          { name: "Cass Odonnell", role: "Product Designer", status: "active" },
        ],
      },
      {
        id: "pm",
        name: "PM",
        headcount: 5,
        openPositions: 0,
        members: [
          { name: "Ronan Achterberg", role: "Product Manager", status: "active" },
          { name: "Wren Delacroix", role: "Product Manager", status: "active" },
        ],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    teams: [
      {
        id: "accounting",
        name: "Accounting",
        headcount: 6,
        openPositions: 0,
        members: [
          { name: "Isla Hagen", role: "Accountant", status: "active" },
          { name: "Percy Nwosu", role: "Accountant", status: "leave" },
        ],
      },
      {
        id: "fpa",
        name: "FP&A",
        headcount: 4,
        openPositions: 1,
        members: [
          { name: "Dara Lindholm", role: "FP&A Analyst", status: "active" },
        ],
      },
    ],
  },
];

export type Metric = "headcount" | "open";

export function metricValue(team: Team, metric: Metric): number {
  return metric === "headcount" ? team.headcount : team.openPositions;
}

export function departmentTotal(dept: Department, metric: Metric): number {
  return dept.teams.reduce((sum, t) => sum + metricValue(t, metric), 0);
}

export function grandTotal(metric: Metric): number {
  return DEPARTMENTS.reduce((sum, d) => sum + departmentTotal(d, metric), 0);
}

export function findTeam(deptId: string, teamId: string): { dept: Department; team: Team } | null {
  const dept = DEPARTMENTS.find((d) => d.id === deptId);
  const team = dept?.teams.find((t) => t.id === teamId);
  if (!dept || !team) return null;
  return { dept, team };
}
