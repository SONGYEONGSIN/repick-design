// native/src/evolve/r35/b/LocalPickupZonesScreen.tsx
//
// Seller-facing screen for managing named local-pickup zones. Single-scroll
// FlatList, no fixed bottom band — there is no blocked-workflow state here
// that would need narrating in a persistent band, so one belongs nowhere on
// this screen. Each row owns its own enable/disable control and its own
// remove action; removing a zone never opens a native Alert — pressing
// "Remove" converts that one row in place into an inline Cancel / Confirm
// pair, and the text that appears there is itself what gets announced.
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import { initialPickupZones, PickupZone } from "./data";

const LIVE_MESSAGE_LIFETIME_MS = 2600;

export function LocalPickupZonesScreen() {
  const [zones, setZones] = useState<PickupZone[]>(initialPickupZones);
  const [rowAwaitingConfirm, setRowAwaitingConfirm] = useState<string | null>(
    null,
  );
  const [announcement, setAnnouncement] = useState("");
  const clearAnnouncementTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Open refinement: a conditional accessibilityRole="alert" must have its
  // triggering message actively cleared afterward, or the alert role stays
  // stuck "on" past the one event it was meant to announce.
  const announce = useCallback((message: string) => {
    if (clearAnnouncementTimer.current) {
      clearTimeout(clearAnnouncementTimer.current);
    }
    setAnnouncement(message);
    clearAnnouncementTimer.current = setTimeout(() => {
      setAnnouncement("");
    }, LIVE_MESSAGE_LIFETIME_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (clearAnnouncementTimer.current) {
        clearTimeout(clearAnnouncementTimer.current);
      }
    };
  }, []);

  const handleToggleZone = useCallback(
    (zone: PickupZone) => {
      const nextEnabled = !zone.enabled;
      setZones((current) =>
        current.map((z) =>
          z.id === zone.id ? { ...z, enabled: nextEnabled } : z,
        ),
      );
      announce(
        `${zone.label} is now ${nextEnabled ? "offered" : "paused"} as a pickup zone.`,
      );
    },
    [announce],
  );

  const handleRequestRemove = useCallback(
    (zone: PickupZone) => {
      setRowAwaitingConfirm(zone.id);
      announce(`Remove ${zone.label}? Confirm to remove it, or cancel to keep it.`);
    },
    [announce],
  );

  const handleCancelRemove = useCallback(
    (zone: PickupZone) => {
      setRowAwaitingConfirm(null);
      announce(`Kept ${zone.label} in your pickup zones.`);
    },
    [announce],
  );

  const handleConfirmRemove = useCallback(
    (zone: PickupZone) => {
      setZones((current) => current.filter((z) => z.id !== zone.id));
      setRowAwaitingConfirm(null);
      announce(`${zone.label} was removed from your pickup zones.`);
    },
    [announce],
  );

  // Derived every render from the live array — never hand-tracked.
  const activeCount = zones.filter((z) => z.enabled).length;

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={zones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.introBlock}>
            <Text accessibilityRole="header" style={styles.screenTitle}>
              Manage Pickup Zones
            </Text>
            <Text style={styles.screenSubtitle}>
              Buyers can pick any active zone below to arrange an in-person
              handoff with you.
            </Text>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillText}>
                {activeCount} of {zones.length} zones active
              </Text>
            </View>
            <View
              style={styles.liveRegion}
              accessibilityLiveRegion="polite"
            >
              <Text
                style={styles.liveRegionText}
                accessibilityRole={announcement ? "alert" : undefined}
              >
                {announcement}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No pickup zones yet</Text>
            <Text style={styles.emptyBody}>
              Add at least one zone so buyers know where they can meet you in
              person.
            </Text>
            <Pressable
              style={styles.emptyAction}
              accessibilityRole="button"
              accessibilityLabel="Add a pickup zone"
            >
              <Text style={styles.emptyActionText}>Add a pickup zone</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ZoneRow
            zone={item}
            isConfirmingRemove={rowAwaitingConfirm === item.id}
            onToggle={() => handleToggleZone(item)}
            onRequestRemove={() => handleRequestRemove(item)}
            onCancelRemove={() => handleCancelRemove(item)}
            onConfirmRemove={() => handleConfirmRemove(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

type ZoneRowProps = {
  zone: PickupZone;
  isConfirmingRemove: boolean;
  onToggle: () => void;
  onRequestRemove: () => void;
  onCancelRemove: () => void;
  onConfirmRemove: () => void;
};

function ZoneRow({
  zone,
  isConfirmingRemove,
  onToggle,
  onRequestRemove,
  onCancelRemove,
  onConfirmRemove,
}: ZoneRowProps) {
  if (isConfirmingRemove) {
    return (
      <View style={styles.zoneCard}>
        <Text style={styles.confirmPrompt}>
          Remove {zone.label} from your pickup zones?
        </Text>
        <View style={styles.confirmActionsRow}>
          <Pressable
            style={styles.confirmCancelButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Keeps this pickup zone unchanged"
            onPress={onCancelRemove}
            hitSlop={8}
          >
            <Text style={styles.confirmCancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={styles.confirmRemoveButton}
            accessibilityRole="button"
            accessibilityLabel="Confirm remove"
            accessibilityHint="Permanently removes this pickup zone from the list"
            onPress={onConfirmRemove}
            hitSlop={8}
          >
            <Text style={styles.confirmRemoveButtonText}>Confirm remove</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.zoneCard}>
      <View style={styles.zoneTopRow}>
        <View style={styles.zoneNameBlock}>
          <Text style={styles.zoneLabel}>{zone.label}</Text>
          <View
            style={[
              styles.statusChip,
              zone.enabled ? styles.statusChipActive : styles.statusChipPaused,
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                zone.enabled
                  ? styles.statusChipTextActive
                  : styles.statusChipTextPaused,
              ]}
            >
              {zone.enabled ? "Active" : "Paused"}
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.toggleHitArea}
          accessibilityRole="switch"
          accessibilityLabel={`${zone.label} pickup availability`}
          accessibilityState={{ checked: zone.enabled }}
          onPress={onToggle}
          hitSlop={6}
        >
          <View
            style={[
              styles.toggleTrack,
              zone.enabled ? styles.toggleTrackOn : styles.toggleTrackOff,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                zone.enabled ? styles.toggleThumbOn : styles.toggleThumbOff,
              ]}
            />
          </View>
        </Pressable>
      </View>

      <Text style={[styles.zoneMeta, !zone.enabled && styles.zoneMetaPaused]}>
        {zone.areaNote}
      </Text>
      <Text style={[styles.zoneMeta, !zone.enabled && styles.zoneMetaPaused]}>
        {zone.scheduleNote}
      </Text>

      <Pressable
        style={styles.removeAction}
        accessibilityRole="button"
        accessibilityLabel="Remove zone"
        accessibilityHint="Replaces this row with a confirm step before removing it"
        onPress={onRequestRemove}
        hitSlop={8}
      >
        <Text style={styles.removeActionText}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  introBlock: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 30,
  },
  screenSubtitle: {
    marginTop: tokens.space(2),
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
  },
  summaryPill: {
    marginTop: tokens.space(3),
    alignSelf: "flex-start",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
  },
  summaryPillText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  liveRegion: {
    minHeight: tokens.space(6),
    marginTop: tokens.space(3),
    justifyContent: "center",
  },
  liveRegionText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  zoneCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  zoneTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  zoneNameBlock: {
    flex: 1,
    paddingRight: tokens.space(3),
  },
  zoneLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statusChip: {
    marginTop: tokens.space(1),
    alignSelf: "flex-start",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  statusChipActive: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  statusChipPaused: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  statusChipText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  statusChipTextActive: {
    color: tokens.color.success,
  },
  statusChipTextPaused: {
    color: tokens.color.faint,
  },
  toggleHitArea: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  toggleTrackOn: {
    backgroundColor: tokens.color.accent,
    alignItems: "flex-end",
  },
  toggleTrackOff: {
    backgroundColor: tokens.color.border,
    alignItems: "flex-start",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: tokens.color.onAccent,
  },
  toggleThumbOn: {},
  toggleThumbOff: {},
  zoneMeta: {
    marginTop: tokens.space(2),
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
  },
  zoneMetaPaused: {
    color: tokens.color.faint,
  },
  removeAction: {
    marginTop: tokens.space(3),
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    justifyContent: "center",
  },
  removeActionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  confirmPrompt: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  confirmActionsRow: {
    flexDirection: "row",
    marginTop: tokens.space(3),
    gap: tokens.space(3),
  },
  confirmCancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  confirmCancelButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  confirmRemoveButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  confirmRemoveButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  emptyWrap: {
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyBody: {
    marginTop: tokens.space(2),
    fontSize: 16,
    lineHeight: 24,
    color: tokens.color.muted,
    textAlign: "center",
  },
  emptyAction: {
    marginTop: tokens.space(4),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
});

export default LocalPickupZonesScreen;
