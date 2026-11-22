import { Layers } from "lucide-react";

/**
 * Static wordmark only — no nav links. Kept under 48px tall on purpose: every pixel here is a
 * pixel the hero's headline + device + badges don't get at the 390px fold.
 */
export default function TopBar() {
  return (
    <header className="border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-10">
        <Layers aria-hidden="true" className="h-4 w-4 text-violet-300" />
        <span className="text-[13px] font-semibold tracking-[-0.02em] text-zinc-100">
          RELOOP
        </span>
      </div>
    </header>
  );
}
