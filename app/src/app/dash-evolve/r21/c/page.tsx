import type { Metadata } from "next";
import FlowlineClient from "./FlowlineClient";

export const metadata: Metadata = {
  title: "Flowline — Inventory Forecast Console",
  description:
    "Flowline is an inventory forecasting console. A headline days-of-cover number with inline stat chips replaces the usual four-tile KPI row, above a single dominant line-and-confidence-band forecast chart — hover or focus any day for its exact projection — while an independent SKU risk table below runs its own sort and filter.",
};

export default function Page() {
  return <FlowlineClient />;
}
