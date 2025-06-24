// src\app\[locale]\student\my-course\[id]\exercise\[exerciseId]\page.tsx
"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseQuestion from "@/app/[locale]/components/exercises/ExerciseQuestion";
import { Button } from "@/app/[locale]/components/ui/Button";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";

// Mock data cho lesson có type="exercise"
const mockLessonWithExercises = {
    id: 2,
    title: "Cấu trúc câu đơn giản",
    level: "Beginner",
    description: "Học về cấu trúc câu cơ bản trong tiếng Anh",
    type: "exercise",
    readings: [],
    exercises: [
        {
            id: 238,
            name: "Câu hỏi chào hỏi",
            question: "How are you?",
            system_answer: "Fine thanks",
            type: {
                id: 1,
                name: "Multiple Choice",
                description: "Trắc nghiệm"
            },
            type_id: 1,
            level: "A1",
            skill: "speaking",
            image: null,
            lesson: null,
            generated_by: "admin",
            description: "Chọn câu trả lời phù hợp cho câu hỏi chào hỏi",
            options: [
                {
                    key: "Fine thanks",
                    option: "Fine thanks"
                },
                {
                    key: "Not good",
                    option: "Not good"
                },
                {
                    key: "I'm busy",
                    option: "I'm busy"
                }
            ],
            explanation: "Câu trả lời 'Fine thanks' là cách trả lời lịch sự và phổ biến nhất khi được hỏi 'How are you?'",
            audio_file: null,
            audio_file_url: "",
            status: "active"
        },
        {
            id: 237,
            name: "Giới thiệu tên",
            question: "What's your name?",
            system_answer: "My name is John",
            type: {
                id: 1,
                name: "Multiple Choice",
                description: "Trắc nghiệm"
            },
            type_id: 1,
            level: "A1",
            skill: "speaking",
            image: null,
            lesson: null,
            generated_by: "admin",
            description: "Chọn cách giới thiệu tên phù hợp",
            options: [
                {
                    key: "I am student",
                    option: "I am student"
                },
                {
                    key: "My name is John",
                    option: "My name is John"
                },
                {
                    key: "Yes, please",
                    option: "Yes, please"
                }
            ],
            explanation: "Khi được hỏi tên, cách trả lời đúng là 'My name is [tên của bạn]' hoặc 'I'm [tên của bạn]'",
            audio_file: null,
            audio_file_url: ""
        },
        {
            id: 236,
            name: "Hỏi về tuổi",
            question: "Are you a student?",
            system_answer: "Yes, I am",
            type: {
                id: 1,
                name: "Multiple Choice",
                description: "Trắc nghiệm"
            },
            type_id: 1,
            level: "A1",
            skill: "speaking",
            image: null,
            lesson: null,
            generated_by: "admin",
            description: "Trả lời câu hỏi về nghề nghiệp",
            options: [
                {
                    key: "Yes, I am",
                    option: "Yes, I am"
                },
                {
                    key: "No, thank you",
                    option: "No, thank you"
                },
                {
                    key: "Fine thanks",
                    option: "Fine thanks"
                }
            ],
            explanation: "Khi được hỏi câu hỏi Yes/No, ta trả lời 'Yes, I am' hoặc 'No, I'm not' tùy theo tình huống thực tế",
            audio_file: null,
            audio_file_url: ""
        }
    ],
    image: null,
    video: null
};

