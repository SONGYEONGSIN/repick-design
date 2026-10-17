"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FOCUS_RING } from "./tokens";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#15140E]/10 bg-[#FAFAF8]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a
          href="#hero"
          className={`inline-flex min-h-11 items-center font-[var(--font-display-wide)] text-xl font-extrabold tracking-[-0.02em] text-[#15140E] ${FOCUS_RING}`}
        >
          re<span className="text-emerald-700">pick</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          <a
            href="#certificate"
            className={`inline-flex min-h-11 items-center text-sm font-normal text-[#15140E] hover:text-emerald-700 ${FOCUS_RING}`}
          >
            Live certificate
          </a>
          <a
            href="#how-it-works"
            className={`inline-flex min-h-11 items-center text-sm font-normal text-[#15140E] hover:text-emerald-700 ${FOCUS_RING}`}
          >
            How grading works
          </a>
          <a
            href="#trust"
            className={`inline-flex min-h-11 items-center text-sm font-normal text-[#15140E] hover:text-emerald-700 ${FOCUS_RING}`}
          >
            Sellers &amp; buyers
          </a>
        </nav>

        <motion.a
          href="#start"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-bold text-[#15140E] ${FOCUS_RING}`}
        >
          Request a certificate
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </motion.a>
      </div>
    </header>
  );
}
