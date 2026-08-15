import { CalendarClock, Timer } from "lucide-react";
import { getOwner, healthMeta, TODAY_ISO, type Deal } from "./data";
import { formatDday, formatKRWCompact } from "./format";
import { Avatar, Badge, HealthBadge, ProgressBar } from "./ui";

export function DealCard({ deal }: { deal: Deal }) {
  const owner = getOwner(deal.ownerId);
  const health = healthMeta[deal.health];
  const dday = formatDday(TODAY_ISO, deal.closeDate);
  const urgent =
    dday === "D-DAY" ||
    dday.startsWith("D+") ||
    (dday.startsWith("D-") && Number(dday.slice(2)) <= 5);

  return (
    <button
      type="button"
      className="group block w-full rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-zinc-900">{deal.company}</p>
            {deal.isNew ? (
              <span className="shrink-0 rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase">
                New
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{deal.title}</p>
        </div>
        <HealthBadge health={deal.health} />
      </div>

      <p className="mt-2.5 text-base font-semibold tracking-tight text-zinc-900 tabular-nums">
        {formatKRWCompact(deal.amount)}
      </p>

      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Win probability</span>
          <span className="font-medium text-zinc-700 tabular-nums">{deal.probability}%</span>
        </div>
        <ProgressBar
          value={deal.probability}
          label={`${deal.company} win probability ${deal.probability}%`}
          barClassName={health.barClass}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {deal.tags.map((tag) => (
          <Badge key={tag} className="border-zinc-200 bg-zinc-50 text-zinc-500">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar src={owner.avatarUrl} name={owner.name} size="xs" />
          <span className="truncate text-xs text-zinc-500">{owner.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 text-[11px] whitespace-nowrap tabular-nums">
          <span className="inline-flex items-center gap-1 text-zinc-500">
            <Timer className="h-3 w-3" aria-hidden="true" />
            {deal.daysInStage}d in stage
          </span>
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              urgent ? "text-rose-600" : "text-zinc-500"
            }`}
          >
            <CalendarClock className="h-3 w-3" aria-hidden="true" />
            {dday}
          </span>
        </div>
      </div>
    </button>
  );
}
