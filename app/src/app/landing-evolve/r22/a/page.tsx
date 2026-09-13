import type { Metadata } from "next";
import CaseFileLanding from "./client";

export const metadata: Metadata = {
  title: "The Case File — repick",
  description:
    "Choose an inspection intensity and a comparison window and watch repick's AI condition report — confidence, price, checklist, and days-to-sell — recompute in place.",
};

export default function Page() {
  return <CaseFileLanding />;
}
