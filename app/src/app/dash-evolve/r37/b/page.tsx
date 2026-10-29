import type { Metadata } from "next";
import { BaselineConsole } from "./baseline-console";

export const metadata: Metadata = {
  title: "Baseline — Vendor Quality Scorecards",
  description:
    "A procurement quality console whose hero is a full-width strip of hand-built box plots, one per vendor, sorted by median and always showing median and outlier count as text. Hovering or focusing a box opens an ephemeral five-number-summary popover that touches no other page state; a fully independent, sortable and filterable vendor directory table sits below with no sync to the chart above; a metric toggle switches the strip between defect rate, delivery variance and inspection score, and a separate control sorts the strip by median or vendor name.",
};

export default function Page() {
  return <BaselineConsole />;
}
