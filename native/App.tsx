import { SafeAreaView, StyleSheet } from "react-native";
import { resolveScreen } from "./src/screens";

const Screen = resolveScreen(process.env.EXPO_PUBLIC_SCREEN);

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <Screen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
