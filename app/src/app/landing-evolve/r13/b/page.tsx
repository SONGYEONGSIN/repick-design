import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Set a Budget, Watch Every Price Drop Line Up",
  description:
    "repick surfaces price-verified pre-owned listings that fit your budget. Each spec card draws the price falling from market rate to the repick-verified figure as a line, with a live match score, condition grade, and verification already on the card.",
};

export default function Page() {
  return <LandingClient />;
}
