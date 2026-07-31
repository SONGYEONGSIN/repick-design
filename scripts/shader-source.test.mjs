import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * GLSL sources live inside JS template literals, so a backtick anywhere in one — including in a
 * comment — closes the string and the file stops parsing. It has cost two build breaks; a regex is
 * cheaper than finding it again from a "Expected a semicolon" pointing at prose.
 */
export function shaderLiterals(src) {
  const out = [];
  const re = /const\s+(\w+)\s*=\s*`(#version[\s\S]*?)`;/g;
  let m;
  while ((m = re.exec(src))) out.push({ name: m[1], body: m[2] });
  return out;
}

test('shaderLiterals — #version 템플릿 리터럴을 추출한다', () => {
  const src = 'const VERT = `#version 300 es\nvoid main(){}`;\nconst X = 1;';
  const lits = shaderLiterals(src);
  assert.equal(lits.length, 1);
  assert.equal(lits[0].name, 'VERT');
});

test('셰이더 소스에 백틱이 없다 (템플릿 리터럴 조기 종료 방지)', () => {
  const src = readFileSync('app/src/app/motion-pilot/ParticleField.tsx', 'utf8');
  const lits = shaderLiterals(src);
  assert.ok(lits.length >= 2, `셰이더 리터럴을 찾지 못함 (${lits.length}개)`);
  for (const { name, body } of lits) {
    assert.ok(!body.includes('`'), `${name} 안에 백틱이 있다 — 템플릿 리터럴이 끊긴다`);
    assert.ok(!body.includes('${'), `${name} 안에 \${ 가 있다 — 의도치 않은 보간`);
  }
});
