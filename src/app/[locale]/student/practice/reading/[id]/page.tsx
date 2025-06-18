'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReadingWithQuestions from '@/app/[locale]/components/ReadingWithQuestions';
import { Button } from '@/app/[locale]/components/ui/Button';
import readingPracticeService from '@/lib/services/reading-practice.service';

export default function ReadingPracticePage({ params }: { params: { locale: string; id: string } }) {
    const router = useRouter();
    const locale = useLocale();

    const [exerciseData, setExerciseData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

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
            const result = await readingPracticeService.getById(Number(params.id));
            if (result.success) {
                const reading = result.dataReading?.[0];
                setExerciseData(reading);
            } else {
                console.error("Failed to load reading practice from API.");
            }
            setLoading(false);
        };

        fetchData();
    }, [params.id]);

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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                ) : exerciseData ? (
                    <ReadingWithQuestions
                        title={exerciseData.title}
                        content={exerciseData.content}
                        exercises={exerciseData.exercises}
                    />
                ) : (
                    <div className="p-6 text-red-600 text-center">
                        Failed to load reading practice data/ no reading practice data available.
                    </div>
                )}
            </div>
        </div>
    );
}
