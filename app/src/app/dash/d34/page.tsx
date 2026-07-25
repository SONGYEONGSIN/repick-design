import type { Metadata } from "next";
import { PulseDashboard } from "./pulse-dashboard";

export const metadata: Metadata = {
  title: "Pulse — Customer Support SLA Operations Console",
  description:
    "Pulse is a customer support SLA operations console that surfaces channel queues, agent workload, and escalations at a glance through hero metrics and a bento grid.",
};

export default function Page() {
  return <PulseDashboard />;
}
