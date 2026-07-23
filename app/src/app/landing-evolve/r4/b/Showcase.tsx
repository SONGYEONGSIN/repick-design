"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, BadgeCheck, Check, ShieldCheck, Sparkles } from "lucide-react";
import {
  PRODUCTS,
  MAX_TILT,
  EASE,
  cx,
  comma,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const CTA_INNER =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

/**
 * 포인터 틸트 쇼케이스 카드.
 * rotateX/rotateY는 포인터가 카드 경계 안에서 차지하는 상대 위치(px/py, 0~1)의
 * 결정론적 함수다 — Math.random 없음. useMotionValue로 raw 각도를 쥐고
 * useSpring으로 관성감 있게 보간한다. 카드를 벗어나거나(pointerleave) 다른
 * 매물로 전환되면(index 변경) 0으로 리셋된다. 매칭%·등급·인증 배지·할인율은
 * 이 컴포넌트의 최상위 정적 마크업이라 hover 여부와 무관하게 항상 렌더링된다
 * (r3 delta: hover 전용 리빌 금지).
 */
function TiltCard({ index }: { index: number }) {
  const product = PRODUCTS[index];
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 22, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 22, mass: 0.6 });

  // 방향성 드롭섀도우 — 회전각의 결정론적 함수(포인터 spotlight 글로우가 아님,
  // 카드 자체의 물리적 기울기에서 나오는 그림자만 이동한다).
  const shadowX = useTransform(springY, [-MAX_TILT, MAX_TILT], [-14, 14]);
  const shadowY = useTransform(springX, [-MAX_TILT, MAX_TILT], [14, -14]);
  const shadow = useMotionTemplate`0px 24px 60px -12px rgba(0,0,0,0.65), ${shadowX}px ${shadowY}px 32px -8px rgba(110,86,207,0.28)`;

  useEffect(() => {
    // 매물 전환 시 틸트 리셋
    rotateX.set(0);
    rotateY.set(0);
  }, [index, rotateX, rotateY]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * MAX_TILT);
    rotateX.set(-(py - 0.5) * 2 * MAX_TILT);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="[perspective:1400px]"
      role="tabpanel"
      id="spotlight-panel"
      aria-labelledby={`filmstrip-tab-${product.id}`}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX: reduced ? 0 : springX,
          rotateY: reduced ? 0 : springY,
          transformStyle: "preserve-3d",
          boxShadow: shadow,
        }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
      >
        {/* image layer — base depth */}
        <div className="relative aspect-[4/3] w-full" style={{ transform: "translateZ(0px)" }}>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0F] to-transparent" />

          {/* proof badges — always rendered, floated at higher Z for tilt parallax pop */}
          <div
            className="absolute inset-x-4 top-4 flex items-start justify-between gap-2"
            style={{ transform: "translateZ(46px)" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6E56CF]/50 bg-[#0B0B0F]/80 px-3 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
              {product.grade}급 · {product.gradeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6E56CF] px-3 py-1.5 text-[0.72rem] font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span className={NUM}>매칭 {product.match}%</span>
            </span>
          </div>
        </div>

        {/* content panel — mid depth */}
        <div
          className="flex flex-col gap-3 p-5 sm:p-6"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                {product.brand} · {product.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-white sm:text-xl">
                {product.title}
              </h3>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
              <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
              {product.seller}
            </span>
          </div>

          <p className="text-[0.72rem] font-normal text-[#A1A1AA]">
            {product.sellerMeta}
          </p>

          {/* before/after 할인율 — 항상 노출, 토글/hover 없음 */}
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[#6E56CF]/25 bg-[#6E56CF]/10 px-4 py-3">
            <span className={cx(NUM, "text-sm font-semibold text-white/40 line-through")}>
              {comma(product.original)}원
            </span>
            <span className={cx(NUM, "text-2xl font-extrabold text-white sm:text-[1.7rem]")}>
              {comma(product.price)}원
            </span>
            <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white")}>
              -{product.discount}%
            </span>
          </div>

          <ul className="mt-1 flex flex-col gap-1.5">
            {product.reasons.map((r) => (
              <li
                key={r}
                className="flex items-center gap-1.5 text-[0.8rem] font-normal text-[#A1A1AA]"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                {r}
              </li>
            ))}
          </ul>

          <a href="#cta" className={cx(CTA_INNER, "mt-2")}>
            이 매물로 매칭 받기
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 하단 가로 필름스트립 — role="tablist"/aria-selected 패턴의 롤링 탭바.
 * 클릭 또는 ArrowLeft/ArrowRight/Home/End 키보드 조작으로 스포트라이트를 전환한다.
 * roving tabindex: 선택된 탭만 tabIndex=0, 나머지는 -1.
 */
function FilmStrip({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (i: number) => void;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % PRODUCTS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + PRODUCTS.length) % PRODUCTS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = PRODUCTS.length - 1;
    else return;
    e.preventDefault();
    onSelect(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="스포트라이트로 전환할 매물 선택"
      aria-orientation="horizontal"
      className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
    >
      {PRODUCTS.map((p, i) => {
        const selected = i === index;
        return (
          <button
            key={p.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`filmstrip-tab-${p.id}`}
            aria-selected={selected}
            aria-controls="spotlight-panel"
            tabIndex={selected ? 0 : -1}
            type="button"
            onClick={() => onSelect(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cx(
              "group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors duration-150 sm:h-16 sm:w-20",
              selected
                ? "border-[#6E56CF] ring-2 ring-[#6E56CF]/40"
                : "border-white/10 hover:border-white/30",
              FOCUS,
            )}
          >
            <Image
              src={p.image}
              alt=""
              aria-hidden
              fill
              sizes="80px"
              className={cx(
                "object-cover transition-opacity duration-150",
                selected ? "opacity-100" : "opacity-55 group-hover:opacity-80",
              )}
            />
            <span className="sr-only">
              {p.brand} {p.title} — 매칭 {p.match}%, {p.grade}급, {p.discount}% 할인
            </span>
            {selected && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[#6E56CF]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Showcase() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cx(CAPTION, "flex items-center gap-2 text-[#a894f7]")}>
          스포트라이트 매물
        </p>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>
          {index + 1} / {PRODUCTS.length}
        </span>
      </div>

      <div className="mt-3">
        <TiltCard index={index} />
      </div>

      <FilmStrip index={index} onSelect={setIndex} />
    </motion.div>
  );
}
