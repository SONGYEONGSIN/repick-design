// native/src/evolve/r15/c/SafeExchangeLocationPickerScreen.tsx
// Safe-Exchange Location Picker — buyer/seller choose WHERE (not when) to meet in person.
import React, { useMemo, useState } from "react";
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
  COUNTERPART_NAME,
  ITEM_LABEL,
  EXCHANGE_LOCATIONS,
  PROXIMITY_RAIL_MAX_MILES,
  type ExchangeLocation,
} from "./data";

export function SafeExchangeLocationPickerScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selected: ExchangeLocation | null = useMemo(
    () => EXCHANGE_LOCATIONS.find((loc) => loc.id === selectedId) ?? null,
    [selectedId]
  );

  const canConfirm = selected !== null && !confirmed;

  function handleSelect(location: ExchangeLocation) {
    setSelectedId(location.id);
    // Picking a new spot after confirming un-confirms it — the confirmation
    // is a claim about a specific location, so it must not survive a change.
    setConfirmed(false);
  }

  function handleConfirm() {
    if (!canConfirm) return;
    setConfirmed(true);
  }

  const instructionText = confirmed
    ? `Confirmed — meet ${COUNTERPART_NAME} at ${selected!.name}.`
    : selected
    ? `Meet ${COUNTERPART_NAME} at ${selected.name} — about ${selected.travelMinutes} min away.`
    : "Choose a location below to set your meeting spot.";

  const buttonLabel = confirmed ? "✓ Confirmed" : "Confirm meeting spot";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Choose a Safe Exchange Location
        </Text>
        <Text style={styles.subtitle}>
          Public, monitored spots nearby for handing off {ITEM_LABEL}.
        </Text>
      </View>

      <FlatList
        data={EXCHANGE_LOCATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.railLegend}>
            <Text style={styles.railLegendText}>Closer</Text>
            <Text style={styles.railLegendText}>Farther</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          const railWidthPct = Math.min(
            100,
            (item.distanceMiles / PROXIMITY_RAIL_MAX_MILES) * 100
          );
          return (
            <Pressable
              onPress={() => handleSelect(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.name}. ${item.category}. ${item.detail}. ${item.distanceMiles} miles, about ${item.travelMinutes} minutes away.${
                isSelected ? " Currently selected." : ""
              }`}
              accessibilityHint="Selects this location as your meeting spot."
              hitSlop={4}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardName}>{item.name}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    isSelected ? styles.badgeSelected : styles.badgeIdle,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isSelected ? styles.badgeTextSelected : styles.badgeTextIdle,
                    ]}
                  >
                    {isSelected ? "✓ Selected" : "Select"}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardDetail}>{item.detail}</Text>

              <View style={styles.railRow}>
                <View style={styles.rail}>
                  <View style={[styles.railFill, { width: `${railWidthPct}%` }]} />
                </View>
                <Text style={styles.railFigure}>
                  {item.distanceMiles} mi · {item.travelMinutes} min
                </Text>
              </View>
            </Pressable>
          );
        }}
      />

      <View style={styles.bottomBand}>
        <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
          <Text accessibilityRole="alert" style={styles.bandInstruction}>
            {instructionText}
          </Text>
        </View>
        <Pressable
          onPress={handleConfirm}
          disabled={!canConfirm}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canConfirm }}
          accessibilityLabel={buttonLabel}
          accessibilityHint={
            canConfirm
              ? "Finalizes this location as your meeting spot and marks it confirmed."
              : undefined
          }
          hitSlop={4}
          style={({ pressed }) => [
            styles.confirmButton,
            !canConfirm && styles.confirmButtonDisabled,
            pressed && canConfirm && styles.confirmButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !canConfirm && styles.confirmButtonTextDisabled,
            ]}
          >
            {buttonLabel}
          </Text>
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
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  railLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: tokens.space(1),
  },
  railLegendText: {
    fontSize: 11,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    gap: tokens.space(2),
    minHeight: 44,
  },
  cardSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  cardCategory: {
    fontSize: 12,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  cardDetail: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  badge: {
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    borderWidth: 1,
    minHeight: 28,
    justifyContent: "center",
  },
  badgeIdle: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  badgeSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextIdle: {
    color: tokens.color.ink2,
  },
  badgeTextSelected: {
    color: tokens.color.onAccent,
  },
  railRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  rail: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  railFill: {
    height: "100%",
    backgroundColor: tokens.color.accent,
    borderRadius: 3,
  },
  railFigure: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  bottomBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  liveRegion: {
    minHeight: 20,
  },
  bandInstruction: {
    fontSize: 14,
    fontWeight: "500",
    color: tokens.color.ink2,
  },
  confirmButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  confirmButtonPressed: {
    opacity: 0.88,
  },
  confirmButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  confirmButtonTextDisabled: {
    color: tokens.color.muted,
  },
});
