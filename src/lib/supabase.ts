import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Team {
  id: string;
  name: string;
  progress: number; // 0-10, each correct answer = +1
  completed_challenges: number[]; // array of challenge IDs
  finished_at: string | null; // ISO timestamp when progress === 10
  created_at: string;
}
