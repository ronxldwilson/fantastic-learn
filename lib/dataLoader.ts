import { Topic, Quiz, CardSet, Question, Card } from './types';

// Import topics metadata
import topicsJson from './data/topics.json';

// Cache for loaded quizzes
const quizzesCache: Record<string, Quiz[]> = {};

// Cache for loaded card sets
const cardSetsCache: Record<string, CardSet[]> = {};

export async function loadTopics(): Promise<Topic[]> {
  try {
    // Load quizzes and cards for each topic
    const topicsWithData = await Promise.all(
      topicsJson.map(async (topic) => {
        const [quizzes, cards] = await Promise.all([
          loadQuizzesForTopic(topic.id).catch(() => []),
          loadCardSetsForTopic(topic.id).catch(() => [])
        ]);
        return {
          ...topic,
          quizzes,
          cards
        } as Topic;
      })
    );
    return topicsWithData;
  } catch (error) {
    console.error('Error loading topics:', error);
    return [];
  }
}

export async function loadQuizzesForTopic(topicId: string): Promise<Quiz[]> {
  if (quizzesCache[topicId]) {
    return quizzesCache[topicId];
  }

  try {
    // Dynamic import of quiz JSON files
    const quizModule = await import(`./data/quizzes/${topicId}.json`);
    const quizzes = quizModule.default as Quiz[];
    quizzesCache[topicId] = quizzes;
    return quizzes;
  } catch (error) {
    console.error(`Error loading quizzes for topic ${topicId}:`, error);
    return [];
  }
}

export async function loadCardSetsForTopic(topicId: string): Promise<CardSet[]> {
  if (cardSetsCache[topicId]) {
    return cardSetsCache[topicId];
  }

  try {
    // Dynamic import of card JSON files - wrapped in promise to ensure it resolves
    const cardSets = await new Promise<CardSet[]>((resolve) => {
      import(`./data/cards/${topicId}.json`)
        .then((cardModule) => resolve(cardModule.default as CardSet[]))
        .catch(() => resolve([]));
    });
    cardSetsCache[topicId] = cardSets;
    return cardSets;
  } catch (error) {
    console.error(`Error loading card sets for topic ${topicId}:`, error);
    return [];
  }
}

export async function loadQuiz(topicId: string, quizId: string): Promise<Quiz | null> {
  try {
    const quizzes = await loadQuizzesForTopic(topicId);
    return quizzes.find(quiz => quiz.id === quizId) || null;
  } catch (error) {
    console.error(`Error loading quiz ${quizId} for topic ${topicId}:`, error);
    return null;
  }
}

export async function loadCardSet(topicId: string, cardSetId: string): Promise<CardSet | null> {
  try {
    const cardSets = await loadCardSetsForTopic(topicId);
    return cardSets.find(cardSet => cardSet.id === cardSetId) || null;
  } catch (error) {
    console.error(`Error loading card set ${cardSetId} for topic ${topicId}:`, error);
    return null;
  }
}

// Load all questions from all topics for random quiz
export async function loadAllQuestions(): Promise<Question[]> {
  const topics = await loadTopics();
  const allQuestions: Question[] = [];

  for (const topic of topics) {
    for (const quiz of topic.quizzes) {
      allQuestions.push(...quiz.questions.map(q => ({
        ...q,
        // Add topic info for context
        topicId: topic.id,
        topicTitle: topic.title,
        quizTitle: quiz.title
      })));
    }
  }

  // Shuffle the questions
  return shuffleArray(allQuestions);
}

// Load all cards from all topics for random learning
export async function loadAllCards(): Promise<Card[]> {
  const topics = await loadTopics();
  const allCards: Card[] = [];

  for (const topic of topics) {
    for (const cardSet of topic.cards) {
      allCards.push(...cardSet.cards.map(c => ({
        ...c,
        // Add topic info for context
        topicId: topic.id,
        topicTitle: topic.title,
        cardSetTitle: cardSet.title
      })));
    }
  }

  // Shuffle the cards
  return shuffleArray(allCards);
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Preload all topics and quizzes for better performance
export async function preloadAllData(): Promise<Topic[]> {
  return await loadTopics();
}
