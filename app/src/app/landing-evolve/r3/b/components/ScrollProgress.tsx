"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * 아주 절제된 스크롤 위치 인디케이터 — r1/b의 "sticky 진행률 레일 + 챕터 넘버링"과
 * 달리 챕터 라벨도, 대화 turn 카운터도 없는 단순 상단 헤어라인 하나뿐이다.
 * 이 인디케이터 자체를 구조의 척추로 삼지 않는다 — 대화 트랜스크립트가 척추다.
 */
export default function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 h-[2px] w-full bg-white/[0.06]"
    >
      <motion.div
        style={{ scaleX: reduced ? scrollYProgress : smooth, transformOrigin: "left" }}
        className="h-full w-full bg-[#6E56CF]"
      />
    </div>
  );
}
