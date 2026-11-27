import type { Metadata } from "next";
import { JoblineClient } from "./JoblineClient";

export const metadata: Metadata = {
  title: "Jobline — Dispatch Console",
  description: "Jobline's field-service dispatch console: today's jobs across six technicians as a kanban board or a day timeline, with a crew-utilization bullet-chart grid, a pinnable technician detail drawer, and a sortable jobs table.",
};

export default function Page() {
  return <JoblineClient />;
}
