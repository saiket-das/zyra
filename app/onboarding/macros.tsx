import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../src/lib/theme';
import { ScreenChrome, PrimaryButton, GhostButton } from '../../src/lib/ui';

const MACROS = [
  { id: 'p', label: 'Protein', g: 180, pct: 36, color: COLORS.ink },
  { id: 'c', label: 'Carbs', g: 200, pct: 40, color: COLORS.blue },
  { id: 'f', label: 'Fat', g: 60, pct: 24, color: COLORS.green },
];

export default function MacrosScreen() {
  const router = useRouter();

  return (
    <ScreenChrome step={5} onBack={() => router.back()}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Your macro plan.</Text>
          <Text style={styles.subtitle}>Tuned by AI for your goal. Adjust if needed.</Text>
        </View>

        {/* big calorie target */}
        <View style={styles.calorieCenter}>
          <Text style={styles.monoLabel}>Daily target</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6 }}>
            <Text style={styles.calorieNum}>2,180</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✦ AI-generated · High protein</Text>
          </View>
        </View>

        {/* macro stacked bar */}
        <View style={styles.barSection}>
          <View style={styles.bar}>
            {MACROS.map((m) => (
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
            {MACROS.map((m) => (
              <View key={m.id} style={styles.macroRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.color }} />
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                    <Text style={styles.macroG}>{m.g}</Text>
                    <Text style={styles.macroGUnit}>g</Text>
                  </View>
                  <Text style={styles.macroPct}>{m.pct}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.footer}>
          <PrimaryButton onPress={() => router.push('/onboarding/permissions')}>
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
  calorieCenter: {
    paddingHorizontal: 24,
    paddingTop: 28,
    alignItems: 'center',
  },
  monoLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
  },
  calorieNum: {
    fontSize: 76,
    fontWeight: '600',
    letterSpacing: -3.5,
    lineHeight: 80,
    color: COLORS.ink,
  },
  calorieUnit: {
    fontSize: 16,
    color: COLORS.inkDim,
    fontWeight: '500',
    marginLeft: 6,
    letterSpacing: 0,
  },
  aiBadge: {
    marginTop: 8,
  },
  aiBadgeText: {
    fontSize: 13,
    color: COLORS.blue,
    fontWeight: '600',
  },
  barSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 2,
  },
  macroList: {
    marginTop: 16,
    gap: 10,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  macroLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
  macroG: {
    fontSize: 18,
    fontWeight: '600',
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
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    gap: 4,
  },
});
