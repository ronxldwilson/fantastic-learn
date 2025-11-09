'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTopics } from '../../lib/dataLoader';
import { Quiz } from '../../lib/types';

interface QuizProgress {
  completed: boolean;
  score: number;
  total: number;
  timestamp: string;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<Record<string, QuizProgress>>({});
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProgress = localStorage.getItem('python-learning-progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    loadTopics().then((topicsData) => {
      setTopics(topicsData);
      setLoading(false);
    });
  }, []);

  const completedQuizzes = Object.keys(progress).filter(quizId => progress[quizId].completed);
  const totalQuizzes = topics.reduce((sum, topic) => sum + topic.quizzes.length, 0);
  const totalScore = completedQuizzes.reduce((sum, quizId) => sum + progress[quizId].score, 0);
  const maxPossibleScore = completedQuizzes.reduce((sum, quizId) => sum + progress[quizId].total, 0);
  const overallScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {completedQuizzes.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Quizzes Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {overallScore}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Average Score</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {totalQuizzes - completedQuizzes.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Quizzes Remaining</div>
            </div>
          </div>

          {/* Progress by Topic */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Progress by Topic
            </h2>
            <div className="space-y-4">
              {topics.map((topic: { id: string; title: string; icon?: string; quizzes: Quiz[] }) => {
                const topicQuizzes: Quiz[] = topic.quizzes;
                const completedTopicQuizzes: Quiz[] = topicQuizzes.filter((quiz: Quiz) =>
                  progress[quiz.id]?.completed
                );
                const topicScore = completedTopicQuizzes.reduce((sum: number, quiz: Quiz) =>
                  sum + (progress[quiz.id].score / progress[quiz.id].total), 0
                );
                const avgTopicScore = completedTopicQuizzes.length > 0
                  ? Math.round((topicScore / completedTopicQuizzes.length) * 100)
                  : 0;

                return (
                  <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{topic.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {completedTopicQuizzes.length} of {topicQuizzes.length} quizzes completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        avgTopicScore >= 80 ? 'text-green-600 dark:text-green-400' :
                        avgTopicScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {avgTopicScore}%
                      </div>
                      <Link
                        href={`/topics/${topic.id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Continue →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Results */}
          {completedQuizzes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Quiz Results
              </h2>
              <div className="space-y-4">
                {completedQuizzes
                  .sort((a, b) => new Date(progress[b].timestamp).getTime() - new Date(progress[a].timestamp).getTime())
                  .slice(0, 10)
                  .map((quizId) => {
                    const quizInfo = getQuizInfo(quizId);
                    if (!quizInfo) return null;

                    const { topic, quiz } = quizInfo;
                    const quizProgress = progress[quizId];
                    const quizScore = Math.round((quizProgress.score / quizProgress.total) * 100);

                    return (
                      <div key={quizId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {topic.title} • {new Date(quizProgress.timestamp).toLocaleDateString()}
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
                            {quizProgress.score}/{quizProgress.total}
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
