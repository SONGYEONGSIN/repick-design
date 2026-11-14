// native/src/evolve/r56/a/LocalMeetupScheduleScreen.tsx
//
// Local Meetup Schedule: a buyer and seller pick a day + time slot from a
// 2D grid and a hand-off spot from a short fixed list, then confirm. The
// bottom band is gated by two independent conditions — a slot chosen AND a
// spot chosen — and names in its own text exactly which one(s) are still
// missing. Tapping the band while blocked scrolls to, and moves
// accessibility focus onto, whichever specific control is the cause (see
// getMissingPick's priority comment for the tie-break when both are
// missing). Once both are satisfied the band becomes the real Confirm
// action, which transitions the screen into a finalized state.
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  DAYS,
  TIME_SLOTS,
  MEETUP_SPOTS,
  BUSY_CELL_IDS,
  buildCellId,
  parseCellId,
  findSpot,
} from "./data";

/** What's still missing before the hand-off can be confirmed. */
type MissingPick = "slot" | "spot" | "both" | null;

/**
 * Recomputed fresh every render from current state — never cached — so
 * un-picking a slot after having picked one immediately re-blocks the band.
 */
function getMissingPick(slotId: string | null, spotId: string | null): MissingPick {
  if (!slotId && !spotId) return "both";
  if (!slotId) return "slot";
  if (!spotId) return "spot";
  return null;
}

function missingPickMessage(missing: MissingPick): string {
  switch (missing) {
    case "both":
      return "Pick a day and time, then choose a meetup spot, before this hand-off can be confirmed.";
    case "slot":
      return "Pick a day and time before this hand-off can be confirmed.";
    case "spot":
      return "Choose a meetup spot before this hand-off can be confirmed.";
    default:
      return "";
  }
}

// Tie-break priority when both are missing: the day/time grid is the first
// decision in the flow and the spot list sits below it, so a tap always
// resolves to the grid first. This is the one deterministic priority order
// required when more than one condition is unmet.
function jumpTargetFor(missing: MissingPick): "grid" | "spots" | null {
  if (missing === "slot" || missing === "both") return "grid";
  if (missing === "spot") return "spots";
  return null;
}

function jumpButtonLabel(missing: MissingPick): string {
  return jumpTargetFor(missing) === "spots"
    ? "Go to meetup spot list"
    : "Go to day and time grid";
}

function focusOn(ref: { current: View | null }) {
  const tag = findNodeHandle(ref.current);
  if (tag != null) {
    AccessibilityInfo.setAccessibilityFocus(tag);
  }
}

function finalizedSummary(slotId: string, spotId: string): string {
  const cell = parseCellId(slotId);
  const spot = findSpot(spotId);
  if (!cell || !spot) return "Meetup confirmed.";
  return `Meetup confirmed: ${cell.day.label} ${cell.day.dateLabel}, ${cell.time.label} (${cell.time.rangeLabel}) at ${spot.name}.`;
}

