// native/src/evolve/r44/b/PickupWindowRow.tsx — auto-native-r44 candidate b.
//
// One courier pickup-window option. This generalizes this catalog's
// "turn the confirming surface itself into Cancel/Confirm, in place, instead
// of spawning a separate dock or a native Alert" idiom (first established as
// a bottom-band transform, then generalized to a destructive per-row control
// in sessions/SessionRow.tsx) one step further: here the per-row surface is
// NOT destructive and does NOT remove itself from the list afterward. It
// settles into a third, persistent "confirmed" look (a success-toned
// acknowledgement with a "Change" link) rather than being torn out on a
// timer. Style keys, copy and the confirmed/"Change" treatment below are
// original to this screen, not copied from that row.
//
// Deliberately no `accessible={true}` anywhere in this file: the row's
// trailing control area nests one to three independent Pressables
// ("Request pickup", or "Cancel" + "Confirm", or "Change") and collapsing
// that subtree into a single opaque focus unit would make the ones that
// aren't first unreachable to VoiceOver/TalkBack.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../../tokens";
import { windowSummaryLabel, type PickupWindow } from "./data";

export type WindowRowPhase = "default" | "pending" | "confirmed";

type Props = {
  window: PickupWindow;
  phase: WindowRowPhase;
  onRequestPickup: (id: string) => void;
  onCancelRequest: () => void;
  onConfirmPickup: () => void;
  onChangePickup: () => void;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function PickupWindowRow({
  window,
  phase,
  onRequestPickup,
  onCancelRequest,
  onConfirmPickup,
  onChangePickup,
}: Props) {
  const summary = windowSummaryLabel(window);

  return (
    <View
      style={[
        styles.card,
        phase === "pending" && styles.cardPending,
        phase === "confirmed" && styles.cardConfirmed,
      ]}
    >
      <View style={styles.infoBlock}>
        <Text style={styles.dateLabel}>{window.dateLabel}</Text>
        <Text style={styles.timeLabel}>{window.timeRangeLabel}</Text>
        <Text style={styles.courierLabel}>{window.courierLabel}</Text>
        {window.noteLabel ? <Text style={styles.noteLabel}>{window.noteLabel}</Text> : null}
      </View>

      {phase === "default" && (
        <Pressable
          onPress={() => onRequestPickup(window.id)}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Request pickup for ${summary}`}
          accessibilityHint="Opens a confirmation for this time window, in place."
          style={({ pressed }) => [styles.requestButton, pressed && styles.requestButtonPressed]}
        >
          <Text style={styles.requestLabel}>Request pickup</Text>
        </Pressable>
      )}

      {phase === "pending" && (
        <View style={styles.pendingPanel} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.pendingPrompt}>
            {`Request a courier pickup for ${summary}? They'll collect the item from your saved address.`}
          </Text>
          <View style={styles.pendingActions}>
            <Pressable
              onPress={onCancelRequest}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Cancel pickup request"
              style={({ pressed }) => [styles.cancelAction, pressed && styles.cancelActionPressed]}
            >
              <Text style={styles.cancelActionLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirmPickup}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Confirm pickup for ${summary}`}
              accessibilityHint="Books this courier window for your return."
              style={({ pressed }) => [styles.confirmAction, pressed && styles.confirmActionPressed]}
            >
              <Text style={styles.confirmActionLabel}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      )}

      {phase === "confirmed" && (
        <View style={styles.confirmedPanel} accessibilityLiveRegion="polite">
          <View style={styles.confirmedLine}>
            <Text style={styles.confirmedGlyph}>✓</Text>
            <Text accessibilityRole="alert" style={styles.confirmedText}>
              {`Pickup confirmed for ${summary}`}
            </Text>
          </View>
          <Pressable
            onPress={onChangePickup}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Change pickup time"
            accessibilityHint="Reopens this window so you can confirm it again or cancel."
            style={({ pressed }) => [styles.changeLink, pressed && styles.changeLinkPressed]}
          >
            <Text style={styles.changeLinkLabel}>Change</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default PickupWindowRow;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardPending: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  cardConfirmed: {
    borderColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
  },
  infoBlock: { gap: 2 },
  dateLabel: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  timeLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  courierLabel: { fontSize: 12, color: tokens.color.muted },
  noteLabel: { fontSize: 11, color: tokens.color.faint, marginTop: 2 },

  requestButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
  },
  requestButtonPressed: { backgroundColor: tokens.color.accentBg },
  requestLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.accent },

  pendingPanel: { gap: tokens.space(3) },
  pendingPrompt: { fontSize: 13, lineHeight: 19, color: tokens.color.ink },
  pendingActions: { flexDirection: "row", gap: tokens.space(3) },
  cancelAction: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  cancelActionPressed: { backgroundColor: tokens.color.border },
  cancelActionLabel: { fontSize: 14, fontWeight: "600", color: tokens.color.muted },
  confirmAction: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  confirmActionPressed: { opacity: 0.85 },
  confirmActionLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  confirmedPanel: { gap: tokens.space(2) },
  confirmedLine: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(2) },
  confirmedGlyph: { fontSize: 14, fontWeight: "700", color: tokens.color.success, lineHeight: 19 },
  confirmedText: { flex: 1, fontSize: 13, fontWeight: "700", lineHeight: 19, color: tokens.color.success },
  changeLink: {
    alignSelf: "flex-start",
    minHeight: 32,
    minWidth: 44,
    paddingHorizontal: tokens.space(1),
    justifyContent: "center",
  },
  changeLinkPressed: { opacity: 0.7 },
  changeLinkLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },
});
