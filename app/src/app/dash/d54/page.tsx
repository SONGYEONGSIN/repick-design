import type { Metadata } from "next";
import PortageClient from "./PortageClient";

export const metadata: Metadata = {
  title: "Portage — Dispatch Board",
  description:
    "Portage is a pickup-logistics dispatch console. A generative hex-zone map of today's routes is the page's centerpiece — hovering a van is a momentary inspector with zero persistent state, while pinning a route updates only the detail card and the map's own highlight, deliberately leaving the citywide zone-load summary untouched.",
};

export default function Page() {
  return <PortageClient />;
}
