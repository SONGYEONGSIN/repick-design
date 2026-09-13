import type { Metadata } from "next";
import CompareConsoleLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Compare listings side by side",
  description:
    "Pick up to three AI-matched listings and repick builds one live comparison table — price, condition, verification and match score — with the best cell in every row marked for you.",
};

export default function Page() {
  return <CompareConsoleLanding />;
}
