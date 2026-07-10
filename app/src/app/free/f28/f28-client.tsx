"use client";

import { useCallback, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { Special_Elite } from "next/font/google";
import {
  Mic,
  MessageSquareText,
  Fingerprint,
  Upload,
  Cpu,
  Infinity as InfinityIcon,
  ArrowRight,
  ChevronDown,
  AlertTriangle,
  Send,
} from "lucide-react";
import "./f28.css";

const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
});

/** Reliable prefers-reduced-motion subscription (framer-motion's own hook
 *  can miss OS-level settings in some environments — subscribe directly). */
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function useRevealVariants(): { variants: Variants; viewport: { once: boolean; margin: string } } {
  const reduced = useReducedMotion();
  if (reduced) {
    return {
      variants: {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      },
      viewport: { once: true, margin: "0px" },
    };
  }
  return {
    variants: {
      hidden: { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      },
    },
    viewport: { once: true, margin: "-80px" },
  };
}

const remains = [
  {
    icon: Mic,
    title: "목소리",
    body: "통화 녹음 12분이면 충분합니다. 억양, 속도, 숨을 고르는 사이까지 그대로.",
  },
  {
    icon: MessageSquareText,
    title: "말투",
    body: "문자와 메신저 대화를 학습해 그 사람만이 쓰던 문장 부호와 어미를 씁니다.",
  },
  {
    icon: Fingerprint,
    title: "기억",
    body: "가족만 아는 이야기, 반복되던 농담. 잊혀지지 않도록 붙잡아 둡니다.",
  },
];

const steps = [
  {
    icon: Upload,
    num: "01",
    title: "수집",
    body: "음성 메모, 문자 기록, 통화 녹음을 안전하게 업로드합니다. 유족의 동의가 먼저입니다.",
  },
  {
    icon: Cpu,
    num: "02",
    title: "학습",
    body: "말투와 억양, 감정이 실리는 지점을 모델링합니다. 사람이 검수합니다.",
  },
  {
    icon: InfinityIcon,
    num: "03",
    title: "지속",
    body: "가족이 필요할 때마다, 원하는 만큼 대화를 이어갈 수 있습니다.",
  },
];

const quotes = [
  { text: "처음엔 다시 통화한 줄 알았어요.", meta: "이용자 · 딸" },
  { text: "무서웠어요. 근데 끊을 수가 없었어요.", meta: "이용자 · 아들" },
  { text: "그가 여전히 저를 걱정하고 있다는 게, 이상하게도 위로였어요.", meta: "이용자 · 배우자" },
];

