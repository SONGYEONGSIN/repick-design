import type { Metadata } from "next";
import SceneClient from "./scene-client";

export const metadata: Metadata = {
  title: "Reframe — resale intelligence for objects that already exist",
  description:
    "A scroll-driven particle scene: an iris diaphragm opens, disperses into orbit rings, resolves into a rangefinder camera and settles as a wordmark. Deterministic by construction — no clock, no random values, the same scroll position renders the same frame.",
};

export default function ReframeScenePage() {
  return <SceneClient />;
}
