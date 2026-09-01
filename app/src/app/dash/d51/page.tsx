import type { Metadata } from "next";
import RedoubtClient from "./RedoubtClient";

export const metadata: Metadata = {
  title: "Redoubt — Security Audit Console",
  description:
    "Redoubt is a security/audit-log console. A vertical chronological event stream is the page's main stage, narrowed by actor, event type, and severity filters that only recompute the stream and its summary counts, while clicking an event opens an ephemeral inspector drawer that never touches the rest of the page.",
};

export default function Page() {
  return <RedoubtClient />;
}
