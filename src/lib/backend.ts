import { supabase } from "./supabase";

export type FoodLog = {
  id: string;
  food_item_id: string | null;
  meal_type: string | null;
  serving_size: string | null;
  grams: number | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  logged_at: string;
};

export type CreateFoodLogInput = {
  foodItemId?: string | null;
  mealType?: string | null;
  servingSize?: string | null;
  grams?: number | null;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  loggedAt?: string | null;
};

export async function healthCheck() {
  const { data, error } = await supabase.functions.invoke("health");

  if (error) {
    throw error;
  }

  return data as { status: string; service: string; timestamp: string };
}

export async function listFoodLogs() {
  const { data, error } = await supabase.functions.invoke("food-logs", {
    method: "GET",
  });

  if (error) {
    throw error;
  }

  return (data?.data ?? []) as FoodLog[];
}

export async function createFoodLog(input: CreateFoodLogInput) {
  const { data, error } = await supabase.functions.invoke("food-logs", {
    method: "POST",
    body: input,
  });

  if (error) {
    throw error;
  }

  return data?.data as FoodLog;
}

export async function deleteFoodLog(id: string) {
  const { data, error } = await supabase.functions.invoke(
    `food-logs?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  if (error) {
    throw error;
  }

  return data?.success === true;
}
