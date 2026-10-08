import type { Metadata } from "next";
import { IsobarClient } from "./isobar-client";

export const metadata: Metadata = {
  title: "Isobar — Edge Network Overview",
  description:
    "A multi-region edge infrastructure console whose spine is a live activity feed of incidents, deployments and traffic spikes across 14 edge regions. A generative hex-grid choropleth lives in a side panel: selecting a feed item pins its region on the map, while hovering or tab-focusing any region shows an ephemeral stats tooltip — two independent mechanisms, not one shared selection. A metric toggle swaps the map's color ramp between incident load and p50 latency, both always paired with an in-region number and a persistent text legend. A sortable, filterable region table underneath carries the same data as a full accessible fallback.",
};

export default function Page() {
  return <IsobarClient />;
}
