import type { Metadata } from "next";
import ConstellationLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Match Constellation",
  description:
    "repick draws the real lines between what you need — budget, condition, brand, ship speed — and the graded listings that actually answer each one, with the match percent and the exact reason behind every connection.",
};

export default function Page() {
  return <ConstellationLanding />;
}
