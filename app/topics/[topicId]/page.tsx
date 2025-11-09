import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadTopics } from '../../../lib/dataLoader';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { topicId } = await params;
  const topics = await loadTopics();
  const topic = topics.find(t => t.id === topicId);

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{topic.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {topic.description}
            </p>
          </div>

          {/* Quizzes Section */}
          {topic.quizzes.length > 0 && (
          <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Quizzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.quizzes.map((quiz) => (
          <Link
          key={quiz.id}
            href={`/quiz/${topicId}/${quiz.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transform hover:-translate-y-1"
          >
          <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {quiz.title}
          </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              quiz.difficulty === 'beginner'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : quiz.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {quiz.difficulty}
              </span>
          </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {quiz.description}
          </p>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {quiz.questions.length} questions
                    </span>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        Start Quiz →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Learn Section */}
          {topic.cards.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Learn with Flashcards
              </h2>
              <div className="text-center mb-6">
                <Link
                  href={`/learn/${topicId}`}
                  className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
                >
                  📚 Start Learning
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topic.cards.map((cardSet) => (
                  <div
                    key={cardSet.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {cardSet.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cardSet.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : cardSet.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {cardSet.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {cardSet.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {cardSet.cards.length} cards
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 mr-4"
            >
              ← Back to Topics
            </Link>
            <Link
              href="/progress"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const topics = await loadTopics();
  return topics.map((topic) => ({
    topicId: topic.id,
  }));
}
