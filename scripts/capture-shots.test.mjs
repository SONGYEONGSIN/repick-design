import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs, shotName, classifyFrame, scrollPlan } from "./capture-shots.mjs";

test("parseArgs reads route, name, widths and scroll fractions", () => {
  const o = parseArgs(["--route", "/catalog-evolve/r1/a", "--name", "a", "--out", "shots",
    "--widths", "1280", "390", "--scrolls", "0", "0.5", "1"]);
  assert.equal(o.route, "/catalog-evolve/r1/a");
  assert.equal(o.name, "a");
  assert.equal(o.out, "shots");
  assert.deepEqual(o.widths, [1280, 390]);
  assert.deepEqual(o.scrolls, [0, 0.5, 1]);
  assert.equal(o.base, "http://localhost:3100");
});

test("parseArgs defaults keep the existing 4-width contract", () => {
  const o = parseArgs(["--route", "/x", "--name", "a", "--out", "s"]);
  assert.deepEqual(o.widths, [1280, 1440, 1920, 390]);
  assert.deepEqual(o.scrolls, [0, 0.35, 0.7, 1]);
});

test("shotName keeps scroll-0 filenames backward compatible", () => {
  // Existing rounds reference `<v>-<w>.png`; the top-of-page frame must keep that exact name.
  assert.equal(shotName("a", 1440, 0, 0), "a-1440.png");
  assert.equal(shotName("c", 390, 0, 0), "c-390.png");
});

test("shotName suffixes only the additional scroll frames", () => {
  assert.equal(shotName("a", 1440, 0.35, 1), "a-1440-s35.png");
  assert.equal(shotName("a", 1440, 0.7, 2), "a-1440-s70.png");
  assert.equal(shotName("b", 1280, 1, 3), "b-1280-s100.png");
});

test("classifyFrame flags a frame whose pixels are essentially one colour", () => {
  // The trap this exists for: a candidate that renders nothing still passes every hard gate.
  assert.equal(classifyFrame({ distinct: 1, nonBgRatio: 0 }).blank, true);
  assert.equal(classifyFrame({ distinct: 3, nonBgRatio: 0.001 }).blank, true);
});

test("classifyFrame passes a frame with real content", () => {
  const v = classifyFrame({ distinct: 240, nonBgRatio: 0.34 });
  assert.equal(v.blank, false);
});

test("scrollPlan converts fractions into pixel offsets for a given page height", () => {
  assert.deepEqual(scrollPlan([0, 0.5, 1], 3000, 1000), [0, 1000, 2000]);
  // A page shorter than the viewport has nowhere to scroll — every frame is the top frame.
  assert.deepEqual(scrollPlan([0, 0.5, 1], 800, 1000), [0, 0, 0]);
});
