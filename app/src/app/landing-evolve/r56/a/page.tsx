import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — search gear, see the reasoning",
  description:
    "Type a brand, model, or keyword and repick ranks every camera and lens listing live, showing exactly which words earned the match — plus condition grade, seller verification, and discount on every result.",
};

export default function Page() {
  return <Client />;
}
