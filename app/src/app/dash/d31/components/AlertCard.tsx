import { ExternalLink, TriangleAlert } from "lucide-react";
import { detectErrorSpike, WORKFLOW_BY_ID } from "../lib/data";
import { formatNumber } from "../lib/format";

export default function AlertCard() {
  const spike = detectErrorSpike();
  const workflow = WORKFLOW_BY_ID.get("wf_b84c0e");
  const ratioText = `${spike.ratio.toFixed(1)}배`;

  return (
    <section
      aria-labelledby="alert-card-heading"
      className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
          <TriangleAlert className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id="alert-card-heading" className="text-sm font-semibold text-rose-300">
            에러 급증 감지
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-300">
            <span className="font-medium text-zinc-100">{workflow?.name}</span>에서{" "}
            <span className="tabular-nums">{spike.label}</span> 구간 실패{" "}
            <span className="tabular-nums">{formatNumber(spike.count)}건</span> 발생 — 평소 대비{" "}
            <span className="tabular-nums font-medium text-rose-300">{ratioText}</span> 수준입니다.
          </p>
          <a
            href="#execution-log"
            className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
          >
            실행 로그에서 확인
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
