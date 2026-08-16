import type { Metadata } from "next";
import ConsoleClient from "./console-client";

export const metadata: Metadata = {
  title: "Traverse — Regional Network Operations Console",
  description:
    "Traverse is a regional logistics network console built around a schematic route-network map — 12 hubs and their lanes, with on-time percentage and status printed on every node — plus a synced trend chart, hub detail panel, and sortable routes table.",
};

export default function Page() {
  return <ConsoleClient />;
}
