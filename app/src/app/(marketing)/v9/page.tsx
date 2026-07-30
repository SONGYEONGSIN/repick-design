import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "Loupe — Nothing Escapes the Scan",
  description:
    "Loupe's AI annotates every garment it examines — fabric weave, stitching, brand tag, wear pattern, color match — pinned directly on the photo, with a running match score you can watch build in real time.",
};

export default function Page() {
  return <LandingClient />;
}
