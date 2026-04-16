import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);

    if (!caller) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Apenas admins" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all client user_ids
    const { data: clientRoles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "client");

    if (!clientRoles || clientRoles.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientUserIds = clientRoles.map((r: any) => r.user_id);

    // Get client_data, profiles, and emails
    const { data: clientData } = await supabaseAdmin
      .from("client_data")
      .select("*")
      .in("user_id", clientUserIds);

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", clientUserIds);

    // Get emails from auth
    const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    const emailMap = new Map<string, string>();
    authUsers?.forEach((u: any) => emailMap.set(u.id, u.email || ""));

    const enriched = (clientData || []).map((c: any) => {
      const profile = profiles?.find((p: any) => p.user_id === c.user_id);
      return {
        ...c,
        profile: profile || undefined,
        email: emailMap.get(c.user_id) || "",
      };
    });

    return new Response(JSON.stringify(enriched), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
