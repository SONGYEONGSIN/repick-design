import type { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Renata Kessler — Solstice Macro | Meridian",
  description:
    "Renata Kessler publishes Solstice Macro on Meridian: an audited, systematic multi-asset track record shown live against the S&P 500 or a 341-strategy peer cohort, with monthly return detail and a sortable, filterable position book.",
};

export default function Page() {
  return <ProfileClient />;
}
