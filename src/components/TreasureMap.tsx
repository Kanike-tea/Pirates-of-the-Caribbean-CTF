"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Skull, Anchor, Compass, Lock, Unlock, ChevronRight, CloudLightning, Waves } from "lucide-react";
import ChallengeModal from "./ChallengeModal";
import { ClientChallenge } from "@/lib/challenges";
import PirateShip from "./PirateShip";
import StormySeasBackground from "./StormySeasBackground";
import VintageCompass from "./VintageCompass";

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

      <div className="ripped-border-shadow">
        <div className="relative w-full overflow-hidden ripped-border shadow-[inset_0_0_60px_rgba(113,63,18,0.6)] map-parchment" style={{ aspectRatio: "16/9" }}>
          <div className="absolute top-4 right-4 opacity-30 z-10 pointer-events-none drop-shadow-md">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
            <VintageCompass className="w-24 h-24 text-amber-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
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
              <motion.button whileHover={unlocked && !completed ? { scale: 1.15 } : {}} whileTap={unlocked && !completed ? { scale: 0.95 } : {}}
                onClick={() => { if (unlocked && ch && !completed) setSelectedChallenge(ch); }}
                disabled={!unlocked || completed}
                className={`relative flex items-center justify-center transition-all w-16 h-16 md:w-20 md:h-20
                  ${unlocked && !completed ? "cursor-pointer drop-shadow-[0_0_10px_rgba(180,83,9,0.3)] animate-glow" : !unlocked ? "opacity-60 cursor-not-allowed" : ""}`}>
                
                {/* The Island */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm" style={{ transform: `rotate(${idx * 45}deg)` }}>
                  <path
                    d="M50 5 C 70 2, 90 15, 95 35 C 98 55, 85 85, 65 95 C 40 100, 15 85, 5 65 C -2 45, 15 15, 35 10 C 40 8, 45 6, 50 5 Z"
                    fill="#e0c48f"
                    stroke="#713f12"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M 30 40 Q 40 30 50 45 T 70 35 M 40 65 Q 55 55 65 70" fill="none" stroke="#713f12" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                </svg>

                {/* The Red Cross or Lock/Unlock */}
                {completed ? (
                  <motion.svg viewBox="0 0 100 100" className="absolute w-12 h-12 md:w-16 md:h-16 z-10" initial={{ pathLength: 0, opacity: 0, scale: 3 }} animate={{ pathLength: 1, opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 200 }}>
                    <path d="M 20 20 Q 50 45 80 80 M 80 20 Q 50 55 20 80" stroke="#991b1b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))" }} />
                  </motion.svg>
                ) : unlocked ? (
                  <Unlock className="w-5 h-5 md:w-6 md:h-6 text-amber-900 z-10 drop-shadow-md" />
                ) : (
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-amber-900/50 z-10" />
                )}
              </motion.button>
              <div className={`absolute whitespace-nowrap text-[10px] md:text-xs font-bold mt-1 left-1/2 -translate-x-1/2 ${idx % 2 === 0 ? "top-full" : "bottom-full mb-1"}`}>
                <div className="flex items-center gap-1">
                  <span className={completed ? "text-red-900 line-through" : unlocked ? "text-amber-900 font-extrabold" : "text-amber-900/60"}>
                    {cid === 10 ? "☠️ Final Island" : `Island ${cid}`}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-lg md:text-2xl text-amber-950 font-[family-name:var(--font-pirate)] drop-shadow-[0_2px_2px_rgba(255,255,255,0.6)] flex items-center gap-1">
          🏝️ <span>Port Royal</span>
        </div>
        <div className="absolute top-8 right-24 md:top-12 md:right-32 text-lg md:text-2xl text-amber-950 font-[family-name:var(--font-pirate)] drop-shadow-[0_2px_2px_rgba(255,255,255,0.6)] flex items-center gap-1 z-20">
          <span>The Black Pearl</span><ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-amber-900" /><span>🏴‍☠️</span>
        </div>
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
