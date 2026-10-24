// native/src/evolve/r40/a/OfferStatusScreen.tsx
//
// Buyer-facing "Offer Status" screen: a single pending offer's detail view
// (not the messaging thread — no composer here). A hero stat card anchors
// the page with the offered-vs-asking amounts, a listing mini-preview and
// a status readout, followed by a FlatList of the buyer's past offers on
// OTHER listings. A persistent, always-visible bottom rail (not a blocked
// workflow, not a destructive confirm) shows the live countdown and a
// single "Extend 24 Hours" action usable exactly once, tracked with local
// state rather than by time.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  currentListing,
  currentOffer,
  offerHistory,
  OFFER_SUBMITTED_AT,
  INITIAL_OFFER_EXPIRES_AT,
  STATUS_SNAPSHOT_AT,
  EXTENSION_DURATION_MS,
  formatShortDate,
  formatCurrency,
  computeRemainingWindow,
  type OfferHistoryRecord,
  type OfferHistoryStatus,
} from "./data";

const EXTENSION_ALERT_VISIBLE_MS = 4000;

function historyStatusCopy(status: OfferHistoryStatus): string {
  if (status === "accepted") return "Accepted";
  if (status === "declined") return "Declined";
  return "Expired";
}

function historyChipStyle(status: OfferHistoryStatus) {
  if (status === "accepted") return styles.historyChipAccepted;
  if (status === "declined") return styles.historyChipDeclined;
  return styles.historyChipExpired;
}

function historyChipTextStyle(status: OfferHistoryStatus) {
  if (status === "accepted") return styles.historyChipTextAccepted;
  if (status === "declined") return styles.historyChipTextDeclined;
  return styles.historyChipTextExpired;
}

