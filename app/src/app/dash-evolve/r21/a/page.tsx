import type { Metadata } from "next";
import MeridianClient from "./MeridianClient";

export const metadata: Metadata = {
  title: "Meridian — Support Triage Board",
  description:
    "Meridian is a support-ops console. A five-column triage board is the page's main stage — filterable by priority and free text, every card printing its own SLA burn as a progress bar — while an SLA heat grid on the right is scoped only by its own time window, independent of the board's filters.",
};

export default function Page() {
  return <MeridianClient />;
}
