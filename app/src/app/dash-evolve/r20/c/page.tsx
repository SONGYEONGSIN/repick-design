import type { Metadata } from "next";
import LockstepClient from "./LockstepClient";

export const metadata: Metadata = {
  title: "Lockstep — Deploy & Error-Budget Console",
  description:
    "Lockstep is a platform-ops console. A live, filterable and sortable deploy feed is the page's main stream; a bullet-chart error-budget grid on the right prints every service's exact burn percentage as standing text, gated only by its own 7D/30D toggle — filtering the feed never reaches it, and selecting a service from the command palette only highlights that one bullet row.",
};

export default function Page() {
  return <LockstepClient />;
}
