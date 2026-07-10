"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  BatteryFull,
  BellRing,
  Bluetooth,
  ChevronDown,
  Compass,
  Footprints,
  Gauge,
  Headphones,
  Home as HomeIcon,
  Layers,
  Mail,
  Move3D,
  Music2,
  Navigation2,
  Phone,
  UserRound,
} from "lucide-react";
import "./f14.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/* ----------------------------------------------------------------------
 * prefers-reduced-motion — reliable subscription via matchMedia +
 * useSyncExternalStore (framer-motion's own useReducedMotion() can miss
 * the OS setting in some environments; this reads the media query
 * directly and re-subscribes on change).
 * ------------------------------------------------------------------- */
function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

/* Pointer-driven 3D tilt. maxDeg === 0 disables tilt entirely (used when
 * the visitor prefers reduced motion) while still returning valid,
 * spring-backed motion values so children never render in a "stuck"
 * state. */
function useTilt(maxDeg: number) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 20, mass: 0.4 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 20, mass: 0.4 });

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (maxDeg === 0 || event.pointerType === "touch") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      ry.set(px * maxDeg * 2);
      rx.set(-py * maxDeg * 2);
    },
    [maxDeg, rx, ry],
  );

  const onPointerLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}

const NEBULA_A =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=60";
const NEBULA_B =
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1400&q=60";

export default function F14Client() {
  const reduced = usePrefersReducedMotion();
  const heroTilt = useTilt(reduced ? 0 : 16);

  const dx = useTransform(heroTilt.rotateY, [-32, 32], [-7, 7]);
  const dy = useTransform(heroTilt.rotateX, [-32, 32], [-7, 7]);
  const cyanX = useTransform(dx, (v) => v - 2.5);
  const cyanY = useTransform(dy, (v) => v - 2.5);
  const magX = useTransform(dx, (v) => -v + 2.5);
  const magY = useTransform(dy, (v) => -v + 2.5);

  const roomRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: roomRef,
    offset: ["start start", "end end"],
  });
  const amp = reduced ? 0.2 : 1;
  const floorY = useTransform(scrollYProgress, [0, 1], [0, -260 * amp]);

  return (
    <div
      className={`f14-scope f14-bg-field relative min-h-screen overflow-x-clip font-sans`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--f14-cyan)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--f14-ink)]"
      >
        본문으로 건너뛰기
      </a>

      <SiteHeader spaceGroteskClassName={spaceGrotesk.className} />

      <main id="main">
        <Hero
          spaceGroteskClassName={spaceGrotesk.className}
          heroTilt={heroTilt}
          cyanX={cyanX}
          cyanY={cyanY}
          magX={magX}
          magY={magY}
        />
        <Manifesto spaceGroteskClassName={spaceGrotesk.className} />
        <TheRoom
          spaceGroteskClassName={spaceGrotesk.className}
          roomRef={roomRef}
          scrollYProgress={scrollYProgress}
          floorY={floorY}
        />
        <Product spaceGroteskClassName={spaceGrotesk.className} reduced={reduced} />
        <Scenarios spaceGroteskClassName={spaceGrotesk.className} reduced={reduced} />
        <Reserve spaceGroteskClassName={spaceGrotesk.className} />
      </main>

      <SiteFooter spaceGroteskClassName={spaceGrotesk.className} />
    </div>
  );
}

/* ----------------------------------------------------------------------
 * Header
 * ------------------------------------------------------------------- */
