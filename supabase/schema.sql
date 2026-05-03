-- ==============================================
-- Pirates of the Caribbean CTF — Supabase Schema
-- ==============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 10),
    completed_challenges INTEGER[] DEFAULT '{}',
    finished_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for leaderboard queries (sorted by progress desc, then finish time)
CREATE INDEX IF NOT EXISTS idx_teams_leaderboard
    ON teams (progress DESC, finished_at ASC NULLS LAST);

-- Index for quick lookups by name
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams (name);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all teams (public leaderboard)
CREATE POLICY "Allow public read access"
    ON teams FOR SELECT
    USING (true);

-- Allow anyone to insert new teams (team registration)
CREATE POLICY "Allow public insert"
    ON teams FOR INSERT
    WITH CHECK (true);

-- Allow anyone to update their own team (or all for simplicity in CTF)
CREATE POLICY "Allow public update"
    ON teams FOR UPDATE
    USING (true);

-- Enable Realtime on the teams table
ALTER PUBLICATION supabase_realtime ADD TABLE teams;

-- ==============================================
-- Optional: Seed data for 10 test teams
-- ==============================================
-- INSERT INTO teams (name, progress, completed_challenges) VALUES
--     ('The Jolly Rogers', 0, '{}'),
--     ('Blackbeard''s Crew', 0, '{}'),
--     ('The Sea Wolves', 0, '{}'),
--     ('Davy Jones'' Locker', 0, '{}'),
--     ('The Crimson Tide', 0, '{}'),
--     ('Skull & Crossbones', 0, '{}'),
--     ('The Kraken Riders', 0, '{}'),
--     ('Port Royal Pirates', 0, '{}'),
--     ('The Flying Dutchmen', 0, '{}'),
--     ('The Black Spot', 0, '{}');
