import type { Metadata } from "next";
import FairPriceLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Fair Price Matrix",
  description:
    "Set a condition grade and an age bracket and watch repick's Fair Price Matrix highlight the exact cell your gear falls into, live.",
};

export default function Page() {
  return <FairPriceLanding />;
}
