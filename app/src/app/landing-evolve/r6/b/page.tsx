import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Verified before you ever see it",
  description:
    "Scroll through the four checks repick's AI runs on every listing — condition, price fairness, seller verification, and match score — proven on one real coat.",
};

export default function Page() {
  return <LandingClient />;
}
