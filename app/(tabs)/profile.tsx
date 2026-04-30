import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    } else {
      router.replace("/login");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.content}>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08111f",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    color: "#f5f7fb",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
  },
  content: {
    flex: 1,
    gap: 16,
  },
  signOutButton: {
    backgroundColor: "#1b2944",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  signOutText: {
    color: "#ff6b6b",
    fontWeight: "700",
    fontSize: 16,
  },
});
