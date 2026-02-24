import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GameConfig } from "@/lib/gameData";

interface AnswerGridProps {
  answers: string[];
  onSelect: (index: number) => void;
  disabled: boolean;
  selectedAnswerIndex: number | null;
  correctAnswerIndex: number;
  showResult: boolean;
  config: GameConfig | null;
}

export function AnswerGrid({
  answers,
  onSelect,
  disabled,
  selectedAnswerIndex,
  correctAnswerIndex,
  showResult,
  config
}: AnswerGridProps) {
  
  return (
    <div className="grid grid-cols-1 gap-3 w-full">
      {answers.map((answer, index) => {
        const isSelected = selectedAnswerIndex === index;
        const isCorrect = index === correctAnswerIndex;
        
        let stateStyles = "bg-slate-800/80 border-white/10 text-white hover:bg-slate-700";
        
        if (showResult) {
          if (isCorrect) {
            stateStyles = "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_15px_rgba(34,255,136,0.3)]";
          } else if (isSelected && !isCorrect) {
            stateStyles = "bg-neon-red/20 border-neon-red text-neon-red";
          } else {
            stateStyles = "opacity-50 bg-slate-900 border-transparent";
          }
        } else if (isSelected) {
           stateStyles = "bg-neon-blue border-neon-blue text-white";
        }

        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && onSelect(index)}
            disabled={disabled}
            className={cn(
              "relative p-4 rounded-2xl border-2 text-left font-medium text-lg transition-all duration-300",
              stateStyles,
              "flex items-center justify-between group"
            )}
          >
            <span className="z-10">{answer}</span>
            
            {showResult && isCorrect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-neon-green text-black rounded-full p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
            )}
            
            {showResult && isSelected && !isCorrect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-neon-red text-white rounded-full p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
