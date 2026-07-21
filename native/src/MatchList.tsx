import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MATCHES, type Match } from "./data";

const ACCENT = "#4f46e5"; // 단일 액센트 (indigo-600)

function Card({ item }: { item: Match }) {
  return (
    <Pressable style={styles.card} accessibilityRole="button" accessibilityLabel={`${item.title}, 매칭 ${item.score}점`}>
      <View style={styles.cardHead}>
        <Text style={styles.grade}>{item.grade}</Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </Pressable>
  );
}

export function MatchList() {
  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">AI 매칭 결과</Text>
      <Text style={styles.sub}>RE:픽이 다시 고른 중고 — 오늘의 추천 {MATCHES.length}건</Text>
      <FlatList
        data={MATCHES}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <Card item={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 20, paddingTop: 56 },
  h1: { fontSize: 28, fontWeight: "800", color: "#18181b", letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: "#71717a" },
  list: { paddingVertical: 20, gap: 12 },
  card: { borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 16, backgroundColor: "#ffffff" },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  grade: { fontSize: 12, fontWeight: "700", color: "#ffffff", backgroundColor: ACCENT, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: "hidden" },
  score: { fontSize: 20, fontWeight: "800", color: "#18181b", fontVariant: ["tabular-nums"] },
  title: { marginTop: 12, fontSize: 15, fontWeight: "600", color: "#27272a", lineHeight: 21 },
  price: { marginTop: 6, fontSize: 14, color: "#52525b", fontVariant: ["tabular-nums"] },
});
