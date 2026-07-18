"use client";

import { motion, type MotionValue } from "framer-motion";
import { cx, NUM, FOCUS } from "../lib/tokens";
import type { Chapter, ChapterId } from "../lib/data";

/**
 * 여정 진행률 레일 (데스크톱 xl+ 전용, 세로).
 * 스크롤 진행률(progress)로 accent 라인이 위에서 아래로 채워지고,
 * 뷰포트 중앙에 들어온 챕터가 activeId로 하이라이트된다.
 * 각 마커는 해당 섹션으로 점프하는 버튼이다.
 */
export default function ProgressRail({
  chapters,
  activeId,
  progress,
  onJump,
}: {
  chapters: Chapter[];
  activeId: ChapterId;
  progress: MotionValue<number>;
  onJump: (id: ChapterId) => void;
}) {
  return (
    <nav aria-label="여정 진행 상황" className="relative w-full">
      {/* 트랙 (정지) */}
      <div
        aria-hidden
        className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-white/10"
      />
      {/* 진행 채움 (스크롤 연동) */}
      <motion.div
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute left-[7px] top-1.5 bottom-1.5 w-px origin-top bg-[#6E56CF]"
      />

      <ul className="relative space-y-8">
        {chapters.map((c) => {
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onJump(c.id)}
                aria-current={active ? "step" : undefined}
                className={cx("group flex items-center gap-3 rounded-md text-left", FOCUS)}
              >
                <span
                  className={cx(
                    "relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                    active
                      ? "border-[#6E56CF] bg-[#6E56CF]"
                      : "border-white/25 bg-[#0B0B0F] group-hover:border-white/50",
                  )}
                >
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
                <span className="flex flex-col leading-tight">
                  <span
                    className={cx(
                      "text-[0.625rem] tracking-[0.16em]",
                      NUM,
                      active ? "text-[#6E56CF]" : "text-white/30",
                    )}
                  >
                    {c.no}
                  </span>
                  <span
                    className={cx(
                      "text-[0.8125rem] transition-colors duration-300",
                      active ? "font-semibold text-white" : "text-[#A1A1AA] group-hover:text-white",
                    )}
                  >
                    {c.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
