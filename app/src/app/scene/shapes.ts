// KEPT — silhouette targets for the scene field.
//
// Two ways a state is defined here:
//   1. Rasterised — draw the form once on an offscreen canvas and sample its opaque pixels with the
//      caller's seeded PRNG. This is the only way to get a shape a person *recognises*: a sneaker
//      built from trigonometry is a lump, a sneaker traced from a path keeps its toe spring, its
//      collar dip and its midsole line intact once it is made of dust.
//   2. Solved — the orbital rings and the dust vortex are exact as equations, so they stay
//      parametric. Rasterising them would only add error.
//
// Nothing here reads a clock and nothing calls Math.random: every value is a function of the seed
// stream or of the particle index, so the same seed rebuilds the same cloud on every load.

export type Vec3 = [number, number, number];
export type Rand = () => number;

/** Offscreen raster resolution. 320 is enough that a 4px cut line still survives shell probing. */
const RASTER = 320;

/**
 * Depth shells, outermost first. A pixel joins the first shell at whose probe radius it can still
 * see empty space, so shell 0 hugs the silhouette and the last is deep interior.
 *
 * The point of shelling at all: a mask sampled evenly reads as a noise blob. Real particle forms are
 * shells — dense along the boundary, thinning inward — and emitting the shells in order makes the
 * particle index monotone in depth, which is what lets colour and size be graded by index alone
 * without breaking the i-to-i correspondence the morph depends on.
 */
const SHELL_RADII = [2, 5, 9, 14, 21, 30];
/** Share of the budget each shell receives. Front-loaded: the boundary carries the form. */
const SHELL_WEIGHTS = [0.3, 0.22, 0.16, 0.12, 0.09, 0.11];
/** Index fraction below which a particle still counts as rim, for colour and size grading. */
export const RIM_SHARE = 0.5;

/** Number of compass probes per shell test. Eight is enough to catch a 4px cut line. */
const PROBES = 8;

/**
 * Draws onto a square offscreen canvas, then returns `count` deterministic samples of its opaque
 * pixels, binned into depth shells.
 *
 * Returns an empty array when there is no 2D context — callers must supply a fallback, or the whole
 * field silently disappears with no error anywhere.
 */
