import { type NextRequest } from "next/server";
import { challenges } from "@/lib/challenges";
import { createClient } from "@supabase/supabase-js";

// In-memory rate-limiter: { [teamId]: { count, windowStart } }
const rateLimitMap = new Map<
  string,
  { count: number; windowStart: number }
>();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 attempts per minute per team

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

/**
 * POST /api/check-answer
 *
 * Body: { teamId: string, challengeId: number, answer: string }
 *
 * Validates the answer server-side and updates team progress in Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, challengeId, answer } = body as {
      teamId: string;
      challengeId: number;
      answer: string;
    };

    // Validate required fields
    if (!teamId || !challengeId || !answer) {
      return Response.json(
        { error: "Missing required fields: teamId, challengeId, answer" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (isRateLimited(teamId)) {
      return Response.json(
        {
          error:
            "Ye be firing too fast, matey! Wait a minute before trying again.",
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Find the challenge
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return Response.json(
        { error: "Challenge not found in the seven seas" },
        { status: 404 }
      );
    }

    // Validate the answer (exact match, trimmed)
    const isCorrect = answer.trim() === challenge.flag;

    if (!isCorrect) {
      return Response.json({
        correct: false,
        message:
          "Wrong answer, scallywag! The seas don't yield their secrets easily.",
      });
    }

    // Correct answer — update Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // If Supabase is not configured, return success without DB update
      return Response.json({
        correct: true,
        message:
          "Correct! The treasure reveals itself! (Database not configured)",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch current team data
    const { data: team, error: fetchError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (fetchError || !team) {
      return Response.json(
        { error: "Team not found in the crew roster" },
        { status: 404 }
      );
    }

    // Check if challenge already completed
    const completedChallenges: number[] = team.completed_challenges || [];
    if (completedChallenges.includes(challengeId)) {
      return Response.json({
        correct: true,
        alreadyCompleted: true,
        message: "Ye've already claimed this treasure, captain!",
      });
    }

    // Update team progress
    const newCompleted = [...completedChallenges, challengeId];
    const actualCompleted = newCompleted.filter(id => id >= 1 && id <= 100);
    const newProgress = actualCompleted.length;
    const finishedAt = newProgress >= 10 ? new Date().toISOString() : null;

    const { error: updateError } = await supabase
      .from("teams")
      .update({
        completed_challenges: newCompleted,
        progress: newProgress,
        ...(finishedAt ? { finished_at: finishedAt } : {}),
      })
      .eq("id", teamId);

    if (updateError) {
      return Response.json(
        { error: "Failed to update the ship's log" },
        { status: 500 }
      );
    }

    return Response.json({
      correct: true,
      message:
        newProgress >= 10
          ? "THE BLACK PEARL IS YOURS! All treasures have been claimed!"
          : `Correct! Treasure ${newProgress}/10 claimed. Sail onward!`,
      progress: newProgress,
      completedChallenges: newCompleted,
      finished: newProgress >= 10,
    });
  } catch {
    return Response.json(
      { error: "The seas are troubled — server error" },
      { status: 500 }
    );
  }
}
