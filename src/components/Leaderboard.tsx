"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Anchor } from "lucide-react";
import { supabase, Team } from "@/lib/supabase";
import { calculateScore } from "@/lib/challenges";
import PirateShip from "./PirateShip";

const SHIP_COLORS = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
  "text-yellow-500",
  "text-pink-500",
  "text-cyan-500",
  "text-orange-500",
  "text-teal-500",
  "text-indigo-500",
];

const TEAM_COLORS = [
  "from-red-500 to-red-700",
  "from-blue-500 to-blue-700",
  "from-green-500 to-green-700",
  "from-purple-500 to-purple-700",
  "from-yellow-500 to-yellow-700",
  "from-pink-500 to-pink-700",
  "from-cyan-500 to-cyan-700",
  "from-orange-500 to-orange-700",
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
];

interface LeaderboardProps {
  currentTeamId?: string;
}

export default function Leaderboard({ currentTeamId }: LeaderboardProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadTeams() {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("progress", { ascending: false })
        .order("finished_at", { ascending: true, nullsFirst: false });

      if (!ignore) {
        if (!error && data) {
          const sortedData = (data as Team[]).sort((a, b) => {
            const scoreA = calculateScore(a.completed_challenges);
            const scoreB = calculateScore(b.completed_challenges);
            if (scoreA !== scoreB) return scoreB - scoreA;
            // Fallback to finished_at if scores are equal
            if (a.finished_at && b.finished_at) {
              return new Date(a.finished_at).getTime() - new Date(b.finished_at).getTime();
            }
            if (a.finished_at) return -1;
            if (b.finished_at) return 1;
            return 0;
          });
          setTeams(sortedData);
        }
        setLoading(false);
      }
    }

    loadTeams();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("teams-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => {
          loadTeams();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Anchor className="w-8 h-8 text-gold-400" />
        </motion.div>
        <span className="ml-3 text-gold-300 font-[family-name:var(--font-pirate)] text-xl">
          Charting the seas...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-[family-name:var(--font-pirate)] text-3xl md:text-4xl gold-text mb-2">
          ⚓ The Great Sea Race ⚓
        </h2>
        <p className="text-parchment-dark text-sm opacity-70">
          Real-time positions of all crews on the seven seas
        </p>
      </div>

      {/* Sea Race Container */}
      <div className="relative ocean-bg rounded-2xl border border-gold-800/30 overflow-hidden p-4 md:p-6">
        {/* Wave overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.1)"
              animate={{
                d: [
                  "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
                  "M0,80 C200,40 400,80 600,40 C800,80 1000,40 1200,80 L1200,120 L0,120 Z",
                  "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Finish line */}
        <div className="absolute right-4 md:right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400 opacity-60">
          <div className="absolute -top-1 -left-3 text-xs text-gold-300 font-[family-name:var(--font-pirate)]">
            🏴‍☠️
          </div>
        </div>

        {/* Team Ships */}
        <div className="relative space-y-3 z-10">
          <AnimatePresence>
            {teams.map((team, index) => {
              const progressPercent = (team.progress / 10) * 100;
              const isCurrentTeam = team.id === currentTeamId;
              const isFinished = team.progress >= 10;

              return (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    delay: index * 0.05,
                  }}
                  className={`relative flex items-center gap-3 ${
                    isCurrentTeam
                      ? "bg-gold-900/20 rounded-xl p-2 ring-1 ring-gold-500/30"
                      : ""
                  }`}
                >
                  {/* Rank badge */}
                  <div className="flex-shrink-0 w-8 text-center">
                    {index === 0 && team.progress > 0 ? (
                      <Trophy className="w-5 h-5 text-gold-400 mx-auto" />
                    ) : (
                      <span className="text-xs text-gold-600 font-bold">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Team name */}
                  <div className="flex-shrink-0 w-24 md:w-32 truncate">
                    <span
                      className={`text-xs md:text-sm font-semibold ${
                        isCurrentTeam ? "text-gold-300" : "text-parchment"
                      }`}
                    >
                      {team.name}
                    </span>
                  </div>

                  {/* Sea track */}
                  <div className="flex-1 relative h-8 bg-pirate-navy/50 rounded-full overflow-hidden border border-ocean-800/50">
                    {/* Progress water */}
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full overflow-hidden bg-gradient-to-r ${
                        TEAM_COLORS[index % TEAM_COLORS.length]
                      } opacity-40`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      }}
                    >
                      {/* Animated Waves */}
                      <motion.div 
                        className="absolute inset-0 w-[200%] text-white opacity-30"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 2 + (index % 3), repeat: Infinity, ease: "linear" }}
                      >
                        <svg viewBox="0 0 1200 32" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,16 C150,32 450,0 600,16 C750,32 1050,0 1200,16 L1200,32 L0,32 Z" fill="currentColor"></path>
                        </svg>
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 w-[200%] text-white opacity-20"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ duration: 3 + (index % 2), repeat: Infinity, ease: "linear" }}
                      >
                        <svg viewBox="0 0 1200 32" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,16 C150,0 450,32 600,16 C750,0 1050,32 1200,16 L1200,32 L0,32 Z" fill="currentColor"></path>
                        </svg>
                      </motion.div>
                    </motion.div>

                      <motion.div
                        className={`absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 -mt-1 ${SHIP_COLORS[index % SHIP_COLORS.length]}`}
                        initial={{ left: "0%" }}
                        animate={{
                          left: `calc(${Math.min(progressPercent, 95)}% - 16px)`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 80,
                          damping: 15,
                        }}
                      >
                        <motion.div
                          className="w-full h-full"
                          animate={
                            !isFinished
                              ? {
                                  y: [0, -3, 0, -2, 0],
                                  rotate: [0, 2, -1, 1, 0],
                                }
                              : {}
                          }
                          transition={{
                            duration: 3 + index * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {isFinished ? <span className="text-2xl ml-1">🏴‍☠️</span> : <PirateShip className="w-full h-full" />}
                        </motion.div>
                      </motion.div>
                  </div>

                  {/* Progress & Score */}
                  <div className="flex-shrink-0 w-16 text-right flex flex-col">
                    <span
                      className={`text-xs font-mono ${
                        isFinished ? "text-gold-400" : "text-ocean-300"
                      }`}
                    >
                      {team.progress}/10
                    </span>
                    <span className="text-[10px] text-gold-500 font-bold">
                      {calculateScore(team.completed_challenges)} pts
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-pirate-dark/80 to-pirate-navy/80 border border-gold-800/30 backdrop-blur-sm"
      >
        <h3 className="font-[family-name:var(--font-pirate)] text-2xl text-gold-400 mb-6 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          Live Standings
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b border-gold-800/50 text-gold-500 text-sm font-semibold">
                <th className="pb-3 pl-2 w-16">Rank</th>
                <th className="pb-3">Crew Name</th>
                <th className="pb-3 text-center">Score</th>
                <th className="pb-3 text-right pr-2">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => {
                const isCurrentTeam = team.id === currentTeamId;
                const isFinished = team.progress >= 10;
                return (
                  <motion.tr 
                    key={team.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-ocean-900/30 last:border-0 transition-colors ${
                      isCurrentTeam ? "bg-gold-900/10" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="py-3 pl-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pirate-black/50 text-gold-400 font-bold text-xs border border-gold-800/30">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-sm">
                      <span className={isCurrentTeam ? "text-gold-300" : "text-parchment"}>
                        {team.name}
                      </span>
                      {isFinished && <span className="ml-2 text-xs">🏴‍☠️</span>}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${isFinished ? "text-gold-400" : "text-ocean-300"}`}>
                          {calculateScore(team.completed_challenges)} pts
                        </span>
                        <span className="text-[10px] text-ocean-500 font-mono">
                          {team.progress}/10
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right pr-2 text-xs text-ocean-500">
                      {team.finished_at ? (
                        <span className="text-gold-500 flex items-center justify-end gap-1"><Clock className="w-3 h-3" /> {new Date(team.finished_at).toLocaleTimeString()}</span>
                      ) : (
                        <span>En route...</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {teams.length === 0 && (
            <div className="text-center py-8 text-ocean-600 italic text-sm">
              No crews have set sail yet.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
