// app/src/app/blog-evolve/r1/a/site-chrome.tsx
//
// Static site header and footer. Both sit outside `<main>` deliberately — the header owns no
// landmark conflict, and the footer must stay a sibling of `<main>` rather than nested inside it
// so it keeps its implicit `contentinfo` role (a documented recurring defect in this catalogue).
import Link from "next/link";
import { Compass, Rss, Mail, Globe } from "lucide-react";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F3A21] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF7F1]";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Customers", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#", current: true },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[#E6D9C4] bg-[#FBF7F1]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="#" className={`flex items-center gap-2 rounded-md ${FOCUS}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#AE4526] text-[#FBF7F1]">
            <Compass aria-hidden="true" strokeWidth={2} className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-bold text-[#221D18]" style={{ fontFamily: "var(--font-display-wide)" }}>
            Northbeam
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                link.current ? "text-[#AE4526]" : "text-[#5B4F41] hover:text-[#221D18]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#"
          className={`hidden shrink-0 rounded-lg bg-[#221D18] px-4 py-2 text-sm font-medium text-[#FBF7F1] transition-colors hover:bg-[#3A322A] sm:inline-block ${FOCUS}`}
        >
          Start free trial
        </Link>
      </div>
    </header>
  );
}

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: ["Attribution", "Pipeline reporting", "Integrations", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Customers", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Blog", "Guides", "API docs", "Status"],
  },
];

const SOCIAL_LINKS = [
  { label: "Northbeam blog RSS feed", icon: Rss },
  { label: "Email Northbeam", icon: Mail },
  { label: "Northbeam website", icon: Globe },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E6D9C4] bg-[#FBF7F1]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#AE4526] text-[#FBF7F1]">
                <Compass aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-[#221D18]" style={{ fontFamily: "var(--font-display-wide)" }}>
                Northbeam
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm font-normal text-[#5B4F41]">
              Attribution and pipeline analytics for B2B revenue teams. Northbeam turns marketing
              spend into a number finance will sign off on.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6D9C4] text-[#5B4F41] transition-colors hover:border-[#AE4526] hover:text-[#AE4526] ${FOCUS}`}
                >
                  <Icon aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="min-w-0">
              <h2 className="text-sm font-bold text-[#221D18]">{col.heading}</h2>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className={`rounded text-sm font-normal text-[#5B4F41] transition-colors hover:text-[#AE4526] ${FOCUS}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E6D9C4] pt-6 text-sm font-normal text-[#5B4F41] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Northbeam, Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className={`rounded hover:text-[#221D18] ${FOCUS}`}>
              Privacy
            </a>
            <a href="#" className={`rounded hover:text-[#221D18] ${FOCUS}`}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
