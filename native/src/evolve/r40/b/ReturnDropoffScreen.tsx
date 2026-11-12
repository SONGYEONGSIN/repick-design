// native/src/evolve/r40/b/ReturnDropoffScreen.tsx
//
// Return Drop-off Points — a pure browse/info screen for a buyer who chose
// "drop off in person" after their return was approved. Nothing here blocks
// progress and nothing is destructive, so per the band doctrine this screen
// carries NO fixed bottom band at all.
//
// A "List"/"Map" segmented control switches between two views that read from
// the exact same fixed DROPOFF_SITES array and the exact same
// `selectedSiteId` state, so picking a site in one view and switching to the
// other keeps it selected/expanded. List is a genuine scrollable FlatList of
// rows that accordion open in place; Map is a free-form bordered canvas with
// absolutely-positioned pins — the two are deliberately different shapes.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, FlatList, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  DROPOFF_SITES,
  findDropoffSite,
  formatDistanceLabel,
  DROPOFF_REFERENCE_MINUTE,
  isSiteOpenAt,
  type DropoffSite,
} from "./data";
import { SiteDetailPanel } from "./SiteDetailPanel";
import { CanvasPin } from "./CanvasPin";

const DIRECTIONS_CONFIRMATION_DURATION_MS = 2500;

type DropoffViewMode = "list" | "map";

