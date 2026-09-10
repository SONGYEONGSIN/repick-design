// One-off helper: screenshot a running Expo-web native screen at a given viewport width.
// Usage: node scripts/shot-native.mjs <url> <width> <height> <outPath>
import { chromium } from "playwright";

const [, , url, width, height, outPath] = process.argv;

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.screenshot({ path: outPath });
await browser.close();
console.log("saved " + outPath);
