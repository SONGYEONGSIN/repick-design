import { SETTINGS_TABS } from "./data";
import { ACCENT_SUBTLE, FOCUS_RING, TEXT_CAPTION, TRANSITION, cx } from "./tokens";

/**
 * Settings sub-navigation, scoped to the main content area — distinct from the global app
 * sidebar. Vertical tab list on lg+, horizontal scrollable strip on mobile. Only "Roles &
 * Permissions" is implemented in this build; the rest render as disabled with a "Soon" tag,
 * matching the global nav's convention for unimplemented sections.
 */
export default function SettingsNav() {
  return (
    <nav aria-label="Settings" className="lg:w-48 lg:shrink-0">
      <ul className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:thin] lg:flex-col lg:overflow-visible lg:pb-0">
        {SETTINGS_TABS.map((tab) => (
          <li key={tab.id} className="shrink-0 lg:shrink">
            {tab.disabled ? (
              <span
                aria-disabled="true"
                className={cx("flex min-h-11 cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium", TEXT_CAPTION)}
              >
                {tab.label}
                <span className={cx("rounded-full px-1.5 py-0.5 text-[10px] font-medium", "bg-zinc-100 dark:bg-zinc-800", TEXT_CAPTION)}>Soon</span>
              </span>
            ) : (
              <a
                href="#permission-matrix-heading"
                aria-current={tab.active ? "page" : undefined}
                className={cx(
                  "flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium",
                  TRANSITION,
                  FOCUS_RING,
                  tab.active ? cx(ACCENT_SUBTLE, "font-semibold") : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/5",
                )}
              >
                {tab.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