export default function LocalMeetupScheduleScreen() {
  const [pickedSlotId, setPickedSlotId] = useState<string | null>(null);
  const [pickedSpotId, setPickedSpotId] = useState<string | null>(null);
  const [handoffFinalized, setHandoffFinalized] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const gridRegionRef = useRef<View>(null);
  const spotRegionRef = useRef<View>(null);
  const gridHeadingRef = useRef<View>(null);
  const spotHeadingRef = useRef<View>(null);

  // Measured section offsets inside the ScrollView's content, captured on
  // layout and read via ref (not state) so measuring never re-triggers a render.
  const regionOffsets = useRef({ grid: 0, spots: 0 });

  const missing = getMissingPick(pickedSlotId, pickedSpotId);
  const locked = !!(handoffFinalized && pickedSlotId && pickedSpotId);

  function toggleCell(cellId: string) {
    if (handoffFinalized) return;
    setPickedSlotId((prev) => (prev === cellId ? null : cellId));
  }

  function toggleSpot(spotId: string) {
    if (handoffFinalized) return;
    setPickedSpotId((prev) => (prev === spotId ? null : spotId));
  }

  function jumpToMissingControl() {
    const target = jumpTargetFor(missing);
    if (target === "grid") {
      scrollRef.current?.scrollTo({ y: regionOffsets.current.grid, animated: true });
      setTimeout(() => focusOn(gridHeadingRef), 350);
    } else if (target === "spots") {
      scrollRef.current?.scrollTo({ y: regionOffsets.current.spots, animated: true });
      setTimeout(() => focusOn(spotHeadingRef), 350);
    }
  }

  function finalizeHandoff() {
    setHandoffFinalized(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text accessibilityRole="header" style={styles.heading}>
          Schedule a Meetup
        </Text>
        <Text style={styles.subheading}>
          Pick a day, a time, and a public spot to hand off this item in person.
        </Text>

        <View
          ref={gridRegionRef}
          style={styles.region}
          onLayout={(e) => {
            regionOffsets.current.grid = e.nativeEvent.layout.y;
          }}
        >
          <View ref={gridHeadingRef}>
            <Text style={styles.regionTitle}>Day &amp; Time</Text>
            <Text style={styles.regionHint}>
              Grayed-out cells are times the other side has already marked busy.
            </Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <View style={styles.gridCorner} />
              {DAYS.map((day) => (
                <View key={day.id} style={styles.dayHeaderCell}>
                  <Text style={styles.dayHeaderLabel}>{day.label}</Text>
                  <Text style={styles.dayHeaderDate}>{day.dateLabel}</Text>
                </View>
              ))}
            </View>

            {TIME_SLOTS.map((time) => (
              <View key={time.id} style={styles.gridRow}>
                <View style={styles.timeLabelCell}>
                  <Text style={styles.timeLabelText}>{time.label}</Text>
                  <Text style={styles.timeRangeText}>{time.rangeLabel}</Text>
                </View>
                {DAYS.map((day) => {
                  const cellId = buildCellId(day.id, time.id);
                  const busy = BUSY_CELL_IDS.includes(cellId);
                  const picked = pickedSlotId === cellId;
                  const disabled = busy || handoffFinalized;
                  return (
                    <Pressable
                      key={cellId}
                      onPress={() => toggleCell(cellId)}
                      disabled={disabled}
                      accessibilityRole="button"
                      accessibilityState={{ selected: picked, disabled }}
                      accessibilityLabel={`${day.label} ${day.dateLabel}, ${time.label}, ${
                        busy ? "unavailable" : picked ? "selected" : "available"
                      }`}
                      style={({ pressed }) => [
                        styles.gridCell,
                        busy && styles.gridCellBusy,
                        picked && styles.gridCellPicked,
                        pressed && !disabled && styles.gridCellPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridCellMark,
                          picked && styles.gridCellMarkPicked,
                          busy && styles.gridCellMarkBusy,
                        ]}
                      >
                        {busy ? "—" : picked ? "✓" : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View
          ref={spotRegionRef}
          style={styles.region}
          onLayout={(e) => {
            regionOffsets.current.spots = e.nativeEvent.layout.y;
          }}
        >
          <View ref={spotHeadingRef}>
            <Text style={styles.regionTitle}>Meetup Spot</Text>
            <Text style={styles.regionHint}>
              Choose one of these vetted public locations for the hand-off.
            </Text>
          </View>

          <View style={styles.spotList}>
            {MEETUP_SPOTS.map((spot) => {
              const picked = pickedSpotId === spot.id;
              const disabled = handoffFinalized;
              return (
                <Pressable
                  key={spot.id}
                  onPress={() => toggleSpot(spot.id)}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityState={{ selected: picked, disabled }}
                  accessibilityLabel={`${spot.name}. ${spot.descriptor} ${
                    picked ? "Selected." : "Not selected."
                  }`}
                  style={({ pressed }) => [
                    styles.spotRow,
                    picked && styles.spotRowPicked,
                    pressed && !disabled && styles.spotRowPressed,
                  ]}
                >
                  <View style={styles.spotTextCol}>
                    <Text style={styles.spotName}>{spot.name}</Text>
                    <Text style={styles.spotDescriptor}>{spot.descriptor}</Text>
                  </View>
                  <View
                    style={[styles.spotBadge, picked && styles.spotBadgePicked]}
                  >
                    <Text
                      style={[
                        styles.spotBadgeText,
                        picked && styles.spotBadgeTextPicked,
                      ]}
                    >
                      {picked ? "Selected" : "Select"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.band}>
        {locked ? (
          <View accessibilityLiveRegion="polite" style={styles.bandFinalizedRow}>
            <Text accessibilityRole="alert" style={styles.bandFinalizedText}>
              {finalizedSummary(pickedSlotId as string, pickedSpotId as string)}
            </Text>
          </View>
        ) : missing !== null ? (
          <View accessibilityLiveRegion="polite" style={styles.bandPendingRow}>
            <Text accessibilityRole="alert" style={styles.bandPendingText}>
              {missingPickMessage(missing)}
            </Text>
            <Pressable
              onPress={jumpToMissingControl}
              accessibilityRole="button"
              accessibilityLabel={jumpButtonLabel(missing)}
              accessibilityHint="Scrolls to the step that still needs a pick and moves focus there."
              hitSlop={8}
              style={({ pressed }) => [
                styles.jumpButton,
                pressed && styles.jumpButtonPressed,
              ]}
            >
              <Text style={styles.jumpButtonText}>Go there</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={finalizeHandoff}
            accessibilityRole="button"
            accessibilityLabel="Confirm meetup"
            accessibilityHint="Locks in the chosen day, time, and spot for this hand-off."
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.confirmButtonPressed,
            ]}
          >
            <Text style={styles.confirmButtonText}>Confirm Meetup</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const CELL_SIZE = 60;
const TIME_LABEL_WIDTH = 78;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(5),
  },
  region: {
    marginBottom: tokens.space(6),
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  regionHint: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  grid: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridCorner: {
    width: TIME_LABEL_WIDTH,
    height: tokens.space(2),
  },
  dayHeaderCell: {
    width: CELL_SIZE,
    alignItems: "center",
    paddingVertical: tokens.space(2),
  },
  dayHeaderLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  dayHeaderDate: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
  timeLabelCell: {
    width: TIME_LABEL_WIDTH,
    paddingVertical: tokens.space(2),
    paddingRight: tokens.space(1),
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  timeRangeText: {
    fontSize: 10,
    color: tokens.color.faint,
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: tokens.space(1) / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  gridCellPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  gridCellPicked: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  gridCellBusy: {
    backgroundColor: tokens.color.border,
    borderColor: tokens.color.border,
  },
  gridCellMark: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  gridCellMarkPicked: {
    color: tokens.color.accent,
  },
  gridCellMarkBusy: {
    color: tokens.color.faint,
  },
  spotList: {
    gap: tokens.space(2),
  },
  spotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  spotRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  spotRowPicked: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  spotTextCol: {
    flexShrink: 1,
    paddingRight: tokens.space(3),
  },
  spotName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  spotDescriptor: {
    marginTop: 1,
    fontSize: 12,
    color: tokens.color.muted,
  },
  spotBadge: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    minWidth: 76,
    alignItems: "center",
  },
  spotBadgePicked: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  spotBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  spotBadgeTextPicked: {
    color: tokens.color.accent,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    padding: tokens.space(4),
  },
  bandPendingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandPendingText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.ink2,
    paddingRight: tokens.space(3),
  },
  jumpButton: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  jumpButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  jumpButtonText: {
    color: tokens.color.accent,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    color: tokens.color.onAccent,
    fontSize: 16,
    fontWeight: "700",
  },
  bandFinalizedRow: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bandFinalizedText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.success,
    textAlign: "center",
  },
});
