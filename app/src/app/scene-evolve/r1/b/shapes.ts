// Silhouette targets for the Second scene.
//
// Two ways a state is defined here:
//  1. Rasterised — the form is drawn onto an offscreen canvas and its opaque pixels are sampled with
//     the caller's seeded PRNG. A parametric blob reads as "some mass"; a rasterised path reads as
//     the thing it is. The dial and the wordmark both come from here.
//  2. Solved — dust, orbit rings and the ambient field are exact as equations, so they stay
//     parametric. Rasterising them would only add cost.
//
// Nothing in this file touches a clock or an unseeded random source: every value is a function of
// the passed-in PRNG or of the index.

export type Vec3 = [number, number, number];
export type Rand = () => number;

const RASTER = 320;

/**
 * Depth shells, outermost first. A pixel belongs to the first shell at whose probe radius it can
 * still see empty space, so shell 0 hugs the outline and later shells are interior.
 *
 * The dial is drawn entirely as linework (see `dial`), so in practice only the first two shells
 * populate — which is the point: the outline band gets the warm rim grading and the stroke cores
 * carry the mass. Emitting shells in order keeps the particle index monotone in depth, which is
 * what lets colour and size be graded by index alone while the morph correspondence (particle i in
 * every state) survives.
 */
const SHELL_RADII = [2, 5, 9, 14, 21, 30];
const SHELL_WEIGHTS = [0.22, 0.18, 0.15, 0.13, 0.12, 0.2];

/** Index fraction below which a particle still counts as rim, for colour and size grading. */
export const RIM_SHARE = 0.5;

/** Draws onto a square offscreen canvas, then returns `count` deterministic samples of its opaque pixels. */
export function sampleRaster(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  count: number,
  rand: Rand,
  depth = 0.15,
  bulge = false,
  /**
   * Shell weighting is for *filled* forms, where an even fill reads as a noise blob and the boundary
   * has to carry the shape. It is actively wrong for linework: a drawing made of strokes has almost
   * no interior, so the 80% quota reserved for deep shells piles onto the few fat spots — the hands,
   * the centre pin, the stitch bars — and additive blending turns each of them into a white lump
   * while the ring and the markers go faint. Measured on the dial before this flag existed: six
   * blown highlights and no readable watch. Uniform sampling puts density where ink is.
   */
  graded = true,
  /**
   * Raster resolution. It is not a quality knob, it is the *line weight* knob: the sampled cloud is
   * drawn at a fixed size on screen, so a stroke that is 5px wide in a 320 raster lands about 12px
   * wide in the frame, and a 12px-wide band of sparse dots is a smudge rather than a line. Doubling
   * the raster halves the apparent stroke width for the same drawing. Cost is one getImageData at
   * init, and the shell probe is skipped for ungraded shapes anyway.
   */
  size = RASTER,
): Vec3[] {
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  // No 2D context means no samples. Callers fall back to a scatter rather than shipping an empty
  // buffer — an empty state blanks the whole field with no error anywhere.
  if (!ctx) return [];
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  draw(ctx, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  const solid = new Uint8Array(size * size);
  for (let i = 3; i < data.length; i += 4) if (data[i] > 110) solid[(i - 3) / 4] = 1;

  const shells: number[][] = SHELL_RADII.map(() => []);
  for (let px = 0; px < solid.length; px++) {
    if (!solid[px]) continue;
    if (!graded) {
      shells[0].push(px);
      continue;
    }
    const x = px % size;
    const y = (px / size) | 0;
    let shell = SHELL_RADII.length - 1;
    for (let s = 0; s < SHELL_RADII.length; s++) {
      let open = false;
      for (let k = 0; k < 8 && !open; k++) {
        const a = (k / 8) * Math.PI * 2;
        const sx = Math.round(x + Math.cos(a) * SHELL_RADII[s]);
        const sy = Math.round(y + Math.sin(a) * SHELL_RADII[s]);
        open = sx < 0 || sy < 0 || sx >= size || sy >= size || !solid[sy * size + sx];
      }
      if (open) {
        shell = s;
        break;
      }
    }
    shells[shell].push(px);
  }

  // Shells a form is too thin to have stay empty; their quota folds into the next populated one.
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
    const x = px % size;
    const y = (px / size) | 0;
    // Sub-pixel jitter: without it the cloud lands on the raster grid and shows a screen door.
    const nx = ((x + rand()) / size) * 2 - 1;
    const ny = -(((y + rand()) / size) * 2 - 1);
    // Shallow bulge so the case reads as a disc with thickness rather than a cardboard cutout. Deep
    // z smears the outline, which is the one thing this stage exists to show.
    const falloff = Math.sqrt(Math.max(0, 1 - Math.min(1, (nx * nx + ny * ny) / 1.1)));
    const nz = (rand() * 2 - 1) * depth * (bulge ? 0.3 + falloff : 1);
    out.push([nx, ny, nz]);
  }
  return out;
}

