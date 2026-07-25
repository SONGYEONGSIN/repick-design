// app/src/app/gallery/gallery-i18n.ts — Specimen 갤러리 i18n 문자열 사전
import type { Work } from "@/lib/works";

export type Lang = "en" | "ko";
export const DEFAULT_LANG: Lang = "en";

type FilterKey = "all" | "dashboard" | "landing" | "free" | "native" | "winners";
type Strings = {
  worksLabel: string; tagline: string; langLabel: string;
  searchLabel: string; searchPlaceholder: string; filterLabel: string;
  filters: Record<FilterKey, string>;
  resultsLabel: string; empty: string; footer: string;
  status: Record<"winner" | "dropped" | "pending", string>;
};

export const STRINGS: Record<Lang, Strings> = {
  en: {
    worksLabel: "works",
    tagline: "Interface design systems, auto-evolved for AI agents.",
    langLabel: "Language", searchLabel: "Search works", searchPlaceholder: "Search designs…",
    filterLabel: "Filter",
    filters: { all: "All", dashboard: "Dashboard", landing: "Landing", free: "Free", native: "Native", winners: "Winners" },
    resultsLabel: "results", empty: "No designs match.",
    footer: "An auto-evolving gallery of interface design systems.",
    status: { winner: "Selected", dropped: "Cut", pending: "In review" },
  },
  ko: {
    worksLabel: "작품",
    tagline: "AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화.",
    langLabel: "언어", searchLabel: "작품 검색", searchPlaceholder: "디자인 검색…",
    filterLabel: "필터",
    filters: { all: "전체", dashboard: "대시보드", landing: "랜딩", free: "자유 창작", native: "네이티브", winners: "채택작" },
    resultsLabel: "개", empty: "해당하는 디자인이 없습니다.",
    footer: "스스로 진화하는 인터페이스 디자인 시스템 갤러리.",
    status: { winner: "채택", dropped: "탈락", pending: "심사 대기" },
  },
};

export function categoryLabel(cat: Work["category"], lang: Lang): string {
  if (!cat) return "";
  return STRINGS[lang].filters[cat];
}
