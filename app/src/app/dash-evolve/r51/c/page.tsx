import type { Metadata } from "next";
import SiftlineClient from "./SiftlineClient";

export const metadata: Metadata = {
  title: "Siftline — Review Queue",
  description:
    "Siftline is a trust & safety moderation console. A dense, always-visible review queue of flagged listings, messages, profiles, reviews and comments sits between a category/SLA summary rail and a report detail panel. Clicking a feed item pins the detail panel only; a separate category chip in the left rail narrows the feed and its own count without ever touching that pin.",
};

export default function Page() {
  return <SiftlineClient />;
}
