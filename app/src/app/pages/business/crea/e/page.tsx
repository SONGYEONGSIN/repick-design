"use client";

import { useEffect, useRef, useState } from "react";

type Product = { name: string; price: number; cat: string };
type FeedItem = {
  id: number;
  name: string;
  price: number;
  cat: string;
  city: string;
  tick: number;
};

const PRODUCTS: Product[] = [
  { name: "나이키 에어포스1 '07", price: 68000, cat: "의류·잡화" },
  { name: "다이슨 V8 무선청소기", price: 214000, cat: "가전" },
  { name: "이케아 포엥 암체어", price: 89000, cat: "가구" },
  { name: "애플워치 SE 44mm", price: 178000, cat: "디지털" },
  { name: "루이비통 포쉐트", price: 620000, cat: "명품" },
  { name: "삼성 비스포크 냉장고", price: 890000, cat: "가전" },
  { name: "무인양품 원목 선반", price: 45000, cat: "가구" },
  { name: "노스페이스 눕시 패딩", price: 132000, cat: "의류" },
  { name: "레고 테크닉 세트", price: 58000, cat: "취미" },
  { name: "캐논 EOS R50", price: 720000, cat: "디지털" },
  { name: "필립스 에어프라이어", price: 76000, cat: "가전" },
  { name: "코치 숄더백", price: 245000, cat: "명품" },
];

const CITIES = [
  "서울", "부산", "인천", "대구", "대전", "광주", "수원", "성남", "고양", "청주",
];

const INITIAL_FEED: FeedItem[] = [
  { id: 1, name: PRODUCTS[0].name, price: PRODUCTS[0].price, cat: PRODUCTS[0].cat, city: "서울", tick: -1 },
  { id: 2, name: PRODUCTS[3].name, price: PRODUCTS[3].price, cat: PRODUCTS[3].cat, city: "부산", tick: -2 },
  { id: 3, name: PRODUCTS[6].name, price: PRODUCTS[6].price, cat: PRODUCTS[6].cat, city: "대전", tick: -3 },
  { id: 4, name: PRODUCTS[9].name, price: PRODUCTS[9].price, cat: PRODUCTS[9].cat, city: "인천", tick: -4 },
];

const HOURLY_FLOW = [
  32, 38, 35, 41, 44, 40, 52, 58, 55, 62, 68, 64, 70, 74, 71, 78, 82, 79, 86, 90, 88, 94, 98, 96,
];

const PARTNERS = [
  "VINTAGE HAUS", "CLOSET LAB", "리페어마켓", "세컨드무브", "굿바이클로젯", "리턴잇",
];

const TICK_MS = 2800;

const won = (n: number) => `₩${Math.round(n).toLocaleString("ko-KR")}`;

function ageLabel(itemTick: number, currentTick: number) {
  const seconds = Math.max(0, (currentTick - itemTick) * (TICK_MS / 1000));
  if (seconds < 3) return "방금 전";
  if (seconds < 60) return `${Math.floor(seconds)}초 전`;
  return `${Math.floor(seconds / 60)}분 전`;
}

