import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MATCHES, type Match } from "./data";
import { BarBreakdown } from "./charts/BarBreakdown";
import { tokens } from "./tokens";

function Card({ item }: { item: Match }) {
  return (
    <Pressable style={styles.card} accessibilityRole="button" accessibilityLabel={`${item.title}, match score ${item.score}`}>
      <View style={styles.cardHead}>
        <Text style={styles.grade}>{item.grade}</Text>
        <Text style={styles.score}>{item.score}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.factorCaption}>Match factors</Text>
      <BarBreakdown
        data={item.factors}
        accessibilityLabel={`${item.title} match factors: ${item.factors.map((f) => `${f.label} ${f.value}`).join(", ")}`}
      />
    </Pressable>
  );
}

export function MatchList() {
  return (
    <View style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">AI Match Results</Text>
      <Text style={styles.sub}>Secondhand, re-picked by RE:Pick — {MATCHES.length} picks today</Text>
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
  root: { flex: 1, backgroundColor: tokens.color.bg, paddingHorizontal: tokens.space(5), paddingTop: tokens.space(14) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },
  list: { paddingVertical: 20, gap: tokens.space(3) },
  card: { borderWidth: 1, borderColor: tokens.color.border, borderRadius: tokens.radius.md, padding: tokens.space(4), backgroundColor: tokens.color.bg },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  grade: { fontSize: 12, fontWeight: "700", color: tokens.color.onAccent, backgroundColor: tokens.color.accent, paddingHorizontal: tokens.space(2), paddingVertical: 2, borderRadius: tokens.radius.sm, overflow: "hidden" },
  score: { fontSize: 20, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  title: { marginTop: 12, fontSize: 15, fontWeight: "600", color: tokens.color.ink2, lineHeight: 21 },
  price: { marginTop: 6, fontSize: 14, color: tokens.color.muted, fontVariant: ["tabular-nums"] },
  factorCaption: { marginTop: 14, fontSize: 11, fontWeight: "700", color: tokens.color.faint, letterSpacing: 0.4, textTransform: "uppercase" },
});
