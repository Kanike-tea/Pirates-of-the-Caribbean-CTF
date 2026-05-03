"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { ClientChallenge } from "@/lib/challenges";

interface ChallengeModalProps {
  challenge: ClientChallenge;
  teamId: string;
  onClose: () => void;
  onSuccess: (challengeId: number) => void;
}

export default function ChallengeModal({ challenge, teamId, onClose, onSuccess }: ChallengeModalProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState("");

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, challengeId: challenge.id, answer: answer.trim() }),
      });
      const data = await res.json();

      if (data.rateLimited) {
        setError("⏳ " + data.error);
      } else if (data.correct) {
        setFeedback("🎉 " + data.message);
        setTimeout(() => onSuccess(challenge.id), 1500);
      } else {
        setError("❌ " + (data.message || data.error || "Wrong answer!"));
      }
    } catch {
      setError("⚠️ Failed to reach the server. The seas are stormy!");
    } finally {
      setLoading(false);
    }
  };

  // Render challenge text with code blocks
  const renderText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/g, "").replace(/```$/g, "");
        return <pre key={i} className="my-2 text-xs"><code>{code}</code></pre>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-gold-700/50 bg-gradient-to-br from-pirate-black via-pirate-dark to-pirate-navy p-6 shadow-2xl shadow-gold-900/20">

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gold-600 hover:text-gold-400 transition-colors cursor-pointer">✕</button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${challenge.difficulty === "Hard" ? "bg-blood-red/20 text-blood-red" : "bg-gold-600/20 text-gold-400"}`}>
              {challenge.difficulty}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ocean-800/50 text-ocean-300">{challenge.category}</span>
          </div>
          <h3 className="font-[family-name:var(--font-pirate)] text-2xl text-gold-400">{challenge.title}</h3>
        </div>

        {/* Story */}
        <div className="mb-4 p-3 rounded-xl bg-parchment/5 border border-parchment/10">
          <p className="text-parchment text-sm italic leading-relaxed">&ldquo;{challenge.story}&rdquo;</p>
        </div>

        {/* Challenge */}
        <div className="mb-4">
          <h4 className="text-gold-500 text-xs font-bold uppercase tracking-wider mb-2">⚔️ The Challenge</h4>
          <div className="text-parchment text-sm leading-relaxed whitespace-pre-wrap">{renderText(challenge.challenge)}</div>
        </div>

        {/* Hint toggle */}
        <button onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-xs text-ocean-400 hover:text-ocean-300 mb-4 transition-colors cursor-pointer">
          {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        {showHint && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-3 rounded-lg bg-ocean-900/30 border border-ocean-700/30">
            <p className="text-ocean-300 text-xs">💡 {challenge.hint}</p>
          </motion.div>
        )}

        {/* Answer input */}
        <div className="flex gap-2">
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitAnswer(); }}
            placeholder="Enter thy flag here, matey..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-pirate-navy/50 border border-gold-800/30 text-parchment text-sm placeholder:text-ocean-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 font-mono" />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={submitAnswer} disabled={loading || !answer.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 text-pirate-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </motion.button>
        </div>

        {/* Feedback */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-blood-red/10 border border-blood-red/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blood-red flex-shrink-0" />
            <p className="text-blood-red text-xs">{error}</p>
          </motion.div>
        )}
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-green-900/20 border border-green-500/30">
            <p className="text-green-400 text-sm font-semibold">{feedback}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
