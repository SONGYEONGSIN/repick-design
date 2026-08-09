"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { FOCUS_RING, RETENTION_DAYS } from "./data";

type Props = {
  host: string;
  version: string;
  sync: boolean;
  parts: number;
  fileName: string;
};

/**
 * Clause 6 in executable form: the request the reader would actually send, assembled from the same
 * inputs every clause above resolved against.
 *
 * The snippet is not a generic sample. Region picks the host, the pinned version writes the header,
 * the document profile decides whether the synchronous endpoint is even available, and a document
 * over the hard caps adds the `part_index` field the caller now has to manage. So the last thing on
 * the page is the first thing the reader will run, and it already carries every limit above.
 */
export default function FirstCall({ host, version, sync, parts, fileName }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const lines = [
    `curl -X POST https://${host}/v1/documents \\`,
    `  -H "Authorization: Bearer $TESSERA_KEY" \\`,
    `  -H "Tessera-Version: ${version}" \\`,
    `  -H "Idempotency-Key: 2026-08-10-000412" \\`,
    `  -F "mode=${sync ? "sync" : "async"}" \\`,
    ...(sync ? [] : [`  -F "webhook=https://acme.example/hooks/tessera" \\`]),
    ...(parts > 1 ? [`  -F "part_index=0" -F "part_count=${parts}" \\`] : []),
    `  -F "file=@${fileName}"`,
  ];
  const snippet = lines.join("\n");

  const response = sync
    ? [
        "200 OK",
        "{",
        '  "job_id": "job_2f8c1a",',
        '  "status": "extracted",',
        '  "pages": 2,',
        '  "billed_units": 2,',
        '  "line_items": [ /* … */ ]',
        "}",
      ].join("\n")
    : [
        "202 Accepted",
        "{",
        '  "job_id": "job_2f8c1a",',
        '  "status": "queued",',
        `  "part_count": ${parts},`,
        '  "queued_ms": 0,',
        `  "expires_at": "2026-09-09"`,
        "}",
      ].join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-w-0">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="text-sm font-semibold text-zinc-900">The request</h3>
            <button
              type="button"
              onClick={() => void copy()}
              className={`inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-colors duration-150 hover:border-teal-700 hover:text-teal-800 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              {copied ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none text-teal-700" />
              ) : (
                <Copy aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
              )}
              Copy request
            </button>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs font-normal leading-relaxed text-zinc-100">
            <code className="font-mono">{snippet}</code>
          </pre>
          <p role="status" className="mt-2 h-4 text-xs font-normal text-teal-800">
            {copied ? "Request copied to the clipboard." : ""}
          </p>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900">What comes back</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-300 bg-white p-4 text-xs font-normal leading-relaxed text-zinc-800">
            <code className="font-mono">{response}</code>
          </pre>
          <ul className="mt-4 space-y-2 text-sm font-normal leading-relaxed text-zinc-700">
            <li className="min-w-0">
              Assert on <span className="font-mono text-zinc-900">job_id</span>, never on field
              order. Field order follows the document, not the schema.
            </li>
            <li className="min-w-0">
              {sync
                ? "Synchronous responses hold the connection for the whole extraction. Set a client timeout above the p99 in clause 3, not below it."
                : "The webhook is the only delivery. Poll GET /v1/jobs/{id} if you must, but a poll that beats the webhook is a poll that is costing you rate limit."}
            </li>
            <li className="min-w-0">
              Extractions are deleted {RETENTION_DAYS} days after the job completes. Persist what you
              need on receipt; there is no archive to fall back to.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
