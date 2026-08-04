import type { Metadata } from "next";
import BlogClient from "./blog-client";
import { SiteFooter, SiteHeader } from "./site-chrome";

export const metadata: Metadata = {
  title: "Engineering Blog — Stackrail",
  description:
    "Architecture decisions, incident writeups, performance work and release notes from the engineers building Stackrail's workflow orchestration platform.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-900"
      >
        Skip to content
      </a>
      <SiteHeader />
      <BlogClient />
      <SiteFooter />
    </div>
  );
}
