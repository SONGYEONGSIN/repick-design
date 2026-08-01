import type { Metadata } from "next";
import SceneClient from "./scene-client";

export const metadata: Metadata = {
  title: "Second — every object gets a second hand",
  description:
    "A scene-type specimen for Second, an AI matching market for pre-owned goods: one fixed WebGL2 particle field driven by document scroll through four states — dust, orbit, dial, wordmark.",
};

export default function SceneEvolveR1BPage() {
  return <SceneClient />;
}