export function sampleRaster(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  count: number,
  rand: Rand,
  depth = 0.16,
  bulge = false,
): Vec3[] {
  const cv = document.createElement("canvas");
  cv.width = RASTER;
  cv.height = RASTER;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
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
      for (let k = 0; k < PROBES && !open; k++) {
        const a = (k / PROBES) * Math.PI * 2;
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

  // Thin forms leave the deep shells empty — a sole is 20px across, a letter stroke less. The
  // missing weight is **renormalised across the shells that are populated**, not carried forward
  // into the next one.
  //
  // Carrying it forward was the first version and it was measurably wrong: on the wordmark, shells
  // 3 to 5 are empty everywhere except the junction of the K, so nearly 40% of the budget landed on
  // a few hundred pixels there and additive blending turned it into one blown-out white lozenge with
  // no letterform left in it. Renormalising keeps the front-loaded shape of the distribution while
  // spreading what the form cannot hold over the shells it does.
  const quota: { pool: number[]; upto: number }[] = [];
  let total = 0;
  for (let s = 0; s < shells.length; s++) if (shells[s].length) total += SHELL_WEIGHTS[s];
  if (!total) return [];
  let acc = 0;
  for (let s = 0; s < shells.length; s++) {
    if (!shells[s].length) continue;
    acc += SHELL_WEIGHTS[s] / total;
    quota.push({ pool: shells[s], upto: Math.round(count * acc) });
  }
  quota[quota.length - 1].upto = count;

  const out: Vec3[] = [];
  let q = 0;
  for (let n = 0; n < count; n++) {
    while (q < quota.length - 1 && n >= quota[q].upto) q++;
    const pool = quota[q].pool;
    const px = pool[Math.floor(rand() * pool.length)];
    const x = px % RASTER;
    const y = (px / RASTER) | 0;
    // Sub-pixel jitter, or the cloud shows the raster grid as a screen door.
    const nx = ((x + rand()) / RASTER) * 2 - 1;
    const ny = -(((y + rand()) / RASTER) * 2 - 1);
    // A shallow bulge gives the flat trace a body. Kept shallow on purpose: pushing z out for
    // "volume" spreads the boundary particles front-to-back and the outline goes soft, which trades
    // away the one thing a rasterised silhouette exists to provide.
    const falloff = Math.sqrt(Math.max(0, 1 - Math.min(1, (nx * nx + ny * ny) / 1.15)));
    const nz = (rand() * 2 - 1) * depth * (bulge ? 0.25 + falloff : 1);
    out.push([nx, ny, nz]);
  }
  return out;
}

/**
 * State 3 — the payoff: a sneaker in side profile, toe to the right.
 *
 * Drawn from paths, so it carries no font dependency. Proportions are pushed past a real shoe the
 * way §1-1 asks: the heel wedge is chunkier, the toe spring lifts further and the collar dips
 * deeper than any shoe on a shelf, because subtle curvature vanishes the moment the outline is
 * resampled as grain. The three cuts at the end — midsole split, lace bars, side stripe — are what
 * turn a foot-shaped mass into something read as *a sneaker* in under a second.
 */
export function sneaker(count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      const X = (v: number) => s * v;
      // The drawing is composed on a 0.36-to-0.72 band; this lifts it so the form sits centred in
      // the raster, which is what the field's drift table assumes.
      const Y = (v: number) => s * (v - 0.038);

      // Midsole + outsole: a wedge, thick at the heel, tapering forward, lifting at the toe.
      ctx.beginPath();
      ctx.moveTo(X(0.112), Y(0.606));
      ctx.quadraticCurveTo(X(0.094), Y(0.7), X(0.18), Y(0.718));
      ctx.lineTo(X(0.78), Y(0.718));
      ctx.quadraticCurveTo(X(0.892), Y(0.71), X(0.914), Y(0.626));
      ctx.lineTo(X(0.868), Y(0.606));
      ctx.quadraticCurveTo(X(0.79), Y(0.652), X(0.62), Y(0.656));
      ctx.lineTo(X(0.3), Y(0.652));
      ctx.quadraticCurveTo(X(0.19), Y(0.646), X(0.112), Y(0.606));
      ctx.closePath();
      ctx.fill();

      // Upper: heel counter, collar dip, tongue crest, vamp, toe box.
      ctx.beginPath();
      ctx.moveTo(X(0.15), Y(0.612));
      ctx.lineTo(X(0.158), Y(0.47));
      ctx.quadraticCurveTo(X(0.164), Y(0.398), X(0.222), Y(0.372));
      ctx.lineTo(X(0.268), Y(0.36));
      ctx.quadraticCurveTo(X(0.33), Y(0.478), X(0.408), Y(0.428));
      ctx.quadraticCurveTo(X(0.448), Y(0.388), X(0.482), Y(0.42));
      ctx.quadraticCurveTo(X(0.56), Y(0.478), X(0.66), Y(0.538));
      ctx.quadraticCurveTo(X(0.782), Y(0.588), X(0.868), Y(0.598));
      ctx.quadraticCurveTo(X(0.898), Y(0.606), X(0.884), Y(0.622));
      ctx.closePath();
      ctx.fill();

      // Cut the details back out. Without them the two fills merge into one boot-shaped slab.
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Midsole split — the single most legible cue that this is a shoe and not a boot.
      ctx.lineWidth = s * 0.022;
      ctx.beginPath();
      ctx.moveTo(X(0.15), Y(0.618));
      ctx.quadraticCurveTo(X(0.5), Y(0.664), X(0.876), Y(0.616));
      ctx.stroke();

      // Lace bars across the vamp.
      ctx.lineWidth = s * 0.017;
      const laces: [number, number, number, number][] = [
        [0.452, 0.437, 0.43, 0.482],
        [0.508, 0.47, 0.486, 0.516],
        [0.564, 0.505, 0.542, 0.551],
      ];
      for (const [x0, y0, x1, y1] of laces) {
        ctx.beginPath();
        ctx.moveTo(X(x0), Y(y0));
        ctx.lineTo(X(x1), Y(y1));
        ctx.stroke();
      }

      // Side panel stripe, sweeping up from the midfoot.
      ctx.lineWidth = s * 0.034;
      ctx.beginPath();
      ctx.moveTo(X(0.275), Y(0.588));
      ctx.quadraticCurveTo(X(0.44), Y(0.566), X(0.6), Y(0.545));
      ctx.stroke();

      ctx.globalCompositeOperation = "source-over";
    },
    count,
    rand,
    0.15,
    true,
  );
}

