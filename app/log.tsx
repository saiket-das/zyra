import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LogScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.kicker}>Food logging</Text>
      <Text style={styles.title}>Start with a fast entry flow.</Text>
      <Text style={styles.subtitle}>
        This screen is the first pass at the meal logging experience. It gives
        us a place to wire in manual search, barcode scanning, and the AI
        fallback flow.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Food name</Text>
        <TextInput
          placeholder="Chicken fried rice"
          placeholderTextColor="#5f6f86"
          style={styles.input}
        />

        <Text style={styles.label}>Serving</Text>
        <TextInput
          placeholder="1 plate"
          placeholderTextColor="#5f6f86"
          style={styles.input}
        />

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Search database</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Scan barcode</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Log meal</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Implementation notes</Text>
        <Text style={styles.body}>
          Supabase tables for profiles, food items, food logs, and body metrics
          are already seeded. The next step is to connect this screen to search
          and write flows.
        </Text>
      </View>

      <Link href="/" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Back to home</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#08111f",
    padding: 24,
    gap: 20,
  },
  kicker: {
    color: "#7ee7c8",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
    paddingTop: 16,
  },
  title: {
    color: "#f5f7fb",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    color: "#a9b4c7",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    gap: 12,
    backgroundColor: "#101b2f",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1b2944",
  },
  label: {
    color: "#d7deea",
    fontWeight: "700",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#0d1626",
    borderColor: "#22314d",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f5f7fb",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#7ee7c8",
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: "#08111f",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#18263d",
    paddingVertical: 12,
    borderRadius: 14,
  },
  secondaryButtonText: {
    color: "#f5f7fb",
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#f5f7fb",
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    color: "#a9b4c7",
    lineHeight: 22,
  },
  linkButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
  },
  linkText: {
    color: "#7ee7c8",
    fontWeight: "700",
  },
});
