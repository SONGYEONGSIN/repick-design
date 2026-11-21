// native/src/evolve/r48/a/StorefrontProfileScreen.tsx
// Storefront Profile Editor — settings-form screen for a seller to edit their
// public storefront presentation (name, bio, cover swatch, pinned-listing
// order, availability badge). Dirty state is derived structurally every
// render by diffing `draft` against `savedSnapshot`; the bottom save band is
// only ever mounted when that diff is non-empty (or a save confirmation is
// still showing), never hidden with opacity/display tricks.

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
// Note: FlatList is this DNA's prescribed list primitive, but every list on this
// screen (3 cover swatches, 3 featured listings) is a small fixed-size set with
// no virtualization need, so plain `.map()` is used per the documented exception.
import { tokens } from "../../../tokens";
import {
  BIO_CHARACTER_LIMIT,
  COVER_SWATCH_OPTIONS,
  FEATURED_LISTING_CATALOG,
  PUBLISHED_STOREFRONT_PROFILE,
  type AvailabilityState,
  type CoverSwatchKey,
  type StorefrontDraft,
} from "./data";

const CONFIRMATION_VISIBLE_MS = 2500;

/** Deterministic cover-swatch cycle used for the three featured-listing chips. */
const FEATURED_CHIP_SWATCH_CYCLE: CoverSwatchKey[] = ["swatch1", "swatch2", "swatch3"];

/** Structural equality check between two drafts — recomputed every render, never a hand-flipped flag. */
function storefrontDraftsMatch(left: StorefrontDraft, right: StorefrontDraft): boolean {
  if (
    left.displayName !== right.displayName ||
    left.bioText !== right.bioText ||
    left.coverSwatchKey !== right.coverSwatchKey ||
    left.availabilityState !== right.availabilityState
  ) {
    return false;
  }
  if (left.featuredOrderIds.length !== right.featuredOrderIds.length) {
    return false;
  }
  return left.featuredOrderIds.every((id, index) => id === right.featuredOrderIds[index]);
}

function swatchToneStyle(key: CoverSwatchKey) {
  switch (key) {
    case "swatch1":
      return styles.toneOne;
    case "swatch2":
      return styles.toneTwo;
    case "swatch3":
    default:
      return styles.toneThree;
  }
}

