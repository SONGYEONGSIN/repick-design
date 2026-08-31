// native/src/evolve/r16/a/OfferComparisonScreen.tsx
// Offer Comparison — a seller reviewing multiple simultaneous buyer offers on
// one listing, sorting them, and accepting exactly one (which implicitly
// declines the rest). Not a chat — see offer-thread for the 1:1 negotiation
// screen this is deliberately not duplicating.

import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { LISTING, OFFERS, formatWon, type Offer } from "./data";

type Stage = "browsing" | "confirming" | "resolved";
type SortMode = "recent" | "price";

function sortOffers(offers: Offer[], mode: SortMode): Offer[] {
  const copy = [...offers];
  if (mode === "price") {
    copy.sort((a, b) => b.priceWon - a.priceWon);
  } else {
    copy.sort((a, b) => a.minutesAgo - b.minutesAgo);
  }
  return copy;
}

function priceComparisonLabel(priceWon: number, askingWon: number): string {
  if (priceWon > askingWon) return "Above asking";
  if (priceWon < askingWon) return "Below asking";
  return "At asking";
}

export function OfferComparisonScreen() {
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [stage, setStage] = useState<Stage>("browsing");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const sorted = sortOffers(OFFERS, sortMode);
  const acceptedOffer = OFFERS.find((o) => o.id === acceptedId) ?? null;

  function handleSort(mode: SortMode) {
    if (stage === "resolved") return;
    setSortMode(mode);
  }

  function beginAccept(offerId: string) {
    if (stage !== "browsing") return;
    setConfirmingId(offerId);
    setStage("confirming");
  }

  function cancelAccept() {
    setConfirmingId(null);
    setStage("browsing");
  }

  function confirmAccept(offerId: string) {
    setAcceptedId(offerId);
    setConfirmingId(null);
    setStage("resolved");
  }

  function renderOffer({ item }: { item: Offer }) {
    const isConfirmingThis = stage === "confirming" && confirmingId === item.id;
    const isAccepted = stage === "resolved" && acceptedId === item.id;
    const isDeclined = stage === "resolved" && acceptedId !== item.id;
    const acceptDisabled = stage !== "browsing";

    return (
      <View
        style={[
          styles.card,
          isAccepted && styles.cardAccepted,
          isDeclined && styles.cardDeclined,
        ]}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.buyerInitial}</Text>
          </View>
          <View style={styles.cardIdentity}>
            <Text style={styles.buyerName}>{item.buyerName}</Text>
            <Text style={styles.offerTime}>{item.relativeTime}</Text>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.offerPrice}>{formatWon(item.priceWon)}</Text>
            <Text style={styles.priceCompare}>
              {priceComparisonLabel(item.priceWon, LISTING.askingPriceWon)}
            </Text>
          </View>
        </View>

        <Text style={styles.noteText}>"{item.note}"</Text>

        {isConfirmingThis && (
          <View style={styles.confirmBox} accessibilityLiveRegion="polite">
            <Text style={styles.confirmText} accessibilityRole="alert">
              Accept {item.buyerName}'s offer of {formatWon(item.priceWon)}?
              The other {OFFERS.length - 1} offers will be automatically
              declined. This can't be undone.
            </Text>
            <View style={styles.confirmButtonRow}>
              <Pressable
                onPress={cancelAccept}
                accessibilityRole="button"
                accessibilityLabel="Cancel accepting this offer"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={({ pressed }) => [
                  styles.confirmButton,
                  styles.confirmButtonOutline,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.confirmButtonOutlineText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => confirmAccept(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Confirm accepting ${item.buyerName}'s offer of ${formatWon(item.priceWon)}`}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={({ pressed }) => [
                  styles.confirmButton,
                  styles.confirmButtonSolid,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.confirmButtonSolidText}>
                  Confirm accept
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {!isConfirmingThis && stage !== "resolved" && (
          <Pressable
            onPress={() => beginAccept(item.id)}
            disabled={acceptDisabled}
            accessibilityRole="button"
            accessibilityLabel={`Accept ${item.buyerName}'s offer of ${formatWon(item.priceWon)}`}
            accessibilityHint="Requires confirmation before finalizing."
            accessibilityState={{ disabled: acceptDisabled }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              styles.acceptButton,
              acceptDisabled && styles.acceptButtonDisabled,
              pressed && !acceptDisabled && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.acceptButtonText,
                acceptDisabled && styles.acceptButtonTextDisabled,
              ]}
            >
              Accept offer
            </Text>
          </Pressable>
        )}

        {isAccepted && (
          <View style={[styles.statusPill, styles.statusPillAccepted]}>
            <Text style={styles.statusPillTextAccepted}>✓ Accepted</Text>
          </View>
        )}
        {isDeclined && (
          <View style={[styles.statusPill, styles.statusPillDeclined]}>
            <Text style={styles.statusPillTextDeclined}>– Declined</Text>
          </View>
        )}
      </View>
    );
  }

  const header = (
    <View>
      <Text style={styles.heading} accessibilityRole="header">
        Compare offers
      </Text>
      <Text style={styles.subheading}>
        Review every offer on this listing side by side, then accept one.
      </Text>

      <View style={styles.listingCard}>
        <View style={styles.listingPhoto}>
          <Text style={styles.listingPhotoText}>{LISTING.photoInitial}</Text>
        </View>
        <View style={styles.listingInfo}>
          <Text style={styles.listingTitle} numberOfLines={2}>
            {LISTING.title}
          </Text>
          <Text style={styles.listingCondition}>{LISTING.conditionLabel}</Text>
          <Text style={styles.listingAsking}>
            Asking {formatWon(LISTING.askingPriceWon)}
          </Text>
        </View>
      </View>

      {stage === "resolved" && acceptedOffer && (
        <View style={styles.resolvedBanner} accessibilityLiveRegion="polite">
          <Text style={styles.resolvedBannerText} accessibilityRole="alert">
            Accepted {acceptedOffer.buyerName}'s offer for{" "}
            {formatWon(acceptedOffer.priceWon)}. The other{" "}
            {OFFERS.length - 1} offers have been declined.
          </Text>
        </View>
      )}

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <View style={styles.sortChips}>
          <Pressable
            onPress={() => handleSort("recent")}
            disabled={stage === "resolved"}
            accessibilityRole="button"
            accessibilityLabel="Sort offers by most recent"
            accessibilityState={{
              selected: sortMode === "recent",
              disabled: stage === "resolved",
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={({ pressed }) => [
              styles.sortChip,
              sortMode === "recent" && styles.sortChipSelected,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                sortMode === "recent" && styles.sortChipTextSelected,
              ]}
            >
              Most recent
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSort("price")}
            disabled={stage === "resolved"}
            accessibilityRole="button"
            accessibilityLabel="Sort offers by highest price first"
            accessibilityState={{
              selected: sortMode === "price",
              disabled: stage === "resolved",
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={({ pressed }) => [
              styles.sortChip,
              sortMode === "price" && styles.sortChipSelected,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                sortMode === "price" && styles.sortChipTextSelected,
              ]}
            >
              Highest price
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        {OFFERS.length} offers received
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(10),
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 20,
  },
  listingCard: {
    flexDirection: "row",
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: tokens.space(4),
  },
  listingPhoto: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  listingPhotoText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  listingInfo: { flex: 1, gap: tokens.space(1) },
  listingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  listingCondition: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  listingAsking: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  resolvedBanner: {
    marginTop: tokens.space(5),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
  },
  resolvedBannerText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
    lineHeight: 19,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(7),
    gap: tokens.space(3),
  },
  sortLabel: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  sortChips: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  sortChip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sortChipSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    paddingHorizontal: tokens.space(3) - 1,
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sortChipTextSelected: {
    color: tokens.color.accent,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(3),
  },
  separator: { height: tokens.space(3) },
  card: {
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    gap: tokens.space(3),
  },
  cardAccepted: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
    padding: tokens.space(4) - 1,
  },
  cardDeclined: {
    opacity: 0.55,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  cardIdentity: { flex: 1, gap: tokens.space(1) },
  buyerName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  offerTime: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  priceBlock: { alignItems: "flex-end", gap: tokens.space(1) },
  offerPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  priceCompare: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  noteText: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 19,
    fontStyle: "italic",
  },
  acceptButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonDisabled: {
    borderColor: tokens.color.border,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  acceptButtonTextDisabled: {
    color: tokens.color.faint,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  confirmBox: {
    padding: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    gap: tokens.space(3),
  },
  confirmText: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 19,
  },
  confirmButtonRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonOutline: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  confirmButtonOutlineText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  confirmButtonSolid: {
    backgroundColor: tokens.color.accent,
  },
  confirmButtonSolidText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  statusPillAccepted: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
  },
  statusPillTextAccepted: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  statusPillDeclined: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  statusPillTextDeclined: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
});

export default OfferComparisonScreen;
