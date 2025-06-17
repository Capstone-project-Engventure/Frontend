// src\app\[locale]\student\practice\reading\[id]\page.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReadingWithQuestions from '@/app/[locale]/components/ReadingWithQuestions';
import { Button } from '@/app/[locale]/components/ui/Button';
import readingPracticeService from '@/lib/services/reading-practice.service';

interface PageProps {
    params: {
        locale: string;
        id: string;
    };
}

interface LessonData {
    title: string;
    description: string;
    readings: any[];
    id: string;
}

export default function ReadingPracticePage({ params }: PageProps) {
    const router = useRouter();
    const locale = useLocale();

    const [exerciseData, setExerciseData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
    const [allReadings, setAllReadings] = useState<any[]>([]);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);

            // Thử lấy dữ liệu từ localStorage trước
            const stored = localStorage.getItem("current_lesson");
            let lessonData: LessonData | null = null;

            if (stored) {
                try {
                    lessonData = JSON.parse(stored);
                    setTitle(lessonData?.title || '');
                    setDescription(lessonData?.description || '');

                    // Nếu có readings trong localStorage và readings không rỗng
                    if (lessonData?.readings && lessonData.readings.length > 0) {
                        setAllReadings(lessonData.readings);
                        setExerciseData(lessonData.readings[0]); // Hiển thị reading đầu tiên
                        setLoading(false);
                        return; // Không cần fetch API nữa
                    }
                } catch (e) {
                    console.error("Failed to parse lesson data from localStorage:", e);
                }
            }

            // Nếu không có dữ liệu trong localStorage hoặc readings rỗng, fetch từ API
            console.log("Fetching data from API...");
            const result = await readingPracticeService.getById(Number(params.id));
            if (result.success && result.dataReading) {
                const readings = result.dataReading;
                setAllReadings(readings);

                if (readings.length > 0) {
                    setExerciseData(readings[0]);
                }

                // Cập nhật localStorage với dữ liệu mới
                if (lessonData) {
                    const updatedLessonData = {
                        ...lessonData,
                        readings: readings
                    };
                    localStorage.setItem('current_lesson', JSON.stringify(updatedLessonData));
                }
            } else {
                console.error("Failed to load reading practice from API.");
            }

            setLoading(false);
        };

        initializeData();
    }, [params.id]);

    // Xử lý chuyển đổi giữa các readings
    const handleNextReading = () => {
        if (currentReadingIndex < allReadings.length - 1) {
            const nextIndex = currentReadingIndex + 1;
            setCurrentReadingIndex(nextIndex);
            setExerciseData(allReadings[nextIndex]);
        }
    };

    const handlePreviousReading = () => {
        if (currentReadingIndex > 0) {
            const prevIndex = currentReadingIndex - 1;
            setCurrentReadingIndex(prevIndex);
            setExerciseData(allReadings[prevIndex]);
        }
    };

    const handleReadingSelect = (index: number) => {
        setCurrentReadingIndex(index);
        setExerciseData(allReadings[index]);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 rounded-2xl">
            <Button
                variant="destructive"
                onClick={() => router.push(`/${locale}/student/practice/reading`)}
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

            <div className="max-w-6xl mx-auto mt-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
                    <div className="w-full h-1 bg-amber-500 rounded" />
                    <p className="text-gray-700 leading-7 font-medium bg-gray-50 p-3 rounded-md italic">
                        {description}
                    </p>
                </div>

                {/* Reading Navigation */}
                {allReadings.length > 1 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Passages ({allReadings.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allReadings.map((reading, index) => (
                                <button
                                    key={reading.id || index}
                                    onClick={() => handleReadingSelect(index)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentReadingIndex === index
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {reading.title || `Reading ${index + 1}`}
                                </button>
                            ))}
                        </div>

                        {/* Navigation arrows */}
                        <div className="flex justify-between mt-4">
                            <Button
                                variant="outline"
                                onClick={handlePreviousReading}
                                disabled={currentReadingIndex === 0}
                                className="flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Reading
                            </Button>

                            <span className="flex items-center text-sm text-gray-600">
                                {currentReadingIndex + 1} of {allReadings.length}
                            </span>

                            <Button
                                variant="outline"
                                onClick={handleNextReading}
                                disabled={currentReadingIndex === allReadings.length - 1}
                                className="flex items-center"
                            >
                                Next Reading
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                ) : exerciseData ? (
                    <ReadingWithQuestions
                        id={exerciseData.id || currentReadingIndex}
                        title={exerciseData.title}
                        content={exerciseData.content}
                        exercises={exerciseData.exercises}
                    />
                ) : (
                    <div className="p-6 text-red-600 text-center">
                        Failed to load reading practice data / no reading practice data available.
                    </div>
                )}
            </div>
        </div>
    );
}