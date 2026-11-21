import { ACCENT_FILL, ACCENT_ON_FILL_TEXT, FOCUS_RING } from "./tokens";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <span className="text-lg font-extrabold tracking-[-0.02em] text-zinc-950">repick</span>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          <a
            href="#device"
            className={`inline-flex min-h-6 items-center rounded text-sm font-semibold text-zinc-600 hover:text-zinc-950 ${FOCUS_RING}`}
          >
            Try the device
          </a>
          <a
            href="#listings"
            className={`inline-flex min-h-6 items-center rounded text-sm font-semibold text-zinc-600 hover:text-zinc-950 ${FOCUS_RING}`}
          >
            Listings
          </a>
          <a
            href="#reviews"
            className={`inline-flex min-h-6 items-center rounded text-sm font-semibold text-zinc-600 hover:text-zinc-950 ${FOCUS_RING}`}
          >
            Reviews
          </a>
        </nav>
        <a
          href="#device"
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${ACCENT_FILL} ${ACCENT_ON_FILL_TEXT} ${FOCUS_RING}`}
        >
          See the grade
        </a>
      </div>
    </header>
  );
}
