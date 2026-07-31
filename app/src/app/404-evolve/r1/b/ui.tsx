"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, LifeBuoy, RefreshCw } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Illustration / generative-SVG archetype. The lattice is code-drawn,*/
/* not an imported asset — every coordinate is a deterministic        */
/* function of (index, pattern seed), so the same seed always repaints*/
/* the same lattice (no Math.random, no external image).              */
/* ------------------------------------------------------------------ */

const COLS = 6;
const ROWS = 6;
const SPACING = 34;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type Node = { id: number; x: number; y: number };

function buildNodes(seed: number): Node[] {
  const nodes: Node[] = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const i = r * COLS + c;
      const jitterX = round2(Math.sin(i * 0.9 + seed * 2.1) * 4);
      const jitterY = round2(Math.cos(i * 1.3 + seed * 1.7) * 4);
      nodes.push({ id: i, x: round2(c * SPACING + jitterX), y: round2(r * SPACING + jitterY) });
    }
  }
  return nodes;
}

type Edge = { id: string; from: Node; to: Node };

function buildEdges(nodes: Node[], seed: number): Edge[] {
  const edges: Edge[] = [];
  nodes.forEach((n, i) => {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    if (c < COLS - 1 && (i + seed * 3) % 7 !== 0) {
      edges.push({ id: `h-${i}`, from: n, to: nodes[i + 1] });
    }
    if (r < ROWS - 1 && (i + seed * 5) % 11 !== 0) {
      edges.push({ id: `v-${i}`, from: n, to: nodes[i + COLS] });
    }
  });
  return edges;
}

const PATTERN_SEEDS = [0, 1, 2];

const SECONDARY_LINKS = [
  { label: "Browse collections", href: "/", icon: BookOpen },
  { label: "Contact support", href: "mailto:support@kiln.app", icon: LifeBuoy },
];

export default function NotFoundClient() {
  const [seedIndex, setSeedIndex] = useState(0);
  const seed = PATTERN_SEEDS[seedIndex];
  const nodes = buildNodes(seed);
  const edges = buildEdges(nodes, seed);
  const missingIndex = (seed * 7 + 15) % nodes.length;
  const viewSize = (COLS - 1) * SPACING + 8;

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 text-neutral-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="text-sm font-semibold tracking-tight text-neutral-900">Kiln</span>
        <a
          href="/"
          className="text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 rounded"
        >
          Home
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-10 px-6 py-10 sm:px-10 md:grid-cols-2 md:gap-16">
        <div className="order-2 flex flex-col md:order-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            404
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            This piece isn&apos;t in any collection.
          </h1>
          <p className="mt-3 max-w-sm text-sm font-normal leading-relaxed text-neutral-600">
            The page you followed doesn&apos;t match anything Kiln has fired. It may have been
            archived or the link was mistyped.
          </p>

          <a
            href="/"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            Back to home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <nav aria-label="Alternative paths" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {SECONDARY_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 rounded"
              >
                <Icon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="order-1 flex flex-col items-center md:order-2">
          <div className="w-full max-w-xs rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <svg
              viewBox={`-4 -4 ${viewSize} ${viewSize}`}
              className="h-auto w-full motion-safe:transition-opacity motion-safe:duration-300"
              role="img"
              aria-label="Generative lattice illustration representing a broken connection"
            >
              {edges.map((edge) => (
                <line
                  key={edge.id}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke="#c2410c"
                  strokeOpacity={0.35}
                  strokeWidth={1.25}
                />
              ))}
              {nodes.map((node) => (
                <circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={node.id === missingIndex ? 4.5 : 2.25}
                  fill={node.id === missingIndex ? "#ea580c" : "#c2410c"}
                  fillOpacity={node.id === missingIndex ? 1 : 0.55}
                />
              ))}
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setSeedIndex((prev) => (prev + 1) % PATTERN_SEEDS.length)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-normal text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            Cycle pattern
          </button>
        </div>
      </main>
    </div>
  );
}
