import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Sell-through speed by category",
  description:
    "Pick the categories you sell and see a packed-circle cluster of real 30-day sell-through data for each one, sized and repacked live, before you list anything.",
};

export default function Page() {
  return <LandingPage />;
}
