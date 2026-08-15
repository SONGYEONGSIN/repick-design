"use client";

import { useEffect, useRef } from "react";
import {
  RIM_SHARE,
  ambientDrift,
  dustVortex,
  orbitalField,
  scatter,
  sneaker,
  wordmark,
  type Vec3,
} from "./shapes";

/**
 * KEPT — the scene. One fixed WebGL2 layer for the whole document, holding four silhouette states
 * and interpolating continuously between them as the page scrolls.
 *
 *   dust vortex  →  orbital rings  →  sneaker  →  the wordmark
 *
 * The handoff between states is a *swirl*, not an explosion: inside a transition every particle
 * rotates about the axis by an amount that falls off with radius, so the form unwinds into the next
 * one. Radial bursts throw the cloud apart and reassemble it; this keeps the mass coherent and makes
 * the four states read as one object changing its mind.
 *
 * Determinism contract (brief-scene §2):
 * - Scatter comes from an inline seeded PRNG (mulberry32). No `Math.random` anywhere.
 * - Exactly one clock — `uIdle`. It is zero when `__SPECIMEN_FREEZE__` is set, zero under
 *   `prefers-reduced-motion`, and the rAF loop stops entirely in either case rather than repainting
 *   a still frame at 60fps.
 * - The entry bloom is a *mount transition*, not a running term: frozen, it starts and stays at 1,
 *   so a captured frame is identical to what it would be if the bloom did not exist.
 * - Everything else is a pure function of scroll offset and pointer position.
 *
 * Decorative: `aria-hidden`, never takes pointer events, and the page reads identically without it.
 * If WebGL2 is unavailable the effect returns and leaves an empty transparent layer.
 */

/**
 * Particle budget, split by input type.
 *
 * The vertex shader runs once per particle per frame, so the count *is* this page's dominant cost —
 * clamping `devicePixelRatio` does nothing about it. Phones were drawing all 18k into a 390px
 * viewport, where the same count reads **denser** than on desktop because the frame is a fraction of
 * the area. Cutting it is not a downgrade; it holds the apparent density roughly constant.
 *
 * The branch reads `pointer: coarse`, not a width breakpoint: a narrow desktop window still has a
 * real GPU, and reading width would drop the count on every resize.
 *
 * The mobile figure is the canon's measured one (`brief-scene` §5-2, from `/motion-pilot`) rather
 * than a ratio of the desktop budget — the target is set by the 390px viewport both pages draw into,
 * not by whatever this page happens to spend on desktop.
 */
const COUNT = 18000;
const MOBILE_COUNT = 11000;
/**
 * Share of the field that never joins a silhouette. brief-scene measures the reference at ~3.5%;
 * the value is nudged up because this scene's states are sparser than the reference's, and the
 * ambient layer is the only thing populating the frame mid-transition. It is still low enough that
 * the manifesto copy is never sitting on texture — the failure mode at 16% was a covered page.
 */
const AMBIENT_SHARE = 0.055;

/**
 * Two palettes, split by where a particle sits in the form, then blended by a continuous depth ramp
 * rather than a switch. A binary rim/core split paints a neon outline around the shape; the ramp
 * makes the boundary read as a dense edge of the same material.
 *
 * Teal-cyan on near-black. Entries repeat to encode weight, so a uniform draw reproduces the mix:
 * the rim runs chromatic (this is where the colour of the page lives) while the core stays mostly
 * achromatic, which is what stops overlapping particles from washing every silhouette to white.
 */
const RIM_PALETTE: [number, number, number][] = [
  [0.17, 0.95, 0.85],
  [0.17, 0.95, 0.85],
  [0.1, 0.86, 0.82],
  [0.1, 0.86, 0.82],
  [0.28, 1.0, 0.8],
  [0.4, 1.0, 0.93],
  [0.55, 1.0, 0.97],
  [0.06, 0.72, 0.88],
  [0.06, 0.72, 0.88],
  [0.2, 0.6, 1.0],
  [0.62, 1.0, 0.74],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [0.85, 0.98, 1.0],
];

