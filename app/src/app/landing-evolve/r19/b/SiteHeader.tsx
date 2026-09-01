import Link from "next/link";
import { ACCENT_SOLID, cx, DISPLAY_STYLE, FOCUS, TRANSITION } from "./tokens";

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-[#FAFAF8]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/catalog"
          style={DISPLAY_STYLE}
          className={cx("text-lg font-extrabold tracking-[-0.02em] text-zinc-900", FOCUS)}
        >
          repick
        </Link>
        <Link
          href="/catalog"
          className={cx("rounded-full px-4 py-2 text-xs font-semibold", ACCENT_SOLID, TRANSITION, FOCUS)}
        >
          Start selling
        </Link>
      </div>
    </header>
  );
}
