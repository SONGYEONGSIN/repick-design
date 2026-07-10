"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Image from "next/image";
import { Cormorant } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./f15.css";

const cormorant = Cormorant({
  variable: "--font-lc-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const FOCUS_ON_DARK =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lc-ivory)]";
const FOCUS_ON_LIGHT =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lc-black)]";

const NAV_LINKS = [
  { href: "#philosophy", label: "철학" },
  { href: "#object", label: "N°0" },
  { href: "#reservation", label: "예약" },
];

type FormState = {
  name: string;
  email: string;
  code: string;
  message: string;
};

const INITIAL_FORM: FormState = { name: "", email: "", code: "", message: "" };

export default function F15Client() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ["-0.02em", "0.6em"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  function reveal(delay = 0) {
    if (reduced) return {};
    return {
      initial: { y: 28 },
      whileInView: { y: 0 },
      viewport: { once: true, amount: 0.35 },
      transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
    };
  }

  return (
    <div className={`${cormorant.variable} lc-root relative min-h-screen`}>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-[var(--lc-ivory)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--lc-black)] ${FOCUS_ON_LIGHT}`}
      >
        본문으로 건너뛰기
      </a>

      <div
        className="lc-grain pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--lc-line-dark)] bg-[var(--lc-black)]/70 [color-scheme:dark] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
          <a
            href="#hero"
            className={`lc-serif text-lg italic tracking-[0.15em] text-[var(--lc-ivory)] md:text-xl ${FOCUS_ON_DARK}`}
          >
            Maison Lacune
          </a>
          <nav aria-label="주요">
            <ul className="flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-[var(--lc-ivory-dim)] sm:gap-8 sm:text-xs">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={
                      i === NAV_LINKS.length - 1
                        ? `flex min-h-11 items-center rounded-full border border-[var(--lc-brass)] px-4 text-[var(--lc-brass)] transition-colors hover:bg-[var(--lc-brass)] hover:text-[var(--lc-black)] ${FOCUS_ON_DARK}`
                        : `flex min-h-11 items-center transition-colors hover:text-[var(--lc-ivory)] ${FOCUS_ON_DARK}`
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section
          id="hero"
          ref={heroRef}
          className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden [color-scheme:dark]"
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
              alt="어두운 배경 속에서 고개를 살짝 돌린 인물의 실루엣 초상"
              fill
              priority
              sizes="100vw"
              className="lc-ambient object-cover object-[70%_30%] grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--lc-black)] via-[var(--lc-black)]/60 to-[var(--lc-black)]/25" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-32 md:px-10 md:pb-24">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--lc-brass)]">
              Maison Lacune — Haute Parfumerie
            </p>
            <h1 className="mt-6 leading-[0.85]">
              {reduced ? (
                <span className="lc-serif block text-[18vw] italic text-[var(--lc-ivory)] sm:text-[14vw] md:text-[11vw] lg:text-[9vw]">
                  Silence
                </span>
              ) : (
                <motion.span
                  style={{ letterSpacing, opacity: headlineOpacity, y: headlineY }}
                  className="lc-serif block text-[18vw] italic text-[var(--lc-ivory)] sm:text-[14vw] md:text-[11vw] lg:text-[9vw]"
                >
                  Silence
                </motion.span>
              )}
            </h1>
            <p className="mt-8 max-w-md text-base font-light leading-relaxed text-[var(--lc-ivory-dim)] md:text-lg">
              가장 사치스러운 건, 말하지 않는 것이다. 라뀐은 향이 아니라 그 향이
              남기는 여백을 만듭니다.
            </p>
            <div className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[var(--lc-ivory-dim)]">
              <span
                aria-hidden="true"
                className="h-8 w-px origin-top bg-[var(--lc-ivory-dim)] animate-[lc-pulse-line_2.4s_ease-in-out_infinite] motion-reduce:animate-none"
              />
              Scroll
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section
          id="philosophy"
          aria-labelledby="philosophy-heading"
          className="relative bg-[var(--lc-ivory)] py-24 text-[var(--lc-black)] [color-scheme:light] md:py-40"
        >
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-[240px_1fr] md:gap-16 md:px-10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-black)]/60">
                Philosophy
              </span>
              <h2
                id="philosophy-heading"
                className="lc-serif mt-4 text-3xl italic"
              >
                철학
              </h2>
            </div>
            <div className="space-y-8">
              <motion.p
                {...reveal()}
                className="lc-serif max-w-2xl text-2xl italic leading-snug md:text-4xl"
              >
                &ldquo;우리는 아무것도 더하지 않는다.&rdquo;
              </motion.p>
              <motion.p
                {...reveal(0.1)}
                className="max-w-2xl text-base font-light leading-loose text-[var(--lc-black)]/80 md:text-lg"
              >
                남기는 것이, 만드는 것보다 어렵습니다. 라뀐은 노트를 더하는
                대신 지웁니다. 완성이 아니라 여백에서 멈추는 것 — 그것이
                우리가 아는 유일한 사치입니다.
              </motion.p>
              <motion.p
                {...reveal(0.2)}
                className="max-w-2xl text-base font-light leading-loose text-[var(--lc-black)]/80 md:text-lg"
              >
                그래서 라뀐에는 광고가 없습니다. 매장이 없습니다. 가격표도
                없습니다. 오직 예약과, 그 예약을 받아들일지 결정하는 하우스의
                침묵만 있습니다.
              </motion.p>
            </div>
          </div>
        </section>

        {/* The Object */}
        <section
          id="object"
          aria-labelledby="object-heading"
          className="relative bg-[var(--lc-black)] [color-scheme:dark]"
        >
          <div className="relative h-[80svh] w-full overflow-hidden md:h-[100svh]">
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop"
              alt="짙은 배경 위에 놓인 향수병의 클로즈업"
              fill
              sizes="100vw"
              className="object-cover grayscale contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--lc-black)] via-transparent to-[var(--lc-black)]/30" />
            <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 md:px-10 md:pb-16">
              <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 border-t border-[var(--lc-line-dark)] pt-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-brass)]">
                    The Object
                  </span>
                  <h2
                    id="object-heading"
                    className="lc-serif mt-2 text-3xl italic text-[var(--lc-ivory)] md:text-5xl"
                  >
                    N°0 — Silence
                  </h2>
                </div>
                <dl className="flex flex-wrap gap-8 font-mono text-[11px] tracking-widest text-[var(--lc-ivory-dim)]">
                  <div>
                    <dt className="uppercase text-[var(--lc-ivory-dim)]/60">
                      Format
                    </dt>
                    <dd>50ml</dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[var(--lc-ivory-dim)]/60">
                      Edition
                    </dt>
                    <dd>500</dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[var(--lc-ivory-dim)]/60">
                      Atelier
                    </dt>
                    <dd>Paris</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Composition */}
        <section
          id="composition"
          aria-labelledby="composition-heading"
          className="relative bg-[var(--lc-charcoal)] py-24 [color-scheme:dark] md:py-40"
        >
          <div className="mx-auto max-w-[1000px] px-6 md:px-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-brass)]">
              Composition
            </span>
            <h2
              id="composition-heading"
              className="lc-serif mt-4 text-3xl italic text-[var(--lc-ivory)] md:text-5xl"
            >
              구성
            </h2>
            <dl className="mt-16 divide-y divide-[var(--lc-line-dark)]">
              {[
                { tier: "Head", notes: "무화과 잎 · 차가운 철 · 베르가못 껍질" },
                { tier: "Heart", notes: "그레이 앰버 · 젖은 돌 · 아이리스 뿌리" },
                { tier: "Base", notes: "다크 우드 · 침향 · 어둠" },
              ].map((row) => (
                <div
                  key={row.tier}
                  className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <dt className="lc-serif text-2xl italic text-[var(--lc-ivory)] md:text-3xl">
                    {row.tier}
                  </dt>
                  <dd className="text-sm tracking-wide text-[var(--lc-ivory-dim)] sm:text-right md:text-base">
                    {row.notes}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Atelier gallery */}
        <section
          id="atelier"
          aria-labelledby="atelier-heading"
          className="relative bg-[var(--lc-ivory)] py-24 text-[var(--lc-black)] [color-scheme:light] md:py-40"
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-black)]/60">
                  Atelier
                </span>
                <h2
                  id="atelier-heading"
                  className="lc-serif mt-4 text-3xl italic md:text-5xl"
                >
                  아틀리에
                </h2>
              </div>
              <p className="max-w-sm text-sm font-light leading-relaxed text-[var(--lc-black)]/70">
                파리의 작업실에서, 한 시즌에 단 하나의 노트만 완성합니다.
                실패한 배치는 기록되지 않습니다.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6">
              <figure className="relative col-span-2 row-span-2 aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop"
                  alt="정면을 응시하는 인물의 흑백 초상"
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale"
                />
              </figure>
              <figure className="relative col-span-2 aspect-square overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=1200&auto=format&fit=crop"
                  alt="질감이 도드라진 어두운 추상 표면"
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale"
                />
              </figure>
              <figure className="relative col-span-2 row-span-2 aspect-[4/5] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop"
                  alt="걸음을 옮기는 인물의 패션 에디토리얼 컷"
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale"
                />
              </figure>
              <figure className="relative col-span-2 aspect-square overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=1200&auto=format&fit=crop"
                  alt="옷의 주름과 그림자가 강조된 패션 디테일 컷"
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Access / scarcity */}
        <section
          id="access"
          aria-labelledby="access-heading"
          className="relative bg-[var(--lc-black)] py-24 [color-scheme:dark] md:py-40"
        >
          <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_380px] md:items-center md:px-10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-brass)]">
                Access
              </span>
              <h2
                id="access-heading"
                className="lc-serif mt-4 text-3xl italic text-[var(--lc-ivory)] md:text-5xl"
              >
                한정된 침묵
              </h2>
              <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12">
                <li>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[var(--lc-ivory-dim)]/70">
                    Edition
                  </span>
                  <strong className="lc-serif mt-2 block text-4xl italic font-normal text-[var(--lc-ivory)] md:text-5xl">
                    500
                  </strong>
                </li>
                <li>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[var(--lc-ivory-dim)]/70">
                    Release
                  </span>
                  <strong className="lc-serif mt-2 block text-4xl italic font-normal text-[var(--lc-ivory)] md:text-5xl">
                    1 / Year
                  </strong>
                </li>
                <li>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[var(--lc-ivory-dim)]/70">
                    Access
                  </span>
                  <strong className="lc-serif mt-2 block text-3xl italic font-normal text-[var(--lc-ivory)] md:text-4xl">
                    By Appointment
                  </strong>
                </li>
                <li>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[var(--lc-ivory-dim)]/70">
                    Price
                  </span>
                  <strong className="lc-serif mt-2 block text-3xl italic font-normal text-[var(--lc-ivory)] md:text-4xl">
                    묻지 않습니다
                  </strong>
                </li>
              </ul>
            </div>
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-[380px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop"
                alt="차분한 표정으로 카메라를 바라보는 인물의 초상"
                fill
                sizes="(min-width: 768px) 380px, 80vw"
                className="object-cover grayscale"
              />
            </figure>
          </div>
        </section>

        {/* Reservation */}
        <section
          id="reservation"
          aria-labelledby="reservation-heading"
          className="relative bg-[var(--lc-ivory)] py-24 text-[var(--lc-black)] [color-scheme:light] md:py-40"
        >
          <div className="mx-auto max-w-[720px] px-6 md:px-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--lc-black)]/60">
              Reservation
            </span>
            <h2
              id="reservation-heading"
              className="lc-serif mt-4 text-3xl italic md:text-5xl"
            >
              예약 요청
            </h2>
            <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-[var(--lc-black)]/70">
              라뀐은 목록에만 존재합니다. 이름을 남기면, 하우스가 순서를 정해
              연락드립니다.
            </p>

            {status === "submitted" ? (
              <p
                role="status"
                aria-live="polite"
                className="mt-14 border-t border-[var(--lc-line-light)] pt-10 text-lg font-light leading-relaxed"
              >
                요청이 접수되었습니다. 하우스에서 개별적으로 연락드리겠습니다.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-14 space-y-10 border-t border-[var(--lc-line-light)] pt-10"
              >
                <fieldset className="space-y-10 border-0 p-0">
                  <legend className="sr-only">예약 요청 정보 입력</legend>
                  <div>
                    <label
                      htmlFor="lc-name"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--lc-black)]/60"
                    >
                      이름 *
                    </label>
                    <input
                      id="lc-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="성함을 입력해 주세요"
                      className={`mt-3 min-h-11 w-full border-0 border-b border-[var(--lc-black)]/25 bg-transparent pb-3 text-lg font-light text-[var(--lc-black)] placeholder:text-[var(--lc-black)]/30 focus:border-[var(--lc-black)] ${FOCUS_ON_LIGHT}`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lc-email"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--lc-black)]/60"
                    >
                      이메일 *
                    </label>
                    <input
                      id="lc-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`mt-3 min-h-11 w-full border-0 border-b border-[var(--lc-black)]/25 bg-transparent pb-3 text-lg font-light text-[var(--lc-black)] placeholder:text-[var(--lc-black)]/30 focus:border-[var(--lc-black)] ${FOCUS_ON_LIGHT}`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lc-code"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--lc-black)]/60"
                    >
                      초대 코드{" "}
                      <span className="normal-case text-[var(--lc-black)]/40">
                        (선택)
                      </span>
                    </label>
                    <input
                      id="lc-code"
                      name="code"
                      type="text"
                      autoComplete="off"
                      value={form.code}
                      onChange={(e) => updateField("code", e.target.value)}
                      placeholder="코드가 없어도 요청은 접수됩니다"
                      className={`mt-3 min-h-11 w-full border-0 border-b border-[var(--lc-black)]/25 bg-transparent pb-3 text-lg font-light text-[var(--lc-black)] placeholder:text-[var(--lc-black)]/30 focus:border-[var(--lc-black)] ${FOCUS_ON_LIGHT}`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lc-message"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--lc-black)]/60"
                    >
                      메시지{" "}
                      <span className="normal-case text-[var(--lc-black)]/40">
                        (선택)
                      </span>
                    </label>
                    <textarea
                      id="lc-message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="하우스에 전하고 싶은 말이 있다면"
                      className={`mt-3 w-full border-0 border-b border-[var(--lc-black)]/25 bg-transparent pb-3 text-lg font-light text-[var(--lc-black)] placeholder:text-[var(--lc-black)]/30 focus:border-[var(--lc-black)] ${FOCUS_ON_LIGHT}`}
                    />
                  </div>
                </fieldset>
                <button
                  type="submit"
                  className={`group inline-flex min-h-11 items-center gap-3 border border-[var(--lc-black)] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[var(--lc-black)] transition-colors hover:bg-[var(--lc-black)] hover:text-[var(--lc-ivory)] ${FOCUS_ON_LIGHT}`}
                >
                  예약 요청 보내기
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[var(--lc-line-dark)] bg-[var(--lc-black)] px-6 py-12 [color-scheme:dark] md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="lc-serif text-sm italic tracking-[0.1em] text-[var(--lc-ivory-dim)]">
            Maison Lacune
          </p>
          <nav aria-label="푸터">
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-[var(--lc-ivory-dim)]/70">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`flex min-h-11 items-center transition-colors hover:text-[var(--lc-ivory)] ${FOCUS_ON_DARK}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--lc-ivory-dim)]/50">
            © 2026 Maison Lacune. Atelier Paris — Seoul.
          </p>
        </div>
      </footer>
    </div>
  );
}
