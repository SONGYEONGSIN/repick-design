import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Signal Graph",
  description:
    "repick draws its matching logic as a live relationship graph — five preference signals wired to four real listings, with strength-encoded edges and a reasoning panel that recomputes the moment you select a signal.",
};

export default function Page() {
  return <LandingClient />;
}
