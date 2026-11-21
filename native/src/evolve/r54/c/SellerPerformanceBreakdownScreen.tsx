// native/src/evolve/r54/c/SellerPerformanceBreakdownScreen.tsx — auto-native-r54 candidate c.
//
// Seller Performance Score Breakdown — a read-only record screen, not a
// workflow. Four fixed metric rows always show their headline value; each
// row toggles independently via a Set<string> of expanded ids (NOT a single
// "which one is open" index), so any combination — none, one, several, or
// all four — can be open at once. Expanding a row reveals how its headline
// number was calculated.
//
// The one real action is "Request Manual Review". Whether it is enabled is
// a derived boolean, recomputed every render straight from the metric data
// (isMetricHealthy() per metric in data.ts) — never a cached flag. When
// disabled, the reason is permanent visible text, not just a greyed button.
// Pressing it when enabled flips the action area into a "Review requested"
// confirmation; that transition (the one point where proceed-ability
// changes) is the screen's single accessibilityRole="alert" inside a
// container carrying accessibilityLiveRegion="polite" — the accordion
// toggles below are plain local UI state and deliberately carry neither.
//
// This screen has no bottom band: the action sits in-flow at the end of the
// scroll content (ScrollView, not FlatList — four rows is a small fixed
// list, not a dynamic one), per this repo's doctrine that a read-only
// record screen's one real action doesn't need to be sticky to be valid
// (native/GENERATION.md §3; established r45/c, r48/b).
//
// Differentiation from this round's nearest neighbors (see candidates/c.md
// "Non-duplication check" for the full reasoning):
//   - verification/SellerVerificationScreen: FlatList accordion of 4 *steps*
//     with a single expandedStep index, fixed external band acting as a
//     blocked-workflow state machine. This screen has no steps, no
//     blocking, a Set (not an index) for expansion, and no fixed band.
//   - evolve/r37/b SellerFeeCommissionStatementScreen: accordion statement
//     with zero actions at all. This screen adds exactly one conditional
//     action that screen never has.
//   - evolve/r31/b SecurityActivityLogScreen: flat (non-accordion) log with
//     a persistent two-button band and a Cancel/Confirm inline-row
//     confirmation step. This screen is an accordion (not flat), has one
//     action (not two), no confirm/cancel step, and no fixed band.
//   - evolve/r53/c SizeReferenceScreen: filterable/searchable accordion
//     reference tool with zero workflow action. This screen is a fixed
//     4-row list (no filter/search/sort) with one conditional action.

