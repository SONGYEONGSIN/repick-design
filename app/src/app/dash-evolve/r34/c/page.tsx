import { AppShell } from "./app-shell";
import { KpiStrip } from "./kpi-strip";
import { FeedbackExplorer } from "./feedback-explorer";

export default function WordTrendsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1760px] px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Word Trends</h1>
        <p className="mt-1 max-w-2xl text-sm font-normal text-zinc-400">
          Word-level sentiment analysis across app store reviews and support tickets for Acme Mobile.
        </p>

        <div className="mt-6">
          <KpiStrip />
        </div>

        <FeedbackExplorer />
      </div>
    </AppShell>
  );
}
