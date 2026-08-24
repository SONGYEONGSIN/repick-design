// native/src/evolve/r13/c/SupportCenterScreen.tsx
//
// Support Center — search + a browsable, category-grouped FAQ accordion, with an
// always-available path to a human agent.
//
// Layering note (this round's delta): a bottom state-machine band exists to answer
// "why can't I proceed yet" and "where do I go next." This screen has no such blocked
// step — it's a read-only browse surface, the same layer as a completed-result screen.
// So there is no state-machine band here. The only persistent chrome is a thin action
// bar that is *always* the same single action ("start a chat with an agent"), never
// disabled by unmet conditions, never a gate — it exists purely so the escalate path is
// reachable without scrolling to the very end of a long FAQ list. Pressing it always
// produces a visible result (connecting -> connected), never a silent no-op.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import { FAQ_CATEGORIES } from "./data";

type ConnectState = "idle" | "connecting" | "connected";

const CONNECT_DELAY_MS = 900;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function SupportCenterScreen() {
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [connectState, setConnectState] = useState<ConnectState>("idle");
  const connectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (connectTimer.current) clearTimeout(connectTimer.current);
    };
  }, []);

  const normalizedQuery = normalize(query);

  const sections = useMemo(() => {
    if (!normalizedQuery) {
      return FAQ_CATEGORIES.map((category) => ({
        id: category.id,
        title: category.title,
        data: category.items,
      }));
    }
    return FAQ_CATEGORIES.map((category) => ({
      id: category.id,
      title: category.title,
      data: category.items.filter(
        (item) =>
          normalize(item.question).includes(normalizedQuery) ||
          normalize(item.answer).includes(normalizedQuery)
      ),
    })).filter((section) => section.data.length > 0);
  }, [normalizedQuery]);

  const totalResults = useMemo(
    () => sections.reduce((sum, section) => sum + section.data.length, 0),
    [sections]
  );

  const showEmptyState = normalizedQuery.length > 0 && sections.length === 0;

  function toggleItem(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function startChat() {
    if (connectState !== "idle") return;
    setConnectState("connecting");
    connectTimer.current = setTimeout(() => {
      setConnectState("connected");
    }, CONNECT_DELAY_MS);
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Support Center
        </Text>
        <Text style={styles.subtitle}>
          Search common answers below, or reach a real agent any time.
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search topics — e.g. refund, shipping, password"
          placeholderTextColor={tokens.color.faint}
          style={styles.searchInput}
          accessibilityLabel="Search support articles"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {normalizedQuery.length > 0 ? (
          <View style={styles.resultsRow} accessibilityLiveRegion="polite">
            <Text style={styles.resultsText}>
              {totalResults} {totalResults === 1 ? "result" : "results"} for
              {" "}
              &ldquo;{query.trim()}&rdquo;
            </Text>
          </View>
        ) : null}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => {
          const isOpen = !!expandedIds[item.id];
          return (
            <View style={styles.card}>
              <Pressable
                onPress={() => toggleItem(item.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={item.question}
                hitSlop={8}
                style={styles.cardHeader}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.disclosure}>{isOpen ? "−" : "+"}</Text>
              </Pressable>
              {isOpen ? <Text style={styles.answer}>{item.answer}</Text> : null}
            </View>
          );
        }}
        ListFooterComponent={
          sections.length > 0 ? (
            <View style={styles.inlineCta}>
              <Text style={styles.inlineCtaTitle}>Didn't find your answer?</Text>
              <Text style={styles.inlineCtaBody}>
                An agent can look into account- or order-specific questions the FAQ
                can't cover.
              </Text>
              <Pressable
                onPress={startChat}
                disabled={connectState !== "idle"}
                accessibilityRole="button"
                accessibilityLabel="Start a chat with a support agent"
                hitSlop={8}
                style={({ pressed }) => [
                  styles.inlineCtaButton,
                  pressed && connectState === "idle" && styles.inlineCtaButtonPressed,
                ]}
              >
                <Text style={styles.inlineCtaButtonText}>
                  {connectState === "idle" ? "Contact an agent" : "Request sent"}
                </Text>
              </Pressable>
            </View>
          ) : null
        }
        ListEmptyComponent={
          showEmptyState ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No matches for &ldquo;{query.trim()}&rdquo;
              </Text>
              <Text style={styles.emptyBody}>
                Try a shorter or different search term — or skip the FAQ and ask an
                agent directly, they can answer anything not covered here.
              </Text>
              <Pressable
                onPress={startChat}
                disabled={connectState !== "idle"}
                accessibilityRole="button"
                accessibilityLabel="Contact an agent"
                hitSlop={8}
                style={({ pressed }) => [
                  styles.emptyCta,
                  pressed && connectState === "idle" && styles.emptyCtaPressed,
                ]}
              >
                <Text style={styles.emptyCtaText}>
                  {connectState === "idle" ? "Contact an agent" : "Request sent"}
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />

      <View style={styles.actionBar}>
        {connectState === "connected" ? (
          <View style={styles.actionBarStatus} accessibilityLiveRegion="polite">
            <Text accessibilityRole="alert" style={styles.actionBarStatusText}>
              Connected — an agent will join your chat shortly.
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={startChat}
            disabled={connectState === "connecting"}
            accessibilityRole="button"
            accessibilityState={{ busy: connectState === "connecting" }}
            accessibilityLabel="Start a chat with a support agent"
            hitSlop={8}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && connectState === "idle" && styles.actionButtonPressed,
              connectState === "connecting" && styles.actionButtonBusy,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {connectState === "connecting"
                ? "Connecting to an agent…"
                : "Start a chat with an agent"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  searchInput: {
    marginTop: tokens.space(2),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  resultsRow: {
    paddingTop: tokens.space(1),
  },
  resultsText: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    gap: tokens.space(3),
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  disclosure: {
    fontSize: 18,
    fontWeight: "600",
    color: tokens.color.accent,
    width: 20,
    textAlign: "center",
  },
  answer: {
    fontSize: 14,
    color: tokens.color.ink2,
    lineHeight: 20,
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  inlineCta: {
    marginTop: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    padding: tokens.space(4),
    gap: tokens.space(1),
  },
  inlineCtaTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  inlineCtaBody: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
    marginBottom: tokens.space(2),
  },
  inlineCtaButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  inlineCtaButtonPressed: {
    backgroundColor: tokens.color.bg,
    opacity: 0.7,
  },
  inlineCtaButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  empty: {
    paddingTop: tokens.space(6),
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyBody: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: tokens.space(2),
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  emptyCtaPressed: {
    opacity: 0.85,
  },
  emptyCtaText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  actionButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonBusy: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  actionBarStatus: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBarStatusText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.accent,
    textAlign: "center",
  },
});
