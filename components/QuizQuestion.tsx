'use client';

import { Question } from '../lib/types';
import { useState, useEffect } from 'react';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  showResult?: boolean;
}

export default function QuizQuestion({ question, onAnswer, showResult }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setTextAnswer('');
    setSubmitted(false);
  }, [question.id]);

  const handleMultipleChoiceSubmit = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    setSubmitted(true);
    onAnswer(isCorrect, selectedAnswer);
  };

  const handleTextSubmit = () => {
    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.some(answer => answer.toLowerCase() === textAnswer.toLowerCase().trim())
      : question.correctAnswer.toLowerCase() === textAnswer.toLowerCase().trim();
    setSubmitted(true);
    onAnswer(isCorrect, textAnswer);
  };

  const isCorrect = submitted && (
    question.type === 'multiple-choice'
      ? selectedAnswer === question.correctAnswer
      : Array.isArray(question.correctAnswer)
      ? question.correctAnswer.some(answer => answer.toLowerCase() === textAnswer.toLowerCase().trim())
      : question.correctAnswer.toLowerCase() === textAnswer.toLowerCase().trim()
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {question.question}
      </h3>

      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                submitted
                  ? option === question.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : selectedAnswer === option
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600'
                  : selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={submitted}
                className="mr-3"
              />
              <span className={`${
                submitted && option === question.correctAnswer
                  ? 'text-green-700 dark:text-green-300 font-medium'
                  : submitted && selectedAnswer === option && option !== question.correctAnswer
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {option}
              </span>
            </label>
          ))}
          {!submitted && (
            <button
              onClick={handleMultipleChoiceSubmit}
              disabled={!selectedAnswer}
              className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Submit Answer
            </button>
          )}
        </div>
      )}

      {question.type === 'text-input' && (
      <div className="space-y-4">
      <input
      type="text"
      value={textAnswer}
      onChange={(e) => setTextAnswer(e.target.value)}
      disabled={submitted}
      placeholder="Enter your answer..."
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
      submitted
      ? isCorrect
      ? 'border-green-500 focus:ring-green-500'
      : 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
      }`}
      />
      {!submitted && (
      <button
      onClick={handleTextSubmit}
      disabled={!textAnswer.trim()}
      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
      >
      Submit Answer
      </button>
      )}
      </div>
      )}

      {question.type === 'code-input' && (
        <div className="space-y-4">
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Enter your code..."
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm ${
              submitted
                ? isCorrect
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
            }`}
          />
          {!submitted && (
            <button
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim()}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Submit Answer
            </button>
          )}
        </div>
      )}

      {submitted && question.explanation && (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
        }`}>
          <div className={`font-medium ${
            isCorrect
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <p className={`mt-1 ${
            isCorrect
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {question.explanation}
          </p>
          {question.type === 'text-input' && !isCorrect && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(' or ') : question.correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
