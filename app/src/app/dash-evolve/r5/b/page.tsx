import type { Metadata } from "next";
import QuayClient from "./components/QuayClient";

export const metadata: Metadata = {
  title: "Quay — Fernbank Outfitters Shared Inbox",
  description:
    "Quay is a shared support inbox for customer-facing teams. This view triages Fernbank Outfitters' inbound conversations across a queue rail, conversation list, message thread, and customer detail panel.",
};

export default function Page() {
  return <QuayClient />;
}
