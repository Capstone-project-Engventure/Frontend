'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/app/[locale]/components/ui/Button';
import readingPracticeService from '@/lib/services/reading-practice.service';
import LessonService from '@/lib/services/lesson.service';
import { toast } from 'react-toastify';

interface Exercise {
    id: number;
    name: string;
    question: string;
    system_answer: string;
    type: {
        id: number;
        name: string;
        description: string;
    };
    level: string;
    skill: string;
    options: Array<{
        key: string;
        option: string;
    }>;
    explanation?: string;
}

export default function GrammarPracticePage({ params }: { params: { locale: string; id: string } }) {
    const router = useRouter();
    const locale = useLocale();
    const lessonService = new LessonService();
    
    const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // Exercise state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [hearts, setHearts] = useState(5);

    useEffect(() => {
        const stored = localStorage.getItem("current_lesson");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setTitle(parsed.title || '');
                setDescription(parsed.description || '');
            } catch (e) {
                console.error("Failed to parse reading data from localStorage.");
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await lessonService.getById(Number(params.id));
                if (result.success) {
                    const exercises = result.data?.exercises || [];
                    setExerciseData(exercises);
                } else {
                    console.error("Failed to load reading practice from API.");
                    toast.error("Failed to load exercises");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error loading exercises");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const currentExercise = exerciseData[currentIndex];
    const totalExercises = exerciseData.length;
    const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

    const handleOptionSelect = (optionKey: string) => {
        if (showResult) return;
        setSelectedOption(optionKey);
    };

    const handleCheck = () => {
        if (!selectedOption) {
            toast.warning('Please select an answer first!');
            return;
        }

        const correct = selectedOption === currentExercise.system_answer;
        setIsCorrect(correct);
        setShowResult(true);
        setShowExplanation(true);
        
        if (correct) {
            setCompletedCount(prev => prev + 1);
            toast.success('Correct! Well done!');
        } else {
            setHearts(prev => Math.max(0, prev - 1));
            toast.error('Incorrect. Try again!');
        }
    };

    const handleNext = () => {
        if (currentIndex < exerciseData.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetQuestion();
        } else {
            toast.success('Congratulations! You completed all exercises!');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetQuestion();
        }
    };

    const resetQuestion = () => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
        setShowExplanation(false);
    };

    const getOptionStyle = (optionKey: string) => {
        const baseStyle = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 hover:shadow-md font-medium cursor-pointer";
        
        if (!showResult) {
            return `${baseStyle} ${
                selectedOption === optionKey
                    ? "border-amber-500 bg-amber-50 shadow-md text-amber-700"
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
            }`;
        }
        
        // Show results
        if (optionKey === currentExercise.system_answer) {
            return `${baseStyle} border-green-500 bg-green-50 text-green-800 cursor-default`;
        } else if (optionKey === selectedOption && !isCorrect) {
            return `${baseStyle} border-red-500 bg-red-50 text-red-800 cursor-default`;
        } else {
            return `${baseStyle} border-gray-200 bg-gray-100 text-gray-500 cursor-default`;
        }
    };

    const getOptionIcon = (optionKey: string) => {
        if (!showResult) return null;
        
        if (optionKey === currentExercise.system_answer) {
            return <span className="text-green-600 font-bold text-lg">✓</span>;
        } else if (optionKey === selectedOption && !isCorrect) {
            return <span className="text-red-600 font-bold text-lg">✗</span>;
        }
        return null;
    };

    const ExerciseComponent = () => {
        if (!currentExercise) return null;

        return (
            <div className="bg-white rounded-lg shadow-sm">
                {/* Progress Header */}
                <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                {currentExercise.level}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {currentExercise.skill}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-red-500">
                            <span className="text-xl">❤️</span>
                            <span className="font-bold">{hearts}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Question {currentIndex + 1} of {totalExercises}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <span className="text-sm text-gray-500 mb-2 block">{currentExercise.name}</span>
                        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                            {currentExercise.question}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {Array.isArray(currentExercise.options) &&
                            currentExercise.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={getOptionStyle(option.key)}
                                    onClick={() => handleOptionSelect(option.key)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                                                {option.key}
                                            </span>
                                            <span className="text-gray-800">{option.option}</span>
                                        </div>
                                        {getOptionIcon(option.key)}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Explanation */}
                    {showExplanation && currentExercise.explanation && (
                        <div className={`p-4 rounded-xl border-l-4 mb-6 ${
                            isCorrect 
                                ? 'bg-green-50 border-green-400' 
                                : 'bg-red-50 border-red-400'
                        }`}>
                            <h3 className="font-semibold mb-2 text-gray-800">Explanation:</h3>
                            <p className="text-gray-700">{currentExercise.explanation}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-3">
                            <button 
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Previous
                            </button>
                        </div>
                        
                        <div className="flex space-x-3">
                            {!showResult ? (
                                <button
                                    onClick={handleCheck}
                                    className="px-8 py-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 font-medium transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <>
                                    {!isCorrect && (
                                        <button
                                            onClick={resetQuestion}
                                            className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 font-medium transition-all duration-200"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                    {currentIndex < exerciseData.length - 1 && (
                                        <button
                                            onClick={handleNext}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                                        >
                                            Next Question →
                                        </button>
                                    )}
                                    {currentIndex === exerciseData.length - 1 && isCorrect && (
                                        <button
                                            className="px-8 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 font-medium transition-all duration-200"
                                        >
                                            Complete! 🎉
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
            <Button
                variant="destructive"
                onClick={() => router.push(`/${locale}/student/practice/reading`)}
                className="mb-6"
            >
                <svg
                    className="w-4 h-3 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 8 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                    />
                </svg>
                Back
            </Button>

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                    <div className="w-full h-1 bg-amber-500 rounded mb-3" />
                    <p className="text-gray-700 leading-7 font-medium bg-gray-50 p-4 rounded-lg italic">
                        {description}
                    </p>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading exercises...</p>
                        </div>
                    </div>
                ) : exerciseData.length > 0 ? (
                    <ExerciseComponent />
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-red-600">
                            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-lg font-medium">No exercises available</p>
                            <p className="text-gray-500 mt-2">Failed to load grammar practice data or no exercises found.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}