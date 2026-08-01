"use client";

import { useEffect, useRef } from "react";
import { INTRO_MS } from "./intro";
import { RIM_SHARE, cameraBody, dustField, irisDiaphragm, orbitRings, scatter, wordmark, type Vec3 } from "./shapes";

/**
 * Reframe's scene — one fixed WebGL2 particle field for the whole document, holding an exact
 * silhouette and morphing between silhouettes as the page scrolls.
 *
 * Four stages, in the order the product's argument runs:
 *   1. an iris diaphragm — the shutter opens
 *   2. seven tilted orbit rings — the sustained dispersed state the manifesto reads through
 *   3. a rangefinder camera — the object resolves
 *   4. the REFRAME wordmark — it leaves under a new name
 *
 * The transition between them is a *shutter twist*, not an explosion: mid-transition every particle
 * rotates about the optical axis by an amount that falls off with radius, so the field winds and
 * unwinds like blades turning instead of bursting outward and re-converging.
 *
 * Determinism contract (brief-scene §2):
 * - Scatter comes from an inline mulberry32, never `Math.random` — same seed, same cloud every load.
 * - Exactly one clock term (`uIdle`). It is pinned to 0 under `__SPECIMEN_FREEZE__` and under
 *   `prefers-reduced-motion`, and the rAF loop stops entirely in that state rather than repainting a
 *   still frame at 60fps.
 * - The entry bloom (`uOpen`) is a mount transition, not a running term: frozen, it starts already
 *   finished at 1, so the frozen frame is identical to a page that never had an entrance.
 * - Everything else is a pure function of scroll offset and pointer position.
 */

/** Erring low against the 20k the profile measured at perf 97: correctness over count. */
const COUNT = 14000;
/** Share of the field that never joins a silhouette and keeps every frame populated (§3). */
const AMBIENT_SHARE = 0.038;

/**
 * Palette split by depth, not averaged into one list.
 *
 * Rim particles carry the outline and take the cyan/sky band the brand is built on, with a couple of
 * warm entries standing in for the coating flare a vintage lens throws — a purely monochrome cyan
 * field measures as one colour and reads as a filter over the page rather than as light. Core
 * particles are the dust behind the outline: near-white, low chroma. Entries repeat to encode weight.
 */
const RIM_PALETTE: [number, number, number][] = [
  [0.22, 0.74, 0.97],
  [0.22, 0.74, 0.97],
  [0.35, 0.83, 1.0],
  [0.35, 0.83, 1.0],
  [0.46, 0.9, 1.0],
  [0.46, 0.9, 1.0],
  [0.62, 0.96, 1.0],
  [0.12, 0.58, 0.9],
  [0.3, 0.98, 0.9],
  [0.3, 0.98, 0.9],
  [0.85, 0.99, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 0.74, 0.42],
  [1.0, 0.56, 0.36],
];

const CORE_PALETTE: [number, number, number][] = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [0.94, 0.97, 1.0],
  [0.94, 0.97, 1.0],
  [0.88, 0.93, 0.97],
  [0.88, 0.93, 0.97],
  [0.8, 0.88, 0.94],
  [0.72, 0.83, 0.9],
  [0.55, 0.78, 0.92],
  [0.4, 0.72, 0.88],
  [0.35, 0.9, 0.86],
  [1.0, 0.82, 0.6],
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
in vec3 aA; in vec3 aB; in vec3 aC; in vec3 aD; in vec3 aColor; in float aSeed; in float aRim; in float aAmb;
uniform float uMorph;    // 0..3 — iris → rings → camera → wordmark, driven by document scroll
uniform vec2  uPointer;  // cursor in clip space, aspect-corrected; (9,9) means absent
uniform float uAspect;
uniform float uSpin;     // scroll yaw; returns to 0 at every stage boundary
uniform vec2  uDrift;    // where the mass is parked this frame
uniform float uScale;    // position scale for the sculpture
uniform float uGrain;    // size scale — deliberately a *separate* uniform from uScale
uniform float uIdle;     // the one clock term; 0 while frozen or under reduced motion
uniform float uOpen;     // mount transition, 0..1; already 1 while frozen
out vec3 vColor; out float vDepth; out float vFocus; out float vBig; out float vAmb; out float vOpen;

