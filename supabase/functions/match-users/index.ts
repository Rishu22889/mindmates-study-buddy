import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    const { user_id } = await req.json();

    if (user_id !== user.id) {
      throw new Error("User ID mismatch");
    }

    // Get current user's profile
    const { data: currentUser, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();

    if (userError || !currentUser) {
      throw new Error("User profile not found");
    }

    // Find potential matches based on exam_type and study_hours_goal
    const { data: potentialMatches, error: matchError } = await supabaseClient
      .from("users")
      .select("id, full_name, exam_type, study_hours_goal, create_at")
      .neq("id", user_id)
      .eq("exam_type", currentUser.exam_type);

    if (matchError) {
      throw new Error("Failed to find matches");
    }

    // Calculate compatibility scores and return top 5 matches
    const matches = potentialMatches
      .map(match => {
        // Simple compatibility algorithm based on study hours similarity
        const hoursDiff = Math.abs((currentUser.study_hours_goal || 0) - (match.study_hours_goal || 0));
        const compatibilityScore = Math.max(0, 100 - (hoursDiff * 10));
        
        return {
          ...match,
          compatibility_score: compatibilityScore
        };
      })
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, 5);

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in match-users function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});