"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cx, THINK_STEP_MS } from "../data";

/**
 * "AI가 생각 중" 마이크로 인터랙션.
 * 장식이 아니라 다음 근거(매칭·검수·시세)가 순서대로 로드된다는 신호 — 결정론적 스텝
 * 카운터(고정 간격 setInterval)로만 진행한다. Math.random/Date.now 사용 없음.
 * whileInView로 뷰포트 진입 시에만 시작하고, 마지막 스텝에서 스스로 멈춘다.
 */
export default function ThinkingIndicator({ steps }: { steps: string[] }) {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(reduced ? steps.length - 1 : 0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!started || reduced) return;
    const id = setInterval(() => {
      countRef.current += 1;
      if (countRef.current >= steps.length - 1) {
        setIndex(steps.length - 1);
        clearInterval(id);
      } else {
        setIndex(countRef.current);
      }
    }, THINK_STEP_MS);
    return () => clearInterval(id);
  }, [started, reduced, steps.length]);

  const done = index >= steps.length - 1;

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, margin: "-30% 0px" }}
      className="inline-flex min-h-[1.1rem] items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
        <span
          className={cx(
            "h-1.5 w-1.5 rounded-full bg-[#6E56CF] transition-opacity duration-300 motion-safe:animate-pulse",
            done && "opacity-40 motion-safe:animate-none",
          )}
        />
        <span
          className={cx(
            "h-1.5 w-1.5 rounded-full bg-[#6E56CF] transition-opacity duration-300 motion-safe:animate-pulse [animation-delay:150ms]",
            done && "opacity-40 motion-safe:animate-none",
          )}
        />
        <span
          className={cx(
            "h-1.5 w-1.5 rounded-full bg-[#6E56CF] transition-opacity duration-300 motion-safe:animate-pulse [animation-delay:300ms]",
            done && "opacity-40 motion-safe:animate-none",
          )}
        />
      </span>
      <span className="truncate text-[0.75rem] font-normal text-[#A1A1AA]">
        {done ? "근거 확인 완료" : `${steps[index]}…`}
      </span>
    </motion.span>
  );
}
