import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About — Ferrous",
  description:
    "Ferrous is a resale marketplace where nothing is listed until it has been graded. Four measures of how well that has held up since 2017, each one named to the person answerable for it and the rule it comes from.",
};

export default function Page() {
  return <AboutClient />;
}
