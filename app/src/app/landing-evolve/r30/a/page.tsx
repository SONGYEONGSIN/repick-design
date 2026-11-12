import type { Metadata } from "next";
import { LandingPage } from "./components/LandingPage";

export const metadata: Metadata = {
  title: "repick — what you'd pay, priced against this week's market",
  description:
    "Drag a single price ceiling and watch five resale categories reprice themselves against this week's real asking data.",
};

export default function Page() {
  return <LandingPage />;
}
