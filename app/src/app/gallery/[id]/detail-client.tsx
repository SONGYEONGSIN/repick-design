"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Work } from "@/lib/works";
import type { WorkSpec, Swatch } from "@/lib/specimen-specs";
import { STRINGS, DEFAULT_LANG, categoryLabel, type Lang } from "../gallery-i18n";
import { WorkCard } from "../work-card";

export default function DetailClient({ work, spec, similar }: { work: Work; spec: WorkSpec | null; similar: Work[] }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const saved = localStorage.getItem("specimen-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  function pickLang(l: Lang) { setLang(l); localStorage.setItem("specimen-lang", l); }
  const t = STRINGS[lang];
  const d = t.detail;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <nav className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <Link href="/gallery" className="hover:text-zinc-700">{d.home}</Link>
            <span className="px-1.5">/</span>
            <span className="text-zinc-600">{categoryLabel(work.category, lang)}</span>
          </nav>
          <div role="group" aria-label={t.langLabel} className="inline-flex shrink-0 rounded-lg border border-zinc-200 p-0.5">
            {(["en", "ko"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => pickLang(l)}
                className={`h-7 rounded-md px-2.5 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${lang === l ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{work.brand}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{work.desc[lang]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {spec && <SpecActions work={work} spec={spec} d={d} />}
            <a href={work.route} target="_blank" rel="noreferrer"
              className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
              {d.viewLive}
            </a>
          </div>
        </header>

        <HeroPreview work={work} />

        {spec ? (
          <RichSpec spec={spec} d={d} />
        ) : (
          <section className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
            <p className="text-sm font-bold text-zinc-700">{d.comingSoon}</p>
            <p className="mt-1.5 text-xs text-zinc-500">{d.comingSoonBody}</p>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-16 border-t border-zinc-200 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.moreLikeThis}</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((w) => <WorkCard key={w.id} work={w} lang={lang} label={categoryLabel(w.category, lang)} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function HeroPreview({ work }: { work: Work }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mt-8 h-[480px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />}
      {work.category === "mobile" ? (
        <iframe src={work.route} title={`${work.brand} preview`} tabIndex={-1} onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-1/2 top-1/2 origin-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "390px", height: "844px", transform: "translate(-50%, -50%) scale(0.55)", border: 0 }} />
      ) : (
        <iframe src={work.route} title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "2028px", transform: "scale(0.711)", border: 0 }} />
      )}
    </div>
  );
}

function CopyButton({ text, d }: { text: string; d: (typeof STRINGS)["en"]["detail"] }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}
      className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
      {done ? d.copied : d.copy}
    </button>
  );
}

/** Assemble the full design-system spec into a single DESIGN.md an AI agent can consume at once. */
function buildDesignMd(work: Work, spec: WorkSpec): string {
  const palette = spec.palette.map((s) => `- **${s.role}** \`${s.hex}\` (${s.token}) — ${s.usage}`).join("\n");
  const guidelines = spec.dosDonts.map((g) => `- ✅ Do: ${g.do}\n- ❌ Don't: ${g.dont}`).join("\n");
  return [
    `# ${work.brand} — Design System`,
    "",
    "## Overview",
    spec.philosophy,
    "",
    "## Color Palette",
    palette,
    "",
    "## Typography",
    spec.typography,
    "",
    "## Spacing & Shape",
    spec.spacing,
    "",
    "## Guidelines",
    guidelines,
    "",
    "## Agent Prompt",
    spec.agentPrompt,
    "",
  ].join("\n");
}

function SpecActions({ work, spec, d }: { work: Work; spec: WorkSpec; d: (typeof STRINGS)["en"]["detail"] }) {
  const [copied, setCopied] = useState(false);
  const md = buildDesignMd(work, spec);
  function copy() { navigator.clipboard?.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1400); }
  function download() {
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${work.id}-design.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <button type="button" onClick={copy}
        className="shrink-0 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
        {copied ? d.copied : d.copyDesignMd}
      </button>
      <button type="button" onClick={download}
        className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
        {d.downloadMd}
      </button>
    </>
  );
}

function RichSpec({ spec, d }: { spec: WorkSpec; d: (typeof STRINGS)["en"]["detail"] }) {
  return (
    <div className="mt-14 space-y-14">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.overview}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{spec.philosophy}</p>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.palette}</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.palette.map((s: Swatch) => (
            <li key={s.token} className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3">
              <span aria-hidden="true" className="mt-0.5 h-10 w-10 shrink-0 rounded-md border border-zinc-200" style={{ background: s.hex }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold">{s.role}</p>
                  <CopyButton text={s.hex} d={d} />
                </div>
                <p className="font-mono text-[11px] text-zinc-500">{s.hex} · {s.token}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{s.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.typography}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{spec.typography}</p>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.spacing}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{spec.spacing}</p>
        </section>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.guidelines}</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.dosDonts.map((g, i) => (
            <li key={i} className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm text-zinc-800"><span className="mr-2 font-bold text-emerald-600">{d.do}</span>{g.do}</p>
              <p className="mt-2 text-sm text-zinc-800"><span className="mr-2 font-bold text-rose-500">{d.dont}</span>{g.dont}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.agentPrompt}</h2>
          <CopyButton text={spec.agentPrompt} d={d} />
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-5 font-mono text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">{spec.agentPrompt}</pre>
      </section>
    </div>
  );
}
