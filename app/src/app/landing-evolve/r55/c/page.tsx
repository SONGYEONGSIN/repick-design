import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Meetpoint — Know your gap before you send an offer",
  description:
    "Meetpoint is a resale marketplace with a built-in negotiator: drag your offer and the seller's estimated minimum onto one shared price scale and watch the gap, the outcome, and the closing pitch update live.",
};

export default function Page() {
  return <Client />;
}
