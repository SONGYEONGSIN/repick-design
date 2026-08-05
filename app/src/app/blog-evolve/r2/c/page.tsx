import type { Metadata } from "next";
import { Anchor } from "lucide-react";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import ReleaseTimeline from "./release-timeline";
import { RELEASES } from "./data";

export const metadata: Metadata = {
  title: "Keelson Changelog — release notes",
  description:
    "Every Keelson release, in order — durable queues, workflows, and scheduling changes bolted to a version, browsable by release type or jumped to directly.",
};

export default function BlogIndexPage() {
  const latest = RELEASES[0];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Anchor aria-hidden="true" className="h-3.5 w-3.5" />
              Engineering changelog
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold text-zinc-900 sm:text-4xl">
              Changelog &amp; release notes
            </h1>
            <p className="mt-3 max-w-xl text-base font-normal text-zinc-600">
              Every Keelson release, in order. Each entry is bolted to a version the way a keelson is
              bolted along a hull — one continuous spine, nothing shipped off the record.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="text-xs font-semibold text-zinc-500">Latest version</dt>
                <dd className="font-mono text-lg font-bold tabular-nums text-zinc-900">{latest?.version}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-zinc-500">Total releases logged</dt>
                <dd className="text-lg font-bold tabular-nums text-zinc-900">{RELEASES.length}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">Release timeline</h2>
          <p className="mt-1.5 max-w-2xl text-sm font-normal text-zinc-600">
            Filter by release type, search across every entry, or jump straight to a version from the
            index alongside the spine.
          </p>
          <div className="mt-6">
            <ReleaseTimeline />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
