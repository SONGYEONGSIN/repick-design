import type { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Reeve Calloway — Fieldwork",
  description:
    "Reeve Calloway is a Senior Product & Growth Designer on Fieldwork with 58 completed engagements, a 4.9 client rating, and a filterable, sortable case-study portfolio covering onboarding, conversion, retention, and design-systems work.",
};

export default function Page() {
  return <ProfileClient />;
}
