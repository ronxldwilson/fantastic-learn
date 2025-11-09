import { Topic, Quiz, CardSet } from './types';

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
    // Dynamic import of card JSON files
    const cardModule = await import(`./data/cards/${topicId}.json`);
    const cardSets = cardModule.default as CardSet[];
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

// Preload all topics and quizzes for better performance
export async function preloadAllData(): Promise<Topic[]> {
  return await loadTopics();
}
