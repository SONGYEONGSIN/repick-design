// 순수 함수 — 달력 그리드/주간 그리드 조립 로직. 상태·부수효과 없음(결정론적).

import type { DayMeta, Post } from "./data";

export interface MonthCell extends DayMeta {
  events: Post[];
}

const MINUTES = (p: Post) => p.hour * 60 + p.minute;

/** 날짜별 게시물(시간순 정렬)을 붙인 월간 셀 배열. */
export function buildMonthCells(days: DayMeta[], posts: Post[]): MonthCell[] {
  return days.map((day) => ({
    ...day,
    events: posts.filter((p) => p.date === day.date).sort((a, b) => MINUTES(a) - MINUTES(b)),
  }));
}

export interface WeekHourRow {
  hour: number;
  /** 요일 인덱스(0=일..6=토) 순서의 셀 — 각 셀은 해당 시각에 걸린 게시물 목록. */
  cells: Post[][];
}

/** 주간 뷰 시간대별 행 조립: hours x 7일. */
export function buildWeekRows(week: DayMeta[], posts: Post[], hours: number[]): WeekHourRow[] {
  return hours.map((hour) => ({
    hour,
    cells: week.map((day) =>
      posts.filter((p) => p.date === day.date && p.hour === hour).sort((a, b) => MINUTES(a) - MINUTES(b)),
    ),
  }));
}

/** 특정 날짜에 속한 게시물(시간순). */
export function eventsForDate(posts: Post[], date: string): Post[] {
  return posts.filter((p) => p.date === date).sort((a, b) => MINUTES(a) - MINUTES(b));
}
