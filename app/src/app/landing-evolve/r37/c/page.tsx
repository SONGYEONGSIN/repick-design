import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Five spots separate real from replica",
  description:
    "Drag a magnifier lens over a sneaker illustration to uncover the five authenticity markers our graders check on every listing, with a confidence score that recomputes live.",
};

export default function Page() {
  return <LandingPage />;
}
