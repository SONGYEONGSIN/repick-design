import { AlertTriangle, MapPin, Users } from "lucide-react";
import { formatCurrency, formatVolume, STATUS_META, type Zone } from "./data";
import { Card, InitialsAvatar, Sparkline, StatusBadge, cx } from "./ui";

function StatTile({ label, value, caption, children }: { label: string; value: string; caption?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-[20px] font-semibold leading-none tabular-nums text-zinc-50">{value}</p>
        {children}
      </div>
      {caption ? <p className="mt-1 text-[11px] font-normal text-zinc-400">{caption}</p> : null}
    </div>
  );
}

export default function DetailPanel({ zone }: { zone: Zone }) {
  const trendDelta = Math.round((zone.trend[zone.trend.length - 1] - zone.trend[0]) * 10) / 10;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{zone.code}</p>
          <h2 className="mt-0.5 truncate text-[17px] font-semibold tracking-tight text-zinc-50">{zone.name}</h2>
        </div>
        <StatusBadge status={zone.status} label={STATUS_META[zone.status].label} />
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <InitialsAvatar initials={zone.initials} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-medium text-zinc-50">{zone.manager}</p>
          <p className="text-[11px] font-normal text-zinc-400">Regional manager</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-normal text-zinc-400">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {zone.depotCount} depots
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StatTile
          label="On-time rate"
          value={`${zone.onTimeRate.toFixed(1)}%`}
          caption={`${trendDelta >= 0 ? "+" : ""}${trendDelta.toFixed(1)} pts over 8 weeks`}
        >
          <span className={trendDelta >= 0 ? "text-[#8fcdc2]" : "text-rose-300"}>
            <Sparkline data={zone.trend} stroke="currentColor" width={56} height={20} />
          </span>
        </StatTile>
        <StatTile label="Weekly volume" value={formatVolume(zone.weeklyVolume)} caption="parcels / week" />
        <StatTile label="Revenue at risk" value={formatCurrency(zone.revenueAtRisk)} caption={`${zone.delayIncidents} open incidents`} />
      </div>

      <div className="mt-4 max-h-[560px] overflow-y-auto">
        <section aria-labelledby={`${zone.id}-depots-heading`}>
          <h3 id={`${zone.id}-depots-heading`} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-50">
            <Users className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            Depots in this zone
          </h3>
          <table className="mt-2 w-full table-fixed border-collapse">
            <caption className="sr-only">Depots in {zone.name}, with weekly volume and on-time rate.</caption>
            <colgroup>
              <col style={{ width: "46%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead>
              <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400">
                <th scope="col" className="px-2 pb-1.5 text-left font-medium">
                  Depot
                </th>
                <th scope="col" className="px-2 pb-1.5 text-right font-medium">
                  Volume
                </th>
                <th scope="col" className="px-2 pb-1.5 text-right font-medium">
                  On-time
                </th>
              </tr>
            </thead>
            <tbody>
              {zone.depots.map((depot) => (
                <tr key={depot.name} className="border-t border-white/5 hover:bg-white/5">
                  <td className="truncate px-2 py-1.5 text-[12px] font-normal text-zinc-50">{depot.name}</td>
                  <td className="px-2 py-1.5 text-right text-[12px] font-normal tabular-nums text-zinc-400">{formatVolume(depot.volume)}</td>
                  <td
                    className={cx(
                      "px-2 py-1.5 text-right text-[12px] font-medium tabular-nums",
                      depot.status === "on-track" ? "text-[#8fcdc2]" : depot.status === "watch" ? "text-amber-300" : "text-rose-300"
                    )}
                  >
                    {depot.onTimeRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby={`${zone.id}-incidents-heading`} className="mt-4">
          <h3 id={`${zone.id}-incidents-heading`} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-50">
            <AlertTriangle className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            Recent delay incidents
          </h3>
          <table className="mt-2 w-full table-fixed border-collapse">
            <caption className="sr-only">Recent delay incidents in {zone.name}.</caption>
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "38%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400">
                <th scope="col" className="px-2 pb-1.5 text-left font-medium">
                  Date
                </th>
                <th scope="col" className="px-2 pb-1.5 text-left font-medium">
                  Depot
                </th>
                <th scope="col" className="px-2 pb-1.5 text-left font-medium">
                  Cause
                </th>
                <th scope="col" className="px-2 pb-1.5 text-right font-medium">
                  Parcels
                </th>
              </tr>
            </thead>
            <tbody>
              {zone.incidents.map((incident) => (
                <tr key={incident.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-2 py-1.5 text-[12px] font-normal tabular-nums text-zinc-400">{incident.dateLabel}</td>
                  <td className="truncate px-2 py-1.5 text-[12px] font-normal text-zinc-50">{incident.depotName}</td>
                  <td className="truncate px-2 py-1.5 text-[12px] font-normal text-zinc-400">{incident.cause}</td>
                  <td className="px-2 py-1.5 text-right text-[12px] font-medium tabular-nums text-zinc-50">{incident.parcelsAffected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </Card>
  );
}
