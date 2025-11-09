'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [allCards, setAllCards] = useState<ExtendedCard[]>([]);
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    loadAllCards().then((loadedCards) => {
      setAllCards(loadedCards as ExtendedCard[]);
      setCards(loadedCards as ExtendedCard[]);
      setLoading(false);
    });
  }, []);

  // Filter cards based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCards(allCards);
    } else {
      const filtered = allCards.filter(card =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardSetTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCards(filtered);
      // Reset to first card when search changes
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [searchTerm, allCards]);

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
        <p className="text-gray-600 dark:text-gray-300">
          {searchTerm ? `No cards found matching "${searchTerm}".` : 'No cards available.'}
        </p>
        {searchTerm && (
            <button
                onClick={() => setSearchTerm('')}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                  >
                    Clear Search
                  </button>
                )}
                <Link href="/" className="mt-4 inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                  Back to Home
                </Link>
              </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const navigateToCard = (newIndex: number) => {
    if (isAnimating || newIndex < 0 || newIndex >= totalCards) return;

    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setIsFlipped(false);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
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
        navigateToCard(currentIndex - 1);
      } else {
        // Swipe left - go to next card
        navigateToCard(currentIndex + 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleWebSearch = () => {
    const searchQuery = encodeURIComponent(currentCard.front);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      navigateToCard(currentIndex + 1);
    } else {
      // Save completion
      const progress = JSON.parse(localStorage.getItem('python-learning-progress') || '{}');
      if (!progress.randomCardsSessions) progress.randomCardsSessions = [];
      progress.randomCardsSessions.push({
        completedAt: new Date().toISOString(),
        totalCards: totalCards
      });
      localStorage.setItem('python-learning-progress', JSON.stringify(progress));

      setSessionCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateToCard(currentIndex - 1);
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

          {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cards by question, answer, topic, or card set..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Showing {cards.length} of {allCards.length} cards matching "{searchTerm}"
                </p>
              )}
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
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6 min-h-64 flex items-center justify-center text-center transition-all duration-300 cursor-pointer ${
              isAnimating ? 'transform scale-95 opacity-50' : 'transform scale-100 opacity-100'
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleFlip}
            style={{ touchAction: 'pan-y' }}
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
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
            {/* <button
              onClick={handleFlip}
                className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
                 {isFlipped ? 'Show Question' : 'Show Answer'}
            </button> */}

            <button
              onClick={handleWebSearch}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
            title="Search this question on the web"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                <span>Web Search</span>
                </button>
              </div>

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
