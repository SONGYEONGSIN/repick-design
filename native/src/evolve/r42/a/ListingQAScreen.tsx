// native/src/evolve/r42/a/ListingQAScreen.tsx
//
// Buyer-facing public Q&A thread for a single listing. A compact fixed
// item-context header (thumbnail + name + price, non-interactive) sits
// above a scrolling FlatList of question/answer entries, each with a
// deterministic relative timestamp and a toggleable upvote count on the
// question. The bottom band is an always-mounted composer bar — not a
// derived blocked/ready workflow band — because this screen has no
// step-gating flow: it is always ready to accept a new public question.
// The composer's send button is still a real, derived signal: enabled
// only when the input holds non-whitespace text, recomputed every
// render rather than hand-flipped.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { listingContext, qaEntries, QAEntry } from "./data";

type UpvoteState = Record<string, { count: number; active: boolean }>;

function buildInitialUpvotes(entries: QAEntry[]): UpvoteState {
  const state: UpvoteState = {};
  for (const entry of entries) {
    state[entry.id] = { count: entry.upvotes, active: false };
  }
  return state;
}

export default function ListingQAScreen() {
  const [upvotes, setUpvotes] = useState<UpvoteState>(() =>
    buildInitialUpvotes(qaEntries)
  );
  const [draft, setDraft] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmationTimer.current) {
        clearTimeout(confirmationTimer.current);
      }
    };
  }, []);

  const canPost = useMemo(() => draft.trim().length > 0, [draft]);

  const toggleUpvote = useCallback((id: string) => {
    setUpvotes((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const nextActive = !current.active;
      return {
        ...prev,
        [id]: {
          active: nextActive,
          count: nextActive ? current.count + 1 : current.count - 1,
        },
      };
    });
  }, []);

  const handlePost = useCallback(() => {
    if (!draft.trim()) return;
    setDraft("");
    setConfirmation("Question posted. Sellers and other buyers can now answer.");
    if (confirmationTimer.current) {
      clearTimeout(confirmationTimer.current);
    }
    confirmationTimer.current = setTimeout(() => {
      setConfirmation("");
    }, 4000);
  }, [draft]);

  const renderItem = useCallback(
    ({ item }: { item: QAEntry }) => {
      const upvoteInfo = upvotes[item.id];
      const isActive = upvoteInfo?.active ?? false;
      const count = upvoteInfo?.count ?? item.upvotes;

      return (
        <View style={styles.entryCard}>
          <View style={styles.questionRow}>
            <View style={styles.questionTextCol}>
              <Text style={styles.questionText}>{item.question}</Text>
              <Text style={styles.metaText}>
                {item.askerName} · {item.askedAgo}
              </Text>
            </View>
            <Pressable
              onPress={() => toggleUpvote(item.id)}
              accessibilityRole="button"
              accessibilityLabel={
                isActive
                  ? `Remove upvote from question: ${item.question}. Currently ${count} upvotes.`
                  : `Upvote question: ${item.question}. Currently ${count} upvotes.`
              }
              style={({ pressed }) => [
                styles.upvoteButton,
                isActive && styles.upvoteButtonActive,
                pressed && styles.upvoteButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.upvoteArrow,
                  isActive && styles.upvoteArrowActive,
                ]}
              >
                ▲
              </Text>
              <Text
                style={[
                  styles.upvoteCount,
                  isActive && styles.upvoteCountActive,
                ]}
              >
                {count}
              </Text>
            </Pressable>
          </View>

          {item.answer ? (
            <View style={styles.answerBlock}>
              <View style={styles.answerRail} />
              <View style={styles.answerBody}>
                <Text style={styles.answerText}>{item.answer.text}</Text>
                <Text style={styles.metaText}>
                  {item.answer.responderName}
                  {item.answer.responderRole === "seller" ? " · Seller" : " · Buyer"}
                  {" · "}
                  {item.answer.answeredAgo}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.unansweredBlock}>
              <Text style={styles.unansweredText}>No answer yet</Text>
            </View>
          )}
        </View>
      );
    },
    [upvotes, toggleUpvote]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.itemHeader}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailText}>{listingContext.thumbnailLabel}</Text>
        </View>
        <View style={styles.itemHeaderText}>
          <Text style={styles.itemName} numberOfLines={1}>
            {listingContext.itemName}
          </Text>
          <Text style={styles.itemPrice}>{listingContext.price}</Text>
        </View>
      </View>

      <Text accessibilityRole="header" style={styles.sectionHeading}>
        Questions &amp; Answers
      </Text>

      <FlatList
        data={qaEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View
        accessibilityLiveRegion="polite"
        style={styles.liveRegionContainer}
      >
        {confirmation ? (
          <Text accessibilityRole="alert" style={styles.confirmationText}>
            {confirmation}
          </Text>
        ) : null}
      </View>

      <View style={styles.composerBand}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask the seller a question about this item"
          placeholderTextColor={tokens.color.faint}
          style={styles.composerInput}
          multiline
          accessibilityLabel="Compose a public question about this listing"
        />
        <Pressable
          onPress={handlePost}
          disabled={!canPost}
          accessibilityRole="button"
          accessibilityLabel="Post question"
          accessibilityState={{ disabled: !canPost }}
          style={({ pressed }) => [
            styles.postButton,
            !canPost && styles.postButtonDisabled,
            canPost && pressed && styles.postButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.postButtonText,
              !canPost && styles.postButtonTextDisabled,
            ]}
          >
            Post Question
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  thumbnail: {
    width: tokens.space(10),
    height: tokens.space(10),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accentBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  thumbnailText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  itemHeaderText: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemPrice: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1) / 2,
    fontVariant: ["tabular-nums"],
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  separator: {
    height: tokens.space(3),
  },
  entryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  questionTextCol: {
    flex: 1,
    marginRight: tokens.space(3),
  },
  questionText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  metaText: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  upvoteButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: tokens.space(11),
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  upvoteButtonActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  upvoteButtonPressed: {
    opacity: 0.7,
  },
  upvoteArrow: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  upvoteArrowActive: {
    color: tokens.color.accent,
  },
  upvoteCount: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    marginTop: tokens.space(1) / 2,
    fontVariant: ["tabular-nums"],
  },
  upvoteCountActive: {
    color: tokens.color.accent,
  },
  answerBlock: {
    flexDirection: "row",
    marginTop: tokens.space(3),
  },
  answerRail: {
    width: 2,
    marginRight: tokens.space(3),
    backgroundColor: tokens.color.border,
    borderRadius: 1,
  },
  answerBody: {
    flex: 1,
  },
  answerText: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 19,
  },
  unansweredBlock: {
    marginTop: tokens.space(3),
  },
  unansweredText: {
    fontSize: 12,
    color: tokens.color.faint,
    fontStyle: "italic",
  },
  liveRegionContainer: {
    paddingHorizontal: tokens.space(4),
    minHeight: tokens.space(2),
  },
  confirmationText: {
    fontSize: 12,
    color: tokens.color.success,
    paddingBottom: tokens.space(2),
  },
  composerBand: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  composerInput: {
    flex: 1,
    minHeight: tokens.space(10),
    maxHeight: tokens.space(24),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    fontSize: 14,
    color: tokens.color.ink,
    marginRight: tokens.space(3),
  },
  postButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  postButtonPressed: {
    opacity: 0.85,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  postButtonTextDisabled: {
    color: tokens.color.faint,
  },
});
