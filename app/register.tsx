import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "../src/lib/supabase";
import {
  clearPendingMainGoal,
  getPendingMainGoal,
} from "../src/lib/onboarding-state";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const savePendingGoalIfAny = async (
    userId?: string,
    metadataGoal?: string,
  ) => {
    if (!userId) return;

    const pendingGoal = getPendingMainGoal() ?? metadataGoal;
    if (!pendingGoal) return;

    const { error } = await supabase
      .from("users")
      .update({ goal: pendingGoal })
      .eq("id", userId)
      .is("goal", null);

    if (!error) {
      clearPendingMainGoal();
    }
  };

  async function signUpWithEmail() {
    setLoading(true);
    const pendingGoal = getPendingMainGoal();
    const { error, data } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          goal: pendingGoal,
        },
      },
    });

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
    } else {
      if (data.session) {
        await savePendingGoalIfAny(
          data.session.user.id,
          data.session.user.user_metadata?.goal,
        );
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
    <View style={styles.container}>
      <Text style={styles.title}>Join Zyra</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#a9b4c7"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#a9b4c7"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a9b4c7"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={signUpWithEmail}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating account..." : "Sign up"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.linkText}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08111f",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: "#f5f7fb",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#101b2f",
    color: "#f5f7fb",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1b2944",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#7ee7c8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#08111f",
    fontWeight: "800",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  footerText: {
    color: "#a9b4c7",
    fontSize: 14,
  },
  linkText: {
    color: "#7ee7c8",
    fontSize: 14,
    fontWeight: "600",
  },
});
