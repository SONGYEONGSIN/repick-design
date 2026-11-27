// native/src/evolve/r51/a/ItemSwapProposalScreen.tsx
//
// Item Swap Proposal — a seller offers one of their own listed items in
// exchange for another trader's listed item (item-for-item barter, no cash).
//
// State shape is written from scratch for this "externally-gated block"
// domain: once sent, the proposer can only withdraw — there is no
// self-triggered way to move the swap forward, because the only thing left
// to happen is the other trader accepting or declining, which this screen
// cannot do on their behalf.
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  MY_ITEMS,
  THEIR_ITEMS,
  OTHER_TRADER,
  NOTE_MAX_LENGTH,
  formatWon,
  swatchForIndex,
  type TradeItem,
  type SwatchKey,
} from "./data";

// Five states, but only one of them ("awaitingReply") is the externally-gated
// block. The other four are ordinary drafting / confirmation / resolved
// states that the proposer themselves can move between.
type SwapPhase = "drafting" | "awaitingReply" | "confirmWithdraw" | "withdrawn";

const SWATCH_STYLE_KEY: Record<SwatchKey, "tileSwatch1" | "tileSwatch2" | "tileSwatch3"> = {
  swatch1: "tileSwatch1",
  swatch2: "tileSwatch2",
  swatch3: "tileSwatch3",
};

