import type { Metadata } from "next";
import { ConsoleClient } from "./console-client";

export const metadata: Metadata = {
  title: "Holdfire — Launch Operations Console",
  description:
    "Holdfire is a launch control console for terminal countdown: T-timeline milestones, Go/No-Go station polling, propellant load, weather constraints, and hold history.",
};

export default function Page() {
  return <ConsoleClient />;
}
