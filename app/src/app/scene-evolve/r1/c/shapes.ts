// Silhouette targets for Reframe's scene field.
//
// Two ways a form gets defined here:
//  1. Rasterised — the outline is drawn onto an offscreen 2D canvas and its opaque pixels are then
//     sampled with the caller's seeded PRNG. This is the only way to get a *precise* object out of a
//     point cloud; a silhouette assembled from trigonometry reads as a smudge, never as a camera.
//  2. Solved — forms that are already exact as equations (the orbit rings) stay parametric.
//
// Nothing in this file reads a clock or `Math.random`: every coordinate is a function of the seed or
// of the particle index, so the same scroll offset renders the same frame on every load.

export type Vec3 = [number, number, number];
export type Rand = () => number;

/** Offscreen raster resolution. 320² is enough detail for 14k samples and costs one init pass. */
const RASTER = 320;

/**
 * Depth shells, outermost first. A pixel belongs to the first shell at whose probe radius it can
 * still see empty space, so shell 0 hugs the silhouette edge and the last one is deep interior.
 * Sampling a filled mask evenly produces a noise blob — real forms read as a dense boundary with a
 * thinning interior, which is what shelling reproduces.
 */
const SHELL_RADII = [2, 5, 9, 14, 21, 30];
/**
 * Share of the particle budget each shell receives, front-loaded onto the boundary. Emitting shells
 * in order also makes particle index monotone in depth, which is what lets colour and point size be
 * graded by index alone without breaking the particle-to-particle morph correspondence.
 */
const SHELL_WEIGHTS = [0.22, 0.17, 0.14, 0.12, 0.1, 0.25];

/** Index fraction below which a particle still counts as rim, for colour and size grading. */
export const RIM_SHARE = 0.5;

/** Rounded rectangle without depending on `ctx.roundRect`, which varies by lib target. */
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.lineTo(x + w - k, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + k);
  ctx.lineTo(x + w, y + h - k);
  ctx.quadraticCurveTo(x + w, y + h, x + w - k, y + h);
  ctx.lineTo(x + k, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - k);
  ctx.lineTo(x, y + k);
  ctx.quadraticCurveTo(x, y, x + k, y);
  ctx.closePath();
  ctx.fill();
}

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws a form onto a square offscreen canvas and returns `count` deterministic samples of its
 * opaque pixels, binned into depth shells.
 *
 * `depth` is the z half-thickness. `bulge` tapers that thickness toward the outline so the cloud
 * reads as a shell with volume instead of a cardboard cut-out — kept shallow on purpose, because a
 * deep bulge scatters boundary particles front-to-back and blurs the very outline the stage exists
 * to show.
 */
export function sampleRaster(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  count: number,
  rand: Rand,
  depth = 0.16,
  bulge = false,
): Vec3[] {
  if (typeof document === "undefined") return [];
  const cv = document.createElement("canvas");
  cv.width = RASTER;
  cv.height = RASTER;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  // No 2D context means no shape. Callers fall back to a scatter rather than leaving the field empty.
  if (!ctx) return [];
  ctx.clearRect(0, 0, RASTER, RASTER);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  draw(ctx, RASTER);

  const data = ctx.getImageData(0, 0, RASTER, RASTER).data;
  const solid = new Uint8Array(RASTER * RASTER);
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) solid[(i - 3) / 4] = 1;

  const shells: number[][] = SHELL_RADII.map(() => []);
  for (let px = 0; px < solid.length; px++) {
    if (!solid[px]) continue;
    const x = px % RASTER;
    const y = (px / RASTER) | 0;
    let shell = SHELL_RADII.length - 1;
    for (let s = 0; s < SHELL_RADII.length; s++) {
      let open = false;
      for (let k = 0; k < 8 && !open; k++) {
        const a = (k / 8) * Math.PI * 2;
        const sx = Math.round(x + Math.cos(a) * SHELL_RADII[s]);
        const sy = Math.round(y + Math.sin(a) * SHELL_RADII[s]);
        open = sx < 0 || sy < 0 || sx >= RASTER || sy >= RASTER || !solid[sy * RASTER + sx];
      }
      if (open) {
        shell = s;
        break;
      }
    }
    shells[shell].push(px);
  }

  // Thin forms leave inner shells empty; fold their quota into the next populated one so the budget
  // is always spent.
  const quota: { pool: number[]; upto: number }[] = [];
  let acc = 0;
  let carry = 0;
  for (let s = 0; s < shells.length; s++) {
    carry += SHELL_WEIGHTS[s];
    if (!shells[s].length) continue;
    acc += carry;
    carry = 0;
    quota.push({ pool: shells[s], upto: Math.round(count * acc) });
  }
  if (!quota.length) return [];
  quota[quota.length - 1].upto = count;

  const out: Vec3[] = [];
  let q = 0;
  for (let n = 0; n < count; n++) {
    while (q < quota.length - 1 && n >= quota[q].upto) q++;
    const pool = quota[q].pool;
    const px = pool[Math.floor(rand() * pool.length)];
    const x = px % RASTER;
    const y = (px / RASTER) | 0;
    // Sub-pixel jitter, or the cloud shows the raster grid as a screen-door pattern.
    const nx = ((x + rand()) / RASTER) * 2 - 1;
    const ny = -(((y + rand()) / RASTER) * 2 - 1);
    const falloff = Math.sqrt(Math.max(0, 1 - Math.min(1, (nx * nx + ny * ny) / 1.1)));
    const nz = (rand() * 2 - 1) * depth * (bulge ? 0.25 + falloff : 1);
    out.push([nx, ny, nz]);
  }
  return out;
}

