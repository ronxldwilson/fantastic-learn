import Link from 'next/link';
import { loadTopics } from '../lib/dataLoader';

export default async function Home() {
  const topics = await loadTopics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Learn Python
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master Python programming with interactive quizzes, comprehensive modules,
            and hands-on learning. Start your journey to becoming a Python expert!
          </p>
        </div>

        {/* Learning Mode */}
        <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        📚 Learn with Flashcards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {topics.filter(topic => topic.cards.length > 0).map((topic) => (
        <Link
        key={`learn-${topic.id}`}
        href={`/learn/${topic.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500"
        >
        <div className="text-center">
        <div className="text-4xl mb-4">{topic.icon}</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            {topic.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
              {topic.description}
              </p>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {topic.cards.length} Card Sets Available
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {topics.filter(topic => topic.cards.length > 0).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Flashcard learning materials coming soon!</p>
            </div>
          )}
        </div>

        {/* Quiz Mode */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🧠 Take Quizzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topics.filter(topic => topic.quizzes.length > 0).map((topic) => (
              <Link
                key={`quiz-${topic.id}`}
                href={`/topics/${topic.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {topic.description}
                  </p>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {topic.quizzes.length} Quizzes Available
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {topics.filter(topic => topic.quizzes.length > 0).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Quiz materials coming soon!</p>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/progress"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            View Your Progress
          </Link>
        </div>
      </div>
    </div>
  );
}
