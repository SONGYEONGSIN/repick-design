import { SafeAreaView, StyleSheet } from "react-native";
import { MatchList } from "./src/MatchList";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <MatchList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
