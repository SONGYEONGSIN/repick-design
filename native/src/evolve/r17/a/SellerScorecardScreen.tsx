// native/src/evolve/r17/a/SellerScorecardScreen.tsx — auto-native-r17 candidate a.
//
// Seller Performance Scorecard: a private, read-only analytics screen a seller opens on
// themselves (e.g. from an account/settings entry point) — never shown to buyers. Distinct from
// `storefront` (a public profile + browsable listing grid) and from `membership` (the full tier
// comparison/pricing tool): this screen reports on the seller's own operating metrics — response
// time, on-time shipping, rating trend — and references tier progress as ONE stat among several,
// without restating membership's fee/perk comparison.
//
// Bottom band: per GENERATION.md §3, a reporting screen like this has no multi-step gate to
// block on, so a blocked-workflow state machine would be unearned pattern-matching here. It also
// isn't a selection-driven list. What it does have is a genuine standing action — the seller may
// want to hand this snapshot to an accountant, a financing application, or their own records —
// so this uses the persistent-always-visible-action-bar form, same family as `storefront`'s
// bottom band but with its own single action.
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { Sparkline } from "../../../charts/Sparkline";
import { LineChart } from "../../../charts/LineChart";
import { BarBreakdown } from "../../../charts/BarBreakdown";
import {
  AS_OF_LABEL,
  RATING,
  RATING_HISTORY_12MO,
  RATING_HISTORY_6MO,
  RESPONSE,
  SHARE_CONFIRMATION,
  SHIPPING,
  TIER_PROGRESS,
  WINDOW_LABEL,
  formatWon,
  onTimeShipRatePercent,
  tierProgressPercent,
  tierRemainingWon,
} from "./data";
import { MetricCard, MonthDetailHeader, MonthDetailRow, RatingSummary } from "./components";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function SellerScorecardScreen() {
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [shared, setShared] = useState(false);

  const onTimeRate = onTimeShipRatePercent();
  const progressPercent = tierProgressPercent();
  const remainingWon = tierRemainingWon();

  const toggleHistory = () => setHistoryExpanded((v) => !v);
  const handleShare = () => setShared(true);

  const oldestVisible = historyExpanded
    ? RATING_HISTORY_12MO[0]
    : RATING_HISTORY_6MO[0];
  const newestVisible = RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>SELLER ANALYTICS</Text>
        <Text style={styles.title} accessibilityRole="header">
          Performance Scorecard
        </Text>
        <Text style={styles.subtitle}>
          Based on your last 90 days of activity · {WINDOW_LABEL}
        </Text>
        <Text style={styles.asOf}>{AS_OF_LABEL}</Text>

        <View style={styles.metricRow}>
          <MetricCard
            label="Avg. reply time"
            value={RESPONSE.avgResponseLabel}
            trend={RESPONSE.trend}
            footnote={`Was ${RESPONSE.priorPeriodMinutes} min last period`}
          />
          <MetricCard
            label="On-time shipments"
            value={`${onTimeRate}%`}
            trend={SHIPPING.trend}
            footnote={`${SHIPPING.lateShipmentsLast90} late of ${SHIPPING.totalShipmentsLast90} orders`}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHead} accessibilityRole="header">
            Rating Trend
          </Text>

          <RatingSummary
            current={RATING.current}
            trend={RATING.trend}
            reviewCount={RATING.reviewCountLast90}
          />

          <View style={styles.chartWrap}>
            {historyExpanded ? (
              <LineChart
                points={RATING_HISTORY_12MO.map((m) => ({
                  day: m.monthLabel.slice(0, 3),
                  price: m.rating,
                }))}
                width={300}
                height={150}
                accessibilityLabel={`12-month rating history, from ${oldestVisible.monthLabel} at ${oldestVisible.rating.toFixed(2)} to ${newestVisible.monthLabel} at ${newestVisible.rating.toFixed(2)}`}
                formatY={(n) => n.toFixed(2)}
              />
            ) : (
              <Sparkline
                data={RATING_HISTORY_6MO.map((m) => m.rating)}
                width={300}
                height={64}
                accessibilityLabel={`6-month rating trend, from ${oldestVisible.monthLabel} at ${oldestVisible.rating.toFixed(2)} to ${newestVisible.monthLabel} at ${newestVisible.rating.toFixed(2)}`}
              />
            )}
          </View>

          <View accessibilityLiveRegion="polite">
            <Text style={styles.rangeCaption} accessibilityRole="alert">
              {historyExpanded
                ? "Now showing 12 months of rating history."
                : "Now showing the last 6 months."}
            </Text>
          </View>

          <Pressable
            onPress={toggleHistory}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityState={{ expanded: historyExpanded }}
            accessibilityLabel={
              historyExpanded
                ? "Collapse to the last 6 months"
                : "View full 12-month history"
            }
            style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
          >
            <Text style={styles.linkButtonText}>
              {historyExpanded ? "Show last 6 months" : "View full 12-month history"}
            </Text>
          </Pressable>

          {historyExpanded ? (
            <View style={styles.monthTable}>
              <MonthDetailHeader />
              <FlatList
                data={RATING_HISTORY_12MO}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MonthDetailRow item={item} />}
                scrollEnabled={false}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHead} accessibilityRole="header">
            Tier Progress
          </Text>
          <Text style={styles.tierLine}>
            You're on <Text style={styles.tierName}>{TIER_PROGRESS.currentTierName}</Text>,
            working toward{" "}
            <Text style={styles.tierName}>{TIER_PROGRESS.nextTierName}</Text>.
          </Text>

          <BarBreakdown
            data={[{ label: TIER_PROGRESS.nextTierName, value: progressPercent }]}
            max={100}
            accessibilityLabel={`${progressPercent}% of the way from ${TIER_PROGRESS.currentTierName} to ${TIER_PROGRESS.nextTierName}`}
            barWidth={180}
          />

          <Text style={styles.tierDetail}>
            {formatWon(TIER_PROGRESS.currentVolumeWon)} of{" "}
            {formatWon(TIER_PROGRESS.thresholdWon)} in {TIER_PROGRESS.windowLabel.toLowerCase()}{" "}
            — {formatWon(remainingWon)} to go.
          </Text>
          <Text style={styles.tierFootnote}>
            {TIER_PROGRESS.nextTierName} unlocks lower selling fees and faster payouts.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.band}>
        <View accessibilityLiveRegion="polite" style={styles.bandTextWrap}>
          {shared ? (
            <Text style={styles.bandFeedback} accessibilityRole="alert">
              {SHARE_CONFIRMATION}
            </Text>
          ) : (
            <Text style={styles.bandLead}>Keep this scorecard for your own records.</Text>
          )}
        </View>
        <Pressable
          onPress={handleShare}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Share scorecard"
          style={({ pressed }) => [styles.shareBtn, pressed && styles.pressed]}
        >
          <Text style={styles.shareBtnText}>Share scorecard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollBody: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(7),
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  title: {
    marginTop: tokens.space(1),
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  asOf: {
    marginTop: 2,
    fontSize: 11,
    color: tokens.color.faint,
  },

  metricRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(5),
  },

  section: {
    marginTop: tokens.space(6),
  },
  sectionHead: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  chartWrap: {
    marginTop: tokens.space(4),
    alignItems: "center",
  },
  rangeCaption: {
    marginTop: tokens.space(2),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },
  linkButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  pressed: {
    opacity: 0.75,
  },

  monthTable: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingTop: tokens.space(3),
    overflow: "hidden",
  },

  tierLine: {
    marginTop: tokens.space(3),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink2,
  },
  tierName: {
    fontWeight: "800",
    color: tokens.color.ink,
  },
  tierDetail: {
    marginTop: tokens.space(3),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  tierFootnote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },

  band: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandTextWrap: {
    flex: 1,
  },
  bandLead: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  bandFeedback: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  shareBtn: {
    minHeight: 48,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
