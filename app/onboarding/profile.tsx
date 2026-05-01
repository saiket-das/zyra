import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../src/lib/theme";
import { ScreenChrome, PrimaryButton } from "../../src/lib/ui";
import {
  getPendingProfileInput,
  setPendingProfileInput,
} from "../../src/lib/onboarding-state";

type Sex = "Female" | "Male" | "Other";
type HeightUnit = "cm" | "ftin";
type WeightUnit = "kg" | "lb";
type EditableField = "age" | "height" | "currentWeight" | "targetWeight" | null;

function SexToggle({
  selected,
  onSelect,
}: {
  selected: Sex;
  onSelect: (s: Sex) => void;
}) {
  return (
    <View style={styles.sexRow}>
      {(["Female", "Male", "Other"] as Sex[]).map((s) => {
        const sel = selected === s;
        return (
          <Pressable
            key={s}
            onPress={() => onSelect(s)}
            style={[styles.sexBtn, sel && styles.sexBtnSelected]}
          >
            <Text style={[styles.sexBtnText, sel && styles.sexBtnTextSelected]}>
              {s}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function toLb(kg: number) {
  return kg * 2.2046226218;
}

function toKg(lb: number) {
  return lb / 2.2046226218;
}

function cmToFeetInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
}

function feetInchesToCm(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54);
}

function FieldRow({
  label,
  value,
  unit,
  onPress,
  accent = false,
}: {
  label: string;
  value: string;
  unit?: string;
  onPress: () => void;
  accent?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.field, accent && styles.fieldAccent]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 4,
            marginTop: 2,
          }}
        >
          <Text style={styles.fieldValue}>{value}</Text>
          {unit ? <Text style={styles.fieldUnit}>{unit}</Text> : null}
        </View>
      </View>
      <View style={styles.editChip}>
        <Text style={styles.editChipText}>Edit</Text>
      </View>
      {accent && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.green,
          }}
        />
      )}
    </Pressable>
  );
}

