import { corsHeaders, withCors } from "../_shared/cors.ts";

Deno.serve((_req) => {
  const response = Response.json(
    {
      status: "ok",
      service: "zyra-backend",
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders },
  );

  return withCors(response);
});