function SiteHeader({ spaceGroteskClassName }: { spaceGroteskClassName: string }) {
  const navLinks = [
    { href: "#product", label: "제품" },
    { href: "#room", label: "공간" },
    { href: "#scenarios", label: "시나리오" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--f14-line)] bg-[var(--f14-bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a
          href="#hero"
          className={`${spaceGroteskClassName} flex min-h-11 items-center gap-2 text-lg font-semibold tracking-tight text-[var(--f14-fg)]`}
        >
          <Move3D className="h-5 w-5 text-[var(--f14-cyan)]" aria-hidden="true" />
          VERTEX
        </a>
        <nav aria-label="주 메뉴" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center px-1 text-sm text-[var(--f14-fg-muted)] transition-colors hover:text-[var(--f14-fg)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#reserve"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--f14-violet)] px-5 text-sm font-semibold text-[var(--f14-ink)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          얼리 액세스
        </a>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------- */
function Hero({
  spaceGroteskClassName,
  heroTilt,
  cyanX,
  cyanY,
  magX,
  magY,
}: {
  spaceGroteskClassName: string;
  heroTilt: ReturnType<typeof useTilt>;
  cyanX: MotionValue<number>;
  cyanY: MotionValue<number>;
  magX: MotionValue<number>;
  magY: MotionValue<number>;
}) {
  return (
    <section
      id="hero"
      onPointerMove={heroTilt.onPointerMove}
      onPointerLeave={heroTilt.onPointerLeave}
      className="relative overflow-hidden pb-28 pt-36 md:pb-36 md:pt-44"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image src={NEBULA_A} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        {/* Flat dark scrim guarantees text contrast regardless of the
            photo's local brightness underneath. */}
        <div className="absolute inset-0 bg-[var(--f14-bg)]/70" />
        <div className="absolute inset-0 f14-noise-fade" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-10">
        <div>
          <p
            className={`${spaceGroteskClassName} mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--f14-line-strong)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)]`}
          >
            <span className="f14-idle-blink inline-block h-1.5 w-1.5 rounded-full bg-[var(--f14-cyan)]" aria-hidden="true" />
            Spatial Audio · Vertex 01
          </p>

          <h1 className="relative inline-block select-none text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <motion.span
              aria-hidden="true"
              style={{ x: cyanX, y: cyanY }}
              className="pointer-events-none absolute inset-0 text-[var(--f14-cyan)] mix-blend-screen"
            >
              소리에도,
              <br />
              자리가 있다
            </motion.span>
            <motion.span
              aria-hidden="true"
              style={{ x: magX, y: magY }}
              className="pointer-events-none absolute inset-0 text-[var(--f14-magenta)] mix-blend-screen"
            >
              소리에도,
              <br />
              자리가 있다
            </motion.span>
            <span className="relative text-[var(--f14-fg)]">
              소리에도,
              <br />
              자리가 있다
            </span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--f14-fg-muted)]">
            버텍스는 통화, 음악, 알림에 각자의 좌표를 부여합니다. 이어폰 하나로,
            소리가 놓일 자리를 다시 설계했습니다.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#reserve"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--f14-violet)] px-6 text-sm font-semibold text-[var(--f14-ink)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              얼리 액세스 신청
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#room"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--f14-line-strong)] px-6 text-sm font-semibold text-[var(--f14-fg)] transition-colors hover:border-[var(--f14-cyan)] hover:text-[var(--f14-cyan)]"
            >
              3D로 살펴보기
            </a>
          </div>

          <dl
            aria-hidden="true"
            className={`${spaceGroteskClassName} mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-[var(--f14-fg-dim)]`}
          >
            <div className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-[var(--f14-cyan)]" />
              <dt className="sr-only">지연시간</dt>
              <dd>12ms</dd>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-[var(--f14-violet)]" />
              <dt className="sr-only">좌표 정밀도</dt>
              <dd>정밀도 0.1&deg;</dd>
            </div>
            <div className="flex items-center gap-2">
              <BatteryFull className="h-3.5 w-3.5 text-[var(--f14-magenta)]" />
              <dt className="sr-only">배터리</dt>
              <dd>32시간</dd>
            </div>
          </dl>
        </div>

        <SpatialCore tilt={heroTilt} />
      </div>

      <a
        href="#manifesto"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--f14-fg-dim)] transition-colors hover:text-[var(--f14-fg)] sm:flex"
      >
        Scroll
        <ChevronDown className="f14-idle-float-sm h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}

function SpatialCore({ tilt }: { tilt: ReturnType<typeof useTilt> }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px]"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[76%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--f14-cyan)]/50 to-transparent"
          style={{ transformStyle: "preserve-3d" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-px w-[76%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--f14-magenta)]/45 to-transparent"
          style={{ transformStyle: "preserve-3d" }}
        />

        <div
          className="f14-idle-spin-cw absolute inset-[6%] rounded-full border border-[var(--f14-cyan)]/40"
        />
        <div
          className="f14-idle-spin-ccw absolute inset-[15%] rounded-full border border-[var(--f14-magenta)]/35"
        />
        <div
          className="absolute inset-[24%] rounded-full border border-[var(--f14-violet)]/55"
          style={{ transform: "rotateX(-56deg) rotateZ(-18deg)" }}
        />

        <div
          className="f14-idle-pulse absolute inset-[34%] rounded-full"
          style={{
            transform: "translateZ(52px)",
            background:
              "radial-gradient(circle at 35% 30%, #d9ccff, #8c6bff 45%, #2c1f70 100%)",
            boxShadow: "0 0 90px 20px rgba(140,107,255,0.45)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------
 * Manifesto — problem/solution + coordinate diagram
 * ------------------------------------------------------------------- */
const soundLayers = [
  {
    Icon: Phone,
    label: "통화",
    coord: "X 0.0 · Y 0.2 · Z 1.8",
    pos: "left-[54%] top-[2%]",
    z: 90,
    ring: "var(--f14-cyan)",
    delay: "0s",
  },
  {
    Icon: Music2,
    label: "음악",
    coord: "X -1.4 · Y -0.3 · Z -0.6",
    pos: "left-[2%] top-[44%]",
    z: 30,
    ring: "var(--f14-violet)",
    delay: "0.6s",
  },
  {
    Icon: BellRing,
    label: "알림",
    coord: "X 1.3 · Y 0.8 · Z 0.5",
    pos: "right-[0%] top-[26%]",
    z: 130,
    ring: "var(--f14-magenta)",
    delay: "1.1s",
  },
  {
    Icon: Navigation2,
    label: "내비게이션",
    coord: "X 0.0 · Y -0.6 · Z 2.3",
    pos: "left-[36%] bottom-[0%]",
    z: 10,
    ring: "var(--f14-cyan)",
    delay: "1.6s",
  },
];

function Manifesto({ spaceGroteskClassName }: { spaceGroteskClassName: string }) {
  return (
    <section id="manifesto" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center md:px-10">
        <div>
          <p
            className={`${spaceGroteskClassName} mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)]`}
          >
            Problem → Solution
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--f14-fg)] sm:text-4xl">
            모든 소리는, 늘 같은 자리에 있었다
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--f14-fg-dim)]">
                문제
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-[var(--f14-fg-muted)]">
                이어폰 안에서는 통화도, 음악도, 알림음도 전부 한 점에서
                뒤섞였습니다. 무엇이 울리는지 구분하려면, 결국 소리를
                멈춰야 했습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--f14-cyan)]">
                해결
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-[var(--f14-fg-muted)]">
                X, Y, Z. 세 개의 축 위에 소리를 흩어놓으면 귀는 더 이상
                헷갈리지 않습니다. 통화는 정면에서, 음악은 등 뒤에서, 알림은
                오른쪽 위에서 들려옵니다.
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-lg"
          style={{ perspective: "1400px" }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--f14-line-strong)] bg-[var(--f14-bg-raised)]">
              <UserRound className="h-6 w-6 text-[var(--f14-fg)]" aria-hidden="true" />
              <span className="sr-only">청취자</span>
            </div>

            <ul className="contents">
              {soundLayers.map((layer) => (
                <li
                  key={layer.label}
                  className={`f14-idle-float-sm f14-glass absolute ${layer.pos} flex w-40 items-center gap-3 rounded-2xl px-4 py-3`}
                  style={{
                    transform: `translateZ(${layer.z}px)`,
                    animationDelay: layer.delay,
                  }}
                >
                  <layer.Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: layer.ring }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--f14-fg)]">
                      {layer.label}
                    </p>
                    <p
                      className={`${spaceGroteskClassName} truncate font-mono text-[10px] text-[var(--f14-fg-dim)]`}
                    >
                      {layer.coord}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 * The Room — scroll-driven depth corridor
 * ------------------------------------------------------------------- */
