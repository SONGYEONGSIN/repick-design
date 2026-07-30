import type { Metadata } from "next";
import LoginClient from "./ui";

export const metadata: Metadata = {
  title: "Contour — Sign in to your workspace",
  description:
    "Contour turns raw product telemetry into terrain you can read at a glance. Sign in or create a workspace to get started.",
};

export default function Page() {
  return <LoginClient />;
}