export default function ExercisePage() {
    const locale = useLocale();
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const exerciseId = params.exerciseId as string;

    const [lessonData, setLessonData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const breadcrumbs = [
        { label: "Home", href: `/${locale}/student` },
        { label: "Classes", href: `/${locale}/student/my-course` },
        { label: "Course", href: `/${locale}/student/my-course/${courseId}` },
        { label: "Exercise", href: `/${locale}/student/my-course/${courseId}/exercise/${exerciseId}` },
    ];

    useEffect(() => {
        const fetchLessonData = async () => {
            setIsLoading(true);
            try {
                // Simulate API call to get lesson data by exerciseId
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLessonData(mockLessonWithExercises);
            } catch (error) {
                console.error("Error fetching lesson data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessonData();
    }, [exerciseId]);

    const handleAnswerSelect = (exerciseId: number, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [exerciseId]: answer
        }));
    };

    const handleNextExercise = () => {
        if (lessonData && currentExerciseIndex < lessonData.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        }
    };

    const handlePrevExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
        setIsCompleted(true);
    };

    const calculateScore = () => {
        if (!lessonData || !lessonData.exercises) return 0;

        let correct = 0;
        lessonData.exercises.forEach((exercise: any) => {
            if (userAnswers[exercise.id] === exercise.system_answer) {
                correct++;
            }
        });

        return Math.round((correct / lessonData.exercises.length) * 100);
    };

    const isExerciseCorrect = (exerciseId: number) => {
        if (!lessonData || !lessonData.exercises) return false;
        const exercise = lessonData.exercises.find((ex: any) => ex.id === exerciseId);
        return exercise && userAnswers[exerciseId] === exercise.system_answer;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
                <div className="bg-white p-4 shadow-sm">
                    <Breadcrumb items={breadcrumbs} />
                </div>
                <div className="flex justify-center items-center h-64">
                    <OrbitProgress
                        color="#3B82F6"
                        size="medium"
                        text="Loading..."
                        textColor="#3B82F6"
                    />
                </div>
            </div>
        );
    }

    if (!lessonData || !lessonData.exercises || lessonData.exercises.length === 0) {
        return (
            <div className="flex flex-col mt-4 min-h-screen bg-gray-50">
                <div className="bg-white p-4 shadow-sm">
                    <Breadcrumb items={breadcrumbs} />
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Không tìm thấy bài tập
                        </h3>
                        <p className="text-gray-500">
                            Bài tập bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const currentExercise = lessonData.exercises[currentExerciseIndex];
    const totalExercises = lessonData.exercises.length;
    const answeredExercises = Object.keys(userAnswers).length;
    const canSubmit = answeredExercises === totalExercises;

    return (
        <div className="flex-col mt-4 min-h-screen bg-gray-50 bg-gradient-to-br from-amber-50">
            <Breadcrumb items={breadcrumbs} />

            {/* Header */}
            <Button
                variant="destructive"
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 transition-colors m-4"
            >
                <FaArrowLeft />
                <span>Thoát</span>
            </Button>

            <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800">{lessonData.title}</h1>
            </div>

            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Header */}
                    <div className="bg-yellow-500 text-white rounded-t-2xl p-4 mb-0">
                        <div className="flex items-center justify-end me-5">
                            <div className="text-right">
                                <div className="text-sm">Số câu đúng</div>
                                <div className="text-2xl font-bold">
                                    {showResults ? `${Math.round((calculateScore() / 100) * totalExercises)}` : answeredExercises} / {totalExercises}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exercise Content */}
                    <div className="bg-white rounded-b-2xl shadow-lg">
                        {/* Exercise Header */}
                        <div className="p-6 border-b border-gray-100">
                            <p className="text-gray-700 mb-4">{lessonData.description}</p>

                            <ExerciseQuestion
                                exercise={currentExercise}
                                userAnswer={userAnswers[currentExercise.id]}
                                showResults={showResults}
                                onSelect={handleAnswerSelect}
                            />

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={handlePrevExercise}
                                    disabled={currentExerciseIndex === 0}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Câu trước
                                </button>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        Câu {currentExerciseIndex + 1} / {totalExercises}
                                    </span>
                                </div>

                                {currentExerciseIndex < totalExercises - 1 ? (
                                    <button
                                        onClick={handleNextExercise}
                                        className="px-4 py-2 text-blue-600 hover:text-blue-800"
                                    >
                                        Câu tiếp →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit || showResults}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {showResults ? 'Đã hoàn thành' : 'Giải thích đáp án'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Exercise Navigation */}
                        <div className="p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Danh sách Exercises</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {lessonData.exercises.map((exercise: any, index: number) => {
                                    const isAnswered = userAnswers[exercise.id];
                                    const isCurrent = index === currentExerciseIndex;
                                    const isCorrectAnswer = showResults && isExerciseCorrect(exercise.id);
                                    const isWrongAnswer = showResults && isAnswered && !isExerciseCorrect(exercise.id);

                                    return (
                                        <button
                                            key={exercise.id}
                                            onClick={() => setCurrentExerciseIndex(index)}
                                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${isCurrent
                                                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                                : isCorrectAnswer
                                                    ? 'bg-green-500 text-white'
                                                    : isWrongAnswer
                                                        ? 'bg-red-500 text-white'
                                                        : isAnswered
                                                            ? 'bg-green-100 text-green-800 border-2 border-green-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {showResults && (
                        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {calculateScore()}%
                                </div>
                                <p className="text-gray-600">
                                    Bạn đã trả lời đúng {Math.round((calculateScore() / 100) * totalExercises)} / {totalExercises} câu
                                </p>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <div className="flex items-start space-x-2">
                                    <FaInfoCircle className="text-blue-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-blue-800 mb-2">Tổng kết</h4>
                                        <p className="text-blue-700">
                                            Bạn đã hoàn thành bài tập "{lessonData.title}".
                                            {calculateScore() >= 70
                                                ? " Chúc mừng! Bạn đã đạt được kết quả tốt."
                                                : " Hãy ôn tập lại để cải thiện kết quả nhé!"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}