import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '../../src/lib/theme';
import { ScreenChrome, PrimaryButton } from '../../src/lib/ui';

const DIETS = [
  'No preference', 'Halal', 'Vegetarian', 'Vegan',
  'Pescatarian', 'Keto', 'Paleo', 'Mediterranean',
  'Gluten-free', 'High protein', 'Low carb', 'Custom',
];

const ALLERGIES = ['Peanuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy', '+ Add'];

export default function DietPrefScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['Halal', 'High protein']);

  const toggle = (d: string) => {
    setSelected((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  return (
    <ScreenChrome step={4} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet preference.</Text>
        <Text style={styles.subtitle}>Pick one or more — we'll filter foods to match.</Text>
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
                    style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green, marginRight: 4 }}
                  />
                )}
                <Text style={[styles.chipText, sel && styles.chipTextSelected]}>{d}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* allergies */}
        <View style={styles.allergySection}>
          <Text style={styles.sectionLabel}>Allergies</Text>
          <View style={styles.chips}>
            {ALLERGIES.map((a, i) => (
              <View
                key={a}
                style={[styles.allergyChip]}
              >
                <Text style={[styles.allergyChipText, i === ALLERGIES.length - 1 && { color: COLORS.blue }]}>
                  {a}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={() => router.push('/onboarding/macros')}>
          Continue
        </PrimaryButton>
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
    fontWeight: '600',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  chipTextSelected: {
    color: '#fff',
  },
  allergySection: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
    marginBottom: 10,
  },
  allergyChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderStyle: 'dashed',
  },
  allergyChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.inkDim,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 20,
  },
});
