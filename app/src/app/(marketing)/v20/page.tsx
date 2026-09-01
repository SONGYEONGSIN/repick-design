import type { Metadata } from "next";

import AssayLanding from "./client";

export const metadata: Metadata = {
  title: "Assay — Every listing, verified before it's yours",
  description:
    "A sequential validation pipeline for secondhand marketplace listings. Toggle authenticity, condition, price fairness, and seller history and watch each pipeline step and the composite trust score recompute live.",
};

export default function Page() {
  return <AssayLanding />;
}
