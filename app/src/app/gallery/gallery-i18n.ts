// app/src/app/gallery/gallery-i18n.ts — Specimen 갤러리 i18n 문자열 사전
import type { Work } from "@/lib/works";

export type Lang = "en" | "ko";
export const DEFAULT_LANG: Lang = "en";

type FilterKey = "all" | "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile";
type Strings = {
  worksLabel: string; tagline: string; langLabel: string;
  searchLabel: string; searchPlaceholder: string; filterLabel: string;
  filters: Record<FilterKey, string>;
  resultsLabel: string; empty: string; footer: string;
  status: Record<"winner" | "dropped" | "pending", string>;
  detail: {
    home: string; viewLive: string; copy: string; copied: string;
    palette: string; typography: string; spacing: string; guidelines: string;
    do: string; dont: string; agentPrompt: string; moreLikeThis: string;
    comingSoon: string; comingSoonBody: string;
  };
};

export const STRINGS: Record<Lang, Strings> = {
  en: {
    worksLabel: "works",
    tagline: "Interface design systems, auto-evolved for AI agents.",
    langLabel: "Language", searchLabel: "Search works", searchPlaceholder: "Search designs…",
    filterLabel: "Filter",
    filters: { all: "All", project: "Project", scheduling: "Scheduling", ops: "Ops", finance: "Finance", analytics: "Analytics", landing: "Landing", mobile: "Mobile" },
    resultsLabel: "results", empty: "No designs match.",
    footer: "An auto-evolving gallery of interface design systems.",
    status: { winner: "Selected", dropped: "Cut", pending: "In review" },
    detail: {
      home: "Specimen", viewLive: "View live ↗", copy: "Copy", copied: "Copied",
      palette: "Color palette", typography: "Typography", spacing: "Spacing & shape", guidelines: "Guidelines",
      do: "Do", dont: "Don't", agentPrompt: "Agent prompt", moreLikeThis: "More like this",
      comingSoon: "Full spec coming soon",
      comingSoonBody: "This design's palette, guidelines, and agent prompt haven't been documented yet.",
    },
  },
  ko: {
    worksLabel: "작품",
    tagline: "AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화.",
    langLabel: "언어", searchLabel: "작품 검색", searchPlaceholder: "디자인 검색…",
    filterLabel: "필터",
    filters: { all: "전체", project: "프로젝트", scheduling: "일정", ops: "운영", finance: "금융", analytics: "분석", landing: "랜딩", mobile: "모바일" },
    resultsLabel: "개", empty: "해당하는 디자인이 없습니다.",
    footer: "스스로 진화하는 인터페이스 디자인 시스템 갤러리.",
    status: { winner: "채택", dropped: "탈락", pending: "심사 대기" },
    detail: {
      home: "Specimen", viewLive: "라이브 보기 ↗", copy: "복사", copied: "복사됨",
      palette: "컬러 팔레트", typography: "타이포그래피", spacing: "간격 · 형태", guidelines: "가이드라인",
      do: "권장", dont: "지양", agentPrompt: "에이전트 프롬프트", moreLikeThis: "비슷한 작품",
      comingSoon: "상세 스펙 준비 중",
      comingSoonBody: "이 디자인의 팔레트·가이드라인·에이전트 프롬프트는 아직 문서화되지 않았습니다.",
    },
  },
};

export function categoryLabel(cat: Work["category"], lang: Lang): string {
  if (!cat) return "";
  return STRINGS[lang].filters[cat];
}
