import type { Metadata } from "next";
import QuadrantLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Land on your tier",
  description:
    "Drag two sliders — price priority and sale urgency — and repick's AI plots a single live point across four seller service tiers, explaining why each one fits.",
};

export default function Page() {
  return <QuadrantLanding />;
}
