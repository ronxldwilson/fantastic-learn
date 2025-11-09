'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadAllCards } from '../../lib/dataLoader';

interface ExtendedCard {
  id: string;
  front: string;
  back: string;
  topicId: string;
  topicTitle: string;
  cardSetTitle: string;
}

export default function RandomCardsPage() {
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    loadAllCards().then((allCards) => {
      setCards(allCards as ExtendedCard[]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading random cards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No cards available.</p>
          <Link href="/" className="mt-4 inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Save completion
      const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
      if (!progress.randomCards) progress.randomCards = {};
      progress.randomCards.completedAt = new Date().toISOString();
      progress.randomCards.totalCards = totalCards;
      localStorage.setItem('python-learning-progress', JSON.stringify(progress));

      setSessionCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Random Learning Session Completed!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                You've reviewed all {totalCards} flashcards from the mixed collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Start New Random Session
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
                🎲 Random Flashcards
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Mixed Topics
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Card {currentIndex + 1} of {totalCards}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              From: {currentCard.topicTitle} - {currentCard.cardSetTitle}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6 min-h-64 flex items-center justify-center text-center">
            {isFlipped ? (
              <div>
                <div className="text-2xl mb-4">💡</div>
                <p className="text-lg text-gray-900 dark:text-white mb-4">
                  {currentCard.back}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-4">💭</div>
                <p className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  {currentCard.front}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click the button below to reveal answer</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Previous
            </button>

            <button
              onClick={handleFlip}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </button>

            <button
              onClick={handleNext}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                currentIndex === totalCards - 1
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {currentIndex === totalCards - 1 ? 'Finish Session' : 'Next →'}
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
