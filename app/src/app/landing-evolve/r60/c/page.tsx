import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Flag what you're unsure about",
  description:
    "Six fixed, always-visible zone chips let a seller flag any combination of concerns on one photo, live-widening an estimated price range and growing a seller-or-buyer-framed disclosure ledger, never hiding a row.",
};

export default function Page() {
  return <Client />;
}
