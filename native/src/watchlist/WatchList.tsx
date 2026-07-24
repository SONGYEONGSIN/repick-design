import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { WATCHLIST, formatKRW, priceChange, pctLabel, type WatchItem } from "./data";
import { Sparkline } from "../charts/Sparkline";
import { tokens } from "../tokens";

// 가격 알림 토글 — 로컬 상태(초기값은 데이터의 결정론 고정값).
function AlertToggle({ initialOn, title }: { initialOn: boolean; title: string }) {
  const [on, setOn] = useState(initialOn);
  return (
    <Pressable
      onPress={() => setOn((v) => !v)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`${title} 가격 알림 ${on ? "켜짐" : "꺼짐"}`}
      style={[styles.track, on ? styles.trackOn : styles.trackOff]}
    >
      <View style={[styles.thumb, on ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

// 가격변동 배지 — 인하는 액센트로 강조, 인상/변동없음은 절제된 아웃라인.
function PriceBadge({ item }: { item: WatchItem }) {
  const change = priceChange(item);
  const box = change.kind === "drop" ? styles.badgeDrop : styles.badgeQuiet;
  const label =
    change.kind === "drop"
      ? styles.badgeDropLabel
      : change.kind === "rise"
        ? styles.badgeRiseLabel
        : styles.badgeFlatLabel;
  return (
    <View style={[styles.badge, box]}>
      <Text style={[styles.badgeLabel, label]}>{change.label}</Text>
    </View>
  );
}

function WatchRow({ item }: { item: WatchItem }) {
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.info}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} 매물 상세 보기`}
      >
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.current}>{formatKRW(item.current)}</Text>
          <Text style={styles.original}>{formatKRW(item.original)}</Text>
          <View style={styles.trend}>
            <Sparkline
              data={item.priceSeries}
              width={60}
              height={22}
              accessibilityLabel={`${item.title} 가격 추세, 최근 ${item.priceSeries.length}일, 등락 ${pctLabel(item.priceSeries)}`}
            />
            <Text style={styles.trendPct}>{pctLabel(item.priceSeries)}</Text>
          </View>
        </View>
        <View style={styles.badgeWrap}>
          <PriceBadge item={item} />
        </View>
      </Pressable>
      <View style={styles.alertCol}>
        <AlertToggle initialOn={item.alertOn} title={item.title} />
        <Text style={styles.alertCaption}>가격 알림</Text>
      </View>
    </View>
  );
}

export function WatchList() {
  const dropCount = WATCHLIST.filter((w) => w.current < w.original).length;
  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">
        관심목록
      </Text>
      <Text style={styles.sub}>
        저장한 매물 {WATCHLIST.length}건 · 가격 인하 {dropCount}건
      </Text>
      <FlatList
        data={WATCHLIST}
        keyExtractor={(w) => w.id}
        renderItem={({ item }) => <WatchRow item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(14),
  },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },
  list: { paddingVertical: tokens.space(5), gap: tokens.space(3) },

  // 가로형 카드: 좌측 정보 블록 + 우측 알림 컬럼 (MatchList의 세로 스택과 구분).
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },

  // 원가↔현재가 비교: 현재가 강조 + 원가 취소선.
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: tokens.space(2), marginTop: 8 },
  current: { fontSize: 17, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  original: {
    fontSize: 13,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
    fontVariant: ["tabular-nums"],
  },

  // 가격 추세: 우측 정렬 스파크라인 + 등락% 텍스트(색 아닌 부호로 방향 — 단일 액센트 DNA).
  trend: { marginLeft: "auto", alignSelf: "center", flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  trendPct: { fontSize: 12, fontWeight: "600", color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  badgeWrap: { flexDirection: "row", marginTop: 10 },
  badge: { paddingHorizontal: tokens.space(2), paddingVertical: 3, borderRadius: tokens.radius.sm },
  badgeDrop: { backgroundColor: tokens.color.accent },
  badgeQuiet: { borderWidth: 1, borderColor: tokens.color.border },
  badgeLabel: { fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  badgeDropLabel: { color: tokens.color.onAccent },
  badgeRiseLabel: { color: tokens.color.ink2 },
  badgeFlatLabel: { color: tokens.color.faint },

  // 알림 스위치: track(radius.md→pill) + thumb(radius.sm→원형), 토큰 radius만 사용.
  alertCol: { alignItems: "center", gap: 6 },
  track: {
    width: 40,
    height: 24,
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(1),
  },
  trackOn: { backgroundColor: tokens.color.accent, justifyContent: "flex-end" },
  trackOff: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "flex-start",
  },
  thumb: { width: 12, height: 12, borderRadius: tokens.radius.sm },
  thumbOn: { backgroundColor: tokens.color.onAccent },
  thumbOff: { backgroundColor: tokens.color.faint },
  alertCaption: { fontSize: 11, color: tokens.color.faint },
});
