import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../src/lib/theme';
import { ScreenChrome, PrimaryButton, GhostButton, StepDots } from '../../src/lib/ui';

const MACROS = [
  { l: 'Protein', g: 180, c: COLORS.ink },
  { l: 'Carbs', g: 200, c: COLORS.blue },
  { l: 'Fat', g: 60, c: COLORS.green },
];

export default function PlanReadyScreen() {
  const router = useRouter();

  return (
    <ScreenChrome step={7} onBack={() => router.back()}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          {/* "You're all set" badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeTick}>✓</Text>
            <Text style={styles.badgeText}>You're all set</Text>
          </View>

          <Text style={styles.title}>Your plan is{'\n'}ready, Aliya.</Text>
          <Text style={styles.subtitle}>
            Built from your goal, body data, and dietary preferences. You can fine-tune anything
            later.
          </Text>
        </View>

        {/* plan summary card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.monoLabel}>Daily target</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                <Text style={styles.calorieNum}>2,180</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.monoLabel}>Goal</Text>
              <Text style={styles.goalText}>Gain muscle</Text>
            </View>
          </View>

          {/* macro bar */}
          <View style={styles.macroBar}>
            <View style={{ flex: 36, backgroundColor: COLORS.ink, height: 8 }} />
            <View style={{ flex: 40, backgroundColor: COLORS.blue, height: 8 }} />
            <View style={{ flex: 24, backgroundColor: COLORS.green, height: 8 }} />
          </View>

          {/* macro values */}
          <View style={styles.macroRow}>
            {MACROS.map((m) => (
              <View key={m.l} style={{ alignItems: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: m.c }} />
                  <Text style={styles.monoLabelSmall}>{m.l}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                  <Text style={styles.macroG}>{m.g}</Text>
                  <Text style={styles.macroGUnit}>g</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI coaching callout */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiStar}>✦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Coach will adapt weekly</Text>
            <Text style={styles.aiSub}>
              Targets adjust based on your progress, training, and sleep.
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />

        <View style={styles.footer}>
          <PrimaryButton onPress={() => router.replace('/(tabs)/dashboard')}>
            Log your first meal
          </PrimaryButton>
          <GhostButton onPress={() => router.replace('/(tabs)/dashboard')}>
            Take me to the dashboard
          </GhostButton>
        </View>
      </ScrollView>
    </ScreenChrome>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.green,
    gap: 6,
    marginBottom: 14,
  },
  badgeTick: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ink,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: -1.4,
    lineHeight: 38,
    color: COLORS.ink,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.inkDim,
    lineHeight: 20,
    maxWidth: 300,
  },
  card: {
    margin: 20,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  monoLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
  },
  monoLabelSmall: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
  },
  calorieNum: {
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: -1.4,
    lineHeight: 42,
    color: COLORS.ink,
  },
  calorieUnit: {
    fontSize: 14,
    color: COLORS.inkDim,
    fontWeight: '500',
    marginLeft: 6,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
    marginTop: 4,
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 16,
    gap: 2,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  macroG: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: COLORS.ink,
  },
  macroGUnit: {
    fontSize: 11,
    color: COLORS.inkDim,
    fontWeight: '500',
    marginLeft: 2,
  },
  aiCard: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(198,255,61,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  aiStar: {
    fontSize: 16,
    color: COLORS.green,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  aiSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    gap: 4,
  },
});
