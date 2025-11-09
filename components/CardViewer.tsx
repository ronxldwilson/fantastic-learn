'use client';

import { Card } from '../lib/types';
import { useState } from 'react';

interface CardViewerProps {
  cards: Card[];
  cardSetId: string;
  topicId: string;
  onComplete?: () => void;
}

export default function CardViewer({ cards, cardSetId, topicId, onComplete }: CardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
      // Save progress
      const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
      if (!progress.cardSets) progress.cardSets = {};
      progress.cardSets[`${topicId}-${cardSetId}`] = {
        completed: true,
        completedAt: new Date().toISOString(),
        totalCards
      };
      localStorage.setItem('python-learning-progress', JSON.stringify(progress));

      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center">
        <p>No cards available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Card {currentIndex + 1} of {totalCards}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </button>

        <button
          onClick={handleNext}
          className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
            currentIndex === totalCards - 1
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {currentIndex === totalCards - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
