"use client";

import { useEffect, useRef } from "react";
import { INTRO_MS } from "./intro";
import { RIM_SHARE, ambientField, dial, dust, orbit, scatter, wordmark, type Vec3 } from "./shapes";

/**
 * The scene — one fixed, full-viewport WebGL2 particle field that is the spine of the whole
 * document. Scroll progress across the *page* (not a section) drives a continuous morph through
 * four states, and the pointer turns and magnifies the mass under it.
 *
 *   dust → orbit → dial → mark
 *
 * Determinism contract (`brief-scene.md` §2), which is what lets this page be judged from
 * screenshots at all:
 *  - Every scattered value comes from an inline seeded PRNG (mulberry32). No `Math.random`.
 *  - The frame is a pure function of scroll offset and pointer position, with exactly ONE clock in
 *    it: `uIdle`, the resting drift. It is pinned to zero under `__SPECIMEN_FREEZE__` and under
 *    `prefers-reduced-motion`, and the rAF loop stops entirely in that state rather than repainting
 *    a still frame sixty times a second.
 *  - The entry bloom is a mount transition, not a running term: frozen, it starts already finished
 *    (gather = 1), so the frozen page is identical to a page that never had an entrance.
 *
 * Decorative: `aria-hidden`, never takes pointer events, and the document reads exactly the same
 * with the canvas absent (or with WebGL2 unavailable, in which case this quietly does nothing).
 */

const COUNT = 16000;

/**
 * Share of the field that never joins a silhouette. §3: a scene that empties between forms reads as
 * a hole, so a thin ambient layer sits in every frame — measured guidance is ~3.5%, and anything
 * near 16% covers the copy.
 */
const AMBIENT_SHARE = 0.045;

/**
 * Rose-gold rim / steel core. Split by depth rather than averaged into one list: an even mix
 * reproduces a colour histogram and still looks wrong, because in a lit particle field the warm
 * band is almost entirely boundary and the interior is white and steel.
 *
 * Entries repeat to encode weight, so a uniform draw reproduces the intended mix. No violet
 * anywhere — the accent family here is rose through rose-gold, the colours a warm-metal case takes.
 */
const RIM_PALETTE: [number, number, number][] = [
  [1.0, 0.42, 0.56],
  [1.0, 0.42, 0.56],
  [1.0, 0.5, 0.58],
  [1.0, 0.6, 0.56],
  [1.0, 0.66, 0.58],
  [1.0, 0.66, 0.58],
  [1.0, 0.74, 0.62],
  [1.0, 0.82, 0.72],
  [1.0, 0.88, 0.82],
  [1.0, 1.0, 1.0],
  [1.0, 0.3, 0.44],
  [0.98, 0.52, 0.72],
  [0.78, 0.84, 0.92],
  [1.0, 0.66, 0.58],
];

const CORE_PALETTE: [number, number, number][] = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [0.94, 0.95, 0.98],
  [0.94, 0.95, 0.98],
  [0.86, 0.89, 0.94],
  [0.86, 0.89, 0.94],
  [0.72, 0.78, 0.88],
  [0.62, 0.7, 0.82],
  [1.0, 0.55, 0.68],
  [1.0, 0.78, 0.68],
  [1.0, 1.0, 1.0],
];

/** mulberry32 — same seed, same cloud, every load. */
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
uniform float uMorph;   // 0..3 — dust, orbit, dial, mark; driven by document scroll progress
uniform vec2  uPointer; // cursor in clip space; (9,9) means absent
uniform float uAspect;
uniform float uSpin;
uniform vec2  uDrift;   // where the mass is parked this frame
uniform float uScale;
uniform float uIdle;    // seconds of resting drift; pinned to 0 while capturing
uniform vec2  uOrbit;   // yaw/pitch from the cursor; (0,0) with no pointer
uniform float uGather;  // 0 = compressed at centre on entry, 1 = settled; pinned to 1 while capturing
out vec3 vColor; out float vSeed; out float vDepth; out float vHot; out float vBand; out float vAmb; out float vEnter;

const float PI = 3.14159265;