const CORE_PALETTE: [number, number, number][] = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [0.94, 0.97, 0.97],
  [0.94, 0.97, 0.97],
  [0.88, 0.93, 0.93],
  [0.88, 0.93, 0.93],
  [0.8, 0.87, 0.88],
  [0.72, 0.82, 0.83],
  [0.45, 0.78, 0.76],
  [0.3, 0.66, 0.7],
  [0.55, 0.9, 0.86],
  [0.62, 0.72, 0.8],
];

/** mulberry32 — a seeded PRNG written out here so the field owns its own randomness. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VERT = `#version 300 es
in vec3 aA; in vec3 aB; in vec3 aC; in vec3 aD; in vec3 aColor; in float aSeed; in float aRim; in float aAmb;
uniform float uMorph;    // 0..3 — dust → orbit → sneaker → wordmark, driven by document scroll
uniform vec2  uPointer;  // cursor in clip space, aspect-corrected; (9,9) means absent
uniform float uAspect;
uniform float uSpin;
uniform vec2  uDrift;    // where the mass is parked this scroll frame
uniform float uScale;    // POSITION scale only
uniform float uSize;     // POINT SIZE scale only — deliberately a separate uniform
uniform float uIdle;     // the one clock; pinned to 0 under capture and reduced motion
uniform vec2  uOrbit;    // whole-body yaw/pitch from the cursor; (0,0) with no pointer
uniform float uGather;   // 0 = knot at centre on mount, 1 = settled; pinned to 1 under capture
out vec3 vColor; out float vSeed; out float vDepth; out float vHot; out float vBand; out float vAmb; out float vEnter; out float vDim;

void main() {
  // Per-particle lag so the cloud reorganises in waves instead of sliding as one body. Kept short:
  // four states means each transition owns a third of the scroll, and a lag wider than that leaves
  // particles straddling two segments — the field then never settles into any silhouette.
  float LAG = 0.11;
  float lag = aSeed * LAG;
  float SPAN = 3.0;
  float m = clamp((uMorph - lag) / (SPAN - LAG) * SPAN, 0.0, SPAN);
  float i0 = floor(min(m, SPAN - 1.0));
  float seg = m - i0;
  vec3 s0 = i0 < 0.5 ? aA : (i0 < 1.5 ? aB : aC);
  vec3 s1 = i0 < 0.5 ? aB : (i0 < 1.5 ? aC : aD);
  vec3 p = mix(s0, s1, smoothstep(0.0, 1.0, seg));

  // Swirl handoff. sw peaks in the middle of a transition and is exactly zero at both ends, so every
  // state settles unrotated. The angle falls off with radius, so the core turns further than the
  // rim: the silhouette winds up, unwinds into the next one, and never has to fly apart to get there.
  //
  // Squared, and that is not cosmetic. A plain sine is already at 0.31 one tenth of the way into a
  // transition, which — multiplied through the radial falloff — was rotating the middle of the shoe
  // by 50 degrees at the scroll position where the shoe is supposed to be *parked*. The silhouette
  // never looked settled anywhere. Squaring flattens the ends and leaves the peak where it was.
  float sw = sin(seg * 3.14159265);
  sw = sw * sw * (1.0 - aAmb);
  float rad = length(p.xy);
  float ang = sw * (0.7 + aSeed * 0.85) * (0.35 + 1.0 / (1.0 + rad * rad * 1.35));
  float cs = cos(ang), sn = sin(ang);
  p.xy = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);
  // A little breath outward with it, so the swirl opens rather than grinding in place.
  p *= 1.0 + sw * sw * (0.04 + aSeed * 0.2);

  // Entry: the field arrives as a small dim knot at dead centre and blooms outward into place, with
  // a per-particle stagger so it opens as a cloud rather than a rigid body. Squeezing 18k points
  // into a fraction of the radius packs them far denser, and additive blending saturates long before
  // that reads as texture — so point size and alpha fall off with the compression too (see below).
  float g = clamp((uGather - aSeed * 0.25) / 0.75, 0.0, 1.0);
  g = g * g * (3.0 - 2.0 * g);
  p *= mix(0.22, 1.0, g);

  // Ambient particles hold their own scattered home in every buffer, so morph, swirl, spin and orbit
  // all pass them by and the frame stays lightly populated at every scroll position.
  p = mix(p, aA, aAmb);

  // The one clock. Amplitude small enough that a settled silhouette still reads as itself; large
  // enough that a page nobody is touching is visibly alive. Zeroed at the uniform, so sin(0) = 0
  // removes every appearance of it at once.
  float ph = aSeed * 47.0;
  p += vec3(sin(uIdle * 0.51 + ph), cos(uIdle * 0.44 + ph * 1.27), sin(uIdle * 0.37 + ph * 0.63)) * 0.028;

  // Yaw carries the scroll spin and the cursor orbit; pitch is cursor-only. Turning the whole body
  // is what makes the mass read as one object you are moving around, which a local lens never does.
  float yaw = uSpin + uOrbit.x;
  float cy = cos(yaw), sy = sin(yaw);
  vec3 r1 = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cp = cos(uOrbit.y), sp = sin(uOrbit.y);
  vec3 r2 = vec3(r1.x, r1.y * cp - r1.z * sp, r1.y * sp + r1.z * cp);
  p = mix(r2, p, aAmb);
  vDepth = p.z;

  // Position scale — ambient sits at its own, so it stays spread over the frame while the sculpture
  // swings across it. Point size does NOT read this uniform: sharing one term between position and
  // size means correcting one silently breaks the other.
  float sc = mix(uScale, 1.0, aAmb);
  vec2 dr = mix(uDrift * g, vec2(0.0), aAmb);
  float persp = 1.0 / (2.15 - p.z * 0.55);
  vec2 clip = vec2(p.x * persp / uAspect * sc + dr.x, p.y * persp * sc + dr.y);

  // Ambient parallax: the background slides against the pointer, each shape by its own depth, so it
  // reads as layers rather than one sheet. Pure function of pointer position — zero when absent.
  if (uPointer.x < 8.0) {
    float depthLayer = 0.32 + aSeed * 0.68;
    clip -= uPointer * 0.055 * depthLayer * aAmb;
  }

  // Cursor lens on the sculpture only. Points scale outward from the cursor and brighten, so the
  // form opens where you hover. No easing timer: it stops the instant the cursor does, and with no
  // pointer on the page it contributes nothing at all.
  float hot = 0.0;
  if (uPointer.x < 8.0 && aAmb < 0.5) {
    vec2 d = clip - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    float R = 0.4;
    if (dist < R) {
      hot = 1.0 - dist / R;
      float zoom = 1.0 + hot * hot * 0.7;
      d *= zoom;
      d.x /= uAspect;
      clip = uPointer + d;
    }
  }
  vHot = hot;

  gl_Position = vec4(clip, 0.0, 1.0);

  // Heavy-tailed size for the sculpture: seed^4 leaves most particles near-dust and a few large,
  // which is what gives the field depth instead of a uniform mist.
  float sizeSeed = aSeed * aSeed * aSeed * aSeed;
  // The ambient layer gets a *linear* curve instead. Sharing the sculpture's tail turns the
  // background into dust plus a handful of outliers; a near-linear spread is what reads as a
  // scattering of distinct shapes. The knob for "more variety" is density, not the exponent.
  float ambSize = 0.03 + aSeed * 0.15;
  float sSeed = mix(sizeSeed, ambSize, aAmb);

  // Openness: large particles overlapping inside a closed form saturate under additive blending and
  // melt the outline into a white slab — and the outline is the entire reason the last two states
  // exist. So the field goes fine grained as it closes.
  //
  // The curve peaks at the *orbital* state rather than at scroll 0. A flat (2 - m) made the opening
  // dust as coarse as the orbits, and at that size the hero read as bokeh laid over the headline
  // instead of dust behind it. Rising into the orbits and falling into the silhouette also gives the
  // scroll a shape: it opens out, then it resolves.
  float openness = clamp(min(0.34 + m * 0.66, 2.0 - m) + sw * 0.22, 0.0, 1.0);
  float grain = mix(0.18, 1.0, openness);
  // The aRim^2 term is a *floor*, not a multiplier: without it the boundary shell inherits the same
  // heavy tail as everything else, most of its particles land sub-pixel, and the outline the whole
  // rasterising exercise exists to produce comes out as a soft edge on a cloud. Giving the rim a
  // minimum size draws it as a continuous line and leaves the tail to do depth everywhere else.
  float ptSize = (0.85 + aRim * aRim * 1.9 + sSeed * 44.0 * mix(grain, 1.0, aAmb) * (0.4 + aRim * 1.3))
               * (0.55 + persp * 0.95) * (1.0 + hot * 1.5) * uSize;
  ptSize *= mix(0.45, 1.0, g);
  gl_PointSize = ptSize;
  // Stroke width in sprite space, inverse to point size — large particles stay hairline rings while
  // small ones fill in as dots, from one formula.
  //
  // And it widens as the field closes, which is the single change that made the shoe legible. Rings
  // are the right primitive for dust and orbits: hollow, weightless, each one its own shape. They
  // are the wrong one for a silhouette — a few thousand overlapping circles read as foam, and the
  // outline drowns in its own texture. Closed, the same sprite fills in and the form becomes matter.
  vBand = clamp(2.4 / max(ptSize, 2.0) * mix(1.0, 2.8, 1.0 - openness), 0.07, 1.45);
  // Interior particles are dust *behind* the shell, not part of it. Grading their light down as well
  // as their size is what keeps the thick part of a form (a heel, the junction of a K) from
  // accumulating into a lozenge — the boundary carries the shape, the core only suggests volume.
  vDim = mix(mix(0.5, 1.0, aRim), 0.9, aAmb);
  vColor = aColor; vSeed = aSeed; vAmb = aAmb; vEnter = g;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor; in float vSeed; in float vDepth; in float vHot; in float vBand; in float vAmb; in float vEnter; in float vDim;
out vec4 outColor;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r = length(q);
  if (r > 1.0) discard;
  // One primitive, two readings: a ring of width vBand at radius 0.78. When the point is small the
  // band is wide enough to swallow the whole sprite and it renders as a soft dot; when it is large
  // the band is a thin circle. The field is dust up close and orbits at distance.
  float d = abs(r - 0.78);
  float shape = 1.0 - smoothstep(vBand * 0.35, vBand, d);
  // A nucleus on roughly a sixth of the particles — the glints that keep a teal field from reading
  // as flat mist.
  shape += (1.0 - smoothstep(0.0, 0.3, r)) * step(0.84, vSeed) * 0.75;
  if (shape < 0.02) discard;
  float depthFade = clamp(0.62 + vDepth * 0.55, 0.2, 1.0);
  vec3 c = mix(vColor, vec3(1.0), vHot * 0.5);
  // Held below full: the mass runs under body copy, and a slightly translucent field lets the text
  // carry. Ambient shapes are far-off texture, at under half the light.
  outColor = vec4(c, shape * depthFade * vDim * (0.95 + vHot * 0.6) * mix(1.0, 0.5, vAmb) * mix(0.05, 1.0, vEnter * vEnter));
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function flatten(list: Vec3[], count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const v = list[i % Math.max(1, list.length)] ?? [0, 0, 0];
    out.set(v, i * 3);
  }
  return out;
}

/** Smooth interpolation across a per-stage table — each stage is genuinely parked, not swept past. */
function stageValue(table: number[], p: number): number {
  const last = table.length - 1;
  const raw = Math.min(last, Math.max(0, p)) * last;
  const i = Math.min(last - 1, Math.floor(raw));
  const t = Math.min(1, Math.max(0, raw - i));
  return table[i] + (table[i + 1] - table[i]) * (t * t * (3 - 2 * t));
}

