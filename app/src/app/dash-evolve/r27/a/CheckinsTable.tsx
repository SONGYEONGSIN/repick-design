"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Unlink } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CHECKINS, KEY_RESULTS, TEAM_LABEL, type Team, bandFor, deltaSince, formatDate, objectiveFor } from "./data";
import { BORDER, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx, type BandTone } from "./tokens";
import { Badge, Card, CardHead, Tabs } from "./ui";

type TeamFilter = "all" | Team;
type SortKey = "date" | "confidence" | "delta";

const CONFIDENCE_RANK: Record<BandTone, number> = { poor: 0, satisfactory: 1, good: 2 };

const ROWS = CHECKINS.map((c) => {
  const kr = KEY_RESULTS.find((k) => k.id === c.krId)!;
  const objective = objectiveFor(kr);
  const tone = bandFor(kr, kr.latest);
  const delta = deltaSince(kr);
  return { ...c, kr, objective, tone, delta };
});

function SortHeader({ label, sortKeyId, sortKey, asc, onToggle, className }: { label: string; sortKeyId: SortKey; sortKey: SortKey; asc: boolean; onToggle: (key: SortKey) => void; className?: string }) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 text-left align-middle", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cx(
          "inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
          TRANSITION,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
          active ? "text-zinc-50" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

// This table intentionally never reads `pinnedId` from WaymarkClient — pinning a row in the bullet
// grid above recomputes only the focus rail's "Pinned key result" card, and this log stays exactly
// what its own filter tabs and sort say it is. The badge below is the visible proof of that boundary.
export default function CheckinsTable() {
  const [team, setTeam] = useState<TeamFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const filtered = team === "all" ? ROWS : ROWS.filter((r) => r.objective.team === team);
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === "date") {
        av = a.date;
        bv = b.date;
      } else if (sortKey === "confidence") {
        av = CONFIDENCE_RANK[a.tone];
        bv = CONFIDENCE_RANK[b.tone];
      } else {
        av = Math.abs(a.delta.diff);
        bv = Math.abs(b.delta.diff);
      }
      if (av < bv) return asc ? -1 : 1;
      if (av > bv) return asc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [team, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  return (
    <Card>
      <CardHead
        title="Recent check-ins"
        hint="Every confidence update logged this cycle."
        action={
          <Badge Icon={Unlink}>
            <span className="hidden sm:inline">Network-wide — not filtered by the pin above</span>
            <span className="sm:hidden">Unfiltered by pin</span>
          </Badge>
        }
      />

      <div className="mt-3">
        <Tabs<TeamFilter>
          ariaLabel="Filter check-ins by team"
          value={team}
          onChange={setTeam}
          options={[
            { id: "all", label: `All teams (${ROWS.length})` },
            { id: "platform", label: TEAM_LABEL.platform },
            { id: "growth", label: TEAM_LABEL.growth },
            { id: "cs", label: TEAM_LABEL.cs },
          ]}
        />
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Recent OKR check-ins, sortable by date, confidence and change since quarter start</caption>
          <colgroup>
            <col className="w-[38%]" />
            <col className="hidden w-[20%] sm:table-column" />
            <col className="w-[16%]" />
            <col className="hidden w-[14%] sm:table-column" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Key result
              </th>
              <th scope="col" className={cx("hidden py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] sm:table-cell", TEXT_AUX)}>
                Owner
              </th>
              <SortHeader label="Confidence" sortKeyId="confidence" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Δ vs prior" sortKeyId="delta" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="hidden sm:table-cell" />
              <SortHeader label="Date" sortKeyId="date" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.03]">
                <td className="py-2.5 pr-2 align-middle">
                  <p className={cx("line-clamp-2 text-[13px] font-medium leading-snug", TEXT_PRIMARY)}>{r.kr.name}</p>
                  <p className={cx("truncate font-mono text-[11px] font-normal", TEXT_AUX)}>{`${r.kr.code} · ${r.objective.code}`}</p>
                </td>
                <td className="hidden py-2.5 pr-2 align-middle sm:table-cell">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Image
                      src={`https://images.unsplash.com/photo-${r.kr.owner.avatarId}?w=40&h=40&fit=crop&crop=faces`}
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] shrink-0 rounded-full bg-white/10 object-cover"
                    />
                    <span className={cx("truncate text-[13px] font-normal", TEXT_MUTED)}>{r.kr.owner.name}</span>
                  </span>
                </td>
                <td className="py-2.5 pr-2 align-middle">
                  <Badge className={STATUS_BADGE[r.tone]}>{STATUS_LABEL[r.tone]}</Badge>
                </td>
                <td className={cx("hidden whitespace-nowrap py-2.5 pr-2 align-middle text-[13px] font-normal tabular-nums sm:table-cell", r.delta.improved ? "text-teal-300" : "text-rose-300")}>
                  {r.delta.text.replace(" vs quarter start", "")}
                </td>
                <td className={cx("whitespace-nowrap py-2.5 align-middle text-[13px] font-normal tabular-nums", TEXT_MUTED)}>{formatDate(r.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
