import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './theme';

// ── Logomark: geometric Z + neon dot ─────────────────────────────────────────
export function Logomark({ size = 28, color = COLORS.ink }: { size?: number; color?: string }) {
  const dot = Math.round(size * 0.2);
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Text
        style={{
          fontSize: size * 0.85,
          fontWeight: '700',
          color,
          lineHeight: size,
          letterSpacing: -size * 0.04,
        }}
      >
        Z
      </Text>
      <View
        style={{
          position: 'absolute',
          top: 1,
          right: 0,
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: COLORS.green,
        }}
      />
    </View>
  );
}

// ── Step progress dots ─────────────────────────────────────────────────────
export function StepDots({
  step = 1,
  total = 7,
  dark = false,
}: {
  step?: number;
  total?: number;
  dark?: boolean;
}) {
  const activeColor = dark ? '#fff' : COLORS.ink;
  const inactiveColor = dark ? 'rgba(255,255,255,0.2)' : 'rgba(10,10,11,0.12)';
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i + 1 === step ? 22 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i + 1 <= step ? activeColor : inactiveColor,
          }}
        />
      ))}
    </View>
  );
}

// ── Screen chrome (top nav with back + dots + skip) ───────────────────────
export function ScreenChrome({
  step,
  total = 7,
  onBack,
  dark = false,
  children,
}: {
  step?: number;
  total?: number;
  onBack?: () => void;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const dimColor = dark ? 'rgba(255,255,255,0.6)' : COLORS.inkDim;
  const borderColor = dark ? 'rgba(255,255,255,0.12)' : COLORS.line;
  const iconColor = dark ? '#fff' : COLORS.ink;

  return (
    <View style={{ flex: 1, backgroundColor: dark ? COLORS.bgDark : COLORS.bg }}>
      <View style={[styles.chromeBar]}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={[styles.backBtn, { borderColor }]}
          >
            <Ionicons name="chevron-back" size={16} color={iconColor} />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
        {step != null ? <StepDots step={step} total={total} dark={dark} /> : <View />}
        <Text style={[styles.skipText, { color: dimColor }]}>Skip</Text>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

// ── Buttons ───────────────────────────────────────────────────────────────
export function PrimaryButton({
  children,
  onPress,
  color = COLORS.ink,
  fg = '#fff',
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  color?: string;
  fg?: string;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        { backgroundColor: color, opacity: pressed || disabled ? 0.75 : 1 },
        style,
      ]}
    >
      <Text style={[styles.primaryBtnText, { color: fg }]}>{children}</Text>
    </Pressable>
  );
}

export function GhostButton({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghostBtn, { opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Text style={styles.ghostBtnText}>{children}</Text>
    </Pressable>
  );
}

// ── Striped placeholder (simulates photo) ────────────────────────────────
export function PhotoPlaceholder({
  label,
  height = 120,
  dark = false,
  accent = false,
  style,
}: {
  label: string;
  height?: number;
  dark?: boolean;
  accent?: boolean;
  style?: ViewStyle;
}) {
  const stripeA = dark ? '#161618' : '#F1F1F2';
  const stripeB = dark ? '#1E1E22' : '#E7E7EA';
  return (
    <View
      style={[
        {
          height,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: stripeA,
          borderWidth: 1,
          borderColor: dark ? 'rgba(255,255,255,0.06)' : COLORS.line,
          justifyContent: 'flex-end',
          padding: 8,
        },
        style,
      ]}
    >
      {/* diagonal stripe pattern approximated with alternating opacity rows */}
      {Array.from({ length: Math.ceil(height / 12) + 1 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: i * 12,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: stripeB,
            opacity: 0.7,
          }}
        />
      ))}
      {accent && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.green,
          }}
        />
      )}
      <Text
        style={{
          fontFamily: 'monospace' as any,
          fontSize: 10,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(10,10,11,0.45)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ── iOS-style toggle ──────────────────────────────────────────────────────
export function Toggle({ on = false }: { on?: boolean }) {
  return (
    <View
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: on ? COLORS.ink : '#E5E5E7',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 20 : 2,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        }}
      />
    </View>
  );
}

// ── Radio circle ──────────────────────────────────────────────────────────
export function RadioCircle({ selected = false }: { selected?: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: selected ? '#fff' : 'rgba(10,10,11,0.18)',
        backgroundColor: selected ? '#fff' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected && (
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.ink }} />
      )}
    </View>
  );
}

// ── Macro progress bar ────────────────────────────────────────────────────
export function MacroBar({
  label,
  used,
  target,
  color,
}: {
  label: string;
  used: number;
  target: number;
  color: string;
}) {
  const pct = Math.min(used / target, 1);
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.monoLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 4 }}>
        <Text style={styles.macroValue}>{used}</Text>
        <Text style={styles.macroUnit}>/{target}g</Text>
      </View>
      <View style={{ height: 4, backgroundColor: COLORS.inkFaint, borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%` as any, height: '100%', backgroundColor: color, borderRadius: 2 }} />
      </View>
    </View>
  );
}

// ── Section label (mono uppercase) ───────────────────────────────────────
export function MonoLabel({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <Text style={[styles.monoLabel, style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  chromeBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  ghostBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.inkDim,
  },
  monoLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.inkDim,
  },
  macroValue: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: -0.4,
    color: COLORS.ink,
  },
  macroUnit: {
    fontSize: 11,
    color: COLORS.inkDim,
  },
});
