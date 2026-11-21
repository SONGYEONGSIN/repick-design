// native/src/evolve/r48/b/ShipmentTrackingScreen.tsx
//
// Shipment Live Tracking — a read-only record of a shipment's transit
// progress. The timeline is the dominant structure; the one always-visible
// action ("Contact carrier about this shipment") genuinely flips state
// (supportRequestStatus) rather than just sitting there as a label.

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  shipmentTrackingRecord,
  findMilestoneStatus,
  type ShipmentMilestone,
  type MilestoneStatus,
} from "./data";

const CONFIRMATION_VISIBLE_MS = 2500;

type SupportRequestStatus = "idle" | "requested";

function markerStyleForStatus(status: MilestoneStatus) {
  if (status === "completed") return styles.markerDotCompleted;
  if (status === "current") return styles.markerDotCurrent;
  return styles.markerDotUpcoming;
}

function labelStyleForStatus(status: MilestoneStatus) {
  if (status === "upcoming") return styles.milestoneTitleUpcoming;
  return styles.milestoneTitle;
}

function describeStatusForScreenReader(status: MilestoneStatus): string {
  if (status === "current") return "current status";
  if (status === "completed") return "completed";
  return "upcoming";
}

export default function ShipmentTrackingScreen() {
  const record = shipmentTrackingRecord;
  const [supportRequestStatus, setSupportRequestStatus] =
    useState<SupportRequestStatus>("idle");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const autoClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoClearTimer.current) {
        clearTimeout(autoClearTimer.current);
      }
    };
  }, []);

  const handleContactCarrierPress = useCallback(() => {
    if (supportRequestStatus === "requested") return;

    setSupportRequestStatus("requested");
    setConfirmationMessage(
      "Request sent. QuickVan Logistics has been notified about this shipment.",
    );

    if (autoClearTimer.current) {
      clearTimeout(autoClearTimer.current);
    }
    autoClearTimer.current = setTimeout(() => {
      setConfirmationMessage("");
    }, CONFIRMATION_VISIBLE_MS);
  }, [supportRequestStatus]);

  const renderMilestoneRow = useCallback(
    ({ item, index }: { item: ShipmentMilestone; index: number }) => {
      const status = findMilestoneStatus(record, item.id);
      const isLastRow = index === record.milestones.length - 1;
      const a11yLabel = `${item.label}, ${describeStatusForScreenReader(status)}, ${item.timestamp}`;

      return (
        <View style={styles.milestoneRow} accessibilityLabel={a11yLabel}>
          <View style={styles.markerColumn}>
            <View style={[styles.markerDot, markerStyleForStatus(status)]} />
            {!isLastRow ? (
              <View
                style={[
                  styles.markerRail,
                  status === "completed"
                    ? styles.markerRailCompleted
                    : status === "current"
                      ? styles.markerRailCurrent
                      : styles.markerRailUpcoming,
                ]}
              />
            ) : null}
          </View>
          <View style={styles.milestoneContent}>
            <View style={styles.milestoneHeadingRow}>
              <Text style={labelStyleForStatus(status)}>{item.label}</Text>
              {status === "current" ? (
                <View style={styles.currentChip}>
                  <Text style={styles.currentChipText}>Current</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.milestoneTimestamp}>{item.timestamp}</Text>
            {item.note ? (
              <Text style={styles.milestoneNote}>{item.note}</Text>
            ) : null}
          </View>
        </View>
      );
    },
    [record],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.headerEyebrow} accessibilityRole="header">
          Shipment tracking
        </Text>
        <Text style={styles.headerOrderRef}>{record.orderRef}</Text>

        <View style={styles.etaBlock}>
          <Text style={styles.etaLabel}>Estimated delivery</Text>
          <Text style={styles.etaValue}>{record.estimatedWindowLabel}</Text>
        </View>

        <View style={styles.headerDivider} />

        <View style={styles.carrierRow}>
          <View style={styles.carrierField}>
            <Text style={styles.carrierFieldLabel}>Carrier</Text>
            <Text style={styles.carrierFieldValue}>{record.carrierName}</Text>
          </View>
          <View style={styles.carrierField}>
            <Text style={styles.carrierFieldLabel}>Tracking number</Text>
            <Text style={styles.carrierFieldValue}>{record.trackingNumber}</Text>
          </View>
        </View>

        <View style={styles.routeRow}>
          <Text style={styles.routeText}>{record.originLabel}</Text>
          <Text style={styles.routeArrow}>{"→"}</Text>
          <Text style={styles.routeText}>{record.destinationLabel}</Text>
        </View>
      </View>

      <FlatList
        data={record.milestones}
        keyExtractor={(item) => item.id}
        renderItem={renderMilestoneRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actionBar}>
        <View accessibilityLiveRegion="polite" style={styles.liveRegionHost}>
          {confirmationMessage ? (
            <Text accessibilityRole="alert" style={styles.confirmationText}>
              {confirmationMessage}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleContactCarrierPress}
          disabled={supportRequestStatus === "requested"}
          accessibilityRole="button"
          accessibilityLabel={
            supportRequestStatus === "requested"
              ? "Support request already sent for this shipment"
              : "Contact carrier about this shipment"
          }
          accessibilityState={{ disabled: supportRequestStatus === "requested" }}
          style={({ pressed }) => [
            styles.contactButton,
            supportRequestStatus === "requested" && styles.contactButtonSent,
            pressed && supportRequestStatus !== "requested" && styles.contactButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.contactButtonText,
              supportRequestStatus === "requested" && styles.contactButtonTextSent,
            ]}
          >
            {supportRequestStatus === "requested"
              ? "Request sent to carrier"
              : "Contact carrier about this shipment"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerCard: {
    marginHorizontal: tokens.space(4),
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: tokens.color.faint,
  },
  headerOrderRef: {
    marginTop: tokens.space(1),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  etaBlock: {
    marginTop: tokens.space(3),
    padding: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  etaLabel: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  etaValue: {
    marginTop: tokens.space(1) / 2,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  headerDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginVertical: tokens.space(3),
  },
  carrierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carrierField: {
    flexShrink: 1,
    paddingRight: tokens.space(2),
  },
  carrierFieldLabel: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  carrierFieldValue: {
    marginTop: tokens.space(1) / 2,
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  routeRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  routeArrow: {
    marginHorizontal: tokens.space(2),
    fontSize: 13,
    color: tokens.color.faint,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  milestoneRow: {
    flexDirection: "row",
  },
  markerColumn: {
    width: tokens.space(6),
    alignItems: "center",
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  markerDotCompleted: {
    backgroundColor: tokens.color.success,
    borderColor: tokens.color.success,
  },
  markerDotCurrent: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  markerDotUpcoming: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  markerRail: {
    flex: 1,
    width: 2,
    marginVertical: tokens.space(1),
  },
  markerRailCompleted: {
    backgroundColor: tokens.color.success,
  },
  markerRailCurrent: {
    backgroundColor: tokens.color.accent,
  },
  markerRailUpcoming: {
    backgroundColor: tokens.color.border,
  },
  milestoneContent: {
    flex: 1,
    paddingBottom: tokens.space(5),
  },
  milestoneHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  milestoneTitleUpcoming: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  currentChip: {
    marginLeft: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
  },
  currentChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  milestoneTimestamp: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
  },
  milestoneNote: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.faint,
  },
  actionBar: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  liveRegionHost: {
    minHeight: tokens.space(5),
    justifyContent: "center",
  },
  confirmationText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.success,
  },
  contactButton: {
    height: tokens.space(12),
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
  },
  contactButtonPressed: {
    opacity: 0.85,
  },
  contactButtonSent: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  contactButtonTextSent: {
    color: tokens.color.success,
  },
});
