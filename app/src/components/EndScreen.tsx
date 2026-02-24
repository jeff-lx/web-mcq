import { motion } from "motion/react";
import { Star, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { GameConfig } from "@/lib/gameData";

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  maxPossibleScore: number;
  config: GameConfig | null;
  onContinue: () => void;
  onRestart?: () => void; // Optional for testing
}

export function EndScreen({
  score,
  totalQuestions,
  maxPossibleScore,
  config,
  onContinue,
  onRestart
}: EndScreenProps) {
  const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;
  
  // Determine stars based on percentage
  const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
        className="relative"
      >
        <div 
          className="absolute inset-0 blur-3xl rounded-full" 
          style={{ backgroundColor: `${config?.accentColor || '#00E5FF'}4D` }} // 4D is ~30% opacity
        />
        <Trophy 
          size={120} 
          className="relative z-10 drop-shadow-[0_0_15px_currentColor]" 
          style={{ color: config?.accentColor || "#00E5FF" }}
        />
      </motion.div>

      <div className="space-y-2 relative z-10">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold uppercase tracking-widest"
          style={{ color: config?.textColor || "#FFFFFF" }}
        >
          {config?.endScreenTitle || "Complete!"}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg"
          style={{ color: config?.textColor ? `${config.textColor}99` : "#94a3b8" }}
        >
          {config?.endScreenBody || "You finished the quiz"}
        </motion.p>
      </div>

      {/* Score Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
      >
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3].map((star) => (
            <motion.div
              key={star}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + (star * 0.2), type: "spring" }}
            >
              <Star
                size={32}
                className={star <= stars ? "" : "text-slate-700"}
                style={star <= stars ? { fill: config?.accentColor || "#00E5FF", color: config?.accentColor || "#00E5FF" } : {}}
                strokeWidth={star <= stars ? 0 : 2}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-wider font-bold mb-1" style={{ color: config?.textColor ? `${config.textColor}99` : "#94a3b8" }}>
            {config?.endScreenScoreLabel || "Final Score"}
          </p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="text-5xl font-mono font-bold text-glow"
            style={{ color: config?.textColor || "#FFFFFF" }}
          >
            {score}
          </motion.div>
          <p className="text-xs mt-2" style={{ color: config?.textColor ? `${config.textColor}80` : "#64748b" }}>out of {maxPossibleScore}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-xs space-y-3"
      >
        <Button
          fullWidth
          size="lg"
          onClick={onContinue}
          className="group relative overflow-hidden"
          style={{ 
            backgroundColor: config?.primaryColor,
            borderColor: config?.primaryColor
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {config?.endContinueLabel || "Continue"}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>

        {/* Optional Restart for testing/web preview */}
        {!window.vuplex && onRestart && (
           <Button
           fullWidth
           variant="ghost"
           size="sm"
           onClick={onRestart}
           className="text-slate-500 hover:text-white"
         >
           <RotateCcw size={16} className="mr-2" />
           Restart (Debug)
         </Button>
        )}
      </motion.div>
    </div>
  );
}
