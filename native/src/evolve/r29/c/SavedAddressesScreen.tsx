// native/src/evolve/r29/c/SavedAddressesScreen.tsx — auto-native-r29 candidate c
//
// Saved Addresses: a buyer's list of shipping destinations on file. Every interesting
// bit of state lives inside a single row — which address is the default, whether a row
// is mid-removal-confirmation, whether a row is locked by an in-flight order — so there
// is no screen-level band of any kind: no sticky footer, no selection dock, nothing
// pinned beneath the list. Band form (GENERATION.md §3): "no fixed chrome" is the
// legitimate reading here, because nothing on this screen gates or confirms at the
// screen level.
//
// Each row is a three-way state machine:
//   1. settled    — address text, plus either a "Set as Default" button or (if this row
//                   already IS default) a non-interactive "Default" pill — derived from
//                   state, never hardcoded to one row.
//   2. confirming — pressing "Remove" on an eligible row swaps that row's own action
//                   strip for an inline Keep/Remove pair. No native Alert. The swapped
//                   block carries accessibilityLiveRegion="polite" and the prompt text
//                   itself carries accessibilityRole="alert" — the visible sentence and
//                   the announced sentence are the exact same string (removalPromptText
//                   in data.ts), never a paraphrase split across two copies.
//   3. locked     — an address referenced by an order already in transit can't reach the
//                   confirming state at all: Remove is rendered disabled and a specific,
//                   deterministic reason ("Used by order #RP-4821 — in transit") sits
//                   inline under the row.
//
// Only one row id is ever tracked as confirming (a single nullable id, not a set), so by
// construction at most one row's live-region/alert pair can be open at a time — no two
// rows ever announce in parallel. "Set as Default" is wired separately from removal: it
// is non-destructive and always reachable on a non-default row, and reassigning it for
// real flips the previous default row's pill back into a button.
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  SEED_ADDRESSES,
  addressCountLabel,
  lockedReasonText,
  removalPromptText,
  removedNoticeText,
  defaultNoticeText,
  type SavedAddress,
} from "./data";

const GENEROUS_HIT = { top: 10, bottom: 10, left: 10, right: 10 };

function LocationGlyph() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M12 2.5c-4.14 0-7.5 3.3-7.5 7.37 0 5.5 6.46 11.08 6.74 11.31a1.2 1.2 0 0 0 1.52 0c.28-.23 6.74-5.81 6.74-11.31C19.5 5.8 16.14 2.5 12 2.5z"
        fill={tokens.color.ink2}
      />
      <Circle cx="12" cy="9.8" r="2.4" fill={tokens.color.bg} />
    </Svg>
  );
}

