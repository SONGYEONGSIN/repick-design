// Shape targets for the particle field.
//
// Two ways to define a silhouette here:
//  1. Rasterise it — draw the form on an offscreen canvas and sample its opaque pixels. This is how
//     you get a *precise* shape (a wordmark, a glyph, an arbitrary path) instead of the vague mass a
//     parametric blob produces. Sampling uses the caller's seeded PRNG, so the point cloud is
//     identical on every load.
//  2. Solve it — parametric forms (sphere, ring) that are already exact as equations.
//
// No `Math.random` and no clock anywhere: every value is a function of the seed or of the index.

export type Vec3 = [number, number, number];
export type Rand = () => number;

const RASTER = 320;
/**
 * Depth shells, outermost first. A pixel belongs to the first shell at whose radius it can still see
 * empty space, so shell 0 hugs the silhouette and the last one is deep interior.
 */
const SHELL_RADII = [2, 5, 9, 14, 21, 30];
/**
 * Share of the particles each shell receives. Front-loaded: the boundary carries the form, the
 * interior only has to suggest volume. Emitting shells in order makes particle index monotone in
 * depth, which is what lets colour and size be graded by index alone.
 */
const SHELL_WEIGHTS = [0.2, 0.16, 0.14, 0.12, 0.11, 0.27];
/** Index fraction below which a particle still counts as rim, for colour and size grading. */
export const RIM_SHARE = 0.5;

/** Draws onto a square offscreen canvas, then returns `count` deterministic samples of its opaque pixels. */
export function sampleRaster(draw: (ctx: CanvasRenderingContext2D, size: number) => void, count: number, rand: Rand, depth = 0.16, bulge = false): Vec3[] {
  const cv = document.createElement("canvas");
  cv.width = RASTER;
  cv.height = RASTER;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, RASTER, RASTER);
  ctx.fillStyle = "#fff";
  draw(ctx, RASTER);

  const data = ctx.getImageData(0, 0, RASTER, RASTER).data;
  const solid = new Uint8Array(RASTER * RASTER);
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) solid[(i - 3) / 4] = 1;

  // Bin the shape into depth shells rather than filling it evenly. A uniform fill reads as a noise
  // blob once it is made of particles — the reference draws its forms as *shells*: dense along the
  // silhouette, thinning inward. Grading the density instead of splitting rim from core in one step
  // is what keeps the boundary from looking like a traced neon outline.
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
      if (open) { shell = s; break; }
    }
    shells[shell].push(px);
  }
  // Shells a shape is too thin to have stay empty; fold their quota into the nearest populated one.
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
    // Sub-pixel jitter keeps the cloud from looking like a screen-door grid.
    const nx = ((x + rand()) / RASTER) * 2 - 1;
    const ny = -(((y + rand()) / RASTER) * 2 - 1);
    // Bulge gives the flat raster a body: points near the middle of the form sit further out in z,
    // so the cloud reads as a shell with thickness rather than a cardboard cutout. A flat silhouette
    // is the giveaway that separates our earlier stages from the reference's volumetric objects.
    const falloff = Math.sqrt(Math.max(0, 1 - Math.min(1, (nx * nx + ny * ny) / 1.1)));
    const nz = (rand() * 2 - 1) * depth * (bulge ? 0.25 + falloff : 1);
    out.push([nx, ny, nz]);
  }
  return out;
}

/** Stage A — the brand mark: three tuning rails with knobs. Precise, and it reads instantly. */
export function tuningGlyph(count: number, rand: Rand): Vec3[] {
  return sampleRaster((ctx, s) => {
    const pad = s * 0.18;
    const w = s - pad * 2;
    const rail = s * 0.028;
    const rows = [0.3, 0.5, 0.7];
    const knobs = [0.36, 0.62, 0.28];
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = rail;
    rows.forEach((r) => {
      ctx.beginPath();
      ctx.moveTo(pad, s * r);
      ctx.lineTo(pad + w, s * r);
      ctx.stroke();
    });
    rows.forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(pad + w * knobs[i], s * r, s * 0.062, 0, Math.PI * 2);
      ctx.fill();
    });
  }, count, rand, 0.2);
}


