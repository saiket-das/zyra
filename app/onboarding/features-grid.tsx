import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { darkTheme, lightTheme } from "../../src/lib/theme";

const gridFeatures = [
  { id: "nasi", label: "NASI LEMAK" },
  { id: "voice", label: "VOICE LOG" },
  { id: "macros", label: "MACROS" },
  { id: "speed", label: "5s LOG" },
];

export default function OnboardingFeaturesGridScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push("/login");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 48,
    },
    scrollContent: {
      paddingHorizontal: 8,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 24,
    },
    gridItem: {
      flexBasis: "48%",
      height: 160,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    gridItemActive: {
      backgroundColor: theme.colors.primary,
    },
    gridItemText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
    },
    gridItemTextActive: {
      color: theme.colors.background,
    },
    content: {
      gap: 16,
      alignItems: "center",
      marginVertical: 32,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      lineHeight: 42,
      textAlign: "center",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginVertical: 16,
    },
    ratingDots: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textTertiary,
    },
    statsText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    button: {
      width: "100%",
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.background,
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.textTertiary,
      textAlign: "center",
      marginTop: 12,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {gridFeatures.map((feature, index) => (
            <View
              key={feature.id}
              style={[styles.gridItem, index === 3 && styles.gridItemActive]}
            >
              <Text
                style={[
                  styles.gridItemText,
                  index === 3 && styles.gridItemTextActive,
                ]}
              >
                {feature.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>The fastest{"\n"}nutrition tracker.</Text>

          <View style={styles.statsContainer}>
            <View style={styles.ratingDots}>
              {[0, 1, 2, 3].map((index) => (
                <View key={index} style={styles.dot} />
              ))}
              <Text style={styles.statsText}>Loved by 240k+ in Asia</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleGetStarted}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

      <Text style={styles.footerText}>
        Takes about 60 seconds • No account needed
      </Text>
    </Animated.View>
  );
}
