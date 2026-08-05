import { Mail } from "lucide-react";
import { PROFILE, SCOPE_TYPES } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/**
 * Static reference material — methodology and coverage. Deliberately non-interactive: the log's own
 * toolbar (severity + protocol-type + sort) is the single place filtering happens, so this column
 * never doubles as a second, competing filter surface.
 */
export default function SidePanel() {
  return (
    <aside aria-labelledby="methodology-heading" className="min-w-0 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <h2 id="methodology-heading" className="text-sm font-semibold text-zinc-900">
          Methodology
        </h2>
        <ul className="mt-3 space-y-2.5">
          {PROFILE.methodology.map((line) => (
            <li key={line} className="flex gap-2 text-sm font-normal leading-relaxed text-zinc-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Coverage</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SCOPE_TYPES.map((scope) => (
            <span
              key={scope}
              className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs font-normal text-zinc-700"
            >
              {scope}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Get in touch</h2>
        <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
          Scoping calls are unpaid; the first pass on a fixed-price quote usually takes two business days.
        </p>
        <a
          href="mailto:imogen@keelandballast.example"
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 ${FOCUS}`}
        >
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
          Request an engagement
        </a>
      </div>
    </aside>
  );
}
