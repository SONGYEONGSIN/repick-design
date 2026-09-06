import type { Metadata } from "next";
import LandingClient from "./client";

export const metadata: Metadata = {
  title: "repick — Know What It's Worth Before You List It",
  description:
    "repick's AI narrows a live resale price range as you answer a short qualification flow, backed by verified comparable sales.",
};

export default function Page() {
  return <LandingClient />;
}