export function ReturnDropoffScreen() {
  const [viewMode, setViewMode] = useState<DropoffViewMode>("list");
  // Single shared selection — read by BOTH the list accordion and the map
  // panel, so switching view modes never loses or duplicates the choice.
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [directionsConfirmedForId, setDirectionsConfirmedForId] = useState<string | null>(null);
  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    };
  }, []);

  const clearDirectionsConfirmation = useCallback(() => {
    if (confirmationTimer.current) {
      clearTimeout(confirmationTimer.current);
      confirmationTimer.current = null;
    }
    setDirectionsConfirmedForId(null);
  }, []);

  const toggleSiteSelection = useCallback(
    (id: string) => {
      clearDirectionsConfirmation();
      setSelectedSiteId((current) => (current === id ? null : id));
    },
    [clearDirectionsConfirmation]
  );

  const handleGetDirections = useCallback((id: string) => {
    if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    setDirectionsConfirmedForId(id);
    confirmationTimer.current = setTimeout(() => setDirectionsConfirmedForId(null), DIRECTIONS_CONFIRMATION_DURATION_MS);
  }, []);

  const selectedSite = findDropoffSite(selectedSiteId);

  const renderSiteRow = useCallback(
    ({ item }: { item: DropoffSite }) => {
      const isExpanded = selectedSiteId === item.id;
      const openNow = isSiteOpenAt(item, DROPOFF_REFERENCE_MINUTE);
      return (
        <View style={styles.rowCard}>
          <Pressable
            onPress={() => toggleSiteSelection(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.kind}, ${formatDistanceLabel(item.distanceMiles)}, ${
              openNow ? "open now" : "closed now"
            }`}
            accessibilityState={{ expanded: isExpanded }}
            style={({ pressed }) => [styles.rowHeader, pressed && styles.rowHeaderPressed]}
          >
            <View style={styles.rowMain}>
              <Text style={styles.rowName}>{item.name}</Text>
              <View style={styles.rowMetaLine}>
                <View style={styles.kindTag}>
                  <Text style={styles.kindTagText}>{item.kind}</Text>
                </View>
                <Text style={styles.rowDistance}>{formatDistanceLabel(item.distanceMiles)}</Text>
              </View>
            </View>
            <Text style={[styles.rowStatus, openNow ? styles.rowStatusOpen : styles.rowStatusClosed]}>
              {openNow ? "Open now" : "Closed now"}
            </Text>
          </Pressable>

          {isExpanded ? (
            <SiteDetailPanel
              site={item}
              isDirectionsConfirmationVisible={directionsConfirmedForId === item.id}
              onPressGetDirections={() => handleGetDirections(item.id)}
            />
          ) : null}
        </View>
      );
    },
    [selectedSiteId, directionsConfirmedForId, toggleSiteSelection, handleGetDirections]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerSection}>
        <Text accessibilityRole="header" style={styles.title}>
          Return Drop-off Points
        </Text>
        <Text style={styles.subtitle}>
          Hand off your approved return at any of these nearby locations — no shipping label needed.
        </Text>

        <View style={styles.modeSwitchTrack}>
          <Pressable
            onPress={() => setViewMode("list")}
            accessibilityRole="button"
            accessibilityLabel="List view"
            accessibilityState={{ selected: viewMode === "list" }}
            style={[styles.modeSwitchOption, viewMode === "list" && styles.modeSwitchOptionActive]}
          >
            <Text style={[styles.modeSwitchLabel, viewMode === "list" && styles.modeSwitchLabelActive]}>
              List
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode("map")}
            accessibilityRole="button"
            accessibilityLabel="Map view"
            accessibilityState={{ selected: viewMode === "map" }}
            style={[styles.modeSwitchOption, viewMode === "map" && styles.modeSwitchOptionActive]}
          >
            <Text style={[styles.modeSwitchLabel, viewMode === "map" && styles.modeSwitchLabelActive]}>
              Map
            </Text>
          </Pressable>
        </View>
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={DROPOFF_SITES}
          keyExtractor={(item) => item.id}
          renderItem={renderSiteRow}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <ScrollView style={styles.mapScroll} contentContainerStyle={styles.mapScrollContent}>
          <View style={styles.canvas}>
            <View style={[styles.canvasGridLine, styles.canvasGridLineH, { top: "33%" }]} />
            <View style={[styles.canvasGridLine, styles.canvasGridLineH, { top: "66%" }]} />
            <View style={[styles.canvasGridLine, styles.canvasGridLineV, { left: "33%" }]} />
            <View style={[styles.canvasGridLine, styles.canvasGridLineV, { left: "66%" }]} />
            {DROPOFF_SITES.map((site) => (
              <CanvasPin
                key={site.id}
                site={site}
                isSelected={selectedSiteId === site.id}
                onPress={() => toggleSiteSelection(site.id)}
              />
            ))}
          </View>
          <Text style={styles.canvasCaption}>
            Schematic layout, not to scale. Tap a pin to see its details below.
          </Text>

          {selectedSite ? (
            <View style={styles.mapDetailCard}>
              <View style={styles.mapDetailHeader}>
                <Text style={styles.mapDetailName}>{selectedSite.name}</Text>
                <View style={styles.kindTag}>
                  <Text style={styles.kindTagText}>{selectedSite.kind}</Text>
                </View>
              </View>
              <SiteDetailPanel
                site={selectedSite}
                isDirectionsConfirmationVisible={directionsConfirmedForId === selectedSite.id}
                onPressGetDirections={() => handleGetDirections(selectedSite.id)}
              />
            </View>
          ) : (
            <View style={styles.mapEmptyHint}>
              <Text style={styles.mapEmptyHintText}>
                Tap a pin above to see that location&apos;s address, hours, and directions.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ReturnDropoffScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerSection: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
    gap: tokens.space(1),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
    marginBottom: tokens.space(2),
  },
  modeSwitchTrack: {
    flexDirection: "row",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
    gap: tokens.space(1),
  },
  modeSwitchOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  modeSwitchOptionActive: {
    backgroundColor: tokens.color.accent,
  },
  modeSwitchLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  modeSwitchLabelActive: {
    color: tokens.color.onAccent,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  rowCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    padding: tokens.space(4),
  },
  rowHeaderPressed: {
    opacity: 0.75,
  },
  rowMain: {
    flex: 1,
    gap: tokens.space(1),
  },
  rowName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  rowMetaLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  kindTag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
  },
  kindTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  rowDistance: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  rowStatusOpen: {
    color: tokens.color.success,
  },
  rowStatusClosed: {
    color: tokens.color.faint,
  },
  mapScroll: {
    flex: 1,
  },
  mapScrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(1),
    paddingBottom: tokens.space(6),
    gap: tokens.space(2),
  },
  canvas: {
    height: 260,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    overflow: "hidden",
    position: "relative",
  },
  canvasGridLine: {
    position: "absolute",
    backgroundColor: tokens.color.border,
  },
  canvasGridLineH: {
    left: 0,
    right: 0,
    height: 1,
  },
  canvasGridLineV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  canvasCaption: {
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },
  mapDetailCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingTop: tokens.space(4),
  },
  mapDetailHeader: {
    paddingHorizontal: tokens.space(4),
    gap: tokens.space(1),
  },
  mapDetailName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  mapEmptyHint: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  mapEmptyHintText: {
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
  },
});