/**
 * Stage 1 — the iris diaphragm. Eight blades swept around an octagonal opening, inside a housing
 * ring and an f-stop scale.
 *
 * Drawn as a *line figure* rather than filled blades. Filling them was the first attempt and it
 * fails for a reason worth recording: overlapping blades union into a solid disc with a small hole,
 * and once that is sampled into particles it reads as a washer, not a mechanism. What identifies an
 * iris is the pinwheel of blade edges, and edges are lines. Sampling strokes also leaves the stage
 * genuinely open, which is what lets the hero copy sit beside it without competing.
 */
export function irisDiaphragm(count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      const c = s / 2;
      const BLADES = 8;
      const HOUSING = s * 0.33;
      const OPENING = s * 0.2;
      const step = (Math.PI * 2) / BLADES;

      // Outer barrel ring and the housing the blades are rooted in.
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.arc(c, c, s * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = s * 0.018;
      ctx.beginPath();
      ctx.arc(c, c, HOUSING, 0, Math.PI * 2);
      ctx.stroke();

      // f-stop scale — every third tick long. The detail that says "lens" rather than "circle".
      ctx.lineWidth = s * 0.013;
      for (let k = 0; k < 24; k++) {
        const a = (k / 24) * Math.PI * 2;
        const r0 = s * 0.425;
        const r1 = s * (k % 3 === 0 ? 0.478 : 0.452);
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
        ctx.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1);
        ctx.stroke();
      }

      // The opening: an octagon whose edges are the leading edges of the blades.
      ctx.lineWidth = s * 0.02;
      ctx.beginPath();
      for (let k = 0; k < BLADES; k++) {
        const a = k * step + step / 2;
        const x = c + Math.cos(a) * OPENING;
        const y = c + Math.sin(a) * OPENING;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Blade edges: from each opening vertex, swept back to the housing one blade round — the
      // rotation of these lines is the whole reason an aperture looks like an aperture.
      ctx.lineWidth = s * 0.019;
      for (let k = 0; k < BLADES; k++) {
        const a = k * step + step / 2;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * OPENING, c + Math.sin(a) * OPENING);
        ctx.quadraticCurveTo(
          c + Math.cos(a + step * 0.55) * OPENING * 1.5,
          c + Math.sin(a + step * 0.55) * OPENING * 1.5,
          c + Math.cos(a + step) * HOUSING,
          c + Math.sin(a + step) * HOUSING,
        );
        ctx.stroke();
      }
    },
    count,
    rand,
    0.12,
  );
}

/**
 * Stage 3 — the camera itself. A rangefinder body drawn well past its real proportions: the barrel
 * is oversized, the finder hump squarer and the body flatter than any camera ever made, because a
 * silhouette rendered at true manufactured proportions collapses into a lump the moment it is made
 * of particles. What survives the translation is contrast between large features, not fidelity.
 *
 * Two openings are cut back out — the rangefinder window and the aperture pupil. Each cut creates a
 * second boundary that the shell pass then crowds with particles, so the holes read as lit rings
 * rather than as missing pixels.
 */
