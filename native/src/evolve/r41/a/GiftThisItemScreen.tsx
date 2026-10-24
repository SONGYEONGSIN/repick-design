// native/src/evolve/r41/a/GiftThisItemScreen.tsx
//
// Buyer-side "Gift This Item" screen. A fixed item preview stays pinned
// above a scrolling recipient form (name, email, optional note with a
// character counter, and a single-select delivery method). The bottom
// band is a validity-derived gate — never a hand-set flag — that is
// mounted while the form is incomplete (telling you, in one sentence,
// what's still missing) and whose primary button only turns live, with
// the real item name and price in its own label, once every required
// field is satisfied. Sending swaps the scrollable form out for a local
// confirmation panel instead of faking a navigation anywhere; sending
// another gift is an ordinary inline button inside that panel, not a
// second fixed band, since nothing further needs gating once the first
// gift is done.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  giftableItem,
  deliveryMethodOptions,
  deliveryMethodLabelFor,
  formatUsd,
  joinWithAnd,
  GIFT_NOTE_MAX_CHARS,
  type DeliveryMethodKey,
  type DeliveryMethodOption,
} from "./data";

interface SentGiftRecord {
  recipientName: string;
  recipientEmail: string;
  deliveryMethodLabel: string;
}

function buildIncompleteSentence(
  nameIsFilled: boolean,
  emailIsFilled: boolean,
  methodIsChosen: boolean
): string {
  const missing: string[] = [];
  if (!nameIsFilled) missing.push("the recipient's name");
  if (!emailIsFilled) missing.push("their email");
  if (!methodIsChosen) missing.push("a delivery method");
  return `Fill in ${joinWithAnd(missing)} to continue.`;
}