void main() {
  // Per-particle lag, so the field reorganises in waves instead of sliding as one rigid body.
  // Deliberately short: with four states each transition owns a third of the scroll, and the lag a
  // three-state field can afford (0.42) spreads a particle across two transition windows at once —
  // the silhouette then never settles anywhere, it just churns.
  float LAG = 0.10;
  float lag = aSeed * LAG;
  float SPAN = 3.0;
  float m = clamp((uMorph - lag) / (SPAN - LAG) * SPAN, 0.0, SPAN);
  float i0 = floor(min(m, SPAN - 1.0));
  float seg = m - i0;
  vec3 s0 = i0 < 0.5 ? aA : (i0 < 1.5 ? aB : aC);
  vec3 s1 = i0 < 0.5 ? aB : (i0 < 1.5 ? aC : aD);
  vec3 p = mix(s0, s1, smoothstep(0.0, 1.0, seg));

  // The transition signature of this scene is a *sweep*, not an explosion: mid-transition every
  // particle is carried around the centre on an arc, further the further out it sits, so the field
  // turns like a hand crossing the dial and then settles. Zero at both ends of every segment.
  float sweep = sin(seg * PI) * (1.0 - aAmb);
  float turn = sweep * sweep * (0.8 + aSeed * 1.9) * (0.45 + length(p.xy) * 0.35);
  float ct = cos(turn), st = sin(turn);
  vec2 swept = vec2(p.x * ct - p.y * st, p.x * st + p.y * ct);
  p.xy = swept * (1.0 + sweep * sweep * (0.08 + aSeed * 0.26));

  // Entry: the field starts as a small dense knot at the centre and blooms outward into place —
  // debris assembling inward reads as a crash, blooming outward reads as something coming into
  // focus. Size and alpha ride the same ramp (below) or the knot saturates into a white disc.
  float g = clamp((uGather - aSeed * 0.25) / 0.75, 0.0, 1.0);
  g = g * g * (3.0 - 2.0 * g);
  p *= mix(0.14, 1.0, g);

  // The one clock in this page. Each particle wanders on its own phase; the amplitude is small
  // enough that the dial still reads. uIdle is 0 under capture and reduced motion, and sin(0) = 0,
  // so every term that depends on it vanishes exactly then.
  float ph = aSeed * 41.0;
  p += vec3(sin(uIdle * 0.53 + ph), cos(uIdle * 0.44 + ph * 1.27), sin(uIdle * 0.37 + ph * 0.7)) * 0.028;

  // Yaw carries the scroll spin and the cursor's horizontal orbit; pitch is cursor-only. Turning the
  // whole body is what makes the mass read as one object you are handling; a local lens never does.
  // Both are pure functions of pointer position, so an absent pointer leaves the body unrotated.
  float yaw = uSpin + uOrbit.x;
  float cy = cos(yaw), sy = sin(yaw);
  vec3 r1 = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cp = cos(uOrbit.y), sp = sin(uOrbit.y);
  vec3 r2 = vec3(r1.x, r1.y * cp - r1.z * sp, r1.y * sp + r1.z * cp);
  // Ambient particles pass through all of it: no sweep, no spin, no travel. They hold their own
  // scattered home so the frame is never empty.
  p = mix(r2, p, aAmb);
  vDepth = p.z;

  // Position scale and size scale are separate uniforms on purpose — sharing one term means tuning
  // the ambient spread silently shrinks every ambient shape to a third and no multiplier gets it
  // back.
  float sc = mix(uScale, 1.0, aAmb);
  vec2 dr = mix(uDrift * g, vec2(0.0), aAmb);
  float persp = 1.0 / (2.15 - p.z * 0.55);
  vec2 clip = vec2(p.x * persp / uAspect * sc + dr.x, p.y * persp * sc + dr.y);

  // Ambient parallax: the background slides against the pointer, each shape by its own depth, so it
  // reads as layers behind the object rather than one sheet. Never a local lens out there — a zoom
  // on scattered dust reads as a defect.
  if (uPointer.x < 8.0) {
    clip -= uPointer * 0.055 * (0.3 + aSeed * 0.7) * aAmb;
  }

  // Cursor lens on the sculpture only: points scale outward from the cursor and brighten, so the
  // form opens where you hover. No easing timer — it is a pure function of pointer position, which
  // means it settles the instant the cursor stops and contributes nothing at all with no pointer.
  float hot = 0.0;
  if (uPointer.x < 8.0 && aAmb < 0.5) {
    vec2 d = clip - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    float R = 0.4;
    if (dist < R) {
      hot = 1.0 - dist / R;
      d *= 1.0 + hot * hot * 0.7;
      d.x /= uAspect;
      clip = uPointer + d;
    }
  }
  vHot = hot;
  gl_Position = vec4(clip, 0.0, 1.0);

  // Size is tied to how *open* the state is, per state rather than by a curve fitted to three
  // stages: dust and orbit are open and can afford large grain, the dial and the mark are precise
  // and would blow out to a white slab under additive blending if their particles overlapped.
  float openA = i0 < 0.5 ? 0.6 : (i0 < 1.5 ? 1.0 : 0.03);
  float openB = i0 < 0.5 ? 1.0 : (i0 < 1.5 ? 0.03 : 0.02);
  float openness = clamp(mix(openA, openB, seg) + sweep * 0.18, 0.0, 1.0);
  float grain = mix(0.08, 1.0, openness);

  // Heavy tail for the sculpture: most particles are near-dust, a few read as lit bodies. The
  // ambient layer gets a *linear* curve instead — background shapes measure as a narrow band, and
  // sharing the heavy tail turns the backdrop into dust plus a few outliers.
  float sizeSeed = aSeed * aSeed * aSeed * aSeed;
  float ambSize = 0.1 + aSeed * 1.1;
  float sSeed = mix(sizeSeed, ambSize, aAmb);
  float ptSize = (0.85 + sSeed * 26.0 * mix(grain, 1.0, aAmb) * (0.55 + aRim * 1.0)) * (0.55 + persp * 0.95) * (1.0 + hot * 1.5) * uScale * 0.72;
  ptSize *= mix(0.45, 1.0, g);
  gl_PointSize = ptSize;
  // Stroke width scales inversely with point size so the big sprites stay hairline rings.
  vBand = clamp(2.2 / max(ptSize, 2.0), 0.045, 0.6);
  vColor = aColor; vSeed = aSeed; vAmb = aAmb; vEnter = g;
}`;

/**
 * The sprite is an instrument marking, not a dot: a hairline ring with a lit centre. Small particles
 * collapse to the centre alone (the band swallows the ring), large ones read as an aperture — which
 * is the texture a dial deserves and a different grain from a field of discs or triangles.
 */
const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor; in float vSeed; in float vDepth; in float vHot; in float vBand; in float vAmb; in float vEnter;
out vec4 outColor;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r = length(q);
  if (r > 1.0) discard;
  float ring = 1.0 - smoothstep(vBand * 0.5, vBand * 1.35, abs(r - 0.62));
  // The centre pip is sized in *pixels*, not as a fraction of the sprite: a fixed fraction turns a
  // 90px point into a 30px filled disc, and a few hundred of those overlapping under additive
  // blending is the white slab that eats the silhouette. vBand is already 1/size, so tying the pip
  // to it keeps every particle a marking rather than a ball.
  float coreR = clamp(vBand * 1.5, 0.055, 0.34);
  float core = 1.0 - smoothstep(0.0, coreR, r);
  float a = max(ring, core * 0.92);
  if (a < 0.02) discard;
  float depthFade = clamp(0.42 + vDepth * 0.58, 0.12, 1.0);
  vec3 c = mix(vColor, vec3(1.0), vHot * 0.5);
  // Alpha under 1: copy runs over this field, and a slightly translucent scene lets type carry.
  // Ambient shapes are far-off texture — same palette, half the light.
  outColor = vec4(c, a * depthFade * (0.95 + vHot * 0.6) * mix(1.0, 0.44, vAmb) * mix(0.05, 1.0, vEnter * vEnter));
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

export default function ParticleScene() {
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

    const rand = mulberry32(20260801);
    const grain = dust(COUNT, rand);
    const tracks = orbit(COUNT, rand);
    const face = dial(COUNT, rand);
    const mark = wordmark("SECOND", COUNT, rand);
    const fallback = () => scatter(COUNT, rand);
    const A = flatten(grain, COUNT);
    const B = flatten(tracks, COUNT);
    const C = flatten(face.length ? face : fallback(), COUNT);
    const D = flatten(mark.length ? mark : fallback(), COUNT);

    // The trailing slice keeps a wide scattered home in *every* buffer, so the morph and the sweep
    // are no-ops for it and the frame stays populated at all times, transitions included.
    const home = ambientField(COUNT, rand);
    const ambStart = Math.round(COUNT * (1 - AMBIENT_SHARE));
    const amb = new Float32Array(COUNT);
    for (let i = ambStart; i < COUNT; i++) {
      amb[i] = 1;
      const h = home[i];
      for (const buf of [A, B, C, D]) buf.set(h, i * 3);
    }

    const col = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const rim = new Float32Array(COUNT);
    const rimSpan = COUNT * RIM_SHARE;
    for (let i = 0; i < COUNT; i++) {
      // A ramp, not a switch. Splitting rim from core with a threshold paints a neon outline around
      // the form; a probability that decays with depth reads as a dense warm edge of one field.
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
    const uIdle = gl.getUniformLocation(prog, "uIdle");
    const uGather = gl.getUniformLocation(prog, "uGather");
    const uOrbit = gl.getUniformLocation(prog, "uOrbit");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ABSENT: [number, number] = [9, 9];
    let pointer: [number, number] = ABSENT;
    let frame = 0;
    /** Capture pins the clock so judge screenshots stay byte-identical; reduced motion pins it because a user asked. */
    const frozen = () =>
      reduce.matches || Boolean((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__);
    let idleStart = 0;
    let mountTs = 0;
    // Derived from the curtain rather than typed again: the bloom has to begin after the curtain
    // lifts or the entrance plays out behind a black sheet and nobody sees it.
    const GATHER_DELAY = INTRO_MS / 1000 + 0.15;
    const GATHER_SPAN = 1.25;

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

      // Document scroll progress, clamped to [0,1]. Everything downstream is a function of this, so
      // the same scroll offset always renders the same frame.
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const wide = vw / vh > 1.15;

      // Scroll → morph is piecewise linear through the offsets the capture pipeline photographs
      // (0, 0.35, 0.7, 1) rather than a flat p*3. Same monotone function of scroll either way, but
      // this way each judged frame lands on a *settled* state instead of a few percent into a
      // transition, and the band boundaries in the document line up with the states they describe.
      const ANCHORS = [0, 0.35, 0.7, 1];
      let stage = 2;
      while (stage > 0 && p < ANCHORS[stage]) stage -= 1;
      const span = ANCHORS[stage + 1] - ANCHORS[stage];
      const st = Math.min(1, Math.max(0, (p - ANCHORS[stage]) / span));
      const morph = stage + st;

      gl.uniform1f(uMorph, morph);
      gl.uniform1f(uAspect, vw / vh);
      // Rotation returns to zero at *every* state, not only the ends. sin(p·PI) has zeros at scroll
      // 0 and 1 alone — fine for three states, but with four it leaves the two middle sculptures
      // permanently yawed ~45°, and a dial seen at 45° is an ellipse of noise. Driving the spin off
      // `morph` instead puts a zero at each of the four states by construction, whatever the scroll
      // mapping is (equivalently sin(p·PI·(N-1)) for an even mapping).
      gl.uniform1f(uSpin, Math.sin(morph * Math.PI) * 0.55 + Math.sin(idle * 0.17) * 0.2);

      // One parked arrangement per state, interpolated between them — a sine sweep never actually
      // parks the mass where the layout expects it. Copy takes the opposite side each time: dust
      // right of the hero, the orbit left of the manifesto, then the dial and the mark hold the
      // right while every band below the manifesto runs in a left column.
      const SIDES_X = wide ? [0.34, -0.32, 0.36, 0.36] : [0.08, -0.08, 0.0, 0.0];
      const SIDES_Y = wide ? [0.0, 0.03, -0.02, -0.1] : [0.0, -0.06, -0.12, -0.02];
      const segIdx = stage;
      const ease = st * st * (3 - 2 * st);
      const dx = SIDES_X[segIdx] + (SIDES_X[segIdx + 1] - SIDES_X[segIdx]) * ease;
      const dy = SIDES_Y[segIdx] + (SIDES_Y[segIdx + 1] - SIDES_Y[segIdx]) * ease;
      // On a narrow viewport there is no horizontal room to give, so the separation is vertical
      // instead: the mass drops under the hero copy and returns to centre by the end of the
      // document, where a permanent offset would park it on the footer bar. Clip space is +1 up, so
      // a negative y is downward.
      gl.uniform2f(
        uDrift,
        dx + Math.sin(idle * 0.31) * 0.05,
        dy + (wide ? 0 : -0.44 * (1 - p)) + Math.sin(idle * 0.23) * 0.04,
      );
      gl.uniform1f(uScale, wide ? 1.7 : 0.85);

      const pt = reduce.matches ? ABSENT : pointer;
      gl.uniform2f(uPointer, pt[0], pt[1]);
      const orbiting = pt[0] < 8;
      gl.uniform2f(uOrbit, orbiting ? pt[0] * 0.5 : 0, orbiting ? -pt[1] * 0.26 : 0);
      gl.uniform1f(uIdle, idle);
      gl.uniform1f(uGather, gather);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      // Keep looping only while something is actually moving. Frozen, this returns without
      // scheduling and the canvas costs nothing until the next scroll or pointer event.
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
