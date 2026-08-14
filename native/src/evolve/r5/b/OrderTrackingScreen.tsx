import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CONFIRMED_AT_LABEL,
  COURIER,
  ORDER,
  ORDER_STEPS,
  formatWonAmount,
  type StepStatus,
  type TrackingStep,
} from "./data";

const STATUS_TEXT: Record<StepStatus, string> = {
  done: "completed",
  current: "current step",
  upcoming: "upcoming",
};

export function OrderTrackingScreen() {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [trackingExpanded, setTrackingExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const steps = ORDER_STEPS;
  const currentIndex = steps.findIndex((step) => step.status === "current");
  const finalIndex = steps.length - 1;
  const atFinalStep = currentIndex === finalIndex;
  const nextStep =
    currentIndex >= 0 && currentIndex < finalIndex
      ? steps[currentIndex + 1]
      : null;

  const toggleStep = (id: string) => {
    setExpandedStepId((prev) => (prev === id ? null : id));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TrackingStep;
    index: number;
  }) => {
    const expanded = expandedStepId === item.id;
    const isDone = item.status === "done";
    const isCurrent = item.status === "current";
    const isFirst = index === 0;
    const isLast = index === steps.length - 1;
    const priorReached = index > 0 && steps[index - 1].status !== "upcoming";
    const throughSelf = item.status !== "upcoming";

    return (
      <Pressable
        onPress={() => toggleStep(item.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded, selected: isCurrent }}
        accessibilityLabel={`${item.label}, ${STATUS_TEXT[item.status]}, ${item.dateLabel}`}
        accessibilityHint="Double tap to show more detail about this step"
        hitSlop={4}
        style={({ pressed }) => [
          styles.stepRow,
          pressed && styles.stepRowPressed,
        ]}
      >
        <View style={styles.rail}>
          <View
            style={[
              styles.railLine,
              isFirst ? styles.railLineHidden : null,
              !isFirst && priorReached ? styles.railLineActive : null,
            ]}
          />
          <View
            style={[
              styles.dot,
              isDone && styles.dotDone,
              isCurrent && styles.dotCurrent,
            ]}
          >
            {isDone ? <View style={styles.dotInner} /> : null}
          </View>
          <View
            style={[
              styles.railLine,
              isLast ? styles.railLineHidden : null,
              !isLast && throughSelf ? styles.railLineActive : null,
            ]}
          />
        </View>

        <View style={styles.stepBody}>
          <View style={styles.stepHeadRow}>
            <Text
              style={[
                styles.stepLabel,
                isCurrent && styles.stepLabelCurrent,
                item.status === "upcoming" && styles.stepLabelUpcoming,
              ]}
            >
              {item.label}
            </Text>
            {isCurrent ? (
              <View style={styles.currentTag}>
                <Text style={styles.currentTagText}>Current</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.stepDate}>{item.dateLabel}</Text>
          <Text style={styles.stepSummary}>{item.summary}</Text>
          {expanded ? (
            <View style={styles.stepDetail}>
              <Text style={styles.stepDetailText}>{item.detail}</Text>
            </View>
          ) : null}
          <Text style={styles.stepToggleHint}>
            {expanded ? "Hide detail" : "Show detail"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK ORDER</Text>
            <Text style={styles.title} accessibilityRole="header">
              Order status
            </Text>
            <Text style={styles.lede}>
              Order {ORDER.orderId}, placed {ORDER.orderedDateLabel}.
            </Text>

            <View style={styles.itemCard}>
              <Text style={styles.itemTitle}>{ORDER.itemTitle}</Text>
              <Text style={styles.itemSpec}>{ORDER.itemSpec}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>
                  <Text style={styles.priceWonSign}>₩</Text>
                  {formatWonAmount(ORDER.priceWon)}
                </Text>
                <Text style={styles.priceNote}>
                  paid to seller {ORDER.sellerName}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setTrackingExpanded((prev) => !prev)}
              accessibilityRole="button"
              accessibilityState={{ expanded: trackingExpanded }}
              accessibilityLabel={`Tracking with ${COURIER.carrierName}, reference ${COURIER.trackingNumber}`}
              accessibilityHint="Double tap to show courier contact and last scan location"
              hitSlop={4}
              style={({ pressed }) => [
                styles.courierCard,
                pressed && styles.courierCardPressed,
              ]}
            >
              <View style={styles.courierTop}>
                <View style={styles.courierTextCol}>
                  <Text style={styles.courierLabel}>
                    {COURIER.carrierName}
                  </Text>
                  <Text style={styles.courierTracking}>
                    {COURIER.trackingNumber}
                  </Text>
                </View>
                <Text style={styles.courierChevron}>
                  {trackingExpanded ? "Hide" : "Details"}
                </Text>
              </View>
              {trackingExpanded ? (
                <View style={styles.courierDetail}>
                  <View style={styles.courierDetailRow}>
                    <Text style={styles.courierDetailLabel}>
                      Carrier phone
                    </Text>
                    <Text style={styles.courierDetailValue}>
                      {COURIER.carrierPhone}
                    </Text>
                  </View>
                  <View style={styles.courierDetailRow}>
                    <Text style={styles.courierDetailLabel}>
                      {COURIER.lastScanLabel}
                    </Text>
                    <Text style={styles.courierDetailValue}>
                      {COURIER.lastScanLocation}
                    </Text>
                  </View>
                </View>
              ) : null}
            </Pressable>

            {nextStep ? (
              <View style={styles.nextBanner}>
                <Text style={styles.nextBannerTitle}>
                  Next: {nextStep.label}
                </Text>
                <Text style={styles.nextBannerText}>
                  Estimated {nextStep.dateLabel}.
                </Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle} accessibilityRole="header">
              Timeline
            </Text>
            <Text style={styles.sectionHint}>Tap a step for more detail.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Estimated delivery window at purchase: {ORDER.estimatedWindowLabel}.
            </Text>
          </View>
        }
      />

      {atFinalStep ? (
        <View style={styles.band}>
          {confirmed ? (
            <View style={styles.confirmedRow}>
              <Text style={styles.confirmedTitle}>Receipt confirmed</Text>
              <Text style={styles.confirmedText}>
                Confirmed {CONFIRMED_AT_LABEL}. Funds released to{" "}
                {ORDER.sellerName}.
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => setConfirmed(true)}
              accessibilityRole="button"
              accessibilityLabel="Confirm receipt"
              accessibilityHint="Confirms the item arrived as described and releases payment to the seller"
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaTitle}>Confirm receipt</Text>
              <Text style={styles.ctaDetail}>
                Item arrived as described — release payment to{" "}
                {ORDER.sellerName}.
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  header: {
    paddingTop: tokens.space(4),
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  itemCard: {
    marginTop: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemSpec: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  priceRow: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "baseline",
    gap: tokens.space(2),
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  priceWonSign: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  priceNote: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  courierCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    minHeight: 44,
  },
  courierCardPressed: {
    borderColor: tokens.color.accent,
  },
  courierTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  courierTextCol: {
    gap: 2,
  },
  courierLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  courierTracking: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  courierChevron: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  courierDetail: {
    marginTop: tokens.space(3),
    paddingTop: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    gap: tokens.space(2),
  },
  courierDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  courierDetailLabel: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  courierDetailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    color: tokens.color.ink2,
  },
  nextBanner: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 2,
  },
  nextBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  nextBannerText: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  sectionTitle: {
    marginTop: tokens.space(7),
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  stepRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  stepRowPressed: {
    opacity: 0.85,
  },
  rail: {
    width: 24,
    alignItems: "center",
  },
  railLine: {
    width: 2,
    flexGrow: 1,
    flexShrink: 0,
    minHeight: tokens.space(2),
    backgroundColor: tokens.color.border,
  },
  railLineHidden: {
    backgroundColor: tokens.color.bg,
  },
  railLineActive: {
    backgroundColor: tokens.color.accent,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  dotCurrent: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
    borderWidth: 3,
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.onAccent,
  },
  stepBody: {
    flex: 1,
    paddingBottom: tokens.space(5),
    gap: 3,
  },
  stepHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  stepLabelCurrent: {
    color: tokens.color.ink,
  },
  stepLabelUpcoming: {
    color: tokens.color.faint,
  },
  currentTag: {
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  currentTagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: tokens.color.onAccent,
  },
  stepDate: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  stepSummary: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  stepDetail: {
    marginTop: tokens.space(2),
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.accent,
    paddingLeft: tokens.space(3),
  },
  stepDetailText: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
  },
  stepToggleHint: {
    marginTop: tokens.space(2),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  footer: {
    marginTop: tokens.space(1),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(4),
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  cta: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 3,
    backgroundColor: tokens.color.accent,
  },
  ctaPressed: {
    opacity: 0.78,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  ctaDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.onAccent,
  },
  confirmedRow: {
    minHeight: 56,
    justifyContent: "center",
    gap: 3,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  confirmedText: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
});
