import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Compare everything that matters",
  description:
    "Add up to three repick listings to a live comparison table and see price, match score, condition, and seller rating side by side.",
};

export default function Page() {
  return <Client />;
}
