import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { COLORS } from "../../src/lib/theme";
import { ScreenChrome, PrimaryButton, RadioCircle } from "../../src/lib/ui";
import {
  getPendingMainGoal,
  setPendingMainGoal,
} from "../../src/lib/onboarding-state";

const GOALS = [
  { id: "lose", label: "Lose weight", sub: "Sustainable fat loss", glyph: "↓" },
  {
    id: "gain",
    label: "Gain muscle",
    sub: "Lean bulk with high protein",
    glyph: "↑",
  },
  {
    id: "maintain",
    label: "Maintain",
    sub: "Hold weight, eat better",
    glyph: "=",
  },
  {
    id: "recomp",
    label: "Body recomposition",
    sub: "Lose fat & gain muscle",
    glyph: "⇄",
  },
  {
    id: "perf",
    label: "Athletic performance",
    sub: "Fuel training & recovery",
    glyph: "⚡",
  },
  { id: "keto", label: "Keto", sub: "Track net carbs", glyph: "◐" },
];

export default function GoalsScreen() {
  const router = useRouter();
  const pendingGoal = getPendingMainGoal();
  const initialSelectedGoal =
    GOALS.find((g) => g.label === pendingGoal)?.id ?? "lose";
  const [selected, setSelected] = useState(initialSelectedGoal);

  function handleContinue() {
    const selectedGoal = GOALS.find((g) => g.id === selected)?.label;
    if (selectedGoal) {
      setPendingMainGoal(selectedGoal);
    }
    router.push("/onboarding/profile");
  }

  return (
    <ScreenChrome step={2} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your{"\n"}main goal?</Text>
        <Text style={styles.subtitle}>
          We'll tune macros and recommendations.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {GOALS.map((g) => {
          const sel = selected === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => setSelected(g.id)}
              style={[styles.row, sel && styles.rowSelected]}
            >
              <View style={[styles.glyph, sel && styles.glyphSelected]}>
                <Text style={styles.glyphText}>{g.glyph}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.goalLabel, sel && styles.goalLabelSelected]}
                >
                  {g.label}
                </Text>
                <Text style={[styles.goalSub, sel && styles.goalSubSelected]}>
                  {g.sub}
                </Text>
              </View>
              <RadioCircle selected={sel} />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleContinue}>Continue</PrimaryButton>
      </View>
    </ScreenChrome>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -1.2,
    lineHeight: 36,
    color: COLORS.ink,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.inkDim,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 8,
  },
  rowSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  glyphSelected: {
    backgroundColor: COLORS.green,
  },
  glyphText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.ink,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  goalLabelSelected: {
    color: "#fff",
  },
  goalSub: {
    fontSize: 13,
    marginTop: 2,
    color: COLORS.inkDim,
  },
  goalSubSelected: {
    color: "rgba(255,255,255,0.6)",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
});
