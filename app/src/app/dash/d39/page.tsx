import type { Metadata } from "next";
import PalisadeClient from "./PalisadeClient";

export const metadata: Metadata = {
  title: "Palisade — Roles & Permissions Console",
  description:
    "Palisade is a workspace access-control console built around a live role x permission matrix: five roles across nineteen grouped permissions, with searchable rows, a role-scoped audit trail, and full keyboard control.",
};

export default function Page() {
  return <PalisadeClient />;
}
