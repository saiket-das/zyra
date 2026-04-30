import { useState, useEffect } from "react";
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
      await savePendingGoalIfAny(
        data.session?.user?.id,
        data.session?.user?.user_metadata?.goal,
      );
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
          await savePendingGoalIfAny(
            session?.user?.id,
            session?.user?.user_metadata?.goal,
          );
          router.replace("/(tabs)/dashboard");
        }
      }
    } catch (e: any) {
      Alert.alert("Google Sign In Failed", e.message || "An error occurred.");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back to Zyra</Text>

      <View style={styles.form}>
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
          onPress={signInWithEmail}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <Pressable
          style={styles.googleButton}
          onPress={signInWithGoogle}
          disabled={loading}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.linkText}>Create one</Text>
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#1b2944",
  },
  dividerText: {
    color: "#a9b4c7",
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#f5f7fb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  googleButtonText: {
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
