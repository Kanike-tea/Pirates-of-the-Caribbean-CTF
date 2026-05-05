import { type NextRequest } from "next/server";
import { challenges } from "@/lib/challenges";
import { createClient } from "@supabase/supabase-js";

// In-memory rate-limiter: { [teamId]: { count, windowStart } }
const rateLimitMap = new Map<
  string,
  { count: number; windowStart: number }
>();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // slightly higher for hints

function isRateLimited(teamId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(teamId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(teamId, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, challengeId } = body as {
      teamId: string;
      challengeId: number;
    };

    if (!teamId || !challengeId) {
      return Response.json(
        { error: "Missing required fields: teamId, challengeId" },
        { status: 400 }
      );
    }

    if (isRateLimited(teamId)) {
      return Response.json(
        { error: "Ye be asking for too much help too fast!", rateLimited: true },
        { status: 429 }
      );
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return Response.json({ error: "Challenge not found" }, { status: 404 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ hint: challenge.hint, message: "Database not configured. Hint provided free of charge." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: team, error: fetchError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (fetchError || !team) {
      return Response.json({ error: "Team not found" }, { status: 404 });
    }

    const completedChallenges: number[] = team.completed_challenges || [];
    const hintMarker = challengeId + 100;

    // If already solved without hint or with hint, just return the hint without penalty
    // Wait, if they ALREADY used the hint, we shouldn't deduct points again.
    if (completedChallenges.includes(hintMarker)) {
      return Response.json({ hint: challenge.hint, message: "Hint already unlocked." });
    }

    // Deduct points by adding the hint marker
    const newCompleted = [...completedChallenges, hintMarker];

    const { error: updateError } = await supabase
      .from("teams")
      .update({ completed_challenges: newCompleted })
      .eq("id", teamId);

    if (updateError) {
      return Response.json({ error: "Failed to update the ship's log" }, { status: 500 });
    }

    return Response.json({
      hint: challenge.hint,
      message: "Hint unlocked! 5 points deducted.",
      penaltyApplied: true,
    });
  } catch {
    return Response.json({ error: "The seas are troubled — server error" }, { status: 500 });
  }
}
