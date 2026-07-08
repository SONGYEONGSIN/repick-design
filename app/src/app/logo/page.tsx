import type { Metadata } from "next";

export const metadata: Metadata = { title: "RE:픽 — 로고 시안" };

const ACCENT = "#C2410C"; // orange-700

function Cell({
  n,
  label,
  dark,
  children,
}: {
  n: string;
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <div
        className={`flex h-40 items-center justify-center px-6 ${
          dark ? "bg-stone-950" : "bg-stone-50"
        }`}
      >
        {children}
      </div>
      <div className="flex items-center justify-between border-t border-stone-200 bg-white px-4 py-2">
        <span className="text-xs font-semibold text-stone-900">
          {n}. {label}
        </span>
        <span className="text-[10px] text-stone-400">{dark ? "dark" : "light"}</span>
      </div>
    </div>
  );
}

const serif = "font-[family-name:var(--font-display)]";
const mono = "font-[family-name:var(--font-geist-mono)]";

export default function LogoLab() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight">RE:픽 — 로고타입 시안</h1>
        <p className="mt-2 text-sm text-stone-500">
          Pretendard(한글·기본) / Instrument Serif(세리프) / Geist Mono(모노) 조합. 마음에 드는 번호를
          알려주시면 <code className="rounded bg-stone-100 px-1">/rg</code> 헤더·풋터에 적용합니다.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. 기본 산세리프 + accent 콜론 */}
          <Cell n="1" label="Pretendard Bold + accent 콜론">
            <span className="text-4xl font-bold tracking-tight">
              RE<span style={{ color: ACCENT }}>:</span>픽
            </span>
          </Cell>

          {/* 2. RE 세리프 + 픽 산세 (에디토리얼 믹스) */}
          <Cell n="2" label="RE: 세리프 · 픽 Pretendard">
            <span className="text-4xl tracking-[0.02em]">
              <span className={serif}>RE:</span>
              <span className="font-bold">픽</span>
            </span>
          </Cell>

          {/* 3. 모노 RE: (코드 reply 감성) */}
          <Cell n="3" label="Mono RE: · 픽 볼드">
            <span className="text-4xl">
              <span className={`${mono} font-medium`} style={{ color: ACCENT }}>
                RE:
              </span>
              <span className="font-bold tracking-tight">픽</span>
            </span>
          </Cell>

          {/* 4. 콜론을 사각 accent 블록으로 */}
          <Cell n="4" label="콜론 = accent 도트">
            <span className="inline-flex items-center gap-1 text-4xl font-bold tracking-tight">
              RE
              <span className="flex flex-col gap-1">
                <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: ACCENT }} />
                <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: ACCENT }} />
              </span>
              픽
            </span>
          </Cell>

          {/* 5. 소문자 re:픽 (친근·모던) */}
          <Cell n="5" label="소문자 re:픽">
            <span className="text-4xl font-semibold tracking-tight">
              re<span style={{ color: ACCENT }}>:</span>픽
            </span>
          </Cell>

          {/* 6. 배지형 (RE: 태그 + 픽) */}
          <Cell n="6" label="배지형 RE: 태그">
            <span className="inline-flex items-center gap-2 text-4xl font-bold tracking-tight">
              <span
                className={`${mono} rounded-md px-2 py-0.5 text-2xl font-semibold text-white`}
                style={{ background: ACCENT }}
              >
                RE:
              </span>
              픽
            </span>
          </Cell>

          {/* 7. 다크 — accent 콜론 */}
          <Cell n="7" label="Pretendard Bold (다크)" dark>
            <span className="text-4xl font-bold tracking-tight text-white">
              RE<span style={{ color: "#FB923C" }}>:</span>픽
            </span>
          </Cell>

          {/* 8. 다크 — 세리프 믹스 */}
          <Cell n="8" label="RE: 세리프 · 픽 (다크)" dark>
            <span className="text-4xl tracking-[0.02em] text-white">
              <span className={serif}>RE:</span>
              <span className="font-bold">픽</span>
            </span>
          </Cell>

          {/* 9. SVG 심볼 마크 + 워드마크 */}
          <Cell n="9" label="심볼 마크 + RE:픽">
            <span className="inline-flex items-center gap-2.5">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <circle cx="17" cy="17" r="15" stroke={ACCENT} strokeWidth="2.5" strokeDasharray="4 66" strokeLinecap="round" transform="rotate(-90 17 17)" />
                <path d="M17 8 A9 9 0 1 1 8 17" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M17 3.5 L17 8 L13 6" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-3xl font-bold tracking-tight">
                RE<span style={{ color: ACCENT }}>:</span>픽
              </span>
            </span>
          </Cell>
        </div>
      </div>
    </div>
  );
}
