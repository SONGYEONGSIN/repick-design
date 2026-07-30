import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "Threshold — Drag-to-Compare AI Secondhand Matching",
  description:
    "On the left, a typical secondhand listing. On the right, a listing reorganized by Threshold AI after verifying condition, price, and taste fit. Drag the handle yourself to compare the two ways of buying secondhand.",
};

export default function Page() {
  return <LandingClient />;
}
