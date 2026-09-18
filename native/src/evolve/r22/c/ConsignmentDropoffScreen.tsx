// native/src/evolve/r22/c/ConsignmentDropoffScreen.tsx
// Consignment Drop-off Scheduling (seller-facing).
//
// Flow: pick a partner store (sorted by distance, closed-today stores are
// visually distinct and unselectable) -> pick a time slot at that store
// (slots are DERIVED from the store's today open-hours window divided into
// fixed-length windows, minus a fixed booked list — see data.ts) -> confirm,
// which reveals a deterministic confirmation code. A bottom status band
// explains why confirmation is blocked and jumps to whichever step still
// needs attention; once both picks are made it becomes the real "Confirm
// drop-off" action.
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  BOOKED_SLOTS,
  DropoffLocation,
  LOCATIONS,
  SLOT_LENGTH_MINUTES,
  TODAY,
  TimeSlot,
  buildConfirmationCode,
  deriveSlots,
  formatWindow,
  isClosedToday,
} from "./data";
import { LocationRow } from "./LocationRow";
import { SlotCell } from "./SlotCell";
import { SchedulePhase, StatusBand } from "./StatusBand";

export default function ConsignmentDropoffScreen() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const listRef = useRef<FlatList<DropoffLocation>>(null);
  const locationsHeadingRef = useRef<View>(null);
  const slotsHeadingRef = useRef<View>(null);

  const selectedLocation = useMemo<DropoffLocation | null>(
    () => LOCATIONS.find((loc) => loc.id === selectedLocationId) ?? null,
    [selectedLocationId]
  );

  const slots = useMemo<TimeSlot[]>(
    () => (selectedLocation ? deriveSlots(selectedLocation, BOOKED_SLOTS) : []),
    [selectedLocation]
  );

  const selectedSlot = useMemo<TimeSlot | null>(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? null,
    [slots, selectedSlotId]
  );

  const phase: SchedulePhase = !selectedLocation
    ? "needsLocation"
    : !selectedSlot
    ? "needsSlot"
    : confirmationCode
    ? "confirmed"
    : "readyToConfirm";

  const handleSelectLocation = useCallback((id: string) => {
    setSelectedLocationId(id);
    setSelectedSlotId(null);
    setConfirmationCode(null);
  }, []);

  const handleSelectSlot = useCallback((id: string) => {
    setSelectedSlotId(id);
    setConfirmationCode(null);
  }, []);

  const focusSection = useCallback((ref: React.RefObject<View>) => {
    const node = findNodeHandle(ref.current);
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, []);

  const handleBandPress = useCallback(() => {
    if (phase === "needsLocation") {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      focusSection(locationsHeadingRef);
      return;
    }
    if (phase === "needsSlot") {
      listRef.current?.scrollToEnd({ animated: true });
      focusSection(slotsHeadingRef);
      return;
    }
    if (phase === "readyToConfirm" && selectedLocation && selectedSlot) {
      setConfirmationCode(buildConfirmationCode(selectedLocation, selectedSlot));
    }
  }, [phase, selectedLocation, selectedSlot, focusSection]);

  const renderLocation = useCallback<ListRenderItem<DropoffLocation>>(
    ({ item }) => {
      const closedToday = isClosedToday(item);
      const window = item.hoursByDay[TODAY];
      return (
        <LocationRow
          location={item}
          distanceLabel={`${item.distanceMiles.toFixed(1)} mi`}
          closedToday={closedToday}
          hoursLabel={window ? formatWindow(window) : null}
          selected={item.id === selectedLocationId}
          onSelect={handleSelectLocation}
        />
      );
    },
    [selectedLocationId, handleSelectLocation]
  );

  const listHeader = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>
        Schedule a Consignment Drop-off
      </Text>
      <Text style={styles.intro}>
        Bring your item to a partner store instead of shipping it. Pick a store, then a time —
        both are computed from what is actually open and available today ({TODAY}).
      </Text>
      <View ref={locationsHeadingRef} accessible={false}>
        <Text accessibilityRole="header" style={styles.sectionHeading}>
          1. Choose a partner store
        </Text>
        <Text style={styles.sectionHint}>
          Sorted nearest first. Stores closed today are marked and can&apos;t be picked.
        </Text>
      </View>
    </View>
  );

  const listFooter = (
    <View style={styles.footer}>
      <View ref={slotsHeadingRef} accessible={false}>
        <Text accessibilityRole="header" style={styles.sectionHeading}>
          2. Choose a time
        </Text>
        {selectedLocation ? (
          <Text style={styles.sectionHint}>
            {selectedLocation.name}&apos;s today hours split into {SLOT_LENGTH_MINUTES}-minute
            windows. Full windows are already booked.
          </Text>
        ) : (
          <Text style={styles.sectionHint}>
            Pick a store above first — its open hours will divide into {SLOT_LENGTH_MINUTES}
            -minute windows here.
          </Text>
        )}
      </View>
      {selectedLocation && (
        <View style={styles.slotGrid}>
          {slots.map((slot) => (
            <SlotCell
              key={slot.id}
              slot={slot}
              selected={slot.id === selectedSlotId}
              onSelect={handleSelectSlot}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={listRef}
        style={styles.list}
        data={LOCATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderLocation}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
      />
      <StatusBand
        phase={phase}
        locationName={selectedLocation?.name ?? null}
        slotLabel={selectedSlot?.label ?? null}
        confirmationCode={confirmationCode}
        onPress={handleBandPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  intro: {
    marginTop: tokens.space(2),
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  sectionHeading: {
    marginTop: tokens.space(5),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  slotGrid: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