/**
 * Stage A — a garment silhouette: the object the product actually reasons about. Drawn with paths
 * (no font dependency) and sampled with bulge so it reads as a body, not a cutout.
 */
export function garment(count: number, rand: Rand): Vec3[] {
  return sampleRaster((ctx, s) => {
    const cx = s / 2;
    ctx.fillStyle = "#fff";
    // Body: shoulders → tapered waist → hem.
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.19, s * 0.2);
    ctx.quadraticCurveTo(cx, s * 0.15, cx + s * 0.19, s * 0.2);
    ctx.lineTo(cx + s * 0.26, s * 0.52);
    ctx.quadraticCurveTo(cx + s * 0.2, s * 0.76, cx + s * 0.17, s * 0.86);
    ctx.lineTo(cx - s * 0.17, s * 0.86);
    ctx.quadraticCurveTo(cx - s * 0.2, s * 0.76, cx - s * 0.26, s * 0.52);
    ctx.closePath();
    ctx.fill();
    // Sleeves.
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + dir * s * 0.18, s * 0.21);
      ctx.quadraticCurveTo(cx + dir * s * 0.34, s * 0.3, cx + dir * s * 0.33, s * 0.6);
      ctx.lineTo(cx + dir * s * 0.24, s * 0.62);
      ctx.quadraticCurveTo(cx + dir * s * 0.25, s * 0.36, cx + dir * s * 0.15, s * 0.27);
      ctx.closePath();
      ctx.fill();
    }
    // Collar notch — cut back out so the neckline reads.
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.075, s * 0.185);
    ctx.lineTo(cx, s * 0.3);
    ctx.lineTo(cx + s * 0.075, s * 0.185);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, count, rand, 0.22, true);
}

/**
 * Stage C — a head in profile: who the garment is being matched to. The payoff of the journey is a
 * person, not a logo.
 */
export function profile(count: number, rand: Rand): Vec3[] {
  return sampleRaster((ctx, s) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    // Tall, narrow head with exaggerated features — a subtle profile dissolves into a blob once it
    // is made of particles, so brow, nose, lip and chin are all pushed well past life drawing.
    ctx.moveTo(s * 0.66, s * 0.92);            // neck, back
    ctx.lineTo(s * 0.66, s * 0.74);
    ctx.quadraticCurveTo(s * 0.72, s * 0.62, s * 0.70, s * 0.44);
    ctx.quadraticCurveTo(s * 0.66, s * 0.14, s * 0.44, s * 0.12);   // crown
    ctx.quadraticCurveTo(s * 0.28, s * 0.14, s * 0.28, s * 0.34);   // forehead
    ctx.quadraticCurveTo(s * 0.30, s * 0.42, s * 0.25, s * 0.46);   // brow ridge
    ctx.lineTo(s * 0.12, s * 0.60);                                  // nose bridge → tip (sharp)
    ctx.lineTo(s * 0.27, s * 0.63);                                  // under nose
    ctx.quadraticCurveTo(s * 0.22, s * 0.68, s * 0.29, s * 0.70);   // lips
    ctx.quadraticCurveTo(s * 0.20, s * 0.78, s * 0.33, s * 0.82);   // chin
    ctx.quadraticCurveTo(s * 0.40, s * 0.90, s * 0.50, s * 0.92);   // jaw → neck
    ctx.closePath();
    ctx.fill();
  }, count, rand, 0.2, true);
}

