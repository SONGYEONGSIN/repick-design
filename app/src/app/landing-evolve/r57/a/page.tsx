import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Set your range, see what qualifies",
  description:
    "Drag two independent price handles over six fixed resale listings and watch a live eligibility checklist — budget, condition, verified seller, and shipping — recompute in real time.",
};

export default function Page() {
  return <Client />;
}
