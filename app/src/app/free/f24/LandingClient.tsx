"use client";

import { useCallback, useId, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  Star,
  Mail,
  ArrowRight,
  Truck,
  Camera,
  ShieldCheck,
  Sparkles,
  Dices,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* prefers-reduced-motion — matchMedia 직접 구독 (framer-motion 내장   */
/* useReducedMotion() 훅의 미감지 이슈 회피용 커스텀 구현)              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* 데이터                                                              */
/* ------------------------------------------------------------------ */

const TICKER_ITEMS = [
  "극한의 맛 아니면 안 함",
  "순한맛 사절",
  "매주 화요일, 새로운 지옥이 열린다",
  "먹어본 적 없는 맛을 정기구독하다",
  "환불 안 됨, 후회도 안 됨",
];

interface FlavorItem {
  id: number;
  title: string;
  tag: string;
  image: string;
  alt: string;
}

const FLAVORS: FlavorItem[] = [
  {
    id: 1,
    title: "속불 토마토 크림 파스타",
    tag: "매운맛 7",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    alt: "바질 잎이 올라간 토마토 파스타를 클로즈업으로 담은 사진",
  },
  {
    id: 2,
    title: "탄맛 흑마늘 스모크버거",
    tag: "훈연 지수 9",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    alt: "치즈와 채소가 겹겹이 올라간 두툼한 버거 사진",
  },
  {
    id: 3,
    title: "청양크림 마제소바",
    tag: "매운맛 8",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c",
    alt: "젓가락으로 면을 들어올리는 국수 그릇 사진",
  },
  {
    id: 4,
    title: "발효 끝판왕 반상",
    tag: "발효 6개월",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    alt: "여러 그릇의 요리가 차려진 상을 위에서 내려다본 사진",
  },
  {
    id: 5,
    title: "인도식 카레 극한 블렌드",
    tag: "매운맛 10",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    alt: "다양한 색의 향신료 가루가 담긴 그릇들 사진",
  },
  {
    id: 6,
    title: "이스탄불 스파이스 원정",
    tag: "한정 30인분",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
    alt: "향신료 자루들이 진열된 시장 풍경 사진",
  },
];

const CARD_ROTATIONS = [
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-2",
  "rotate-1",
];

const PROCESS_STEPS = [
  {
    icon: Sparkles,
    title: "화요일 자정",
    desc: "셰프팀이 '이번 주의 맛'을 극비로 결정합니다. 아무도 미리 알 수 없어요.",
  },
  {
    icon: Truck,
    title: "수요일",
    desc: "콜드체인으로 반조리 상태 밀키트가 출발합니다.",
  },
  {
    icon: Camera,
    title: "목요일",
    desc: "도착 후 15분 조리, 인증샷을 올리면 다음 주 25% 할인.",
  },
  {
    icon: ShieldCheck,
    title: "그래도 못 먹겠다면",
    desc: "남은 절반은 '순한맛 긴급 키트'로 무료 교환해드려요 (구독당 1회).",
  },
];

interface Testimonial {
  name: string;
  weeks: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "정OO",
    weeks: "4주차 구독",
    quote: "정신 차려보니 국물까지 다 마셨어요. 왜 자꾸 생각나는 건지 모르겠습니다.",
  },
  {
    name: "이OO",
    weeks: "7주차 구독",
    quote: "매운맛 만렙인 줄 알았는데 3주차에 무릎 꿇었습니다. 그래도 재구독은 했어요.",
  },
  {
    name: "박OO",
    weeks: "2주차 구독",
    quote: "순한맛 긴급 키트 덕분에 살았습니다. 이 배려 하나로 팬이 됐어요.",
  },
];

interface FateItem {
  name: string;
  level: number;
  note: string;
}

const FATE_POOL: FateItem[] = [
  { name: "악마의 불티라미수", level: 9, note: "달콤한데 눈물이 남" },
  { name: "고스트페퍼 꿀타래", level: 10, note: "역대 최다 컴플레인 맛" },
  { name: "발효 3년 청국장 초콜릿", level: 6, note: "호불호 그 자체" },
  { name: "훈제 흑마늘 캐러멜", level: 5, note: "은근 중독됨" },
  { name: "청양 하바네로 아이스크림", level: 8, note: "머리가 띵해짐" },
  { name: "불짬뽕 크림 리조또", level: 9, note: "국물까지 흡입 주의" },
  { name: "훈연 스카치보넷 젤리", level: 10, note: "재입고 요청 1위" },
  { name: "탄내나는 마라 초콜릿바", level: 7, note: "마니아 전용" },
];

const SPICE_LABELS = [
  "에어컨 필요없음",
  "이 정도는 국룰",
  "슬슬 코끝이 뜨겁다",
  "땀이 송글송글",
  "물 마시면 지는 거다",
  "이마에 땀 한 줄기",
  "숨이 가빠온다",
  "포기하고 싶다",
  "응급실 각",
  "이건 사람이 먹는 게 아니다",
];

/* ------------------------------------------------------------------ */
/* 재사용 컴포넌트                                                     */
/* ------------------------------------------------------------------ */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc93c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#120c0a]";

function Reveal({
  children,
  className,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Marquee({ reducedMotion }: { reducedMotion: boolean }) {
  const content = TICKER_ITEMS.join("   ✦   ") + "   ✦   ";
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 border-[#ff3b1f] bg-[#120c0a] py-2"
    >
      <motion.div
        className="flex w-max gap-4 whitespace-nowrap text-sm font-bold tracking-[0.25em] text-[#ffc93c] uppercase"
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 24, repeat: Infinity, ease: "linear" }
        }
      >
        <span>{content}</span>
        <span>{content}</span>
      </motion.div>
    </div>
  );
}

function SpiceGauge({
  level,
  max = 10,
  reducedMotion,
  labelId,
  size = 140,
  fontDisplayEn,
}: {
  level: number;
  max?: number;
  reducedMotion: boolean;
  labelId: string;
  size?: number;
  fontDisplayEn: string;
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(level / max, 0), 1);
  const offset = circumference * (1 - pct);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
        role="img"
        aria-labelledby={labelId}
      >
        <title id={labelId}>{`매운지수 ${max}단계 중 ${level}단계`}</title>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#3a241c"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#ff3b1f"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reducedMotion ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 1.2, ease: "easeOut" }
          }
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${fontDisplayEn} text-4xl text-[#ffc93c]`}>
          {level}
        </span>
        <span className="text-xs text-[#d8c7b6]">/ {max}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                       */
/* ------------------------------------------------------------------ */

interface LandingClientProps {
  fontDisplayKr: string;
  fontBodyKr: string;
  fontDisplayEn: string;
}

export default function LandingClient({
  fontDisplayKr,
  fontBodyKr,
  fontDisplayEn,
}: LandingClientProps) {
  const reducedMotion = usePrefersReducedMotion();
  const gaugeLabelId = useId();
  const fateGaugeLabelId = useId();
  const spiceOutputId = useId();
  const emailInputId = useId();

  const [fateResult, setFateResult] = useState<FateItem | null>(null);
  const [spiceValue, setSpiceValue] = useState(5);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleDraw = useCallback(() => {
    setFateResult((prev) => {
      let next = FATE_POOL[Math.floor(Math.random() * FATE_POOL.length)];
      if (prev && FATE_POOL.length > 1) {
        while (next.name === prev.name) {
          next = FATE_POOL[Math.floor(Math.random() * FATE_POOL.length)];
        }
      }
      return next;
    });
  }, []);

  const handleSubscribe = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email) return;
      setSubscribed(true);
    },
    [email],
  );

  return (
    <div
      className={`${fontBodyKr} min-h-screen bg-[#120c0a] text-[#fff3e2] selection:bg-[#ff3b1f] selection:text-[#120c0a]`}
    >
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#ffc93c] focus:px-5 focus:py-3 focus:font-bold focus:text-[#120c0a] ${focusRing}`}
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------- 헤더 ---------------- */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p
            className={`${fontDisplayEn} text-xl tracking-widest text-[#fff3e2]`}
          >
            GEUKMI<span className="text-[#ff3b1f]">.</span>
          </p>
          <nav aria-label="빠른 이동">
            <a
              href="#waitlist"
              className={`inline-flex min-h-11 items-center rounded-full bg-[#ffc93c] px-4 py-2 text-sm font-bold text-[#120c0a] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
            >
              웨이팅 등록
            </a>
          </nav>
        </div>
        <Marquee reducedMotion={reducedMotion} />
      </header>

      <main id="main-content">
        {/* ---------------- 히어로 ---------------- */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 inline-block rounded-full border border-[#ff3b1f] px-4 py-1 text-xs font-bold tracking-[0.2em] text-[#ff3b1f] uppercase">
                초대제 미각 구독
              </p>
              <h1
                id="hero-heading"
                className={`${fontDisplayKr} text-5xl leading-[1.08] text-[#fff3e2] sm:text-6xl md:text-7xl`}
              >
                이 맛,
                <br />
                <span className="text-[#ff3b1f]">감당되세요?</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[#d8c7b6]">
                매주 화요일 자정, 셰프팀이 극비로 고른 극한의 한 그릇이 문 앞에
                도착합니다. 무슨 맛인지는 뜯기 전까지 아무도 몰라요.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#waitlist"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ffc93c] px-6 py-3 font-bold text-[#120c0a] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
                >
                  웨이팅 등록하기
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </a>
                <a
                  href="#fate"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#fff3e2] px-6 py-3 font-bold text-[#fff3e2] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
                >
                  운명의 맛 미리보기
                  <Dices aria-hidden="true" className="h-5 w-5" />
                </a>
              </div>

              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-[#3a241c] pt-8">
                <div>
                  <dt className="text-xs tracking-widest text-[#d8c7b6] uppercase">
                    웨이팅 인원
                  </dt>
                  <dd className={`${fontDisplayEn} text-3xl text-[#ffc93c]`}>
                    4,213
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest text-[#d8c7b6] uppercase">
                    발명된 맛
                  </dt>
                  <dd className={`${fontDisplayEn} text-3xl text-[#ffc93c]`}>
                    37
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest text-[#d8c7b6] uppercase">
                    순한맛 생존자
                  </dt>
                  <dd className={`${fontDisplayEn} text-3xl text-[#ffc93c]`}>
                    0
                  </dd>
                </div>
              </dl>
            </div>

            <Reveal reducedMotion={reducedMotion} className="relative mx-auto w-full max-w-sm">
              <div className="relative rotate-2 rounded-2xl border-4 border-[#fff3e2] bg-[#1c1310] p-3 shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1526318472351-c75fcf070305"
                    alt="김이 올라오는 라멘 한 그릇을 클로즈업으로 담은 사진"
                    fill
                    priority
                    sizes="(min-width: 1024px) 384px, 90vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-sm text-[#d8c7b6]">
                  지난주 발송분 · 실제 배송 사진
                </p>
              </div>
              <div className="absolute -bottom-8 -left-8 -rotate-6 rounded-2xl border-4 border-[#120c0a] bg-[#1c1310] p-4 shadow-xl">
                <p className="mb-1 text-center text-[11px] font-bold tracking-widest text-[#d8c7b6] uppercase">
                  이번 주 공식 매운지수
                </p>
                <SpiceGauge
                  level={8}
                  reducedMotion={reducedMotion}
                  labelId={gaugeLabelId}
                  fontDisplayEn={fontDisplayEn}
                  size={104}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- 맛 그리드 ---------------- */}
        <section
          aria-labelledby="flavor-heading"
          className="border-t border-[#3a241c] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal reducedMotion={reducedMotion} className="mb-14 max-w-xl">
              <h2
                id="flavor-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                지난 4주간 우리가 보낸 맛
              </h2>
              <p className="mt-4 text-[#d8c7b6]">
                전부 재입고 요청이 빗발쳤지만, 같은 맛은 두 번 보내지 않는 게
                원칙입니다.
              </p>
            </Reveal>

            <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {FLAVORS.map((flavor, index) => (
                <li key={flavor.id}>
                  <Reveal
                    reducedMotion={reducedMotion}
                    delay={index * 0.06}
                    className="h-full"
                  >
                    <article
                      className={`group relative h-full rounded-2xl border-4 border-[#fff3e2] bg-[#1c1310] p-3 shadow-xl transition-transform duration-300 motion-reduce:transition-none hover:rotate-0 focus-within:rotate-0 ${CARD_ROTATIONS[index % CARD_ROTATIONS.length]}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-[#ffc93c]/80"
                      />
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                        <Image
                          src={flavor.image}
                          alt={flavor.alt}
                          fill
                          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 pt-4">
                        <span className="inline-block rounded-full bg-[#ff3b1f] px-3 py-1 text-xs font-bold text-[#120c0a]">
                          {flavor.tag}
                        </span>
                        <h3 className="mt-3 text-lg font-bold text-[#fff3e2]">
                          {flavor.title}
                        </h3>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 운명의 맛 뽑기 ---------------- */}
        <section
          id="fate"
          aria-labelledby="fate-heading"
          className="scroll-mt-8 border-t border-[#3a241c] bg-[#1c1310] px-6 py-20 md:py-28"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <Reveal reducedMotion={reducedMotion}>
              <h2
                id="fate-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                운명의 맛 뽑기
              </h2>
              <p className="mt-4 max-w-md text-[#d8c7b6]">
                버튼을 누르면 우리가 다음에 만들지도 모르는 맛 하나가
                무작위로 공개됩니다. 실제로 이 맛을 받을 확률은 아무도
                모릅니다.
              </p>
              <button
                type="button"
                onClick={handleDraw}
                className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ff3b1f] px-6 py-3 font-bold text-[#fff3e2] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
              >
                <Dices aria-hidden="true" className="h-5 w-5" />
                {fateResult ? "다시 뽑기" : "오늘의 맛 뽑기"}
              </button>
            </Reveal>

            <div
              aria-live="polite"
              className="relative flex min-h-[220px] items-center justify-center rounded-2xl border-4 border-dashed border-[#3a241c] p-8"
            >
              {fateResult ? (
                <motion.div
                  key={fateResult.name}
                  initial={reducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <SpiceGauge
                    level={fateResult.level}
                    reducedMotion={reducedMotion}
                    labelId={fateGaugeLabelId}
                    fontDisplayEn={fontDisplayEn}
                    size={112}
                  />
                  <p className={`${fontDisplayKr} text-2xl text-[#ffc93c]`}>
                    {fateResult.name}
                  </p>
                  <p className="text-sm text-[#d8c7b6]">{fateResult.note}</p>
                </motion.div>
              ) : (
                <p className="max-w-[220px] text-center text-sm text-[#d8c7b6]">
                  아직 아무 맛도 뽑지 않았습니다. 각오되면 버튼을 누르세요.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- 프로세스 ---------------- */}
        <section
          aria-labelledby="process-heading"
          className="border-t border-[#3a241c] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal reducedMotion={reducedMotion} className="mb-14">
              <h2
                id="process-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                어떻게 오나요
              </h2>
            </Reveal>
            <ol className="space-y-8">
              {PROCESS_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <li key={step.title}>
                    <Reveal reducedMotion={reducedMotion} delay={index * 0.05}>
                      <div className="flex items-start gap-5 rounded-2xl border border-[#3a241c] bg-[#1c1310] p-6">
                        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3b1f]">
                          <StepIcon
                            aria-hidden="true"
                            className="h-6 w-6 text-[#120c0a]"
                          />
                        </span>
                        <div>
                          <p className="font-bold text-[#ffc93c]">
                            {index + 1}. {step.title}
                          </p>
                          <p className="mt-1 text-[#d8c7b6]">{step.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------------- 맵부심 테스트 슬라이더 ---------------- */}
        <section
          aria-labelledby="slider-heading"
          className="border-t border-[#3a241c] bg-[#1c1310] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-2xl text-center">
            <Reveal reducedMotion={reducedMotion}>
              <h2
                id="slider-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                너의 맵부심 테스트
              </h2>
              <p className="mt-4 text-[#d8c7b6]">
                슬라이더를 움직여서 스스로 감당 가능한 매운지수를
                고백해보세요.
              </p>

              <div className="mt-10">
                <label
                  htmlFor={spiceOutputId}
                  className="text-sm font-bold tracking-widest text-[#d8c7b6] uppercase"
                >
                  내 맵부심 지수
                </label>
                <div className="mt-4 flex items-center gap-4">
                  <Flame aria-hidden="true" className="h-6 w-6 text-[#ff3b1f]" />
                  <input
                    id={spiceOutputId}
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={spiceValue}
                    onChange={(event) => setSpiceValue(Number(event.target.value))}
                    aria-describedby={`${spiceOutputId}-desc`}
                    className={`h-3 w-full flex-1 cursor-pointer appearance-none rounded-full bg-[#3a241c] accent-[#ff3b1f] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffc93c] [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#ffc93c] ${focusRing}`}
                  />
                  <Flame
                    aria-hidden="true"
                    className="h-6 w-6 text-[#ff3b1f]"
                  />
                </div>
                <output
                  id={`${spiceOutputId}-desc`}
                  htmlFor={spiceOutputId}
                  aria-live="polite"
                  className="mt-6 block"
                >
                  <span className={`${fontDisplayEn} text-4xl text-[#ffc93c]`}>
                    {spiceValue}
                  </span>
                  <span className="ml-2 text-sm text-[#d8c7b6]">/ 10</span>
                  <p className="mt-2 text-lg font-bold text-[#fff3e2]">
                    {SPICE_LABELS[spiceValue - 1]}
                  </p>
                </output>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- 후기 ---------------- */}
        <section
          aria-labelledby="testimonial-heading"
          className="border-t border-[#3a241c] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal reducedMotion={reducedMotion} className="mb-14 max-w-xl">
              <h2
                id="testimonial-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                먹어본 사람들의 증언
              </h2>
            </Reveal>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((item, index) => (
                <li key={item.name}>
                  <Reveal reducedMotion={reducedMotion} delay={index * 0.06} className="h-full">
                    <figure className="flex h-full flex-col justify-between rounded-lg border border-[#3a241c] bg-[#1c1310] p-6 font-mono">
                      <div>
                        <div
                          className="mb-3 flex gap-1 text-[#ffc93c]"
                          aria-hidden="true"
                        >
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className="h-4 w-4 fill-current"
                            />
                          ))}
                        </div>
                        <span className="sr-only">5점 만점에 5점</span>
                        <blockquote>
                          <p className="text-[#fff3e2]">“{item.quote}”</p>
                        </blockquote>
                      </div>
                      <figcaption className="mt-6 border-t border-dashed border-[#3a241c] pt-4 text-sm text-[#d8c7b6]">
                        {item.name} · {item.weeks}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 웨이팅 등록 ---------------- */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-heading"
          className="scroll-mt-8 border-t border-[#3a241c] bg-[#1c1310] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-xl text-center">
            <Reveal reducedMotion={reducedMotion}>
              <h2
                id="waitlist-heading"
                className={`${fontDisplayKr} text-4xl text-[#fff3e2] sm:text-5xl`}
              >
                초대장을 보내드립니다
              </h2>
              <p className="mt-4 text-[#d8c7b6]">
                정기구독은 초대제로만 열립니다. 이메일을 남기면 자리가 열리는
                순간 가장 먼저 알려드릴게요.
              </p>

              {subscribed ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-8 rounded-xl border border-[#ff3b1f] bg-[#120c0a] p-6 font-bold text-[#ffc93c]"
                >
                  명단에 올랐습니다. 순한맛은 여전히 없습니다.
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                  noValidate
                >
                  <div className="flex-1 text-left">
                    <label htmlFor={emailInputId} className="sr-only">
                      이메일 주소
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="이메일 주소"
                      className={`min-h-12 w-full rounded-full border-2 border-[#3a241c] bg-[#120c0a] px-5 py-3 text-[#fff3e2] placeholder:text-[#6b564a] ${focusRing}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffc93c] px-6 py-3 font-bold text-[#120c0a] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${focusRing}`}
                  >
                    초대받기
                    <Mail aria-hidden="true" className="h-5 w-5" />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- 푸터 ---------------- */}
      <footer className="border-t border-[#3a241c]">
        <Marquee reducedMotion={reducedMotion} />
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <p className={`${fontDisplayEn} text-2xl text-[#fff3e2]`}>
                GEUKMI<span className="text-[#ff3b1f]">.</span>
              </p>
              <p className="mt-3 text-sm text-[#d8c7b6]">
                GEUKMI는 맛에 잔뼈가 굵은 사람들을 위한 자리입니다. 순한맛은,
                여전히 취급하지 않습니다.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-[#d8c7b6]">
              <li>인스타그램 @geukmi.club</li>
              <li>문의 hello@geukmi.club</li>
              <li>이용약관 · 환불 없음 명시</li>
            </ul>
          </div>
          <p className="mt-10 text-xs text-[#6b564a] italic">
            GEUKMI는 가상의 브랜드이며 실제 판매되지 않는 컨셉 프로젝트입니다.
          </p>
          <p className="mt-2 text-xs text-[#6b564a]">© 2026 GEUKMI CLUB</p>
        </div>
      </footer>
    </div>
  );
}