/** The wordmark. Rasterised type gives an exact letterform cloud. Kept for other scene scripts. */
export function wordmark(text: string, count: number, rand: Rand): Vec3[] {
  return sampleRaster((ctx, s) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let size = s * 0.34;
    ctx.font = `800 ${size}px system-ui, sans-serif`;
    // Shrink until the word fits the raster with margin — keeps long names from clipping.
    while (ctx.measureText(text).width > s * 0.86 && size > 8) {
      size -= 2;
      ctx.font = `800 ${size}px system-ui, sans-serif`;
    }
    ctx.fillText(text, s / 2, s / 2);
  }, count, rand, 0.12);
}

/**
 * Stage B — the dispersed reading state: a wide, deliberately sparse field the copy passes through.
 *
 * This is a *sustained* stage, not a momentary burst. The reference site holds a dispersed field for
 * its whole manifesto section, and density is what sells it: spread wider than the viewport and let
 * individual particles read as individual shapes instead of fog. `pow(·, 0.6)` on the radius pushes
 * points outward so the middle stays open for text rather than clumping at the centre.
 */
export function sparseField(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.6) * 2.7;
    out.push([Math.cos(theta) * r * 1.5, Math.sin(theta) * r * 1.05, (rand() - 0.5) * 2.2]);
  }
  return out;
}

/**
 * An open hand — the page's own subject, since the argument here is that an interface should answer
 * the hand that moves it. Drawn with the fingers well separated and the thumb pushed out: adjacent
 * fingers at life proportions merge into a mitten once the outline is made of particles (§1-1's
 * exaggeration rule, learned on the profile).
 */
export function hand(count: number, rand: Rand): Vec3[] {
  return sampleRaster((ctx, s) => {
    ctx.fillStyle = "#fff";
    const finger = (x: number, tipY: number, w: number) => {
      ctx.beginPath();
      ctx.moveTo(x - w, s * 0.62);
      ctx.lineTo(x - w, tipY + w);
      ctx.quadraticCurveTo(x, tipY - w * 0.6, x + w, tipY + w);
      ctx.lineTo(x + w, s * 0.62);
      ctx.closePath();
      ctx.fill();
    };
    // palm
    ctx.beginPath();
    ctx.moveTo(s * 0.3, s * 0.58);
    ctx.lineTo(s * 0.72, s * 0.58);
    ctx.quadraticCurveTo(s * 0.78, s * 0.74, s * 0.7, s * 0.86);
    ctx.quadraticCurveTo(s * 0.52, s * 0.96, s * 0.34, s * 0.86);
    ctx.quadraticCurveTo(s * 0.24, s * 0.74, s * 0.3, s * 0.58);
    ctx.closePath();
    ctx.fill();
    finger(s * 0.38, s * 0.3, s * 0.052);   // index
    finger(s * 0.5, s * 0.22, s * 0.055);   // middle
    finger(s * 0.615, s * 0.28, s * 0.052); // ring
    finger(s * 0.715, s * 0.4, s * 0.046);  // little
    // thumb, swung well clear of the palm
    ctx.beginPath();
    ctx.moveTo(s * 0.32, s * 0.66);
    ctx.quadraticCurveTo(s * 0.16, s * 0.6, s * 0.13, s * 0.47);
    ctx.quadraticCurveTo(s * 0.19, s * 0.42, s * 0.24, s * 0.5);
    ctx.quadraticCurveTo(s * 0.28, s * 0.58, s * 0.38, s * 0.6);
    ctx.closePath();
    ctx.fill();
  }, count, rand, 0.2, true);
}

/** An exact sphere shell, solved rather than rasterised. Kept available for other scene scripts. */
export function sphere(count: number, rand: Rand, radius = 0.82): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand(), v = rand();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.86 + 0.14 * rand());
    out.push([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)]);
  }
  return out;
}

/** Fallback used when a raster comes back empty (no 2D context) — never leaves the field blank. */
export function scatter(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) out.push([(rand() - 0.5) * 2.6, (rand() - 0.5) * 1.8, (rand() - 0.5) * 1.4]);
  return out;
}
