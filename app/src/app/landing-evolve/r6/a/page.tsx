import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — An Appraisal Certificate for Every Match",
  description:
    "Every listing repick surfaces arrives with a signed appraisal: match score, condition grade, verified seller, and a price verdict — proof you can check, not a promise you take on faith.",
};

export default function Page() {
  return <LandingClient />;
}
