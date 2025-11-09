'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadAllQuestions } from '../../lib/dataLoader';
import QuizQuestion from '../../components/QuizQuestion';

interface ExtendedQuestion {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'code-input';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  topicId: string;
  topicTitle: string;
  quizTitle: string;
}

export default function RandomQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ExtendedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; isCorrect: boolean }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllQuestions().then((allQuestions) => {
      setQuestions(allQuestions as ExtendedQuestion[]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading random quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No questions available.</p>
          <Link href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: { answer, isCorrect }
    };
    setAnswers(newAnswers);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
        // Save progress
        const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
        if (!progress.randomQuiz) progress.randomQuiz = {};
        progress.randomQuiz.completedAt = new Date().toISOString();
        progress.randomQuiz.score = Object.values(newAnswers).filter(a => a.isCorrect).length;
        progress.randomQuiz.total = totalQuestions;
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
                Random Quiz Completed!
              </h1>
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {score}%
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                You got {correctAnswers} out of {totalQuestions} questions correct.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Take Another Random Quiz
                </button>
                <Link
                  href="/progress"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-center"
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
                🎲 Random Quiz
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Mixed Topics
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              From: {currentQuestion.topicTitle} - {currentQuestion.quizTitle}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Exit Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
