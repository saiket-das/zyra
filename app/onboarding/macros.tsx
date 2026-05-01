import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/lib/theme";
import { ScreenChrome, PrimaryButton, GhostButton } from "../../src/lib/ui";
import {
  getPendingDietInput,
  getPendingMainGoal,
  getPendingProfileInput,
} from "../../src/lib/onboarding-state";

type MacroId = "p" | "c" | "f";

export type MacroRow = {
  id: MacroId;
  label: string;
  g: number;
  pct: number;
  color: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}

function normalizeGoal(goalText: string) {
  const g = goalText.toLowerCase();
  if (g.includes("lose")) return "lose";
  if (g.includes("gain")) return "gain";
  if (g.includes("maintain")) return "maintain";
  if (g.includes("recomp")) return "recomp";
  if (g.includes("perform")) return "performance";
  if (g.includes("keto")) return "keto";
  return "maintain";
}

export function buildMacroPlan() {
  const goalText = getPendingMainGoal() ?? "Lose weight";
  const profile =
    getPendingProfileInput() ??
    ({
      sex: "Male",
      age: 28,
      heightCm: 174,
      currentWeightKg: 78.4,
      targetWeightKg: 72,
    } as const);
  const diet =
    getPendingDietInput() ??
    ({ selectedDiets: ["No preference"], selectedAllergies: [] } as const);

  const goal = normalizeGoal(goalText);
  const lowerDiets = diet.selectedDiets.map((d) => d.toLowerCase());
  const isKetoDiet = lowerDiets.includes("keto") || goal === "keto";
  const isLowCarbDiet = lowerDiets.includes("low carb");
  const isHighProteinDiet = lowerDiets.includes("high protein");
  const isVegetarianLike =
    lowerDiets.includes("vegetarian") || lowerDiets.includes("vegan");

  const sexAdjust =
    profile.sex === "Male" ? 5 : profile.sex === "Female" ? -161 : -78;
  const bmr =
    10 * profile.currentWeightKg +
    6.25 * profile.heightCm -
    5 * profile.age +
    sexAdjust;
  const tdee = bmr * 1.55;

  const goalAdjustByType: Record<string, number> = {
    lose: -450,
    gain: 300,
    maintain: 0,
    recomp: -120,
    performance: 220,
    keto: -180,
  };
  const weightDelta = profile.targetWeightKg - profile.currentWeightKg;
  const weightDeltaAdjust = clamp(weightDelta * 20, -220, 220);

  const dailyCalories = clamp(
    roundTo(tdee + (goalAdjustByType[goal] ?? 0) + weightDeltaAdjust, 10),
    1200,
    4200,
  );

  const proteinPerKgByGoal: Record<string, number> = {
    lose: 2.2,
    gain: 2.0,
    maintain: 1.8,
    recomp: 2.2,
    performance: 1.9,
    keto: 1.9,
  };
  const proteinPerKg =
    (proteinPerKgByGoal[goal] ?? 1.8) + (isVegetarianLike ? 0.15 : 0);
  const proteinG = Math.round(profile.currentWeightKg * proteinPerKg);

  let fatPct = 0.28;
  if (isKetoDiet) fatPct = 0.58;
  else if (isLowCarbDiet) fatPct = 0.4;
  if (isHighProteinDiet) fatPct = Math.min(fatPct, 0.25);

  const fatG = Math.round((dailyCalories * fatPct) / 9);
  let carbG = Math.round((dailyCalories - proteinG * 4 - fatG * 9) / 4);
  if (isKetoDiet) carbG = clamp(carbG, 20, 50);
  carbG = Math.max(30, carbG);

  const proteinCal = proteinG * 4;
  const carbCal = carbG * 4;
  const fatCal = fatG * 9;
  const macroCalTotal = proteinCal + carbCal + fatCal;

  const macros: MacroRow[] = [
    {
      id: "p",
      label: "Protein",
      g: proteinG,
      pct: Math.round((proteinCal / macroCalTotal) * 100),
      color: COLORS.ink,
    },
    {
      id: "c",
      label: "Carbs",
      g: carbG,
      pct: Math.round((carbCal / macroCalTotal) * 100),
      color: COLORS.blue,
    },
    {
      id: "f",
      label: "Fat",
      g: fatG,
      pct: Math.round((fatCal / macroCalTotal) * 100),
      color: COLORS.green,
    },
  ];

  const primaryDiet = diet.selectedDiets.find(
    (d) => d.toLowerCase() !== "no preference",
  );
  const planLabel = primaryDiet ?? goalText;

  // Calculate water intake (35ml per kg of body weight for active individuals)
  const waterL = Math.round(((profile.currentWeightKg * 35) / 1000) * 10) / 10;

  return {
    goalText,
    planLabel,
    dailyCalories,
    macros,
    waterL,
  };
}

