import type { Metadata } from "next";
import SiteHeader from "./site-header";
import Masthead from "./masthead";
import Timeline from "./timeline";
import MostRead from "./most-read";
import NewsletterForm from "./newsletter-form";
import SiteFooter from "./site-footer";

export const metadata: Metadata = {
  title: "The Loupe Journal — notes on visual craft",
  description:
    "Field notes on creative review, remote critique, and the small habits that keep a distributed team shipping work everyone is proud of.",
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-stone-50">
        <Masthead />
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="lg:flex lg:items-start lg:gap-12">
            <div className="min-w-0 lg:flex-1">
              <Timeline />
            </div>
            <aside
              aria-label="Most read and newsletter signup"
              className="mt-14 min-w-0 space-y-6 lg:sticky lg:top-24 lg:mt-0 lg:w-[340px] lg:shrink-0 lg:self-start"
            >
              <MostRead />
              <NewsletterForm />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
