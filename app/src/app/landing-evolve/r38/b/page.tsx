import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — The Split",
  description:
    "Drag the divider across a real listing photo to reveal repick's AI grading overlay, live — the confidence score, fair-price estimate and checks found all recompute as you drag or switch listings.",
};

export default function Page() {
  return <LandingPage />;
}
