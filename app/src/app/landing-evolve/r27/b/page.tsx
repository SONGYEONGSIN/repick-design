import type { Metadata } from "next";
import DemandMapLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Demand Map",
  description:
    "Add or remove categories and watch repick's demand map re-subdivide its whole area live, showing exactly where verified buyer demand is concentrated right now.",
};

export default function Page() {
  return <DemandMapLanding />;
}
