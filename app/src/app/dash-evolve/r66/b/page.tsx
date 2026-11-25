import type { Metadata } from "next";
import { SiteframeApp } from "./SiteframeApp";

export const metadata: Metadata = {
  title: "Siteframe — Visit calendar",
  description: "Clinical-trial site-visit scheduling and tracking console for CRO and sponsor operations teams.",
};

export default function Page() {
  return <SiteframeApp />;
}