export function cameraBody(count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      const cx = s * 0.5;
      const lensY = s * 0.552;
      // Finder hump.
      rrect(ctx, s * 0.3, s * 0.212, s * 0.26, s * 0.12, s * 0.022);
      // Shutter release nub and film-advance knob.
      rrect(ctx, s * 0.6, s * 0.243, s * 0.075, s * 0.09, s * 0.016);
      disc(ctx, s * 0.723, s * 0.276, s * 0.046);
      // Body.
      rrect(ctx, s * 0.115, s * 0.325, s * 0.77, s * 0.4, s * 0.055);
      // Lens barrel — deliberately larger in diameter than the body is tall, and dropped low enough
      // that the circle breaks the rectangle. A barrel contained inside the body outline disappears
      // into it the moment the form is made of particles, and a camera without a visible lens is a
      // box.
      disc(ctx, cx, lensY, s * 0.226);
      // Front ring of the barrel.
      ctx.lineWidth = s * 0.024;
      ctx.beginPath();
      ctx.arc(cx, lensY, s * 0.263, 0, Math.PI * 2);
      ctx.stroke();
      // Strap lugs.
      rrect(ctx, s * 0.088, s * 0.362, s * 0.032, s * 0.055, s * 0.012);
      rrect(ctx, s * 0.88, s * 0.362, s * 0.032, s * 0.055, s * 0.012);

      ctx.globalCompositeOperation = "destination-out";
      disc(ctx, s * 0.218, s * 0.412, s * 0.05); // rangefinder window
      disc(ctx, s * 0.795, s * 0.408, s * 0.034); // meter cell
      disc(ctx, cx, lensY, s * 0.085); // aperture pupil
      ctx.globalCompositeOperation = "source-over";
    },
    count,
    rand,
    0.2,
    true,
  );
}

/**
 * Stage 4 — the wordmark. Rasterised type gives an exact letterform cloud with no font dependency in
 * the layout: whatever face the browser resolves, the sampler measures it and shrinks to fit.
 */
export function wordmark(text: string, count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let size = s * 0.3;
      ctx.font = `600 ${size}px system-ui, sans-serif`;
      while (ctx.measureText(text).width > s * 0.88 && size > 8) {
        size -= 2;
        ctx.font = `600 ${size}px system-ui, sans-serif`;
      }
      ctx.fillText(text, s / 2, s / 2);
    },
    count,
    rand,
    0.1,
  );
}

/**
 * Stage 2 — the sustained dispersed state, and the one the body copy actually reads through.
 *
 * Not a fog: seven tilted elliptical rings, each with its own inclination, so individual particles
 * still read as individual marks and the field has structure to look at. The innermost ring starts
 * well away from the origin, which leaves the centre of the frame open for the statement column
 * instead of clumping the mass exactly where the type has to go.
 */
export function orbitRings(count: number, rand: Rand): Vec3[] {
  const RINGS = 7;
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const k = Math.floor(rand() * RINGS);
    const r = 0.74 + k * 0.3 + (rand() - 0.5) * 0.22;
    const theta = rand() * Math.PI * 2;
    const tilt = 0.32 + k * 0.05;
    out.push([
      Math.cos(theta) * r * 1.52,
      Math.sin(theta) * r * tilt + (rand() - 0.5) * 0.18,
      Math.sin(theta + k * 0.9) * r * 0.3,
    ]);
  }
  return out;
}

/**
 * The ambient layer's home: a wide, sparse dust cloud that no stage ever recalls. Spread past the
 * frame on purpose — a field that empties out between silhouettes reads as a hole in the page.
 */
export function dustField(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.55) * 2.8;
    out.push([Math.cos(theta) * r * 1.5, Math.sin(theta) * r * 1.08, (rand() - 0.5) * 2.2]);
  }
  return out;
}

/** Used whenever a raster comes back empty, so the field is never blank. */
export function scatter(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) out.push([(rand() - 0.5) * 2.6, (rand() - 0.5) * 1.8, (rand() - 0.5) * 1.4]);
  return out;
}
