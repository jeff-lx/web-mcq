import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Trophy, Flame } from "lucide-react";
import { useEffect, useRef } from "react";
import { GameConfig } from "@/lib/gameData";

interface ScoreDisplayProps {
  score: number;
  streak: number;
  config?: GameConfig | null;
}

export function ScoreDisplay({ score, streak, config }: ScoreDisplayProps) {
  const prevScore = useRef(score);
  const controls = useAnimation();

  useEffect(() => {
    if (score > prevScore.current) {
      controls.start({
        scale: [1, 1.5, 1],
        color: ["#ffffff", config?.correctColor || "#22FF88", "#ffffff"],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
    prevScore.current = score;
  }, [score, controls, config]);

  return (
    <div className="flex items-center space-x-4">
      {/* Score */}
      <div className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <Trophy size={16} style={{ color: config?.accentColor || "#00E5FF" }} />
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
              className="absolute -top-4 right-0 font-bold text-sm pointer-events-none"
              style={{ color: config?.correctColor || "#22FF88" }}
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
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full border"
            style={{ 
              backgroundColor: `${config?.accentColor || '#f97316'}33`, // Orange-500 default if not accent
              borderColor: `${config?.accentColor || '#f97316'}80`
            }}
          >
            <Flame size={16} className="animate-pulse" style={{ color: config?.accentColor || "#f97316", fill: config?.accentColor || "#f97316" }} />
            <span className="font-bold text-sm" style={{ color: config?.accentColor || "#f97316" }}>
              {streak}x
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
