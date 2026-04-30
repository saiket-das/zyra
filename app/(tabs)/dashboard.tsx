import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { COLORS } from '../../src/lib/theme';
import { MacroBar, MonoLabel } from '../../src/lib/ui';

// ── Calorie ring (pure View/border trick) ────────────────────────────────
function CalorieRing({
  pct = 0.62,
  calories = 1352,
  target = 2180,
  size = 170,
}: {
  pct?: number;
  calories?: number;
  target?: number;
  size?: number;
}) {
  const strokeWidth = 14;
  const r = size / 2 - strokeWidth / 2;
  const circ = 2 * Math.PI * r;
  // We can't do arc with pure RN — approximate with a thick border ring tinted with opacity layers
  const remaining = target - calories;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: COLORS.inkFaint,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* filled arc approximation: overlay a colored arc via absolute position */}
      {/* We use a clip trick: show a colored half-ring based on pct */}
      <View
        style={{
          position: 'absolute',
          top: -strokeWidth,
          left: -strokeWidth,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: COLORS.ink,
          borderTopColor: pct < 0.25 ? 'transparent' : COLORS.ink,
          borderRightColor: pct < 0.5 ? 'transparent' : COLORS.ink,
          borderBottomColor: pct < 0.75 ? 'transparent' : COLORS.ink,
          borderLeftColor: COLORS.ink,
          transform: [{ rotate: `${(pct * 360 - 90)}deg` }],
          opacity: 0,
        }}
      />
      <View style={{ alignItems: 'center' }}>
        <MonoLabel>Remaining</MonoLabel>
        <Text style={styles.ringNum}>{remaining.toLocaleString()}</Text>
        <Text style={styles.ringUnit}>of {target.toLocaleString()} kcal</Text>
      </View>
    </View>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  pct,
  color,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  pct: number;
  color: string;
  trend?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <MonoLabel>{label}</MonoLabel>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
      {!trend ? (
        <View style={{ height: 4, backgroundColor: COLORS.inkFaint, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
          <View style={{ width: `${pct * 100}%` as any, height: '100%', backgroundColor: color, borderRadius: 2 }} />
        </View>
      ) : (
        <View style={{ height: 20, marginTop: 6, justifyContent: 'center' }}>
          <Text style={{ fontSize: 11, color: COLORS.green, fontWeight: '600' }}>↓ −0.3 kg</Text>
        </View>
      )}
    </View>
  );
}

