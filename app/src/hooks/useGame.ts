import { useState, useEffect, useCallback } from 'react';
import { parseGameData, type GameConfig, type Question, sendNewScoreEvent, sendModuleScoreEvent, handleContinueToUnity } from '@/lib/gameData';

export type GameState = 'loading' | 'intro' | 'playing' | 'feedback' | 'finished';

export function useGame() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [transitionTrigger, setTransitionTrigger] = useState<{ type: 'correct' | 'incorrect', timestamp: number } | null>(null);

  // Initialize Data
  useEffect(() => {
    const initGame = () => {
      const { config: parsedConfig, questions: parsedQuestions } = parseGameData();
      setConfig(parsedConfig);
      setQuestions(parsedQuestions);
      setResults(new Array(parsedQuestions.length).fill(null));
      setGameState('intro');
    };

    // Listen for Unity data ready event if not already present
    if (window.unityData && Object.keys(window.unityData).length > 0) {
      initGame();
    } else {
      // Wait a short moment to see if Unity injects data, otherwise load defaults
      // Or listen for the event we dispatched in index.html
      const handleDataReady = () => initGame();
      window.addEventListener('unityDataReady', handleDataReady);
      
      // Fallback timeout if not running in Unity or event never fires
      const timeout = setTimeout(() => {
        initGame();
        window.removeEventListener('unityDataReady', handleDataReady);
      }, 1000);

      return () => {
        window.removeEventListener('unityDataReady', handleDataReady);
        clearTimeout(timeout);
      };
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setStreak(0);
    setGameState('playing');
  };

  const submitAnswer = useCallback((answerIndex: number) => {
    if (gameState !== 'playing') return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswerIndex;
    
    setSelectedAnswerIndex(answerIndex);
    setIsCorrect(correct);
    setGameState('feedback');

    // Update results history
    setResults(prev => {
      const newResults = [...prev];
      newResults[currentQuestionIndex] = correct;
      return newResults;
    });

    if (correct) {
      // Score update is now delayed until nextQuestion (feedback close)
      // Send score tick to Unity
      sendNewScoreEvent(true);
    } else {
      // Streak reset is now delayed until nextQuestion
    }
  }, [gameState, questions, currentQuestionIndex, score]);

  const nextQuestion = useCallback(() => {
    // Apply delayed score/streak updates
    let currentScore = score;
    if (isCorrect) {
      const points = questions[currentQuestionIndex].points;
      currentScore += points;
      setScore(currentScore);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    // Trigger background flash
    setTransitionTrigger({ 
      type: isCorrect ? 'correct' : 'incorrect', 
      timestamp: Date.now() 
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setGameState('playing');
    } else {
      setGameState('finished');
      // Calculate max score
      const maxScore = questions.reduce((acc, q) => acc + q.points, 0);
      sendModuleScoreEvent("MCQ Module", config?.appTitle || "Web Quiz", currentScore, maxScore);
    }
  }, [currentQuestionIndex, questions, config, score, isCorrect]);

  const quitGame = () => {
    handleContinueToUnity();
  };

  return {
    config,
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
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
  };
}
