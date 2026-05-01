import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { COLORS } from "../../src/lib/theme";
import { ScreenChrome, PrimaryButton, Toggle } from "../../src/lib/ui";

type PermissionKey =
  | "microphone"
  | "camera"
  | "notifications"
  | "health"
  | "location";

const PERMS = [
  {
    key: "microphone" as PermissionKey,
    mono: "MIC",
    title: "Microphone",
    sub: 'For voice meal logging — say "2 eggs and teh tarik"',
    on: true,
    accent: true,
  },
  {
    key: "camera" as PermissionKey,
    mono: "CAM",
    title: "Camera",
    sub: "For barcode and AI meal scanning",
    on: true,
    accent: false,
  },
  {
    key: "notifications" as PermissionKey,
    mono: "NTF",
    title: "Notifications",
    sub: "Reminders, weekly insights, streak protection",
    on: true,
    accent: false,
  },
  {
    key: "health" as PermissionKey,
    mono: "HLT",
    title: "Apple Health",
    sub: "Sync steps, workouts, weight, sleep",
    on: false,
    accent: false,
  },
  {
    key: "location" as PermissionKey,
    mono: "LOC",
    title: "Location",
    sub: "Optional — for restaurant meal suggestions",
    on: false,
    accent: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [perms, setPerms] = useState(
    PERMS.reduce(
      (acc, p) => ({ ...acc, [p.key]: p.on }),
      {} as Record<PermissionKey, boolean>,
    ),
  );

  async function requestPermission(key: PermissionKey) {
    if (key === "camera") {
      const result = await Camera.requestCameraPermissionsAsync();
      return result.granted;
    }

    if (key === "microphone") {
      const result = await Camera.requestMicrophonePermissionsAsync();
      return result.granted;
    }

    if (key === "notifications") {
      const result = await Notifications.requestPermissionsAsync();
      return (
        result.granted ||
        result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
      );
    }

    if (key === "location") {
      const result = await Location.requestForegroundPermissionsAsync();
      return result.granted;
    }

    // Apple Health requires a dedicated native integration and cannot be requested directly in Expo here.
    if (key === "health") {
      if (Platform.OS === "ios") {
        Alert.alert(
          "Apple Health",
          "Apple Health access requires HealthKit integration. You can connect it later from settings.",
        );
      }
      return false;
    }

    return false;
  }

  async function togglePerm(key: PermissionKey) {
    if (busy) return;

    const currentlyOn = perms[key];
    if (currentlyOn) {
      // Apps cannot revoke OS-level permission directly; this turns off app usage preference.
      setPerms((prev) => ({ ...prev, [key]: false }));
      return;
    }

    setBusy(true);
    try {
      const granted = await requestPermission(key);
      setPerms((prev) => ({ ...prev, [key]: granted }));
      if (!granted && key !== "health") {
        Alert.alert(
          "Permission not granted",
          "You can allow it later from device settings.",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Open settings",
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleContinue() {
    if (busy) return;

    setBusy(true);
    try {
      const next = { ...perms };

      for (const perm of PERMS) {
        if (!next[perm.key]) {
          next[perm.key] = await requestPermission(perm.key);
        }
      }

      setPerms(next);
      router.push("/onboarding/plan-ready");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenChrome step={6} onBack={() => router.back()}>
      <View style={styles.header}>
        <Text style={styles.title}>A few permissions.</Text>
        <Text style={styles.subtitle}>
          Enable what you need. You can change these later.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {PERMS.map((p) => (
          <Pressable key={p.key} onPress={() => togglePerm(p.key)}>
            <View style={[styles.row, p.accent && styles.rowAccent]}>
              <View style={[styles.iconBox, p.accent && styles.iconBoxAccent]}>
                <Text style={[styles.mono, p.accent && styles.monoAccent]}>
                  {p.mono}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.permTitle}>{p.title}</Text>
                <Text style={styles.permSub}>{p.sub}</Text>
              </View>
              <Toggle on={perms[p.key]} />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleContinue} disabled={busy}>
          {busy ? "Requesting..." : "Continue"}
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
  list: {
    padding: 20,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  rowAccent: {
    borderColor: COLORS.ink,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxAccent: {
    backgroundColor: COLORS.ink,
  },
  mono: {
    fontFamily: "monospace" as any,
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 0.4,
    color: COLORS.ink,
  },
  monoAccent: {
    color: "#fff",
  },
  permTitle: {
    fontSize: 15,
    fontWeight: "600",
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
