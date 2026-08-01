import type { Metadata } from "next";
import SceneClient from "./scene-client";

export const metadata: Metadata = {
  title: "KEPT — secondhand, matched by machine",
  description:
    "A scene page: one fixed WebGL2 particle layer carries the whole document, morphing from dust to orbits to a sneaker to the wordmark as you scroll.",
};

export default function Page() {
  return <SceneClient />;
}
