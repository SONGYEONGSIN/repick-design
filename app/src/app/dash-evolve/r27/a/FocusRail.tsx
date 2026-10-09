"use client";

import { PinOff, Target } from "lucide-react";
import Image from "next/image";
import { KEY_RESULTS, OBJECTIVES, TEAM_LABEL, achievementPct, bandFor, deltaSince, formatKrValue, objectiveFor } from "./data";
import { BORDER, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, FOCUS, cx } from "./tokens";
import { Badge, Card, CardHead, Progress } from "./ui";

// This rail holds the SINGLE recompute target for the bullet grid's pin: pinning a row above changes
// only the "Pinned key result" card below, and that card always reads the KR's *latest* checkpoint —
// it ignores the grid's own "Latest / Quarter start" segmented toggle entirely, on purpose, so the
// two controls never fight over what "the value" means. The objective rollup underneath is a second,
// fully separate surface: it re-derives its progress bars from every KR's latest value on every
// render regardless of what is pinned, and says so in its own subtext.
export default function FocusRail({ pinnedId, onClearPin }: { pinnedId: string | null; onClearPin: () => void }) {
  const pinned = pinnedId ? KEY_RESULTS.find((kr) => kr.id === pinnedId) ?? null : null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHead title="Pinned key result" hint="Pin a row in the grid to keep its full detail here — nothing else on the page reacts to the pin." Icon={Target} />
        {pinned ? (
          (() => {
            const tone = bandFor(pinned, pinned.latest);
            const delta = deltaSince(pinned);
            const objective = objectiveFor(pinned);
            return (
              <div className="mt-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{pinned.name}</p>
                    <p className={cx("mt-0.5 truncate text-[11px] font-normal", TEXT_AUX)}>{`${objective.code} · ${TEAM_LABEL[objective.team]}`}</p>
                  </div>
                  <button type="button" onClick={onClearPin} className={cx("flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium", BORDER, "bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]", TRANSITION, FOCUS)}>
                    <PinOff size={12} aria-hidden="true" />
                    Unpin
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Image
                    src={`https://images.unsplash.com/photo-${pinned.owner.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                    alt=""
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] shrink-0 rounded-full bg-white/10 object-cover"
                  />
                  <span className={cx("text-xs font-medium", TEXT_MUTED)}>{pinned.owner.name}</span>
                  <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{pinned.owner.role}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className={cx("rounded-lg border p-2.5", BORDER, "bg-white/[0.03]")}>
                    <p className={cx("text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Latest</p>
                    <p className={cx("mt-0.5 text-lg font-semibold leading-none tabular-nums", TEXT_PRIMARY)}>{formatKrValue(pinned, pinned.latest)}</p>
                  </div>
                  <div className={cx("rounded-lg border p-2.5", BORDER, "bg-white/[0.03]")}>
                    <p className={cx("text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Target</p>
                    <p className={cx("mt-0.5 text-lg font-semibold leading-none tabular-nums", TEXT_PRIMARY)}>{formatKrValue(pinned, pinned.target)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <Badge className={STATUS_BADGE[tone]}>{STATUS_LABEL[tone]}</Badge>
                  <span className={cx("text-[11px] font-medium", delta.improved ? "text-teal-300" : "text-rose-300")}>{delta.text}</span>
                </div>

                <p className={cx("mt-3 border-t pt-3 text-[11px] font-normal leading-relaxed", BORDER, TEXT_AUX)}>{pinned.note}</p>
              </div>
            );
          })()
        ) : (
          <div className={cx("mt-3 rounded-xl border border-dashed p-4 text-center", BORDER)}>
            <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>Pin any key result in the grid to see its full check-in history here.</p>
          </div>
        )}
      </Card>

      <Card>
        <CardHead title="Objectives rollup" hint="Company-wide, always the latest checkpoint — unaffected by the grid's period toggle and the pin above." />
        <ul className="mt-3 flex flex-col gap-3">
          {OBJECTIVES.map((o) => {
            const krs = KEY_RESULTS.filter((kr) => kr.objectiveId === o.id);
            const pct = Math.round(krs.reduce((sum, kr) => sum + achievementPct(kr), 0) / krs.length);
            return (
              <li key={o.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className={cx("flex min-w-0 items-center gap-1.5 truncate text-xs font-medium", TEXT_PRIMARY)}>
                    <o.Icon size={13} aria-hidden="true" className={TEXT_AUX} />
                    {o.name}
                  </span>
                  <span className={cx("shrink-0 text-xs font-semibold tabular-nums", TEXT_PRIMARY)}>{pct}%</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={pct} label={`${o.name} average achievement`} toneClass={pct >= 90 ? "bg-teal-400" : pct >= 70 ? "bg-amber-400" : "bg-rose-400"} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
