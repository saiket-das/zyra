import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "../src/lib/supabase";
import { COLORS } from "../src/lib/theme";
import { ScreenChrome, PrimaryButton, GhostButton } from "../src/lib/ui";
import {
  clearAllPendingData,
  getPendingMainGoal,
  getPendingProfileInput,
  getPendingDietInput,
  getPendingMacroPlan,
} from "../src/lib/onboarding-state";
import { saveOnboardingData } from "../src/lib/backend";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectTo = makeRedirectUri();

  const saveOnboardingIfAny = async (userId?: string) => {
    if (!userId) return;

    const goal = getPendingMainGoal();
    const profile = getPendingProfileInput();
    const diet = getPendingDietInput();
    const macroPlan = getPendingMacroPlan() ?? undefined;

    if (!goal || !profile || !diet) return;

    try {
      await saveOnboardingData(userId, goal, profile, diet, macroPlan);
      clearAllPendingData();
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  };

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  };

  async function signInWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Sign In Failed", error.message);
    } else {
      await saveOnboardingIfAny(data.session?.user?.id);
      router.replace("/(tabs)/dashboard");
    }
    setLoading(false);
  }

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (res.type === "success") {
          const { url } = res;
          const session = await createSessionFromUrl(url);
          await saveOnboardingIfAny(session?.user?.id);
          router.replace("/(tabs)/dashboard");
        }
      }
    } catch (e: any) {
      Alert.alert("Google Sign In Failed", e.message || "An error occurred.");
    }
    setLoading(false);
  }

  return (
    <ScreenChrome onBack={() => router.back()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome{"\n"}back.</Text>
          <Text style={styles.subtitle}>
            Sign in to your account to access your nutrition plan.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={COLORS.inkDim}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.inkDim}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            onPress={signInWithEmail}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Signing in..." : "Sign in"}
          </PrimaryButton>

          <GhostButton onPress={signInWithGoogle} style={styles.button}>
            Sign in with Google
          </GhostButton>
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.linkText}>Create one</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </ScreenChrome>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
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
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 20,
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
    color: COLORS.ink,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  footerText: {
    color: COLORS.inkDim,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "600",
  },
});
