import { Plus } from "lucide-react";
import { FAQS } from "./data";

/** Native `<details>`/`<summary>` accordion — expand state, keyboard toggling, and screen-reader
 * semantics all come from the element itself, no JS required. */
export default function Faq() {
  return (
    <div className="flex flex-col gap-2.5">
      {FAQS.map((item) => (
        <details key={item.q} className="group rounded-xl border border-zinc-800 bg-zinc-900/60 open:bg-zinc-900">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 text-sm font-medium text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
            {item.q}
            <Plus className="h-4 w-4 flex-none text-zinc-400 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-4 text-sm font-normal leading-relaxed text-zinc-400">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
