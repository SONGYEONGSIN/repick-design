import type { Metadata } from "next";
import BriefLanding from "./ui";

export const metadata: Metadata = {
  title: "repick — The Standing Brief",
  description:
    "repick reads a sentence, not a keyword string. Swap any phrase in the standing brief and the ranked field, the match scores, every reason tag and the written argument for the order all rewrite at once.",
};

export default function Page() {
  return <BriefLanding />;
}
