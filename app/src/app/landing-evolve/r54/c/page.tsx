import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Sort your pile. See what it's worth.",
  description:
    "Drag each item into a lane on repick -- list it for cash, bundle it, or donate it -- and watch the projected payout update live.",
};

export default function Page() {
  return <Client />;
}
