"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Ship, Skull, Anchor } from "lucide-react";
import { Team } from "@/lib/supabase";

interface BlackPearlVictoryProps {
  team: Team;
  allTeams: Team[];
}

export default function BlackPearlVictory({ team, allTeams }: BlackPearlVictoryProps) {
  const finishedTeams = allTeams
    .filter((t) => t.finished_at)
    .sort((a, b) => new Date(a.finished_at!).getTime() - new Date(b.finished_at!).getTime());
  const rank = finishedTeams.findIndex((t) => t.id === team.id) + 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Animated particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-gold-400 rounded-full"
          initial={{ opacity: 0, x: "50vw", y: "50vh" }}
          animate={{
            opacity: [0, 1, 0],
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, Math.random() * 2 + 1, 0],
          }}
          transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 2, repeat: Infinity }} />
      ))}

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Ship reveal */}
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }} className="mb-8">
          <div className="text-8xl md:text-9xl">🏴‍☠️</div>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="font-[family-name:var(--font-pirate)] text-5xl md:text-7xl gold-text mb-4">
          The Pearl Is Yours
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="text-parchment text-lg mb-2">
          Captain <span className="text-gold-400 font-bold">{team.name}</span>, ye have conquered all ten challenges!
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
          className="text-ocean-400 text-sm mb-8">
          {rank === 1 ? "🥇 First to claim the Pearl!" : rank === 2 ? "🥈 Second across the finish!" : rank === 3 ? "🥉 Third to arrive!" : `Finished in position #${rank}`}
        </motion.p>

        {/* Skull divider */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
          className="flex items-center justify-center gap-4 mb-8">
          <Anchor className="w-4 h-4 text-gold-700" />
          <Skull className="w-6 h-6 text-gold-500" />
          <Anchor className="w-4 h-4 text-gold-700" />
        </motion.div>

        {/* Final Rankings */}
        {finishedTeams.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-pirate-dark to-pirate-navy border border-gold-800/30">
            <h3 className="font-[family-name:var(--font-pirate)] text-xl text-gold-400 mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" /> Final Rankings
            </h3>
            <div className="space-y-3">
              {finishedTeams.map((t, idx) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 + idx * 0.15 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${t.id === team.id ? "bg-gold-900/20 ring-1 ring-gold-500/30" : "bg-pirate-black/30"}`}>
                  <span className="text-lg w-8">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</span>
                  <Ship className="w-4 h-4 text-gold-500" />
                  <span className="text-parchment font-semibold text-sm">{t.name}</span>
                  <span className="ml-auto text-ocean-300 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(t.finished_at!).toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
