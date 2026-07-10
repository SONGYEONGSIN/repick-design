import { CheckCircle2, TriangleAlert, OctagonAlert } from "lucide-react";
import { zones, trays, type ZoneStatus } from "./data";

const STATUS_META: Record<ZoneStatus, { icon: typeof CheckCircle2; label: string; className: string }> = {
  optimal: { icon: CheckCircle2, label: "정상", className: "text-[var(--lin-sage-deep)]" },
  watch: { icon: TriangleAlert, label: "주의", className: "text-[var(--lin-sepia)]" },
  alert: { icon: OctagonAlert, label: "경고", className: "text-[var(--lin-brick)]" },
};

export default function ZonesAndTrays() {
  return (
    <div className="flex flex-col gap-10">
      <div className="lin-scroll-x overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="mb-3 text-left text-xs uppercase tracking-[0.15em] text-[var(--lin-ink-muted)]">
            온실 4개 구역 현황
          </caption>
          <thead>
            <tr className="border-b border-[var(--lin-border-strong)] text-xs uppercase tracking-wide text-[var(--lin-ink-muted)]">
              <th scope="col" className="py-2 pr-4 font-medium">
                구역
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                개체 수
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                기온 / 습도
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                상태
              </th>
              <th scope="col" className="py-2 font-medium">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => {
              const meta = STATUS_META[z.status];
              const Icon = meta.icon;
              return (
                <tr key={z.id} className="border-b border-[var(--lin-border)] align-top">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    <span className="plate-serif italic text-[var(--lin-ink)]">{z.name}</span>
                    <span className="block text-xs text-[var(--lin-ink-muted)]">{z.focus}</span>
                  </th>
                  <td className="py-3 pr-4 text-[var(--lin-ink)]">{z.count}주</td>
                  <td className="py-3 pr-4 text-[var(--lin-ink)]">
                    {z.temp} / {z.humidity}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1.5 ${meta.className}`}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--lin-ink-muted)]">{z.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-[var(--lin-ink)]">
          육묘 트레이 발아율
          <span className="plate-serif ml-2 text-xs italic text-[var(--lin-ink-muted)]">Propagation Trays</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {trays.map((t) => (
            <div key={t.id} className="lin-card p-4">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-[var(--lin-ink)]">{t.label}</p>
                <p className="plate-serif text-sm italic text-[var(--lin-ink)]">{t.rate}%</p>
              </div>
              <p className="mb-2 text-xs text-[var(--lin-ink-muted)]">
                {t.cross} · {t.sown}
              </p>
              <progress
                className="lin-progress"
                value={t.rate}
                max={100}
                aria-label={`${t.label} 발아율 ${t.rate}퍼센트`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
