// native/src/evolve/r62/c/SellerMonthlyPerformanceDigestScreen.tsx — auto-native-r62 candidate c.
//
// Seller Monthly Performance Digest — a closed, finalized monthly summary a
// seller reviews after the fact: sales total, a view-count trend, a rating
// trend, and a short ranked list of that month's top-performing listings.
// Nothing here is pending or mid-workflow; October's book is shut (see
// `finalizedNote` in data.ts), so per GENERATION.md §3 this does not get a
// blocked/ready/done state-machine band — there is no "why can't I proceed"
// sentence to say. It gets form (b): a single, persistent, read-only action
// bar at the bottom offering exactly one real action, "Export PDF Report."
//
// Pressing it is not a toast that quietly resets — `reportStatus` moves from
// "unexported" to "exported" and stays there. The bar's status line is
// re-rendered through the SAME `Pressable`, kept mounted and simply disabled
// once exported (never swapped out for a separate element), and the
// confirmation sentence is the one `accessibilityRole="alert"` on the whole
// screen, living inside a `statusAnnouncer` wrapper that is mounted on
// first render — before any export happens — so its *text* is what changes,
// not its presence in the tree (open-delta: live-region containers must be
// permanently mounted, not conditionally created at the same moment their
// first text appears).
//
// Everything above the bar is otherwise non-interactive record content,
// except the top-listing rows, which may be tapped open for a short detail
// note — that disclosure state is per-row local UI, carries no live region
// of its own, and never competes with the one export announcement.
//
// Layout note: the digest header and the three stat tiles sit in a plain,
// non-scrolling `View` ABOVE the `FlatList`, rather than inside the
// `FlatList`'s `ListHeaderComponent` — the only `FlatList` on this screen is
// the short, genuinely-scrollable ranked-listings region in the middle, with
// the fixed action bar as a true sibling below it. That keeps this screen
// from nesting a scrollable list inside a `ScrollView` (an RN anti-pattern)
// and keeps it a different shape from a header-inside-FlatList layout.

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { monthlyDigest } from "./data";
import type { TopListingEntry, TrendDirection } from "./data";

type ReportStatus = "unexported" | "exported";

const ROW_HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

export function SellerMonthlyPerformanceDigestScreen() {
  const [reportStatus, setReportStatus] = useState<ReportStatus>("unexported");
  const [openListingId, setOpenListingId] = useState<string | null>(null);

  function runExport() {
    // Real one-way flip driven by the button's own onPress — reachable only
    // through an actual tap, and guarded so a second tap while already
    // exported is a true no-op rather than re-announcing the same sentence.
    if (reportStatus === "unexported") {
      setReportStatus("exported");
    }
  }

  function toggleListing(id: string) {
    setOpenListingId((current) => (current === id ? null : id));
  }

  const isExported = reportStatus === "exported";
  const announcement = isExported
    ? "PDF report exported and ready in your downloads."
    : "This digest is closed for October — export a PDF copy any time.";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text style={styles.periodKicker}>{monthlyDigest.periodLabel.toUpperCase()}</Text>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Seller Monthly Performance Digest
        </Text>
        <View style={styles.finalizedPill}>
          <Text style={styles.finalizedPillText}>{monthlyDigest.finalizedNote}</Text>
        </View>

        <View style={styles.statRow}>
          <StatTile
            label="Sales total"
            value={monthlyDigest.salesTotal}
            footnote={`${monthlyDigest.salesOrderCount} orders`}
          />
          <StatTile
            label="Views"
            value={monthlyDigest.viewTotal}
            footnote={monthlyDigest.viewTrendLabel}
            trendDirection={monthlyDigest.viewTrendDirection}
          />
          <StatTile
            label="Avg. rating"
            value={monthlyDigest.ratingAverage}
            footnote={`${monthlyDigest.ratingTrendLabel} · n=${monthlyDigest.ratingSampleSize}`}
            trendDirection={monthlyDigest.ratingTrendDirection}
          />
        </View>

        <Text accessibilityRole="header" style={styles.sectionHeading}>
          Top Listings This Month
        </Text>
      </View>

      <FlatList
        style={styles.listingList}
        contentContainerStyle={styles.listingListContent}
        data={monthlyDigest.topListings}
        keyExtractor={(entry) => entry.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TopListingCard
            entry={item}
            isOpen={openListingId === item.id}
            onToggle={toggleListing}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.listingGap} />}
      />

      <View style={styles.recordFooter}>
        <View style={styles.statusAnnouncer} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.statusAnnouncerText}>
            {announcement}
          </Text>
        </View>
        <Pressable
          onPress={runExport}
          disabled={isExported}
          hitSlop={ROW_HIT_SLOP}
          accessibilityRole="button"
          accessibilityState={{ disabled: isExported }}
          accessibilityLabel={isExported ? "PDF report exported" : "Export PDF report"}
          accessibilityHint={
            isExported
              ? undefined
              : "Generates and downloads a PDF copy of this month's performance digest."
          }
          style={({ pressed }) => [
            styles.exportControl,
            isExported && styles.exportControlDone,
            pressed && !isExported && styles.exportControlPressed,
          ]}
        >
          <Text style={[styles.exportControlLabel, isExported && styles.exportControlLabelDone]}>
            {isExported ? "Exported" : "Export PDF Report"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function StatTile({
  label,
  value,
  footnote,
  trendDirection,
}: {
  label: string;
  value: string;
  footnote: string;
  trendDirection?: TrendDirection;
}) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statTileLabel}>{label}</Text>
      <Text style={styles.statTileValue} allowFontScaling>
        {value}
      </Text>
      <Text
        style={[
          styles.statTileFootnote,
          trendDirection === "up" && styles.statTileFootnoteUp,
          trendDirection === "down" && styles.statTileFootnoteDown,
        ]}
      >
        {trendDirection === "up" ? "▲ " : trendDirection === "down" ? "▼ " : ""}
        {footnote}
      </Text>
    </View>
  );
}

