import type { Metadata } from "next";
import CovenantClient from "./CovenantClient";

export const metadata: Metadata = {
  title: "Covenant — Contract Review & Redlining Console",
  description:
    "Covenant is a legal-ops contract review console: a status-grouped contract list with sortable risk and expiry columns, a clause-level risk breakdown, and a hand-authored redline comparison view, all synced to a single detail pane with full keyboard navigation.",
};

export default function Page() {
  return <CovenantClient />;
}