export default function ItemSwapProposalScreen() {
  const [myItemId, setMyItemId] = useState<string | null>(null);
  const [theirItemId, setTheirItemId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<SwapPhase>("drafting");
  // Which incomplete section the band most recently pointed the user at, so
  // that section can pick up a visible accent border for a moment.
  const [nudgeTarget, setNudgeTarget] = useState<"mine" | "theirs" | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const mineOffsetY = useRef(0);
  const theirsOffsetY = useRef(0);

  const selectedMyItem = useMemo(
    () => MY_ITEMS.find((item) => item.id === myItemId) ?? null,
    [myItemId]
  );
  const selectedTheirItem = useMemo(
    () => THEIR_ITEMS.find((item) => item.id === theirItemId) ?? null,
    [theirItemId]
  );

  function chooseMyItem(id: string) {
    if (phase !== "drafting") return;
    setMyItemId(id);
    setNudgeTarget(null);
  }

  function chooseTheirItem(id: string) {
    if (phase !== "drafting") return;
    setTheirItemId(id);
    setNudgeTarget(null);
  }

  // The single band action is a tiny state machine: pressing it always moves
  // to whatever the next incomplete point is, it never does nothing.
  function handlePrimaryBandPress() {
    if (phase === "drafting") {
      if (!myItemId) {
        setNudgeTarget("mine");
        scrollRef.current?.scrollTo({ y: Math.max(mineOffsetY.current - 16, 0), animated: true });
        return;
      }
      if (!theirItemId) {
        setNudgeTarget("theirs");
        scrollRef.current?.scrollTo({ y: Math.max(theirsOffsetY.current - 16, 0), animated: true });
        return;
      }
      setPhase("awaitingReply");
      return;
    }
    if (phase === "awaitingReply") {
      setPhase("confirmWithdraw");
      return;
    }
    if (phase === "withdrawn") {
      // Starting over is a fresh draft, not an unblock of the gate that just
      // resolved — the previous proposal stays withdrawn.
      setMyItemId(null);
      setTheirItemId(null);
      setNote("");
      setNudgeTarget(null);
      setPhase("drafting");
    }
  }

  const bothChosen = Boolean(myItemId && theirItemId);

  function draftingMessage(): string {
    if (!myItemId && !theirItemId) {
      return `Choose one of your items to offer and one of ${OTHER_TRADER.displayName}'s items you want in return.`;
    }
    if (!myItemId) return "Choose which of your items you're offering.";
    if (!theirItemId) return `Choose which of ${OTHER_TRADER.displayName}'s items you want in return.`;
    return `Ready to send. ${OTHER_TRADER.displayName} will be asked to accept this swap.`;
  }

  const bandMessage =
    phase === "drafting"
      ? draftingMessage()
      : phase === "awaitingReply"
      ? `Waiting for ${OTHER_TRADER.displayName} to respond. Only ${OTHER_TRADER.displayName} accepting or declining can move this forward — you can withdraw the proposal, but not accept it on their behalf.`
      : phase === "confirmWithdraw"
      ? `Withdraw this proposal? ${OTHER_TRADER.displayName} will no longer be able to accept it.`
      : `Proposal withdrawn. ${OTHER_TRADER.displayName} can no longer accept it.`;

  // Only the two states that were actually *reached by a transition* — the
  // proposal becoming pending, and the proposal being withdrawn — announce
  // as an alert. The drafting gate and the confirm prompt are read by the
  // same polite live region, just not flagged as the transition itself.
  const messageIsAlert = phase === "awaitingReply" || phase === "withdrawn";

  const primaryLabel =
    phase === "drafting"
      ? "Send Proposal"
      : phase === "awaitingReply"
      ? "Withdraw Proposal"
      : phase === "withdrawn"
      ? "Start New Proposal"
      : "";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text accessibilityRole="header" style={styles.title}>
          Propose an Item Swap
        </Text>
        <Text style={styles.subtitle}>
          Offer one of your listed items for one of {OTHER_TRADER.displayName}'s — item for item, no cash.
        </Text>

        <View style={styles.traderCard}>
          <Text style={styles.traderName}>{OTHER_TRADER.displayName}</Text>
          <Text style={styles.traderMeta}>
            {OTHER_TRADER.handle} · {OTHER_TRADER.itemsListed} items listed
          </Text>
        </View>

        <View
          onLayout={(e) => {
            mineOffsetY.current = e.nativeEvent.layout.y;
          }}
          style={[styles.section, nudgeTarget === "mine" && styles.sectionNudged]}
        >
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Your item to offer
          </Text>
          <FlatList
            data={MY_ITEMS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tileRow}
            renderItem={({ item, index }) => (
              <SwapItemTile
                item={item}
                index={index}
                selected={myItemId === item.id}
                disabled={phase !== "drafting"}
                labelPrefix="Offer"
                onPress={() => chooseMyItem(item.id)}
              />
            )}
          />
        </View>

        <View
          onLayout={(e) => {
            theirsOffsetY.current = e.nativeEvent.layout.y;
          }}
          style={[styles.section, nudgeTarget === "theirs" && styles.sectionNudged]}
        >
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            {OTHER_TRADER.displayName}'s item you want
          </Text>
          <FlatList
            data={THEIR_ITEMS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tileRow}
            renderItem={({ item, index }) => (
              <SwapItemTile
                item={item}
                index={index}
                selected={theirItemId === item.id}
                disabled={phase !== "drafting"}
                labelPrefix="Request"
                onPress={() => chooseTheirItem(item.id)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Note (optional)
          </Text>
          {phase === "drafting" ? (
            <>
              <TextInput
                value={note}
                onChangeText={(text) => setNote(text.slice(0, NOTE_MAX_LENGTH))}
                placeholder={`Add a short note for ${OTHER_TRADER.displayName}…`}
                placeholderTextColor={tokens.color.faint}
                multiline
                maxLength={NOTE_MAX_LENGTH}
                style={styles.noteInput}
                accessibilityLabel="Note to include with your swap proposal"
              />
              <Text style={styles.noteCounter}>
                {note.length}/{NOTE_MAX_LENGTH}
              </Text>
            </>
          ) : (
            <Text style={styles.noteReadout}>
              {note.trim().length > 0 ? note : "No note was added."}
            </Text>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Swap summary
          </Text>
          <Text style={styles.summaryLine}>
            You offer: {selectedMyItem ? selectedMyItem.title : "—"}
          </Text>
          <Text style={styles.summaryLine}>
            You want: {selectedTheirItem ? selectedTheirItem.title : "—"}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text
          style={styles.bandMessage}
          accessibilityRole={messageIsAlert ? "alert" : undefined}
        >
          {bandMessage}
        </Text>

        {phase === "confirmWithdraw" ? (
          <View style={styles.bandButtonRow}>
            <Pressable
              style={styles.bandButtonSecondary}
              accessibilityRole="button"
              accessibilityLabel="Keep waiting, do not withdraw the proposal"
              onPress={() => setPhase("awaitingReply")}
            >
              <Text style={styles.bandButtonSecondaryText}>Keep Waiting</Text>
            </Pressable>
            <Pressable
              style={styles.bandButtonDanger}
              accessibilityRole="button"
              accessibilityLabel={`Confirm withdrawing the proposal to ${OTHER_TRADER.displayName}`}
              onPress={() => setPhase("withdrawn")}
            >
              <Text style={styles.bandButtonDangerText}>Withdraw</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[
              styles.bandButtonPrimary,
              phase === "drafting" && !bothChosen && styles.bandButtonPrimaryMuted,
              phase === "awaitingReply" && styles.bandButtonOutlineDanger,
            ]}
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            onPress={handlePrimaryBandPress}
          >
            <Text
              style={[
                styles.bandButtonPrimaryText,
                phase === "awaitingReply" && styles.bandButtonOutlineDangerText,
              ]}
            >
              {primaryLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function SwapItemTile({
  item,
  index,
  selected,
  disabled,
  labelPrefix,
  onPress,
}: {
  item: TradeItem;
  index: number;
  selected: boolean;
  disabled: boolean;
  labelPrefix: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${labelPrefix} ${item.title}. ${item.category}, condition ${item.condition}. Estimated value ${formatWon(
        item.estValueWon
      )}.${selected ? " Selected." : ""}`}
      style={[styles.tile, selected && styles.tileSelected, disabled && !selected && styles.tileDisabled]}
    >
      <View style={[styles.tileSwatch, styles[SWATCH_STYLE_KEY[swatchForIndex(index)]]]}>
        <Text style={styles.tileSwatchLetter}>{item.category.charAt(0)}</Text>
      </View>
      <Text style={styles.tileTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.tileMeta}>
        {item.category} · {item.condition}
      </Text>
      <Text style={styles.tileValue}>{formatWon(item.estValueWon)}</Text>
      {selected && <Text style={styles.tileSelectedLabel}>Selected</Text>}
    </Pressable>
  );
}

const TILE_WIDTH = 168;

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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
    lineHeight: 20,
  },
  traderCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    marginBottom: tokens.space(5),
    backgroundColor: tokens.color.bg,
  },
  traderName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  traderMeta: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: tokens.space(5),
    borderRadius: tokens.radius.md,
    padding: tokens.space(2),
  },
  sectionNudged: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
    marginLeft: tokens.space(1),
  },
  tileRow: {
    paddingHorizontal: tokens.space(1),
    gap: tokens.space(3),
  },
  tile: {
    width: TILE_WIDTH,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  tileSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    backgroundColor: tokens.color.accentBg,
  },
  tileDisabled: {
    opacity: 0.5,
  },
  tileSwatch: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.space(2),
  },
  tileSwatch1: {
    backgroundColor: tokens.color.swatch1,
  },
  tileSwatch2: {
    backgroundColor: tokens.color.swatch2,
  },
  tileSwatch3: {
    backgroundColor: tokens.color.swatch3,
  },
  tileSwatchLetter: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: 2,
  },
  tileMeta: {
    fontSize: 11,
    color: tokens.color.muted,
    marginBottom: tokens.space(1),
  },
  tileValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  tileSelectedLabel: {
    marginTop: tokens.space(1),
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  noteInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
    textAlignVertical: "top",
  },
  noteCounter: {
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "right",
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  noteReadout: {
    fontSize: 14,
    color: tokens.color.ink2,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    lineHeight: 20,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  summaryLine: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandMessage: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
    marginBottom: tokens.space(3),
  },
  bandButtonPrimary: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  bandButtonPrimaryMuted: {
    opacity: 0.55,
  },
  bandButtonPrimaryText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  bandButtonOutlineDanger: {
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
  },
  bandButtonOutlineDangerText: {
    color: tokens.color.danger,
  },
  bandButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  bandButtonSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
    backgroundColor: tokens.color.bg,
  },
  bandButtonSecondaryText: {
    color: tokens.color.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  bandButtonDanger: {
    flex: 1,
    backgroundColor: tokens.color.danger,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  bandButtonDangerText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
});
