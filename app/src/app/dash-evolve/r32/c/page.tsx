import type { Metadata } from "next";
import ReturnFlowConsole from "./client";

export const metadata: Metadata = {
  title: "repick — Loopback",
  description: "Ops console mapping how repick return and refund cases actually flow — branches, escalations and re-inspection loops included, with the escalation-review bottleneck flagged.",
};

export default function Page() {
  return <ReturnFlowConsole />;
}
