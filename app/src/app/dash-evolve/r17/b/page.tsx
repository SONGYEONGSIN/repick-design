import type { Metadata } from "next";
import BaylineClient from "./BaylineClient";

export const metadata: Metadata = {
  title: "Bayline — Fleet maintenance bay planner",
  description:
    "Bayline plans a truck fleet's service bays six weeks ahead: a calendar heatmap of daily bay load with always-visible week and weekday totals, a day agenda that drills into any cell, a matching daily trend, and a sortable roster of the eight bays.",
};

export default function Page() {
  return <BaylineClient />;
}
