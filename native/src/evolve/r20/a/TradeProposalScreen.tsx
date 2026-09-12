// native/src/evolve/r20/a/TradeProposalScreen.tsx
//
// Concept: "Trade Proposal" — compose/adjust ONE item-for-item barter proposal against
// another user, with an optional one-directional cash top-up and a live fairness
// readout computed from fixed per-item values in data.ts.
//
// Band-form choice: NO fixed bottom band (GENERATION.md §3 explicitly allows this —
// "밴드가 없는 것도 유효한 선택이다"). The "Send Proposal" control lives inline, at the
// bottom of the scrolling content, right next to the fairness readout it depends on —
// not pinned to the viewport. There is no multi-step sequence to gate through (no
// "confirm this before that" chain), so a blocked-workflow state machine would be
// invented scaffolding; the only real gate is "has at least one item been picked on
// each side", and that reason is stated exactly where the picking happens, inline,
// rather than surfaced in a separate persistent surface. This also sidesteps the
// selection-count-driven contextual bar form (already catalogued elsewhere): a bar
// that slides in/out here would visually duplicate the "Send Proposal" affordance,
// since the very row it would summarize sits one scroll-page above it.
//
// Differentiation from named prior screens:
//   - offer-thread/OfferThread.tsx is a pure cash counter-offer CHAT THREAD — a
//     message list, no item selection at all. This screen has no message list or
//     timestamps-of-messages; its whole surface is two item-selection sets plus a
//     top-up amount and a value comparison. It shows the proposal's current status as
//     a single status line (not a thread of turns).
//   - detail/PriceDetail.tsx is a single item's price-HISTORY view (one item, past
//     prices over time). This screen has no historical chart and is never about one
//     item's own price — it compares two live *sets* of items (plus cash) against
//     each other, right now, for a proposal that hasn't been sent yet.

import { useMemo, useState } from "react";
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
  COUNTERPARTY_INITIALS,
  COUNTERPARTY_NAME,
  FAIRNESS_TOLERANCE_WON,
  INITIAL_SELECTED_MINE,
  INITIAL_SELECTED_THEIRS,
  INITIAL_TOPUP_WON,
  INITIAL_TOPUP_DIRECTION,
  MY_ITEMS,
  PROPOSAL_STATUS,
  STATUS_NOTE,
  STATUS_UPDATED_LABEL,
  THEIR_ITEMS,
  TOPUP_MAX_WON,
  TOPUP_MIN_WON,
  TOPUP_STEP_WON,
  formatWon,
  sumValues,
} from "./data";
import type { TopUpDirection, TradeItem } from "./data";

const STATUS_LABEL: Record<typeof PROPOSAL_STATUS, string> = {
  pending: "Pending",
  countered: "Countered",
  accepted: "Accepted",
  declined: "Declined",
};

function MyItemChip({
  item,
  selected,
  onToggle,
  locked,
}: {
  item: TradeItem;
  selected: boolean;
  onToggle: () => void;
  locked: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={locked}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: locked }}
      accessibilityLabel={`${item.title}, ${item.condition} condition, ${formatWon(
        item.valueWon,
      )}`}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        locked && styles.locked,
        pressed && styles.pressedDim,
      ]}
    >
      <View style={[styles.checkMark, selected && styles.checkMarkSelected]}>
        {selected ? <Text style={styles.checkMarkGlyph}>✓</Text> : null}
      </View>
      <View style={styles.chipTextCol}>
        <Text style={styles.chipTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.chipMeta}>
          {item.condition} · {formatWon(item.valueWon)}
        </Text>
      </View>
    </Pressable>
  );
}

