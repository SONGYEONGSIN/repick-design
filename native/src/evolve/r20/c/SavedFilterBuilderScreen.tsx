// native/src/evolve/r20/c/SavedFilterBuilderScreen.tsx
//
// Concept: Saved Filter Builder — a multi-facet SEARCH-CRITERIA screen. The
// user assembles a category + price band + condition set + distance radius +
// sort preference, sees a live deterministic match-count preview as those
// facets change, names the combination, and can save it as a recurring alert.
//
// Band-form decision: NO fixed bottom band.
// This screen's gate is a single continuous threshold ("at least one facet is
// set"), not an itemized checklist of named blockers (verification/disputes/
// authentication/condition/pickup's blocked-workflow state machine), not a
// read-only completed record with an always-on action bar (certificate/
// storefront), and not a selection-count-driven contextual bar over a list of
// picked items (relist). Per GENERATION.md §3, absent a state-machine-shaped
// gate, the correct move is to skip the fixed band entirely: the Save control
// lives inline at the bottom of the facet list itself, right where its own
// enabling condition is stated in the same sentence the user is looking at.
//
// Differentiation from the two named catalogued screens:
// - watchlist (WatchList): tracks items the user already selected/saved.
//   This screen never lists or holds individual items — it defines the
//   CRITERIA used to find items in the first place, upstream of any watchlist.
// - match (MatchList): a scrollable list of AI-generated match results.
//   This screen's result feedback is a single number + one tiny fixed sample
//   count ("new this week"), never a scrollable list of matched items — by
//   design, so it cannot be mistaken for a results feed.
//
// All style key names, copy and the live-region wiring below are original to
// this screen (no bandBlocked/bandReady/statusFor/jumpTo-style names reused).

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORIES,
  PRICE_BANDS,
  RADIUS_OPTIONS,
  CONDITIONS,
  SORT_OPTIONS,
  getMatchPreview,
  type FacetOption,
} from "./data";