export function GiftThisItemScreen() {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<DeliveryMethodKey | null>(null);
  const [sentGift, setSentGift] = useState<SentGiftRecord | null>(null);

  const recipientNameIsFilled = useMemo(
    () => recipientName.trim().length > 0,
    [recipientName]
  );
  const recipientEmailIsFilled = useMemo(
    () => recipientEmail.trim().length > 0,
    [recipientEmail]
  );
  const deliveryMethodIsChosen = selectedDeliveryMethod !== null;

  // The single source of truth for whether the gift can be sent —
  // recomputed from current form state every render, never toggled by
  // hand. The bottom band's enabled state and copy both read from this.
  const giftIsReadyToSend = useMemo(
    () =>
      recipientNameIsFilled && recipientEmailIsFilled && deliveryMethodIsChosen,
    [recipientNameIsFilled, recipientEmailIsFilled, deliveryMethodIsChosen]
  );

  const bandStatusSentence = useMemo(() => {
    if (giftIsReadyToSend) return "Ready to send.";
    return buildIncompleteSentence(
      recipientNameIsFilled,
      recipientEmailIsFilled,
      deliveryMethodIsChosen
    );
  }, [
    giftIsReadyToSend,
    recipientNameIsFilled,
    recipientEmailIsFilled,
    deliveryMethodIsChosen,
  ]);

  const sendButtonLabel = giftIsReadyToSend
    ? `Send Gift — ${giftableItem.name}, ${formatUsd(giftableItem.priceCents)}`
    : "Send Gift";

  const handleSelectDeliveryMethod = useCallback((key: DeliveryMethodKey) => {
    setSelectedDeliveryMethod(key);
  }, []);

  const handleSendGift = useCallback(() => {
    if (!giftIsReadyToSend || selectedDeliveryMethod === null) return;
    setSentGift({
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      deliveryMethodLabel: deliveryMethodLabelFor(selectedDeliveryMethod),
    });
  }, [giftIsReadyToSend, selectedDeliveryMethod, recipientName, recipientEmail]);

  const handleSendAnotherGift = useCallback(() => {
    setSentGift(null);
    setRecipientName("");
    setRecipientEmail("");
    setGiftNote("");
    setSelectedDeliveryMethod(null);
  }, []);

  const giftNoteCharsRemaining = GIFT_NOTE_MAX_CHARS - giftNote.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenRoot}>
        <Text accessibilityRole="header" style={styles.screenHeading}>
          Gift This Item
        </Text>

        <View style={styles.pinnedPreviewCard}>
          <View
            style={styles.previewThumbnail}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={styles.previewThumbnailLetter}>
              {giftableItem.thumbnailInitial}
            </Text>
          </View>
          <View style={styles.previewTextWrap}>
            <Text style={styles.previewItemName} numberOfLines={2}>
              {giftableItem.name}
            </Text>
            <Text style={styles.previewMetaLine}>
              {giftableItem.conditionLabel} · {giftableItem.categoryLabel}
            </Text>
            <Text style={styles.previewPrice}>
              {formatUsd(giftableItem.priceCents)}
            </Text>
          </View>
        </View>

        {sentGift ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <View
              style={styles.confirmationPanel}
              accessibilityLiveRegion="polite"
            >
              <View style={styles.confirmationBadgeCircle}>
                <Text style={styles.confirmationBadgeGlyph}>✓</Text>
              </View>
              <Text
                accessibilityRole="alert"
                style={styles.confirmationHeadline}
              >
                Your gift is on its way to {sentGift.recipientName}.
              </Text>
              <Text style={styles.confirmationSubline}>
                A note was sent to {sentGift.recipientEmail} letting them know
                a gift from you is coming.
              </Text>

              <View style={styles.confirmationSummaryBlock}>
                <View style={styles.confirmationSummaryRow}>
                  <Text style={styles.confirmationSummaryLabel}>Item</Text>
                  <Text style={styles.confirmationSummaryValue}>
                    {giftableItem.name}, {formatUsd(giftableItem.priceCents)}
                  </Text>
                </View>
                <View style={styles.confirmationSummaryRow}>
                  <Text style={styles.confirmationSummaryLabel}>
                    Delivery
                  </Text>
                  <Text style={styles.confirmationSummaryValue}>
                    {sentGift.deliveryMethodLabel}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleSendAnotherGift}
                accessibilityRole="button"
                accessibilityLabel="Send another gift"
                accessibilityHint="Clears this form so you can send this item as a gift to someone else."
                style={({ pressed }) => [
                  styles.sendAnotherButton,
                  pressed && styles.sendAnotherButtonPressed,
                ]}
              >
                <Text style={styles.sendAnotherButtonText}>
                  Send Another Gift
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        ) : (
          <>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionLabel}>Recipient</Text>

              <Text style={styles.fieldLabel}>Recipient name (required)</Text>
              <TextInput
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="e.g. Jordan Park"
                placeholderTextColor={tokens.color.faint}
                style={styles.textInput}
                autoCapitalize="words"
                accessibilityLabel="Recipient name"
                accessibilityHint="Required. The name of the person receiving this gift."
              />

              <Text style={styles.fieldLabel}>Recipient email (required)</Text>
              <TextInput
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                placeholder="e.g. jordan@example.com"
                placeholderTextColor={tokens.color.faint}
                style={styles.textInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="Recipient email"
                accessibilityHint="Required. We'll use this to notify them and, if you choose a digital gift card, to deliver it."
              />

              <Text style={styles.fieldLabel}>Gift note (optional)</Text>
              <TextInput
                value={giftNote}
                onChangeText={setGiftNote}
                placeholder="Add a short personal note they'll see with the gift"
                placeholderTextColor={tokens.color.faint}
                style={styles.noteInput}
                multiline
                textAlignVertical="top"
                maxLength={GIFT_NOTE_MAX_CHARS}
                accessibilityLabel="Gift note"
                accessibilityHint="Optional. A short personal message included with the gift."
              />
              <Text style={styles.charCounterText}>
                {giftNoteCharsRemaining} characters left
              </Text>

              <Text style={[styles.sectionLabel, styles.deliverySectionLabel]}>
                Delivery method (required)
              </Text>
              <FlatList
                data={deliveryMethodOptions}
                keyExtractor={(option) => option.key}
                // This list is always exactly 3 fixed rows, rendered inside the
                // screen's single outer ScrollView, which already owns all
                // scrolling for the form — scrollEnabled={false} is the
                // standard, documented pattern for a short, non-scrolling
                // FlatList nested inside a ScrollView (avoids the "nested
                // VirtualizedLists" conflict a second independently-scrolling
                // list would cause). GENERATION.md §1 requires FlatList over
                // .map() for lists; this was previously rendered via .map().
                scrollEnabled={false}
                contentContainerStyle={styles.deliveryOptionList}
                renderItem={({ item: option }: { item: DeliveryMethodOption }) => {
                  const isSelected = option.key === selectedDeliveryMethod;
                  return (
                    <Pressable
                      onPress={() => handleSelectDeliveryMethod(option.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={option.label}
                      accessibilityHint="Selects this as how the gift will be delivered."
                      style={({ pressed }) => [
                        styles.deliveryOptionRow,
                        isSelected && styles.deliveryOptionRowSelected,
                        pressed && styles.deliveryOptionRowPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <View style={styles.deliveryOptionTextWrap}>
                        <Text
                          style={[
                            styles.deliveryOptionLabel,
                            isSelected && styles.deliveryOptionLabelSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text style={styles.deliveryOptionHelper}>
                          {option.helperText}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </ScrollView>

            <View
              style={styles.sendBand}
              accessibilityLiveRegion="polite"
            >
              <Text accessibilityRole="alert" style={styles.sendBandSentence}>
                {bandStatusSentence}
              </Text>
              <Pressable
                onPress={handleSendGift}
                disabled={!giftIsReadyToSend}
                accessibilityRole="button"
                accessibilityState={{ disabled: !giftIsReadyToSend }}
                accessibilityLabel={sendButtonLabel}
                accessibilityHint={
                  giftIsReadyToSend
                    ? "Marks this gift as sent and shows a confirmation on this screen."
                    : undefined
                }
                style={({ pressed }) => [
                  styles.sendButton,
                  !giftIsReadyToSend && styles.sendButtonDisabled,
                  pressed && giftIsReadyToSend && styles.sendButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    !giftIsReadyToSend && styles.sendButtonTextDisabled,
                  ]}
                  numberOfLines={1}
                >
                  {sendButtonLabel}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const S = tokens.space;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screenHeading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: tokens.color.ink,
    paddingHorizontal: S(4),
    paddingTop: S(4),
    paddingBottom: S(2),
  },
  pinnedPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: S(4),
    marginBottom: S(3),
    padding: S(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
  },
  previewThumbnail: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch2,
    alignItems: "center",
    justifyContent: "center",
  },
  previewThumbnailLetter: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    color: tokens.color.onInk,
  },
  previewTextWrap: {
    flex: 1,
    marginLeft: S(3),
  },
  previewItemName: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  previewMetaLine: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    marginTop: 2,
  },
  previewPrice: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: tokens.color.accent,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: S(4),
    paddingBottom: S(6),
  },
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: S(2),
    marginBottom: S(3),
  },
  deliverySectionLabel: {
    marginTop: S(5),
  },
  fieldLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginBottom: S(2),
  },
  textInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: S(3),
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.ink,
    marginBottom: S(4),
  },
  noteInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: S(3),
    paddingVertical: S(2),
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.ink,
  },
  charCounterText: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
    textAlign: "right",
    marginTop: S(1),
    fontVariant: ["tabular-nums"],
  },
  deliveryOptionList: {
    gap: S(2),
  },
  deliveryOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 56,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: S(3),
    paddingHorizontal: S(3),
  },
  deliveryOptionRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  deliveryOptionRowPressed: {
    opacity: 0.85,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: S(3),
    marginTop: S(1),
  },
  radioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  deliveryOptionTextWrap: {
    flex: 1,
  },
  deliveryOptionLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  deliveryOptionLabelSelected: {
    color: tokens.color.ink,
  },
  deliveryOptionHelper: {
    marginTop: S(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  sendBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: S(4),
    paddingTop: S(4),
    paddingBottom: S(5),
  },
  sendBandSentence: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.ink2,
    marginBottom: S(3),
  },
  sendButton: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: S(4),
  },
  sendButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  sendButtonTextDisabled: {
    color: tokens.color.faint,
  },
  confirmationPanel: {
    alignItems: "center",
    paddingTop: S(6),
    paddingBottom: S(8),
  },
  confirmationBadgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: S(4),
  },
  confirmationBadgeGlyph: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    color: tokens.color.success,
  },
  confirmationHeadline: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "center",
    marginBottom: S(2),
  },
  confirmationSubline: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
    textAlign: "center",
    marginBottom: S(6),
    paddingHorizontal: S(4),
  },
  confirmationSummaryBlock: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: S(4),
    marginBottom: S(6),
    gap: S(3),
  },
  confirmationSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: S(3),
  },
  confirmationSummaryLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
  },
  confirmationSummaryValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sendAnotherButton: {
    minHeight: 52,
    minWidth: 220,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: S(4),
  },
  sendAnotherButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  sendAnotherButtonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
});

export default GiftThisItemScreen;
