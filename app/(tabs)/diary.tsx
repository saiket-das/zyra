import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/lib/theme';
import { MonoLabel } from '../../src/lib/ui';

const DAYS = [
  { d: 'Sat', n: 26 },
  { d: 'Sun', n: 27 },
  { d: 'Mon', n: 28 },
  { d: 'Tue', n: 29 },
  { d: 'Wed', n: 30, sel: true },
  { d: 'Thu', n: 1 },
  { d: 'Fri', n: 2 },
];

type MealItem = { n: string; d: string; k: number; star?: boolean };

const MEALS: { name: string; kcal: number; target: number; items: MealItem[] }[] = [
  {
    name: 'Breakfast',
    kcal: 412,
    target: 545,
    items: [
      { n: 'Rolled oats', d: '60g · with water', k: 220 },
      { n: 'Banana', d: '1 medium', k: 105 },
      { n: 'Almond milk', d: '200ml', k: 87 },
    ],
  },
  {
    name: 'Lunch',
    kcal: 680,
    target: 720,
    items: [{ n: 'Nasi lemak with ayam', d: '1 plate · 350g', k: 680, star: true }],
  },
  {
    name: 'Snack',
    kcal: 260,
    target: 220,
    items: [
      { n: 'Greek yogurt', d: '170g · 2% fat', k: 130 },
      { n: 'Mixed berries', d: '100g', k: 50 },
      { n: 'Honey', d: '1 tbsp', k: 80 },
    ],
  },
  { name: 'Dinner', kcal: 0, target: 695, items: [] },
];

function RoundIcon({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.roundIcon}>{children}</View>
  );
}

function Sep() {
  return <View style={{ width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.12)' }} />;
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.statLabel}>{l}</Text>
      <Text style={styles.statVal}>{v}</Text>
    </View>
  );
}

export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>Diary</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <RoundIcon>
                <Ionicons name="search-outline" size={16} color={COLORS.ink} />
              </RoundIcon>
              <RoundIcon>
                <Ionicons name="calendar-outline" size={16} color={COLORS.ink} />
              </RoundIcon>
            </View>
          </View>

          {/* date scroller */}
          <View style={styles.dateScroller}>
            {DAYS.map((day, i) => (
              <Pressable
                key={i}
                style={[styles.dayChip, day.sel && styles.dayChipSelected]}
              >
                <Text style={[styles.dayLetter, day.sel && styles.dayLetterSelected]}>
                  {day.d}
                </Text>
                <Text style={[styles.dayNum, day.sel && styles.dayNumSelected]}>{day.n}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* daily summary strip */}
        <View style={styles.strip}>
          <View>
            <Text style={styles.stripLabel}>Calories</Text>
            <Text style={styles.stripCal}>1,352 / 2,180</Text>
          </View>
          <Sep />
          <Stat l="P" v="108g" />
          <Sep />
          <Stat l="C" v="142g" />
          <Sep />
          <Stat l="F" v="38g" />
        </View>

        {/* meal blocks */}
        <View style={styles.mealBlocks}>
          {MEALS.map((m) => (
            <View key={m.name} style={styles.mealCard}>
              <View style={[styles.mealCardHeader, m.items.length > 0 && styles.mealCardHeaderBorder]}>
                <View>
                  <Text style={styles.mealName}>{m.name}</Text>
                  <Text style={styles.mealKcalMeta}>{m.kcal} / {m.target} kcal</Text>
                </View>
                <View style={styles.addBtn}>
                  <Ionicons name="add" size={12} color={COLORS.ink} />
                </View>
              </View>
              {m.items.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.itemRow,
                    i < m.items.length - 1 && styles.itemRowBorder,
                  ]}
                >
                  <View style={[styles.itemThumb, item.star && styles.itemThumbStar]}>
                    {item.star && (
                      <View style={styles.starDot} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.n}</Text>
                    <Text style={styles.itemDesc}>{item.d}</Text>
                  </View>
                  <Text style={styles.itemKcal}>
                    {item.k}
                    <Text style={styles.itemKcalUnit}> kcal</Text>
                  </Text>
                </View>
              ))}
            </View>
          ))}
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.ink,
  },
  roundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateScroller: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
  },
  dayChipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  dayLetter: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
  },
  dayLetterSelected: {
    color: 'rgba(255,255,255,0.6)',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: COLORS.ink,
    marginTop: 2,
  },
  dayNumSelected: {
    color: '#fff',
  },
  strip: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stripLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
  },
  stripCal: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: '#fff',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  mealBlocks: {
    padding: 16,
    gap: 12,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  mealCardHeader: {
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealCardHeaderBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: COLORS.ink,
  },
  mealKcalMeta: {
    fontSize: 11,
    color: COLORS.inkDim,
    marginTop: 2,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingHorizontal: 16,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  itemThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F1F2',
    position: 'relative',
  },
  itemThumbStar: {},
  starDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  itemDesc: {
    fontSize: 11,
    color: COLORS.inkDim,
    marginTop: 1,
  },
  itemKcal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  itemKcalUnit: {
    fontSize: 10,
    color: COLORS.inkDim,
    fontWeight: '400',
  },
});
