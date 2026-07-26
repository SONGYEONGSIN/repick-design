import type { Metadata } from "next";
import SourcemarkClient from "./SourcemarkClient";

export const metadata: Metadata = {
  title: "Sourcemark — Supplier Sourcing & Comparison Console",
  description:
    "Sourcemark is a B2B supplier-sourcing console built as a faceted search-and-compare workspace: a facet-filter panel for category, region, price band, rating and capability tags, a card grid of supplier listings with sort and grid/list view, and a slide-in compare tray for side-by-side evaluation of up to four suppliers.",
};

export default function Page() {
  return <SourcemarkClient />;
}
