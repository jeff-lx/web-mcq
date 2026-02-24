import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Trophy, Flame } from "lucide-react";
import { useEffect, useRef } from "react";

interface ScoreDisplayProps {
  score: number;
  streak: number;
}

export function ScoreDisplay({ score, streak }: ScoreDisplayProps) {
  const prevScore = useRef(score);
  const controls = useAnimation();

  useEffect(() => {
    if (score > prevScore.current) {
      controls.start({
        scale: [1, 1.5, 1],
        color: ["#ffffff", "#22FF88", "#ffffff"],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
    prevScore.current = score;
  }, [score, controls]);

  return (
    <div className="flex items-center space-x-4">
      {/* Score */}
      <div className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <Trophy size={16} className="text-neon-cyan" />
        <motion.span 
          animate={controls}
          className="font-mono font-bold text-white"
        >
          {score}
        </motion.span>
        
        {/* Floating +Points Animation */}
        <AnimatePresence>
          {score > 0 && score > prevScore.current && (
            <motion.span
              key={score}
              initial={{ y: 0, opacity: 1, scale: 0.5 }}
              animate={{ y: -20, opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-4 right-0 text-neon-green font-bold text-sm pointer-events-none"
            >
              +{score - prevScore.current}
            </motion.span>
          )}
        </AnimatePresence>
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
