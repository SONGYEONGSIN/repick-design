"use client";

import { DEPARTMENTS, departmentTotal, grandTotal, metricValue, type Metric } from "./data";

interface Props {
  metric: Metric;
  pinnedDept: string;
  pinnedTeam: string;
  hoveredKey: string | null;
  onSelectTeam: (deptId: string, teamId: string) => void;
  onHoverChange: (key: string | null) => void;
}

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R0 = 58; // center hole
const R1 = 128; // department ring outer
const R2 = 128; // team ring inner
const R3 = 196; // team ring outer

const DEPT_SHADE = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: round2(CX + r * Math.cos(rad)), y: round2(CY + r * Math.sin(rad)) };
}

function arcPath(rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const outerStart = polar(rOuter, startDeg);
  const outerEnd = polar(rOuter, endDeg);
  const innerEnd = polar(rInner, endDeg);
  const innerStart = polar(rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

type DeptArc = { dept: (typeof DEPARTMENTS)[number]; start: number; end: number; color: string };
type TeamArc = { dept: (typeof DEPARTMENTS)[number]; team: (typeof DEPARTMENTS)[number]["teams"][number]; start: number; end: number; color: string };

/** Lays departments end-to-end around the circle via a pure fold — no shared cursor mutated during render. */
function layoutDepartments(metric: Metric, total: number): DeptArc[] {
  return DEPARTMENTS.reduce<DeptArc[]>((acc, dept, i) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const value = departmentTotal(dept, metric);
    const end = round2(start + (value / total) * 360);
    return [...acc, { dept, start, end, color: DEPT_SHADE[i % DEPT_SHADE.length] }];
  }, []);
}

/** Subdivides each department's angular span across its teams — same pure-fold shape as layoutDepartments. */
function layoutTeams(metric: Metric, deptArcs: DeptArc[]): TeamArc[] {
  return deptArcs.flatMap(({ dept, start, end, color }) => {
    const span = end - start;
    const teamTotal = departmentTotal(dept, metric) || 1;
    return dept.teams.reduce<TeamArc[]>((acc, team) => {
      const tStart = acc.length ? acc[acc.length - 1].end : start;
      const value = metricValue(team, metric);
      const tEnd = round2(tStart + (value / teamTotal) * span);
      return [...acc, { dept, team, start: tStart, end: tEnd, color }];
    }, []);
  });
}

export default function Sunburst({ metric, pinnedDept, pinnedTeam, hoveredKey, onSelectTeam, onHoverChange }: Props) {
  const total = grandTotal(metric) || 1;
  const deptArcs = layoutDepartments(metric, total);
  const teamArcs = layoutTeams(metric, deptArcs);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[420px]"
      role="img"
      aria-label={`Headcount distribution across ${DEPARTMENTS.length} departments, shown as ${metric === "headcount" ? "headcount" : "open positions"}`}
    >
      {deptArcs.map(({ dept, start, end, color }) => {
        const isPinnedDept = dept.id === pinnedDept;
        const showLabel = end - start > 18;
        const mid = (start + end) / 2;
        const labelPos = polar((R0 + R1) / 2, mid);
        return (
          <g key={dept.id}>
            <path
              d={arcPath(R0, R1, start, end)}
              fill={color}
              fillOpacity={isPinnedDept ? 1 : 0.85}
              stroke="#09090b"
              strokeWidth={1.5}
              tabIndex={0}
              role="button"
              aria-pressed={isPinnedDept}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              onClick={() => onSelectTeam(dept.id, dept.teams[0].id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTeam(dept.id, dept.teams[0].id);
                }
              }}
              onMouseEnter={() => onHoverChange(dept.id)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(dept.id)}
              onBlur={() => onHoverChange(null)}
            >
              <title>{`${dept.name}, ${departmentTotal(dept, metric)} ${metric === "headcount" ? "people" : "open roles"}. Press to open.`}</title>
            </path>
            {showLabel && (
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill="#f4f4f5" className="pointer-events-none tabular-nums">
                {dept.name}
              </text>
            )}
          </g>
        );
      })}

      {teamArcs.map(({ dept, team, start, end, color }) => {
        const key = `${dept.id}:${team.id}`;
        const isPinned = dept.id === pinnedDept && team.id === pinnedTeam;
        const isHovered = hoveredKey === key;
        return (
          <path
            key={key}
            d={arcPath(R2, R3, start, end)}
            fill={color}
            fillOpacity={isPinned ? 0.95 : isHovered ? 0.75 : 0.4}
            stroke="#09090b"
            strokeWidth={1.5}
            tabIndex={0}
            role="button"
            aria-pressed={isPinned}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            onClick={() => onSelectTeam(dept.id, team.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTeam(dept.id, team.id);
              }
            }}
            onMouseEnter={() => onHoverChange(key)}
            onMouseLeave={() => onHoverChange(null)}
            onFocus={() => onHoverChange(key)}
            onBlur={() => onHoverChange(null)}
          >
            <title>{`${dept.name} · ${team.name}, ${metricValue(team, metric)} ${metric === "headcount" ? "people" : "open roles"}. Press to select.`}</title>
          </path>
        );
      })}

      <circle cx={CX} cy={CY} r={R0 - 4} fill="#18181b" stroke="#27272a" strokeWidth={1} />
      <text x={CX} y={CY - 6} textAnchor="middle" fontSize={20} fontWeight={600} fill="#f4f4f5" className="tabular-nums">
        {grandTotal(metric)}
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fontSize={10} fill="#a1a1aa">
        {metric === "headcount" ? "total people" : "open roles"}
      </text>
    </svg>
  );
}
