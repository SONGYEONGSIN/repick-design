import { FileDown } from "lucide-react";
import { DOC_ITEMS, type Variant } from "./data";

/**
 * Documentation stays tied to the selected configuration — the dimensional drawing's title updates
 * with the variant rail, the same live-update the spec sheet and quick-spec strip get.
 */
export default function DocumentationList({ variant }: { variant: Variant }) {
  return (
    <ul role="list" className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {DOC_ITEMS.map((doc) => (
        <li key={doc.id} className="flex items-center gap-3 py-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <FileDown className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {doc.titleFor(variant.sku)}
            </span>
            <span className="block text-xs font-normal text-zinc-600 dark:text-zinc-400">
              {doc.fileType} · {doc.size}
            </span>
          </span>
          <button
            type="button"
            className="flex-none rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950"
          >
            Download
            <span className="sr-only"> {doc.titleFor(variant.sku)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
