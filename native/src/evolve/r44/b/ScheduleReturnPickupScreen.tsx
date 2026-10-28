// native/src/evolve/r44/b/ScheduleReturnPickupScreen.tsx — auto-native-r44
// candidate b.
//
// Doorstep Return Pickup Scheduling: a seller/returner books a courier to
// come collect an already-approved return from their own address. Distinct
// from the two nearest neighbors already in this catalog:
//   - pickup/ShipmentPickupScreen is the LISTING side (a NEW sale) and is a
//     three-stage blocked workflow with a fixed bottom dock, because price
//     there depends on billable weight/carrier choice resolved in order.
//   - evolve/r40/b ReturnDropoffScreen is drop-off POINTS the buyer travels
//     to — a pure browse screen with a List/Map toggle, nothing to confirm.
// This screen is neither: it's a flat set of interchangeable at-home
// collection time slots, and committing to one is the whole task — there is
// no multi-stage prerequisite chain, so a persistent bottom band has nothing
// to gate and is intentionally absent (GENERATION.md §3: "a band having
// nothing to do is itself a valid choice").
//
// Band mechanic: instead of a bottom band, EACH row owns its own
// confirmation. Tapping "Request pickup" on a row flips that row (only)
// into a Cancel/Confirm pair; confirming flips it again into a persistent
// "Pickup confirmed" state with a "Change" link. This generalizes the
// band→row destructive-confirm idiom from sessions/SessionRow.tsx to a
// *non*-destructive, *persistent* outcome (no removal-after-timeout here —
// see PickupWindowRow.tsx for the state-shape and naming differences).
//
// Macro layout: a genuinely list-shaped screen (multiple interchangeable
// pickup-window options), so a FlatList of PickupWindowRow is the honest
// container — not a workaround for a single-record screen. The return
// order summary (item, reason, deadline) sits in the FlatList's own
// ListHeaderComponent and is pinned via stickyHeaderIndices so it stays
// visible while scrolling through the window options below it; the plain
// screen title above the list is static chrome, not part of the scroller.
import { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../../tokens";
import { PICKUP_WINDOWS, RETURN_ORDER, type PickupWindow } from "./data";
import { PickupWindowRow, type WindowRowPhase } from "./PickupWindowRow";

type ActivePhase = "pending" | "confirmed";

export function ScheduleReturnPickupScreen() {
  // Only one window may ever be pending or confirmed at a time — modeled as
  // a single (id, phase) pair rather than per-row booleans, so "select a
  // different row" can never leave two rows active by accident.
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<ActivePhase | null>(null);

  const phaseFor = (id: string): WindowRowPhase => {
    if (activeWindowId === id && activePhase) return activePhase;
    return "default";
  };

  const requestPickup = (id: string) => {
    // Selecting a different row's "Request pickup" resets whatever row was
    // previously active (pending OR confirmed) back to its default state —
    // there is exactly one active slot on this screen.
    setActiveWindowId(id);
    setActivePhase("pending");
  };

  const cancelRequest = () => {
    setActiveWindowId(null);
    setActivePhase(null);
  };

  const confirmPickup = () => {
    setActivePhase("confirmed");
  };

  const changePickup = () => {
    setActivePhase("pending");
  };

  const renderItem = ({ item }: { item: PickupWindow }) => (
    <PickupWindowRow
      window={item}
      phase={phaseFor(item.id)}
      onRequestPickup={requestPickup}
      onCancelRequest={cancelRequest}
      onConfirmPickup={confirmPickup}
      onChangePickup={changePickup}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.kicker}>DOORSTEP RETURN PICKUP</Text>
        <Text style={styles.title} accessibilityRole="header">
          Schedule Return Pickup
        </Text>
        <Text style={styles.lede}>
          Pick a time window and a courier will come to your saved address to collect this
          return — no drop-off needed.
        </Text>
      </View>

      <FlatList
        data={PICKUP_WINDOWS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.orderSummary}>
            <Text style={styles.orderKicker}>YOUR RETURN</Text>
            <Text style={styles.orderItemName}>{RETURN_ORDER.itemName}</Text>
            <View style={styles.orderMetaLine}>
              <Text style={styles.orderMetaLabel}>Reason</Text>
              <Text style={styles.orderMetaValue}>{RETURN_ORDER.reasonLabel}</Text>
            </View>
            <View style={styles.orderMetaLine}>
              <Text style={styles.orderMetaLabel}>Return by</Text>
              <Text style={styles.orderDeadlineValue}>{RETURN_ORDER.deadlineLabel}</Text>
            </View>
            <Text style={styles.sectionLabel} accessibilityRole="header">
              Available pickup windows
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default ScheduleReturnPickupScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },

  topSection: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
    gap: tokens.space(1),
  },
  kicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: "700", color: tokens.color.faint },
  title: {
    marginTop: tokens.space(1),
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  lede: { marginTop: tokens.space(1), fontSize: 13, lineHeight: 19, color: tokens.color.muted },

  orderSummary: {
    backgroundColor: tokens.color.bg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    gap: tokens.space(1),
  },
  orderKicker: { fontSize: 10, letterSpacing: 1.2, fontWeight: "700", color: tokens.color.faint },
  orderItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: 2,
  },
  orderMetaLine: { flexDirection: "row", gap: tokens.space(2) },
  orderMetaLabel: { fontSize: 12, color: tokens.color.faint, minWidth: 64 },
  orderMetaValue: { fontSize: 12, fontWeight: "600", color: tokens.color.ink2, flex: 1 },
  orderDeadlineValue: { fontSize: 12, fontWeight: "700", color: tokens.color.warning, flex: 1 },

  sectionLabel: {
    marginTop: tokens.space(3),
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },

  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
    paddingTop: tokens.space(3),
  },
  separator: { height: tokens.space(3) },
});
