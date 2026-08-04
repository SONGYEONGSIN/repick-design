import type { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Circuitloom Restorations — Seller Profile",
  description: "Certified-refurbished audio, keyboards and optics seller — reputation, active listings and buyer reviews.",
};

export default function Page() {
  return <ProfileClient />;
}
