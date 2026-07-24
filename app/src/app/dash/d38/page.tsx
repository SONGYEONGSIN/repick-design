import type { Metadata } from "next";
import WavelengthClient from "./WavelengthClient";

export const metadata: Metadata = {
  title: "Wavelength — Incident & On-Call Response Console",
  description:
    "Wavelength is an SRE on-call console built as a master-detail cockpit: a 24-hour radial on-call schedule ring showing which engineer covers each hour block with a live now-needle, above a sortable/filterable incident rail synced to a detail panel with a triggered→acknowledged→resolved timeline and runbook checklist.",
};

export default function Page() {
  return <WavelengthClient />;
}
