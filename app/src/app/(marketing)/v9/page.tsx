import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Nothing Escapes the Scan",
  description:
    "repick's AI annotates every garment it examines — fabric weave, stitching, brand tag, wear pattern, color match — pinned directly on the photo, with a running match score you can watch build in real time.",
};

export default function Page() {
  return <LandingClient />;
}
