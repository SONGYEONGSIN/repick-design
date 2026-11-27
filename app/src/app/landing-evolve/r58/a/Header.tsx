import { FOCUS_RING } from "./lib";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0b0b0f]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-extrabold tracking-[-0.02em] text-white">
          repick<span className="text-green-400">.</span>
        </span>
        <a
          href="#product-preview"
          className={`hidden rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-white sm:inline-flex ${FOCUS_RING}`}
        >
          See live matches
        </a>
      </div>
    </header>
  );
}
