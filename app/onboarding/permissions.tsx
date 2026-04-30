import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS } from '../../src/lib/theme';
import { ScreenChrome, PrimaryButton, Toggle } from '../../src/lib/ui';

const PERMS = [
  {
    mono: 'MIC',
    title: 'Microphone',
    sub: 'For voice meal logging — say "2 eggs and teh tarik"',
    on: true,
    accent: true,
  },
  {
    mono: 'CAM',
    title: 'Camera',
    sub: 'For barcode and AI meal scanning',
    on: true,
    accent: false,
  },
  {
    mono: 'NTF',
    title: 'Notifications',
    sub: 'Reminders, weekly insights, streak protection',
    on: true,
    accent: false,
  },
  {
    mono: 'HLT',
    title: 'Apple Health',
    sub: 'Sync steps, workouts, weight, sleep',
    on: false,
    accent: false,
  },
  {
    mono: 'LOC',
    title: 'Location',
    sub: 'Optional — for restaurant meal suggestions',
    on: false,
    accent: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const [perms, setPerms] = useState(
    PERMS.reduce((acc, p) => ({ ...acc, [p.title]: p.on }), {} as Record<string, boolean>)
  );

  const togglePerm = (title: string) => {
    setPerms((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <ScreenChrome step={6} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>A few permissions.</Text>
        <Text style={styles.subtitle}>Enable what you need. You can change these later.</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {PERMS.map((p) => (
          <Pressable key={p.title} onPress={() => togglePerm(p.title)}>
            <View style={[styles.row, p.accent && styles.rowAccent]}>
              <View style={[styles.iconBox, p.accent && styles.iconBoxAccent]}>
                <Text style={[styles.mono, p.accent && styles.monoAccent]}>{p.mono}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.permTitle}>{p.title}</Text>
                <Text style={styles.permSub}>{p.sub}</Text>
              </View>
              <Toggle on={perms[p.title]} />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={() => router.push('/onboarding/plan-ready')}>
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
  list: {
    padding: 20,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  rowAccent: {
    borderColor: COLORS.ink,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxAccent: {
    backgroundColor: COLORS.ink,
  },
  mono: {
    fontFamily: 'monospace' as any,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
    color: COLORS.ink,
  },
  monoAccent: {
    color: '#fff',
  },
  permTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  permSub: {
    fontSize: 12,
    color: COLORS.inkDim,
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
  },
});