function TheirItemRow({
  item,
  selected,
  onToggle,
  locked,
}: {
  item: TradeItem;
  selected: boolean;
  onToggle: () => void;
  locked: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={locked}
      hitSlop={4}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: locked }}
      accessibilityLabel={`${item.title}, ${item.condition} condition, ${formatWon(
        item.valueWon,
      )}`}
      style={({ pressed }) => [
        styles.itemRow,
        selected && styles.itemRowSelected,
        locked && styles.locked,
        pressed && styles.pressedDim,
      ]}
    >
      <View style={[styles.checkMark, selected && styles.checkMarkSelected]}>
        {selected ? <Text style={styles.checkMarkGlyph}>✓</Text> : null}
      </View>
      <View style={styles.itemRowTextCol}>
        <Text style={styles.itemRowTitle}>{item.title}</Text>
        <Text style={styles.itemRowMeta}>{item.condition}</Text>
      </View>
      <Text style={styles.itemRowValue}>{formatWon(item.valueWon)}</Text>
    </Pressable>
  );
}

export default function TradeProposalScreen() {
  const [selectedMine, setSelectedMine] = useState<string[]>(INITIAL_SELECTED_MINE);
  const [selectedTheirs, setSelectedTheirs] = useState<string[]>(
    INITIAL_SELECTED_THEIRS,
  );
  const [topUpDirection, setTopUpDirection] = useState<TopUpDirection>(
    INITIAL_TOPUP_DIRECTION,
  );
  const [topUpWon, setTopUpWon] = useState<number>(INITIAL_TOPUP_WON);
  const [sent, setSent] = useState(false);

  const toggleMine = (id: string) => {
    if (sent) return;
    setSelectedMine((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleTheirs = (id: string) => {
    if (sent) return;
    setSelectedTheirs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const setDirection = (direction: TopUpDirection) => {
    if (sent) return;
    setTopUpDirection(direction);
    if (direction === "none") setTopUpWon(0);
    else if (topUpWon === 0) setTopUpWon(TOPUP_STEP_WON);
  };

  const adjustTopUp = (delta: number) => {
    if (sent || topUpDirection === "none") return;
    setTopUpWon((prev) =>
      Math.min(TOPUP_MAX_WON, Math.max(TOPUP_MIN_WON, prev + delta)),
    );
  };

  const totals = useMemo(() => {
    const mineItemsTotal = sumValues(MY_ITEMS, selectedMine);
    const theirsItemsTotal = sumValues(THEIR_ITEMS, selectedTheirs);
    const mineSideTotal =
      mineItemsTotal + (topUpDirection === "mine" ? topUpWon : 0);
    const theirsSideTotal =
      theirsItemsTotal + (topUpDirection === "theirs" ? topUpWon : 0);
    const diff = mineSideTotal - theirsSideTotal;
    const isEven = Math.abs(diff) <= FAIRNESS_TOLERANCE_WON;
    const combined = Math.max(1, mineSideTotal + theirsSideTotal);
    return {
      mineItemsTotal,
      theirsItemsTotal,
      mineSideTotal,
      theirsSideTotal,
      diff,
      isEven,
      mineRatio: mineSideTotal / combined,
      theirsRatio: theirsSideTotal / combined,
    };
  }, [selectedMine, selectedTheirs, topUpDirection, topUpWon]);

  const fairnessLabel = totals.isEven
    ? "Even trade"
    : totals.diff > 0
      ? `You're offering ${formatWon(totals.diff)} more`
      : `${COUNTERPARTY_NAME.split(" ")[0]} is offering ${formatWon(
          -totals.diff,
        )} more`;

  const hasMine = selectedMine.length > 0;
  const hasTheirs = selectedTheirs.length > 0;
  const canSend = hasMine && hasTheirs && !sent;

  let readinessText: string;
  if (sent) {
    readinessText = `Updated proposal sent to ${COUNTERPARTY_NAME}. Waiting for a response.`;
  } else if (!hasMine && !hasTheirs) {
    readinessText = "Select at least one item on each side to send a trade.";
  } else if (!hasMine) {
    readinessText = "Select at least one of your items to offer.";
  } else if (!hasTheirs) {
    readinessText = `Select at least one of ${COUNTERPARTY_NAME.split(" ")[0]}'s items to request.`;
  } else {
    readinessText = "Ready to send — check the fairness readout, then send below.";
  }

  const header = (
    <View>
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={styles.title}>
          Trade Proposal
        </Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{STATUS_LABEL[PROPOSAL_STATUS]}</Text>
        </View>
      </View>
      <View style={styles.counterpartyRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{COUNTERPARTY_INITIALS}</Text>
        </View>
        <View style={styles.chipTextCol}>
          <Text style={styles.counterpartyName}>with {COUNTERPARTY_NAME}</Text>
          <Text style={styles.counterpartyMeta}>Updated {STATUS_UPDATED_LABEL}</Text>
        </View>
      </View>
      <Text style={styles.statusNote}>{STATUS_NOTE}</Text>

      <Text style={styles.sectionLabel}>Your items</Text>
      <View style={styles.chipWrap}>
        {MY_ITEMS.map((item) => (
          <MyItemChip
            key={item.id}
            item={item}
            selected={selectedMine.includes(item.id)}
            onToggle={() => toggleMine(item.id)}
            locked={sent}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Cash top-up</Text>
      <View style={styles.radioRow} accessibilityRole="radiogroup">
        {(
          [
            { key: "none", label: "None" },
            { key: "mine", label: "I add cash" },
            { key: "theirs", label: `${COUNTERPARTY_NAME.split(" ")[0]} adds` },
          ] as { key: TopUpDirection; label: string }[]
        ).map((opt) => {
          const checked = topUpDirection === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setDirection(opt.key)}
              disabled={sent}
              hitSlop={8}
              accessibilityRole="radio"
              accessibilityState={{ checked, disabled: sent }}
              accessibilityLabel={opt.label}
              style={({ pressed }) => [
                styles.radioOption,
                checked && styles.radioOptionChecked,
                sent && styles.locked,
                pressed && styles.pressedDim,
              ]}
            >
              <Text style={styles.radioGlyph}>{checked ? "●" : "○"}</Text>
              <Text
                style={[styles.radioLabel, checked && styles.radioLabelChecked]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {topUpDirection !== "none" ? (
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => adjustTopUp(-TOPUP_STEP_WON)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Decrease top-up by ${formatWon(TOPUP_STEP_WON)}`}
            disabled={sent || topUpWon <= TOPUP_MIN_WON}
            style={({ pressed }) => [
              styles.stepperButton,
              (sent || topUpWon <= TOPUP_MIN_WON) && styles.stepperButtonDisabled,
              pressed && styles.pressedDim,
            ]}
          >
            <Text style={styles.stepperGlyph}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{formatWon(topUpWon)}</Text>
          <Pressable
            onPress={() => adjustTopUp(TOPUP_STEP_WON)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Increase top-up by ${formatWon(TOPUP_STEP_WON)}`}
            disabled={sent || topUpWon >= TOPUP_MAX_WON}
            style={({ pressed }) => [
              styles.stepperButton,
              (sent || topUpWon >= TOPUP_MAX_WON) && styles.stepperButtonDisabled,
              pressed && styles.pressedDim,
            ]}
          >
            <Text style={styles.stepperGlyph}>+</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>
        {COUNTERPARTY_NAME.split(" ")[0]}'s items
      </Text>
    </View>
  );

  const footer = (
    <View>
      <View style={styles.fairnessCard}>
        <Text style={styles.fairnessTitle}>Value comparison</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barMine, { flex: totals.mineRatio || 0.001 }]} />
          <View style={[styles.barTheirs, { flex: totals.theirsRatio || 0.001 }]} />
        </View>
        <View style={styles.barLegendRow}>
          <Text style={styles.barLegendMine}>
            You · {formatWon(totals.mineSideTotal)}
          </Text>
          <Text style={styles.barLegendTheirs}>
            {COUNTERPARTY_NAME.split(" ")[0]} · {formatWon(totals.theirsSideTotal)}
          </Text>
        </View>
        <Text style={styles.fairnessLabel}>{fairnessLabel}</Text>
      </View>

      <View style={styles.readinessZone} accessibilityLiveRegion="polite">
        <Text accessibilityRole="alert" style={styles.readinessText}>
          {readinessText}
        </Text>
        <Pressable
          onPress={() => {
            if (canSend) setSent(true);
          }}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel={sent ? "Proposal sent" : "Send updated proposal"}
          accessibilityState={{ disabled: !canSend }}
          style={({ pressed }) => [
            styles.sendButton,
            !canSend && styles.sendButtonDisabled,
            pressed && canSend && styles.pressedDim,
          ]}
        >
          <Text
            style={[
              styles.sendButtonText,
              !canSend && styles.sendButtonTextDisabled,
            ]}
          >
            {sent ? "Sent" : "Send Updated Proposal"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footerNote}>
        Either side can counter or decline until one of you accepts.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={THEIR_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TheirItemRow
            item={item}
            selected={selectedTheirs.includes(item.id)}
            onToggle={() => toggleTheirs(item.id)}
            locked={sent}
          />
        )}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(3),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statusPill: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2.5),
    paddingVertical: tokens.space(1),
  },
  statusPillText: {
    color: tokens.color.onAccent,
    fontSize: 12,
    fontWeight: "700",
  },
  counterpartyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(3),
    gap: tokens.space(2.5),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "700",
  },
  counterpartyName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  counterpartyMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 1,
  },
  statusNote: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2.5),
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(2),
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2.5),
    minWidth: "47%",
    minHeight: 44,
    gap: tokens.space(2),
  },
  chipSelected: {
    borderColor: tokens.color.accent,
  },
  chipTextCol: {
    flexShrink: 1,
  },
  chipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  chipMeta: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 1,
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkMarkSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkMarkGlyph: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2.5),
    minHeight: 44,
    gap: tokens.space(1.5),
  },
  radioOptionChecked: {
    borderColor: tokens.color.accent,
  },
  radioGlyph: {
    fontSize: 14,
    color: tokens.color.faint,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  radioLabelChecked: {
    color: tokens.color.accent,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(3),
    gap: tokens.space(4),
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    minWidth: 90,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2.5),
    paddingHorizontal: tokens.space(2.5),
    minHeight: 44,
    gap: tokens.space(2.5),
    marginBottom: tokens.space(2),
  },
  itemRowSelected: {
    borderColor: tokens.color.accent,
  },
  itemRowTextCol: {
    flex: 1,
  },
  itemRowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemRowMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 1,
  },
  itemRowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  fairnessCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3.5),
  },
  fairnessTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginBottom: tokens.space(2.5),
  },
  barTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: tokens.color.border,
  },
  barMine: {
    backgroundColor: tokens.color.accent,
  },
  barTheirs: {
    backgroundColor: tokens.color.ink2,
  },
  barLegendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
  },
  barLegendMine: {
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  barLegendTheirs: {
    fontSize: 12,
    color: tokens.color.ink2,
    fontWeight: "600",
  },
  fairnessLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(3),
    textAlign: "center",
  },
  readinessZone: {
    marginTop: tokens.space(4),
    alignItems: "center",
  },
  readinessText: {
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
    marginBottom: tokens.space(3),
    paddingHorizontal: tokens.space(2),
  },
  sendButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    paddingHorizontal: tokens.space(6),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  sendButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  sendButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  sendButtonTextDisabled: {
    color: tokens.color.faint,
  },
  footerNote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    marginTop: tokens.space(4),
    paddingHorizontal: tokens.space(2),
  },
  pressedDim: {
    opacity: 0.7,
  },
  locked: {
    opacity: 0.5,
  },
});
