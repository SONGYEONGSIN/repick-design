// native/src/evolve/r7/c/PriceAlertsScreen.tsx — auto-native-r7 candidate c.
//
// A settings/management screen: a list of independent, self-contained records (configured price
// and restock alerts) the user edits in place. There is no screen-level terminal/blocking action
// (nothing here is a multi-step flow with a wrong/right gate to pass through) — every row is a
// value the user *sets*, not a value the whole screen is building toward. Per the auto-native-r2
// delta that pattern calls for zero fixed/pinned chrome: everything, including the heading, scrolls
// in one continuous FlatList, and every edit (threshold step, watched-size change, delete) applies
// immediately with no separate save step. See candidates/c.md for the full "not just copying r2"
// reasoning.
import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  clampWon,
  formatWonDigits,
  INITIAL_ALERTS,
  PRICE_STEP_WON,
  recomputePriceStatus,
  recomputeRestockStatus,
  STATUS_TEXT,
  type AlertRecord,
  type AlertStatus,
  type PriceAlertRecord,
  type RestockAlertRecord,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// Renders a won amount as two SIBLING Text nodes (symbol, digits) under one unstyled View
// wrapper. Per the native-deltas record (r4, refined in r6): applying fontVariant:
// ["tabular-nums"] to a Text node that contains — or is an ancestor of — a Text node holding the
// ₩ glyph produces a visible strikethrough-like artifact in this environment, and RN Web cascades
// fontVariant down to nested Text children even when the child has its own style object. So the
// wrapper here carries no style/fontVariant at all, and tabular-nums is applied ONLY to the
// digits Text, which is a sibling of (never a parent or child of) the ₩ Text.
function WonText({
  won,
  symbolStyle,
  digitsStyle,
}: {
  won: number;
  symbolStyle?: StyleProp<TextStyle>;
  digitsStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.wonRow}>
      <Text style={symbolStyle}>₩</Text>
      <Text style={[styles.tabularNums, digitsStyle]}>{formatWonDigits(won)}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: AlertStatus }) {
  return (
    <View
      style={[
        styles.statusPill,
        status === "armed" && styles.statusPillArmed,
        status === "triggered" && styles.statusPillTriggered,
        status === "expired" && styles.statusPillExpired,
      ]}
      accessibilityLiveRegion="polite"
    >
      <Text
        style={[
          styles.statusPillText,
          status === "triggered" && styles.statusPillTextOnAccent,
          status === "expired" && styles.statusPillTextExpired,
        ]}
      >
        {STATUS_TEXT[status]}
      </Text>
    </View>
  );
}

function PriceAlertBody({
  alert,
  touched,
  onAdjust,
}: {
  alert: PriceAlertRecord;
  touched: boolean;
  onAdjust: (nextTarget: number) => void;
}) {
  const locked = alert.status === "expired";
  const atMin = alert.targetPriceWon <= alert.minTargetWon;
  const atMax = alert.targetPriceWon >= alert.maxTargetWon;

  return (
    <View style={styles.body}>
      <View style={styles.priceCurrentRow}>
        <Text style={styles.fieldLabel}>Current price</Text>
        <WonText
          won={alert.currentPriceWon}
          symbolStyle={styles.wonSymbolMuted}
          digitsStyle={styles.priceCurrentDigits}
        />
      </View>

      <View style={styles.priceTargetHead}>
        <Text style={styles.fieldLabel}>Notify below</Text>
        <WonText
          won={alert.targetPriceWon}
          symbolStyle={styles.wonSymbol}
          digitsStyle={styles.priceTargetDigits}
        />
      </View>

      {locked ? (
        <Text style={styles.lockedNote}>
          This listing is no longer available. Editing is off — remove the alert instead.
        </Text>
      ) : (
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => onAdjust(clampWon(alert.targetPriceWon - PRICE_STEP_WON, alert.minTargetWon, alert.maxTargetWon))}
            disabled={atMin}
            accessibilityRole="button"
            accessibilityLabel={`Lower ${alert.itemTitle} alert threshold by 5,000 won`}
            accessibilityState={{ disabled: atMin }}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.step, atMin && styles.stepDisabled, pressed && !atMin && styles.pressed]}
          >
            <Text style={styles.stepGlyph}>−</Text>
          </Pressable>
          <Text style={styles.stepperRange}>
            ₩{formatWonDigits(alert.minTargetWon)} – ₩{formatWonDigits(alert.maxTargetWon)}
          </Text>
          <Pressable
            onPress={() => onAdjust(clampWon(alert.targetPriceWon + PRICE_STEP_WON, alert.minTargetWon, alert.maxTargetWon))}
            disabled={atMax}
            accessibilityRole="button"
            accessibilityLabel={`Raise ${alert.itemTitle} alert threshold by 5,000 won`}
            accessibilityState={{ disabled: atMax }}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.step, atMax && styles.stepDisabled, pressed && !atMax && styles.pressed]}
          >
            <Text style={styles.stepGlyph}>+</Text>
          </Pressable>
        </View>
      )}
      {touched && !locked && <Text style={styles.updatedTag}>Updated</Text>}
    </View>
  );
}

