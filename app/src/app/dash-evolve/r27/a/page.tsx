import type { Metadata } from "next";
import WaymarkClient from "./WaymarkClient";

export const metadata: Metadata = {
  title: "Waymark — Goals Console",
  description:
    "Waymark is an OKR console for an engineering and product org. A dense bullet-chart grid is the page's dominant visualization — every key result shows its value, target and qualitative band as standing text, with hover or keyboard focus adding only a trend delta. Pinning a row recomputes a single focus card; the check-ins log below keeps its own filters.",
};

export default function Page() {
  return <WaymarkClient />;
}