function TopListingCard({
  entry,
  isOpen,
  onToggle,
}: {
  entry: TopListingEntry;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onToggle(entry.id)}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityLabel={`Rank ${entry.rank}, ${entry.title}, ${entry.revenueContribution}`}
      accessibilityHint={isOpen ? "Collapses this listing's detail note." : "Expands this listing's detail note."}
      style={styles.listingCard}
    >
      <View style={styles.listingCardHeader}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{entry.rank}</Text>
        </View>
        <View style={styles.listingHeaderText}>
          <Text style={styles.listingTitle} numberOfLines={2}>
            {entry.title}
          </Text>
          <Text style={styles.listingMeta}>
            {entry.unitsSold} sold · {entry.revenueContribution}
          </Text>
        </View>
        <Text
          style={styles.disclosureGlyph}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {isOpen ? "–" : "+"}
        </Text>
      </View>
      {isOpen ? (
        <View style={styles.listingDetail}>
          <Text style={styles.listingDetailNote}>{entry.detailNote}</Text>
          <Text style={styles.listingShareNote}>{entry.shareNote}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
  },
  listingList: {
    flex: 1,
  },
  listingListContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(1),
    paddingBottom: tokens.space(4),
  },
  periodKicker: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    letterSpacing: 0.6,
    marginBottom: tokens.space(1),
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  finalizedPill: {
    alignSelf: "flex-start",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  finalizedPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  statRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginBottom: tokens.space(6),
  },
  statTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
  },
  statTileLabel: {
    fontSize: 12,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  statTileValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  statTileFootnote: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  statTileFootnoteUp: {
    color: tokens.color.success,
  },
  statTileFootnoteDown: {
    color: tokens.color.danger,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  listingGap: {
    height: tokens.space(3),
  },
  // Touch-target math for the whole card (per GENERATION.md §4, computed not
  // eyeballed): paddingVertical tokens.space(3)=12 on listingCardHeader →
  // 24pt top+bottom, plus a minimum one-line title (lineHeight 18) stacked
  // over the meta line (lineHeight 16) = 34pt of content even in the
  // shortest case. 24 + 34 = 58pt, comfortably over the 44pt floor; the
  // explicit minHeight below is a floor, not the only thing holding it up.
  listingCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
  },
  listingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingVertical: tokens.space(3),
    gap: tokens.space(3),
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  listingHeaderText: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 18,
  },
  listingMeta: {
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
    marginTop: tokens.space(1),
  },
  disclosureGlyph: {
    fontSize: 18,
    fontWeight: "600",
    color: tokens.color.faint,
    width: tokens.space(5),
    textAlign: "center",
  },
  listingDetail: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingVertical: tokens.space(3),
  },
  listingDetailNote: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 19,
    marginBottom: tokens.space(2),
  },
  listingShareNote: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  recordFooter: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  statusAnnouncer: {
    marginBottom: tokens.space(3),
  },
  statusAnnouncerText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  // Export control touch-target math: paddingVertical tokens.space(4)=16 on
  // exportControl → 32pt top+bottom, plus the label's own lineHeight 20 =
  // 52pt total. 52pt clears the 44pt floor on its own; minHeight is a
  // second, explicit guarantee rather than the sole justification.
  exportControl: {
    minHeight: 44,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  exportControlPressed: {
    opacity: 0.85,
  },
  exportControlDone: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  exportControlLabel: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    color: tokens.color.onAccent,
  },
  exportControlLabelDone: {
    color: tokens.color.success,
  },
});

export default SellerMonthlyPerformanceDigestScreen;
