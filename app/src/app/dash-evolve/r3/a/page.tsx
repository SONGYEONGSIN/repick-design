import type { Metadata } from "next";
import TracklineClient from "./components/TracklineClient";

export const metadata: Metadata = {
  title: "Trackline — Q3 Platform Roadmap",
  description:
    "Trackline is a resource and project planning workspace. This view plans the Q3 platform roadmap on a team-member Gantt timeline with milestones, filters, and a synced task detail rail.",
};

export default function Page() {
  return <TracklineClient />;
}
