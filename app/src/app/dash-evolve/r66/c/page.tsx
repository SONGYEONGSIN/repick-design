import type { Metadata } from "next";
import { SpendmeshClient } from "./SpendmeshClient";

export const metadata: Metadata = {
  title: "Spendmesh — Cost allocation",
  description:
    "Spendmesh is a cloud cost / spend-allocation console. Its home view is one full-bleed treemap of team-by-service spend with a slim top bar and inline KPI strip — no permanent side rail, and a selection drawer that only exists while a cell is picked.",
};

export default function Page() {
  return <SpendmeshClient />;
}