import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../../tokens";
import {
  PERFORMANCE_METRICS,
  SCORE_PERIOD_LABEL,
  isMetricHealthy,
  type PerformanceMetric,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export default function SellerPerformanceBreakdownScreen() {
  const [expandedMetricIds, setExpandedMetricIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [reviewRequested, setReviewRequested] = useState(false);

  // Derived fresh every render — never stored/cached.
  const unhealthyMetrics = PERFORMANCE_METRICS.filter(
    (metric) => !isMetricHealthy(metric),
  );
  const canRequestReview = unhealthyMetrics.length > 0;
  const healthyCount = PERFORMANCE_METRICS.length - unhealthyMetrics.length;

  const toggleMetric = (id: string) => {
    setExpandedMetricIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRequestReview = () => {
    if (!canRequestReview || reviewRequested) return;
    setReviewRequested(true);
  };

  const reasonText = !canRequestReview
    ? "All metrics are currently healthy — nothing to review."
    : unhealthyMetrics.length === 1
      ? `${unhealthyMetrics[0].label} is outside its healthy range. A specialist will re-check the numbers behind it.`
      : `${unhealthyMetrics.length} metrics are outside their healthy range. A specialist will re-check the numbers behind them.`;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>REPICK SELLER</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Performance Score Breakdown
          </Text>
          <Text style={styles.subtitle}>
            How each part of your seller score was calculated. Tap a metric
            to see the numbers behind it.
          </Text>
          <Text style={styles.periodLabel}>{SCORE_PERIOD_LABEL}</Text>
        </View>

        <View style={styles.summaryStrip}>
          <Text style={styles.summaryStripText}>
            {healthyCount} of {PERFORMANCE_METRICS.length} metrics healthy
          </Text>
        </View>

        <View style={styles.metricList}>
          {PERFORMANCE_METRICS.map((metric) =>
            renderMetricRow(metric, expandedMetricIds.has(metric.id), toggleMetric),
          )}
        </View>

        <View style={styles.actionSection} accessibilityLiveRegion="polite">
          {reviewRequested ? (
            <View style={styles.confirmationCard}>
              <Text
                accessibilityRole="alert"
                style={styles.confirmationTitle}
              >
                Review requested
              </Text>
              <Text style={styles.confirmationBody}>
                Repick's trust and safety team will re-check the metrics
                above and follow up on your account. This does not change
                your score on its own.
              </Text>
            </View>
          ) : (
            <View style={styles.actionCard}>
              <Pressable
                onPress={handleRequestReview}
                disabled={!canRequestReview}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canRequestReview }}
                accessibilityLabel="Request manual review"
                style={({ pressed }) => [
                  styles.actionButton,
                  canRequestReview && styles.actionButtonEnabled,
                  !canRequestReview && styles.actionButtonDisabled,
                  pressed && canRequestReview && styles.actionButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    !canRequestReview && styles.actionButtonTextDisabled,
                  ]}
                >
                  Request Manual Review
                </Text>
              </Pressable>
              <Text style={styles.actionReasonText}>{reasonText}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function renderMetricRow(
  metric: PerformanceMetric,
  expanded: boolean,
  onToggle: (id: string) => void,
) {
  const healthy = isMetricHealthy(metric);
  const statusLabel = healthy ? "Healthy" : "Needs attention";

  return (
    <View key={metric.id} style={styles.metricCard}>
      <Pressable
        onPress={() => onToggle(metric.id)}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${metric.label}, ${metric.displayValue}, ${statusLabel}, ${expanded ? "expanded" : "collapsed"}`}
        style={({ pressed }) => [
          styles.metricHeader,
          pressed && styles.metricHeaderPressed,
        ]}
      >
        <View style={styles.metricHeaderLeft}>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <View style={styles.metricHeadlineRow}>
            <Text style={styles.metricHeadlineValue}>
              {metric.displayValue}
            </Text>
            <View
              style={[
                styles.metricStatusPill,
                healthy
                  ? styles.metricStatusPillHealthy
                  : styles.metricStatusPillAttention,
              ]}
            >
              <Text
                style={[
                  styles.metricStatusPillText,
                  { color: healthy ? tokens.color.success : tokens.color.danger },
                ]}
              >
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.metricChevron} accessibilityElementsHidden>
          {expanded ? "▾" : "▸"}
        </Text>
      </Pressable>

      {expanded ? (
        <View style={styles.metricBody}>
          <Text style={styles.metricBodyHeadline}>{metric.detailHeadline}</Text>
          {metric.detailLines.map((line) => (
            <Text key={line} style={styles.metricDetailLine}>
              {line}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(8),
  },
  header: {
    paddingBottom: tokens.space(2),
  },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  periodLabel: {
    marginTop: tokens.space(3),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  summaryStrip: {
    marginTop: tokens.space(4),
    marginBottom: tokens.space(1),
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  summaryStripText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  metricList: {
    marginTop: tokens.space(3),
    gap: tokens.space(3),
  },
  metricCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  metricHeaderPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  metricHeaderLeft: {
    flex: 1,
    gap: tokens.space(1),
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  metricHeadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  metricHeadlineValue: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  metricStatusPill: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  metricStatusPillHealthy: {
    backgroundColor: tokens.color.successBg,
  },
  metricStatusPillAttention: {
    backgroundColor: tokens.color.dangerBg,
  },
  metricStatusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  metricChevron: {
    fontSize: 15,
    color: tokens.color.faint,
  },
  metricBody: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1.5),
  },
  metricBodyHeadline: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  metricDetailLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  actionSection: {
    marginTop: tokens.space(5),
  },
  actionCard: {
    gap: tokens.space(2),
  },
  actionButton: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
  },
  actionButtonEnabled: {
    backgroundColor: tokens.color.accent,
  },
  actionButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  actionButtonTextDisabled: {
    color: tokens.color.faint,
  },
  actionReasonText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  confirmationCard: {
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: tokens.space(1),
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  confirmationBody: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
});
