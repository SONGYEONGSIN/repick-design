import type { ServiceCount } from "./data";
import { Card, Label } from "./ui";

export function ServiceBreakdownChart({ data }: { data: ServiceCount[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <Card className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Incidents by service</h2>
        <Label>Count</Label>
      </div>
      <ul className="flex flex-col gap-2.5">
        {data.map((row) => {
          const pct = (row.count / max) * 100;
          return (
            <li key={row.service} className="flex min-w-0 items-center gap-3">
              <span className="w-20 shrink-0 truncate text-sm text-zinc-700 sm:w-32">{row.service}</span>
              <span className="relative h-2 min-w-0 flex-1 rounded-full bg-zinc-100" aria-hidden="true">
                <span className="absolute inset-y-0 left-0 rounded-full bg-orange-600" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-6 shrink-0 text-right text-sm font-medium tabular-nums text-zinc-900">{row.count}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
