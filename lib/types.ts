// Types for the Python learning app

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'code-input';
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string | string[]; // For text-input and code-input, could be multiple possible answers
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface CardSet {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  quizzes: Quiz[];
  cards: CardSet[];
  icon: string;
}

export interface QuizProgress {
  completed: boolean;
  score: number;
  total: number;
  timestamp: string;
}

export interface CardSetProgress {
  completed: boolean;
  cardsStudied: number;
  totalCards: number;
  timestamp: string;
}

export interface RandomCardsProgress {
  completedAt: string;
  totalCards: number;
}

export interface UserProgress {
  completedQuizzes: string[]; // Quiz IDs
  scores: Record<string, number>; // Quiz ID -> score
  currentStreak: number;
  completedCardSets?: string[]; // Card set IDs
  randomCardsSessions?: RandomCardsProgress[];
}
