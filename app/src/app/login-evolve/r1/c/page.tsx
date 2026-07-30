import type { Metadata } from "next";
import LoginClient from "./ui";

export const metadata: Metadata = {
  title: "Ledgerline — Sign in",
  description:
    "Ledgerline reconciles invoices, expenses, and tax set-asides for freelancers automatically. Sign in or create an account.",
};

export default function Page() {
  return <LoginClient />;
}
