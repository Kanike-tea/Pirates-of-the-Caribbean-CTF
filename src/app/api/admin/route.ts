import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, adminPassword, teamId } = await req.json();

    // Verify Admin Password
    const expectedPassword = process.env.ADMIN_PASSWORD || "blackpearl2026";
    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized: Incorrect password" }, { status: 401 });
    }

    if (action === "reset_team") {
      if (!teamId) return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
      const { error } = await supabaseAdmin
        .from("teams")
        .update({ progress: 0, completed_challenges: [], finished_at: null, started_at: null })
        .eq("id", teamId);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Team reset successfully." });
    }

    if (action === "delete_team") {
      if (!teamId) return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
      const { error } = await supabaseAdmin.from("teams").delete().eq("id", teamId);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Team deleted successfully." });
    }

    if (action === "reset_all") {
      const { error } = await supabaseAdmin
        .from("teams")
        .update({ progress: 0, completed_challenges: [], finished_at: null, started_at: null })
        .not("id", "is", null);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "All teams reset successfully." });
    }

    if (action === "delete_all") {
      const { error } = await supabaseAdmin
        .from("teams")
        .delete()
        .not("id", "is", null);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "All teams deleted successfully." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal server error" }, { status: 500 });
  }
}
