import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../src/lib/theme";
import { Logomark, PrimaryButton } from "../../src/lib/ui";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* top bar: logo + version badge */}
      <View style={styles.topBar}>
        <Logomark size={28} />
        <View style={styles.versionBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.versionText}>v2.0</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* headline */}
        <Text style={styles.headline}>
          Nutrition,{"\n"}
          <Text style={styles.headlineDim}>perfected</Text>
          {"\n"}
          by AI
          <Text style={styles.headlineAccent}>.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Track meals in under 5 seconds with the smartest macro and
          micronutrient tracker.
        </Text>

        <Image
          source={require("../../assets/hero-meal-photo.jpg")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </ScrollView>

      {/* bottom CTA */}
      <View style={styles.footer}>
        <PrimaryButton onPress={() => router.push("/onboarding/goals")}>
          Get started
        </PrimaryButton>
        <Text style={styles.footerNote}>
          Takes about 60 seconds · No account needed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  versionText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.inkDim,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    flexGrow: 1,
  },
  headline: {
    fontSize: 52,
    lineHeight: 52,
    fontWeight: "600",
    letterSpacing: -2,
    color: COLORS.ink,
  },
  headlineDim: {
    color: COLORS.inkDim,
  },
  headlineAccent: {
    color: COLORS.green,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.inkDim,
    maxWidth: 290,
  },
  hero: {
    marginTop: 32,
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: 200,
    marginTop: 32,
    marginBottom: 16,
    borderRadius: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 14,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.inkDim,
    lineHeight: 18,
  },
});
