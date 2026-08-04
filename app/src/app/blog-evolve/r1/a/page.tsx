import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "./site-chrome";
import FeaturedPost from "./featured-post";
import BlogExplorer from "./blog-explorer";
import { FEATURED_POST } from "./data";

export const metadata: Metadata = {
  title: "Northbeam Blog — Notes on attribution and pipeline analytics",
  description:
    "Field notes from the team building Northbeam: attribution modeling, pipeline engineering, and the data teams shipping both.",
};

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" };

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FBF7F1]">
      <SiteHeader />

      <main>
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-9 sm:px-8 sm:pt-14 sm:pb-12">
          <p className="text-sm font-medium tracking-wide text-[#AE4526] uppercase">Northbeam Blog</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold text-balance text-[#221D18] sm:text-5xl" style={DISPLAY_FONT}>
            Notes on attribution, pipeline math, and the teams shipping both.
          </h1>
          <p className="mt-4 max-w-xl text-base font-normal text-pretty text-[#5B4F41]">
            Field notes from the people building Northbeam — product decisions, engineering
            postmortems, and the occasional retention curve that turned out to be lying.
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <FeaturedPost post={FEATURED_POST} />
          <BlogExplorer />
        </div>

        <div className="h-16 sm:h-20" aria-hidden="true" />
      </main>

      <SiteFooter />
    </div>
  );
}
