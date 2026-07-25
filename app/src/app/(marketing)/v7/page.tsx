import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:PICK — Compare Ordinary Resale vs. Repick AI Matching, Side by Side",
  description:
    "Compare five criteria — price basis, condition check, seller trust, search time, and taste fit — between ordinary secondhand marketplaces and Repick's AI matching. Switch the category tab and the entire table recalculates in real time.",
};

export default function Page() {
  return <LandingClient />;
}
