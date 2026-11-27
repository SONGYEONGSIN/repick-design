import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { TREE, ROOT_ID, TreeNode, QuestionNode, TerminalNode, Tone } from "./data";

type Answers = Record<string, string>;

interface PathStep {
  node: TreeNode;
  chosenOptionId?: string;
}

/**
 * Walks the branching tree from the root using the given answers.
 * Recomputed fresh every call (and every render) so that reversing an
 * earlier answer always re-derives the live path instead of relying on
 * any cached/memoized "current step" flag.
 */
function computePath(answers: Answers): PathStep[] {
  const path: PathStep[] = [];
  let currentId: string = ROOT_ID;
  // The tree is finite and acyclic; this bound just guards against a
  // malformed data.ts edit from ever infinite-looping the UI.
  for (let i = 0; i < 50; i++) {
    const node = TREE[currentId];
    const step: PathStep = { node };
    path.push(step);
    if (node.type === "terminal") break;
    const chosen = answers[node.id];
    if (!chosen) break;
    const option = node.options.find((o) => o.id === chosen);
    if (!option) break;
    step.chosenOptionId = chosen;
    currentId = option.next;
  }
  return path;
}

function toneColors(tone: Tone) {
  switch (tone) {
    case "success":
      return { fg: tokens.color.success, bg: tokens.color.successBg, border: tokens.color.successBorder };
    case "warning":
      return { fg: tokens.color.warning, bg: tokens.color.warningBg, border: tokens.color.warningBorder };
    case "danger":
      return { fg: tokens.color.danger, bg: tokens.color.dangerBg, border: tokens.color.dangerBorder };
    case "info":
    default:
      return { fg: tokens.color.accent, bg: tokens.color.accentBg, border: tokens.color.border };
  }
}

type BandKind = "none" | "blocked" | "action" | "submitted" | "restart";

/** Single derived value — never two independent flags that could both be true. */
function getBandKind(current: TreeNode, submittedFor: string | null): BandKind {
  if (current.type !== "terminal") return "none";
  if (submittedFor === current.id) return "submitted";
  if (current.blocked) return "blocked";
  if (current.primaryActionKind === "restart") return "restart";
  return "action";
}

