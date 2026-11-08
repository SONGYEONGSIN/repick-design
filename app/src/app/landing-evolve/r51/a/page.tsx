import type { Metadata } from "next";
import DuelLanding from "./DuelLanding";

export const metadata: Metadata = {
  title: "repick — Pick what matters, match what's worth it",
  description:
    "A sequential forced-choice duel between repick's matching priorities — price, condition grade, seller rating, and shipping speed — that trains a live weight model and re-ranks the recommended match after every pick.",
};

export default function Page() {
  return <DuelLanding />;
}
