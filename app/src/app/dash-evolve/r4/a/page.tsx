import type { Metadata } from "next";
import RidgelineClient from "./components/RidgelineClient";

export const metadata: Metadata = {
  title: "Ridgeline — Core Platform Issues",
  description:
    "Ridgeline is an issue-tracking workspace for engineering teams. This view browses the Core Platform project's issue queue on a master-detail rail, with a synced full detail pane for status, sub-issues, and activity.",
};

export default function Page() {
  return <RidgelineClient />;
}
