import type { Metadata } from "next";
import NudgeClient from "./NudgeClient";

export const metadata: Metadata = {
  title: "Nudge — Onboarding Pulse Survey",
  description:
    "Nudge is a survey and form builder for product and growth teams: an editable question rail with per-question completion analytics and branching logic, synced to a live respondent preview with mobile/desktop framing and a generated logic map.",
};

export default function Page() {
  return <NudgeClient />;
}
