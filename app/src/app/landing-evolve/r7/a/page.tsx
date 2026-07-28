import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — New Matches, Already Posted",
  description:
    "repick's AI keeps a live split-flap board of listings pulled from your taste profile — switch categories and watch real matches post with their score, grade, and price already stamped on.",
};

export default function Page() {
  return <LandingClient />;
}
