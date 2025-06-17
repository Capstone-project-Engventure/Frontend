// src\app\[locale]\components\card\LessonCard.tsx
'use client';

import { Lesson } from '@/lib/types/lesson';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useMemo } from 'react';

interface LessonCardProps {
    lesson: Lesson & {
        completed?: boolean;
        inProgress?: boolean;
        readings?: any[]
        exercises?: any[];
    };
}

const LessonCard: FC<LessonCardProps> = ({ lesson }) => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const status = useMemo(() => {
        if (lesson.completed) {
            return { text: 'Đã hoàn thành', color: 'text-green-600', bgColor: 'bg-green-50' };
        }
        if (lesson.inProgress) {
            return { text: 'Đang học', color: 'text-blue-600', bgColor: 'bg-blue-50' };
        }
        return { text: 'Chưa bắt đầu', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }, [lesson.completed, lesson.inProgress]);

    const handleClick = useCallback(() => {
        const pathParts = pathname.split('/');
        const practiceType = pathParts[pathParts.length - 1];

        const commonData = {
            title: lesson.title,
            description: lesson.description,
            id: lesson.id,
        };

        let lessonData;

        if (practiceType === 'reading') {
            lessonData = {
                ...commonData,
                readings: lesson.readings || [],
            };
        } else if (practiceType === 'grammar') {
            lessonData = {
                ...commonData,
                exercises: lesson.exercises || [],
            };
        } else {
            console.warn('Unknown practice type:', practiceType);
            return;
        }

        localStorage.setItem('current_lesson', JSON.stringify(lessonData));
        router.push(`/${locale}/student/practice/${practiceType}/${lesson.id}`);
    }, [lesson, locale, router]);


    return (
        <div
            onClick={handleClick}
            className="cursor-pointer h-full min-h-[200px] flex border-2 border-blue-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-300"
        >
            <div className="w-32 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                {lesson.image ? (
                    <Image
                        src={lesson.image}
                        alt={lesson.title}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="mb-3">
                        <h4 className="text-sm text-gray-600 mb-1">Tên bài học:</h4>
                        <h3 className="font-bold text-lg text-gray-800 leading-tight">{lesson.title}</h3>
                    </div>
                    <div className="mb-3">
                        <h4 className="text-sm text-gray-600 mb-1">Chủ đề:</h4>
                        <p className="font-semibold text-gray-700">{lesson.topic?.title || 'No Topic'}</p>
                    </div>
                </div>

                <div className="mt-auto flex justify-end">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}>
                        {status.text}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
