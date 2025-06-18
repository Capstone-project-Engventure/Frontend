'use client';

import { Button } from '@/app/[locale]/components/ui/Button';
import type { Reading } from '@/lib/types/reading';
import { useEffect, useState } from 'react';

const ReadingWithQuestions = ({ title, content, exercises }: Reading) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
    const [selectedOptionKey, setSelectedOptionKey] = useState<string>('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [results, setResults] = useState<{ correct: number; total: number; score: number }>({ correct: 0, total: 0, score: 0 });

    const currentQuestion = exercises[currentQuestionIndex];
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === exercises.length - 1;

    const handleOptionChange = (key: string) => {
        setSelectedOptionKey(key);
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            if (selectedOptionKey) {
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOptionKey }));
            }
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            if (selectedOptionKey) {
                setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOptionKey }));
            }
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (selectedOptionKey) {
            const finalAnswers = { ...answers, [currentQuestion.id]: selectedOptionKey };

            // Tính điểm
            let correctCount = 0;
            exercises.forEach(exercise => {
                if (finalAnswers[exercise.id] === exercise.system_answer) {
                    correctCount++;
                }
            });

            const totalQuestions = exercises.length;
            const scorePercent = Math.round((correctCount / totalQuestions) * 100);

            setResults({
                correct: correctCount,
                total: totalQuestions,
                score: scorePercent
            });

            setAnswers(finalAnswers);
            setIsCompleted(true);
        } else {
            alert('Please select an answer before submitting.');
        }
    };
  
    const handleRestart = () => {
        setIsCompleted(false);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setSelectedOptionKey('');
        setResults({ correct: 0, total: 0, score: 0 });
    };

    useEffect(() => {
        if (!isCompleted) {
            setSelectedOptionKey(answers[currentQuestion?.id] || '');
        }
    }, [currentQuestionIndex, answers, currentQuestion?.id, isCompleted]);

    if (isCompleted) {
        return (
            <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-4 space-y-4">
                <h1 className="text-2xl font-bold text-center text-gray-800">{title}</h1>

                {/* Reading content */}
                <div className="text-gray-700 text-justify leading-relaxed whitespace-pre-line border-l-4 border-blue-500 pl-4">
                    {content}
                </div>

                {/* Results Header */}
                <div className="text-center bg-gray-50 p-6 rounded-lg">
                    <div className="text-4xl mb-4">🚀</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Test completed!</h2>
                    <p className="text-lg text-gray-600 mb-2">Correct answers: {results.correct}/{results.total}.</p>
                    <p className="text-lg text-gray-600 mb-4">Your score is {results.score}%.</p>
                    <p className="text-gray-600">Check your answers below:</p>
                </div>

                {/* Detailed Results */}
                <div className="space-y-6">
                    {exercises.map((exercise, index) => {
                        const userAnswer = answers[exercise.id];
                        const isCorrect = userAnswer === exercise.system_answer;
                        // const correctOption = exercise.options.find(opt => opt.key === exercise.system_answer);
                        // const userSelectedOption = exercise.options.find(opt => opt.key === userAnswer);

                        return (
                            <div key={exercise.id} className="border rounded-lg p-6">
                                <div className="flex items-start mb-4">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 text-lg">{exercise.question}</p>
                                </div>

                                <div className="space-y-3 ml-11">
                                    {exercise.options.map((option) => {
                                        const isUserSelected = option.key === userAnswer;
                                        const isSystemCorrect = option.key === exercise.system_answer;

                                        let optionClass = "p-3 rounded-lg border ";
                                        if (isSystemCorrect) {
                                            optionClass += "bg-green-100 border-green-300 text-green-800";
                                        } else if (isUserSelected && !isCorrect) {
                                            optionClass += "bg-red-100 border-red-300 text-red-800";
                                        } else {
                                            optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                                        }

                                        return (
                                            <div key={option.key} className={optionClass}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold">{option.key}.</span>
                                                    <span>{option.option}</span>
                                                    {isSystemCorrect && <span className="ml-2 text-green-600">✓</span>}
                                                    {isUserSelected && !isCorrect && <span className="ml-2 text-red-600">✗</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className={`mt-4 ml-11 p-4 rounded-r-lg border-l-4 ${exercise.explanation
                                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                    }`}>
                                    <p className="text-sm italic">
                                        {exercise.explanation
                                            ? <> <strong>Explanation:</strong> {exercise.explanation} </>
                                            : 'No explanation provided for this question.'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Restart Button */}
                <div className="flex justify-center pt-6">
                    <Button variant="default" onClick={handleRestart}>
                        Take Test Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-4 space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">{title}</h1>

            {/* Reading content */}
            <div className="text-gray-700 text-justify leading-relaxed whitespace-pre-line border-l-4 border-blue-500 pl-4">
                {content}
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center items-center space-x-2 py-4">
                <span className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {exercises.length}
                </span>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Current question block */}
            <div className="p-6 border rounded-lg bg-gray-50">
                <div className="flex items-start mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-sm font-bold">{currentQuestionIndex + 1}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-lg leading-8">{currentQuestion.question}</p>
                    </div>
                </div>

                <ul className="space-y-3 mx-2">
                    {currentQuestion.options.map((opt) => (
                        <li key={opt.key} className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                id={`opt-${opt.key}`}
                                value={opt.key}
                                onChange={() => handleOptionChange(opt.key)}
                                checked={selectedOptionKey === opt.key}
                                className="w-4 h-4 text-blue-600"
                            />
                            <label
                                htmlFor={`opt-${opt.key}`}
                                className={`flex items-center cursor-pointer space-x-2 p-2 rounded-lg transition-colors ${selectedOptionKey === opt.key
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'hover:bg-gray-200'
                                    }`}
                            >
                                <span className="font-bold text-gray-600">{opt.key}.</span>
                                <span className="text-gray-700">{opt.option}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center pt-4 gap-2">
                {!isFirstQuestion && (
                    <Button variant="outline" onClick={handlePrevious}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </Button>
                )}

                {isLastQuestion ? (
                    <Button variant="default" onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        Submit Answers
                    </Button>
                ) : (
                    <Button variant="default" onClick={handleNext}>
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ReadingWithQuestions;