/** Clockwise-from-noon polar helper, in canvas coordinates (y grows downward). */
function hand(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

/**
 * Stage 3 — the dial. An analog wristwatch, drawn as *linework* rather than as a filled disc.
 *
 * A filled circle made of particles is a blob no matter how many particles it has; strokes keep
 * every sample on a line the eye can follow, so the bezel, the chapter ring, the twelve markers and
 * the three hands all survive being turned into dust. The lugs and strap stubs are what make it a
 * wrist watch instead of a wall clock, and the crown at three o'clock is the detail that says
 * "mechanical" in one mark.
 *
 * Hands are parked at 10:09:35 — the position every watch advertisement uses, because it is
 * symmetric and leaves the twelve marker clear.
 */
export function dial(count: number, rand: Rand): Vec3[] {
  // Drawn at 512 and shrunk back to the same on-screen size afterwards. At 320 the thinnest stroke a
  // canvas will rasterise reliably came out roughly 12px wide in the frame, and a 12px band of
  // sparse dots is a smudge — the case ring, the markers and the hands all blurred into one mass.
  // Same drawing at 512, then scaled by 0.7, puts every line under 6px and the watch reads.
  const pts = sampleRaster(
    (ctx, s) => {
      const c = s / 2;
      const R = s * 0.4; // outer case radius
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Strap stubs, drawn as open outlines so they stay thin. A filled strap would take most of the
      // particle budget into its interior and starve the dial.
      ctx.lineWidth = s * 0.006;
      for (const dir of [-1, 1]) {
        const y0 = c + dir * R * 0.84;
        const y1 = c + dir * s * 0.47;
        const w0 = s * 0.15;
        const w1 = s * 0.115;
        ctx.beginPath();
        ctx.moveTo(c - w0, y0);
        ctx.lineTo(c - w1, y1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(c + w0, y0);
        ctx.lineTo(c + w1, y1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(c - w1, y1);
        ctx.lineTo(c + w1, y1);
        ctx.stroke();
        // Stitching bars — cheap, and they read as leather at particle resolution.
        for (const t of [0.42, 0.78]) {
          const y = y0 + (y1 - y0) * t;
          const w = w0 + (w1 - w0) * t;
          ctx.beginPath();
          ctx.moveTo(c - w * 0.66, y);
          ctx.lineTo(c + w * 0.66, y);
          ctx.stroke();
        }
      }

      // Lugs — the four horns the strap pins into.
      ctx.lineWidth = s * 0.011;
      for (const dy of [-1, 1]) {
        for (const dx of [-1, 1]) {
          const [x0, y0] = hand(c, c, R * 0.95, dy < 0 ? (dx < 0 ? -32 : 32) : dx < 0 ? -148 : 148);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(c + dx * s * 0.145, c + dy * R * 0.85);
          ctx.stroke();
        }
      }

      // Crown at three o'clock.
      ctx.lineWidth = s * 0.008;
      ctx.beginPath();
      ctx.moveTo(c + R * 0.99, c - s * 0.03);
      ctx.lineTo(c + R + s * 0.05, c - s * 0.027);
      ctx.lineTo(c + R + s * 0.05, c + s * 0.027);
      ctx.lineTo(c + R * 0.99, c + s * 0.03);
      ctx.stroke();

      // Case bezel — the heaviest line on the drawing, because it is the one that says "round".
      ctx.lineWidth = s * 0.011;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.stroke();

      // Chapter ring.
      ctx.lineWidth = s * 0.0035;
      ctx.beginPath();
      ctx.arc(c, c, R * 0.82, 0, Math.PI * 2);
      ctx.stroke();

      // Minute track — sixty hairline ticks just inside the chapter ring.
      ctx.lineWidth = s * 0.0035;
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const [x0, y0] = hand(c, c, R * 0.79, i * 6);
        const [x1, y1] = hand(c, c, R * 0.72, i * 6);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // Twelve hour markers, the noon one doubled so the dial has an up.
      for (let i = 0; i < 12; i++) {
        const deg = i * 30;
        ctx.lineWidth = s * 0.0105;
        if (i === 0) {
          for (const off of [-6.5, 6.5]) {
            const [x0, y0] = hand(c, c, R * 0.72, deg + off);
            const [x1, y1] = hand(c, c, R * 0.55, deg + off);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
          continue;
        }
        const [x0, y0] = hand(c, c, R * 0.72, deg);
        const [x1, y1] = hand(c, c, R * 0.58, deg);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // Hands at 10:09:35. Tapered fills, not strokes — they have to out-weigh the markers or the
      // dial reads as an empty ring.
      const taper = (deg: number, len: number, halfBase: number, halfTip: number, tail: number) => {
        const [tx, ty] = hand(c, c, len, deg);
        const [bx, by] = hand(c, c, -tail, deg);
        const nx = Math.cos((deg * Math.PI) / 180);
        const ny = Math.sin((deg * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(bx + nx * halfBase, by + ny * halfBase);
        ctx.lineTo(tx + nx * halfTip, ty + ny * halfTip);
        ctx.lineTo(tx - nx * halfTip, ty - ny * halfTip);
        ctx.lineTo(bx - nx * halfBase, by - ny * halfBase);
        ctx.closePath();
        ctx.fill();
      };
      taper(304.5, R * 0.5, s * 0.009, s * 0.005, s * 0.02); // hour
      taper(54, R * 0.77, s * 0.007, s * 0.0035, s * 0.023); // minute

      // Second hand — thin, with the counterweight that makes it read as the sweeping one.
      ctx.lineWidth = s * 0.0035;
      const [sx, sy] = hand(c, c, R * 0.8, 210);
      const [ex, ey] = hand(c, c, -R * 0.22, 210);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(sx, sy);
      ctx.stroke();
      const [wx, wy] = hand(c, c, -R * 0.16, 210);
      ctx.beginPath();
      ctx.arc(wx, wy, s * 0.0075, 0, Math.PI * 2);
      ctx.stroke();

      // Centre pin.
      ctx.beginPath();
      ctx.arc(c, c, s * 0.009, 0, Math.PI * 2);
      ctx.fill();
    },
    count,
    rand,
    // Very shallow z. The bulge is what gives the case a body, but depth also rides the perspective
    // divide, and at 0.14 the outline of the case moved by a dozen pixels front to back — volume
    // bought with a blurred silhouette, which is the one thing this state exists to show.
    0.06,
    true,
    false,
    512,
  );
  return pts.map(([x, y, z]) => [x * 0.7, y * 0.7, z] as Vec3);
}

/** Stage 4 — the wordmark. Rasterised type gives an exact letterform cloud with no layout guessing. */
export function wordmark(text: string, count: number, rand: Rand): Vec3[] {
  return sampleRaster(
    (ctx, s) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let size = s * 0.34;
      const set = () => {
        ctx.font = `700 ${size}px ui-monospace, "SF Mono", Menlo, monospace`;
      };
      set();
      // Shrink until the word fits with margin — a clipped wordmark is worse than a small one.
      while (ctx.measureText(text).width > s * 0.72 && size > 8) {
        size -= 2;
        set();
      }
      ctx.fillText(text, s / 2, s / 2);
    },
    count,
    rand,
    0.1,
    false,
    // Letterforms are strokes too, at this size: shell weighting piles four fifths of the budget
    // into the middle of each glyph and the word blows out to a white slab.
    false,
  );
}

/**
 * Stage 1 — dust. Not noise: a slow spiral of grain with a brighter arc swept through it, the wake
 * a second hand leaves. The hero has to read as *something not yet formed*, which a uniform fog
 * never does.
 */
export function dust(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    if (rand() < 0.4) {
      const t = rand();
      const a = -0.5 + t * 2.5;
      const r = 1.12 + (rand() - 0.5) * 0.3 * (0.35 + t);
      out.push([Math.cos(a) * r * 1.32, Math.sin(a) * r * 0.92, (rand() - 0.5) * 0.9]);
    } else {
      const th = rand() * Math.PI * 2;
      const rr = Math.pow(rand(), 0.5) * 2.5;
      const tw = th + rr * 0.5;
      out.push([Math.cos(tw) * rr * 1.4, Math.sin(tw) * rr * 0.92, (rand() - 0.5) * 1.8]);
    }
  }
  return out;
}

/**
 * Stage 2 — the orbit. Four concentric tracks with the twelve stations marked, hollow in the middle
 * so the manifesto copy runs through the field instead of over a mass.
 *
 * This is the *sustained* dispersed state, not a moment between two forms: the reader spends three
 * viewports inside it, which is where the scene stops being a logo animation and starts being a
 * place the text passes through.
 */
export function orbit(count: number, rand: Rand): Vec3[] {
  const RADII = [0.62, 1.0, 1.42, 1.95];
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand();
    if (u < 0.24) {
      // Station clusters on the third track — twelve of them, the hour positions kept alive while
      // the dial itself is gone.
      const k = Math.floor(rand() * 12);
      const a = (k / 12) * Math.PI * 2 + (rand() - 0.5) * 0.09;
      const r = RADII[2] + (rand() - 0.5) * 0.16;
      out.push([Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.95, (rand() - 0.5) * 0.7]);
      continue;
    }
    const ring = RADII[Math.floor(rand() * RADII.length)];
    const a = rand() * Math.PI * 2;
    const r = ring + (rand() - 0.5) * 0.22 * ring;
    out.push([Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.95, (rand() - 0.5) * 1.5]);
  }
  return out;
}

/**
 * The ambient layer's home. Wide, hollow-ish, and never part of a silhouette — these particles hold
 * this position in every state so the frame is populated during transitions instead of emptying out
 * into a hole between forms.
 */
export function ambientField(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.62) * 2.75;
    out.push([Math.cos(theta) * r * 1.55, Math.sin(theta) * r * 1.08, (rand() - 0.5) * 2.2]);
  }
  return out;
}

/** Fallback when a raster comes back empty (no 2D context) — never leaves a state blank. */
export function scatter(count: number, rand: Rand): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) out.push([(rand() - 0.5) * 2.6, (rand() - 0.5) * 1.8, (rand() - 0.5) * 1.4]);
  return out;
}
