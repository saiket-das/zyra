import { useState } from "react";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  async function signUpWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
    } else {
      if (data.session) {
        await saveOnboardingIfAny(data.session.user.id);
        router.replace("/(tabs)/dashboard");
      } else {
        Alert.alert(
          "Success",
          "Please check your email to verify your account.",
        );
        router.replace("/login");
      }
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
          <Text style={styles.title}>Join{"\n"}Zyra.</Text>
          <Text style={styles.subtitle}>
            Create an account and start your nutrition journey.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={COLORS.inkDim}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
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
            onPress={signUpWithEmail}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating account..." : "Sign up"}
          </PrimaryButton>
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.linkText}>Sign in</Text>
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
