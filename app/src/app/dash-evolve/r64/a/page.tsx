import type { Metadata } from "next";
import { WeirClient } from "./WeirClient";

export const metadata: Metadata = {
  title: "Weir — API keys",
  description:
    "Weir is an API gateway and rate-limit console. Its home view pairs a key rail with an hourly request-volume heatmap per endpoint, drawn as a generative SVG, with a pinned-key selection and a hover/keyboard crosshair inspector as two independent, non-overlapping selection states.",
};

export default function Page() {
  return <WeirClient />;
}
