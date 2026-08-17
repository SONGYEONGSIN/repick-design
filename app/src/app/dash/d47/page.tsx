import type { Metadata } from "next";
import VelaClient from "./VelaClient";

export const metadata: Metadata = {
  title: "Vela — Experimentation Console",
  description:
    "Vela is a growth-experimentation console whose hero visualization is a lift-vs-control forecast chart with a shaded 95% confidence band, an actual/forecast toggle, and a keyboard-accessible crosshair — paired with a variant comparison view that states significant / not yet significant with color, icon, and text together.",
};

export default function Page() {
  return <VelaClient />;
}
