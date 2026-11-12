import type { Metadata } from "next";
import GantryClient from "./gantry-client";

export const metadata: Metadata = {
  title: "Gantry — Model Deployment Approval Board",
  description:
    "Gantry is a model-deployment approval console for ML platform teams, built around a five-stage kanban board (Requested → Risk Review → Approved → Canary → Live) with a pipeline-velocity funnel strip, keyboard-reachable move-between-stages menus, risk-level filtering, a deployment detail panel, and a command palette.",
};

export default function Page() {
  return <GantryClient />;
}