// ── Meal row ──────────────────────────────────────────────────────────────
function MealRow({
  time,
  name,
  sub,
  kcal,
  accent,
  placeholder,
}: {
  time?: string;
  name: string;
  sub: string;
  kcal?: number;
  accent?: boolean;
  placeholder?: boolean;
}) {
  return (
    <View
      style={[
        styles.mealRow,
        accent && styles.mealRowAccent,
        placeholder && styles.mealRowPlaceholder,
      ]}
    >
      <View
        style={[
          styles.mealThumb,
          placeholder && styles.mealThumbPlaceholder,
        ]}
      >
        {placeholder && <Text style={{ color: COLORS.inkDim, fontSize: 18 }}>+</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.mealName, accent && styles.mealNameAccent]}>{name}</Text>
          {time && <Text style={styles.mealTime}>{time}</Text>}
          {accent && (
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green }} />
          )}
        </View>
        <Text style={styles.mealSub}>{sub}</Text>
      </View>
      {kcal != null ? (
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.mealKcal}>{kcal}</Text>
          <Text style={styles.mealKcalUnit}>kcal</Text>
        </View>
      ) : (
        <Text style={{ color: COLORS.inkDim, fontSize: 20 }}>+</Text>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (data) setUserName(data.full_name || '');
      }
    })();
  }, []);

  const today = new Date();
  const dayStr = today.toLocaleDateString('en-US', { weekday: 'short' }) +
    ' · ' + today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <MonoLabel>{dayStr}</MonoLabel>
            <Text style={styles.greeting}>
              Good morning{userName ? `, ${userName.split(' ')[0]}` : ''}
            </Text>
          </View>
          <View style={styles.avatar} />
        </View>

        {/* calorie ring card */}
        <View style={styles.ringCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            {/* simple ring approximation with nested Views */}
            <View style={styles.ringOuter}>
              <View style={styles.ringFill} />
              <View style={styles.ringInner}>
                <MonoLabel>Remaining</MonoLabel>
                <Text style={styles.ringNum}>828</Text>
                <Text style={styles.ringUnit}>of 2,180 kcal</Text>
              </View>
            </View>

            <View style={{ flex: 1, gap: 12 }}>
              <View>
                <MonoLabel>Eaten</MonoLabel>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                  <Text style={styles.ringStatVal}>1,352</Text>
                  <Text style={styles.ringStatUnit}>kcal</Text>
                </View>
              </View>
              <View>
                <MonoLabel>Burned</MonoLabel>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                  <Text style={styles.ringStatVal}>412</Text>
                  <Text style={styles.ringStatUnit}>kcal</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* macro bars */}
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <MacroBar label="Protein" used={108} target={180} color={COLORS.ink} />
            <MacroBar label="Carbs" used={142} target={200} color={COLORS.blue} />
            <MacroBar label="Fat" used={38} target={60} color={COLORS.green} />
          </View>
        </View>

        {/* AI insight */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiStar}>✦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <MonoLabel style={{ color: 'rgba(255,255,255,0.5)' }}>Zyra AI · Insight</MonoLabel>
            <Text style={styles.aiText}>
              You're on a 7-day streak.{' '}
              <Text style={{ color: COLORS.green }}>72g of protein</Text> left — try grilled ayam at
              lunch.
            </Text>
          </View>
        </View>

        {/* quick stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Water" value="1.4" unit="L / 2.5" pct={0.56} color={COLORS.blue} />
          <StatCard label="Steps" value="6,842" unit="/ 10k" pct={0.68} color={COLORS.ink} />
          <StatCard label="Weight" value="78.1" unit="kg" pct={1} color={COLORS.ink} trend />
          <StatCard label="Sleep" value="7h 12m" unit="last night" pct={0.85} color={COLORS.green} />
        </View>

        {/* today's meals */}
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Today's meals</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <View style={styles.mealsList}>
          <MealRow time="08:14" name="Breakfast" sub="Oats, banana, almond milk" kcal={412} />
          <MealRow time="12:38" name="Lunch" sub="Nasi lemak with ayam" kcal={680} accent />
          <MealRow time="15:20" name="Snack" sub="Greek yogurt + berries" kcal={260} />
          <MealRow placeholder name="Dinner" sub="Add a meal" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.ink,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7E7EA',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  ringCard: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  ringOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 14,
    borderColor: COLORS.inkFaint,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringFill: {
    position: 'absolute',
    top: -14,
    left: -14,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 14,
    borderColor: COLORS.ink,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-55deg' }],
  },
  ringInner: {
    alignItems: 'center',
  },
  ringNum: {
    fontSize: 44,
    fontWeight: '600',
    letterSpacing: -2,
    lineHeight: 48,
    color: COLORS.ink,
    marginTop: 4,
  },
  ringUnit: {
    fontSize: 12,
    color: COLORS.inkDim,
    marginTop: 4,
  },
  ringStatVal: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: COLORS.ink,
  },
  ringStatUnit: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 18,
  },
  aiCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    backgroundColor: COLORS.ink,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  aiStar: {
    color: COLORS.ink,
    fontWeight: '700',
  },
  aiText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginTop: 4,
    lineHeight: 22,
  },
  statsGrid: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: COLORS.ink,
  },
  statUnit: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
  mealsHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: COLORS.ink,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.blue,
  },
  mealsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 8,
  },
  mealRowAccent: {
    borderColor: COLORS.ink,
  },
  mealRowPlaceholder: {
    borderStyle: 'dashed',
  },
  mealThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F1F2',
  },
  mealThumbPlaceholder: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  mealNameAccent: {
    color: COLORS.ink,
  },
  mealTime: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
  mealSub: {
    fontSize: 12,
    color: COLORS.inkDim,
    marginTop: 2,
  },
  mealKcal: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  mealKcalUnit: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
});
