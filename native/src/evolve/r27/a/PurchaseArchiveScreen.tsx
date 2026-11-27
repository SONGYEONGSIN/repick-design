// native/src/evolve/r27/a/PurchaseArchiveScreen.tsx — auto-native-r27 candidate a.
//
// Bottom-band form #2 (persistent always-visible action bar): this is a read-only record of
// purchases that have already completed — there is no multi-step workflow to gate and nothing
// is "blocked", so the band is never a state machine. It carries exactly one real, always-
// available action (Export), which calls the native Share sheet with a plain-text digest of
// the list below. That Share.share call is a real API call with an observable effect, not a
// documented no-op — see data.ts `buildExportDigest`.
import { useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, Share, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  PURCHASES,
  TOTAL_SPENT_WON,
  ITEM_COUNT,
  LATEST_DATE_LABEL,
  EARLIEST_DATE_LABEL,
  formatKrwDigits,
  buildExportDigest,
  type PurchaseRecord,
  type ConditionLabel,
} from "./data";

const CONDITION_TONE: Record<ConditionLabel, { fg: string; bg: string; border: string }> = {
  "Like New": { fg: tokens.color.success, bg: tokens.color.successBg, border: tokens.color.successBorder },
  "Light Wear": { fg: tokens.color.muted, bg: tokens.color.bg, border: tokens.color.border },
  "Visible Wear": { fg: tokens.color.warning, bg: tokens.color.warningBg, border: tokens.color.warningBorder },
};

type ExportStatus = "idle" | "shared" | "dismissed" | "unavailable";

const STATUS_COPY: Record<Exclude<ExportStatus, "idle">, string> = {
  shared: "Purchase history shared.",
  dismissed: "Share sheet closed without sharing.",
  unavailable: "Couldn't open the share sheet. Try again in a moment.",
};

function ConditionBadge({ condition }: { condition: ConditionLabel }) {
  const tone = CONDITION_TONE[condition];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.badgeText, { color: tone.fg }]}>{condition}</Text>
    </View>
  );
}

function PriceReadout({ won }: { won: number }) {
  return (
    <View style={styles.priceRow}>
      <Text style={styles.priceCurrency}>KRW</Text>
      <Text style={styles.priceDigits}>{formatKrwDigits(won)}</Text>
    </View>
  );
}

function PurchaseRow({ item }: { item: PurchaseRecord }) {
  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: tokens.color[item.swatch] }]} accessibilityElementsHidden>
        <Text style={styles.swatchGlyph}>{item.itemTitle.charAt(0)}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.itemTitle}
        </Text>
        <Text style={styles.rowSpec}>{item.itemSpec}</Text>
        <View style={styles.rowMetaLine}>
          <Text style={styles.rowMeta}>{item.sellerName}</Text>
          <Text style={styles.rowMetaDot}>{"·"}</Text>
          <Text style={styles.rowMeta}>{item.completedDateLabel}</Text>
        </View>
        <View style={styles.rowFooter}>
          <ConditionBadge condition={item.condition} />
          <PriceReadout won={item.priceWon} />
        </View>
      </View>
    </View>
  );
}

function ArchiveHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Completed Purchases Archive
      </Text>
      <Text style={styles.sub}>
        {`${ITEM_COUNT} orders, all delivered and closed · ${EARLIEST_DATE_LABEL} – ${LATEST_DATE_LABEL}`}
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryStat}>
          <Text style={styles.summaryLabel}>Total spent</Text>
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryCurrency}>KRW</Text>
            <Text style={styles.summaryValue}>{formatKrwDigits(TOTAL_SPENT_WON)}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryStat}>
          <Text style={styles.summaryLabel}>Items purchased</Text>
          <Text style={styles.summaryValue}>{ITEM_COUNT}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryStat}>
          <Text style={styles.summaryLabel}>Most recent</Text>
          <Text style={styles.summaryValueSmall}>{LATEST_DATE_LABEL}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeading} accessibilityRole="header">
        Order record
      </Text>
    </View>
  );
}

export default function PurchaseArchiveScreen() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");

  // The only handler that writes into the screen's one live region (the band hint line
  // below). Nothing else on this screen mounts a second live region or writes into this
  // one, so a screen reader user never has to guess which region just changed.
  async function handleExportPress() {
    try {
      const digest = buildExportDigest(PURCHASES);
      const result = await Share.share(
        { message: digest, title: "Repick purchase history" },
        { dialogTitle: "Export purchase history" },
      );
      if (result.action === Share.sharedAction) {
        setExportStatus("shared");
      } else if (result.action === Share.dismissedAction) {
        setExportStatus("dismissed");
      }
    } catch {
      setExportStatus("unavailable");
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={PURCHASES}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PurchaseRow item={item} />}
        ListHeaderComponent={<ArchiveHeader />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band}>
        <View style={styles.bandTextWrap} accessibilityLiveRegion="polite">
          <Text style={styles.bandTitle}>Export this archive</Text>
          <Text
            style={styles.bandHint}
            accessibilityRole={exportStatus !== "idle" ? "alert" : undefined}
          >
            {exportStatus === "idle"
              ? "Share a text copy of all 12 completed orders."
              : STATUS_COPY[exportStatus]}
          </Text>
        </View>
        <Pressable
          onPress={handleExportPress}
          accessibilityRole="button"
          accessibilityLabel="Export purchase history"
          accessibilityHint="Opens the share sheet with a text summary of your completed purchases"
          style={({ pressed }) => [styles.exportButton, pressed && styles.exportButtonPressed]}
        >
          <Text style={styles.exportButtonText}>Export</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(6) },

  header: { paddingTop: tokens.space(8), paddingBottom: tokens.space(2) },
  h1: { fontSize: 26, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.muted },

  summaryCard: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(4),
    paddingHorizontal: tokens.space(3),
  },
  summaryStat: { flex: 1, alignItems: "flex-start" },
  summaryDivider: { width: 1, alignSelf: "stretch", backgroundColor: tokens.color.border, marginHorizontal: tokens.space(2) },
  summaryLabel: { fontSize: 11, color: tokens.color.faint, marginBottom: 4 },
  summaryValueRow: { flexDirection: "row", alignItems: "baseline" },
  summaryCurrency: { fontSize: 11, fontWeight: "700", color: tokens.color.ink, marginRight: 4 },
  summaryValue: { fontSize: 18, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  summaryValueSmall: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },

  sectionHeading: {
    marginTop: tokens.space(7),
    marginBottom: tokens.space(1),
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  row: {
    flexDirection: "row",
    paddingVertical: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  swatchGlyph: { fontSize: 16, fontWeight: "800", color: tokens.color.onInk },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  rowSpec: { fontSize: 12, color: tokens.color.muted, marginTop: 2 },
  rowMetaLine: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rowMeta: { fontSize: 12, color: tokens.color.faint },
  rowMetaDot: { fontSize: 12, color: tokens.color.faint, marginHorizontal: 5 },
  rowFooter: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: { borderWidth: 1, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  priceCurrency: { fontSize: 11, fontWeight: "700", color: tokens.color.ink2, marginRight: 4 },
  priceDigits: { fontSize: 14, fontWeight: "800", color: tokens.color.ink2, fontVariant: ["tabular-nums"] },

  band: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  bandTextWrap: { flex: 1, marginRight: tokens.space(3) },
  bandTitle: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  bandHint: { fontSize: 12, color: tokens.color.muted, marginTop: 2 },
  exportButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(5),
  },
  exportButtonPressed: { opacity: 0.85 },
  exportButtonText: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },
});
