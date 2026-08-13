import type { Metadata } from "next";

import VerdantDashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Verdant — Personal money",
  description:
    "Three answers on one screen: where the money leaks, how far the goals are, and what is left this month.",
};

export default function Page() {
  return <VerdantDashboard />;
}
