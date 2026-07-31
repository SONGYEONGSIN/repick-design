"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Quote,
  Menu,
  X,
  Check,
  ChevronDown,
} from "lucide-react";

const MotionLink = motion.create(Link);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;

/**
 * Brand mark — a tuning motif, which is literally what the name means: the product calibrates to
 * your taste. Drawn from the icon set rather than an image file so it stays crisp at any size and
 * needs no asset pipeline. Decorative: the accessible name lives on the surrounding link/heading.
 */
function AttuneMark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white ${
        tone === "dark" ? "bg-orange-600" : "bg-orange-700"
      }`}
    >
      <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#showcase", label: "Showcase" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

const TRUST_LOGOS = ["IT Today", "Outstanding", "Careerly", "Monthly Design", "Remember"];

const STEPS = [
  {
    icon: Sparkles,
    title: "We learn your taste",
    desc: "Based on saved items, liked styles, and purchase history, AI builds a taste profile that's uniquely yours.",
  },
  {
    icon: SlidersHorizontal,
    title: "We narrow down tens of thousands",
    desc: "Weighing size, condition, budget, and brand, we pinpoint only the items worth buying right now.",
  },
  {
    icon: ShieldCheck,
    title: "Receive it with confidence",
    desc: "We only match items verified through professional inspection and true-to-size photos.",
  },
];

const COMPARISON_ROWS = [
  {
    label: "Search time",
    direct: "You dig through dozens of listings across multiple apps yourself",
    repick: "AI narrows it down to items that match your taste first",
  },
  {
    label: "Condition check",
    direct: "You judge from photos alone — the real condition is a surprise until it arrives",
    repick: "Check the inspection team's true-to-size photos and grade upfront",
  },
  {
    label: "Price trust",
    direct: "Every seller names a different price",
    repick: "Prices are set transparently based on market data",
  },
  {
    label: "Size matching",
    direct: "You guess from the listed size with no true measurements",
    repick: "We automatically compare it against your size data",
  },
  {
    label: "Post-purchase satisfaction",
    direct: "If it doesn't fit, you resell it or shove it in a drawer",
    repick: "Since every item is inspected, there's little chance you'll regret it",
  },
];

const FAQS = [
  {
    question: "How is Attune different from other secondhand platforms?",
    answer:
      "You don't have to search yourself. AI learns your taste, size, and budget, then shows you only the items worth buying right now. Less scrolling, more buying.",
  },
  {
    question: "How are prices set?",
    answer:
      "Prices are calculated from market data and verified condition grades. We show the original price and discount rate transparently on every listing.",
  },
  {
    question: "How can I check an item's condition?",
    answer:
      "Our professional inspection team checks true measurements and any flaws in person, then provides a grade along with true-to-size photos. You can gauge the condition without seeing it in person.",
  },
  {
    question: "How does taste learning work?",
    answer:
      "Your likes, skips, and purchase history update your taste profile in real time. The more you use it, the more accurate the recommendations get.",
  },
  {
    question: "Can I return or get a refund?",
    answer:
      "If the item differs from its description, we support returns and refunds. You can find the detailed process anytime in the Support Center under My Page.",
  },
];

const PRODUCTS = [
  {
    title: "Vintage Wool Coat",
    brand: "Aureum Vintage",
    price: "₩89,000",
    original: "₩148,000",
    discount: 40,
    match: 96,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    alt: "Coats neatly hung on a clothing rack",
  },
  {
    title: "Leather Crossbody Bag",
    brand: "Atelier Noir",
    price: "₩62,000",
    original: "₩120,000",
    discount: 48,
    match: 91,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "A leather crossbody bag and accessories laid on the floor",
  },
  {
    title: "Classic Sneakers",
    brand: "Runway Archive",
    price: "₩54,000",
    original: "₩98,000",
    discount: 45,
    match: 88,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "A pair of white classic sneakers",
  },
  {
    title: "Silk Blouse",
    brand: "Maison Blanche",
    price: "₩47,000",
    original: "₩89,000",
    discount: 47,
    match: 93,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    alt: "A fashion shot of a person wearing a silk blouse",
  },
];

const STATS = [
  { label: "Total resales", value: "128,000+" },
  { label: "Average match accuracy", value: "94%" },
  { label: "User satisfaction", value: "4.9 / 5" },
];

const TESTIMONIALS = [
  {
    quote:
      "I had 300 saved items piling up, but with Attune I only see things I'd actually buy.",
    name: "Kim Do-yoon",
    role: "Freelance designer",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "The condition grading is so accurate I buy without worrying about returns.",
    name: "Lee Seo-hyun",
    role: "Marketer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "My time spent hunting for vintage pieces dropped to a quarter.",
    name: "Park Ji-min",
    role: "Photographer",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Showcase", href: "#showcase" },
      { label: "Download the app", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Newsroom", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Customer support", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

export default function LandingClient() {
  const prefersReducedMotion = useReducedMotion();
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Mobile navigation drawer
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (mobileNavOpen) {
      closeButtonRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  // Hero entrance
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: EASE },
    },
  };
  const heroImageVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.97 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.9, ease: EASE, delay: prefersReducedMotion ? 0 : 0.3 },
    },
  };
  const badgeVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16, scale: prefersReducedMotion ? 1 : 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE, delay: prefersReducedMotion ? 0 : 0.75 },
    },
  };
  const secondaryImageVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: EASE, delay: prefersReducedMotion ? 0 : 0.55 },
    },
  };

  // Scroll reveal (generic)
  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE },
    },
  };
  const staggerContainer = (stagger = 0.1): Variants => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  });

  // Microinteractions (guarded for reduced motion)
  const hoverLiftCard = prefersReducedMotion ? undefined : { y: -6 };
  const hoverLiftSmall = prefersReducedMotion ? undefined : { y: -3 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#main-content"
            aria-label="Attune home"
            className={`inline-flex items-center gap-2 rounded-md text-2xl font-bold tracking-tight text-stone-900 ${focusRing}`}
          >
            <AttuneMark />
            Attune
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition motion-safe:hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0 active:bg-stone-950 md:inline-flex ${focusRing}`}
            >
              Start for free
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 md:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              key="mobile-nav-overlay"
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-stone-900/50 md:hidden"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            />
            <motion.div
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 border-l border-stone-200 bg-stone-50 px-6 py-6 shadow-2xl md:hidden"
              initial={{ x: prefersReducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : "100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-stone-900">Menu</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 ${focusRing}`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Mobile main navigation" className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`rounded-md px-2 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 ${focusRing}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
              >
                Start for free
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content" className="bg-stone-50">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 sm:pt-24 sm:pb-36 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p
                variants={heroItem}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-600 shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-orange-700" aria-hidden="true" />
                AI taste-matching recommerce
              </motion.p>
              <motion.h1
                variants={heroItem}
                id="hero-heading"
                className="mt-6 text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-sans leading-[1.05] tracking-[-0.01em] text-stone-900"
              >
                Your taste,
                <br className="hidden sm:block" />
                AI picks it <em className="text-orange-700 not-italic font-semibold">again</em>, just for you
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-600"
              >
                AI that has learned your style, size, and budget curates only
                what&apos;s right for you, right now, from tens of thousands of
                listings. No more endless scrolling — just choices you can trust.
              </motion.p>
              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
                >
                  Start for free
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <motion.a
                  href="#showcase"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100 ${focusRing}`}
                >
                  Explore the showcase
                </motion.a>
              </motion.div>
            </motion.div>

            <div ref={heroRef} className="relative mx-auto mt-20 max-w-5xl">
              <motion.div
                variants={heroImageVariant}
                initial="hidden"
                animate="show"
                style={prefersReducedMotion ? undefined : { y: parallaxY }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-stone-200 shadow-2xl shadow-stone-900/10 sm:aspect-[16/9]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
                  alt="Fashion photo of a model in a knit coat looking directly at the camera"
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  preload
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                variants={badgeVariant}
                initial="hidden"
                animate="show"
                className="absolute -top-6 right-6 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold tabular-nums text-stone-900">96% AI match</span>
                  <span className="text-stone-500">Matches your taste</span>
                </span>
              </motion.div>

              <motion.div
                variants={secondaryImageVariant}
                initial="hidden"
                animate="show"
                className="absolute -bottom-10 -left-6 hidden h-64 w-52 overflow-hidden rounded-2xl border-4 border-stone-50 shadow-xl sm:block"
              >
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                  alt="A clothing rack with garments in various colors"
                  width={208}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust logos */}
        <section aria-labelledby="trust-heading" className="border-b border-stone-200 bg-white">
          <motion.div
            className="mx-auto max-w-7xl px-6 py-10 lg:px-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <h2
              id="trust-heading"
              className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-stone-600"
            >
              As featured in
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {TRUST_LOGOS.map((name) => (
                <li
                  key={name}
                  className="text-lg font-semibold text-stone-500 font-sans"
                >
                  {name}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">How it works</p>
            <h2
              id="how-heading"
              className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
            >
              Just three steps
            </h2>
            <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
              Leave the searching and filtering to AI. You just receive what you&apos;ll love.
            </p>
          </motion.div>

          <motion.ol
            className="mt-16 grid gap-8 sm:grid-cols-3"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                whileHover={hoverLiftSmall}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group rounded-3xl border border-stone-200 bg-white p-8"
              >
                <span
                  aria-hidden="true"
                  className="block text-sm font-semibold tabular-nums text-stone-300 font-sans"
                >
                  0{index + 1}
                </span>
                <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-stone-50 transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-stone-600">{step.desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* Comparison: direct buying vs Attune */}
        <section id="comparison" aria-labelledby="comparison-heading" className="border-t border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Buying it yourself vs. Attune</p>
              <h2
                id="comparison-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                Same secondhand, a different experience
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                End the wasted searching and switch to verified choices.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 max-w-4xl overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">Comparison of buying secondhand directly versus using Attune</caption>
                <thead>
                  <tr className="border-b border-stone-200">
                    <th scope="col" className="w-1/3 px-6 py-5 text-sm font-semibold text-stone-500">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-5 text-sm font-semibold text-stone-500">
                      Buying it yourself
                    </th>
                    <th scope="col" className="bg-orange-50/60 px-6 py-5 text-sm font-semibold text-orange-800">
                      Buying with Attune
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="px-6 py-5 text-sm font-semibold text-stone-900">
                        {row.label}
                      </th>
                      <td className="px-6 py-5 text-sm text-stone-600">
                        <span className="flex items-start gap-2">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                          {row.direct}
                        </span>
                      </td>
                      <td className="bg-orange-50/40 px-6 py-5 text-sm text-stone-800">
                        <span className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                          {row.repick}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Features</p>
              <h2
                id="features-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                Reference-grade precision, made for one person
              </h2>
            </motion.div>

            <div className="mt-16 space-y-24">
              {/* Feature 1: text left, image right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-3xl">
                    AI that reads your taste
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                    It learns from your likes, skips, and purchases in real
                    time, continually refining your taste profile. The more
                    you use it, the more accurate it gets.
                  </p>
                  <a
                    href="#how-it-works"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    See how taste analysis works
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                  <Image
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"
                    alt="Rows of garments in various colors hanging on a rack"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Feature 2: image left, text right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5 lg:order-1">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                    alt="A clothing rack of pastel-toned vintage garments"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
                <div className="lg:order-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-3xl">
                    We cut out the unnecessary browsing
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                    Out of tens of thousands of listings, items that don&apos;t fit
                    your criteria are filtered out automatically — leaving
                    only what&apos;s curated for you.
                  </p>
                  <a
                    href="#showcase"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    See our filtering criteria
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </motion.div>

              {/* Feature 3: text left, image right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-3xl">
                    Verified condition, transparent pricing
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                    With condition grades verified by a professional
                    inspection team and market-based pricing, you can buy
                    with confidence without seeing the item in person.
                  </p>
                  <a
                    href="#testimonials"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    Check our inspection standards
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                  <Image
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
                    alt="Close-up photo of a leather crossbody bag and accessories"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section id="showcase" aria-labelledby="showcase-heading" className="border-t border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Showcase</p>
              <h2
                id="showcase-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                Re-picked for you, right now
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">Here&apos;s what AI matched for you this week.</p>
            </motion.div>

            <motion.ul
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {PRODUCTS.map((product) => {
                const isLiked = !!likedProducts[product.title];
                return (
                <motion.li
                  key={product.title}
                  variants={fadeUp}
                  whileHover={hoverLiftCard}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group overflow-hidden rounded-3xl border border-stone-200 bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold tabular-nums text-stone-900 shadow-sm backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                      {product.match}% AI match
                    </span>
                    <motion.button
                      type="button"
                      aria-label={`${product.title} ${isLiked ? "remove from favorites" : "add to favorites"}`}
                      aria-pressed={isLiked}
                      onClick={() => toggleLike(product.title)}
                      whileTap={tapButton}
                      className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition motion-safe:hover:scale-110 hover:text-orange-700 ${focusRing} ${isLiked ? "text-orange-700" : "text-stone-700"}`}
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
                    </motion.button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-stone-600">{product.brand}</p>
                    <h3 className="mt-1 text-base font-semibold text-stone-900">{product.title}</h3>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2 tabular-nums">
                      <span className="text-lg font-semibold text-stone-900">{product.price}</span>
                      <span className="text-sm text-stone-500 line-through">{product.original}</span>
                      <span className="text-sm font-semibold text-orange-700">-{product.discount}%</span>
                    </div>
                  </div>
                </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" aria-labelledby="testimonials-heading" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Reviews</p>
              <h2
                id="testimonials-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                The discerning use it first
              </h2>
            </motion.div>

            <motion.dl
              className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 border-y border-stone-200 py-10 text-center sm:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}>
                  <dt className="text-sm text-stone-500">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-stone-900 font-sans">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.ul
              className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {TESTIMONIALS.map((t) => (
                <motion.li
                  key={t.name}
                  variants={fadeUp}
                  whileHover={hoverLiftSmall}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-3xl border border-stone-200 bg-stone-50 p-8"
                >
                  <Quote className="h-6 w-6 text-orange-700" aria-hidden="true" />
                  <blockquote className="mt-4 font-sans text-xl leading-snug tracking-[-0.01em] text-stone-800">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figure className="mt-6 flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={`${t.name}'s profile photo`}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <figcaption>
                      <span className="block text-sm font-semibold text-stone-900">{t.name}</span>
                      <span className="block text-sm text-stone-500">{t.role}</span>
                    </figcaption>
                  </figure>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="border-t border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">FAQ</p>
              <h2
                id="faq-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-900"
              >
                Answers before you even ask
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                For anything else, you can check with our support center right away.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 max-w-3xl divide-y divide-stone-200 overflow-hidden rounded-3xl border border-stone-200 bg-white"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {FAQS.map((item) => (
                <motion.div key={item.question} variants={fadeUp}>
                  <details className="group px-6 py-5 sm:px-8">
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-semibold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                    >
                      {item.question}
                      <ChevronDown
                        className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 motion-safe:group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-stone-600">{item.answer}</p>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" aria-labelledby="cta-heading" className="mx-6 my-24 lg:mx-8">
          <div className="relative isolate overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80"
                alt="Interior of a vintage clothing store lined with racks of garments"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/75" />
            </div>
            <motion.div
              className="relative mx-auto max-w-2xl px-6 py-24 text-center sm:py-32"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <h2
                id="cta-heading"
                className="text-balance text-[clamp(2rem,4vw,3rem)] font-sans leading-[1.1] tracking-[-0.01em] text-stone-50"
              >
                Share your taste today,
                <br />
                and get the first item AI has <em className="text-orange-300 not-italic font-semibold">re-picked</em> for you
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-300">Sign-up takes one minute. Cancel anytime.</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  Start for free
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <motion.a
                  href="#features"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  Revisit the features
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-stone-50">
                <AttuneMark tone="dark" />
                Attune
              </p>
              <p className="mt-3 max-w-xs text-sm text-stone-400">
                The recommerce platform where AI learns your taste and re-picks only the secondhand items that fit you.
              </p>
              <ul className="mt-6 flex gap-4 text-sm">
                <li>
                  <a
                    href="https://instagram.com/attune"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://threads.net/attune"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Threads
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/attune"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-semibold text-stone-50">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={`rounded-md text-sm text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-sm text-stone-400 sm:flex-row">
            {/* "Copyright", not the U+00A9 glyph: that codepoint is Extended_Pictographic, so the
                `no-emoji` rule in `scripts/dash-static-check.mjs` hard-fails on it — and the gate
                runs that check over every .tsx under the route it covers. */}
            <p>Copyright 2026 Attune. All rights reserved.</p>
            <ul className="flex gap-6">
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
