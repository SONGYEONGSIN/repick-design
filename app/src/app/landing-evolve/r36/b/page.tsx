import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "Covera — Coverage by concern, not one blended score",
  description:
    "Toggle authenticity, condition accuracy, ship speed, seller reliability and price fairness independently. A concentric ring cluster renders exactly which ones a real listing clears.",
};

export default function Page() {
  return <LandingPage />;
}
