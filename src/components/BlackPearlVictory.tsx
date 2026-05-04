"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Ship, Skull, Anchor, Sparkles } from "lucide-react";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
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
        {/* Sparkling Black Pearl reveal */}
        <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }} className="mb-10 flex justify-center relative">
          
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
            {/* The Pearl */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #e5e7eb 0%, #9ca3af 10%, #374151 30%, #111827 60%, #030712 85%, #000000 100%)",
                boxShadow: "inset -10px -10px 30px rgba(255,255,255,0.05), inset 10px 10px 20px rgba(255,255,255,0.1), 0 0 30px rgba(0,0,0,0.9)"
              }}
              animate={{ 
                boxShadow: [
                  "inset -10px -10px 30px rgba(255,255,255,0.05), inset 10px 10px 20px rgba(255,255,255,0.1), 0 0 30px rgba(0,0,0,0.9), 0 0 30px rgba(156,163,175,0.2)",
                  "inset -10px -10px 30px rgba(255,255,255,0.05), inset 10px 10px 20px rgba(255,255,255,0.15), 0 0 40px rgba(0,0,0,1), 0 0 60px rgba(156,163,175,0.4)",
                  "inset -10px -10px 30px rgba(255,255,255,0.05), inset 10px 10px 20px rgba(255,255,255,0.1), 0 0 30px rgba(0,0,0,0.9), 0 0 30px rgba(156,163,175,0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Sparkles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-white/90 drop-shadow-md"
                style={{
                  top: `${-10 + Math.random() * 120}%`,
                  left: `${-10 + Math.random() * 120}%`,
                }}
                animate={{
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 90, 180]
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={16 + Math.random() * 24} strokeWidth={1.5} />
              </motion.div>
            ))}
          </div>
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
