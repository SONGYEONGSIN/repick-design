import { CONTAINER, FOCUS_LIGHT, INK } from "./theme";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 py-4">
      <div className={`${CONTAINER} flex items-center justify-between`}>
        <a href="#main" className={`rounded text-base font-semibold tracking-[-0.01em] ${FOCUS_LIGHT}`} style={{ color: INK }}>
          repick
        </a>
        <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:block">
          AI-graded resale
        </p>
      </div>
    </header>
  );
}