const roomLayers = [
  {
    title: "정밀도 0.1°",
    desc: "머리 방향이 1도만 움직여도 좌표를 다시 계산합니다.",
    range: [0.06, 0.16, 0.28, 0.38] as [number, number, number, number],
  },
  {
    title: "지연시간 12ms",
    desc: "체감할 수 없는 속도로 좌표가 갱신됩니다.",
    range: [0.36, 0.46, 0.58, 0.68] as [number, number, number, number],
  },
  {
    title: "레이어 최대 8개",
    desc: "동시에 8개의 소리를 각각 다른 자리에 둘 수 있습니다.",
    range: [0.66, 0.76, 0.9, 1] as [number, number, number, number],
  },
];

function RoomLayer({
  title,
  desc,
  range,
  scrollYProgress,
  spaceGroteskClassName,
  index,
}: {
  title: string;
  desc: string;
  range: [number, number, number, number];
  scrollYProgress: MotionValue<number>;
  spaceGroteskClassName: string;
  index: number;
}) {
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, range, [0.75, 1, 1, 1.12]);
  const y = useTransform(scrollYProgress, range, [40, 0, 0, -40]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <span
        className={`${spaceGroteskClassName} font-mono text-xs text-[var(--f14-fg-dim)]`}
      >
        0{index + 1} / 03
      </span>
      <h3 className="mt-3 text-4xl font-bold tracking-tight text-[var(--f14-fg)] sm:text-5xl">
        {title}
      </h3>
      <p className="mt-4 max-w-sm text-[var(--f14-fg-muted)]">{desc}</p>
    </motion.div>
  );
}

