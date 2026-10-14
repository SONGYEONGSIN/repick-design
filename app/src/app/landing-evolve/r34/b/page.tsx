import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — unlock your savings",
  description:
    "Switch on the pickup, bundle, timing, and verification conditions that apply to you and watch a live waterfall chart carry the listing price down to what you'd actually pay.",
};

export default function Page() {
  return <LandingPage />;
}
