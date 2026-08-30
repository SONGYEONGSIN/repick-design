import type { Metadata } from "next";
import MatchingBoardLanding from "./client";

export const metadata: Metadata = {
  title: "Repick — Live Matching Board",
  description:
    "See buyer requests and seller listings threaded together with real evidence, live-recalculated by category and matching criteria.",
};

export default function Page() {
  return <MatchingBoardLanding />;
}
