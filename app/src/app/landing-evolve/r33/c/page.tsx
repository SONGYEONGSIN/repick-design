import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Trust, drawn as one line",
  description:
    "repick verifies every secondhand listing across five independent checks and traces the result as one live confidence line you can watch move.",
};

export default function Page() {
  return <LandingPage />;
}
