import { Check, X, CircleDashed } from "lucide-react";
import type { ChecklistState, Milestone } from "../data";
import { StatusChip, toneForChecklist, toneForMilestone } from "./StatusChip";
import styles from "../console.module.css";

const CHECKLIST_ICON: Record<ChecklistState, typeof Check> = {
  done: Check,
  failed: X,
  pending: CircleDashed,
};

const CHECKLIST_LABEL: Record<ChecklistState, string> = {
  done: "Done",
  failed: "Failed",
  pending: "Pending",
};

const STATUS_LABEL: Record<Milestone["status"], string> = {
  complete: "Complete",
  holding: "Holding",
  pending: "Pending",
};

export function MilestoneDetail({ milestone }: { milestone: Milestone }) {
  const t = milestone.telemetry;
  return (
    <section aria-labelledby="milestone-detail-heading" id="milestone-detail" className="min-w-0 scroll-mt-20 lg:col-span-5">
      <h2 id="milestone-detail-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
        04 — Milestone Detail
      </h2>

      <div className={`${styles.panel} h-full p-4 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: "var(--hf-border)" }}>
          <div>
            <p className="font-mono text-xl font-bold tabular-nums" style={{ color: "var(--hf-text)" }}>
              {milestone.tMinus}
            </p>
            <p className="text-sm" style={{ color: "var(--hf-text-2)" }}>
              {milestone.title}
            </p>
          </div>
          <StatusChip tone={toneForMilestone(milestone.status)} label={STATUS_LABEL[milestone.status]} />
        </div>

        <p aria-live="polite" className="sr-only">
          Selected milestone: {milestone.tMinus}, {milestone.title}, status {STATUS_LABEL[milestone.status]}.
        </p>

        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--hf-text-2)" }}>
          {t.note}
        </p>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text-3)" }}>
          Checklist
        </h3>
        <ul className="mt-2 flex flex-col gap-2">
          {milestone.checklist.map((item) => {
            const Icon = CHECKLIST_ICON[item.state];
            const tone = toneForChecklist(item.state);
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2" style={{ borderColor: "var(--hf-border)" }}>
                <span className="flex min-w-0 items-center gap-2 text-sm" style={{ color: "var(--hf-text)" }}>
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: tone === "go" ? "var(--hf-go)" : tone === "nogo" ? "var(--hf-nogo)" : "var(--hf-text-3)" }} />
                  <span className="truncate">{item.label}</span>
                </span>
                <StatusChip tone={tone} label={CHECKLIST_LABEL[item.state]} className="shrink-0" />
              </li>
            );
          })}
        </ul>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text-3)" }}>
          Telemetry Snapshot at {milestone.tMinus}
        </h3>
        <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Booster LOX", value: `${t.boosterLoxPct}%` },
            { label: "Booster CH4", value: `${t.boosterCh4Pct}%` },
            { label: "Ship LOX", value: `${t.shipLoxPct}%` },
            { label: "Ship CH4", value: `${t.shipCh4Pct}%` },
          ].map((d) => (
            <div key={d.label} className={`${styles.panelRaised} min-w-0 p-3`}>
              <dt className="truncate text-[11px] uppercase tracking-[0.06em]" style={{ color: "var(--hf-text-3)" }}>
                {d.label}
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold tabular-nums" style={{ color: "var(--hf-text)" }}>
                {d.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-mono text-xs tabular-nums" style={{ color: "var(--hf-text-2)" }}>
          Ground wind {t.groundWindKt} kt · Upper-level shear margin{" "}
          <span style={{ color: t.shearMarginKt < 0 ? "var(--hf-nogo)" : "var(--hf-go)" }}>
            {t.shearMarginKt > 0 ? "+" : ""}
            {t.shearMarginKt.toFixed(1)} kt
          </span>
        </p>
      </div>
    </section>
  );
}
