import type { Metadata } from "next";
import CorridorClient from "./CorridorClient";

export const metadata: Metadata = {
  title: "Corridor — Workplace Booking Console",
  description:
    "Corridor is a workplace resource booking console. A time-grid week board is the primary calendar, with a month heatmap toggle, a resource rail whose selection recomputes the board and table (not a raw shared id), and a sortable, status-filterable bookings table.",
};

export default function Page() {
  return <CorridorClient />;
}
