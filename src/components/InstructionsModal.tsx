import { motion, AnimatePresence } from "framer-motion";
import { X, Scroll } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ rotateX: -90, y: -50, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            exit={{ rotateX: -90, y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, duration: 0.8 }}
            style={{ transformPerspective: 1200, transformOrigin: "top center" }}
            className="relative w-full max-w-xl z-10"
          >
            <div className="ripped-border-shadow">
              <div className="relative p-8 md:p-12 ripped-border shadow-[inset_0_0_60px_rgba(113,63,18,0.6)] map-parchment flex flex-col items-center text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-amber-900 hover:bg-amber-900/10 transition-colors z-20 cursor-pointer"
                >
                  <X className="w-6 h-6 drop-shadow-sm" />
                </button>

                <div className="mb-6 flex flex-col items-center mt-2">
                  <Scroll className="w-12 h-12 text-amber-900 mb-2 drop-shadow-md" />
                  <h2 className="font-[family-name:var(--font-pirate)] text-3xl md:text-4xl text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                    Captain&apos;s Orders
                  </h2>
                </div>

                <div className="space-y-4 text-amber-950 font-semibold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">
                  <p>
                    Ahoy there, matey! Welcome to the Pirates of the Caribbean Cybersecurity Treasure Hunt.
                  </p>
                  <p>
                    Your mission is to navigate through the treacherous waters by solving cybersecurity challenges hidden on each island. 
                  </p>
                  <ul className="text-left list-disc list-inside space-y-2 max-w-md mx-auto mt-4 opacity-90">
                    <li>Create or join a Crew on the main screen.</li>
                    <li>Solve the challenge on the unlocked island to earn your flag.</li>
                    <li>All flags are in the format: <strong>FLAG&#123;treasure_name&#125;</strong>.</li>
                    <li>Submit the correct flag to stamp the island with a red &apos;X&apos;.</li>
                    <li>Race rival crews on the <strong>Sea Race</strong> leaderboard.</li>
                    <li>The first crew to conquer all 10 islands claims the legendary <strong>Black Pearl</strong>!</li>
                  </ul>
                  <p className="mt-8 text-xl font-[family-name:var(--font-pirate)]">
                    Now get out there and bring me that horizon!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
