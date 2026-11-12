import type { Metadata } from "next";
import { DockClient } from "./DockClient";

export const metadata: Metadata = {
  title: "Dock schedule — Portlane",
  description: "Portlane's live dock-door timeline: every carrier appointment across Harborview Terminal 4's 12 dock doors, with utilization, conflicts, and a synced detail panel.",
};

export default function Page() {
  return <DockClient />;
}
