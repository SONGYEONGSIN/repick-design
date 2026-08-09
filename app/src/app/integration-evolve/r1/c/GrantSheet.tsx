'use client';

import { useMemo, useState } from 'react';
import { Ban, Check, ChevronDown, Copy, Eye, PenLine, ShieldCheck } from 'lucide-react';

import { features, neverRequested, scopes } from './data';

export default function GrantSheet() {
  const [granted, setGranted] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(scopes.map((s) => [s.id, s.defaultOn])),
  );
  const [openFields, setOpenFields] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const grantedCount = scopes.filter((s) => granted[s.id]).length;
  const darkFeatures = features.filter((f) => f.requires.some((r) => !granted[r]));

  const summary = useMemo(() => {
    const on = scopes.filter((s) => granted[s.id]);
    const off = scopes.filter((s) => !granted[s.id]);
    const lines: string[] = [
      'Tidemark / HubSpot — requested access, as configured on this page',
      '',
      `Granted (${on.length} of ${scopes.length}):`,
      ...on.map(
        (s) =>
          `  ${s.name} [${s.access}] kept ${s.retention}${s.adminApproval ? ' — Super Admin approval required' : ''}`,
      ),
    ];
    if (off.length > 0) {
      lines.push('', `Withheld (${off.length}):`);
      off.forEach((s) => {
        const lost = features.filter((f) => f.requires.includes(s.id)).map((f) => f.name);
        lines.push(`  ${s.name} — disables: ${lost.join(', ') || 'nothing'}`);
      });
    }
    lines.push('', `Never requested: ${neverRequested.map((n) => n.name).join(', ')}`);
    return lines.join('\n');
  }, [granted]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="grant-sheet"
      aria-labelledby="grant-heading"
      className="mx-auto max-w-6xl px-5 py-4 md:px-8"
    >
      <div className="flex flex-col gap-4 border-t border-zinc-200 pt-10 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h2
            id="grant-heading"
            className="font-[family-name:var(--font-display-wide)] text-2xl font-medium tracking-tight md:text-3xl"
          >
            The grant sheet
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Switch a scope off to see exactly which feature goes dark. Nothing else on the page
            moves — a withheld scope only costs you what it was carrying.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <p aria-live="polite" className="text-sm text-zinc-600">
            <span className="font-medium tabular-nums text-zinc-900">
              {grantedCount} of {scopes.length}
            </span>{' '}
            scopes requested ·{' '}
            <span className="font-medium tabular-nums text-zinc-900">{darkFeatures.length}</span>{' '}
            features off
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {copied ? (
              <Check className="h-4 w-4 text-teal-700" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            )}
            {copied ? 'Copied for review' : 'Copy for security review'}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div
          aria-hidden="true"
          className="hidden bg-zinc-50 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 md:grid md:grid-cols-[6rem_minmax(0,1.45fr)_7rem_minmax(0,1fr)_8.5rem] md:gap-4"
        >
          <span>Grant</span>
          <span>Scope and what it touches</span>
          <span>Direction</span>
          <span>What it powers</span>
          <span>Kept for</span>
        </div>

        <ul className="divide-y divide-zinc-200">
          {scopes.map((s) => {
            const on = granted[s.id];
            const bound = features.filter((f) => f.requires.includes(s.id));
            const fieldsOpen = openFields === s.id;
            return (
              <li
                key={s.id}
                className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[6rem_minmax(0,1.45fr)_7rem_minmax(0,1fr)_8.5rem] md:gap-4"
              >
                <div className="min-w-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`Grant ${s.name}`}
                    onClick={() => setGranted((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                    className={`relative flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                      on ? 'bg-teal-700' : 'bg-zinc-400'
                    }`}
                  >
                    <span
                      className={`ml-0.5 h-5 w-5 rounded-full bg-white transition-transform motion-reduce:transition-none ${
                        on ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`mt-1.5 block text-xs font-medium ${on ? 'text-teal-700' : 'text-zinc-600'}`}
                  >
                    {on ? 'Granted' : 'Withheld'}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-mono)] text-[13px] leading-5 break-words text-zinc-900">
                    {s.name}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-700">{s.label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{s.summary}</p>
                  <button
                    type="button"
                    aria-expanded={fieldsOpen}
                    aria-controls={`fields-${s.id}`}
                    onClick={() => setOpenFields(fieldsOpen ? null : s.id)}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -ml-1.5 text-[13px] font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    {fieldsOpen ? 'Hide' : 'Show'} the exact fields
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${
                        fieldsOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                  {fieldsOpen ? (
                    <ul id={`fields-${s.id}`} className="mt-2 flex flex-wrap gap-1.5">
                      {s.fields.map((f) => (
                        <li
                          key={f}
                          className="rounded-md bg-zinc-100 px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] text-zinc-700"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 md:hidden">
                    Direction
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
                      s.access === 'read' ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {s.access === 'read' ? (
                      <Eye className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    ) : (
                      <PenLine className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    )}
                    {s.access === 'read' ? 'Read' : 'Write'}
                  </span>
                  {s.adminApproval ? (
                    <span className="mt-2 flex items-center gap-1.5 text-[12px] leading-5 text-zinc-700">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      Super Admin approval
                    </span>
                  ) : (
                    <span className="mt-2 block text-[12px] leading-5 text-zinc-600">
                      Any HubSpot user
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 md:hidden">
                    What it powers
                  </span>
                  <ul className="flex flex-wrap gap-1.5">
                    {bound.map((f) => (
                      <li
                        key={f.id}
                        className={`rounded-md px-2 py-1 text-[12px] font-medium ${
                          on
                            ? 'bg-zinc-100 text-zinc-700'
                            : 'bg-zinc-100 text-zinc-600 line-through'
                        }`}
                      >
                        {f.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 md:hidden">
                    Kept for
                  </span>
                  <p className="text-sm font-medium tabular-nums text-zinc-900">{s.retention}</p>
                  <p className="mt-0.5 text-[12px] leading-5 text-zinc-600">{s.retentionNote}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700">
        What stays alive with the grants above
      </h3>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const missing = f.requires.filter((r) => !granted[r]);
          const live = missing.length === 0;
          return (
            <li
              key={f.id}
              className={`min-w-0 rounded-xl border p-4 transition-colors motion-reduce:transition-none ${
                live ? 'border-zinc-200 bg-white' : 'border-zinc-300 bg-zinc-100'
              }`}
            >
              <h4
                className={`text-sm font-semibold ${live ? 'text-zinc-900' : 'text-zinc-600 line-through'}`}
              >
                {f.name}
              </h4>
              <p className="mt-1.5 text-[13px] leading-5 text-zinc-600">{f.note}</p>
              {live ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-700">
                  <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Enabled
                </p>
              ) : (
                <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-5 font-medium text-zinc-700">
                  <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0 break-words">
                    Off — needs{' '}
                    {missing.map((m) => scopes.find((s) => s.id === m)?.name).join(' and ')}
                  </span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
