import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

export function extractLinks(md) {
  return [...md.matchAll(LINK_RE)].map((m) => m[1]);
}

const stem = (p) => basename(p).replace(/\.md$/, '');
const isHome = (p) => basename(p).startsWith('🏠');

export function lintVault(files) {
  const paths = Object.keys(files);
  const stems = new Set(paths.map(stem));

  const broken = [];
  const inbound = new Set();
  for (const [path, content] of Object.entries(files)) {
    for (const target of extractLinks(content)) {
      const t = stem(target);
      if (!stems.has(t)) broken.push(`${path}: [[${target}]]`);
      else if (path !== 'index.md') inbound.add(t);
    }
  }

  const noteTargets = paths.filter(
    (p) => (p.startsWith('00-principles/') || p.startsWith('30-ledger/') || !p.includes('/')) &&
      p.endsWith('.md') && p !== 'index.md' && !isHome(p),
  );
  const orphans = noteTargets.filter((p) => !inbound.has(stem(p)));

  const indexContent = files['index.md'] ?? '';
  const indexed = new Set(extractLinks(indexContent).map(stem));
  const indexTargets = [
    ...noteTargets,
    ...paths.filter((p) => /^20-generations\/[^/]+\/DECISION\.md$/.test(p)),
    ...paths.filter((p) => p === '10-references/README.md'),
  ];
  const unindexed = indexTargets.filter((p) => !indexed.has(stem(p)));

  return { orphans, broken, unindexed };
}

function readVault(dir) {
  const files = {};
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.md')) files[full.slice(dir.length + 1)] = readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return files;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const result = lintVault(readVault('vault'));
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.orphans.length + result.broken.length + result.unindexed.length ? 1 : 0);
}
