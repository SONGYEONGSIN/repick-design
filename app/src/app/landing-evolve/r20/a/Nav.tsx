const FOCUS_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A5C]";

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-[#FAFAF8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10 xl:px-16">
        <a href="#" className={`rounded text-[17px] font-bold tracking-[-0.02em] text-[#121214] ${FOCUS_LIGHT}`}>
          repick
        </a>
        <nav className="hidden items-center gap-8 sm:flex">
          <a href="#estimate-wizard" className={`rounded text-[14px] font-medium text-zinc-600 hover:text-[#121214] ${FOCUS_LIGHT}`}>
            How it works
          </a>
          <a href="#listings" className={`rounded text-[14px] font-medium text-zinc-600 hover:text-[#121214] ${FOCUS_LIGHT}`}>
            Browse listings
          </a>
        </nav>
        <a
          href="#estimate-wizard"
          className={`rounded-full border border-zinc-300 px-4 py-2 text-[14px] font-medium text-[#121214] hover:border-zinc-400 ${FOCUS_LIGHT}`}
        >
          Get started
        </a>
      </div>
    </header>
  );
}