const float PI = 3.14159265;
const float SPAN = 3.0;
// Per-particle lag, sized against the *segment* length. Four stages give each transition a third of
// the scroll, so a lag anywhere near the three-stage 0.42 would smear particles across two segments
// at once and no scroll position would ever hold a settled silhouette.
const float LAG = 0.10;
// How open each stage is, used to scale grain: the iris is a ring, the orbit rings are wide open,
// the camera is a dense body, the wordmark nearly so. Large particles overlapping inside a closed
// form saturate additive blending and turn the silhouette into a white slab, so grain follows this.
const vec4 OPENNESS = vec4(0.42, 1.0, 0.0, 0.13);

void main() {
  float lag = aSeed * LAG;
  float m = clamp((uMorph - lag) / (SPAN - LAG) * SPAN, 0.0, SPAN);
  float i0 = floor(min(m, SPAN - 1.0));
  float t = m - i0;
  float seg = smoothstep(0.0, 1.0, t);

  vec3 s0 = i0 < 0.5 ? aA : (i0 < 1.5 ? aB : aC);
  vec3 s1 = i0 < 0.5 ? aB : (i0 < 1.5 ? aC : aD);
  vec3 p = mix(s0, s1, seg);

  float o0 = i0 < 0.5 ? OPENNESS.x : (i0 < 1.5 ? OPENNESS.y : OPENNESS.z);
  float o1 = i0 < 0.5 ? OPENNESS.y : (i0 < 1.5 ? OPENNESS.z : OPENNESS.w);

  // The shutter twist. Peaks at the middle of a transition and is exactly zero at every stage, so
  // each silhouette actually settles. Inner particles turn further than outer ones, which is what
  // gives it the wind-up of a bladed mechanism rather than the look of a spinning plate.
  float turn = sin(t * PI) * (1.0 - aAmb);
  float rad = length(p.xy) + 0.001;
  float ang = turn * (1.15 + aSeed * 1.7) / (0.62 + rad);
  float ca = cos(ang), sa = sin(ang);
  p.xy = mat2(ca, -sa, sa, ca) * p.xy;
  p.xy *= 1.0 + turn * (0.08 + aSeed * 0.4);
  p.z += turn * (aSeed - 0.5) * 0.5;

  float openness = clamp(mix(o0, o1, seg) + turn * 0.55, 0.0, 1.0);

  // Entry: the field starts wound shut and small at the centre of the frame, then unwinds and blooms
  // outward into place — the direction a shutter actually opens. Compressing inward instead would
  // read as debris assembling. Per-particle stagger keeps it from expanding as one rigid body.
  float g = clamp((uOpen - aSeed * 0.3) / 0.7, 0.0, 1.0);
  g = g * g * (3.0 - 2.0 * g);
  float ea = (1.0 - g) * 1.9;
  float ec = cos(ea), es = sin(ea);
  p.xy = mat2(ec, -es, es, ec) * p.xy;
  p *= mix(0.1, 1.0, g);

  // Ambient particles hold their own scattered home, so the morph, the twist and the spin all pass
  // them by and the frame is never empty between silhouettes.
  p = mix(p, aA, aAmb);

  // The one clock: at rest the field still breathes, on a per-particle phase. uIdle is pinned to 0
  // under capture and reduced motion, and sin(0) is 0, so this term vanishes exactly when it must.
  float ph = aSeed * 51.0;
  p += vec3(sin(uIdle * 0.51 + ph), cos(uIdle * 0.43 + ph * 1.27), sin(uIdle * 0.37 + ph * 0.83)) * 0.028;

  float cy = cos(uSpin), sy = sin(uSpin);
  vec3 rot = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  p = mix(rot, p, aAmb);
  vDepth = p.z;

  // Position scale and size scale are separate uniforms on purpose: the ambient layer needs its own
  // spread (1.0 against the sculpture's) without that value also dividing its point size.
  float sc = mix(uScale, 1.0, aAmb);
  vec2 dr = mix(uDrift * g, vec2(0.0), aAmb);
  float persp = 1.0 / (2.2 - p.z * 0.6);
  vec2 clip = vec2(p.x * persp / uAspect * sc + dr.x, p.y * persp * sc + dr.y);

  // Ambient parallax: the background slides as a whole against the cursor, each mote by its own
  // depth, so it reads as layers behind the object. Pure function of pointer — zero when absent.
  if (uPointer.x < 8.0) {
    clip -= uPointer * 0.055 * (0.3 + aSeed * 0.7) * aAmb;
  }

  // Focus pull. Within a radius of the cursor the sculpture is pushed outward — opening a void with
  // a lit rim — and simultaneously resolves: those particles shrink and brighten, the way a subject
  // snaps in as the focus ring lands on it. No easing timer, so it stops the instant the cursor does
  // and contributes nothing at all in a capture pipeline, where there is no pointer.
  float focus = 0.0;
  if (uPointer.x < 8.0 && aAmb < 0.5) {
    vec2 d = clip - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    float R = 0.40;
    if (dist < R) {
      focus = 1.0 - dist / R;
      d += normalize(d + vec2(0.0001, 0.00013)) * focus * focus * 0.3;
      d.x /= uAspect;
      clip = uPointer + d;
    }
  }
  vFocus = focus;

  gl_Position = vec4(clip, 0.0, 1.0);

  // Heavy-tailed size for the sculpture: most particles stay near-dust and a rare few read as lit
  // bokeh. The ambient layer gets a *linear* band instead — sharing the sculpture's curve makes the
  // background "dust plus a few outliers" rather than the even spread of shapes it should be.
  float sizeSeed = aSeed * aSeed * aSeed * aSeed;
  float ambSeed = 0.032 + aSeed * 0.078;
  float grain = mix(0.3, 1.0, openness);
  float sSeed = mix(sizeSeed * grain * (0.5 + aRim * 1.1), ambSeed * 1.45, aAmb);
  float ptSize = (0.85 + sSeed * 46.0) * (0.55 + persp * 0.95) * uGrain * mix(1.0, 0.6, focus * focus);
  ptSize *= mix(0.45, 1.0, g);
  gl_PointSize = ptSize;

  // Only points wide enough to show structure get the bokeh falloff; dust stays a flat mark.
  vBig = clamp((ptSize - 5.0) / 20.0, 0.0, 1.0);
  vColor = aColor; vAmb = aAmb; vOpen = g;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor; in float vDepth; in float vFocus; in float vBig; in float vAmb; in float vOpen;
out vec4 outColor;

// Hexagon SDF. Every sprite shares one orientation rather than taking a per-particle rotation —
// out-of-focus highlights through a six-bladed aperture are all images of the same aperture, and
// keeping them aligned is what makes the field read as one lens instead of confetti.
float sdHex(vec2 p, float r) {
  const vec3 k = vec3(-0.8660254, 0.5, 0.5773503);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
  return length(p) * sign(p.y);
}

void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = sdHex(q, 0.8);
  float mask = 1.0 - smoothstep(-0.1, 0.1, d);
  if (mask < 0.02) discard;

  // Bokeh: a defocused highlight is brighter at its edge than at its centre. Applied only in
  // proportion to how large the sprite is, so dust does not turn into a ring of aliasing.
  float inner = clamp(-d / 0.8, 0.0, 1.0);
  float bokeh = mix(1.0, 0.34, smoothstep(0.12, 0.9, inner));
  float shade = mix(1.0, bokeh, vBig);

  float depthFade = clamp(0.42 + vDepth * 0.58, 0.14, 1.0);
  vec3 c = mix(vColor, vec3(1.0), vFocus * 0.45);
  float a = mask * shade * depthFade
    * mix(1.0, 0.42, vBig)
    * mix(1.0, 0.28, vAmb)
    * (0.9 + vFocus * 1.1)
    * mix(0.05, 1.0, vOpen * vOpen);
  outColor = vec4(c, clamp(a, 0.0, 1.0));
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

export default function ApertureField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "high-performance" });
    // No WebGL2 means the page keeps every word and simply has no scene behind it.
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const rand = mulberry32(20260801);
    const iris = irisDiaphragm(COUNT, rand);
    const rings = orbitRings(COUNT, rand);
    const camera = cameraBody(COUNT, rand);
    const mark = wordmark("REFRAME", COUNT, rand);
    const fallback = () => scatter(COUNT, rand);
    const A = flatten(iris.length ? iris : fallback(), COUNT);
    const B = flatten(rings, COUNT);
    const C = flatten(camera.length ? camera : fallback(), COUNT);
    const D = flatten(mark.length ? mark : fallback(), COUNT);

    // The trailing slice keeps one wide scatter home in *every* buffer, so morph and twist are
    // no-ops for it and something is always drifting across the frame.
    const dust = dustField(COUNT, rand);
    const ambStart = Math.round(COUNT * (1 - AMBIENT_SHARE));
    const amb = new Float32Array(COUNT);
    for (let i = ambStart; i < COUNT; i++) {
      amb[i] = 1;
      const home = dust[i];
      for (const buf of [A, B, C, D]) buf.set(home, i * 3);
    }

    const col = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const rim = new Float32Array(COUNT);
    const rimSpan = COUNT * RIM_SHARE;
    for (let i = 0; i < COUNT; i++) {
      // A ramp rather than a switch: mixing the two palettes by depth probability keeps the boundary
      // reading as a dense edge of the same field. A hard split paints a neon sticker around it.
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
    const uGrain = gl.getUniformLocation(prog, "uGrain");
    const uIdle = gl.getUniformLocation(prog, "uIdle");
    const uOpen = gl.getUniformLocation(prog, "uOpen");
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
    // Derived from the curtain rather than typed again, so moving the curtain moves the bloom with
    // it — otherwise the entrance plays out behind a black sheet and is never seen.
    const OPEN_DELAY = INTRO_MS / 1000 + 0.15;
    const OPEN_SPAN = 1.25;

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
      const raw = Math.min(1, Math.max(0, (since - OPEN_DELAY) / OPEN_SPAN));
      const open = still ? 1 : raw * raw * (3 - 2 * raw);

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
      // Clamped, always. An interpolation input outside [0,1] is the failure that replaces the whole
      // page with a dev error overlay and gets reported as an unrelated a11y failure.
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const wide = vw / vh > 1.15;

      gl.uniform1f(uMorph, p * 3);
      gl.uniform1f(uAspect, vw / vh);
      // Three half-cycles put a zero at each of the four stage positions. sin(p·π) would only return
      // to zero at the two ends, leaving the camera and the wordmark permanently yawed — and a
      // wordmark seen from behind reads mirrored.
      gl.uniform1f(uSpin, Math.sin(p * Math.PI * 3) * 0.62 + Math.sin(idle * 0.19) * 0.18);

      // One parked position per stage, interpolated stage to stage: iris right, rings left, camera
      // right, wordmark centred with the copy column taking the other side each time. A sine sweep
      // would never actually park the mass where the layout expects it.
      // Clip space runs +1 at the top, so a negative y is downward.
      const SIDES = wide ? [0.34, -0.3, 0.32, 0.0] : [0.1, -0.08, 0.1, 0.0];
      const RISE = wide ? [0.0, 0.04, -0.02, 0.12] : [0.0, 0.0, 0.0, 0.16];
      const s = Math.min(2, Math.floor(p * 3));
      const st = Math.min(1, Math.max(0, p * 3 - s));
      const ease = st * st * (3 - 2 * st);
      const sideDrift = SIDES[s] + (SIDES[s + 1] - SIDES[s]) * ease;
      const riseDrift = RISE[s] + (RISE[s + 1] - RISE[s]) * ease;
      gl.uniform2f(
        uDrift,
        sideDrift + Math.sin(idle * 0.31) * 0.05,
        // Narrow viewports have no horizontal room to give, so the mass drops out of the hero copy's
        // way instead — and the drop decays with scroll so it does not end up parked on the footer.
        riseDrift + (wide ? 0 : -0.44 * (1 - p)) + Math.sin(idle * 0.23) * 0.04,
      );
      gl.uniform1f(uScale, wide ? 2.3 : 1.05);
      gl.uniform1f(uGrain, wide ? 1.45 : 0.95);

      const pt = reduce.matches ? ABSENT : pointer;
      gl.uniform2f(uPointer, pt[0], pt[1]);
      gl.uniform1f(uIdle, idle);
      gl.uniform1f(uOpen, open);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      // Keep looping only while something is still moving on its own. Frozen, the loop stops after
      // this frame and the canvas costs nothing until the next scroll or pointer event.
      if (!still || open < 1) frame = requestAnimationFrame(draw);
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

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-20 h-full w-full" />;
}
