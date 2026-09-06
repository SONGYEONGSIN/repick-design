import type { Metadata } from "next";
import BundleLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Every match, argued in the open",
  description:
    "repick shows the reasoning behind every AI match before you buy, then recomputes bundle savings and trust scores live as you build your own bundle.",
};

export default function Page() {
  return <BundleLanding />;
}