export default function SavedFilterBuilderScreen() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priceBandId, setPriceBandId] = useState<string>("any");
  const [radiusId, setRadiusId] = useState<string>("any");
  const [conditionIds, setConditionIds] = useState<string[]>([]);
  const [sortId, setSortId] = useState<string>("newest");
  const [filterName, setFilterName] = useState<string>("");
  const [notifyEnabled, setNotifyEnabled] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const activeFacetCount =
    (categoryId ? 1 : 0) +
    (priceBandId !== "any" ? 1 : 0) +
    (radiusId !== "any" ? 1 : 0) +
    (conditionIds.length > 0 ? 1 : 0);

  const canSave = activeFacetCount >= 1;

  const preview = useMemo(
    () => getMatchPreview(categoryId, priceBandId, radiusId, conditionIds.length),
    [categoryId, priceBandId, radiusId, conditionIds.length],
  );

  function toggleCondition(id: string) {
    setSavedMessage(null);
    setConditionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function selectCategory(id: string) {
    setSavedMessage(null);
    setCategoryId((prev) => (prev === id ? null : id));
  }

  function handleSave() {
    if (!canSave) return;
    const label = filterName.trim().length > 0 ? filterName.trim() : "Untitled search";
    setSavedMessage(
      notifyEnabled
        ? `Saved "${label}". You'll be notified when new items match.`
        : `Saved "${label}". Run it anytime from your saved searches.`,
    );
  }

  const thresholdText = canSave
    ? `Ready to save — ${activeFacetCount} filter${activeFacetCount === 1 ? "" : "s"} applied.`
    : "Set at least one filter below to enable saving.";

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Build a Saved Search
        </Text>
        <Text style={styles.subtitle}>
          Combine filters below. The estimate updates as you go — save it to get notified later.
        </Text>

        {/* Live estimate panel */}
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Estimated matches</Text>
          <Text style={styles.previewCount}>{formatCount(preview.count)}</Text>
          {preview.newSample > 0 && (
            <Text style={styles.previewSample}>
              +{preview.newSample} new this week
            </Text>
          )}
        </View>

        {/* Category */}
        <FacetSection label="Category">
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chipRowScroll}
            renderItem={({ item }) => (
              <Chip
                option={item}
                selected={categoryId === item.id}
                onPress={() => selectCategory(item.id)}
              />
            )}
          />
        </FacetSection>

        {/* Price range */}
        <FacetSection label="Price range">
          <View style={styles.chipWrap}>
            {PRICE_BANDS.map((band) => (
              <Chip
                key={band.id}
                option={band}
                selected={priceBandId === band.id}
                onPress={() => {
                  setSavedMessage(null);
                  setPriceBandId(band.id);
                }}
              />
            ))}
          </View>
        </FacetSection>

        {/* Condition (multi-select) */}
        <FacetSection label="Condition" hint="Select any number">
          <View style={styles.chipWrap}>
            {CONDITIONS.map((cond) => (
              <Chip
                key={cond.id}
                option={cond}
                selected={conditionIds.includes(cond.id)}
                onPress={() => toggleCondition(cond.id)}
                multi
              />
            ))}
          </View>
        </FacetSection>

        {/* Distance radius */}
        <FacetSection label="Distance">
          <View style={styles.chipWrap}>
            {RADIUS_OPTIONS.map((radius) => (
              <Chip
                key={radius.id}
                option={radius}
                selected={radiusId === radius.id}
                onPress={() => {
                  setSavedMessage(null);
                  setRadiusId(radius.id);
                }}
              />
            ))}
          </View>
        </FacetSection>

        {/* Sort preference — does not affect the count, only result order */}
        <FacetSection label="Sort results by">
          <View style={styles.chipWrap}>
            {SORT_OPTIONS.map((sort) => (
              <Chip
                key={sort.id}
                option={sort}
                selected={sortId === sort.id}
                onPress={() => setSortId(sort.id)}
              />
            ))}
          </View>
        </FacetSection>

        {/* Name + notify */}
        <FacetSection label="Name this search">
          <TextInput
            value={filterName}
            onChangeText={setFilterName}
            placeholder="e.g. Weekend leather bag hunt"
            placeholderTextColor={tokens.color.faint}
            style={styles.nameInput}
            accessibilityLabel="Name this saved search"
          />
        </FacetSection>

        <View style={styles.notifyRow}>
          <View style={styles.notifyTextBlock}>
            <Text style={styles.notifyTitle}>Notify me of new matches</Text>
            <Text style={styles.notifyHint}>
              Save this as a recurring alert instead of a one-time search.
            </Text>
          </View>
          <Switch
            value={notifyEnabled}
            onValueChange={setNotifyEnabled}
            trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
            thumbColor={tokens.color.onAccent}
            accessibilityLabel="Notify me of new matches"
            accessibilityRole="switch"
          />
        </View>

        {/* Actionability threshold — the one live region on this screen */}
        <View accessibilityLiveRegion="polite" style={styles.thresholdBlock}>
          <Text accessibilityRole="alert" style={canSave ? styles.thresholdReady : styles.thresholdBlocked}>
            {thresholdText}
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Save search"
          accessibilityState={{ disabled: !canSave }}
          style={({ pressed }) => [
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
            pressed && canSave && styles.saveButtonPressed,
          ]}
        >
          <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
            {notifyEnabled ? "Save as Alert" : "Save Search"}
          </Text>
        </Pressable>

        {savedMessage && <Text style={styles.savedConfirmation}>{savedMessage}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

function FacetSection({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>{label}</Text>
        {hint && <Text style={styles.sectionHint}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

function Chip({
  option,
  selected,
  onPress,
  multi,
}: {
  option: FacetOption;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {selected && <Text style={styles.chipMark}>{multi ? "✓" : "•"}</Text>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {option.label}
      </Text>
    </Pressable>
  );
}

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(10),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  previewCard: {
    marginTop: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingVertical: tokens.space(4),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  previewCount: {
    marginTop: tokens.space(1),
    fontSize: 34,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  previewSample: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  section: {
    marginTop: tokens.space(6),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: tokens.space(2),
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  sectionHint: {
    fontSize: 11,
    color: tokens.color.faint,
  },
  chipRowScroll: {
    paddingRight: tokens.space(2),
    gap: tokens.space(2),
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  chipSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipMark: {
    color: tokens.color.onAccent,
    marginRight: tokens.space(1),
    fontSize: 12,
    fontWeight: "700",
  },
  chipText: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: tokens.color.onAccent,
    fontWeight: "700",
  },
  nameInput: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    fontSize: 14,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  notifyRow: {
    marginTop: tokens.space(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(4),
    gap: tokens.space(3),
  },
  notifyTextBlock: {
    flex: 1,
  },
  notifyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  notifyHint: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.muted,
    lineHeight: 16,
  },
  thresholdBlock: {
    marginTop: tokens.space(5),
  },
  thresholdBlocked: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  thresholdReady: {
    fontSize: 13,
    color: tokens.color.accent,
    fontWeight: "700",
  },
  saveButton: {
    marginTop: tokens.space(3),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonDisabled: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  saveButtonTextDisabled: {
    color: tokens.color.faint,
  },
  savedConfirmation: {
    marginTop: tokens.space(3),
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
  },
});
