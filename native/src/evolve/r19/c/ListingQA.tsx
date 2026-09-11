// native/src/evolve/r19/c/ListingQA.tsx — auto-native-r19 candidate c.
//
// Public Listing Q&A: a public question-and-answer board attached to one item listing, visible
// to every prospective buyer — not the private buyer↔seller negotiation channel that already
// exists in this catalog (see offer-thread/OfferThread.tsx). Anyone can read every question and
// every answer here, and most answers come from the seller but sometimes from another buyer who
// already owns the item (see the "Buyer" role tag below).
//
// There is no blocked/gated terminal action on this screen — asking a question is always
// available, there is no sequential workflow to finish — so per the bottom-band doctrine this
// is form (4): no fixed bottom band at all. The one place state actually changes meaningfully
// is the moment a question is posted: the compose box clears and an inline confirmation appears
// in the scroll flow. That transition is the screen's single accessibility live region — not a
// fixed band, just where the real change happens.
import { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  INITIAL_QUESTIONS,
  LISTING,
  answerRoleLabel,
  formatKrw,
  helpfulLabel,
  newQuestion,
  nextOrder,
  type QAQuestion,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const QUESTION_MAX_LEN = 300;

type SortMode = "helpful" | "newest";

/* ───────── listing summary — what this board is attached to ───────── */

function ListingHeader({ questionCount }: { questionCount: number }) {
  return (
    <View style={styles.listingCard}>
      <View style={styles.listingTopRow}>
        <View style={styles.thumb}>
          <Text style={styles.thumbGlyph}>{"◇"}</Text>
        </View>
        <View style={styles.listingInfo}>
          <Text style={styles.listingTitle}>{LISTING.title}</Text>
          <Text style={styles.listingMeta}>
            {LISTING.condition} · {formatKrw(LISTING.price)}
          </Text>
        </View>
      </View>
      <View style={styles.publicNote}>
        <View style={styles.publicDot} />
        <Text style={styles.publicNoteText}>
          Public Q&A · visible to every buyer viewing this listing — not a private message to
          the seller
        </Text>
      </View>
      <Text style={styles.countLine}>
        {questionCount} {questionCount === 1 ? "question" : "questions"} so far
      </Text>
    </View>
  );
}

/* ───────── compose box — always available, never blocked ───────── */

function ComposeSection({
  value,
  onChangeText,
  onFocus,
  onSubmit,
}: {
  value: string;
  onChangeText: (next: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
}) {
  const trimmed = value.trim();
  const disabled = trimmed.length === 0;
  return (
    <View style={styles.compose}>
      <Text style={styles.composeHeading} accessibilityRole="header">
        Ask a Question
      </Text>
      <Text style={styles.composeSub}>
        Your question and the answer will be visible to anyone viewing this listing.
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder="e.g. Does this include the original box?"
        placeholderTextColor={tokens.color.faint}
        multiline
        maxLength={QUESTION_MAX_LEN}
        accessibilityLabel="Your question for the seller"
        style={styles.input}
      />
      <View style={styles.composeFooter}>
        <Text style={styles.counter}>
          {trimmed.length}/{QUESTION_MAX_LEN}
        </Text>
        <Pressable
          onPress={onSubmit}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Post your question"
          accessibilityState={{ disabled }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.postBtn,
            disabled && styles.postBtnDisabled,
            pressed && !disabled && styles.pressed,
          ]}
        >
          <Text style={[styles.postBtnText, disabled && styles.postBtnTextDisabled]}>
            Post Question
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── inline post confirmation — the screen's one live region ───────── */

function PostConfirmation({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={styles.confirm} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.confirmText}>
        Your question was posted. It's visible to everyone on this listing — the seller usually
        replies within a day.
      </Text>
      <Pressable
        onPress={onDismiss}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Dismiss this confirmation"
        style={styles.confirmDismiss}
      >
        <Text style={styles.confirmDismissText}>{"✕"}</Text>
      </Pressable>
    </View>
  );
}

/* ───────── sort control ───────── */

function SortTabs({ mode, onChange }: { mode: SortMode; onChange: (next: SortMode) => void }) {
  const options: { key: SortMode; label: string }[] = [
    { key: "helpful", label: "Most helpful" },
    { key: "newest", label: "Newest" },
  ];
  return (
    <View
      style={styles.sortGroup}
      accessibilityRole="radiogroup"
      accessibilityLabel="Sort questions"
    >
      {options.map((opt) => {
        const selected = opt.key === mode;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={opt.label}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.sortOption,
              selected && styles.sortOptionOn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.sortLabel, selected && styles.sortLabelOn]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────── helpful vote toggle ───────── */

function HelpfulButton({
  question,
  onToggle,
}: {
  question: QAQuestion;
  onToggle: (id: string) => void;
}) {
  const on = question.viewerMarkedHelpful;
  const label = on
    ? `Marked helpful. ${helpfulLabel(question.helpfulCount)}. Tap to remove your mark.`
    : `Mark as helpful. ${helpfulLabel(question.helpfulCount)}.`;
  return (
    <Pressable
      onPress={() => onToggle(question.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.helpfulBtn, on && styles.helpfulBtnOn, pressed && styles.pressed]}
    >
      <Text style={styles.helpfulGlyph}>{"▲"}</Text>
      <Text style={[styles.helpfulText, on && styles.helpfulTextOn]}>Helpful</Text>
      <Text style={[styles.helpfulCount, on && styles.helpfulTextOn]}>
        {question.helpfulCount}
      </Text>
    </Pressable>
  );
}

/* ───────── one question + its answer (or lack of one) ───────── */

function QuestionCard({
  question,
  onToggleHelpful,
}: {
  question: QAQuestion;
  onToggleHelpful: (id: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.qMeta}>
        {question.askerName} · {question.askedLabel}
      </Text>
      <Text style={styles.qText}>{question.text}</Text>

      {question.answer ? (
        <View style={styles.answerBlock}>
          <View style={styles.answerHead}>
            <View
              style={[
                styles.roleTag,
                question.answer.role === "seller" ? styles.roleTagSeller : styles.roleTagBuyer,
              ]}
            >
              <Text
                style={[
                  styles.roleTagText,
                  question.answer.role === "seller"
                    ? styles.roleTagTextSeller
                    : styles.roleTagTextBuyer,
                ]}
              >
                {answerRoleLabel(question.answer.role)}
              </Text>
            </View>
            <Text style={styles.answerMeta}>
              {question.answer.authorName} · {question.answer.answeredLabel}
            </Text>
          </View>
          <Text style={styles.answerText}>{question.answer.text}</Text>
        </View>
      ) : (
        <View style={styles.answerBlock}>
          <Text style={styles.pendingText}>Awaiting an answer from the seller</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <HelpfulButton question={question} onToggle={onToggleHelpful} />
      </View>
    </View>
  );
}

/* ───────── screen ───────── */

export function ListingQAScreen() {
  const [questions, setQuestions] = useState<QAQuestion[]>(INITIAL_QUESTIONS);
  const [composeText, setComposeText] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("helpful");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const newIdCounter = useRef(0);

  // Any interaction other than the compose flow settles a standing confirmation — it's a
  // one-shot notice, not something that should linger across unrelated actions.
  const dismissConfirmation = () => {
    if (confirmationVisible) setConfirmationVisible(false);
  };

  const handleComposeChange = (next: string) => {
    dismissConfirmation();
    setComposeText(next);
  };

  const handlePost = () => {
    const trimmed = composeText.trim();
    if (trimmed.length === 0) return;
    newIdCounter.current += 1;
    const id = `q-new-${newIdCounter.current}`;
    const created = newQuestion(id, trimmed, nextOrder(questions));
    setQuestions((prev) => [created, ...prev]);
    setComposeText("");
    setConfirmationVisible(true);
  };

  const handleSortChange = (next: SortMode) => {
    dismissConfirmation();
    setSortMode(next);
  };

  const handleToggleHelpful = (id: string) => {
    dismissConfirmation();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              viewerMarkedHelpful: !q.viewerMarkedHelpful,
              helpfulCount: q.viewerMarkedHelpful ? q.helpfulCount - 1 : q.helpfulCount + 1,
            }
          : q
      )
    );
  };

  const sortedQuestions = useMemo(() => {
    const copy = [...questions];
    if (sortMode === "newest") {
      copy.sort((a, b) => b.order - a.order);
    } else {
      copy.sort((a, b) => b.helpfulCount - a.helpfulCount || b.order - a.order);
    }
    return copy;
  }, [questions, sortMode]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList<QAQuestion>
        data={sortedQuestions}
        keyExtractor={(q) => q.id}
        ListHeaderComponent={
          <View>
            <ListingHeader questionCount={questions.length} />
            <ComposeSection
              value={composeText}
              onChangeText={handleComposeChange}
              onFocus={dismissConfirmation}
              onSubmit={handlePost}
            />
            {confirmationVisible ? (
              <PostConfirmation onDismiss={() => setConfirmationVisible(false)} />
            ) : null}
            <View style={styles.listHead}>
              <Text style={styles.listHeading} accessibilityRole="header">
                Questions & Answers
              </Text>
              <SortTabs mode={sortMode} onChange={handleSortChange} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <QuestionCard question={item} onToggleHelpful={handleToggleHelpful} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

export default ListingQAScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(10) },

  /* listing summary card */
  listingCard: {
    marginTop: tokens.space(6),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(3),
  },
  listingTopRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  thumbGlyph: { fontSize: 20, color: tokens.color.faint },
  listingInfo: { flex: 1, gap: 2 },
  listingTitle: { fontSize: 17, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.2 },
  listingMeta: { fontSize: 13, color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  publicNote: { flexDirection: "row", alignItems: "flex-start", gap: tokens.space(2) },
  publicDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.accent,
    marginTop: 5,
  },
  publicNoteText: { flex: 1, fontSize: 12, color: tokens.color.faint, lineHeight: 17 },
  countLine: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2 },

  /* compose */
  compose: {
    marginTop: tokens.space(5),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(2),
  },
  composeHeading: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  composeSub: { fontSize: 12, color: tokens.color.faint, lineHeight: 17 },
  input: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    fontSize: 14,
    color: tokens.color.ink,
    textAlignVertical: "top",
  },
  composeFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counter: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },
  postBtn: {
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  postBtnDisabled: { backgroundColor: tokens.color.border },
  postBtnText: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },
  postBtnTextDisabled: { color: tokens.color.faint },

  /* confirmation — single live region on this screen */
  confirm: {
    marginTop: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  confirmText: { flex: 1, fontSize: 13, color: tokens.color.ink2, lineHeight: 18 },
  confirmDismiss: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  confirmDismissText: { fontSize: 14, color: tokens.color.faint },

  /* list head + sort */
  listHead: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.space(2),
  },
  listHeading: { fontSize: 17, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.2 },
  sortGroup: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: 2,
    gap: 2,
  },
  sortOption: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
  },
  sortOptionOn: { backgroundColor: tokens.color.accent },
  sortLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.muted },
  sortLabelOn: { color: tokens.color.onAccent },

  /* question card */
  card: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  qMeta: { fontSize: 11, color: tokens.color.faint },
  qText: { fontSize: 14, fontWeight: "600", color: tokens.color.ink, lineHeight: 20 },

  answerBlock: {
    marginTop: tokens.space(1),
    paddingLeft: tokens.space(4),
    borderLeftWidth: 2,
    borderLeftColor: tokens.color.border,
    gap: 4,
  },
  answerHead: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  roleTag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
  },
  roleTagSeller: { backgroundColor: tokens.color.accent },
  roleTagBuyer: { backgroundColor: tokens.color.bg, borderWidth: 1, borderColor: tokens.color.border },
  roleTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3, textTransform: "uppercase" },
  roleTagTextSeller: { color: tokens.color.onAccent },
  roleTagTextBuyer: { color: tokens.color.muted },
  answerMeta: { fontSize: 11, color: tokens.color.faint },
  answerText: { fontSize: 13, color: tokens.color.ink2, lineHeight: 19 },
  pendingText: { fontSize: 13, color: tokens.color.faint, fontStyle: "italic" },

  cardFooter: {
    marginTop: tokens.space(1),
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    flexDirection: "row",
  },
  helpfulBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  helpfulBtnOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  helpfulGlyph: { fontSize: 10, color: tokens.color.muted },
  helpfulText: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  helpfulCount: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  helpfulTextOn: { color: tokens.color.onAccent },

  pressed: { opacity: 0.85 },
});
