import { motion, AnimatePresence } from "motion/react";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { Question, GameConfig } from "@/lib/gameData";
import { useEffect, useState } from "react";

interface FeedbackPopupProps {
  isOpen: boolean;
  isCorrect: boolean;
  question: Question;
  selectedAnswerIndex: number | null;
  config: GameConfig | null;
  onContinue: () => void;
}

export function FeedbackPopup({
  isOpen,
  isCorrect,
  question,
  selectedAnswerIndex,
  config,
  onContinue
}: FeedbackPopupProps) {
  const [showContent, setShowContent] = useState(false);

  // Delay showing content to allow the initial check/x animation to play
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
          {/* Big Icon Animation */}
          {!showContent && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div 
                className={`p-8 rounded-full border-4 shadow-[0_0_50px_currentColor] ${isCorrect ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-neon-red/20 border-neon-red text-neon-red'}`}
              >
                {isCorrect ? <Check size={80} strokeWidth={4} /> : <X size={80} strokeWidth={4} />}
              </div>
            </motion.div>
          )}

          {/* Content Card */}
          {showContent && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
            >
              {/* Header Color Bar */}
              <div 
                className={`absolute top-0 left-0 right-0 h-2 ${isCorrect ? 'bg-neon-green' : 'bg-neon-red'}`} 
              />

              <div className="mt-4 text-center space-y-4">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-2xl font-bold uppercase tracking-wide ${isCorrect ? 'text-neon-green' : 'text-neon-red'}`}
                >
                  {question.feedbackTitle || (isCorrect ? "Correct!" : "Incorrect")}
                </motion.h2>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-4 text-left border border-white/5"
                >
                  <p className="text-slate-300 text-sm mb-1 uppercase tracking-wider font-bold opacity-60">
                    Correct Answer
                  </p>
                  <p className="text-white font-medium text-lg">
                    {question.answers[question.correctAnswerIndex]}
                  </p>
                </motion.div>

                {question.feedbackBody && (
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    {question.feedbackBody}
                  </motion.p>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <Button 
                    fullWidth 
                    size="lg" 
                    onClick={onContinue}
                    className="group"
                    style={{ 
                      backgroundColor: isCorrect ? config?.correctColor : config?.primaryColor,
                      borderColor: isCorrect ? config?.correctColor : config?.primaryColor
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {config?.feedbackContinueLabel || "Continue"}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
