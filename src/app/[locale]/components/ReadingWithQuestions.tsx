'use client';

import { Button } from "@/app/[locale]/components/ui/Button";
import React, { useState, useEffect } from 'react';

type ExerciseOption = {
    key: string;
    option: string;
};

type Exercise = {
    id: number;
    name: string;
    question: string;
    options: ExerciseOption[];
};

type ReadingWithQuestionsProps = {
    title: string | null;
    content: string | null;
    exercises: Exercise[];
};

const ReadingWithQuestions = ({ title, content, exercises }: ReadingWithQuestionsProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
    const [selectedOptionKey, setSelectedOptionKey] = useState<string>('');

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
            console.log('Submitted answers:', finalAnswers);
            alert('Submitted successfully!');
        } else {
            alert('Please select an answer before submitting.');
        }
    };

    useEffect(() => {
        setSelectedOptionKey(answers[currentQuestion?.id] || '');
    }, [currentQuestionIndex, answers, currentQuestion?.id]);

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
                                className={`flex items-center cursor-pointer space-x-2 p-2 rounded-lg transition-colors ${
                                    selectedOptionKey === opt.key
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <span className="font-medium text-gray-600">{opt.key}.</span>
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
