import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardHeader } from "./ui";
import { DEPLOYS, DEPLOY_TOTALS } from "./data";

const MAX_TOTAL = Math.max(...DEPLOYS.map((d) => d.success + d.failed));
const TRACK_HEIGHT = 96;

export function DeployFrequencyCard({ id }: { id?: string }) {
  return (
    <Card id={id} colSpan="col-span-1 md:col-span-1 lg:col-span-4" rowSpan="lg:row-span-1">
      <CardHeader title="Deploy frequency" description={`${DEPLOY_TOTALS.total} deploys this week`} />
      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <div className="flex flex-1 items-end justify-between gap-2" style={{ height: TRACK_HEIGHT }}>
          {DEPLOYS.map((d) => {
            const total = d.success + d.failed;
            const totalHeight = Math.max(4, Math.round((total / MAX_TOTAL) * TRACK_HEIGHT));
            const failedHeight = total === 0 ? 0 : Math.round((d.failed / total) * totalHeight);
            const successHeight = totalHeight - failedHeight;
            return (
              <div key={d.day} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="text-[10px] tabular-nums text-zinc-500">{total}</span>
                <div className="flex w-full max-w-6 flex-col justify-end overflow-hidden rounded-t-sm" style={{ height: TRACK_HEIGHT }}>
                  {failedHeight > 0 && <div className="w-full bg-red-500" style={{ height: failedHeight }} />}
                  <div className="w-full bg-green-600" style={{ height: successHeight }} />
                </div>
                <span className="text-[11px] text-zinc-500">{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-shrink-0 items-center gap-3 text-[11px] text-zinc-600">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" aria-hidden="true" />
            {DEPLOY_TOTALS.success} succeeded
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-500" aria-hidden="true" />
            {DEPLOY_TOTALS.failed} failed
          </span>
        </div>
      </div>
    </Card>
  );
}
