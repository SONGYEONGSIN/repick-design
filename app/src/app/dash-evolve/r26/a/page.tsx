import type { Metadata } from "next";
import ColdlineClient from "./ColdlineClient";

export const metadata: Metadata = {
  title: "Coldline — Excursion Intensity",
  description:
    "Coldline is a cold-chain telemetry console. A 7×24 excursion-minutes heatmap is the page's single dominant visualization — clicking a cell pins it and recalculates only two of the four summary cards, while hovering is a purely ephemeral crosshair readout and the alerts log below never reads the pin at all.",
};

export default function Page() {
  return <ColdlineClient />;
}
