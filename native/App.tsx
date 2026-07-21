import { SafeAreaView, StyleSheet } from "react-native";
import { WatchList } from "./src/watchlist/WatchList";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <WatchList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
