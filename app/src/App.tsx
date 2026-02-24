/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '@/hooks/useGame';
import { Background } from '@/components/Background';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { AnswerGrid } from '@/components/AnswerGrid';
import { FeedbackPopup } from '@/components/FeedbackPopup';
import { EndScreen } from '@/components/EndScreen';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function App() {
  const {
    config,
    questions,
    currentQuestionIndex,
    currentQuestion,
    score,
    gameState,
    selectedAnswerIndex,
    isCorrect,
    streak,
    results,
    transitionTrigger,
    startGame,
    submitAnswer,
    nextQuestion,
    quitGame,
    handleContinueToUnity
  } = useGame();

  // Auto-start game when ready (skip intro screen if desired, or keep it)
  // For this arcade feel, an intro screen is nice.

  if (gameState === 'loading') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-neon-cyan" size={48} />
      </div>
    );
  }

  const totalQuestions = questions.length;
  const maxPossibleScore = questions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      <Background 
        image={currentQuestion?.backgroundImage} 
        flashTrigger={transitionTrigger}
      />

      {/* Top Bar */}
      <header className="relative z-20 p-4 flex items-center justify-between">
        <div className="flex-1 max-w-[60%]">
          {gameState !== 'intro' && gameState !== 'finished' && (
             <ProgressBar 
               current={currentQuestionIndex} 
               total={totalQuestions} 
               results={results}
             />
          )}
        </div>
        <div className="ml-4">
          <ScoreDisplay score={score} streak={streak} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col p-6 max-w-md mx-auto w-full h-full">
        <AnimatePresence mode="wait">
          
          {/* INTRO SCREEN */}
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full space-y-8 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-neon-cyan to-neon-blue drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                  {config?.appTitle}
                </h1>
              </motion.div>
              
              <p className="text-slate-400 text-lg max-w-[250px]">
                Test your knowledge and beat the high score!
              </p>

              <Button 
                size="lg" 
                onClick={startGame}
                className="w-48 shadow-[0_0_30px_rgba(27,107,255,0.4)] animate-pulse"
                style={{ backgroundColor: config?.primaryColor }}
              >
                Start Quiz
              </Button>
            </motion.div>
          )}

          {/* GAMEPLAY SCREEN */}
          {(gameState === 'playing' || gameState === 'feedback') && currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col h-full justify-center pb-12"
            >
              {/* Question Card */}
              <div className="mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {currentQuestion.text}
                  </h2>
                </motion.div>
              </div>

              {/* Answers */}
              <AnswerGrid
                answers={currentQuestion.answers}
                correctAnswerIndex={currentQuestion.correctAnswerIndex}
                selectedAnswerIndex={selectedAnswerIndex}
                onSelect={submitAnswer}
                disabled={gameState === 'feedback'}
                showResult={gameState === 'feedback'}
                config={config}
              />
            </motion.div>
          )}

          {/* END SCREEN */}
          {gameState === 'finished' && (
            <motion.div
              key="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <EndScreen
                score={score}
                totalQuestions={totalQuestions}
                maxPossibleScore={maxPossibleScore}
                config={config}
                onContinue={handleContinueToUnity}
                onRestart={startGame}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Feedback Popup */}
      <FeedbackPopup
        isOpen={gameState === 'feedback'}
        isCorrect={isCorrect}
        question={currentQuestion}
        selectedAnswerIndex={selectedAnswerIndex}
        config={config}
        onContinue={nextQuestion}
      />
    </div>
  );
}
