"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Anchor, Ship, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import TreasureMap from "@/components/TreasureMap";
import BlackPearlVictory from "@/components/BlackPearlVictory";
import { supabase, Team } from "@/lib/supabase";
import { ClientChallenge } from "@/lib/challenges";

type View = "join" | "game";

export default function Home() {
  const [view, setView] = useState<View>("join");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [team, setTeam] = useState<Team | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [challenges, setChallenges] = useState<ClientChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "race">("map");

  // Fetch challenges on mount
  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => setChallenges(d.challenges || []))
      .catch(() => {});
  }, []);

  // Fetch teams for leaderboard
  const fetchTeams = useCallback(async () => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .order("progress", { ascending: false })
      .order("finished_at", { ascending: true, nullsFirst: false });
    if (data) setAllTeams(data as Team[]);
  }, []);

  // Fetch current team data
  const fetchTeam = useCallback(async (id: string) => {
    const { data } = await supabase.from("teams").select("*").eq("id", id).single();
    if (data) {
      setTeam(data as Team);
      if ((data as Team).progress >= 10) setShowVictory(true);
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    if (!teamId) return;
    fetchTeams();
    fetchTeam(teamId);

    const channel = supabase
      .channel("game-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => {
        fetchTeams();
        fetchTeam(teamId);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [teamId, fetchTeams, fetchTeam]);

  // Join / Create team
  const handleJoin = async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    setJoinError("");

    try {
      // Check if team exists
      const { data: existing } = await supabase
        .from("teams")
        .select("*")
        .eq("name", teamName.trim())
        .single();

      if (existing) {
        setTeamId(existing.id);
        setTeam(existing as Team);
        setView("game");
      } else {
        // Create new team
        const { data: newTeam, error } = await supabase
          .from("teams")
          .insert({
            name: teamName.trim(),
            progress: 0,
            completed_challenges: [],
            finished_at: null,
          })
          .select()
          .single();

        if (error) {
          setJoinError("Failed to join the crew: " + error.message);
        } else if (newTeam) {
          setTeamId(newTeam.id);
          setTeam(newTeam as Team);
          setView("game");
        }
      }
    } catch {
      setJoinError("The seas are stormy — couldn't connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeComplete = (challengeId: number) => {
    if (team) {
      const updated = {
        ...team,
        completed_challenges: [...team.completed_challenges, challengeId],
        progress: team.progress + 1,
      };
      setTeam(updated);
      if (updated.progress >= 10) {
        setTimeout(() => setShowVictory(true), 500);
      }
    }
  };

  // Victory Screen
  if (showVictory && team) {
    return <BlackPearlVictory team={team} allTeams={allTeams} />;
  }

  // Join Screen
  if (view === "join") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Link 
          href="/admin" 
          className="absolute top-6 right-6 flex items-center gap-2 text-blood-red/70 hover:text-blood-red transition-colors cursor-pointer text-sm font-semibold bg-blood-red/10 px-3 py-2 rounded-lg border border-blood-red/20 hover:bg-blood-red/20"
          title="Captain's Quarters"
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="hidden sm:inline">Captain's Quarters</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center">

          {/* Logo / Title */}
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }} className="mb-8">
            <div className="text-7xl mb-4">🏴‍☠️</div>
            <h1 className="font-[family-name:var(--font-pirate)] text-4xl md:text-5xl gold-text mb-2">
              Pirates of the Caribbean
            </h1>
            <p className="text-gold-600 font-[family-name:var(--font-pirate)] text-xl">
              Cybersecurity Treasure Hunt
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Anchor className="w-4 h-4 text-gold-700" />
            <div className="h-px w-16 bg-gold-800" />
            <Skull className="w-5 h-5 text-gold-600" />
            <div className="h-px w-16 bg-gold-800" />
            <Anchor className="w-4 h-4 text-gold-700" />
          </div>

          {/* Join Form */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-pirate-dark to-pirate-navy border border-gold-800/30">
            <h2 className="font-[family-name:var(--font-pirate)] text-2xl text-gold-400 mb-4">
              Join Yer Crew
            </h2>
            <p className="text-parchment/70 text-sm mb-6">
              Enter thy crew name to board the ship or rejoin an existing crew.
            </p>
            <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
              placeholder="Crew name (e.g. The Jolly Rogers)"
              className="w-full px-4 py-3 rounded-xl bg-pirate-black/50 border border-gold-800/30 text-parchment placeholder:text-ocean-700 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 mb-4 text-center font-semibold" />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleJoin} disabled={loading || !teamName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 text-pirate-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Anchor className="w-5 h-5" />
                </motion.div>
              ) : (
                <Ship className="w-5 h-5" />
              )}
              {loading ? "Setting Sail..." : "Set Sail!"}
            </motion.button>
            {joinError && (
              <p className="mt-3 text-blood-red text-xs">{joinError}</p>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "🗺️", label: "10 Challenges" },
              { icon: "⚔️", label: "CTF Security" },
              { icon: "🏴‍☠️", label: "Win the Pearl" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-pirate-navy/30 border border-ocean-800/30 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-[10px] text-ocean-400">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gold-800/20 bg-pirate-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏴‍☠️</span>
            <div>
              <h1 className="font-[family-name:var(--font-pirate)] text-lg gold-text leading-tight">Pirates CTF</h1>
              <p className="text-[10px] text-ocean-500">Crew: {team?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gold-500 font-mono">{team?.progress || 0}/10</span>
              <div className="w-20 h-1.5 bg-pirate-navy rounded-full overflow-hidden">
                <motion.div className="h-full bg-gold-500 rounded-full"
                  animate={{ width: `${((team?.progress || 0) / 10) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }} />
              </div>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-blood-red/80 hover:text-blood-red transition-colors bg-blood-red/10 px-2 py-1.5 rounded-lg border border-blood-red/20 hover:bg-blood-red/20"
              title="Captain's Quarters"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">Admin</span>
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pb-2">
          {(["map", "race"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-gold-600/20 text-gold-400 border border-gold-600/30"
                  : "text-ocean-500 hover:text-ocean-300"
              }`}>
              {tab === "map" ? "🗺️ Treasure Map" : "⚓ Sea Race"}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "map" ? (
            <motion.div key="map" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <TreasureMap
                challenges={challenges}
                completedChallenges={team?.completed_challenges || []}
                teamId={teamId}
                onChallengeComplete={handleChallengeComplete}
              />
            </motion.div>
          ) : (
            <motion.div key="race" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Leaderboard currentTeamId={teamId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
