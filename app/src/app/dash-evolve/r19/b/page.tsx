import type { Metadata } from "next";
import CadenceClient from "./CadenceClient";

export const metadata: Metadata = {
  title: "Cadence — Production Line Roadmap",
  description:
    "Cadence is a production scheduling console. A full-width Gantt lays six production lines out as tracks of dated work orders, a Week/Month/Quarter toggle rescales every bar's pixel position in place, and pinning a line re-sorts and re-highlights the roadmap while recomputing the KPI strip's scope — without threading the raw selection into the independent work order ledger below.",
};

export default function Page() {
  return <CadenceClient />;
}
