import type { Metadata } from "next";
import ArborClient from "./ArborClient";

export const metadata: Metadata = {
  title: "Arbor — ESG Facility Scorecard",
  description:
    "Arbor is repick's multi-facility ESG scorecard. A full-width slope chart is the main surface: one row per facility, a dot for last quarter's score and a dot for this quarter's, joined by a line, with both values always printed as plain text. Each row is a single click/focus target that opens its own breakdown — the two score dots are decorative only, never separately interactive, so there are never two small hit targets sitting close together.",
};

export default function Page() {
  return <ArborClient />;
}
