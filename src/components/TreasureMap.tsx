"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Skull, Anchor, Compass, Lock, Unlock, ChevronRight } from "lucide-react";
import ChallengeModal from "./ChallengeModal";
import { ClientChallenge } from "@/lib/challenges";

interface TreasureMapProps {
  challenges: ClientChallenge[];
  completedChallenges: number[];
  teamId: string;
  onChallengeComplete: (challengeId: number) => void;
}

const POS = [
  { x: 8, y: 75 }, { x: 20, y: 55 }, { x: 15, y: 35 }, { x: 30, y: 20 },
  { x: 45, y: 35 }, { x: 55, y: 55 }, { x: 65, y: 30 }, { x: 75, y: 50 },
  { x: 85, y: 25 }, { x: 90, y: 10 },
];

const ICONS = [Anchor, Compass, Skull, MapPin, Anchor, Compass, Skull, MapPin, Anchor, Skull];

export default function TreasureMap({ challenges, completedChallenges, teamId, onChallengeComplete }: TreasureMapProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<ClientChallenge | null>(null);
  const done = (id: number) => completedChallenges.includes(id);
  const open = (id: number) => id === 1 || completedChallenges.includes(id - 1);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-[family-name:var(--font-pirate)] text-3xl md:text-4xl gold-text mb-2">🗺️ Ye Olde Treasure Map 🗺️</h2>
        <p className="text-parchment-dark text-sm opacity-70">Complete each challenge to stamp yer mark and advance toward the Black Pearl</p>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gold-800/50" style={{ aspectRatio: "16/9", background: "radial-gradient(ellipse at 30% 50%, rgba(232,213,168,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(243,156,18,0.05) 0%, transparent 50%), linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            <Compass className="w-16 h-16 text-gold-500" />
          </motion.div>
        </div>

        <svg className="absolute inset-0 w-full h-full">
          {POS.map((pos, idx) => {
            if (idx === 0) return null;
            const prev = POS[idx - 1];
            const c = done(idx);
            return (
              <motion.line key={`p-${idx}`} x1={`${prev.x + 2}%`} y1={`${prev.y}%`} x2={`${pos.x + 2}%`} y2={`${pos.y}%`}
                stroke={c ? "#f39c12" : done(idx) || open(idx + 1) ? "rgba(243,156,18,0.4)" : "rgba(255,255,255,0.1)"}
                strokeWidth={c ? "2.5" : "1.5"} strokeDasharray={c ? "none" : "6 4"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: idx * 0.15 }} />
            );
          })}
        </svg>

        {POS.map((pos, idx) => {
          const cid = idx + 1;
          const ch = challenges.find((c) => c.id === cid);
          const completed = done(cid);
          const unlocked = open(cid);
          const Icon = ICONS[idx];

          return (
            <motion.div key={cid} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}>
              {unlocked && !completed && (
                <motion.div className="absolute inset-0 -m-2 rounded-full bg-gold-400/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              )}
              <motion.button whileHover={unlocked ? { scale: 1.15 } : {}} whileTap={unlocked ? { scale: 0.95 } : {}}
                onClick={() => { if (unlocked && ch && !completed) setSelectedChallenge(ch); }}
                disabled={!unlocked || completed}
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer
                  ${completed ? "bg-blood-red border-2 border-blood-dark shadow-lg shadow-red-900/50"
                    : unlocked ? "bg-gradient-to-br from-gold-600 to-gold-800 border-2 border-gold-400 animate-glow"
                    : "bg-pirate-navy/80 border-2 border-ocean-800/50 opacity-50 cursor-not-allowed"}`}>
                {completed ? (
                  <motion.div initial={{ scale: 3, rotate: -15, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <X className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={4} />
                  </motion.div>
                ) : unlocked ? <Unlock className="w-4 h-4 md:w-5 md:h-5 text-pirate-black" />
                  : <Lock className="w-4 h-4 md:w-5 md:h-5 text-ocean-600" />}
              </motion.button>
              <div className={`absolute whitespace-nowrap text-[10px] md:text-xs font-bold mt-1 left-1/2 -translate-x-1/2 ${idx % 2 === 0 ? "top-full" : "bottom-full mb-1"}`}>
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 text-gold-500" />
                  <span className={completed ? "text-blood-red line-through" : unlocked ? "text-gold-400" : "text-ocean-600"}>
                    {cid === 10 ? "☠️ Final" : `Ch.${cid}`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute bottom-2 left-2 text-xs text-gold-600 font-[family-name:var(--font-pirate)]">🏝️ Port Royal</div>
        <div className="absolute top-2 right-16 text-xs text-gold-400 font-[family-name:var(--font-pirate)] flex items-center gap-1">
          <span>The Black Pearl</span><ChevronRight className="w-3 h-3" /><span>🏴‍☠️</span>
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="flex justify-between text-xs text-gold-600 mb-1">
          <span>Treasures claimed: {completedChallenges.length}/10</span>
          <span>{Math.round((completedChallenges.length / 10) * 100)}%</span>
        </div>
        <div className="h-2 bg-pirate-navy rounded-full overflow-hidden border border-ocean-800/50">
          <motion.div className="h-full bg-gradient-to-r from-gold-600 via-treasure-gold to-gold-400 rounded-full"
            initial={{ width: "0%" }} animate={{ width: `${(completedChallenges.length / 10) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }} />
        </div>
      </div>

      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal challenge={selectedChallenge} teamId={teamId}
            onClose={() => setSelectedChallenge(null)}
            onSuccess={(id) => { onChallengeComplete(id); setSelectedChallenge(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
