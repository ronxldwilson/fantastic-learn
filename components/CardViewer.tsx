'use client';

import { Card } from '../lib/types';
import { useState, useRef } from 'react';

interface CardViewerProps {
  cards: Card[];
  cardSetId: string;
  topicId: string;
  onComplete?: () => void;
}

export default function CardViewer({ cards, cardSetId, topicId, onComplete }: CardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const navigateToCard = (newIndex: number) => {
    if (isAnimating || newIndex < 0 || newIndex >= totalCards) return;

    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setIsFlipped(false);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      navigateToCard(currentIndex + 1);
    } else {
      // Save progress
      const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
      progress[cardSetId] = {
        completed: true,
        cardsStudied: totalCards,
        totalCards: totalCards,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('python-learning-progress', JSON.stringify(progress));

      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateToCard(currentIndex - 1);
    }
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only consider horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous card
        handlePrev();
      } else {
        // Swipe left - go to next card
        handleNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
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
      {/* Card */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6 min-h-64 flex items-center justify-center text-center transition-all duration-300 cursor-pointer ${
          isAnimating ? 'transform scale-95 opacity-50' : 'transform scale-100 opacity-100'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleFlip}
        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but prevent horizontal scroll
      >
        {isFlipped ? (
          <div className="animate-fade-in">
            <div className="text-2xl mb-4">💡</div>
            <p className="text-lg text-gray-900 dark:text-white mb-4">
              {currentCard.back}
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-2xl mb-4">💭</div>
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              {currentCard.front}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tap to reveal answer or swipe to navigate</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking search
                const searchQuery = encodeURIComponent(currentCard.front);
                window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
              }}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
              title="Search online for this concept"
            >
              <span>🔍</span>
              Search Online
            </button>
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
