// Static site chrome (skip link, header, footer) — no interactivity, no hooks, so it stays a
// server component. Kept separate from the interactive sections so `<main>` in page.tsx can wrap
// every primary-content section (hero, how-it-works, proof, closing CTA) while header/footer stay
// proper sibling landmarks around it, rather than one client bundle owning the whole page shell.

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5B4FC]";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${focusRing}`}
    >
      Skip to main content
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <a href="#top" className={`text-lg font-extrabold tracking-[-0.02em] text-white ${focusRing}`}>
          Cascade
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-sm font-normal text-zinc-400 md:flex">
          <a href="#stream" className={`transition hover:text-white ${focusRing}`}>
            Live feed
          </a>
          <a href="#how-it-works" className={`transition hover:text-white ${focusRing}`}>
            How it works
          </a>
          <a href="#proof" className={`transition hover:text-white ${focusRing}`}>
            Trust
          </a>
        </nav>
        <a
          href="#cta"
          className={`inline-flex h-10 items-center justify-center rounded-full bg-[#4F46E5] px-5 text-sm font-semibold text-white transition hover:bg-[#4338CA] ${focusRing}`}
        >
          Get started
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 py-12 lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-base font-extrabold tracking-[-0.02em] text-white">Cascade</p>
          <p className="mt-1 text-xs font-normal text-zinc-400">A live matching concept for repick.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-normal text-zinc-400">
          <a href="#stream" className={`transition hover:text-white ${focusRing}`}>
            Live feed
          </a>
          <a href="#how-it-works" className={`transition hover:text-white ${focusRing}`}>
            How it works
          </a>
          <a href="#proof" className={`transition hover:text-white ${focusRing}`}>
            Trust
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-[1400px] text-xs font-normal text-zinc-400">
        All listings, prices and match scores on this page are illustrative sample data.
      </p>
    </footer>
  );
}
