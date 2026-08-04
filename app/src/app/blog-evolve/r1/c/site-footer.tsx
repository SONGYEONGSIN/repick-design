import { Aperture, Mail } from "lucide-react";
import { BRAND } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/**
 * Sibling of <main>, not nested inside it, so it keeps its implicit contentinfo landmark role.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
          <Aperture className="h-4 w-4 text-orange-700" aria-hidden="true" />
          {BRAND} &middot; Journal
        </p>
        <a
          href="mailto:journal@loupe.app"
          className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          journal@loupe.app
        </a>
        <p className="text-xs font-normal text-stone-600">&copy; 2026 Loupe, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
