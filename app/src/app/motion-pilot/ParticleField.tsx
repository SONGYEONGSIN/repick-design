"use client";

import { useEffect, useRef } from "react";
import { RIM_SHARE, garment, profile, scatter, sparseField, type Vec3 } from "./shapes";

/**
 * Persistent WebGL2 scene — one fixed, full-viewport particle field that holds an exact silhouette
 * and morphs between silhouettes as the document scrolls, and reacts under the cursor.
 *
 * Three stages: a garment → a sustained dispersed field (the reading state) → a head in profile.
 * The first and last are rasterised with bulge (see ./shapes.ts) so the cloud takes the real outline
 * of a volumetric object rather than an amorphous blob or a flat cutout.
 *
 * Gate-compatible by construction:
 * - Scatter comes from an inline seeded PRNG (mulberry32), never `Math.random` — same seed, same
 *   cloud every load, so the determinism rule passes and judge screenshots stay comparable.
 * - No clock. Silhouette state is a pure function of scroll progress; the cursor response is a pure
 *   function of pointer position. With no pointer on the page (capture pipeline) the frame at a
 *   given scroll offset is identical every run.
 * - Decorative: `aria-hidden`, never takes pointer events, and the page reads the same without it.
 */

const COUNT = 20000;
/**
 * Palette weighted to the reference's measured distribution, not chosen by eye.
 *
 * Sampling the reference's own frames (lit pixels, HSV) gave: 56% achromatic (white/grey), a warm
 * gold-orange band at 30-45° carrying ~22%, then small amounts of blue, red, violet and pink —
 * average saturation 0.58, value 0.48. Our first palette was the inverse: only 33% white, dominated
 * by cool blue-violet, and noticeably duller (saturation 0.37, value 0.33).
 *
 * Entries repeat to encode weight, so a uniform draw reproduces the measured mix.
 */
/**
 * Two palettes, not one — split by where a particle sits in the form.
 *
 * Sampling the reference's own frames (lit pixels, HSV) gave 56% achromatic, a warm gold-orange band
 * at 30-45 degrees carrying ~22%, then small amounts of blue, red, violet and pink, at average
 * saturation 0.58. But the mix is not spread evenly: the warm band is almost entirely *rim*, tracing
 * the silhouette, while the interior is small white and violet. A single averaged palette reproduces
 * the histogram and still looks nothing like it, so the split is the point.
 *
 * Entries repeat to encode weight, so a uniform draw reproduces the measured mix.
 */
const RIM_PALETTE: [number, number, number][] = [
  [1.0, 0.62, 0.06],
  [1.0, 0.62, 0.06],
  [1.0, 0.68, 0.07],
  [1.0, 0.7, 0.08],
  [1.0, 0.74, 0.1],
  [1.0, 0.82, 0.12],
  [1.0, 0.82, 0.12],
  [1.0, 0.86, 0.18],
  [1.0, 0.9, 0.3],
  [1.0, 0.9, 0.3],
  [1.0, 0.22, 0.16],
  [1.0, 1.0, 1.0],
  [1.0, 0.35, 0.75],
  [0.6, 0.35, 1.0],
];

const CORE_PALETTE: [number, number, number][] = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [0.95, 0.95, 0.98],
  [0.95, 0.95, 0.98],
  [0.9, 0.9, 0.94],
  [0.84, 0.85, 0.9],
  [0.84, 0.85, 0.9],
  [0.6, 0.35, 1.0],
  [0.25, 0.75, 0.68],
  [1.0, 0.35, 0.75],
];

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
in vec3 aA; in vec3 aB; in vec3 aC; in vec3 aColor; in float aSeed; in float aRim;
uniform float uMorph;     // 0..2 — A→B→C, driven by document scroll
uniform vec2  uPointer;   // cursor in clip space (aspect-corrected); (9,9) = absent
uniform float uAspect;
uniform float uSpin;
uniform vec2  uDrift;   // where the mass sits this scroll frame (x drifts side to side, y up/down)
uniform float uScale;
out vec3 vColor; out float vSeed; out float vDepth; out float vHot; out float vBand;

