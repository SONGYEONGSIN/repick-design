import type { Metadata } from "next";
import { ClearcallClient } from "./ClearcallClient";

export const metadata: Metadata = {
  title: "Clearcall — Calls",
  description:
    "Clearcall is a revenue call-intelligence console. Its home view centers on a call list rail paired with a team-wide coaching digest, with a per-call spotlight and a topic inspector as two independent, non-overlapping selection states.",
};

export default function Page() {
  return <ClearcallClient />;
}
