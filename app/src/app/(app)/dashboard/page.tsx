"use client";

import Image from "next/image";
import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion, type Variants } from "framer-motion";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

function IconHome({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function IconSpark({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </svg>
  );
}

function IconHeart({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2.5 4.5 6 4.5c2 0 3.5 1.2 4 2.5.5-1.3 2-2.5 4-2.5 3.5 0 5.2 3.5 3.5 7C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function IconGear({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

function IconBell({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconSearch({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function IconCamera({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.4-2.5h5.2L16 7" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  );
}

function IconHeadphones({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.2" y="14" width="4.8" height="6.5" rx="1.8" />
      <rect x="17" y="14" width="4.8" height="6.5" rx="1.8" />
    </svg>
  );
}

function IconDesk({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 6.5h18" />
      <path d="M5 6.5V19M19 6.5V19M9 6.5v5M15 6.5v5" />
    </svg>
  );
}

function IconBag({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12v2M15 12v2" />
    </svg>
  );
}

/** Attune brand badge — compact size for dark sidebar/header */
function AttuneBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-base font-bold tracking-tight text-zinc-50">
      <span className="rounded-md bg-orange-700 px-1.5 py-0.5 text-[11px] font-semibold text-white font-[family-name:var(--font-geist-mono)]">
        RE:
      </span>
      PICK
    </span>
  );
}

type NavItem = {
  label: string;
  icon: IconComponent;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", icon: IconHome, active: true },
  { label: "For You", icon: IconSpark },
  { label: "Saved", icon: IconHeart },
  { label: "Settings", icon: IconGear },
];

type Stat = {
  label: string;
  value?: number;
  unit?: string;
  delta: string;
  tone: "indigo" | "emerald";
  bars?: number[];
  ring?: number;
};

const stats: Stat[] = [
  {
    label: "Today's Picks",
    value: 12,
    unit: "new",
    delta: "▲ 4",
    tone: "indigo",
    bars: [35, 50, 42, 68, 55, 88, 74],
  },
  {
    label: "Wishlist",
    value: 34,
    unit: "items",
    delta: "▲ 2",
    tone: "indigo",
    bars: [58, 52, 64, 48, 70, 66, 80],
  },
  {
    label: "Total Savings",
    value: 284000,
    unit: "KRW",
    delta: "▲ 38,000",
    tone: "emerald",
    bars: [22, 34, 30, 54, 46, 64, 72],
  },
  {
    label: "AI Match Rate",
    delta: "▲ 3%p",
    tone: "indigo",
    ring: 92,
  },
];

type Reco = {
  name: string;
  match: number;
  price: string;
  condition: string;
  time: string;
  location: string;
  icon: IconComponent;
  tint: string;
  image: string;
  imageAlt: string;
};

const recommendations: Reco[] = [
  {
    name: "Canon AE-1 Film Camera",
    match: 98,
    price: "185,000",
    condition: "Excellent",
    time: "3 days ago",
    location: "Mapo-gu",
    icon: IconCamera,
    tint: "from-indigo-500/40 to-zinc-900 text-indigo-200",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=200&q=75",
    imageAlt: "Canon film camera on a white background",
  },
  {
    name: "Sony WH-1000XM4 Headphones",
    match: 95,
    price: "142,000",
    condition: "Very Good",
    time: "5 hours ago",
    location: "Seongdong-gu",
    icon: IconHeadphones,
    tint: "from-violet-500/40 to-zinc-900 text-violet-200",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=75",
    imageAlt: "Black over-ear headphones on a yellow background",
  },
  {
    name: "Wooden Low Desk",
    match: 91,
    price: "68,000",
    condition: "Very Good",
    time: "1 day ago",
    location: "Eunpyeong-gu",
    icon: IconDesk,
    tint: "from-teal-500/40 to-zinc-900 text-teal-200",
    image: "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?auto=format&fit=crop&w=200&q=75",
    imageAlt: "Desk lamp on a wood-textured desk",
  },
  {
    name: "Vintage Canvas Backpack",
    match: 88,
    price: "45,000",
    condition: "Good",
    time: "2 days ago",
    location: "Gangnam-gu",
    icon: IconBag,
    tint: "from-amber-500/40 to-zinc-900 text-amber-200",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=75",
    imageAlt: "Dark navy canvas backpack standing on the floor",
  },
];

type Feed = { text: string; time: string; tone: "indigo" | "emerald" | "amber" };

const notifications: Feed[] = [
  { text: "AI found 3 new matches", time: "3 minutes ago", tone: "indigo" },
  { text: "Price dropped ₩15,000 on a saved item", time: "42 minutes ago", tone: "emerald" },
  { text: "The seller sent you a message", time: "2 hours ago", tone: "amber" },
];

const activities: Feed[] = [
  { text: "Added the Canon AE-1 to your saved list", time: "Today 09:12", tone: "indigo" },
  { text: "Viewed 3 headphone listings", time: "Yesterday 21:04", tone: "indigo" },
  { text: "Compared desk listing prices", time: "Yesterday 14:30", tone: "indigo" },
];

const dotTone: Record<Feed["tone"], string> = {
  indigo: "bg-indigo-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
};

/** Counts up from 0 to target. Jumps straight to the final value if reduceMotion. */
function useCountUp(target: number, reduceMotion: boolean) {
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, reduceMotion]);

  return reduceMotion ? target : value;
}

function AnimatedNumber({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const count = useCountUp(value, reduceMotion);
  return <>{Math.round(count).toLocaleString("ko-KR")}</>;
}

function AiMatchRing({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const count = useCountUp(value, reduceMotion);
  const rounded = Math.round(count);
  return (
    <motion.div
      role="img"
      aria-label={`AI match rate ${value}%, up from last week`}
      className="relative h-12 w-12 shrink-0 rounded-full"
      style={{ background: `conic-gradient(#818cf8 ${count * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
      initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
    >
      <div aria-hidden="true" className="absolute inset-[3px] rounded-full bg-zinc-950" />
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold tabular-nums text-zinc-100">
        {rounded}%
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = !!prefersReducedMotion;

  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const toggleLiked = (name: string) => setLiked((prev) => ({ ...prev, [name]: !prev[name] }));

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-indigo-400";

  const sidebarContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.06, delayChildren: reduceMotion ? 0 : 0.05 },
    },
  };
  const sidebarItem: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -8 },
    show: { opacity: 1, x: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: EASE } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE } },
  };
  const staggerContainer = (stagger = 0.08): Variants => ({
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: reduceMotion ? 0 : 0.05 },
    },
  });

  const hoverLiftCard = reduceMotion ? undefined : { y: -4 };
  const hoverLiftSmall = reduceMotion ? undefined : { y: -2 };
  const tapScale = reduceMotion ? undefined : { scale: 0.96 };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside aria-label="Main sidebar" className="hidden border-r border-white/5 px-4 py-6 lg:flex lg:flex-col lg:justify-between">
        <div>
          <motion.div
            className="px-2"
            initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
          >
            <AttuneBadge />
          </motion.div>
          <motion.nav
            aria-label="Main menu"
            className="mt-8 flex flex-col gap-1"
            variants={sidebarContainer}
            initial="hidden"
            animate="show"
          >
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href="#"
                variants={sidebarItem}
                whileHover={reduceMotion ? undefined : { x: 3 }}
                aria-current={item.active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] ${focusRing} ${
                  item.active
                    ? "bg-white/10 text-zinc-50"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${item.active ? "text-indigo-300" : "text-zinc-500 group-hover:text-zinc-300"}`}
                />
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        </div>
        <motion.div
          className="rounded-xl border border-white/10 bg-white/5 p-3"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE, delay: reduceMotion ? 0 : 0.3 }}
        >
          <p className="text-xs font-medium text-zinc-300">Pro Plan</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Real-time alerts · Unlimited matching</p>
          <div aria-hidden="true" className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-2/3 origin-left rounded-full bg-indigo-400"
              initial={{ scaleX: reduceMotion ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE, delay: reduceMotion ? 0 : 0.5 }}
            />
          </div>
        </motion.div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <motion.header
          className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/85 px-4 backdrop-blur sm:px-6 lg:px-8"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
        >
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2 lg:hidden">
              <AttuneBadge />
            </div>
            <p className="hidden text-xs font-medium text-zinc-400 lg:block">Dashboard / Home</p>
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                className={`hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200 active:scale-[0.98] sm:flex ${focusRing}`}
              >
                <IconSearch className="h-3.5 w-3.5" />
                <span>Search</span>
                <kbd className="ml-4 rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px] text-zinc-400">
                  ⌘K
                </kbd>
              </button>
              <button
                type="button"
                aria-label="Notifications (unread)"
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-zinc-200 active:scale-[0.98] ${focusRing}`}
              >
                <IconBell className="h-4 w-4" />
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 motion-safe:animate-pulse"
                />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 font-mono text-xs font-semibold text-white">
                M
              </div>
            </div>
          </div>
          <nav aria-label="Main menu (mobile)" className="-mx-1 flex gap-1 overflow-x-auto pb-3 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${focusRing} ${
                  item.active
                    ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-300"
                    : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </nav>
        </motion.header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div initial="hidden" animate="show" variants={staggerContainer(0.08)}>
            <motion.h1
              variants={fadeUp}
              className="text-[clamp(1.375rem,1.05rem+1.1vw,1.75rem)] font-semibold tracking-[-0.01em] text-zinc-50"
            >
              Hello, Minjun
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-1 text-sm text-zinc-400">
              July 7 · Finding pieces that match your taste, today too
            </motion.p>
          </motion.div>

          <motion.section
            aria-label="Summary stats"
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={hoverLiftCard}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    {stat.label}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[11px] tabular-nums ${
                      stat.tone === "emerald" ? "text-emerald-400" : "text-indigo-300"
                    }`}
                  >
                    {stat.delta}
                  </span>
                </div>

                {stat.ring !== undefined ? (
                  <div className="mt-3 flex items-center gap-3">
                    <AiMatchRing value={stat.ring} reduceMotion={reduceMotion} />
                    <p className="text-xs leading-snug text-zinc-400">
                      vs. last week
                      <br />
                      match accuracy up
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-zinc-50 sm:text-3xl">
                      <AnimatedNumber value={stat.value ?? 0} reduceMotion={reduceMotion} />
                      {stat.unit && (
                        <span className="ml-1 font-sans text-xs font-normal text-zinc-400">{stat.unit}</span>
                      )}
                    </p>
                    <div
                      role="img"
                      aria-label={`Last 7 days ${stat.label} trend, ${stat.delta}`}
                      className="mt-3 flex h-6 items-end gap-0.5"
                    >
                      {stat.bars?.map((h, i) => (
                        <motion.div
                          key={i}
                          aria-hidden="true"
                          className={`w-full origin-bottom rounded-sm ${
                            stat.tone === "emerald" ? "bg-emerald-400/50" : "bg-indigo-400/50"
                          }`}
                          style={{ height: `${h}%` }}
                          initial={{ scaleY: reduceMotion ? 1 : 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={VIEWPORT}
                          transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE, delay: reduceMotion ? 0 : i * 0.04 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <motion.section
              aria-labelledby="reco-heading"
              className="min-w-0"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <motion.div variants={fadeUp} className="flex items-center justify-between">
                <h2 id="reco-heading" className="text-base font-semibold text-zinc-100">
                  Today's AI Recommendations
                </h2>
                <a
                  href="#"
                  className={`rounded text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 ${focusRing}`}
                >
                  View all →
                </a>
              </motion.div>
              <motion.p variants={fadeUp} className="mt-1 text-xs text-zinc-400">
                New picks found today, based on what you like
              </motion.p>

              <div className="mt-4 flex flex-col gap-3">
                {recommendations.map((item) => (
                  <motion.article
                    key={item.name}
                    variants={fadeUp}
                    whileHover={hoverLiftSmall}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/20 sm:gap-4 sm:p-4"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-950 bg-gradient-to-br ${item.tint}`}
                      >
                        <item.icon className="h-2.5 w-2.5" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="truncate text-sm font-medium text-zinc-100">{item.name}</h3>
                        <span className="shrink-0 rounded-full bg-indigo-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-indigo-300">
                          {item.match}% match
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        Condition {item.condition} · {item.time} · {item.location}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums text-zinc-50 sm:text-base">
                        ₩{item.price}
                      </p>
                      <motion.button
                        type="button"
                        whileTap={tapScale}
                        aria-pressed={!!liked[item.name]}
                        aria-label={
                          liked[item.name] ? `Remove ${item.name} from saved` : `Save ${item.name}`
                        }
                        onClick={() => toggleLiked(item.name)}
                        className={`mt-1.5 inline-flex min-h-8 items-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors ${focusRing} ${
                          liked[item.name] ? "text-rose-400" : "text-zinc-400 hover:text-rose-400"
                        }`}
                      >
                        <IconHeart className="h-3.5 w-3.5" />
                        Save
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            <motion.aside
              aria-label="Recent activity and notifications"
              className="flex flex-col gap-6"
              variants={staggerContainer(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <motion.section variants={fadeUp} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">Notifications</h2>
                <ul className="mt-3 space-y-3">
                  {notifications.map((n, i) => (
                    <li key={n.text} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotTone[n.tone]} ${
                          i === 0 ? "motion-safe:animate-pulse" : ""
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-300">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              <motion.section variants={fadeUp} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">Recent Activity</h2>
                <ul className="mt-3 space-y-3">
                  {activities.map((a) => (
                    <li key={a.text} className="flex gap-2.5">
                      <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotTone[a.tone]}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-300">{a.text}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{a.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </motion.aside>
          </div>
        </main>
      </div>
    </div>
  );
}