export default function PersonalInfoScreen() {
  const router = useRouter();
  const pendingProfile = getPendingProfileInput();

  const [sex, setSex] = useState<Sex>(pendingProfile?.sex ?? "Male");
  const [age, setAge] = useState(pendingProfile?.age ?? 28);
  const [heightCm, setHeightCm] = useState(pendingProfile?.heightCm ?? 174);
  const [currentWeightKg, setCurrentWeightKg] = useState(
    pendingProfile?.currentWeightKg ?? 78.4,
  );
  const [targetWeightKg, setTargetWeightKg] = useState(
    pendingProfile?.targetWeightKg ?? 72.0,
  );

  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeField, setActiveField] = useState<EditableField>(null);

  const [draftAge, setDraftAge] = useState(28);
  const [draftHeightUnit, setDraftHeightUnit] = useState<HeightUnit>("cm");
  const [draftHeightCm, setDraftHeightCm] = useState(174);
  const [draftHeightFeet, setDraftHeightFeet] = useState(5);
  const [draftHeightInches, setDraftHeightInches] = useState(9);
  const [draftWeightUnit, setDraftWeightUnit] = useState<WeightUnit>("kg");
  const [draftWeightValue, setDraftWeightValue] = useState(78.4);
  const [draftWeightKg, setDraftWeightKg] = useState(78);
  const [draftWeightGrams, setDraftWeightGrams] = useState(400);

  const ages = useMemo(() => Array.from({ length: 88 }, (_, i) => i + 13), []);
  const cmHeights = useMemo(
    () => Array.from({ length: 111 }, (_, i) => i + 120),
    [],
  );
  const feetValues = useMemo(
    () => Array.from({ length: 5 }, (_, i) => i + 4),
    [],
  );
  const inchValues = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const kgWeights = useMemo(
    () =>
      Array.from({ length: 2201 }, (_, i) => Number((30 + i * 0.1).toFixed(1))),
    [],
  );
  const kgInts = useMemo(
    () => Array.from({ length: 221 }, (_, i) => 30 + i),
    [],
  );
  const gramValues = useMemo(
    () => Array.from({ length: 10 }, (_, i) => i * 100),
    [],
  );
  const lbWeights = useMemo(
    () => Array.from({ length: 486 }, (_, i) => i + 66),
    [],
  );

  function openEditor(field: Exclude<EditableField, null>) {
    setActiveField(field);

    if (field === "age") {
      setDraftAge(age);
    }

    if (field === "height") {
      setDraftHeightUnit(heightUnit);
      setDraftHeightCm(heightCm);
      const currentFeetInches = cmToFeetInches(heightCm);
      setDraftHeightFeet(currentFeetInches.feet);
      setDraftHeightInches(currentFeetInches.inches);
    }

    if (field === "currentWeight" || field === "targetWeight") {
      const sourceKg =
        field === "currentWeight" ? currentWeightKg : targetWeightKg;
      setDraftWeightUnit(weightUnit);
      if (weightUnit === "kg") {
        let kgInt = Math.floor(sourceKg);
        let grams = Math.round(((sourceKg - kgInt) * 1000) / 100) * 100;
        if (grams === 1000) {
          kgInt += 1;
          grams = 0;
        }
        setDraftWeightKg(kgInt);
        setDraftWeightGrams(grams);
      } else {
        setDraftWeightValue(Math.round(toLb(sourceKg)));
      }
    }

    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
    setActiveField(null);
  }

  function applySelection() {
    if (!activeField) return;

    if (activeField === "age") {
      setAge(draftAge);
    }

    if (activeField === "height") {
      setHeightUnit(draftHeightUnit);
      if (draftHeightUnit === "cm") {
        setHeightCm(draftHeightCm);
      } else {
        setHeightCm(feetInchesToCm(draftHeightFeet, draftHeightInches));
      }
    }

    if (activeField === "currentWeight" || activeField === "targetWeight") {
      setWeightUnit(draftWeightUnit);
      const nextKg =
        draftWeightUnit === "kg"
          ? draftWeightKg + draftWeightGrams / 1000
          : toKg(Number(draftWeightValue));
      if (activeField === "currentWeight") {
        setCurrentWeightKg(Number(nextKg.toFixed(1)));
      } else {
        setTargetWeightKg(Number(nextKg.toFixed(1)));
      }
    }

    closeDrawer();
  }

  const heightDisplay =
    heightUnit === "cm"
      ? { value: String(heightCm), unit: "cm" }
      : (() => {
          const h = cmToFeetInches(heightCm);
          return { value: `${h.feet}' ${h.inches}\"`, unit: "" };
        })();

  const currentWeightDisplay =
    weightUnit === "kg"
      ? { value: currentWeightKg.toFixed(1), unit: "kg" }
      : { value: String(Math.round(toLb(currentWeightKg))), unit: "lb" };

  const targetWeightDisplay =
    weightUnit === "kg"
      ? { value: targetWeightKg.toFixed(1), unit: "kg" }
      : { value: String(Math.round(toLb(targetWeightKg))), unit: "lb" };

  const drawerTitle =
    activeField === "age"
      ? "Age"
      : activeField === "height"
        ? "Height"
        : activeField === "currentWeight"
          ? "Current weight"
          : activeField === "targetWeight"
            ? "Target weight"
            : "Edit";

  function handleContinue() {
    setPendingProfileInput({
      sex,
      age,
      heightCm,
      currentWeightKg,
      targetWeightKg,
    });
    router.push("/onboarding/diet");
  }

  return (
    <ScreenChrome step={3} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>A bit about you.</Text>
        <Text style={styles.subtitle}>
          For accurate macros & calorie targets.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.fields}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.sectionLabel}>Sex</Text>
          <SexToggle selected={sex} onSelect={setSex} />
        </View>
        <FieldRow
          label="Age"
          value={String(age)}
          unit="years"
          onPress={() => openEditor("age")}
        />
        <FieldRow
          label="Height"
          value={heightDisplay.value}
          unit={heightDisplay.unit}
          onPress={() => openEditor("height")}
        />
        <FieldRow
          label="Current weight"
          value={currentWeightDisplay.value}
          unit={currentWeightDisplay.unit}
          onPress={() => openEditor("currentWeight")}
        />
        <FieldRow
          label="Target weight"
          value={targetWeightDisplay.value}
          unit={targetWeightDisplay.unit}
          onPress={() => openEditor("targetWeight")}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleContinue}>Continue</PrimaryButton>
      </View>

      <Modal
        visible={drawerVisible}
        transparent
        animationType="slide"
        onRequestClose={closeDrawer}
      >
        <Pressable style={styles.drawerBackdrop} onPress={closeDrawer} />
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Pressable onPress={closeDrawer}>
              <Text style={styles.drawerAction}>Cancel</Text>
            </Pressable>
            <Text style={styles.drawerTitle}>{drawerTitle}</Text>
            <Pressable onPress={applySelection}>
              <Text style={[styles.drawerAction, styles.drawerActionDone]}>
                Done
              </Text>
            </Pressable>
          </View>

          {activeField === "age" ? (
            <Picker
              key={`age-${draftAge}`}
              selectedValue={draftAge}
              onValueChange={(v: string | number) => setDraftAge(Number(v))}
            >
              {ages.map((v) => (
                <Picker.Item key={v} label={`${v}`} value={v} />
              ))}
            </Picker>
          ) : null}

          {activeField === "height" ? (
            <View>
              <View style={styles.unitSwitchRow}>
                <Pressable
                  style={[
                    styles.unitChip,
                    draftHeightUnit === "cm" && styles.unitChipSelected,
                  ]}
                  onPress={() => setDraftHeightUnit("cm")}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      draftHeightUnit === "cm" && styles.unitChipTextSelected,
                    ]}
                  >
                    cm
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.unitChip,
                    draftHeightUnit === "ftin" && styles.unitChipSelected,
                  ]}
                  onPress={() => setDraftHeightUnit("ftin")}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      draftHeightUnit === "ftin" && styles.unitChipTextSelected,
                    ]}
                  >
                    ft + in
                  </Text>
                </Pressable>
              </View>

              {draftHeightUnit === "cm" ? (
                <Picker
                  key={`height-cm-${draftHeightCm}`}
                  selectedValue={draftHeightCm}
                  onValueChange={(v: string | number) =>
                    setDraftHeightCm(Number(v))
                  }
                >
                  {cmHeights.map((v) => (
                    <Picker.Item key={v} label={`${v} cm`} value={v} />
                  ))}
                </Picker>
              ) : (
                <View style={styles.dualPickerRow}>
                  <View style={styles.dualPickerCol}>
                    <Picker
                      key={`height-ft-${draftHeightFeet}`}
                      selectedValue={draftHeightFeet}
                      onValueChange={(v: string | number) =>
                        setDraftHeightFeet(Number(v))
                      }
                    >
                      {feetValues.map((v) => (
                        <Picker.Item key={v} label={`${v} ft`} value={v} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.dualPickerCol}>
                    <Picker
                      key={`height-in-${draftHeightInches}`}
                      selectedValue={draftHeightInches}
                      onValueChange={(v: string | number) =>
                        setDraftHeightInches(Number(v))
                      }
                    >
                      {inchValues.map((v) => (
                        <Picker.Item key={v} label={`${v} in`} value={v} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </View>
          ) : null}

          {activeField === "currentWeight" || activeField === "targetWeight" ? (
            <View>
              <View style={styles.unitSwitchRow}>
                <Pressable
                  style={[
                    styles.unitChip,
                    draftWeightUnit === "kg" && styles.unitChipSelected,
                  ]}
                  onPress={() => {
                    if (draftWeightUnit === "lb") {
                      const asKg = toKg(draftWeightValue);
                      let kgInt = Math.floor(asKg);
                      let grams =
                        Math.round(((asKg - kgInt) * 1000) / 100) * 100;
                      if (grams === 1000) {
                        kgInt += 1;
                        grams = 0;
                      }
                      setDraftWeightKg(kgInt);
                      setDraftWeightGrams(grams);
                    }
                    setDraftWeightUnit("kg");
                  }}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      draftWeightUnit === "kg" && styles.unitChipTextSelected,
                    ]}
                  >
                    kg
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.unitChip,
                    draftWeightUnit === "lb" && styles.unitChipSelected,
                  ]}
                  onPress={() => {
                    if (draftWeightUnit === "kg") {
                      const asKg = draftWeightKg + draftWeightGrams / 1000;
                      setDraftWeightValue(Math.round(toLb(asKg)));
                    }
                    setDraftWeightUnit("lb");
                  }}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      draftWeightUnit === "lb" && styles.unitChipTextSelected,
                    ]}
                  >
                    lb
                  </Text>
                </Pressable>
              </View>

              {draftWeightUnit === "kg" ? (
                <View style={styles.dualPickerRow}>
                  <View style={styles.dualPickerCol}>
                    <Picker
                      key={`${activeField}-kgint-${draftWeightKg}`}
                      selectedValue={draftWeightKg}
                      onValueChange={(v: string | number) =>
                        setDraftWeightKg(Number(v))
                      }
                    >
                      {kgInts.map((v) => (
                        <Picker.Item key={v} label={`${v} kg`} value={v} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.dualPickerCol}>
                    <Picker
                      key={`${activeField}-grams-${draftWeightGrams}`}
                      selectedValue={draftWeightGrams}
                      onValueChange={(v: string | number) =>
                        setDraftWeightGrams(Number(v))
                      }
                    >
                      {gramValues.map((v) => (
                        <Picker.Item key={v} label={`${v} g`} value={v} />
                      ))}
                    </Picker>
                  </View>
                </View>
              ) : (
                <Picker
                  key={`${activeField}-lb-${Math.round(draftWeightValue)}`}
                  selectedValue={Math.round(draftWeightValue)}
                  onValueChange={(v: string | number) =>
                    setDraftWeightValue(Number(v))
                  }
                >
                  {lbWeights.map((v) => (
                    <Picker.Item key={v} label={`${v} lb`} value={v} />
                  ))}
                </Picker>
              )}
            </View>
          ) : null}
        </View>
      </Modal>
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
  fields: {
    padding: 20,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: COLORS.inkDim,
    marginBottom: 8,
  },
  sexRow: {
    flexDirection: "row",
    gap: 8,
  },
  sexBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: "center",
    alignItems: "center",
  },
  sexBtnSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  sexBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },
  sexBtnTextSelected: {
    color: "#fff",
  },
  field: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldAccent: {
    borderColor: COLORS.ink,
  },
  editChip: {
    marginRight: 8,
    height: 28,
    minWidth: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  editChipText: {
    fontSize: 11,
    color: COLORS.inkDim,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.inkDim,
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.6,
    color: COLORS.ink,
  },
  fieldUnit: {
    fontSize: 13,
    color: COLORS.inkDim,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  drawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: COLORS.line,
  },
  drawerHeader: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLORS.line,
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.ink,
  },
  drawerAction: {
    fontSize: 16,
    color: COLORS.inkDim,
  },
  drawerActionDone: {
    color: COLORS.ink,
    fontWeight: "600",
  },
  unitSwitchRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  unitChip: {
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  unitChipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.ink,
  },
  unitChipTextSelected: {
    color: "#fff",
  },
  dualPickerRow: {
    flexDirection: "row",
  },
  dualPickerCol: {
    flex: 1,
  },
});