export default function Landing() {
  const [gmv, setGmv] = useState(128_450_000);
  const [itemCount, setItemCount] = useState(84213);
  const [sellers, setSellers] = useState(342);
  const [turnover, setTurnover] = useState(5.8);
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [currentTick, setCurrentTick] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const tickRef = useRef(0);
  const idRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      setCurrentTick(t);

      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      idRef.current += 1;

      setFeed((prev) =>
        [
          { id: idRef.current, name: product.name, price: product.price, cat: product.cat, city, tick: t },
          ...prev,
        ].slice(0, 6)
      );

      setGmv((v) => v + product.price + Math.floor(Math.random() * 9000));
      setItemCount((v) => v + 1);

      if (t % 2 === 0) {
        setSellers((v) => {
          const roll = Math.random();
          const delta = roll < 0.55 ? 1 : roll < 0.8 ? -1 : 0;
          return Math.min(412, Math.max(298, v + delta));
        });
      }

      if (t % 3 === 0) {
        setTurnover(Math.round((5.6 + Math.random() * 0.6) * 10) / 10);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-white text-slate-900">
      <style>{`
        @keyframes repick-feed-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .repick-feed-item { animation: repick-feed-in 420ms ease-out; }
        @keyframes repick-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .35; }
        }
        .repick-live-dot { animation: repick-pulse 1.6s ease-in-out infinite; }
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">repick</span>
            <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-500">
              Business
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#demo"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:inline"
            >
              로그인
            </a>
            <a
              href="#demo"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              데모 요청
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="repick-live-dot h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                지금 이 순간에도 거래되고 있습니다
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                재고가 아니라, 이미 팔리고 있는 시장에 합류하세요
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                repick for Business는 AI가 상품을 발굴·매칭하고 정산까지 자동화하는 리커머스 인프라입니다.
                오른쪽 패널은 실제 거래가 발생하는 속도감을 그대로 재현한 라이브 대시보드입니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  데모 요청하기
                </a>
                <a
                  href="#demo"
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  셀러로 합류하기
                </a>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                현재{" "}
                <span className="font-mono font-semibold text-slate-900">{sellers.toLocaleString("ko-KR")}</span>
                개 기업 셀러가 repick에서 재고를 순환시키고 있습니다.
              </p>
            </div>

            {/* Live panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="repick-live-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="text-sm font-semibold tracking-wide">실시간 플랫폼 현황</span>
                </div>
                <span className="text-xs text-slate-500">2.8초마다 갱신</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">오늘 거래액(GMV)</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white sm:text-xl">{won(gmv)}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">▲ 18.2% 전일 대비</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">누적 처리 재고</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white sm:text-xl">
                    {itemCount.toLocaleString("ko-KR")}건
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">▲ 오늘 +2,140건</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">활성 셀러</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white sm:text-xl">
                    {sellers.toLocaleString("ko-KR")}개사
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">▲ 이번 주 +24개사</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">평균 회전일</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white sm:text-xl">{turnover.toFixed(1)}일</p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">▼ 1.2일 단축</p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  실시간 거래 피드
                </p>
                <ul className="flex flex-col gap-2" aria-label="실시간 거래 피드 목록">
                  {feed.map((item) => (
                    <li
                      key={item.id}
                      className="repick-feed-item flex items-center justify-between gap-3 rounded-lg bg-slate-900/50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.cat} · {item.city} · {ageLabel(item.tick, currentTick)}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-sm font-semibold text-emerald-300">
                        {won(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Value props tied to live metrics */}
        <section className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">숫자가 증명합니다</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              매 순간의 거래가 곧 플랫폼의 신뢰도입니다. 위 라이브 지표는 아래 세 가지 가치로 이어집니다.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-mono text-2xl font-bold text-emerald-600">{turnover.toFixed(1)}일</p>
                <h3 className="mt-3 text-base font-semibold text-slate-900">재고가 오래 머무르지 않습니다</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  창고에 머무는 평균 시간입니다. AI 매칭으로 업계 평균 대비 훨씬 빠르게 재고를 현금화합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-mono text-2xl font-bold text-emerald-600">AI 매칭</p>
                <h3 className="mt-3 text-base font-semibold text-slate-900">팔릴 상품을, 팔릴 사람에게</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  수만 건의 구매·탐색 이력을 학습한 AI가 어떤 상품을 누구에게 언제 노출할지 자동으로 판단합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-mono text-2xl font-bold text-emerald-600">자동 정산</p>
                <h3 className="mt-3 text-base font-semibold text-slate-900">거래 확정, 정산 완료</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  거래가 확정되는 즉시 정산이 처리됩니다. 셀러는 재고 확보와 판매에만 집중하면 됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly flow chart */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">지난 24시간 거래 흐름</h2>
          <p className="mt-2 text-slate-600">시간대별 거래 발생 추이입니다.</p>
          <div className="mt-8 flex h-40 items-end gap-1.5 rounded-2xl border border-slate-200 bg-white p-5 sm:h-48">
            {HOURLY_FLOW.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-emerald-500/80"
                style={{ height: `${v}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>00시</span>
            <span>06시</span>
            <span>12시</span>
            <span>18시</span>
            <span>23시</span>
          </div>
        </section>

        {/* Partner strip */}
        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
              함께하는 파트너 셀러
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {PARTNERS.map((p) => (
                <span
                  key={p}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-mono text-sm tracking-wide text-slate-400"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">repick이 제공하는 것</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-6">
              <span className="text-2xl" aria-hidden="true">🎯</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">AI 매칭 판매</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">등록만 하면 AI가 최적 구매자를 찾아 노출합니다.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <span className="text-2xl" aria-hidden="true">📊</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">재고 대시보드</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">회전율, 매출, 매칭률을 한 화면에서 확인합니다.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <span className="text-2xl" aria-hidden="true">🔌</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">API 연동</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">기존 재고·ERP 시스템과 그대로 연결됩니다.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <span className="text-2xl" aria-hidden="true">💳</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">자동 정산</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">거래 확정과 동시에 정산이 자동으로 처리됩니다.</p>
            </div>
          </div>
        </section>

        {/* Demo request */}
        <section id="demo" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                지금 합류를 요청하세요
              </h2>
              <p className="mt-3 text-slate-600">영업일 기준 24시간 이내에 담당자가 연락드립니다.</p>
              <p className="mt-4 text-sm text-slate-500">
                지금 이 순간에도{" "}
                <span className="font-mono font-semibold text-slate-900">
                  {itemCount.toLocaleString("ko-KR")}건
                </span>
                의 재고가 repick에서 순환되고 있습니다.
              </p>
            </div>

            <div>
              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                  <h3 className="text-lg font-semibold text-emerald-800">요청이 접수되었습니다</h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    24시간 이내에 담당자가 연락드리겠습니다. 감사합니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    다른 문의 남기기
                  </button>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="company" className="text-sm font-medium text-slate-700">
                        회사명
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="contact" className="text-sm font-medium text-slate-700">
                        담당자명
                      </label>
                      <input
                        id="contact"
                        name="contact"
                        type="text"
                        required
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        이메일
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                        연락처
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="scale" className="text-sm font-medium text-slate-700">
                      월 처리 재고 규모
                    </label>
                    <select
                      id="scale"
                      name="scale"
                      defaultValue="100-1000"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="under-100">100개 미만</option>
                      <option value="100-1000">100~1,000개</option>
                      <option value="1000-10000">1,000~10,000개</option>
                      <option value="over-10000">10,000개 이상</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      메시지
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    데모 요청 보내기
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-10 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white">repick for Business</p>
            <p className="mt-1 text-xs">© 2026 repick. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-xs">
            <a href="#demo" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              문의하기
            </a>
            <a href="#demo" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              개인정보처리방침
            </a>
            <a href="#demo" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              이용약관
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