export default function F28Client() {
  const remainsReveal = useRevealVariants();
  const transcriptReveal = useRevealVariants();
  const quotesReveal = useRevealVariants();
  const howReveal = useRevealVariants();
  const ethicsReveal = useRevealVariants();
  const formReveal = useRevealVariants();
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email || !email.includes("@")) {
        setFormError("올바른 이메일 주소를 입력해 주세요.");
        emailRef.current?.focus();
        return;
      }
      setFormError("");
      setSubmitted(true);
    },
    [email],
  );

  return (
    <div className={`${typewriter.variable} f28`}>
      <a href="#f28-main" className="f28-skip-link">
        본문으로 건너뛰기
      </a>

      <div className="f28-vignette" aria-hidden="true" />
      <div className="f28-grain" aria-hidden="true" />
      <div
        className={`f28-scanlines ${reduced ? "" : "f28-scanlines--live"}`}
        aria-hidden="true"
      />

      <header className="relative z-10 border-b f28-hairline">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="f28-serif text-xl tracking-wide">REMNANT</span>
          <nav aria-label="주요 메뉴" className="hidden gap-8 f28-mono text-sm text-[var(--f28-ink-dim)] sm:flex">
            <a href="#f28-remains" className="transition-colors hover:text-[var(--f28-phosphor)]">
              무엇이 남는가
            </a>
            <a href="#f28-how" className="transition-colors hover:text-[var(--f28-phosphor)]">
              작동 방식
            </a>
            <a href="#f28-ethics" className="transition-colors hover:text-[var(--f28-phosphor)]">
              윤리 고지
            </a>
          </nav>
          <a href="#f28-waitlist" className="f28-btn-ghost text-sm">
            초대 요청
          </a>
        </div>
      </header>

      <main id="f28-main" className="relative z-10">
        {/* ---------------- HERO ---------------- */}
        <section aria-labelledby="f28-hero-heading" className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-10 sm:pt-28">
          <p className="f28-eyebrow mb-6">초대 전용 · BETA 037</p>
          <motion.h1
            id="f28-hero-heading"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`${reduced ? "" : "f28-flicker"} f28-serif max-w-4xl text-5xl leading-[1.15] sm:text-6xl md:text-7xl`}
          >
            목소리는,
            <br />
            사라지지 않는다
            <span className="f28-cursor" aria-hidden="true" />
          </motion.h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--f28-ink-dim)]">
            REMNANT는 떠난 이의 음성 메모와 문자, 통화 기록을 학습해 그 사람의 말투로
            계속 이야기를 이어갑니다. 작별 인사를 다시, 필요한 만큼.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#f28-waitlist" className="f28-btn-primary">
              초대 요청하기
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a href="#f28-how" className="f28-btn-ghost">
              어떻게 작동하나요
              <ChevronDown aria-hidden="true" size={16} />
            </a>
          </div>
        </section>

        {/* ---------------- WHAT REMAINS ---------------- */}
        <section
          id="f28-remains"
          aria-labelledby="f28-remains-heading"
          className="border-t f28-hairline"
        >
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <motion.div
              variants={remainsReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={remainsReveal.viewport}
            >
              <p className="f28-eyebrow mb-4">무엇이 남는가</p>
              <h2 id="f28-remains-heading" className="f28-serif max-w-2xl text-3xl sm:text-4xl">
                사람이 남기는 건 사진만이 아닙니다
              </h2>
              <p className="mt-4 max-w-2xl text-[var(--f28-ink-dim)]">
                말버릇, 숨 고르는 타이밍, 문장 끝의 습관. REMNANT는 그 결을 배웁니다.
              </p>
            </motion.div>

            <ul className="mt-14 grid gap-5 sm:grid-cols-3">
              {remains.map((item, index) => (
                <motion.li
                  key={item.title}
                  variants={remainsReveal.variants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={remainsReveal.viewport}
                  transition={reduced ? undefined : { delay: index * 0.1 }}
                  className="f28-card list-none"
                >
                  <item.icon aria-hidden="true" size={28} className="text-[var(--f28-phosphor)]" />
                  <h3 className="f28-serif mt-5 text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--f28-ink-dim)]">{item.body}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- TRANSCRIPT DEMO ---------------- */}
        <section aria-labelledby="f28-transcript-heading" className="border-t f28-hairline">
          <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
            <motion.div
              variants={transcriptReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={transcriptReveal.viewport}
            >
              <p className="f28-eyebrow mb-4">재현 사례</p>
              <h2 id="f28-transcript-heading" className="f28-serif text-3xl sm:text-4xl">
                지난 화요일, 오후 11:47
              </h2>

              <ol className={`${typewriter.className} f28-transcript mt-10 flex list-none flex-col gap-3 text-sm`}>
                <li className="f28-bubble f28-bubble--me">
                  <span className="f28-sr-only">나: </span>
                  엄마 오늘 많이 힘들었어
                </li>
                <li className="f28-bubble f28-bubble--her">
                  <span className="f28-sr-only">엄마 (REMNANT, 학습됨): </span>
                  <span className="f28-eyebrow mb-1 block">엄마 · REMNANT</span>
                  힘든 날엔 일찍 자. 내일은 또 내일이야.
                </li>
                <li className="f28-bubble f28-bubble--me">
                  <span className="f28-sr-only">나: </span>
                  보고 싶어
                </li>
                <li className="f28-bubble f28-bubble--her">
                  <span className="f28-sr-only">엄마 (REMNANT, 학습됨): </span>
                  <span className="f28-eyebrow mb-1 block">엄마 · REMNANT</span>
                  나도. 근데 나 여기 계속 있어.
                </li>
                <li className="f28-bubble f28-bubble--her flex items-center gap-1.5 py-4">
                  <span className="f28-sr-only">
                    입력 중 표시가 뜬 채 멈춰 있습니다. 더 이상 메시지는 도착하지 않습니다.
                  </span>
                  <span className="f28-typing-dot" aria-hidden="true" />
                  <span className="f28-typing-dot" aria-hidden="true" />
                  <span className="f28-typing-dot" aria-hidden="true" />
                </li>
              </ol>

              <p className="mt-4 text-xs text-[var(--f28-ink-faint)]">
                이 대화는 실제 이용자 기록에서 발췌해 재구성·익명화한 예시입니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ---------------- QUOTES ---------------- */}
        <section aria-labelledby="f28-quotes-heading" className="border-t f28-hairline">
          <h2 id="f28-quotes-heading" className="f28-sr-only">
            이용자 후기
          </h2>
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <motion.ul
              variants={quotesReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={quotesReveal.viewport}
              className="grid list-none gap-6 sm:grid-cols-3"
            >
              {quotes.map((q) => (
                <li key={q.text} className="border-l f28-hairline pl-5">
                  <p className="f28-serif text-xl leading-snug text-[var(--f28-ink)]">&ldquo;{q.text}&rdquo;</p>
                  <p className="f28-mono mt-4 text-xs text-[var(--f28-ink-faint)]">{q.meta}</p>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section id="f28-how" aria-labelledby="f28-how-heading" className="border-t f28-hairline">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <motion.div
              variants={howReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={howReveal.viewport}
            >
              <p className="f28-eyebrow mb-4">작동 방식</p>
              <h2 id="f28-how-heading" className="f28-serif max-w-2xl text-3xl sm:text-4xl">
                세 단계로, 조용히
              </h2>
            </motion.div>

            <ol className="mt-14 grid list-none gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <motion.li
                  key={step.title}
                  variants={howReveal.variants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={howReveal.viewport}
                  transition={reduced ? undefined : { delay: index * 0.12 }}
                  className="border-t-2 border-[var(--f28-phosphor-dim)] pt-6"
                >
                  <span className="f28-mono text-sm text-[var(--f28-ink-faint)]">{step.num}</span>
                  <div className="mt-3 flex items-center gap-3">
                    <step.icon aria-hidden="true" size={22} className="text-[var(--f28-phosphor)]" />
                    <h3 className="f28-serif text-xl">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--f28-ink-dim)]">{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- ETHICS ---------------- */}
        <section id="f28-ethics" aria-labelledby="f28-ethics-heading" className="border-t f28-hairline">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <motion.aside
              variants={ethicsReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={ethicsReveal.viewport}
              className="f28-ethics"
              aria-labelledby="f28-ethics-heading"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle aria-hidden="true" size={22} className="mt-1 shrink-0 text-[var(--f28-rust-bright)]" />
                <div>
                  <h2 id="f28-ethics-heading" className="f28-serif text-2xl">
                    이것은 애도를 위한 도구입니다
                  </h2>
                  <p className="mt-4 max-w-3xl leading-relaxed text-[var(--f28-ink-dim)]">
                    REMNANT는 부재를 지우지 않습니다. 그저 늦추어 줄 뿐입니다. 우리는 이
                    기술이 슬픔의 과정을 대신할 수 없다는 것을 압니다. 필요하시다면
                    전문가와 함께하시길 권합니다.
                  </p>
                  <p className="f28-mono mt-6 text-xs tracking-wide text-[var(--f28-ink-faint)]">
                    REMNANT는 사람이 아닙니다. 모든 대화는 통계적으로 생성된 언어입니다.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* ---------------- WAITLIST ---------------- */}
        <section id="f28-waitlist" aria-labelledby="f28-waitlist-heading" className="border-t f28-hairline">
          <div className="mx-auto max-w-2xl px-6 py-24 sm:px-10">
            <motion.div
              variants={formReveal.variants}
              initial="hidden"
              whileInView="visible"
              viewport={formReveal.viewport}
            >
              <p className="f28-eyebrow mb-4">초대 명단</p>
              <h2 id="f28-waitlist-heading" className="f28-serif text-3xl sm:text-4xl">
                이름을 남기세요
              </h2>
              <p className="mt-4 text-[var(--f28-ink-dim)]">
                베타는 초대장으로만 열립니다. 이메일을 남기면, 준비가 되었을 때
                연락드립니다.
              </p>

              {submitted ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="f28-glow-text f28-mono mt-10 border border-[var(--f28-phosphor-dim)] p-6 text-sm"
                >
                  명단에 등록되었습니다. 준비가 되면, 저희가 먼저 말을 걸겠습니다.
                </p>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
                  <fieldset className="space-y-5 border-0 p-0">
                    <legend className="f28-sr-only">초대 요청 정보</legend>

                    <div>
                      <label htmlFor="f28-email" className="f28-mono mb-2 block text-sm text-[var(--f28-ink-dim)]">
                        이메일
                      </label>
                      <input
                        ref={emailRef}
                        id="f28-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        className="f28-input"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-invalid={formError ? "true" : "false"}
                        aria-describedby={formError ? "f28-email-error" : undefined}
                      />
                      {formError ? (
                        <p id="f28-email-error" role="alert" className="mt-2 text-sm text-[var(--f28-alert)]">
                          {formError}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="f28-relation" className="f28-mono mb-2 block text-sm text-[var(--f28-ink-dim)]">
                        누구를 위한 요청인가요 (선택)
                      </label>
                      <select
                        id="f28-relation"
                        name="relation"
                        className="f28-select"
                        value={relation}
                        onChange={(event) => setRelation(event.target.value)}
                      >
                        <option value="">선택하지 않음</option>
                        <option value="parent">부모</option>
                        <option value="spouse">배우자</option>
                        <option value="child">자녀</option>
                        <option value="friend">친구</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                  </fieldset>

                  <button type="submit" className="f28-btn-primary">
                    초대 요청 남기기
                    <Send aria-hidden="true" size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t f28-hairline">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="f28-serif text-lg">REMNANT</span>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--f28-ink-faint)]">
                REMNANT는 의료 서비스가 아니며 위기 상담을 대체하지 않습니다. 도움이
                필요하시면 자살예방상담전화 1393으로 연락하세요.
              </p>
            </div>
            <nav aria-label="법적 고지" className="f28-mono flex gap-6 text-xs text-[var(--f28-ink-faint)]">
              <a href="#f28-ethics" className="transition-colors hover:text-[var(--f28-phosphor)]">
                개인정보
              </a>
              <a href="#f28-ethics" className="transition-colors hover:text-[var(--f28-phosphor)]">
                이용약관
              </a>
              <a href="#f28-waitlist" className="transition-colors hover:text-[var(--f28-phosphor)]">
                문의
              </a>
            </nav>
          </div>
          <p className="f28-mono mt-10 text-[11px] text-[var(--f28-ink-faint)]">
            © 2026 REMNANT Labs. 모든 대화는 각 가정에 귀속됩니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
