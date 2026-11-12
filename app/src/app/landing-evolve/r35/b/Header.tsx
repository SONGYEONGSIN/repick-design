import { Swords } from "lucide-react";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 rounded-sm";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a
          href="#main-content"
          className={`flex items-center gap-2 text-lg font-extrabold tracking-[-0.02em] text-white ${FOCUS}`}
        >
          <Swords className="h-4 w-4 text-rose-500" aria-hidden="true" />
          repick
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <a href="#listings" className={`text-sm font-semibold text-zinc-300 hover:text-white ${FOCUS}`}>
            Shop
          </a>
          <a href="#scoring" className={`text-sm font-semibold text-zinc-300 hover:text-white ${FOCUS}`}>
            How scoring works
          </a>
          <a href="#proof" className={`text-sm font-semibold text-zinc-300 hover:text-white ${FOCUS}`}>
            Reviews
          </a>
        </nav>

        <a
          href="#listings"
          className={`rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-500 ${FOCUS}`}
        >
          Start comparing
        </a>
      </div>
    </header>
  );
}
