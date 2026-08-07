import { FOCUS_RING, VALUES } from "./data";

/**
 * Third wired interaction: a native <details>/<summary> accordion, one row per value. The first
 * item ships with the `open` attribute so real body copy is visible before any click — the same
 * defensive default the People and Company-stats sections use, applied here to Values.
 */
export default function ValuesAccordion() {
  return (
    <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
      {VALUES.map((v, i) => (
        <li key={v.id} className="px-5">
          <details open={i === 0}>
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left ${FOCUS_RING}`}
            >
              <span className="text-base font-semibold text-zinc-900">{v.title}</span>
              <span aria-hidden="true" className="text-xl font-normal leading-none text-lime-800">
                +
              </span>
            </summary>
            <p className="max-w-2xl pb-5 text-sm font-normal leading-relaxed text-zinc-700">{v.body}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
