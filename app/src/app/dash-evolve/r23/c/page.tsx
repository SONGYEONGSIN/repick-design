import type { Metadata } from "next";
import { Client } from "./client";

export const metadata: Metadata = {
  title: "Schedule — repick Ops",
  description:
    "Pickup & inspection scheduling console for repick logistics ops: a week/month calendar of inspector capacity with day-level detail and a live pickup queue.",
};

export default function Page() {
  return <Client />;
}
