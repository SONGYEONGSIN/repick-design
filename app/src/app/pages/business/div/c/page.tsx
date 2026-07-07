import type { CSSProperties } from 'react';

const vars = {
  '--ink': 'oklch(14% 0 0)',
  '--paper': 'oklch(98% 0 0)',
  '--red': 'oklch(57% 0.22 29)',
} as CSSProperties;

const kpis = [
  '재고 회전 +130%',
  'AI 매칭 정확도 94%',
  '도입 셀러 1,240개사',
  '평균 정산 D+1',
  '전환율 ×2.3',
  '재고 보유기간 -42%',
];

const process = [
  { n: '01', title: '재고 등록', day: 'D+0' },
  { n: '02', title: 'AI 프라이싱', day: 'D+0.5' },
  { n: '03', title: '채널 매칭', day: 'D+1' },
  { n: '04', title: '정산 완료', day: 'D+1.3' },
];

const stats = [
  { n: '01', value: '-42%', label: '평균 재고 보유 기간', sub: '입고부터 판매 완료까지' },
  { n: '02', value: '94%', label: 'AI 매칭 정확도', sub: '판매 성사율 기준' },
  { n: '03', value: '×2.3', label: '기존 채널 대비 전환율', sub: '동일 재고군 비교' },
  { n: '04', value: '1,240+', label: '도입 셀러사', sub: '2026년 7월 기준' },
];

const tools = [
  { n: '01', title: '셀러 대시보드', desc: '재고·매칭·정산 현황을 한 화면에서 실시간으로 추적합니다.' },
  { n: '02', title: 'AI 프라이싱 엔진', desc: '실거래 시세 데이터로 최적 판매가를 자동 산출합니다.' },
  { n: '03', title: '매칭 API', desc: '외부 판매 채널에 재고를 자동 연동해 노출을 확장합니다.' },
  { n: '04', title: '정산 자동화', desc: '거래 성사 즉시 정산 데이터를 생성해 회계를 단축합니다.' },
];

const clients = ['이커머스핏', '리사이클컴퍼니', '그린클로짓', '셀렉트인벤토리', '루프마켓', '빈티지웍스'];

function GhostNumber({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-6 right-2 select-none text-[7rem] font-black leading-none tracking-tighter text-[var(--ink)]/[0.05] sm:-top-10 sm:text-[11rem]"
    >
      {children}
    </span>
  );
}

function SectionTitle({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <div className="relative z-10 mb-10 flex items-end justify-between gap-4 border-b-4 border-[var(--ink)] pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--red)]">{eyebrow}</p>
        <h2 className="mt-2 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-[var(--ink)] sm:text-5xl">
          {title}
        </h2>
      </div>
      <span className="hidden shrink-0 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink)]/40 sm:block">
        SEC. {index}
      </span>
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--red)] px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center border-2 border-[var(--ink)] bg-transparent px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]"
    >
      {children}
    </a>
  );
}

