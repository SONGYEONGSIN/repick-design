import type { Metadata } from "next";
import RadarClient from "./RadarClient";

export const metadata: Metadata = {
  title: "repick — Weighted match radar",
  description:
    "A resale-marketplace landing page whose hero is a five-axis weighted radar chart: dragging price, condition, trust, ship-speed, and authenticity sliders redraws the polygon and live-reorders four verified listings, each carrying match%, condition grade, verification badge, and discount — with the current top pick echoed all the way to the closing CTA.",
};

export default function Page() {
  return <RadarClient />;
}
