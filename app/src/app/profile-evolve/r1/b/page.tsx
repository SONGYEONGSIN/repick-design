import type { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Sable Voss — Loopwire Developers",
  description:
    "Sable Voss is a Verified Maintainer on Loopwire, publishing 9 integrations across CRM, support, payments, e-commerce, analytics, and DevOps — with a year of contribution activity, live install and rating stats, and a filterable list of published apps.",
};

export default function Page() {
  return <ProfileClient />;
}
