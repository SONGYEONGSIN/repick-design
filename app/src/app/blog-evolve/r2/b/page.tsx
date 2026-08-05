import type { Metadata } from "next";
import { BarChart3, FileText, Mail, Users } from "lucide-react";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import ReportExplorer from "./report-explorer";
import { CATEGORIES, TOTAL_AUTHORS, TOTAL_REPORTS } from "./data";

export const metadata: Metadata = {
  title: "Baseline — The public benchmark journal",
  description:
    "Every report ships with its methodology, sample size, and raw baseline-vs-result numbers, surfaced directly in the index so findings can be compared without opening a single one.",
};

const SUMMARY_STATS = [
  { icon: FileText, label: "Published reports", value: TOTAL_REPORTS },
  { icon: BarChart3, label: "Benchmark categories", value: CATEGORIES.length },
  { icon: Users, label: "Contributing engineers", value: TOTAL_AUTHORS },
];

export default function Page() {
  return (
    <div id="top" className="min-h-screen bg-zinc-950">
      <SiteHeader />

      <main>
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-9 sm:px-8 sm:pt-14 sm:pb-12">
          <p className="text-xs font-medium tracking-[0.14em] text-emerald-400 uppercase">Baseline Journal</p>
          <h1
            className="mt-2 max-w-2xl text-4xl leading-tight font-semibold text-balance text-zinc-50 sm:text-5xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            The benchmark journal engineering teams cite in RFCs.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed font-normal text-zinc-400">
            Every report here ships with its baseline, its result, its sample size and its
            methodology — surfaced in the index itself, not locked behind a click. Scan for the
            finding first; open a report only when you need the detail.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {SUMMARY_STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-emerald-400">
                  <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                  <span className="sr-only">{label}</span>
                </dt>
                <dd className="leading-tight">
                  <span className="block text-lg font-semibold tabular-nums text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
                    {value}
                  </span>
                  <span className="block text-xs font-normal text-zinc-400">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ReportExplorer />
        </div>

        <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <div className="grid gap-8 border-t border-zinc-800 pt-10 sm:grid-cols-3">
            <div id="methodology" className="min-w-0 scroll-mt-24">
              <h2 className="text-sm font-semibold text-zinc-50">Methodology</h2>
              <p className="mt-2 text-sm leading-relaxed font-normal text-zinc-400">
                Every report states its sample size, repeat count, and confidence level up front.
                Exploratory findings are labelled as such and never mixed into the same shelf as
                repeated, high-confidence runs.
              </p>
            </div>
            <div id="datasets" className="min-w-0 scroll-mt-24">
              <h2 className="text-sm font-semibold text-zinc-50">Datasets</h2>
              <p className="mt-2 text-sm leading-relaxed font-normal text-zinc-400">
                Raw run data and the harnesses behind each report are published alongside it, so a
                result can be reproduced or challenged rather than taken on faith.
              </p>
            </div>
            <div id="about" className="min-w-0 scroll-mt-24">
              <h2 className="text-sm font-semibold text-zinc-50">About Baseline</h2>
              <p className="mt-2 text-sm leading-relaxed font-normal text-zinc-400">
                An independent journal run by infrastructure engineers, for infrastructure
                engineers. No sponsored benchmarks, no vendor-supplied numbers.
              </p>
            </div>
          </div>

          <div id="subscribe" className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 scroll-mt-24 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                Get new reports by email
              </h2>
              <p className="mt-1.5 max-w-md text-sm font-normal text-zinc-400">
                One email when a new benchmark publishes. No sponsor placements, ever.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-emerald-400 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Subscribe
            </a>
          </div>
        </div>

        <div className="h-16 sm:h-20" aria-hidden="true" />
      </main>

      <SiteFooter />
    </div>
  );
}