function FieldInput({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
        {label}
        {required && <span className="text-[var(--red)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--ink)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div style={vars} className="min-h-screen bg-[var(--paper)] font-sans text-[var(--ink)]">
      <style>{`
        @keyframes bc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bc-marquee-track { animation: bc-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bc-marquee-track { animation: none; }
        }
      `}</style>

      {/* fixed exposed-grid guide lines */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
        <div className="mx-auto h-full max-w-7xl">
          <div className="grid h-full grid-cols-4">
            <div className="border-r border-[var(--ink)]/10" />
            <div className="border-r border-[var(--ink)]/10" />
            <div className="border-r border-[var(--ink)]/10" />
          </div>
        </div>
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--paper)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:uppercase focus:tracking-widest"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-40 border-b-4 border-[var(--ink)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--ink)] text-base font-black text-[var(--paper)]">
              R
            </span>
            <span className="text-sm font-black uppercase tracking-[0.25em]">
              REPICK <span className="text-[var(--ink)]/40">BUSINESS</span>
            </span>
          </div>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] md:flex">
            <a href="#roi" className="hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]">
              지표
            </a>
            <a href="#tools" className="hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]">
              도구
            </a>
            <a href="#clients" className="hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]">
              레퍼런스
            </a>
            <a href="#demo" className="hover:text-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]">
              문의
            </a>
          </nav>
          <a
            href="#demo"
            className="border-2 border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--paper)] hover:bg-[var(--red)] hover:border-[var(--red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--red)]"
          >
            데모 요청
          </a>
        </div>

        {/* KPI marquee ticker */}
        <div className="overflow-hidden border-t-2 border-[var(--ink)] bg-[var(--ink)] py-2">
          <div className="flex w-max whitespace-nowrap bc-marquee-track">
            {[...kpis, ...kpis].map((k, i) => (
              <span key={`${k}-${i}`} className="flex items-center px-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--paper)]">
                {k}
                <span className="ml-4 text-[var(--red)]" aria-hidden="true">
                  //
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main id="main" className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden border-b-4 border-[var(--ink)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--red)]">
              REPICK FOR BUSINESS — 2026
            </p>
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="text-6xl font-black uppercase leading-[0.88] tracking-tighter sm:text-7xl lg:text-8xl">
                재고 회전율
                <br />
                <span className="text-[var(--red)]">+130%</span> 올리는 법
              </h1>
              <p className="max-w-md text-base leading-relaxed text-[var(--ink)]/70 sm:text-lg">
                감이 아니라 데이터로 팝니다. AI 매칭 엔진이 재고를 가장 높은 확률로 팔리는 채널과 가격에
                연결하고, 숫자로 결과를 증명합니다.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="#demo">데모 요청하기</PrimaryButton>
              <SecondaryButton href="#roi">도입 효과 보기</SecondaryButton>
            </div>

            <div className="relative mt-16 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
              <p className="border-b-2 border-[var(--paper)]/20 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-[var(--paper)]/50">
                판매 프로세스 — 등록부터 정산까지
              </p>
              <div className="grid sm:grid-cols-4">
                {process.map((p, i) => (
                  <div
                    key={p.n}
                    className={`flex items-center justify-between gap-3 px-6 py-5 sm:flex-col sm:items-start sm:justify-start ${
                      i > 0 ? 'border-t-2 border-[var(--paper)]/20 sm:border-t-0 sm:border-l-2' : ''
                    }`}
                  >
                    <span className="text-xs font-bold text-[var(--red)]">{p.n}</span>
                    <span className="text-lg font-black uppercase tracking-tight">{p.title}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--paper)]/50">{p.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROI / STATS */}
        <section id="roi" className="relative overflow-hidden border-b-4 border-[var(--ink)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <GhostNumber>01</GhostNumber>
          <div className="mx-auto max-w-7xl">
            <SectionTitle index="01/04" eyebrow="MEASURED RESULTS" title="숫자로 증명한다" />
            <div className="grid grid-cols-1 gap-0 border-2 border-[var(--ink)] sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.n}
                  className={`p-6 sm:p-8 ${i % 2 === 1 ? 'sm:border-l-2 sm:border-[var(--ink)]' : ''} ${
                    i >= 2 ? 'border-t-2 border-[var(--ink)] lg:border-t-0 lg:border-l-2' : ''
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]/40">{s.n} / RESULT</p>
                  <p className="mt-3 text-6xl font-black leading-none tracking-tighter text-[var(--red)]">{s.value}</p>
                  <p className="mt-4 text-base font-bold uppercase tracking-tight">{s.label}</p>
                  <p className="mt-1 text-sm text-[var(--ink)]/50">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOOLS */}
        <section id="tools" className="relative overflow-hidden border-b-4 border-[var(--ink)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <GhostNumber>02</GhostNumber>
          <div className="mx-auto max-w-7xl">
            <SectionTitle index="02/04" eyebrow="TOOLING" title="판매를 자동화하는 도구" />
            <div className="grid grid-cols-1 gap-0 border-2 border-[var(--ink)] sm:grid-cols-2">
              {tools.map((t, i) => (
                <div
                  key={t.n}
                  className={`p-8 ${i % 2 === 1 ? 'sm:border-l-2 sm:border-[var(--ink)]' : ''} ${
                    i >= 2 ? 'border-t-2 border-[var(--ink)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center bg-[var(--ink)] text-sm font-black text-[var(--paper)]">
                      {t.n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/60">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTS — inverted stamp band */}
        <section id="clients" className="relative border-b-4 border-[var(--ink)] bg-[var(--ink)] px-4 py-14 text-[var(--paper)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-[var(--red)]">
              03/04 — REFERENCE · 도입 기업 (일부)
            </p>
            <div className="flex flex-wrap items-center gap-x-0 gap-y-4">
              {clients.map((c, i) => (
                <span
                  key={c}
                  className={`px-6 py-1 text-base font-black uppercase tracking-[0.1em] ${
                    i > 0 ? 'border-l-2 border-[var(--paper)]/25' : 'pl-0'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO FORM */}
        <section id="demo" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <GhostNumber>04</GhostNumber>
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[var(--red)]">
              04/04 — REQUEST DEMO
            </p>
            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl">도입 상담 신청</h2>
            <p className="mt-4 text-base text-[var(--ink)]/60">영업일 기준 1일 이내, 담당자가 직접 회신드립니다.</p>

            <form className="mt-10 grid gap-6 border-2 border-[var(--ink)] p-6 sm:p-10" action="#" method="post">
              <div className="grid gap-6 sm:grid-cols-2">
                <FieldInput label="회사명" name="company" placeholder="주식회사 리픽" required />
                <FieldInput label="담당자명" name="name" placeholder="홍길동" required />
              </div>
              <FieldInput label="이메일" name="email" type="email" placeholder="you@company.com" required />
              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                  문의 내용
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="취급 재고 규모, 판매 채널, 궁금하신 점을 남겨주세요."
                  className="w-full resize-none border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--ink)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                />
              </div>
              <button
                type="submit"
                className="mt-2 border-2 border-[var(--ink)] bg-[var(--red)] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--red)]"
              >
                요청 제출
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-[var(--ink)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[var(--ink)]/50 sm:flex-row sm:items-center sm:justify-between">
          <span>REPICK BUSINESS © 2026</span>
          <span>ALL RESULTS ARE MEASURED, NOT ESTIMATED.</span>
        </div>
      </footer>
    </div>
  );
}