export default function StorefrontProfileScreen() {
  const [draft, setDraft] = useState<StorefrontDraft>(PUBLISHED_STOREFRONT_PROFILE);
  const [savedSnapshot, setSavedSnapshot] = useState<StorefrontDraft>(PUBLISHED_STOREFRONT_PROFILE);
  const [isConfirmationShowing, setIsConfirmationShowing] = useState(false);

  // Derived, not stored: recomputed from scratch on every render.
  const hasUnsavedChanges = !storefrontDraftsMatch(draft, savedSnapshot);
  const canCommitChanges = draft.displayName.trim().length > 0 && hasUnsavedChanges;
  const shouldRenderSaveBand = hasUnsavedChanges || isConfirmationShowing;
  const saveBandMessageText = hasUnsavedChanges
    ? "You have unsaved storefront changes."
    : isConfirmationShowing
      ? "Storefront changes saved."
      : "";

  useEffect(() => {
    if (!isConfirmationShowing) {
      return;
    }
    const confirmationTimer = setTimeout(() => {
      setIsConfirmationShowing(false);
    }, CONFIRMATION_VISIBLE_MS);
    return () => clearTimeout(confirmationTimer);
  }, [isConfirmationShowing]);

  const handleDisplayNameEdit = useCallback((text: string) => {
    setDraft((previous) => ({ ...previous, displayName: text }));
  }, []);

  const handleBioTextEdit = useCallback((text: string) => {
    setDraft((previous) => ({ ...previous, bioText: text.slice(0, BIO_CHARACTER_LIMIT) }));
  }, []);

  const handleCoverSwatchPick = useCallback((key: CoverSwatchKey) => {
    setDraft((previous) => ({ ...previous, coverSwatchKey: key }));
  }, []);

  const handleAvailabilityPick = useCallback((state: AvailabilityState) => {
    setDraft((previous) => ({ ...previous, availabilityState: state }));
  }, []);

  const handleReorderFeaturedListing = useCallback((position: number, delta: number) => {
    setDraft((previous) => {
      const targetIndex = position + delta;
      if (targetIndex < 0 || targetIndex >= previous.featuredOrderIds.length) {
        return previous;
      }
      const nextOrder = [...previous.featuredOrderIds];
      const swapTemp = nextOrder[position];
      nextOrder[position] = nextOrder[targetIndex];
      nextOrder[targetIndex] = swapTemp;
      return { ...previous, featuredOrderIds: nextOrder };
    });
  }, []);

  const handleCommitChanges = useCallback(() => {
    setSavedSnapshot(draft);
    setIsConfirmationShowing(true);
  }, [draft]);

  const bioRemainingCount = BIO_CHARACTER_LIMIT - draft.bioText.length;

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenHeading} accessibilityRole="header">
          Storefront profile
        </Text>
        <Text style={styles.screenSubheading}>
          Control how buyers see your storefront before they open a listing.
        </Text>

        {/* Live preview — mirrors `draft`, so it updates as fields below change. */}
        <View style={styles.previewCard}>
          <View style={[styles.previewCoverBand, swatchToneStyle(draft.coverSwatchKey)]} />
          <View style={styles.previewBody}>
            <Text style={styles.previewNameText} numberOfLines={1}>
              {draft.displayName.trim().length > 0 ? draft.displayName : "Unnamed seller"}
            </Text>
            <Text style={styles.previewBioText} numberOfLines={2}>
              {draft.bioText.trim().length > 0 ? draft.bioText : "No bio written yet."}
            </Text>
            <View style={styles.previewStatusRow}>
              <View
                style={[
                  styles.previewStatusDot,
                  draft.availabilityState === "online" ? styles.previewStatusDotOnline : styles.previewStatusDotAway,
                ]}
              />
              <Text style={styles.previewStatusText}>
                {draft.availabilityState === "online" ? "Shown as online" : "Shown as away"}
              </Text>
            </View>
          </View>
        </View>

        {/* Identity */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading} accessibilityRole="header">
            Display identity
          </Text>

          <Text style={styles.fieldLabel}>Display name</Text>
          <TextInput
            value={draft.displayName}
            onChangeText={handleDisplayNameEdit}
            placeholder="e.g. Marlowe & Co. Vintage"
            placeholderTextColor={tokens.color.faint}
            style={styles.textField}
            accessibilityLabel="Storefront display name"
          />

          <Text style={styles.fieldLabel}>Short bio</Text>
          <TextInput
            value={draft.bioText}
            onChangeText={handleBioTextEdit}
            placeholder="Tell buyers what your storefront is about"
            placeholderTextColor={tokens.color.faint}
            style={[styles.textField, styles.textFieldMultiline]}
            multiline
            maxLength={BIO_CHARACTER_LIMIT}
            accessibilityLabel="Storefront short bio"
          />
          <Text style={styles.charCounterText}>
            {bioRemainingCount} character{bioRemainingCount === 1 ? "" : "s"} remaining
          </Text>
        </View>

        {/* Cover image swatch */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading} accessibilityRole="header">
            Cover image
          </Text>
          <Text style={styles.sectionHint}>Pick a placeholder tone for your storefront cover.</Text>
          <View style={styles.swatchRow}>
            {COVER_SWATCH_OPTIONS.map((option) => {
              const isPicked = draft.coverSwatchKey === option.key;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => handleCoverSwatchPick(option.key)}
                  style={({ pressed }) => [
                    styles.swatchTile,
                    swatchToneStyle(option.key),
                    isPicked && styles.swatchTilePicked,
                    pressed && styles.swatchTilePressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.label} cover${isPicked ? ", selected" : ""}`}
                >
                  {isPicked ? <Text style={styles.swatchPickedGlyph}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Featured listing order — fixed-size (≤3) set, plain map is fine, no FlatList needed. */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading} accessibilityRole="header">
            Featured listings order
          </Text>
          <Text style={styles.sectionHint}>
            Reorder up to three pinned listings shown at the top of your storefront.
          </Text>
          {draft.featuredOrderIds.map((listingId, position) => {
            const listing = FEATURED_LISTING_CATALOG.find((item) => item.id === listingId);
            if (!listing) {
              return null;
            }
            const isFirst = position === 0;
            const isLast = position === draft.featuredOrderIds.length - 1;
            return (
              <View key={listingId} style={styles.featuredRow}>
                <View
                  style={[
                    styles.featuredChip,
                    swatchToneStyle(FEATURED_CHIP_SWATCH_CYCLE[position % FEATURED_CHIP_SWATCH_CYCLE.length]),
                  ]}
                />
                <View style={styles.featuredTextBlock}>
                  <Text style={styles.featuredTitleText} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.featuredPriceText}>{listing.priceLabel}</Text>
                </View>
                <View style={styles.featuredOrderControls}>
                  <Pressable
                    onPress={() => handleReorderFeaturedListing(position, -1)}
                    disabled={isFirst}
                    style={[styles.orderStepButton, isFirst && styles.orderStepButtonDisabled]}
                    accessibilityRole="button"
                    accessibilityLabel={`Move ${listing.title} earlier in the featured order`}
                  >
                    <Text style={[styles.orderStepGlyph, isFirst && styles.orderStepGlyphDisabled]}>↑</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleReorderFeaturedListing(position, 1)}
                    disabled={isLast}
                    style={[styles.orderStepButton, isLast && styles.orderStepButtonDisabled]}
                    accessibilityRole="button"
                    accessibilityLabel={`Move ${listing.title} later in the featured order`}
                  >
                    <Text style={[styles.orderStepGlyph, isLast && styles.orderStepGlyphDisabled]}>↓</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Availability */}
        <View style={styles.formSection}>
          <Text style={styles.sectionHeading} accessibilityRole="header">
            Availability
          </Text>
          <Text style={styles.sectionHint}>Choose how your status badge appears to buyers right now.</Text>
          <View style={styles.availabilityRow}>
            <Pressable
              onPress={() => handleAvailabilityPick("online")}
              style={[
                styles.availabilityOption,
                draft.availabilityState === "online" && styles.availabilityOptionActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Show storefront as online"
            >
              <Text
                style={[
                  styles.availabilityOptionText,
                  draft.availabilityState === "online" && styles.availabilityOptionTextActive,
                ]}
              >
                Online
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleAvailabilityPick("away")}
              style={[
                styles.availabilityOption,
                draft.availabilityState === "away" && styles.availabilityOptionActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Show storefront as away"
            >
              <Text
                style={[
                  styles.availabilityOptionText,
                  draft.availabilityState === "away" && styles.availabilityOptionTextActive,
                ]}
              >
                Away
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.scrollBottomSpacer} />
      </ScrollView>

      {shouldRenderSaveBand ? (
        <View style={styles.saveBandRoot}>
          <View style={styles.saveBandLiveRegion} accessibilityLiveRegion="polite">
            <Text style={styles.saveBandMessageText} accessibilityRole="alert">
              {saveBandMessageText}
            </Text>
          </View>
          {hasUnsavedChanges ? (
            <Pressable
              onPress={handleCommitChanges}
              disabled={!canCommitChanges}
              style={[styles.saveBandButton, !canCommitChanges && styles.saveBandButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Save storefront changes"
            >
              <Text style={styles.saveBandButtonText}>Save changes</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  screenHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  screenSubheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(5),
  },

  previewCard: {
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
    marginBottom: tokens.space(6),
    backgroundColor: tokens.color.bg,
  },
  previewCoverBand: {
    height: tokens.space(10),
    width: "100%",
  },
  previewBody: {
    padding: tokens.space(4),
  },
  previewNameText: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  previewBioText: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  previewStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(3),
  },
  previewStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: tokens.space(2),
  },
  previewStatusDotOnline: {
    backgroundColor: tokens.color.success,
  },
  previewStatusDotAway: {
    backgroundColor: tokens.color.faint,
  },
  previewStatusText: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  formSection: {
    marginBottom: tokens.space(7),
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  sectionHint: {
    fontSize: 12,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    marginTop: tokens.space(3),
    marginBottom: tokens.space(1),
  },
  textField: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  textFieldMultiline: {
    minHeight: tokens.space(20),
    textAlignVertical: "top",
  },
  charCounterText: {
    marginTop: tokens.space(1),
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "right",
  },

  swatchRow: {
    flexDirection: "row",
  },
  swatchTile: {
    width: tokens.space(14),
    height: tokens.space(14),
    borderRadius: tokens.radius.md,
    marginRight: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchTilePicked: {
    borderColor: tokens.color.accent,
  },
  swatchTilePressed: {
    opacity: 0.85,
  },
  swatchPickedGlyph: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.onInk,
  },

  featuredRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  featuredChip: {
    width: tokens.space(10),
    height: tokens.space(10),
    borderRadius: tokens.radius.sm,
  },
  featuredTextBlock: {
    flex: 1,
    marginLeft: tokens.space(3),
  },
  featuredTitleText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  featuredPriceText: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  featuredOrderControls: {
    flexDirection: "row",
  },
  orderStepButton: {
    width: tokens.space(8),
    height: tokens.space(8),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.space(2),
  },
  orderStepButtonDisabled: {
    opacity: 0.35,
  },
  orderStepGlyph: {
    fontSize: 14,
    color: tokens.color.ink2,
  },
  orderStepGlyphDisabled: {
    color: tokens.color.faint,
  },

  availabilityRow: {
    flexDirection: "row",
  },
  availabilityOption: {
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginRight: tokens.space(3),
  },
  availabilityOptionActive: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  availabilityOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  availabilityOptionTextActive: {
    color: tokens.color.accent,
  },

  scrollBottomSpacer: {
    height: tokens.space(20),
  },

  toneOne: {
    backgroundColor: tokens.color.swatch1,
  },
  toneTwo: {
    backgroundColor: tokens.color.swatch2,
  },
  toneThree: {
    backgroundColor: tokens.color.swatch3,
  },

  saveBandRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  saveBandLiveRegion: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  saveBandMessageText: {
    fontSize: 13,
    color: tokens.color.ink2,
  },
  saveBandButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(5),
  },
  saveBandButtonDisabled: {
    opacity: 0.5,
  },
  saveBandButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
