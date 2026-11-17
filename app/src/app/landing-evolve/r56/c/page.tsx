import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Sift — Swipe to build your taste profile",
  description:
    "Pass or like one secondhand find at a time. Sift turns a sequential swipe deck into a live preference profile that re-ranks a recommended-for-you rail in real time.",
};

export default function Page() {
  return <Client />;
}
