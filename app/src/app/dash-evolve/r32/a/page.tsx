import type { Metadata } from "next";
import TripwireConsole from "./client";

export const metadata: Metadata = {
  title: "repick — Tripwire",
  description: "Fraud and dispute signal wall for the repick trust & safety team, with pinned root-cause detail and case tracking.",
};

export default function Page() {
  return <TripwireConsole />;
}
