export interface Word {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  example: string;
  exampleTranslation: string;
  category: string;
}

export type AppMode = 'learn' | 'quiz' | 'list';

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}