/**
 * State 4 — the wordmark. Rasterised type gives an exact letterform cloud that no path drawing of
 * mine would match. Set in the system stack rather than a webfont: the raster is built inside an
 * effect that may run before a CDN face has loaded, and a silhouette that depends on network timing
 * is a silhouette that differs between two captures of the same commit.
 */
export function wordmark(text: string, count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let size = s * 0.4;
      const set = () => {
        ctx.font = `700 ${size}px system-ui, sans-serif`;
      };
      set();
      // Shrink until the word fits with margin, so a longer name never clips at the raster edge.
      while (ctx.measureText(text).width > s * 0.84 && size > 8) {
        size -= 2;
        set();
      }
      ctx.fillText(text, s / 2, s / 2);
    },
    count,
    rand,
    0.1,
  );
}

/**
 * State 1 — scattered dust, the state the page opens on.
 *
 * Not a uniform cloud: three loose spiral arms, so the opening frame has a direction to it without
 * ever reading as a figure. Two numbers here were set by looking at a capture rather than by taste —
 * the radius was 2.85 and the angular scatter 1.8rad, which spread the cloud a full viewport past
 * every edge and left it indistinguishable from fog laid over the headline. Pulled in to 1.75 with a
 * 0.9rad scatter, it composes to one side of the copy column and the arms are visible as arms.
 */
export function dustVortex(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  const ARMS = 3;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 0.62) * 1.5;
    const arm = Math.floor(rand() * ARMS);
    const theta = (arm / ARMS) * Math.PI * 2 + r * 2.1 + (rand() - 0.5) * 0.9;
    out.push([Math.cos(theta) * r * 1.15, Math.sin(theta) * r * 0.8, (rand() - 0.5) * 1.7]);
  }
  return out;
}

/**
 * State 2 — the sustained dispersed state: three tilted orbital rings with loose debris between
 * them, held for the whole manifesto band so the copy reads *through* the field rather than beside
 * it. The rings keep a clear hole at the centre; a closed form here would leave the page with no
 * dispersed stretch at all, which is the difference between a scene and two pictures.
 */
export function orbitalField(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  const RADII = [0.9, 1.48, 2.16];
  for (let i = 0; i < count; i++) {
    const pick = rand();
    if (pick < 0.72) {
      const k = pick < 0.28 ? 0 : pick < 0.52 ? 1 : 2;
      const r = RADII[k] * (0.965 + rand() * 0.07);
      const theta = rand() * Math.PI * 2;
      const tilt = 0.3 + k * 0.13;
      const y = Math.sin(theta) * r;
      out.push([Math.cos(theta) * r * 1.32, y * Math.cos(tilt) * 0.6, y * Math.sin(tilt)]);
    } else {
      const theta = rand() * Math.PI * 2;
      const r = 0.62 + Math.pow(rand(), 0.55) * 2.15;
      out.push([Math.cos(theta) * r * 1.38, Math.sin(theta) * r * 0.9, (rand() - 0.5) * 1.6]);
    }
  }
  return out;
}

/**
 * The ambient layer's home. These particles never join a silhouette — they sit here in every one of
 * the four buffers, so the morph, the swirl and the spin are all no-ops for them and no frame of the
 * page is ever empty. Spread wider than the viewport on purpose.
 */
export function ambientDrift(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const r = 0.35 + Math.pow(rand(), 0.55) * 3.1;
    out.push([Math.cos(theta) * r * 1.6, Math.sin(theta) * r * 1.05, (rand() - 0.5) * 2.2]);
  }
  return out;
}

/** Fallback for a raster that came back empty — never leaves a stage blank. */
export function scatter(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) out.push([(rand() - 0.5) * 2.6, (rand() - 0.5) * 1.8, (rand() - 0.5) * 1.4]);
  return out;
}
