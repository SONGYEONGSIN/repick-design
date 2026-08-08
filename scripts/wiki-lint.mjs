import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

export function extractLinks(md) {
  return [...md.matchAll(LINK_RE)].map((m) => m[1]);
}

const stem = (p) => basename(p).replace(/\.md$/, '');
const isHome = (p) => basename(p).startsWith('🏠');
// 20-generations는 라운드마다 basename이 겹치는 DECISION.md가, 40-commissions는 주문마다
// 겹치는 RECORD.md가 쌓이므로
// 상대경로(확장자 제외)로 식별한다. 그 외 카테고리는 고유 basename 전제로 stem 유지.
const key = (p) => (/^(20-generations|40-commissions)\//.test(p) ? p.replace(/\.md$/, '') : stem(p));

export function lintVault(rawFiles) {
  // 크로스플랫폼: readVault가 Windows에서 path.join으로 백슬래시 키를 만들 수 있으므로
  // forward-slash로 정규화한다 (startsWith('00-principles/')·includes('/') 검사가 빗나가지 않게).
  const files = Object.fromEntries(
    Object.entries(rawFiles).map(([p, c]) => [p.replaceAll('\\', '/'), c]),
  );
  const paths = Object.keys(files);
  const keys = new Set(paths.map(key));

  const broken = [];
  const inbound = new Set();
  for (const [path, content] of Object.entries(files)) {
    for (const target of extractLinks(content)) {
      const t = key(target);
      if (!keys.has(t)) broken.push(`${path}: [[${target}]]`);
      else if (path !== 'index.md') inbound.add(t);
    }
  }

  const noteTargets = paths.filter(
    (p) => (p.startsWith('00-principles/') || p.startsWith('30-ledger/') || !p.includes('/')) &&
      p.endsWith('.md') && p !== 'index.md' && !isHome(p),
  );
  const orphans = noteTargets.filter((p) => !inbound.has(stem(p)));

  const indexContent = files['index.md'] ?? '';
  const indexed = new Set(extractLinks(indexContent).map(key));
  const indexTargets = [
    ...noteTargets,
    ...paths.filter((p) => /^20-generations\/[^/]+\/DECISION\.md$/.test(p)),
    ...paths.filter((p) => p === '10-references/README.md'),
  ];
  const unindexed = indexTargets.filter((p) => !indexed.has(key(p)));

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
