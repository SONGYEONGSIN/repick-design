import { SafeAreaView, StyleSheet } from "react-native";
import { resolveScreen } from "./src/screens";

// Web: pick the screen from the ?screen= query at runtime so one static export serves every screen.
// Native/build-time: fall back to EXPO_PUBLIC_SCREEN (used by the evolve gate).
function currentSlug(): string | undefined {
  if (typeof window !== "undefined" && window.location) {
    return new URLSearchParams(window.location.search).get("screen") ?? undefined;
  }
  return process.env.EXPO_PUBLIC_SCREEN;
}

export default function App() {
  const Screen = resolveScreen(currentSlug());
  return (
    <SafeAreaView style={styles.safe}>
      <Screen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
