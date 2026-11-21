// native/src/evolve/r40/b/SiteDetailPanel.tsx
//
// Shared expanded-detail content for a single drop-off site: full address,
// hours, derived open/closed status, and a "Get Directions" action. Rendered
// identically from the list accordion and from the map's selection panel —
// one component, one source of truth, so the two view-modes never drift.
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  DROPOFF_REFERENCE_MINUTE,
  type DropoffSite,
  formatHoursRange,
  formatNextChangeLabel,
  isSiteOpenAt,
} from "./data";

const DIRECTIONS_CONFIRMATION_TEXT = "Directions copied.";

type SiteDetailPanelProps = {
  site: DropoffSite;
  isDirectionsConfirmationVisible: boolean;
  onPressGetDirections: () => void;
};

export function SiteDetailPanel({
  site,
  isDirectionsConfirmationVisible,
  onPressGetDirections,
}: SiteDetailPanelProps) {
  const openNow = isSiteOpenAt(site, DROPOFF_REFERENCE_MINUTE);

  return (
    <View style={styles.wrap}>
      <Text style={styles.addressLine}>{site.streetLine}</Text>
      <Text style={styles.addressLine}>{site.cityLine}</Text>

      <View style={styles.hoursRow}>
        <View
          style={[
            styles.statusPill,
            openNow ? styles.statusPillOpen : styles.statusPillClosed,
          ]}
        >
          <Text style={[styles.statusPillText, openNow ? styles.statusPillTextOpen : styles.statusPillTextClosed]}>
            {openNow ? "Open now" : "Closed now"}
          </Text>
        </View>
        <Text style={styles.hoursText}>{formatHoursRange(site)}</Text>
      </View>
      <Text style={styles.nextChangeText}>{formatNextChangeLabel(site, DROPOFF_REFERENCE_MINUTE)}</Text>

      <Pressable
        onPress={onPressGetDirections}
        accessibilityRole="button"
        accessibilityLabel={`Get directions to ${site.name}`}
        accessibilityHint="Shows a confirmation that directions for this address were copied"
        style={({ pressed }) => [styles.directionsButton, pressed && styles.directionsButtonPressed]}
      >
        <Text style={styles.directionsButtonText}>Get Directions</Text>
      </Pressable>

      {/* Single live region for the whole screen: only one detail panel is
          ever mounted at a time (list accordion XOR map selection), so there
          is never more than one of these capable of announcing. */}
      <View accessibilityLiveRegion="polite" style={styles.confirmationSlot}>
        {isDirectionsConfirmationVisible ? (
          <Text accessibilityRole="alert" style={styles.confirmationText}>
            {DIRECTIONS_CONFIRMATION_TEXT}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default SiteDetailPanel;

const styles = StyleSheet.create({
  wrap: {
    gap: tokens.space(2),
    paddingTop: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  addressLine: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  statusPill: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusPillOpen: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusPillClosed: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillTextOpen: {
    color: tokens.color.success,
  },
  statusPillTextClosed: {
    color: tokens.color.faint,
  },
  hoursText: {
    fontSize: 13,
    color: tokens.color.ink2,
  },
  nextChangeText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  directionsButton: {
    minHeight: 44,
    marginTop: tokens.space(2),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    alignSelf: "flex-start",
  },
  directionsButtonPressed: {
    opacity: 0.8,
  },
  directionsButtonText: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmationSlot: {
    minHeight: 18,
  },
  confirmationText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.success,
  },
});
