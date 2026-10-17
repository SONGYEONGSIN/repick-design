import type { Metadata } from "next";
import DemandRibbonLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Category Demand Ribbon",
  description:
    "A live streamgraph of resale-value demand across lenses, camera bodies, accessories and vintage film gear. Drag a category weight and watch the ribbon reflow, reorder and carry your listing's marker with it.",
};

export default function Page() {
  return <DemandRibbonLanding />;
}
