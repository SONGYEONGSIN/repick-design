// app/src/app/blog-evolve/r2/b/feed-card.tsx
//
// Single-column "evidence panel" card: a metric column carrying the headline stat and comparison
// bars sits beside the editorial column, so the finding is legible without opening the report. This
// is deliberately not a photographic card grid (auto-blog-r1/a) and not a plain text row (r1/b) —
// the chart panel is the primary visual unit, not a decorative accent on top of a text list.
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import Avatar from "./avatar";
import { CategoryBadge, ConfidenceBadge } from "./badges";
import { MetricBars, MetricStat } from "./metric-panel";
import type { Report } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function FeedCard({ report }: { report: Report }) {
  const titleId = `feed-title-${report.slug}`;

  return (
    <li className="min-w-0">
      <article
        aria-labelledby={titleId}
        className="grid min-w-0 grid-cols-1 gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-6 sm:p-6"
      >
        <div className="min-w-0 border-b border-zinc-800 pb-4 sm:border-b-0 sm:border-r sm:pr-6 sm:pb-0">
          <MetricStat metric={report.metric} />
          <p className="mt-0.5 text-xs font-normal text-zinc-400">{report.metric.label}</p>
          <MetricBars metric={report.metric} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <CategoryBadge id={report.category} />
            <ConfidenceBadge level={report.confidence} />
          </div>

          <h3
            id={titleId}
            className="mt-2 text-lg leading-snug font-semibold text-zinc-50 sm:text-xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            <Link href={`#${report.slug}`} className={`rounded-sm hover:text-emerald-400 ${FOCUS_RING}`}>
              {report.title}
            </Link>
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed font-normal text-zinc-400">{report.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400">
            <Avatar name={report.author.name} seed={report.author.seed} size={24} />
            <span className="font-medium text-zinc-200">{report.author.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={report.date}>{report.dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="tabular-nums">{report.readMins} min read</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="tabular-nums">{report.sampleSize.toLocaleString()}</span> {report.sampleUnit}
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}
