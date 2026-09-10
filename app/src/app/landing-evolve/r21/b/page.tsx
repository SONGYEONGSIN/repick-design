import type { Metadata } from "next";
import PayoutLanding from "./client";

export const metadata: Metadata = {
  title: "repick — See your payout before you list",
  description:
    "repick shows sellers a live, itemized payout receipt — base estimate, condition adjustment, authentication and shipping fees all recomputing as you configure your listing.",
};

export default function Page() {
  return <PayoutLanding />;
}
