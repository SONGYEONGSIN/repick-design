import type { Metadata } from "next";
import DispatchClient from "./dispatch-client";

export const metadata: Metadata = {
  title: "Crewline — Dispatch Schedule Console",
  description:
    "Crewline is a field-service dispatch console built around a full week scheduling calendar — six technicians, their jobs, and a team-capacity bar chart, with a Week/Day view toggle, status filtering, and click-to-highlight technician selection.",
};

export default function Page() {
  return <DispatchClient />;
}
