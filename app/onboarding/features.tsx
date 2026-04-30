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

const features = [
  {
    id: "voice",
    title: "Voice Log",
    description: "Simply speak your meal, and AI handles the rest",
  },
  {
    id: "scan",
    title: "Scan & Analyze",
    description: "Take a photo of your meal for instant nutrition insights",
  },
  {
    id: "precision",
    title: "Precision Tracking",
    description: "From nasi lemak to chicken breast, we've got it covered",
  },
];

export default function OnboardingFeaturesScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = async () => {
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/onboarding/features-grid");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.back();
    }
  };

  const currentFeature = features[currentIndex];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 48,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    headerLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textTertiary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 24,
    },
    logo: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: 12,
    },
    title: {
      fontSize: 42,
      fontWeight: "800",
      lineHeight: 50,
      textAlign: "center",
      color: theme.colors.text,
    },
    titleAccent: {
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      color: theme.colors.textSecondary,
      marginTop: 16,
    },
    imageCard: {
      width: 140,
      height: 140,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 32,
    },
    imageCardText: {
      fontSize: 11,
      color: theme.colors.textTertiary,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: "600",
      textAlign: "center",
    },
    footer: {
      gap: 16,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "700",
    },
    primaryButtonText: {
      color: theme.colors.background,
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
    progressContainer: {
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textTertiary,
    },
    progressDotActive: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>AI NUTRITION · 2026</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {currentIndex + 1} OF {features.length}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.logo}>Z</Text>
        <Text style={styles.title}>
          Your AI
          {"\n"}
          <Text style={styles.titleAccent}>nutrition</Text>
          {"\n"}coach.
        </Text>
        <Text style={styles.subtitle}>{currentFeature.description}</Text>

        <View style={styles.imageCard}>
          <Text style={styles.imageCardText}>
            {currentFeature.id.toUpperCase()}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={handleBack}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {currentIndex === features.length - 1 ? "Next" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
