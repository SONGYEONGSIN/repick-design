import type { Metadata } from "next";
import BubbleMatchLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Bigger means better match",
  description:
    "Six sellers, one bike. Drag a weight for price, condition, trust or speed and watch every listing's bubble resize and reshuffle live, proportional to its real match score.",
};

export default function Page() {
  return <BubbleMatchLanding />;
}
