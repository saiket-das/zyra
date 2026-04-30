import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="macros" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="plan-ready" />
    </Stack>
  );
}