export default function MacrosScreen() {
  const router = useRouter();
  const plan = buildMacroPlan();

  return (
    <ScreenChrome step={5} onBack={() => router.back()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your macro plan.</Text>
          <Text style={styles.subtitle}>
            Tuned by AI for your goal. Adjust if needed.
          </Text>
        </View>

        {/* big calorie target */}
        <View style={styles.calorieCenter}>
          <Text style={styles.monoLabel}>Daily target</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 6,
            }}
          >
            <Text style={styles.calorieNum}>
              {plan.dailyCalories.toLocaleString()}
            </Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>
              ✦ AI-generated · {plan.planLabel}
            </Text>
          </View>
        </View>

        {/* macro stacked bar */}
        <View style={styles.barSection}>
          <View style={styles.bar}>
            {plan.macros.map((m) => (
              <View
                key={m.id}
                style={{
                  width: `${m.pct}%` as any,
                  height: 10,
                  backgroundColor: m.color,
                  borderRadius: 0,
                }}
              />
            ))}
          </View>

          {/* macro rows */}
          <View style={styles.macroList}>
            {plan.macros.map((m) => (
              <View key={m.id} style={styles.macroRow}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: m.color,
                    }}
                  />
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: 2,
                    }}
                  >
                    <Text style={styles.macroG}>{m.g}</Text>
                    <Text style={styles.macroGUnit}>g</Text>
                  </View>
                  <Text style={styles.macroPct}>{m.pct}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* water intake section */}
        <View style={styles.waterSection}>
          <View style={styles.waterCard}>
            <View style={styles.waterIcon}>
              <Ionicons name="water-outline" size={24} color={COLORS.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waterLabel}>Daily water intake</Text>
              <Text style={styles.waterAmount}>
                {plan.waterL}
                <Text style={styles.waterUnit}> L</Text>
              </Text>
              <Text style={styles.waterSubtext}>
                Recommended for your body weight
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.footer}>
          <PrimaryButton onPress={() => router.push("/onboarding/permissions")}>
            Use this plan
          </PrimaryButton>
          <GhostButton onPress={() => {}}>Customize macros</GhostButton>
        </View>
      </ScrollView>
    </ScreenChrome>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
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
  calorieCenter: {
    paddingHorizontal: 24,
    paddingTop: 28,
    alignItems: "center",
  },
  monoLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: COLORS.inkDim,
  },
  calorieNum: {
    fontSize: 76,
    fontWeight: "600",
    letterSpacing: -3.5,
    lineHeight: 80,
    color: COLORS.ink,
  },
  calorieUnit: {
    fontSize: 16,
    color: COLORS.inkDim,
    fontWeight: "500",
    marginLeft: 6,
    letterSpacing: 0,
  },
  aiBadge: {
    marginTop: 8,
  },
  aiBadgeText: {
    fontSize: 13,
    color: COLORS.blue,
    fontWeight: "600",
  },
  barSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    gap: 2,
  },
  macroList: {
    marginTop: 16,
    gap: 10,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  macroLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },
  macroG: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.4,
    color: COLORS.ink,
  },
  macroGUnit: {
    fontSize: 12,
    color: COLORS.inkDim,
  },
  macroPct: {
    fontSize: 12,
    color: COLORS.inkDim,
    width: 32,
    textAlign: "right",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    gap: 4,
  },
  waterSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  waterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(124, 179, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 179, 255, 0.2)",
  },
  waterIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(124, 179, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  waterLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.inkDim,
  },
  waterAmount: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.8,
    color: COLORS.blue,
    marginTop: 2,
  },
  waterUnit: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.inkDim,
  },
  waterSubtext: {
    fontSize: 12,
    color: COLORS.inkDim,
    marginTop: 2,
  },
});
