import { Mail, Rss } from "lucide-react";
import { CREATOR, PLATFORM_NAME } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-normal text-zinc-400">
          <span style={DISPLAY_FONT} className="font-semibold text-zinc-300">
            {CREATOR.newsletter}
          </span>{" "}
          &middot; published on {PLATFORM_NAME}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${CREATOR.email}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {CREATOR.email}
          </a>
          <a
            href="#latest-posts"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Rss className="h-4 w-4" aria-hidden="true" />
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