function TheRoom({
  spaceGroteskClassName,
  roomRef,
  scrollYProgress,
  floorY,
}: {
  spaceGroteskClassName: string;
  roomRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  floorY: MotionValue<number>;
}) {
  return (
    <section id="room" ref={roomRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--f14-bg-raised)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-20%] bottom-0 h-[65%] f14-grid-floor opacity-40"
          style={{
            transformOrigin: "bottom center",
            transform: "rotateX(58deg)",
          }}
        >
          <motion.div style={{ y: floorY }} className="h-full w-full" />
        </div>

        <div className="absolute inset-0 f14-noise-fade" aria-hidden="true" />

        <p
          className={`${spaceGroteskClassName} absolute left-6 top-24 z-10 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)] md:left-10`}
        >
          The Room
        </p>
        <h2 className="sr-only">스크롤이 곧, 공간이 됩니다</h2>

        <div className="relative h-full w-full">
          {roomLayers.map((layer, index) => (
            <RoomLayer
              key={layer.title}
              title={layer.title}
              desc={layer.desc}
              range={layer.range}
              scrollYProgress={scrollYProgress}
              spaceGroteskClassName={spaceGroteskClassName}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 * Product / spec
 * ------------------------------------------------------------------- */
const specs: { term: string; value: string; Icon: typeof Gauge }[] = [
  { term: "드라이버", value: "10mm 티타늄 다이어프램", Icon: Headphones },
  { term: "공간 엔진", value: "8채널 실시간 좌표 렌더링", Icon: Layers },
  { term: "지연시간", value: "12ms", Icon: Gauge },
  { term: "배터리", value: "본체 8시간 + 케이스 24시간", Icon: BatteryFull },
  { term: "연결", value: "블루투스 5.4 LE Audio", Icon: Bluetooth },
];

function Product({
  spaceGroteskClassName,
  reduced,
}: {
  spaceGroteskClassName: string;
  reduced: boolean;
}) {
  const tilt = useTilt(reduced ? 0 : 8);
  return (
    <section id="product" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center md:px-10">
        <div className="order-2 md:order-1">
          <div
            className="relative overflow-hidden rounded-[2rem]"
            style={{ perspective: "1200px" }}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
          >
            <div className="absolute inset-0" aria-hidden="true">
              <Image
                src={NEBULA_B}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover opacity-40"
              />
            </div>
            <motion.dl
              style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
              className="f14-glass relative m-6 grid gap-5 rounded-2xl p-8 sm:m-10"
            >
              {specs.map((spec) => (
                <div key={spec.term} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--f14-line-strong)]">
                    <spec.Icon className="h-4 w-4 text-[var(--f14-cyan)]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-[0.1em] text-[var(--f14-fg-dim)]">
                      {spec.term}
                    </dt>
                    <dd className="truncate text-sm font-medium text-[var(--f14-fg)]">
                      {spec.value}
                    </dd>
                  </div>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p
            className={`${spaceGroteskClassName} mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)]`}
          >
            Vertex 01
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--f14-fg)] sm:text-4xl">
            손끝보다 정교한, 귀 안의 좌표계
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-[var(--f14-fg-muted)]">
            버텍스 01은 머리 움직임을 실시간으로 추적해, 소리의 좌표를
            0.1도 단위로 다시 계산합니다. 걷고, 돌아보고, 눕더라도 소리는
            늘 지정된 자리를 지킵니다.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 * Scenarios
 * ------------------------------------------------------------------- */
const scenarios = [
  {
    Icon: Compass,
    title: "출근길",
    coord: "내비게이션 정면 · 음악 후방",
    desc: "내비게이션 안내는 정면에, 음악은 등 뒤에서 낮게 흐릅니다.",
  },
  {
    Icon: HomeIcon,
    title: "재택근무",
    coord: "회의 정면 · 알림 우상단",
    desc: "화상회의는 정면에, 메시지 알림은 오른쪽 위에서 살짝 울립니다.",
  },
  {
    Icon: Footprints,
    title: "러닝",
    coord: "코칭 상단 · 플레이리스트 하단",
    desc: "페이스 코칭은 머리 위에서, 플레이리스트는 발밑에서 들려옵니다.",
  },
];

function ScenarioCard({
  Icon,
  title,
  coord,
  desc,
  reduced,
  spaceGroteskClassName,
}: {
  Icon: typeof Compass;
  title: string;
  coord: string;
  desc: string;
  reduced: boolean;
  spaceGroteskClassName: string;
}) {
  const tilt = useTilt(reduced ? 0 : 10);
  return (
    <li style={{ perspective: "1000px" }}>
      <motion.article
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        className="f14-glass h-full rounded-2xl p-8"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--f14-line-strong)]">
          <Icon className="h-5 w-5 text-[var(--f14-cyan)]" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-xl font-semibold text-[var(--f14-fg)]">{title}</h3>
        <p
          className={`${spaceGroteskClassName} mt-2 font-mono text-xs text-[var(--f14-fg-dim)]`}
        >
          {coord}
        </p>
        <p className="mt-4 leading-relaxed text-[var(--f14-fg-muted)]">{desc}</p>
      </motion.article>
    </li>
  );
}

function Scenarios({
  spaceGroteskClassName,
  reduced,
}: {
  spaceGroteskClassName: string;
  reduced: boolean;
}) {
  return (
    <section id="scenarios" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-xl">
          <p
            className={`${spaceGroteskClassName} mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)]`}
          >
            Use Case
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--f14-fg)] sm:text-4xl">
            당신의 하루에 자리를 배치하다
          </h2>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.title}
              {...scenario}
              reduced={reduced}
              spaceGroteskClassName={spaceGroteskClassName}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 * Reserve — waitlist form
 * ------------------------------------------------------------------- */
const priorities = [
  { value: "call", label: "통화" },
  { value: "music", label: "음악" },
  { value: "alert", label: "알림" },
];

function Reserve({ spaceGroteskClassName }: { spaceGroteskClassName: string }) {
  const [priority, setPriority] = useState("music");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("success");
  };

  return (
    <section id="reserve" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <p
          className={`${spaceGroteskClassName} mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--f14-cyan)]`}
        >
          Early Access
        </p>
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--f14-fg)] sm:text-4xl">
          가장 먼저, 당신의 방에 좌표를 놓아드립니다
        </h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-[var(--f14-fg-muted)]">
          2026년 4분기 출시 예정입니다. 얼리 액세스 신청자에게는 15% 할인과
          우선 배송 혜택을 드립니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="f14-glass mx-auto mt-10 rounded-3xl p-8 text-left sm:p-10"
        >
          <fieldset>
            <legend className="text-sm font-semibold text-[var(--f14-fg)]">
              우선 배치할 소리를 선택하세요
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {priorities.map((option) => (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={`f14-priority-${option.value}`}
                    name="priority"
                    value={option.value}
                    checked={priority === option.value}
                    onChange={() => setPriority(option.value)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`f14-priority-${option.value}`}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[var(--f14-line-strong)] px-5 text-sm text-[var(--f14-fg-muted)] transition-colors peer-checked:border-[var(--f14-cyan)] peer-checked:text-[var(--f14-fg)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--f14-cyan)]"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="f14-email" className="text-sm font-semibold text-[var(--f14-fg)]">
              이메일 주소
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--f14-fg-dim)]"
                  aria-hidden="true"
                />
                <input
                  id="f14-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="min-h-11 w-full rounded-full border border-[var(--f14-line-strong)] bg-transparent py-2 pl-11 pr-4 text-sm text-[var(--f14-fg)] outline-none transition-colors placeholder:text-[var(--f14-fg-dim)] focus-visible:border-[var(--f14-cyan)]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--f14-violet)] px-6 text-sm font-semibold text-[var(--f14-ink)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                얼리 액세스 신청
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-[var(--f14-cyan)]">
              {status === "success"
                ? "신청이 완료되었습니다. 출시 소식을 가장 먼저 보내드릴게요."
                : ""}
            </p>
          </div>
        </form>

        <p className="mt-6 text-xs text-[var(--f14-fg-dim)]">스팸 없이, 출시 소식만 보내드립니다.</p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
 * Footer
 * ------------------------------------------------------------------- */
function SiteFooter({ spaceGroteskClassName }: { spaceGroteskClassName: string }) {
  const columns = [
    {
      heading: "제품",
      links: [
        { href: "#product", label: "사양" },
        { href: "#scenarios", label: "시나리오" },
        { href: "#reserve", label: "얼리 액세스" },
      ],
    },
    {
      heading: "문의",
      links: [{ href: "mailto:hello@vertex.audio", label: "hello@vertex.audio" }],
    },
  ];

  return (
    <footer className="relative border-t border-[var(--f14-line)] py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-12 sm:grid-cols-[1.2fr_repeat(2,1fr)]">
          <div>
            <p
              className={`${spaceGroteskClassName} flex items-center gap-2 text-lg font-semibold text-[var(--f14-fg)]`}
            >
              <Move3D className="h-5 w-5 text-[var(--f14-cyan)]" aria-hidden="true" />
              VERTEX
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--f14-fg-muted)]">
              소리에 좌표를 부여하는 공간 오디오 시스템.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--f14-fg-dim)]">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-[var(--f14-fg-muted)] transition-colors hover:text-[var(--f14-fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className={`${spaceGroteskClassName} mt-14 flex flex-col gap-2 border-t border-[var(--f14-line)] pt-6 font-mono text-xs text-[var(--f14-fg-dim)] sm:flex-row sm:items-center sm:justify-between`}
        >
          <span>&copy; 2026 VERTEX AUDIO LAB. All rights reserved.</span>
          <span>COORDINATES ENABLED SINCE 2026</span>
        </div>
      </div>
    </footer>
  );
}
