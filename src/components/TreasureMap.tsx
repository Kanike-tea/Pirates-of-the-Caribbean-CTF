"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Skull, Anchor, Compass, Lock, Unlock, ChevronRight, CloudLightning, Waves } from "lucide-react";
import ChallengeModal from "./ChallengeModal";
import { ClientChallenge } from "@/lib/challenges";
import PirateShip from "./PirateShip";
import StormySeasBackground from "./StormySeasBackground";

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

      <div className="relative w-full rounded-2xl overflow-hidden border-[6px] border-amber-900/80 shadow-[inset_0_0_60px_rgba(113,63,18,0.6)] map-parchment" style={{ aspectRatio: "16/9" }}>
        <div className="absolute top-4 right-4 opacity-20 z-10 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            <Compass className="w-16 h-16 text-amber-900" />
          </motion.div>
        </div>

        <StormySeasBackground />

        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {POS.map((pos, idx) => {
            if (idx === 0) return null;
            const prev = POS[idx - 1];
            const c = done(idx);
            
            const sign = idx % 2 === 0 ? 1 : -1;
            const midX = (prev.x + pos.x) / 2 + (sign * 8); 
            const midY = (prev.y + pos.y) / 2 - (sign * 12);
            const pathData = `M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pos.x} ${pos.y}`;

            return (
              <motion.path key={`p-${idx}`} d={pathData} fill="none" vectorEffect="non-scaling-stroke"
                stroke={c ? "#713f12" : done(idx) || open(idx + 1) ? "rgba(113,63,18,0.5)" : "rgba(113,63,18,0.15)"}
                strokeWidth={c ? "2.5" : "1.5"} strokeDasharray={c ? "none" : "3 3"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: idx * 0.15 }} />
            );
          })}
        </svg>

        {(() => {
          const currentPosIdx = Math.min(completedChallenges.length, 9);
          const currentPos = POS[currentPosIdx];
          return (
            <motion.div
              className="absolute z-20 w-12 h-12 md:w-16 md:h-16 text-neutral-800"
              initial={false}
              animate={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 12 }}
              style={{ transform: "translate(-50%, -100%)", marginTop: "-5px" }}
            >
              <motion.div animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full drop-shadow-xl">
                <PirateShip className="w-full h-full" />
              </motion.div>
            </motion.div>
          );
        })()}

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
                  ${completed ? "bg-blood-red border-2 border-amber-900 shadow-md shadow-red-900/40"
                    : unlocked ? "bg-amber-100 border-2 border-amber-900 shadow-[0_0_15px_rgba(180,83,9,0.4)] animate-glow"
                    : "bg-transparent border-2 border-amber-900/30 border-dashed opacity-60 cursor-not-allowed"}`}>
                {completed ? (
                  <motion.div initial={{ scale: 3, rotate: -15, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <X className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={4} />
                  </motion.div>
                ) : unlocked ? <Unlock className="w-4 h-4 md:w-5 md:h-5 text-amber-900" />
                  : <Lock className="w-4 h-4 md:w-5 md:h-5 text-amber-900/50" />}
              </motion.button>
              <div className={`absolute whitespace-nowrap text-[10px] md:text-xs font-bold mt-1 left-1/2 -translate-x-1/2 ${idx % 2 === 0 ? "top-full" : "bottom-full mb-1"}`}>
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 text-amber-900" />
                  <span className={completed ? "text-blood-red line-through" : unlocked ? "text-amber-900 font-extrabold" : "text-amber-900/60"}>
                    {cid === 10 ? "☠️ Final" : `Ch.${cid}`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute bottom-2 left-2 text-xs text-amber-900 font-[family-name:var(--font-pirate)]">🏝️ Port Royal</div>
        <div className="absolute top-2 right-16 text-xs text-amber-950 font-[family-name:var(--font-pirate)] flex items-center gap-1">
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
            onSuccess={(id: number) => { onChallengeComplete(id); setSelectedChallenge(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
