import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const EXPO_URL = process.argv[2] || 'http://localhost:8091/';
const CHECK = process.argv[3] || 'AI 매칭 결과';
const b = await chromium.launch();
const p = await b.newPage();
// 갤러리 WorkCard와 동일 구조: iframe src=Expo Web URL
await p.setContent(`<iframe src="${EXPO_URL}" style="width:1440px;height:1100px;border:0" title="native preview"></iframe>`);
await p.waitForTimeout(2500);
const frame = p.frames().find((f) => f.url().startsWith(EXPO_URL));
const inner = frame ? await frame.evaluate(() => document.body.innerText) : '';
console.log('IFRAME_LOADED:', !!frame, '| RENDERS_HEADING:', inner.includes(CHECK));
await b.close();
process.exit(frame && inner.includes(CHECK) ? 0 : 1);
