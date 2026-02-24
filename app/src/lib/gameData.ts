// Types for the raw KVP data from Unity
export interface UnityKVP {
  [key: string]: string | number | boolean;
}

// Parsed Question Type
export interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswerIndex: number; // 0-based index
  points: number;
  backgroundImage?: string;
  feedbackTitle?: string;
  feedbackBody?: string;
}

// Global Config Type
export interface GameConfig {
  appTitle: string;
  primaryColor: string;
  accentColor: string;
  correctColor: string;
  incorrectColor: string;
  feedbackContinueLabel: string;
  endContinueLabel: string;
}

declare global {
  interface Window {
    unityData: UnityKVP[] | undefined;
    vuplex?: {
      postMessage: (message: any) => void;
      addEventListener: (type: string, listener: (event: any) => void) => void;
      removeEventListener: (type: string, listener: (event: any) => void) => void;
    };
  }
}

// Default Data (Fallback)
const DEFAULT_CONFIG: GameConfig = {
  appTitle: "MCQ Arcade",
  primaryColor: "#1B6BFF",
  accentColor: "#00E5FF",
  correctColor: "#22FF88",
  incorrectColor: "#FF3B3B",
  feedbackContinueLabel: "Continue",
  endContinueLabel: "Continue",
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What planet do we live on?",
    answers: ["Mercury", "Pluto", "Earth", "Mars"],
    correctAnswerIndex: 2, // Earth is index 2 (0-based)
    points: 100,
    feedbackTitle: "Answer is Earth!",
    feedbackBody: "Earth is the only known planet that supports life.",
    backgroundImage: "https://images.unsplash.com/photo-1614730341194-75c60740a070?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 2,
    text: "Which element has the chemical symbol 'O'?",
    answers: ["Gold", "Oxygen", "Osmium"],
    correctAnswerIndex: 1,
    points: 100,
    feedbackTitle: "Correct!",
    feedbackBody: "Oxygen is essential for respiration.",
  },
  {
    id: 3,
    text: "What is the powerhouse of the cell?",
    answers: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
    correctAnswerIndex: 1,
    points: 150,
    feedbackTitle: "Mitochondria!",
    feedbackBody: "They generate most of the chemical energy needed to power the cell's biochemical reactions.",
  }
];

// Unity Communication Helpers
export const sendToUnity = (type: string, payload: any = {}) => {
  const message = {
    type,
    data: payload,
  };
  
  if (window.vuplex && window.vuplex.postMessage) {
    window.vuplex.postMessage(JSON.stringify(message));
  } else {
    console.log("Unity Event Mock:", type, payload);
  }
};

export const sendNewScoreEvent = (showPopup: boolean) => {
  sendToUnity("LXModuleShared.SharedStarsModel+NewScoreEventNode, LevelExMedical.ModuleShared", {
    showPopup: !!showPopup,
  });
};

export const sendModuleScoreEvent = (module: string, title: string, score: number, maxScore: number) => {
  const scorePercent = maxScore > 0 ? score / maxScore : 0;
  sendToUnity("LXModuleShared.SharedStarsModel+ModuleScore, LevelExMedical.ModuleShared", {
    name: module,
    title: title,
    score: score,
    maxScore: maxScore,
    scorePercent: scorePercent,
  });
};

export const handleContinueToUnity = () => {
  sendToUnity("LXModule.ModuleFrontendModel+CompleteModule, LevelExMedical.Module");
};

// Data Parsing Logic
export const parseGameData = (): { config: GameConfig; questions: Question[] } => {
  // Check if unityData exists and has content. 
  // window.unityData is expected to be an array of objects (sheets) or a single object depending on how it's structured.
  // The prompt says: window.unityData?.[0]?.myKey
  
  const rawData = window.unityData?.[0] as UnityKVP | undefined;

  if (!rawData) {
    console.warn("No Unity data found, using defaults.");
    return { config: DEFAULT_CONFIG, questions: DEFAULT_QUESTIONS };
  }

  // Parse Config
  const config: GameConfig = {
    appTitle: String(rawData["app_title"] || DEFAULT_CONFIG.appTitle),
    primaryColor: String(rawData["primary_color"] || DEFAULT_CONFIG.primaryColor),
    accentColor: String(rawData["accent_color"] || DEFAULT_CONFIG.accentColor),
    correctColor: String(rawData["correct_color"] || DEFAULT_CONFIG.correctColor),
    incorrectColor: String(rawData["incorrect_color"] || DEFAULT_CONFIG.incorrectColor),
    feedbackContinueLabel: String(rawData["feedback_continue_label"] || DEFAULT_CONFIG.feedbackContinueLabel),
    endContinueLabel: String(rawData["end_continue_label"] || DEFAULT_CONFIG.endContinueLabel),
  };

  // Parse Questions
  const questions: Question[] = [];
  let index = 1;
  
  while (true) {
    const questionKey = `question_${index}`;
    const questionText = rawData[questionKey];

    if (!questionText) break;

    // Parse Answers
    const answers: string[] = [];
    let answerIndex = 1;
    while (true) {
      const answerKey = `question_${index}_answer_${answerIndex}`;
      const answerText = rawData[answerKey];
      if (!answerText) break;
      answers.push(String(answerText));
      answerIndex++;
    }

    // If no answers found, maybe skip or break? Assuming valid data has answers.
    if (answers.length < 2) {
      console.warn(`Question ${index} has fewer than 2 answers.`);
    }

    // Parse other fields
    // Note: The prompt example shows 1-based index in CSV "question_1_correct_answer_index,3" -> Earth (which is 3rd option)
    // We need to convert to 0-based index for internal use if the CSV uses 1-based.
    // Let's assume the CSV uses 1-based indexing for the answer index since it says "question_1_answer_3" is correct and index is 3.
    const correctIndexRaw = Number(rawData[`question_${index}_correct_answer_index`] || 1);
    const correctAnswerIndex = correctIndexRaw - 1; 

    questions.push({
      id: index,
      text: String(questionText),
      answers,
      correctAnswerIndex,
      points: Number(rawData[`question_${index}_correct_points`] || 0),
      backgroundImage: rawData[`question_${index}_background_image`] ? String(rawData[`question_${index}_background_image`]) : undefined,
      feedbackTitle: rawData[`question_${index}_feedback_title`] ? String(rawData[`question_${index}_feedback_title`]) : undefined,
      feedbackBody: rawData[`question_${index}_feedback_body`] ? String(rawData[`question_${index}_feedback_body`]) : undefined,
    });

    index++;
  }

  if (questions.length === 0) {
     return { config, questions: DEFAULT_QUESTIONS };
  }

  return { config, questions };
};
