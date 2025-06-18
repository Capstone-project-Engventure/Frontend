'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GrammarExerciseViewer from '@/app/[locale]/components/GrammarExerciseViewer';
import { Button } from '@/app/[locale]/components/ui/Button';
import grammarPracticeService from '@/lib/services/student/grammar-practice.service';
import { Lesson } from '@/lib/types/lesson';

interface PageProps {
    params: {
        locale: string;
        id: string;
    };
}

interface LessonData {
    title: string;
    description: string;
    exercises: any[];
    id: number;
}

export default function GrammarPracticePage({ params }: PageProps) {
    const router = useRouter();
    const locale = useLocale();

    const [lessonData, setLessonData] = useState<LessonData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            const stored = localStorage.getItem("current_lesson");
            let dataFromStorage: LessonData | null = null;

            if (stored) {
                try {
                    dataFromStorage = JSON.parse(stored);
                    if (dataFromStorage && dataFromStorage.exercises && dataFromStorage.exercises.length > 0) {
                        setLessonData(dataFromStorage);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse lesson data from localStorage:", e);
                }
            }

            console.log("Fetching grammar data from API...");
            const result = await grammarPracticeService.getById(Number(params.id));
            if (result.success && result.dataGrammar) {
                const fetchedLesson: Lesson = result.dataGrammar;
                const exercises = fetchedLesson.exercises || [];

                const lessonToSet: LessonData = {
                    id: fetchedLesson.id,
                    title: fetchedLesson.title,
                    description: fetchedLesson.description,
                    exercises: exercises,
                };
                setLessonData(lessonToSet);

                localStorage.setItem('current_lesson', JSON.stringify(lessonToSet));
            } else {
                console.error("Failed to load grammar practice from API.", result);
            }

            setLoading(false);
        };

        initializeData();
    }, [params.id]);

    return (
        <div className="min-h-screen bg-gray-100 p-6 rounded-2xl">
            <Button
                variant="destructive"
                onClick={() => router.push(`/${locale}/student/practice/grammar`)}
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
                Quay lại
            </Button>

            <div className="max-w-6xl mx-auto mt-6">
                {/* Phần tiêu đề và mô tả của bài học ngữ pháp vẫn được giữ lại */}
                {lessonData && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{lessonData.title}</h1>
                        <div className="w-full h-1 bg-amber-500 rounded" />
                        <p className="text-gray-700 leading-7 font-medium bg-gray-50 p-3 rounded-md italic">
                            {lessonData.description}
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                ) : lessonData?.exercises && lessonData.exercises.length > 0 ? (
                    <GrammarExerciseViewer
                        exercises={lessonData.exercises}
                    // lessonTitle={lessonData.title}
                    // lessonDescription={lessonData.description}
                    />
                ) : (
                    <div className="p-6 text-red-600 text-center">
                        Không tìm thấy dữ liệu bài tập ngữ pháp hoặc không có bài tập nào.
                    </div>
                )}
            </div>
        </div>
    );
}