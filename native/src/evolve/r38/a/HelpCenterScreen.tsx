// native/src/evolve/r38/a/HelpCenterScreen.tsx
//
// Help Center — a searchable FAQ screen. The macro-layout assignment for
// this round is "search-input-driven single list with per-item
// expand/collapse": a live text filter (re-computed from local state on
// every keystroke, combinable with a category row) drives which rows exist
// at all, and each surviving row is an accordion — tapping a question
// toggles its own answer rather than navigating anywhere. There is
// deliberately NO fixed bottom band: this is pure, non-destructive
// browsing, nothing here is blocked and nothing needs confirming.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Animated,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  faqEntries,
  faqCategoryFilters,
  faqCategoryLabels,
  type FaqEntry,
  type FaqCategoryFilterKey,
} from "./data";

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function matchesQuery(entry: FaqEntry, normalizedQuery: string): boolean {
  if (normalizedQuery === "") return true;
  if (entry.question.toLowerCase().includes(normalizedQuery)) return true;
  return entry.keywords.some((keyword) =>
    keyword.toLowerCase().includes(normalizedQuery)
  );
}

interface FaqRowProps {
  entry: FaqEntry;
  expanded: boolean;
  onToggle: (id: string) => void;
}

// Its own component (rather than inline in renderItem) so each row owns one
// Animated.Value for the chevron — the per-item expand/collapse state this
// round's macro-layout is centered on.
function FaqAccordionRow({ entry, expanded, onToggle }: FaqRowProps) {
  const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [expanded, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.faqCard}>
      <Pressable
        onPress={() => onToggle(entry.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={entry.question}
        accessibilityHint={
          expanded ? "Collapses this answer." : "Expands this answer."
        }
        style={({ pressed }) => [
          styles.faqQuestionRow,
          pressed && styles.faqQuestionRowPressed,
        ]}
      >
        <Text style={styles.faqQuestionText}>{entry.question}</Text>
        <Animated.Text
          style={[styles.faqChevron, { transform: [{ rotate }] }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {"⌄"}
        </Animated.Text>
      </Pressable>
      {expanded ? (
        <View style={styles.faqAnswerWrap}>
          <Text style={styles.faqAnswerText}>{entry.answer}</Text>
          <View style={styles.faqCategoryTag}>
            <Text style={styles.faqCategoryTagText}>
              {faqCategoryLabels[entry.category]}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function HelpCenterScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FaqCategoryFilterKey>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const normalizedQuery = useMemo(() => normalize(searchText), [searchText]);

  // The defining interaction for this screen: the list that actually
  // renders is recomputed from local text + category state on every
  // keystroke, not a static display filtered only by a status chip.
  const filteredEntries = useMemo(() => {
    return faqEntries.filter((entry) => {
      const inCategory =
        selectedCategory === "all" || entry.category === selectedCategory;
      return inCategory && matchesQuery(entry, normalizedQuery);
    });
  }, [selectedCategory, normalizedQuery]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const renderFaqRow = useCallback(
    ({ item }: { item: FaqEntry }) => (
      <FaqAccordionRow
        entry={item}
        expanded={expandedIds.has(item.id)}
        onToggle={toggleExpanded}
      />
    ),
    [expandedIds, toggleExpanded]
  );

  const resultCountLabel =
    filteredEntries.length === 1
      ? "1 matching question"
      : `${filteredEntries.length} matching questions`;

  const listHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Help Center
      </Text>
      <Text style={styles.headerSubtitle}>
        Search for a topic or browse by category. Tap a question to see the
        answer.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search help articles, e.g. refund"
          placeholderTextColor={tokens.color.faint}
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search help articles"
          accessibilityHint="Filters the question list below as you type."
        />
        {searchText.length > 0 ? (
          <Pressable
            onPress={() => setSearchText("")}
            accessibilityRole="button"
            accessibilityLabel="Clear search text"
            style={({ pressed }) => [
              styles.searchClearButton,
              pressed && styles.searchClearButtonPressed,
            ]}
          >
            <Text style={styles.searchClearButtonText}>{"✕"}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.categoryRow}>
        {faqCategoryFilters.map((filter) => {
          const isSelected = filter.key === selectedCategory;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedCategory(filter.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${filter.label} category`}
              style={({ pressed }) => [
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
                pressed && styles.categoryChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipLabel,
                  isSelected && styles.categoryChipLabelSelected,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.resultSummaryWrap} accessibilityLiveRegion="polite">
        <Text style={styles.resultSummaryText}>{resultCountLabel}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderFaqRow}
        extraData={expandedIds}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No matching questions. Try a different search term or
              category.
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
    marginBottom: tokens.space(4),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    fontSize: 16,
    lineHeight: 22,
    color: tokens.color.ink,
  },
  searchClearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.space(1),
  },
  searchClearButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  searchClearButtonText: {
    fontSize: 14,
    lineHeight: 18,
    color: tokens.color.faint,
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(3),
  },
  categoryChip: {
    minHeight: 36,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipSelected: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  categoryChipPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  categoryChipLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  categoryChipLabelSelected: {
    color: tokens.color.onInk,
  },
  resultSummaryWrap: {
    marginBottom: tokens.space(1),
  },
  resultSummaryText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  faqCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
  },
  faqQuestionRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
    marginRight: tokens.space(3),
  },
  faqChevron: {
    fontSize: 18,
    lineHeight: 18,
    color: tokens.color.muted,
    fontWeight: "700",
  },
  faqAnswerWrap: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    marginBottom: tokens.space(2),
  },
  faqCategoryTag: {
    alignSelf: "flex-start",
    minHeight: 24,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  faqCategoryTagText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    color: tokens.color.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  emptyState: {
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.faint,
    textAlign: "center",
    paddingHorizontal: tokens.space(6),
  },
});

export default HelpCenterScreen;
