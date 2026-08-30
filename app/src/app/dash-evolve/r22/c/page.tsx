import type { Metadata } from "next";
import { ApertureClient } from "./ApertureClient";

export const metadata: Metadata = {
  title: "Aperture — Explore",
  description: "Ad-hoc BI query console: assemble a metric, group-by, and period, and read the answer.",
};

export default function Page() {
  return <ApertureClient />;
}
