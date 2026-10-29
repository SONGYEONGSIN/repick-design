import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — resale, graded before it's priced",
  description:
    "repick grades condition, verifies the seller, and matches your listing to buyers already shopping its companion categories before you set a price.",
};

export default function Page() {
  return <LandingPage />;
}