function HistoryRow({ record }: { record: OfferHistoryRecord }) {
  return (
    <View style={styles.historyRow}>
      <View style={styles.historyRowTopLine}>
        <Text style={styles.historyListingName}>{record.listingTitle}</Text>
        <View style={historyChipStyle(record.status)}>
          <Text style={historyChipTextStyle(record.status)}>
            {historyStatusCopy(record.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.historyAmountLine}>
        {formatCurrency(record.amountOffered)} offered on a{" "}
        {formatCurrency(record.askingPrice)} listing · {record.conditionTag}
      </Text>
      <Text style={styles.historyResolvedLine}>
        Resolved {record.resolvedOnLabel}
      </Text>
    </View>
  );
}

export function OfferStatusScreen() {
  const [expiresAt, setExpiresAt] = useState<Date>(INITIAL_OFFER_EXPIRES_AT);
  const [extensionUsed, setExtensionUsed] = useState(false);
  const [railAlert, setRailAlert] = useState("");
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const remaining = useMemo(
    () => computeRemainingWindow(STATUS_SNAPSHOT_AT, expiresAt),
    [expiresAt]
  );

  const handleExtend = useCallback(() => {
    if (extensionUsed) return;
    const extended = new Date(expiresAt.getTime() + EXTENSION_DURATION_MS);
    setExpiresAt(extended);
    setExtensionUsed(true);

    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setRailAlert(
      `Extended 24 hours — now expires ${formatShortDate(extended)}.`
    );
    alertTimerRef.current = setTimeout(() => {
      setRailAlert("");
      alertTimerRef.current = null;
    }, EXTENSION_ALERT_VISIBLE_MS);
  }, [expiresAt, extensionUsed]);

  const headerBlock = (
    <View style={styles.heroStage}>
      <Text accessibilityRole="header" style={styles.screenHeading}>
        Offer Status
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroPriceLine}>
          <Text style={styles.heroOfferAmount}>
            {formatCurrency(currentOffer.offeredAmount)}
          </Text>
          <Text style={styles.heroPriceConnector}> offered on a </Text>
          <Text style={styles.heroAskingAmount}>
            {formatCurrency(currentOffer.askingAmount)}
          </Text>
          <Text style={styles.heroPriceConnector}> listing</Text>
        </Text>

        <View style={styles.listingPreviewRow}>
          <View style={styles.listingPreviewThumb} />
          <View style={styles.listingPreviewTextWrap}>
            <Text style={styles.listingPreviewName} numberOfLines={1}>
              {currentListing.title}
            </Text>
            <View style={styles.listingPreviewTagRow}>
              <View style={styles.listingPreviewTag}>
                <Text style={styles.listingPreviewTagText}>
                  {currentListing.conditionTag}
                </Text>
              </View>
              <Text style={styles.listingPreviewCategory}>
                {currentListing.categoryLabel}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{currentOffer.statusLabel}</Text>
        </View>

        <View style={styles.windowRow}>
          <View style={styles.windowDateBlock}>
            <Text style={styles.windowDateLabel}>Offered</Text>
            <Text style={styles.windowDateValue}>
              {formatShortDate(OFFER_SUBMITTED_AT)}
            </Text>
          </View>
          <View style={styles.windowDivider} />
          <View style={styles.windowDateBlock}>
            <Text style={styles.windowDateLabel}>Expires</Text>
            <Text style={styles.windowDateValue}>
              {formatShortDate(expiresAt)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.historySectionHeading}>Your Other Offers</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenRoot}>
        <FlatList
          data={offerHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryRow record={item} />}
          ListHeaderComponent={headerBlock}
          ListFooterComponent={<View style={styles.listFooterSpacer} />}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.bottomRail} accessibilityLiveRegion="polite">
          <View style={styles.bottomRailTopRow}>
            <View style={styles.bottomRailCountdownBlock}>
              <Text style={styles.bottomRailCountdownLabel}>
                Time remaining
              </Text>
              {railAlert ? (
                <Text
                  accessibilityRole="alert"
                  style={styles.bottomRailAlertText}
                >
                  {railAlert}
                </Text>
              ) : (
                <Text style={styles.bottomRailCountdownValue}>
                  {remaining.label}
                </Text>
              )}
            </View>

            {extensionUsed ? (
              <Pressable
                disabled
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                accessibilityLabel="Extend 24 hours, already used"
                style={[
                  styles.bottomRailExtendButton,
                  styles.bottomRailExtendButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.bottomRailExtendButtonText,
                    styles.bottomRailExtendButtonTextDisabled,
                  ]}
                >
                  Extend 24 Hours
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleExtend}
                accessibilityRole="button"
                accessibilityLabel="Extend offer expiry by 24 hours"
                accessibilityHint="Adds 24 hours to this offer's expiry window. This can be used once."
                style={({ pressed }) => [
                  styles.bottomRailExtendButton,
                  pressed && styles.bottomRailExtendButtonPressed,
                ]}
              >
                <Text style={styles.bottomRailExtendButtonText}>
                  Extend 24 Hours
                </Text>
              </Pressable>
            )}
          </View>

          {extensionUsed ? (
            <Text style={styles.bottomRailUsedHint}>
              Already extended once for this offer.
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const S = tokens.space;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: S(4),
  },
  heroStage: {
    paddingTop: S(3),
    paddingBottom: S(2),
  },
  screenHeading: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: S(4),
  },
  heroCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    padding: S(5),
    marginBottom: S(6),
  },
  heroPriceLine: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: S(4),
  },
  heroOfferAmount: {
    fontWeight: "800",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  heroAskingAmount: {
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroPriceConnector: {
    fontWeight: "400",
    color: tokens.color.ink2,
  },
  listingPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: S(4),
  },
  listingPreviewThumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch1,
  },
  listingPreviewTextWrap: {
    flex: 1,
    marginLeft: S(3),
  },
  listingPreviewName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  listingPreviewTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: S(1),
    gap: S(2),
  },
  listingPreviewTag: {
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: S(2),
    paddingVertical: 2,
  },
  listingPreviewTagText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  listingPreviewCategory: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    paddingHorizontal: S(3),
    paddingVertical: S(1),
    marginBottom: S(4),
  },
  statusPillText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  windowRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: S(4),
  },
  windowDateBlock: {
    flex: 1,
  },
  windowDateLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  windowDateValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  windowDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: tokens.color.border,
    marginHorizontal: S(4),
  },
  historySectionHeading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: S(3),
  },
  historyRow: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: S(4),
    marginBottom: S(3),
  },
  historyRowTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: S(2),
    marginBottom: S(2),
  },
  historyListingName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  historyAmountLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginBottom: S(1),
    fontVariant: ["tabular-nums"],
  },
  historyResolvedLine: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  historyChipAccepted: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 2,
    paddingHorizontal: S(2),
  },
  historyChipTextAccepted: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.success,
  },
  historyChipDeclined: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 2,
    paddingHorizontal: S(2),
  },
  historyChipTextDeclined: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  historyChipExpired: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 2,
    paddingHorizontal: S(2),
  },
  historyChipTextExpired: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  listFooterSpacer: {
    height: S(6),
  },
  bottomRail: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: S(4),
    paddingTop: S(4),
    paddingBottom: S(5),
  },
  bottomRailTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: S(3),
  },
  bottomRailCountdownBlock: {
    flex: 1,
  },
  bottomRailCountdownLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  bottomRailCountdownValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  bottomRailAlertText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.success,
  },
  bottomRailExtendButton: {
    minHeight: 48,
    minWidth: 150,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: S(4),
  },
  bottomRailExtendButtonPressed: {
    opacity: 0.85,
  },
  bottomRailExtendButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  bottomRailExtendButtonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bottomRailExtendButtonTextDisabled: {
    color: tokens.color.faint,
  },
  bottomRailUsedHint: {
    marginTop: S(3),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
  },
});

export default OfferStatusScreen;
