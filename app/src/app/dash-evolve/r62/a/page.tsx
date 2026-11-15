import type { Metadata } from "next";
import { StagebookClient } from "./StagebookClient";

export const metadata: Metadata = {
  title: "Stagebook — Booking Calendar",
  description: "Stagebook's event-venue booking calendar: every reception, shoot, and offsite across four rooms at Lumen Hall & Studios, with a synced day panel, revenue trend, and a sortable bookings table.",
};

export default function Page() {
  return <StagebookClient />;
}
