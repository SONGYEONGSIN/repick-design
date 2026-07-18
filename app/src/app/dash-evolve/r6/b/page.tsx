import type { Metadata } from "next";
import PodiumClient from "./components/PodiumClient";

export const metadata: Metadata = {
  title: "Podium — Solstice Cloud Sales Leaderboard",
  description:
    "Podium is a gamified sales performance platform. This view ranks Solstice Cloud's sales reps by quota attainment with a period/team toggle and a per-rep detail drawer.",
};

export default function Page() {
  return <PodiumClient />;
}
