import { motion, AnimatePresence } from "motion/react";
import { Trophy, Flame } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  streak: number;
}

export function ScoreDisplay({ score, streak }: ScoreDisplayProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* Score */}
      <div className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <Trophy size={16} className="text-neon-cyan" />
        <motion.span 
          key={score}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-mono font-bold text-white"
        >
          {score}
        </motion.span>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center space-x-1 bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/50"
          >
            <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-bold text-orange-400 text-sm">
              {streak}x
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
