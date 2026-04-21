export interface Word {
  id: string;
  text: string;
  phonetic?: string;
}

export interface WordList {
  id: string;
  title: string;
  words: Word[];
  created_at: string;
}

export interface AttemptData {
  word_id: string;
  word_text: string;
  attempts: number;
  correct: boolean;
  spoken_text?: string;
}

export interface StudentResult {
  id: string;
  list_id: string;
  student_name: string;
  score: number;
  attempts_data: AttemptData[];
  completed_at: string;
}

export interface PracticeState {
  currentWordIndex: number;
  attempts: number;
  results: AttemptData[];
  isListening: boolean;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | 'tryAgain' | null;
  spokenText: string;
}
