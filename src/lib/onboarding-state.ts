let pendingMainGoal: string | null = null;
let pendingProfileInput: OnboardingProfileInput | null = null;
let pendingDietInput: OnboardingDietInput | null = null;
let pendingMacroPlan: OnboardingMacroPlan | null = null;

export type OnboardingSex = "Female" | "Male" | "Other";

export type OnboardingProfileInput = {
  sex: OnboardingSex;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
};

export type OnboardingDietInput = {
  selectedDiets: string[];
  selectedAllergies: string[];
};

export type OnboardingMacroPlan = {
  dailyCalories: number;
  proteinG: number;
  proteinPct: number;
  carbsG: number;
  carbsPct: number;
  fatG: number;
  fatPct: number;
  waterL: number;
};

export function setPendingMainGoal(goal: string) {
  pendingMainGoal = goal;
}

export function getPendingMainGoal() {
  return pendingMainGoal;
}

export function clearPendingMainGoal() {
  pendingMainGoal = null;
}

export function setPendingProfileInput(input: OnboardingProfileInput) {
  pendingProfileInput = input;
}

export function getPendingProfileInput() {
  return pendingProfileInput;
}

export function clearPendingProfileInput() {
  pendingProfileInput = null;
}

export function setPendingDietInput(input: OnboardingDietInput) {
  pendingDietInput = input;
}

export function getPendingDietInput() {
  return pendingDietInput;
}

export function clearPendingDietInput() {
  pendingDietInput = null;
}

export function clearAllPendingData() {
  pendingMainGoal = null;
  pendingProfileInput = null;
  pendingDietInput = null;
  pendingMacroPlan = null;
}

export function setPendingMacroPlan(plan: OnboardingMacroPlan) {
  pendingMacroPlan = plan;
}

export function getPendingMacroPlan() {
  return pendingMacroPlan;
}

export function clearPendingMacroPlan() {
  pendingMacroPlan = null;
}
