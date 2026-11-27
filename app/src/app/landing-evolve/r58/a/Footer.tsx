export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0f] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 text-center">
        <p className="text-sm font-extrabold tracking-[-0.02em] text-white">
          repick<span className="text-green-400">.</span>
        </p>
        <p className="text-xs text-zinc-400">
          Demo pricing shown for illustration — not a live trade-in offer. © 2026 repick.
        </p>
      </div>
    </footer>
  );
}
