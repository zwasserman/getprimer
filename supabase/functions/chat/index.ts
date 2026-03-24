import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildHomeContext(profile: Record<string, unknown> | null, documents: Record<string, unknown>[]): string {
  if (!profile && documents.length === 0) return "";

  let ctx = "\n\n--- HOME CONTEXT (use this to personalize answers) ---\n";

  if (profile) {
    const parts: string[] = [];
    if (profile.address_line) parts.push(`Address: ${profile.address_line}, ${profile.city || ""} ${profile.state || ""} ${profile.zip || ""}`);
    if (profile.property_type) parts.push(`Property type: ${profile.property_type}`);
    if (profile.year_built) parts.push(`Year built: ${profile.year_built}`);
    if (profile.square_footage) parts.push(`Square footage: ${profile.square_footage}`);
    if (profile.bedrooms) parts.push(`Bedrooms: ${profile.bedrooms}`);
    if (profile.bathrooms) parts.push(`Bathrooms: ${profile.bathrooms}`);
    if (profile.stories) parts.push(`Stories: ${profile.stories}`);
    if (profile.heating_type) parts.push(`Heating: ${profile.heating_type}`);
    if (profile.cooling_type) parts.push(`Cooling: ${profile.cooling_type}`);
    if (profile.water_heater_type) parts.push(`Water heater: ${profile.water_heater_type}${profile.water_heater_age ? ` (${profile.water_heater_age} years old)` : ""}`);
    if (profile.roof_type) parts.push(`Roof: ${profile.roof_type}${profile.roof_age ? ` (${profile.roof_age} years old)` : ""}`);
    if (profile.foundation_type) parts.push(`Foundation: ${profile.foundation_type}`);
    if (profile.exterior_type) parts.push(`Exterior: ${profile.exterior_type}`);
    if (profile.electrical_panel_amps) parts.push(`Electrical panel: ${profile.electrical_panel_amps} amps`);
    if (profile.climate_zone) parts.push(`Climate zone: ${profile.climate_zone}`);

    const features: string[] = [];
    const featureMap: Record<string, string> = {
      has_basement: "basement", has_garage: "garage", has_fireplace: "fireplace",
      has_pool: "pool", has_sump_pump: "sump pump", has_sprinkler_system: "sprinkler system",
      has_lawn: "lawn", has_deck: "deck", has_septic: "septic system",
      has_ceiling_fans: "ceiling fans", has_furnace_humidifier: "furnace humidifier",
      has_central_ac: "central AC", has_gas: "gas service", has_hoa: "HOA",
    };
    for (const [key, label] of Object.entries(featureMap)) {
      if (profile[key] === true) features.push(label);
    }
    if (features.length > 0) parts.push(`Features: ${features.join(", ")}`);

    ctx += "Home Profile:\n" + parts.map(p => `• ${p}`).join("\n") + "\n";
  }

  if (documents.length > 0) {
    ctx += "\nDocuments on file:\n";
    for (const doc of documents) {
      let line = `• ${doc.title} (${doc.category})`;
      if (doc.appliance_name) line += ` — ${doc.appliance_name}`;
      if (doc.expiration_date) line += ` — expires ${doc.expiration_date}`;
      ctx += line + "\n";
    }
  }

  ctx += "--- END HOME CONTEXT ---";
  return ctx;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Authentication (optional — anon access allowed for prototyping) ---
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) userId = user.id;
    }

    // --- Input Validation ---
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, mockDocuments: clientDocs, homeSystems: clientSystems } = body;

    if (messages.length === 0 || messages.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array must contain 1-100 items" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const msg of messages) {
      if (!msg || typeof msg !== "object") {
        return new Response(
          JSON.stringify({ error: "Invalid request: each message must be an object" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!msg.role || typeof msg.role !== "string" || !["user", "assistant"].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: role must be "user" or "assistant"' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid request: each message must have content string" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: "Invalid request: message content too long (max 10,000 characters)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // --- Fetch home context using service role ---
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let homeProfile: Record<string, unknown> | null = null;
    let homeDocuments: Record<string, unknown>[] = [];

    // Fetch first available home profile (or user-specific if authenticated)
    const profileQuery = serviceClient.from("home_profiles").select("*").limit(1);
    if (userId) profileQuery.eq("user_id", userId);
    const { data: profiles } = await profileQuery;
    if (profiles && profiles.length > 0) {
      homeProfile = profiles[0];

      // Fetch documents for this home
      const { data: docs } = await serviceClient
        .from("home_documents")
        .select("title, category, appliance_name, expiration_date, description")
        .eq("home_id", (homeProfile as any).id)
        .limit(50);
      if (docs) homeDocuments = docs;
    }

    const homeContext = buildHomeContext(homeProfile, homeDocuments, clientDocs, clientSystems);

    // --- AI Gateway ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Mira, a friendly and knowledgeable home maintenance assistant. You help homeowners understand and complete home maintenance tasks.

Your personality:
- Warm, encouraging, and practical
- You explain things simply without being condescending
- You use occasional emojis but don't overdo it
- You keep answers concise (2-4 sentences for simple questions, more for complex how-tos)

Your expertise covers: HVAC, plumbing, electrical, safety systems, exterior maintenance, appliances, and general home care.

When answering:
- Give actionable, specific advice
- Mention when something should be left to a professional
- If asked about something dangerous (gas leaks, electrical panels), always recommend calling a pro
- Reference seasonal timing when relevant
- Use the home context below to personalize your answers — reference their specific systems, features, and documents when relevant
- If they ask about something their home doesn't have (based on the profile), let them know

You are NOT a general-purpose AI. If asked about non-home topics, gently redirect: "I'm best at home maintenance stuff! Got any questions about your house?"${homeContext}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
