'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadQuiz } from '../../../../lib/dataLoader';
import QuizQuestion from '../../../../components/QuizQuestion';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ topicId: string; quizId: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ topicId: string; quizId: string } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; isCorrect: boolean }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      loadQuiz(resolvedParams.topicId, resolvedParams.quizId).then((quizData) => {
        setQuiz(quizData);
        setLoading(false);
      });
    }
  }, [resolvedParams]);

  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const { topicId, quizId } = resolvedParams;

  if (!quiz) {
    notFound();
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: { answer, isCorrect }
    };
    setAnswers(newAnswers);

    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
        // Save progress to localStorage (in a real app, this would go to a backend)
        const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
        progress[quizId] = {
          completed: true,
          score: (Object.values(newAnswers) as { answer: string; isCorrect: boolean }[]).filter(a => a.isCorrect).length,
          total: totalQuestions,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('python-learning-progress', JSON.stringify(progress));
      }
    }, 2000);
  };

  const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Completed!
              </h1>
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {score}%
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                You got {correctAnswers} out of {totalQuestions} questions correct.
              </p>

              <div className="space-y-3 mb-8">
                <div className={`text-lg font-medium ${
                  score >= 80 ? 'text-green-600 dark:text-green-400' :
                  score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {score >= 80 ? 'Excellent work!' :
                   score >= 60 ? 'Good job!' :
                   'Keep practicing!'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push(`/topics/${topicId}`)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Take Another Quiz
                </button>
                <Link
                  href="/progress"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-center"
                >
                  View Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                quiz.difficulty === 'beginner'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : quiz.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {quiz.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Object.keys(answers).length} answered</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            showResult={false}
          />

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => router.push(`/topics/${topicId}`)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Exit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