export default function DeliveryProblemResolverScreen() {
  const [answers, setAnswers] = useState<Answers>({});
  const [submittedFor, setSubmittedFor] = useState<string | null>(null);

  const path = computePath(answers);
  const current = path[path.length - 1].node;
  const answeredSteps = path.filter((s) => s.chosenOptionId);
  const canGoBack = answeredSteps.length > 0;

  function goBack() {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].chosenOptionId) {
        const idToClear = path[i].node.id;
        setAnswers((prev) => {
          const next = { ...prev };
          delete next[idToClear];
          return next;
        });
        setSubmittedFor(null);
        return;
      }
    }
  }

  function choose(question: QuestionNode, optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    setSubmittedFor(null);
  }

  function restart() {
    setAnswers({});
    setSubmittedFor(null);
  }

  function recheck(targetId?: string) {
    if (!targetId) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setSubmittedFor(null);
  }

  function submit(terminalId: string) {
    setSubmittedFor(terminalId);
  }

  const bandKind = getBandKind(current, submittedFor);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            Delivery Problem Resolver
          </Text>
          <Text style={styles.subtitle}>
            Answer a few questions to find the right next step for this order.
          </Text>
        </View>

        {answeredSteps.length > 0 && (
          <FlatList
            horizontal
            data={answeredSteps}
            keyExtractor={(item) => item.node.id}
            showsHorizontalScrollIndicator={false}
            style={styles.trailList}
            contentContainerStyle={styles.trailContent}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            renderItem={({ item }) => {
              const q = item.node as QuestionNode;
              const option = q.options.find((o) => o.id === item.chosenOptionId);
              return (
                <View style={styles.trailChip}>
                  <Text style={styles.trailChipText} numberOfLines={1}>
                    {q.shortLabel}: {option ? option.label : ""}
                  </Text>
                </View>
              );
            }}
          />
        )}

        <View style={styles.card}>
          {canGoBack && (
            <Pressable
              onPress={goBack}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back to previous question"
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹ Back</Text>
            </Pressable>
          )}

          <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
            {current.type === "question" ? (
              <QuestionView node={current} onChoose={(optId) => choose(current, optId)} />
            ) : (
              <TerminalView node={current} />
            )}
          </View>
        </View>

        {bandKind !== "none" && (
          <View style={styles.band}>
            {bandKind === "blocked" && (
              <>
                <Text style={styles.bandReason}>{(current as TerminalNode).blockedReason}</Text>
                <Pressable
                  onPress={() => recheck((current as TerminalNode).recheckTarget)}
                  accessibilityRole="button"
                  accessibilityLabel={(current as TerminalNode).primaryActionLabel}
                  style={styles.bandPrimaryButton}
                >
                  <Text style={styles.bandPrimaryButtonText}>
                    {(current as TerminalNode).primaryActionLabel}
                  </Text>
                </Pressable>
              </>
            )}

            {bandKind === "action" && (
              <Pressable
                onPress={() => submit((current as TerminalNode).id)}
                accessibilityRole="button"
                accessibilityLabel={(current as TerminalNode).primaryActionLabel}
                style={styles.bandPrimaryButton}
              >
                <Text style={styles.bandPrimaryButtonText}>
                  {(current as TerminalNode).primaryActionLabel}
                </Text>
              </Pressable>
            )}

            {bandKind === "submitted" && (
              <View>
                <Text style={styles.bandSubmittedTitle}>Submitted</Text>
                <Text style={styles.bandSubmittedNote}>
                  {(current as TerminalNode).submittedNote}
                </Text>
              </View>
            )}

            {bandKind === "restart" && (
              <Pressable
                onPress={restart}
                accessibilityRole="button"
                accessibilityLabel="Start a new check"
                style={styles.bandPrimaryButton}
              >
                <Text style={styles.bandPrimaryButtonText}>Start a New Check</Text>
              </Pressable>
            )}

            {bandKind !== "restart" && (
              <Pressable
                onPress={restart}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Start a new check over from the beginning"
                style={styles.restartLink}
              >
                <Text style={styles.restartLinkText}>Start over</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function QuestionView({
  node,
  onChoose,
}: {
  node: QuestionNode;
  onChoose: (optionId: string) => void;
}) {
  return (
    <View>
      <Text accessibilityRole="alert" style={styles.prompt}>
        {node.prompt}
      </Text>
      {node.helper ? <Text style={styles.helper}>{node.helper}</Text> : null}
      <View style={styles.optionList}>
        {node.options.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => onChoose(option.id)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            style={({ pressed }) => [
              styles.optionButton,
              pressed && styles.optionButtonPressed,
            ]}
          >
            <Text style={styles.optionButtonText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function TerminalView({ node }: { node: TerminalNode }) {
  const colors = toneColors(node.tone);
  return (
    <View>
      <View
        style={[
          styles.badge,
          { backgroundColor: colors.bg, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.badgeText, { color: colors.fg }]}>{node.badgeLabel}</Text>
      </View>
      <Text accessibilityRole="alert" style={styles.outcomeTitle}>
        {node.title}
      </Text>
      <Text style={styles.outcomeMessage}>{node.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  trailList: {
    maxHeight: 44,
    paddingBottom: tokens.space(2),
  },
  trailContent: {
    paddingHorizontal: tokens.space(4),
    gap: tokens.space(2),
  },
  trailChip: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    marginRight: tokens.space(2),
    backgroundColor: tokens.color.bg,
    justifyContent: "center",
  },
  trailChipText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  card: {
    flex: 1,
    marginHorizontal: tokens.space(4),
    marginTop: tokens.space(2),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  backButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: tokens.space(2),
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  liveRegion: {
    flexGrow: 1,
  },
  prompt: {
    fontSize: 19,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  helper: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  optionList: {
    marginTop: tokens.space(4),
    gap: tokens.space(3),
  },
  optionButton: {
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    justifyContent: "center",
  },
  optionButtonPressed: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    marginBottom: tokens.space(3),
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  outcomeTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  outcomeMessage: {
    marginTop: tokens.space(2),
    fontSize: 15,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    backgroundColor: tokens.color.bg,
  },
  bandReason: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.warning,
    marginBottom: tokens.space(3),
  },
  bandPrimaryButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  bandPrimaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  bandSubmittedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.success,
  },
  bandSubmittedNote: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  restartLink: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(2),
  },
  restartLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },
});
