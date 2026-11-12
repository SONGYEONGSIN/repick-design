import { GitBranch, ListTree, Workflow } from "lucide-react";
import Reveal from "./Reveal";
import { TOTAL_PATHS } from "./data";
import { BODY_WIDTH_SM, DISPLAY, EYEBROW, GHOST_TEXT, MUTED_TEXT } from "./tokens";

const FEATURES = [
  {
    icon: Workflow,
    title: "Every branch is the same formula",
    body:
      "Budget, category, and condition each carry one fixed factor. No combination gets a hand-written answer — the formula runs identically whichever three you pick.",
  },
  {
    icon: GitBranch,
    title: "Nothing lights before it's reached",
    body:
      "A question stays locked and dim until the one above it has an answer, so the lit path always matches exactly the choices you've actually made.",
  },
  {
    icon: ListTree,
    title: "The leaf is read, not written",
    body:
      "Active-seller count and sale speed come straight off the three factors you chose — the same read that reaches the closing section below.",
  },
];

export function ValueSplit() {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-[#FB7185]`}>How the tree reasons</p>
            <h2 className={`${DISPLAY} mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.01em] text-[#F5F5F6] sm:text-4xl`}>
              One formula, every branch.
            </h2>
            <p className={`mt-4 text-base font-normal leading-[1.6] ${MUTED_TEXT} ${BODY_WIDTH_SM}`}>
              Three questions, three options each, so there are {TOTAL_PATHS} distinct paths
              through this tree in total — a fixed count of branches, not a live figure. Every
              one of them runs through the same three-factor read below.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            <span className={`${DISPLAY} font-extrabold leading-none tracking-[-0.01em] ${GHOST_TEXT}`} style={{ fontSize: "clamp(6rem,11vw,9rem)" }}>
              {TOTAL_PATHS}
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="min-w-0 h-full">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <Icon className="h-5 w-5 text-[#FB7185]" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#F5F5F6]">{f.title}</h3>
                  <p className={`max-w-[300px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
