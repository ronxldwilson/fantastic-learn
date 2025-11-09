'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadCardSetsForTopic, loadCardSet } from '../../../lib/dataLoader';
import CardViewer from '../../../components/CardViewer';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function LearnPage({ params }: PageProps) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ topicId: string } | null>(null);
  const [cardSets, setCardSets] = useState<any[]>([]);
  const [selectedCardSet, setSelectedCardSet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      loadCardSetsForTopic(resolvedParams.topicId).then((sets) => {
        setCardSets(sets);
        setLoading(false);
      });
    }
  }, [resolvedParams]);

  const handleSelectCardSet = async (cardSetId: string) => {
    if (resolvedParams) {
      const cardSet = await loadCardSet(resolvedParams.topicId, cardSetId);
      setSelectedCardSet(cardSet);
    }
  };

  const handleComplete = () => {
    // Save progress or something
    setSelectedCardSet(null);
  };

  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading learning materials...</p>
        </div>
      </div>
    );
  }

  const { topicId } = resolvedParams;

  if (selectedCardSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-8">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCardSet.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCardSet.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : selectedCardSet.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {selectedCardSet.difficulty}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{selectedCardSet.description}</p>
            </div>

            {/* Card Viewer */}
            <CardViewer
              cards={selectedCardSet.cards}
              cardSetId={selectedCardSet.id}
              topicId={topicId}
              onComplete={handleComplete}
            />

            {/* Navigation */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSelectedCardSet(null)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                ← Back to Card Sets
              </button>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Learn Python - {topicId.charAt(0).toUpperCase() + topicId.slice(1)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a card set to start learning with flashcards.
            </p>
          </div>

          {/* Card Sets Grid */}
          {cardSets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardSets.map((cardSet) => (
                <div
                  key={cardSet.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleSelectCardSet(cardSet.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {cardSet.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cardSet.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : cardSet.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {cardSet.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {cardSet.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {cardSet.cards.length} cards
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Learning Materials Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learning cards for this topic are coming soon!
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
