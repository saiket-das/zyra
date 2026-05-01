import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { COLORS } from "../../src/lib/theme";
import { ScreenChrome, PrimaryButton } from "../../src/lib/ui";
import {
  getPendingDietInput,
  setPendingDietInput,
} from "../../src/lib/onboarding-state";

const DIETS = [
  "No preference",
  "Halal",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-free",
  "High protein",
  "Low carb",
  "Custom",
];

const ALLERGIES = ["Peanuts", "Shellfish", "Dairy", "Eggs", "Soy", "+ Add"];

export default function DietPrefScreen() {
  const router = useRouter();
  const pendingDiet = getPendingDietInput();
  const defaultAllergies = ALLERGIES.slice(0, -1);
  const initialAllergies = Array.from(
    new Set([...(pendingDiet?.selectedAllergies ?? []), ...defaultAllergies]),
  );

  const [selected, setSelected] = useState<string[]>(
    pendingDiet?.selectedDiets.length
      ? pendingDiet.selectedDiets
      : ["Halal", "High protein"],
  );
  const [allergies, setAllergies] = useState<string[]>(initialAllergies);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    pendingDiet?.selectedAllergies ?? [],
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");

  const toggle = (d: string) => {
    setSelected((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const toggleAllergy = (a: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const addAllergy = () => {
    const trimmed = newAllergy.trim();
    if (!trimmed) return;
    if (!allergies.includes(trimmed)) setAllergies((s) => [trimmed, ...s]);
    if (!selectedAllergies.includes(trimmed))
      setSelectedAllergies((s) => [trimmed, ...s]);
    setNewAllergy("");
    setAddModalVisible(false);
  };

  function handleContinue() {
    setPendingDietInput({
      selectedDiets: selected,
      selectedAllergies,
    });
    router.push("/onboarding/macros");
  }

  return (
    <ScreenChrome step={4} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet preference.</Text>
        <Text style={styles.subtitle}>
          Pick one or more — we'll filter foods to match.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* diet chips */}
        <View style={styles.chips}>
          {DIETS.map((d) => {
            const sel = selected.includes(d);
            return (
              <Pressable
                key={d}
                onPress={() => toggle(d)}
                style={[styles.chip, sel && styles.chipSelected]}
              >
                {sel && (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: COLORS.green,
                      marginRight: 4,
                    }}
                  />
                )}
                <Text style={[styles.chipText, sel && styles.chipTextSelected]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* allergies */}
        <View style={styles.allergySection}>
          <Text style={styles.sectionLabel}>Allergies</Text>
          <View style={styles.chips}>
            {allergies.map((a) => {
              const sel = selectedAllergies.includes(a);
              return (
                <Pressable
                  key={a}
                  onPress={() => toggleAllergy(a)}
                  style={[styles.chip, sel && styles.chipSelected]}
                >
                  {sel && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: COLORS.green,
                        marginRight: 4,
                      }}
                    />
                  )}
                  <Text
                    style={[styles.chipText, sel && styles.chipTextSelected]}
                  >
                    {a}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setAddModalVisible(true)}
              style={styles.addAllergyChip}
            >
              <Text style={[styles.allergyChipText, { color: COLORS.blue }]}>
                + Add
              </Text>
            </Pressable>
          </View>
        </View>

        <Modal visible={addModalVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Add allergy</Text>
              <TextInput
                value={newAllergy}
                onChangeText={setNewAllergy}
                placeholder="e.g. Sesame"
                style={styles.input}
                autoFocus
                onSubmitEditing={addAllergy}
                returnKeyType="done"
              />
              <View style={styles.addRow}>
                <Pressable onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={addAllergy}
                  style={({ pressed }) => [
                    styles.modalAddBtn,
                    !newAllergy.trim() && styles.modalAddBtnDisabled,
                    pressed && newAllergy.trim() && { opacity: 0.9 },
                  ]}
                  disabled={!newAllergy.trim()}
                >
                  <Text style={styles.modalAddBtnText}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.ink,
  },
  chipTextSelected: {
    color: "#fff",
  },
  allergySection: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: COLORS.inkDim,
    marginBottom: 10,
  },
  addAllergyChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderStyle: "dashed",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  allergyChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.inkDim,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  addRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCancel: {
    color: COLORS.inkDim,
    fontWeight: "600",
  },
  modalAddBtn: {
    minWidth: 72,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.ink,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  modalAddBtnDisabled: {
    opacity: 0.45,
  },
  modalAddBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 20,
  },
});
