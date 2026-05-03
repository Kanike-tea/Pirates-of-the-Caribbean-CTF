import { getClientChallenges } from "@/lib/challenges";

/**
 * GET /api/challenges
 *
 * Returns sanitized challenges (without flag answers) for the client.
 */
export async function GET() {
  const challenges = getClientChallenges();
  return Response.json({ challenges });
}