export default function SceneField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "high-performance" });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // 초기화 시 한 번만 결정한다 — 아래 버퍼가 전부 이 수로 만들어지므로, 리사이즈로 바뀌면
    // drawArrays 범위와 어긋난다 (brief-scene §5-2).
    const N = window.matchMedia("(pointer: coarse)").matches ? MOBILE_COUNT : COUNT;

    const rand = mulberry32(20260801);
    const fallback = () => scatter(N, rand);
    const dust = dustVortex(N, rand);
    const rings = orbitalField(N, rand);
    const shoe = sneaker(N, rand);
    const mark = wordmark("KEPT", N, rand);
    const A = flatten(dust, N);
    const B = flatten(rings, N);
    const C = flatten(shoe.length ? shoe : fallback(), N);
    const D = flatten(mark.length ? mark : fallback(), N);

    // The trailing slice keeps a wide scatter home in all four buffers, so it is untouched by the
    // morph and the frame is never empty between states.
    const drift = ambientDrift(N, rand);
    const ambStart = Math.round(N * (1 - AMBIENT_SHARE));
    const amb = new Float32Array(N);
    for (let i = ambStart; i < N; i++) {
      amb[i] = 1;
      const home = drift[i];
      for (const buf of [A, B, C, D]) buf.set(home, i * 3);
    }

    const col = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    const rim = new Float32Array(N);
    // sampleRaster emits its boundary shell first, so the same leading indices are rim points in
    // every rasterised state — which is what lets colour and size be baked once without breaking the
    // particle-to-particle correspondence the morph relies on.
    const rimSpan = N * RIM_SHARE;
    for (let i = 0; i < N; i++) {
      const t = Math.pow(Math.max(0, 1 - i / rimSpan), 0.7);
      const pal = rand() < t ? RIM_PALETTE : CORE_PALETTE;
      col.set(pal[Math.floor(rand() * pal.length)], i * 3);
      seed[i] = rand();
      rim[i] = t;
    }

    function bind(name: string, data: Float32Array, size: number) {
      const buf = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
      const loc = gl!.getAttribLocation(prog, name);
      if (loc < 0) return;
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
    }
    bind("aA", A, 3);
    bind("aB", B, 3);
    bind("aC", C, 3);
    bind("aD", D, 3);
    bind("aColor", col, 3);
    bind("aSeed", seed, 1);
    bind("aRim", rim, 1);
    bind("aAmb", amb, 1);

    const uMorph = gl.getUniformLocation(prog, "uMorph");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uAspect = gl.getUniformLocation(prog, "uAspect");
    const uSpin = gl.getUniformLocation(prog, "uSpin");
    const uDrift = gl.getUniformLocation(prog, "uDrift");
    const uScale = gl.getUniformLocation(prog, "uScale");
    const uSize = gl.getUniformLocation(prog, "uSize");
    const uIdle = gl.getUniformLocation(prog, "uIdle");
    const uOrbit = gl.getUniformLocation(prog, "uOrbit");
    const uGather = gl.getUniformLocation(prog, "uGather");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ABSENT: [number, number] = [9, 9];
    let pointer: [number, number] = ABSENT;
    let frame = 0;
    /** The capture pipeline pins the clock; reduced motion pins it for the reason a user asked. */
    const frozen = () =>
      reduce.matches || Boolean((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__);
    let idleStart = 0;
    let mountTs = 0;
    // No loading curtain on this page, so the bloom only has to clear first paint. Total 1.55s,
    // comfortably inside the capture pipeline's ~2.9s wait — and irrelevant under freeze, where it
    // is already finished on frame one.
    const GATHER_DELAY = 0.35;
    const GATHER_SPAN = 1.2;

    function draw(ts?: number) {
      frame = 0;
      const el = ref.current;
      if (!el || !gl) return;
      const still = frozen();
      if (still) idleStart = 0;
      else if (!idleStart && ts) idleStart = ts;
      const idle = still || !ts ? 0 : (ts - idleStart) / 1000;
      if (!mountTs && ts) mountTs = ts;
      const since = still || !ts ? 99 : (ts - mountTs) / 1000;
      const gRaw = Math.min(1, Math.max(0, (since - GATHER_DELAY) / GATHER_SPAN));
      const gather = still ? 1 : gRaw * gRaw * (3 - 2 * gRaw);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      const w = Math.round(vw * dpr);
      const h = Math.round(vh * dpr);
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const wide = vw / vh > 1.15;

      gl.uniform1f(uMorph, p * 3);
      gl.uniform1f(uAspect, vw / vh);
      // Rotation returns to zero at *every* stage, not just the ends. sin(p·pi) has zeros only at
      // scroll 0 and 1, which with four states leaves the two middle silhouettes permanently yawed
      // by ~45 degrees — and a sneaker at 45 degrees is a lump. Three half-cycles put a zero at each
      // of the four stage positions, so the shoe and the wordmark both settle face-on.
      gl.uniform1f(uSpin, Math.sin(p * Math.PI * 3) * 0.62 + Math.sin(idle * 0.16) * 0.2);
      // One arrangement per stage from a table, with the copy column taking the opposite side. A
      // sine sweep would slide the mass through those positions instead of parking it there. The
      // wordmark ends centred and lifted, which is the composition the closing band is built around.
      // NOTE the sign convention: clip space runs +1 at the top, so negative y is downward.
      const SIDES = wide ? [0.44, -0.34, 0.3, 0.0] : [0.06, -0.06, 0.05, 0.0];
      // On a narrow viewport there is no horizontal room to give, so the hero separation has to be
      // vertical: the mass drops below the headline and climbs back as the page advances.
      // The wordmark's -0.06 was measured, not chosen: centred, it landed under the closing
      // statement at the top of the last viewport and the two collided.
      const LIFTS = wide ? [0.0, -0.03, -0.02, -0.06] : [-0.72, -0.06, -0.02, -0.08];
      gl.uniform2f(
        uDrift,
        stageValue(SIDES, p) + Math.sin(idle * 0.29) * 0.05,
        stageValue(LIFTS, p) + Math.sin(idle * 0.22) * 0.04,
      );
      gl.uniform1f(uScale, wide ? 2.05 : 0.9);
      gl.uniform1f(uSize, wide ? 1.0 : 0.6);

      const pt = reduce.matches ? ABSENT : pointer;
      gl.uniform2f(uPointer, pt[0], pt[1]);
      const orbiting = pt[0] < 8;
      gl.uniform2f(uOrbit, orbiting ? pt[0] * 0.5 : 0, orbiting ? -pt[1] * 0.28 : 0);
      gl.uniform1f(uIdle, idle);
      gl.uniform1f(uGather, gather);
      gl.drawArrays(gl.POINTS, 0, N);

      // Keep the loop alive only while something is actually moving. Frozen, it stops after this
      // frame and the canvas costs nothing until the next scroll or pointer event.
      if (!still || gather < 1) frame = requestAnimationFrame(draw);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function onPointer(e: PointerEvent) {
      pointer = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      schedule();
    }
    function onLeave() {
      pointer = ABSENT;
      schedule();
    }

    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    reduce.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      reduce.removeEventListener("change", schedule);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
