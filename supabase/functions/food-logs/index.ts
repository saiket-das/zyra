import { corsHeaders, withCors } from "../_shared/cors.ts";
import { requireUser } from "../_shared/auth.ts";

type CreateFoodLogPayload = {
  foodItemId?: string | null;
  mealType?: string | null;
  servingSize?: string | null;
  grams?: number | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  loggedAt?: string | null;
};

function badRequest(message: string) {
  return withCors(
    Response.json(
      {
        error: message,
      },
      { status: 400, headers: corsHeaders },
    ),
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { user, supabase, error } = await requireUser(req);

  if (error || !user) {
    return withCors(
      Response.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders },
      ),
    );
  }

  if (req.method === "GET") {
    const { data, error: queryError } = await supabase
      .from("food_logs")
      .select(
        "id, food_item_id, meal_type, serving_size, grams, calories, protein, carbs, fat, logged_at",
      )
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(100);

    if (queryError) {
      return withCors(
        Response.json(
          { error: queryError.message },
          { status: 500, headers: corsHeaders },
        ),
      );
    }

    return withCors(Response.json({ data }, { headers: corsHeaders }));
  }

  if (req.method === "POST") {
    let payload: CreateFoodLogPayload;

    try {
      payload = (await req.json()) as CreateFoodLogPayload;
    } catch {
      return badRequest("Body must be valid JSON");
    }

    if (payload.calories === undefined || payload.calories === null) {
      return badRequest("calories is required");
    }

    const insertRow = {
      user_id: user.id,
      food_item_id: payload.foodItemId ?? null,
      meal_type: payload.mealType ?? null,
      serving_size: payload.servingSize ?? null,
      grams: payload.grams ?? null,
      calories: payload.calories,
      protein: payload.protein ?? null,
      carbs: payload.carbs ?? null,
      fat: payload.fat ?? null,
      logged_at: payload.loggedAt ?? new Date().toISOString(),
    };

    const { data, error: insertError } = await supabase
      .from("food_logs")
      .insert(insertRow)
      .select(
        "id, food_item_id, meal_type, serving_size, grams, calories, protein, carbs, fat, logged_at",
      )
      .single();

    if (insertError) {
      return withCors(
        Response.json(
          { error: insertError.message },
          { status: 500, headers: corsHeaders },
        ),
      );
    }

    return withCors(
      Response.json({ data }, { status: 201, headers: corsHeaders }),
    );
  }

  if (req.method === "DELETE") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return badRequest("id query parameter is required");
    }

    const { error: deleteError } = await supabase
      .from("food_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return withCors(
        Response.json(
          { error: deleteError.message },
          { status: 500, headers: corsHeaders },
        ),
      );
    }

    return withCors(Response.json({ success: true }, { headers: corsHeaders }));
  }

  return withCors(
    Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    ),
  );
});