function RestockAlertBody({
  alert,
  touched,
  onSelectSize,
}: {
  alert: RestockAlertRecord;
  touched: boolean;
  onSelectSize: (size: string) => void;
}) {
  const locked = alert.status === "expired";
  const inStockLabel =
    alert.inStockSizes.length > 0 ? `In stock now: ${alert.inStockSizes.join(", ")}` : "Nothing in stock right now";

  return (
    <View style={styles.body}>
      <Text style={styles.fieldLabel}>Notify when this size is in stock</Text>
      <View
        style={styles.sizeGroup}
        accessibilityRole="radiogroup"
        accessibilityLabel={`Watched size for ${alert.itemTitle}`}
      >
        {alert.sizeOptions.map((size) => {
          const selected = size === alert.targetSize;
          return (
            <Pressable
              key={size}
              onPress={() => !locked && onSelectSize(size)}
              disabled={locked}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected, disabled: locked }}
              accessibilityLabel={`Size ${size}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.sizeChip,
                selected && styles.sizeChipOn,
                locked && styles.sizeChipDisabled,
                pressed && !locked && styles.pressed,
              ]}
            >
              <Text style={[styles.sizeChipLabel, selected && styles.sizeChipLabelOn]}>{size}</Text>
            </Pressable>
          );
        })}
      </View>
      {locked ? (
        <Text style={styles.lockedNote}>
          This listing is no longer available. Editing is off — remove the alert instead.
        </Text>
      ) : (
        <Text style={styles.sizeHint}>{inStockLabel}</Text>
      )}
      {touched && !locked && <Text style={styles.updatedTag}>Updated</Text>}
    </View>
  );
}

function DeleteControl({
  itemTitle,
  stage,
  onRequest,
  onCancel,
  onConfirm,
}: {
  itemTitle: string;
  stage: "idle" | "confirm";
  onRequest: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (stage === "confirm") {
    return (
      <View style={styles.confirmRow}>
        <Text style={styles.confirmQuestion}>Remove this alert?</Text>
        <View style={styles.confirmButtons}>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={`Confirm remove alert for ${itemTitle}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnStrong, pressed && styles.pressed]}
          >
            <Text style={styles.confirmBtnLabelOn}>Remove</Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel remove"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
          >
            <Text style={styles.confirmBtnLabelGhost}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onRequest}
      accessibilityRole="button"
      accessibilityLabel={`Remove alert for ${itemTitle}`}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
    >
      <Text style={styles.deleteBtnLabel}>Delete alert</Text>
    </Pressable>
  );
}

function AlertRow({
  alert,
  touched,
  deleteStage,
  onAdjustPrice,
  onSelectSize,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  alert: AlertRecord;
  touched: boolean;
  deleteStage: "idle" | "confirm";
  onAdjustPrice: (nextTarget: number) => void;
  onSelectSize: (size: string) => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.cardHeadText}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {alert.itemTitle}
          </Text>
          <Text style={styles.itemMeta}>{alert.itemMeta}</Text>
        </View>
        <StatusPill status={alert.status} />
      </View>
      <Text style={styles.createdLabel}>{alert.createdLabel}</Text>

      {alert.kind === "price" ? (
        <PriceAlertBody alert={alert} touched={touched} onAdjust={onAdjustPrice} />
      ) : (
        <RestockAlertBody alert={alert} touched={touched} onSelectSize={onSelectSize} />
      )}

      <View style={styles.divider} />
      <DeleteControl
        itemTitle={alert.itemTitle}
        stage={deleteStage}
        onRequest={onRequestDelete}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </View>
  );
}

