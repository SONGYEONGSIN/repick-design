import type { Metadata } from "next";
import InboxlineClient from "./InboxlineClient";

export const metadata: Metadata = {
  title: "Inboxline — Inbox Placement",
  description:
    "Inboxline is an email-deliverability console. A full-height streamgraph is the hero: four hatch-patterned ribbons — Gmail, Outlook, Yahoo, Other — stack each day's successful inbox placements, with every provider's current rate always printed beside it. Clicking a ribbon pins a provider-detail card to the worst performer by default; scrubbing the rail below the chart opens a separate, ephemeral per-day crosshair that never touches the pin.",
};

export default function Page() {
  return <InboxlineClient />;
}
