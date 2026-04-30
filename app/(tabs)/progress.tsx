import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { COLORS } from '../../src/lib/theme';
import { MonoLabel } from '../../src/lib/ui';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MonoLabel>Apr 2026</MonoLabel>
          <Text style={styles.title}>Progress</Text>
        </View>

        {/* weight trajectory card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MonoLabel>Weight projection</MonoLabel>
            <Text style={styles.cardRange}>78kg → 86kg</Text>
          </View>

          {/* simple bar chart approximation */}
          <View style={styles.chartArea}>
            <View style={styles.chartBars}>
              {[74, 78, 70, 82, 68, 86, 72, 90, 66, 94, 62, 98].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.chartBar,
                    { height: h / 2, backgroundColor: i === 11 ? COLORS.green : COLORS.inkFaint },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Today</Text>
              <Text style={styles.chartLabel}>Apr</Text>
              <Text style={styles.chartLabel}>Jun</Text>
              <Text style={[styles.chartLabel, { color: COLORS.green }]}>Sept '26</Text>
            </View>
          </View>
        </View>

        {/* stats row */}
        <View style={styles.statsRow}>
          {[
            { l: 'kcal/day', v: '2,180' },
            { l: 'Protein', v: '180g' },
            { l: 'Cadence', v: '+0.3kg/wk' },
          ].map((s) => (
            <View key={s.l} style={styles.statBox}>
              <MonoLabel>{s.l}</MonoLabel>
              <Text style={styles.statVal}>{s.v}</Text>
            </View>
          ))}
        </View>

        {/* coming soon placeholder */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Detailed charts coming soon</Text>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.ink,
    marginTop: 2,
  },
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardRange: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
  chartArea: {
    height: 80,
    gap: 8,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  chartBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 10,
    color: COLORS.inkDim,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  statsRow: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: COLORS.ink,
    marginTop: 4,
  },
  placeholder: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.inkDim,
  },
});
