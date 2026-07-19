import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  ClipboardList,
  Gauge,
  LayoutGrid,
  Network,
  Settings,
  TreePine,
  UserPlus2,
  Users,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 결정론 수학 — Math.random / Date.now / new Date 미사용                     */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 문자열 → 안정적 정수 시드 (Math.random 없이 결정론 재현). */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}
/** 시드 기반 결정론 pseudo-random [0,1) — 완전 재현 가능(하이드레이션 안전). */
function hash01(n: number): number {
  let t = (n + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  t = (t ^ (t >>> 14)) >>> 0;
  return t / 4294967296;
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자                                             */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Canopy", tagline: "Org & Capacity Intelligence" };
export { TreePine as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "solace", name: "Solace Systems", plan: "Scale · 143 headcount" },
  { id: "anchorpoint", name: "Anchorpoint Health", plan: "Growth · 96 headcount" },
  { id: "sandbox", name: "People Ops Sandbox", plan: "내부 테스트" },
];

/** 가상 인물(세션 컨텍스트 아님) — Canopy를 쓰는 People Analytics 리드. */
export const CURRENT_USER = {
  name: "Whitney Solano",
  role: "Head of People Analytics",
  email: "whitney.solano@solacesystems.io",
  avatarId: "1573496359142-b8d87734a5a2",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* 내비게이션                                                                */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "워크스페이스",
    items: [
      { id: "overview", label: "개요", Icon: LayoutGrid },
      { id: "org", label: "조직도 & 캐파시티", Icon: Network, active: true },
      { id: "teams", label: "팀 디렉토리", Icon: Users },
    ],
  },
  {
    id: "capacity",
    title: "캐파시티",
    items: [
      { id: "utilization", label: "가동률 추이", Icon: Gauge },
      { id: "reqs", label: "채용 요청", Icon: UserPlus2, badge: "13" },
      { id: "playbooks", label: "플레이북", Icon: ClipboardList },
    ],
  },
  {
    id: "admin",
    title: "관리",
    items: [
      { id: "billing", label: "청구", Icon: Banknote, disabled: true },
      { id: "settings", label: "설정", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 조직 상태 — 가동률 구간별 healthy / at-risk / overloaded                    */
/* ---------------------------------------------------------------------- */

export type StatusId = "healthy" | "at-risk" | "overloaded";

export const STATUS_META: Record<
  StatusId,
  { label: string; text: string; bg: string; border: string; dot: string; bar: string; stroke: string; fill: string }
> = {
  healthy: {
    label: "Healthy",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
    fill: "fill-emerald-600 dark:fill-emerald-400",
  },
  "at-risk": {
    label: "At Risk",
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    stroke: "stroke-amber-600 dark:stroke-amber-400",
    fill: "fill-amber-600 dark:fill-amber-400",
  },
  overloaded: {
    label: "Overloaded",
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    stroke: "stroke-rose-600 dark:stroke-rose-400",
    fill: "fill-rose-600 dark:fill-rose-400",
  },
};

export function statusFor(utilization: number): StatusId {
  if (utilization >= 105) return "overloaded";
  if (utilization >= 91) return "at-risk";
  return "healthy";
}

/* ---------------------------------------------------------------------- */
/* 조직 트리 원본 — 리프 노드만 headcount/utilization/openReqs를 갖고,          */
/* 상위 노드는 전부 하위 합산·가중평균으로 계산한다(부분합=총합 보장).             */
/* Solace Systems는 4개 부문 아래 엔지니어링·GTM만 팀으로 더 쪼개지는            */
/* 비대칭 트리 — 스타트업 규모의 현실적인 보고 구조.                            */
/* ---------------------------------------------------------------------- */

export type OrgKind = "company" | "division" | "team";

export type RawOrgNode = {
  id: string;
  name: string;
  kind: OrgKind;
  leadName: string;
  leadTitle: string;
  avatarId: string;
  headcount?: number;
  utilization?: number;
  openReqs?: number;
  children?: RawOrgNode[];
};

const RAW_TREE: RawOrgNode = {
  id: "company",
  name: "Solace Systems",
  kind: "company",
  leadName: "Maren Ito",
  leadTitle: "Chief Executive Officer",
  avatarId: "1633332755192-727a05c4013d",
  children: [
    {
      id: "engineering",
      name: "Engineering",
      kind: "division",
      leadName: "Devon Okafor",
      leadTitle: "VP Engineering",
      avatarId: "1500648767791-00dcc994a43e",
      children: [
        {
          id: "platform-eng",
          name: "Platform Engineering",
          kind: "team",
          leadName: "Priya Chandran",
          leadTitle: "Director, Platform",
          avatarId: "1524504388940-b1c1722653e1",
          headcount: 26,
          utilization: 94,
          openReqs: 3,
        },
        {
          id: "product-eng",
          name: "Product Engineering",
          kind: "team",
          leadName: "Felix Duarte",
          leadTitle: "Director, Product Eng",
          avatarId: "1531123897727-8f129e1688ce",
          headcount: 24,
          utilization: 89,
          openReqs: 2,
        },
      ],
    },
    {
      id: "product-design",
      name: "Product & Design",
      kind: "division",
      leadName: "Sana Okoye",
      leadTitle: "VP Product & Design",
      avatarId: "1544723795-3fb6469f5b39",
      headcount: 21,
      utilization: 81,
      openReqs: 1,
    },
    {
      id: "gtm",
      name: "Go-to-Market",
      kind: "division",
      leadName: "Renata Silva",
      leadTitle: "VP Go-to-Market",
      avatarId: "1500917293891-ef795e70e1f6",
      children: [
        {
          id: "sales",
          name: "Sales",
          kind: "team",
          leadName: "Jonah Pratt",
          leadTitle: "Director, Sales",
          avatarId: "1438761681033-6461ffad8d80",
          headcount: 30,
          utilization: 103,
          openReqs: 4,
        },
        {
          id: "customer-success",
          name: "Customer Success",
          kind: "team",
          leadName: "Malik Osei",
          leadTitle: "Director, Customer Success",
          avatarId: "1502685104226-ee32379fefbe",
          headcount: 19,
          utilization: 96,
          openReqs: 2,
        },
      ],
    },
    {
      id: "ops-people",
      name: "Operations & People",
      kind: "division",
      leadName: "Greta Lindholm",
      leadTitle: "VP Operations & People",
      avatarId: "1580489944761-15a19d654956",
      headcount: 23,
      utilization: 68,
      openReqs: 1,
    },
  ],
};

/* ---------------------------------------------------------------------- */
/* 집계 — 리프의 headcount/utilization/openReqs로부터 상위 노드를 산출한다.       */
/* headcount = 자식 합, utilization = headcount 가중평균(반올림), openReqs=합.   */
/* ---------------------------------------------------------------------- */

export type OrgNode = {
  id: string;
  name: string;
  kind: OrgKind;
  level: number;
  parentId: string | null;
  childIds: string[];
  siblingIds: string[];
  leadName: string;
  leadTitle: string;
  avatarId: string;
  headcount: number;
  utilization: number;
  openReqs: number;
  status: StatusId;
  isLeaf: boolean;
  x: number;
  y: number;
};

const NODE_MAP_MUT: Record<string, OrgNode> = {};
let maxLevel = 0;

function aggregate(raw: RawOrgNode, level: number, parentId: string | null): OrgNode {
  maxLevel = Math.max(maxLevel, level);
  const childIds: string[] = [];
  let headcount = raw.headcount ?? 0;
  let weightedUtil = (raw.utilization ?? 0) * (raw.headcount ?? 0);
  let openReqs = raw.openReqs ?? 0;

  if (raw.children && raw.children.length > 0) {
    headcount = 0;
    weightedUtil = 0;
    openReqs = 0;
    for (const child of raw.children) {
      const built = aggregate(child, level + 1, raw.id);
      childIds.push(built.id);
      headcount += built.headcount;
      weightedUtil += built.utilization * built.headcount;
      openReqs += built.openReqs;
    }
  }

  const utilization = headcount > 0 ? Math.round(weightedUtil / headcount) : 0;
  const node: OrgNode = {
    id: raw.id,
    name: raw.name,
    kind: raw.kind,
    level,
    parentId,
    childIds,
    siblingIds: [],
    leadName: raw.leadName,
    leadTitle: raw.leadTitle,
    avatarId: raw.avatarId,
    headcount,
    utilization,
    openReqs,
    status: statusFor(utilization),
    isLeaf: childIds.length === 0,
    x: 0,
    y: 0,
  };
  NODE_MAP_MUT[node.id] = node;
  return node;
}

aggregate(RAW_TREE, 0, null);

// 형제 배열 채우기 (부모의 childIds를 그대로 공유 참조)
for (const node of Object.values(NODE_MAP_MUT)) {
  node.siblingIds = node.parentId ? NODE_MAP_MUT[node.parentId].childIds : [node.id];
}

/* ------------------------------------------------------------- 레이아웃 */
/* 리프를 좌→우 순서로 나열해 x를 배정하고, 내부 노드는 자식 x의 평균을 취한다.    */
/* 좌표는 전부 소수 2자리로 반올림한다. 이 좌표는 "설계 폭"(authoring 기준)이며,   */
/* 렌더링 시 컨테이너 폭에 맞춰 SVG viewBox + 퍼센트 위치로 균일 스케일된다        */
/* (DagCanvas 선례와 동일 원리) — 데스크톱 폭에서 가로 스크롤이 발생하지 않는다.    */

export const NODE_W = 116;
export const NODE_H = 100;
const COL_W = 138;
const ROW_H = 134;
const MARGIN_X = 22;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 18;

let leafCursor = 0;
function layout(node: OrgNode): number {
  if (node.isLeaf) {
    const x = round2(MARGIN_X + leafCursor * COL_W + COL_W / 2);
    leafCursor += 1;
    node.x = x;
  } else {
    const xs = node.childIds.map((cid) => layout(NODE_MAP_MUT[cid]));
    node.x = round2(xs.reduce((a, b) => a + b, 0) / xs.length);
  }
  node.y = round2(MARGIN_TOP + node.level * ROW_H + NODE_H / 2);
  return node.x;
}
layout(NODE_MAP_MUT[RAW_TREE.id]);

export const LEAF_COUNT = leafCursor;
export const LEVEL_COUNT = maxLevel + 1;
export const CANVAS_W = round2(MARGIN_X * 2 + LEAF_COUNT * COL_W);
export const CANVAS_H = round2(MARGIN_TOP + maxLevel * ROW_H + NODE_H + MARGIN_BOTTOM);

export const ROOT_ID = RAW_TREE.id;
export const NODE_MAP: Record<string, OrgNode> = NODE_MAP_MUT;
export const NODES: OrgNode[] = Object.values(NODE_MAP_MUT).sort((a, b) => a.level - b.level || a.x - b.x);

export type Connector = { id: string; parentId: string; childId: string; path: string };

export const CONNECTORS: Connector[] = NODES.filter((n) => n.parentId).map((n) => {
  const parent = NODE_MAP[n.parentId!];
  const x1 = round2(parent.x);
  const y1 = round2(parent.y + NODE_H / 2);
  const x2 = round2(n.x);
  const y2 = round2(n.y - NODE_H / 2);
  const my = round2((y1 + y2) / 2);
  return {
    id: `${parent.id}->${n.id}`,
    parentId: parent.id,
    childId: n.id,
    path: `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`,
  };
});

/** 레벨별 최대 headcount — "헤드카운트" 뷰 모드의 색 스케일 정규화 기준. */
export const LEVEL_MAX_HEADCOUNT: Record<number, number> = NODES.reduce(
  (acc, n) => {
    acc[n.level] = Math.max(acc[n.level] ?? 0, n.headcount);
    return acc;
  },
  {} as Record<number, number>,
);

export function ancestorsOf(id: string): OrgNode[] {
  const chain: OrgNode[] = [];
  let cur = NODE_MAP[id]?.parentId;
  while (cur) {
    chain.unshift(NODE_MAP[cur]);
    cur = NODE_MAP[cur].parentId;
  }
  return chain;
}

/** 결정론 6구간 가동률 추이(현재값으로 종료) — id 해시 기반, Math.random 미사용. */
export function utilizationTrend(node: OrgNode): number[] {
  const seed = hashString(node.id);
  const out: number[] = [];
  for (let i = 0; i < 5; i++) {
    const jitter = Math.round((hash01(seed + i * 17) - 0.5) * 22);
    out.push(clamp(node.utilization - jitter - (4 - i), 45, 135));
  }
  out.push(node.utilization);
  return out;
}

/* ---------------------------------------------------------------------- */
/* 포맷터 — Intl 고정                                                       */
/* ---------------------------------------------------------------------- */

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}
export function formatPercent(n: number): string {
  return `${countFmt.format(n)}%`;
}