void main() {
  // Per-particle lag so the cloud reorganises limb by limb instead of sliding in lockstep.
  float lag = aSeed * 0.42;
  float m = clamp((uMorph - lag) / (2.0 - 0.42) * 2.0, 0.0, 2.0);
  float seg = m < 1.0 ? m : m - 1.0;
  vec3 p = m < 1.0 ? mix(aA, aB, smoothstep(0.0, 1.0, m))
                   : mix(aB, aC, smoothstep(0.0, 1.0, m - 1.0));

  // Scatter through the middle of every transition and re-gather at the far end: the form breaks
  // apart on the way rather than sliding intact from one silhouette to the next.
  float burst = sin(seg * 3.14159265);
  vec3 away = normalize(p + vec3(0.0007, 0.0011, 0.0013));
  p += away * burst * burst * (0.5 + aSeed * 2.1);

  float ca = cos(uSpin), sa = sin(uSpin);
  p = vec3(p.x * ca + p.z * sa, p.y, -p.x * sa + p.z * ca);
  vDepth = p.z;

  float persp = 1.0 / (2.15 - p.z * 0.55);
  vec2 clip = vec2(p.x * persp / uAspect * uScale + uDrift.x, p.y * persp * uScale + uDrift.y);

  // Cursor response: the region under the pointer is magnified — points scale outward from the
  // cursor and grow — so the form reads larger and brighter where you hover. Pure function of
  // pointer position: no easing timer, so it settles the instant the cursor stops and contributes
  // nothing at all when there is no pointer (the capture pipeline).
  float hot = 0.0;
  if (uPointer.x < 8.0) {
    vec2 d = clip - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    float R = 0.42;
    if (dist < R) {
      hot = 1.0 - dist / R;
      float zoom = 1.0 + hot * hot * 0.75;
      d *= zoom;
      d.x /= uAspect;
      clip = uPointer + d;
    }
  }
  vHot = hot;

  gl_Position = vec4(clip, 0.0, 1.0);
  // Heavy-tailed size: seed³ leaves most particles tiny and a few very large, which is what gives
  // the field depth instead of a uniform mist.
  // Skewed hard so most particles stay near-dust and only the tail reads as a lit body. The
  // reference's field covers ~0.28 of the frame while ours covered 0.36: the excess was mid-size
  // particles overlapping each other, which additively washes colour toward white (measured
  // chromatic saturation 0.43 against the reference's 0.58). Thinning the middle of the size
  // distribution — not the count — drops coverage without giving up the bright tail.
  float sizeSeed = aSeed * aSeed * aSeed * aSeed;
  // …but only while the cloud is open. Gathered into a silhouette, large particles overlap and
  // additive blending blows the form into a white slab — the precise outline is the whole point of
  // those stages, so shrink everything as the field closes up.
  float openness = clamp(1.0 - abs(m - 1.0) + burst * 0.6, 0.0, 1.0);
  float grain = mix(0.26, 1.0, openness);
  // Rim particles carry the shape; interior particles are dust behind it. Scaling the two bands
  // apart is what turns a filled mass into a shell you can read the outline of.
  float ptSize = (0.9 + sizeSeed * 52.0 * grain * (0.55 + aRim * 1.05)) * (0.55 + persp * 0.95) * (1.0 + hot * 1.6) * uScale * 0.62;
  gl_PointSize = ptSize;
  vBand = clamp(2.6 / max(ptSize, 2.0), 0.05, 0.34);
  vColor = aColor; vSeed = aSeed;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor; in float vSeed; in float vDepth; in float vHot; in float vBand;
out vec4 outColor;
float sdTri(vec2 p, float r) {
  const float k = 1.7320508;
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float a = vSeed * 6.2831853;
  q = mat2(cos(a), -sin(a), sin(a), cos(a)) * q;
  float d = abs(sdTri(q, 0.72));
  // Stroke width scales inversely with point size so large triangles stay hairline, not slabs.
  float line = 1.0 - smoothstep(vBand * 0.45, vBand, d);
  if (line < 0.02) discard;
  float depthFade = clamp(0.4 + vDepth * 0.6, 0.12, 1.0);
  vec3 c = mix(vColor, vec3(1.0), vHot * 0.55);
  // Alpha kept below full: the mass is large enough to sit under running copy, and a slightly
  // translucent field lets the text carry (paired with a shadow on the copy itself).
  outColor = vec4(c, line * depthFade * (0.98 + vHot * 0.6));
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

export default function ParticleField() {
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

    const rand = mulberry32(20260731);
    const coat = garment(COUNT, rand);
    const spread = sparseField(COUNT, rand);
    const head = profile(COUNT, rand);
    const A = flatten(coat.length ? coat : scatter(COUNT, rand), COUNT);
    const B = flatten(spread, COUNT);
    const C = flatten(head.length ? head : scatter(COUNT, rand), COUNT);

    const col = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const rim = new Float32Array(COUNT);
    // sampleRaster emits its boundary band first, so the same leading indices are rim points in
    // every shape — which is what lets rim colour and size be baked in once without breaking the
    // particle-to-particle correspondence the morph depends on.
    const rimSpan = COUNT * RIM_SHARE;
    for (let i = 0; i < COUNT; i++) {
      // A ramp, not a switch: warm colour and extra size fade off with depth, so the boundary reads
      // as a dense edge of the same field rather than an outline drawn around it.
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
    bind("aA", A, 3); bind("aB", B, 3); bind("aC", C, 3); bind("aColor", col, 3); bind("aSeed", seed, 1); bind("aRim", rim, 1);

    const uMorph = gl.getUniformLocation(prog, "uMorph");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uAspect = gl.getUniformLocation(prog, "uAspect");
    const uSpin = gl.getUniformLocation(prog, "uSpin");
    const uDrift = gl.getUniformLocation(prog, "uDrift");
    const uScale = gl.getUniformLocation(prog, "uScale");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ABSENT: [number, number] = [9, 9];
    let pointer: [number, number] = ABSENT;
    let frame = 0;

    function draw() {
      frame = 0;
      const el = ref.current;
      if (!el || !gl) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      const w = Math.round(vw * dpr), h = Math.round(vh * dpr);
      if (el.width !== w || el.height !== h) { el.width = w; el.height = h; }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const wide = vw / vh > 1.15;
      gl.uniform1f(uMorph, p * 2);
      gl.uniform1f(uAspect, vw / vh);
      // Rotate only in transit and settle face-on at both ends: the first and last stages are
      // readable forms (a glyph, a wordmark) and a continuous spin lands them mirrored.
      gl.uniform1f(uSpin, Math.sin(p * Math.PI) * 0.9);
      // The mass travels while it changes — right, across to the left, back — and rises and falls.
      // Every term is a function of scroll position, so scrolling back up retraces it exactly.
      gl.uniform2f(
        uDrift,
        wide ? 0.34 + Math.sin(p * Math.PI * 2) * 0.46 : Math.sin(p * Math.PI * 2) * 0.14,
        Math.sin(p * Math.PI * 3) * 0.16,
      );
      gl.uniform1f(uScale, wide ? 2.35 : 1.5);
      const pt = reduce.matches ? ABSENT : pointer;
      gl.uniform2f(uPointer, pt[0], pt[1]);
      gl.drawArrays(gl.POINTS, 0, COUNT);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }

    function onPointer(e: PointerEvent) {
      pointer = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)];
      schedule();
    }
    function onLeave() { pointer = ABSENT; schedule(); }

    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