export function PriceAlertsScreen() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [deleteStages, setDeleteStages] = useState<Record<string, "idle" | "confirm">>({});

  const armedCount = alerts.filter((a) => a.status === "armed").length;
  const triggeredCount = alerts.filter((a) => a.status === "triggered").length;

  const adjustPrice = (id: string, nextTarget: number) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== id || a.kind !== "price") return a;
        const nextStatus = recomputePriceStatus(a.currentPriceWon, nextTarget, a.status);
        return { ...a, targetPriceWon: nextTarget, status: nextStatus };
      }),
    );
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const selectSize = (id: string, size: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== id || a.kind !== "restock") return a;
        const nextStatus = recomputeRestockStatus(size, a.inStockSizes, a.status);
        return { ...a, targetSize: size, status: nextStatus };
      }),
    );
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const requestDelete = (id: string) => setDeleteStages((prev) => ({ ...prev, [id]: "confirm" }));
  const cancelDelete = (id: string) => setDeleteStages((prev) => ({ ...prev, [id]: "idle" }));
  const confirmDelete = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDeleteStages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={alerts}
        keyExtractor={(a) => a.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.h1} accessibilityRole="header">
              Price Alerts
            </Text>
            <Text style={styles.sub} accessibilityLiveRegion="polite">
              {alerts.length} alert{alerts.length === 1 ? "" : "s"} · {armedCount} watching · {triggeredCount} reached
            </Text>
            <Text style={styles.subHint}>Edits apply immediately — there is no separate save step.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AlertRow
            alert={item}
            touched={!!touched[item.id]}
            deleteStage={deleteStages[item.id] ?? "idle"}
            onAdjustPrice={(next) => adjustPrice(item.id, next)}
            onSelectSize={(size) => selectSize(item.id, size)}
            onRequestDelete={() => requestDelete(item.id)}
            onCancelDelete={() => cancelDelete(item.id)}
            onConfirmDelete={() => confirmDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No alerts left</Text>
            <Text style={styles.emptyText}>
              You removed every price and restock alert. Set a new one from an item's price-history
              page whenever you want to be notified again.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default PriceAlertsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  header: { paddingTop: tokens.space(10), paddingBottom: tokens.space(2) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.muted, fontVariant: ["tabular-nums"] },
  subHint: { marginTop: 4, fontSize: 12, color: tokens.color.faint },

  card: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  cardHead: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(3) },
  cardHeadText: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  itemMeta: { fontSize: 12, color: tokens.color.muted },
  createdLabel: { marginTop: 4, fontSize: 11, color: tokens.color.faint },

  statusPill: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  statusPillArmed: { borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  statusPillTriggered: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  statusPillExpired: { borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  statusPillText: { fontSize: 11, fontWeight: "700", color: tokens.color.muted },
  statusPillTextOnAccent: { color: tokens.color.onAccent },
  statusPillTextExpired: { color: tokens.color.faint },

  body: { marginTop: tokens.space(4), gap: tokens.space(2) },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: tokens.color.faint },

  // WonText wrapper — deliberately unstyled (no fontVariant here), see WonText comment above.
  wonRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  tabularNums: { fontVariant: ["tabular-nums"] },
  wonSymbol: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  wonSymbolMuted: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },

  priceCurrentRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceCurrentDigits: { fontSize: 14, fontWeight: "600", color: tokens.color.muted },
  priceTargetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceTargetDigits: { fontSize: 20, fontWeight: "800", color: tokens.color.ink },

  stepperRow: {
    marginTop: tokens.space(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDisabled: { opacity: 0.4 },
  stepGlyph: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2, lineHeight: 22 },
  // No tabular-nums here: this label's own Text node also contains the ₩ glyph literally in its
  // string content, and combining the two on one node is the exact artifact the WonText comment
  // above guards against. It is a small range caption, not a figure that needs digit alignment.
  stepperRange: { fontSize: 11, color: tokens.color.faint },

  sizeGroup: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  sizeChip: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeChipOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  sizeChipDisabled: { opacity: 0.4 },
  sizeChipLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  sizeChipLabelOn: { color: tokens.color.onAccent },
  sizeHint: { fontSize: 12, color: tokens.color.faint },

  lockedNote: { fontSize: 12, lineHeight: 17, color: tokens.color.faint, fontStyle: "italic" },
  updatedTag: { fontSize: 11, fontWeight: "700", color: tokens.color.accent },

  divider: { marginTop: tokens.space(4), borderTopWidth: 1, borderTopColor: tokens.color.border },

  deleteBtn: {
    marginTop: tokens.space(3),
    minHeight: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  deleteBtnLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  confirmRow: { marginTop: tokens.space(3), gap: tokens.space(2) },
  confirmQuestion: { fontSize: 13, fontWeight: "600", color: tokens.color.ink },
  confirmButtons: { flexDirection: "row", gap: tokens.space(2) },
  confirmBtn: {
    flexGrow: 1,
    flexBasis: 0,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  confirmBtnStrong: { backgroundColor: tokens.color.ink2 },
  confirmBtnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  confirmBtnLabelOn: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  confirmBtnLabelGhost: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },

  pressed: { opacity: 0.85 },

  empty: { marginTop: tokens.space(10), alignItems: "center", paddingHorizontal: tokens.space(4) },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink },
  emptyText: { marginTop: tokens.space(2), fontSize: 13, lineHeight: 19, color: tokens.color.faint, textAlign: "center" },
});