function CheckGlyph({ tint }: { tint: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path
        d="M4.5 12.5l5 5 10-11"
        stroke={tint}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function CautionGlyph({ tint }: { tint: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9.5" stroke={tint} strokeWidth={2} fill="none" />
      <Path d="M12 7.5v6" stroke={tint} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="16.8" r="1.15" fill={tint} />
    </Svg>
  );
}

type AddressRowProps = {
  address: SavedAddress;
  isConfirming: boolean;
  onStartRemove: (id: string) => void;
  onKeep: (id: string) => void;
  onRemove: (id: string) => void;
  onPromote: (id: string) => void;
};

function AddressRow({
  address,
  isConfirming,
  onStartRemove,
  onKeep,
  onRemove,
  onPromote,
}: AddressRowProps) {
  const lockNote = address.lockedByOrderId
    ? lockedReasonText(address.lockedByOrderId)
    : null;
  const canRemove = lockNote === null;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeadRow}>
        <View style={styles.pinWrap}>
          <LocationGlyph />
        </View>
        <View style={styles.addressInfo}>
          <Text style={styles.addressLabel} numberOfLines={1}>
            {address.label}
          </Text>
          <Text style={styles.addressLine}>{address.recipientName}</Text>
          <Text style={styles.addressLine}>{address.line1}</Text>
          {address.line2 ? (
            <Text style={styles.addressLine}>{address.line2}</Text>
          ) : null}
          <Text style={styles.addressLine}>{address.cityStateZip}</Text>
        </View>
        {address.isDefault ? (
          <View style={styles.defaultPill}>
            <CheckGlyph tint={tokens.color.accent} />
            <Text style={styles.defaultPillText}>Default</Text>
          </View>
        ) : null}
      </View>

      {isConfirming ? (
        <View style={styles.confirmBlock} accessibilityLiveRegion="polite">
          <Text style={styles.confirmText} accessibilityRole="alert">
            {removalPromptText(address)}
          </Text>
          <View style={styles.confirmButtons}>
            <Pressable
              onPress={() => onKeep(address.id)}
              hitSlop={GENEROUS_HIT}
              accessibilityRole="button"
              accessibilityLabel={`Keep ${address.label}`}
              accessibilityHint="Closes this confirmation and keeps the address"
              style={({ pressed }) => [
                styles.keepBtn,
                pressed && styles.pressedFade,
              ]}
            >
              <Text style={styles.keepBtnText}>Keep</Text>
            </Pressable>
            <Pressable
              onPress={() => onRemove(address.id)}
              hitSlop={GENEROUS_HIT}
              accessibilityRole="button"
              accessibilityLabel={`Confirm removing ${address.label}`}
              accessibilityHint="Permanently deletes this address"
              style={({ pressed }) => [
                styles.dropBtn,
                pressed && styles.pressedFade,
              ]}
            >
              <Text style={styles.dropBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.rowButtons}>
          {address.isDefault ? (
            <View style={styles.spacerBox} />
          ) : (
            <Pressable
              onPress={() => onPromote(address.id)}
              accessibilityRole="button"
              accessibilityLabel={`Set ${address.label} as default address`}
              accessibilityHint="Makes this the default address used at checkout"
              style={({ pressed }) => [
                styles.defaultActionBtn,
                pressed && styles.pressedFade,
              ]}
            >
              <Text style={styles.defaultActionText}>Set as Default</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => canRemove && onStartRemove(address.id)}
            disabled={!canRemove}
            hitSlop={GENEROUS_HIT}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canRemove }}
            accessibilityLabel={
              canRemove
                ? `Remove ${address.label}`
                : `Remove unavailable for ${address.label}. ${lockNote}`
            }
            accessibilityHint={
              canRemove ? "Opens a confirmation before deleting this address" : undefined
            }
            style={({ pressed }) => [
              styles.removeActionBtn,
              !canRemove && styles.removeActionBtnOff,
              pressed && canRemove && styles.pressedFade,
            ]}
          >
            <Text
              style={[
                styles.removeActionText,
                !canRemove && styles.removeActionTextOff,
              ]}
            >
              Remove
            </Text>
          </Pressable>
        </View>
      )}

      {lockNote && !isConfirming ? (
        <View style={styles.lockedNote}>
          <CautionGlyph tint={tokens.color.warning} />
          <Text style={styles.lockedNoteText}>{lockNote}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function SavedAddressesScreen() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(SEED_ADDRESSES);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [noticeText, setNoticeText] = useState<string>("");

  const defaultAddress = addresses.find((a) => a.isDefault) ?? null;

  const startRemove = (id: string) => {
    setNoticeText("");
    setConfirmingId(id);
  };

  const keepRow = (id: string) => {
    if (confirmingId === id) {
      setConfirmingId(null);
    }
  };

  const removeRow = (id: string) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      // If the address that just left was the default and others remain,
      // the first remaining address becomes default — real reassignment,
      // never a screen left with zero default addresses.
      if (target.isDefault && next.length > 0 && !next.some((a) => a.isDefault)) {
        return next.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
      }
      return next;
    });
    setConfirmingId(null);
    setNoticeText(removedNoticeText(target));
  };

  const promoteRow = (id: string) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    setNoticeText(defaultNoticeText(target));
  };

  const header = (
    <View style={styles.headRegion}>
      <Text style={styles.pageTitle} accessibilityRole="header">
        Saved Addresses
      </Text>
      <Text style={styles.pageSubtitle}>
        {addressCountLabel(addresses.length)}
        {defaultAddress ? ` · ${defaultAddress.label} is default` : ""}
      </Text>
      <View style={styles.statusRegion} accessibilityLiveRegion="polite">
        {noticeText ? (
          <Text style={styles.statusLine} accessibilityRole="alert">
            {noticeText}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AddressRow
            address={item}
            isConfirming={confirmingId === item.id}
            onStartRemove={startRemove}
            onKeep={keepRow}
            onRemove={removeRow}
            onPromote={promoteRow}
          />
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.bodyPad}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default SavedAddressesScreen;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  bodyPad: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(10),
  },

  headRegion: {
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(2),
  },
  pageTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: tokens.color.ink,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  statusRegion: { marginTop: tokens.space(2) },
  statusLine: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginTop: tokens.space(3),
  },
  cardHeadRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  pinWrap: {
    width: tokens.space(9),
    height: tokens.space(9),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: { flex: 1, gap: tokens.space(1) },
  addressLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  addressLine: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  defaultPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
    alignSelf: "flex-start",
    backgroundColor: tokens.color.accentBg,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  defaultPillText: {
    color: tokens.color.accent,
    fontSize: 11,
    fontWeight: "700",
  },

  rowButtons: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  spacerBox: { flex: 1 },
  defaultActionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  defaultActionText: {
    color: tokens.color.ink2,
    fontSize: 13,
    fontWeight: "700",
  },
  removeActionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  removeActionBtnOff: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  removeActionText: {
    color: tokens.color.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  removeActionTextOff: { color: tokens.color.muted },

  lockedNote: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(1),
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(2),
  },
  lockedNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.warning,
    lineHeight: 16,
  },

  confirmBlock: {
    marginTop: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.dangerBorder,
    paddingTop: tokens.space(3),
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
    lineHeight: 18,
  },
  confirmButtons: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    gap: tokens.space(2),
  },
  keepBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  keepBtnText: {
    color: tokens.color.ink2,
    fontSize: 14,
    fontWeight: "700",
  },
  dropBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  dropBtnText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },

  pressedFade: { opacity: 0.8 },
});
