'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTopics } from '../../lib/dataLoader';
import { Quiz, CardSet, QuizProgress, CardSetProgress, RandomCardsProgress } from '../../lib/types';

export default function ProgressPage() {
  const [quizProgress, setQuizProgress] = useState<Record<string, QuizProgress>>({});
  const [cardProgress, setCardProgress] = useState<Record<string, CardSetProgress>>({});
  const [randomCardsSessions, setRandomCardsSessions] = useState<RandomCardsProgress[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProgress = localStorage.getItem('python-learning-progress');
    if (storedProgress) {
      const progress = JSON.parse(storedProgress);
      setQuizProgress(progress);
      setCardProgress(progress);
      setRandomCardsSessions(progress.randomCardsSessions || []);
    }

    loadTopics().then((topicsData) => {
      setTopics(topicsData);
      setLoading(false);
    });
  }, []);

  // Quiz progress
  const completedQuizzes = Object.keys(quizProgress).filter(quizId => quizProgress[quizId].completed && quizId !== 'randomCards');
  const totalQuizzes = topics.reduce((sum, topic) => sum + topic.quizzes.length, 0);
  const totalScore = completedQuizzes.reduce((sum, quizId) => sum + quizProgress[quizId].score, 0);
  const maxPossibleScore = completedQuizzes.reduce((sum, quizId) => sum + quizProgress[quizId].total, 0);
  const overallQuizScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Card progress
  const completedCardSets = Object.keys(cardProgress).filter(cardSetId => cardProgress[cardSetId].completed && cardSetId !== 'randomCards');
  const totalCardSets = topics.reduce((sum, topic) => sum + topic.cards.length, 0);
  const totalCardsStudied = completedCardSets.reduce((sum, cardSetId) => sum + cardProgress[cardSetId].cardsStudied, 0);
  const totalCardsAvailable = completedCardSets.reduce((sum, cardSetId) => sum + cardProgress[cardSetId].totalCards, 0);
  const overallCardsProgress = totalCardsAvailable > 0 ? Math.round((totalCardsStudied / totalCardsAvailable) * 100) : 0;

  const getQuizInfo = (quizId: string) => {
    for (const topic of topics) {
      const quiz = topic.quizzes.find((q: Quiz) => q.id === quizId);
      if (quiz) {
        return { topic, quiz };
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Learning Progress
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Track your Python learning journey
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {completedQuizzes.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Quizzes Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
          {overallQuizScore}%
          </div>
          <div className="text-gray-600 dark:text-gray-300">Quiz Average</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          {completedCardSets.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Card Sets Completed</div>
          </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {randomCardsSessions.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Random Sessions</div>
            </div>
          </div>

          {/* Progress by Topic */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Progress by Topic
            </h2>
            <div className="space-y-4">
            {topics.map((topic: { id: string; title: string; icon?: string; quizzes: Quiz[]; cards: CardSet[] }) => {
            const topicQuizzes: Quiz[] = topic.quizzes;
            const topicCards: CardSet[] = topic.cards;

            // Quiz progress
            const completedTopicQuizzes: Quiz[] = topicQuizzes.filter((quiz: Quiz) =>
            quizProgress[quiz.id]?.completed
            );
            const topicScore = completedTopicQuizzes.reduce((sum: number, quiz: Quiz) =>
            sum + (quizProgress[quiz.id].score / quizProgress[quiz.id].total), 0
            );
                const avgTopicScore = completedTopicQuizzes.length > 0
              ? Math.round((topicScore / completedTopicQuizzes.length) * 100)
            : 0;

            // Card progress
            const completedTopicCards: CardSet[] = topicCards.filter((cardSet: CardSet) =>
            cardProgress[cardSet.id]?.completed
            );

            return (
            <div key={topic.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
                <div className="text-2xl">{topic.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                {topic.title}
            </h3>
            </div>
            <Link
              href={`/topics/${topic.id}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue →
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-300">Quizzes: </span>
                <span className={`font-medium ${
                    avgTopicScore >= 80 ? 'text-green-600 dark:text-green-400' :
                      avgTopicScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                        }`}>
                          {completedTopicQuizzes.length}/{topicQuizzes.length} ({avgTopicScore}%)
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Cards: </span>
                        <span className={`font-medium ${
                          completedTopicCards.length === topicCards.length ? 'text-green-600 dark:text-green-400' :
                          completedTopicCards.length > 0 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {completedTopicCards.length}/{topicCards.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Results */}
          {completedQuizzes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Quiz Results
          </h2>
          <div className="space-y-4">
          {completedQuizzes
          .sort((a, b) => new Date(quizProgress[b].timestamp).getTime() - new Date(quizProgress[a].timestamp).getTime())
          .slice(0, 5)
          .map((quizId) => {
          const quizInfo = getQuizInfo(quizId);
          if (!quizInfo) return null;

          const { topic, quiz } = quizInfo;
          const quizProgressData = quizProgress[quizId];
          const quizScore = Math.round((quizProgressData.score / quizProgressData.total) * 100);

          return (
          <div key={quizId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
          {quiz.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
          {topic.title} • {new Date(quizProgressData.timestamp).toLocaleDateString()}
          </p>
          </div>
          <div className="text-right">
          <div className={`text-lg font-bold ${
          quizScore >= 80 ? 'text-green-600 dark:text-green-400' :
          quizScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400'
          }`}>
          {quizScore}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
          {quizProgressData.score}/{quizProgressData.total}
          </p>
          </div>
          </div>
          );
          })}
          </div>
          </div>
          )}

          {/* Recent Card Set Completions */}
          {completedCardSets.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Card Set Completions
              </h2>
              <div className="space-y-4">
                {completedCardSets
                  .sort((a, b) => new Date(cardProgress[b].timestamp).getTime() - new Date(cardProgress[a].timestamp).getTime())
                  .slice(0, 5)
                  .map((cardSetId) => {
                    // Find the topic and card set info
                    let topicInfo = null;
                    let cardSetInfo = null;
                    for (const topic of topics) {
                      const cardSet = topic.cards.find((c: CardSet) => c.id === cardSetId);
                      if (cardSet) {
                        topicInfo = topic;
                        cardSetInfo = cardSet;
                        break;
                      }
                    }

                    if (!topicInfo || !cardSetInfo) return null;

                    const cardProgressData = cardProgress[cardSetId];

                    return (
                      <div key={cardSetId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {cardSetInfo.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {topicInfo.title} • {new Date(cardProgressData.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            ✓ Completed
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {cardProgressData.cardsStudied}/{cardProgressData.totalCards} cards
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
