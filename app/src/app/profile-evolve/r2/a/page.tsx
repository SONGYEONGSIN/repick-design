import type { Metadata } from "next";
import IdentityBar from "./identity-bar";
import IntroSection from "./intro-section";
import TrackRecordTable from "./track-record-table";
import CaseLog from "./case-log";
import SidePanel from "./side-panel";

export const metadata: Metadata = {
  title: "Imogen Castellane — Keel & Ballast Audits",
  description:
    "Imogen Castellane is an independent protocol security auditor: a persistent rating, audit count, and vulnerability tally, plus a filterable, sortable, expandable chronological log of every audit engagement.",
};

export default function Page() {
  return (
    <div className="min-h-full bg-white">
      <IdentityBar />
      <main>
        <IntroSection />
        <TrackRecordTable />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            <CaseLog />
            <SidePanel />
          </div>
        </div>
      </main>
    </div>
  );
}
