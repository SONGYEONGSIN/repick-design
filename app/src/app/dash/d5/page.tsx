import type { Metadata } from "next";
import CalderaConsole from "./dashboard-client";

export const metadata: Metadata = {
  title: "CALDERA/OS — Volcanic Network Operations Console",
  description:
    "Real-time-style monitoring console for a global volcano observation network — seismicity, gas flux, thermal, deformation and ash dispersion.",
};

export default function Dashboard() {
  return <CalderaConsole />;
}
