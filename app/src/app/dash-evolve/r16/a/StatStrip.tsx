import type { Finding } from "./data";
import { dayDiff, daysOpen, slaStatus } from "./format";

/**
 * Slim, single-row inline stat strip — deliberately not a 4-card KPI hero. Every number is
 * derived here from the live `findings` array (not hardcoded), so it always reconciles with what
 * the board below is showing.
 */
export function StatStrip({ findings, todayISO }: { findings: Finding[]; todayISO: string }) {
  const open = findings.filter((f) => f.stage !== "resolved");
  const criticalOpen = open.filter((f) => f.severity === "critical").length;
  const breached = open.filter((f) => slaStatus(f, todayISO) === "breached").length;
  const avgAge = open.length === 0 ? 0 : Math.round(open.reduce((acc, f) => acc + daysOpen(f, todayISO), 0) / open.length);
  const resolved30d = findings.filter((f) => f.resolvedISO && dayDiff(f.resolvedISO, todayISO) <= 30).length;

  const stats: { label: string; value: string; tone?: string }[] = [
    { label: "Open findings", value: String(open.length) },
    { label: "Critical open", value: String(criticalOpen), tone: criticalOpen > 0 ? "text-rose-700" : undefined },
    { label: "SLA breaches", value: String(breached), tone: breached > 0 ? "text-rose-700" : undefined },
    { label: "Avg. age (open)", value: `${avgAge}d` },
    { label: "Resolved (30d)", value: String(resolved30d), tone: "text-emerald-700" },
  ];

  return (
    <section aria-labelledby="stat-strip-heading" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-5">
      <h2 id="stat-strip-heading" className="sr-only">
        Queue summary
      </h2>
      <dl className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {stats.map((s, i) => (
          <div key={s.label} className={`min-w-0 ${i > 0 ? "border-zinc-200 sm:border-l sm:pl-6" : ""}`}>
            <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">{s.label}</dt>
            <dd className={`mt-0.5 text-lg font-semibold tracking-tight tabular-nums ${s.tone ?? "text-zinc-900"}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
