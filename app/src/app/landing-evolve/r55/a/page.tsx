import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Regrade — See exactly what condition is worth",
  description:
    "Regrade is a condition-graded resale marketplace. Step through Good, Very Good, Excellent, and Like New on a real listing and watch the resale price and buyer note update live.",
};

export default function Page() {
  return <Client />;
}
