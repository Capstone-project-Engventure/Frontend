'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Lesson } from '@/lib/types/lesson';

interface LessonCardProps {
    lesson: Lesson;
}

const LessonCard = ({ lesson }: LessonCardProps) => {
    const locale = useLocale();
    const router = useRouter();

    const getStatus = () => {
        if ((lesson as any).completed) {
            return { text: 'Đã hoàn thành', color: 'text-green-600', bgColor: 'bg-green-50' };
        } else if ((lesson as any).inProgress) {
            return { text: 'Đang học', color: 'text-blue-600', bgColor: 'bg-blue-50' };
        } else {
            return { text: 'Chưa bắt đầu', color: 'text-gray-600', bgColor: 'bg-gray-50' };
        }
    };

    const handleClick = () => {
        localStorage.setItem(
            'current_lesson',
            JSON.stringify({
                title: lesson.title,
                description: lesson.description,
            })
        );

        router.push(`/${locale}/student/practice/reading/${lesson.id}`);
    };

    const status = getStatus();

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer h-full min-h-[200px] flex border-2 border-blue-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-300"
        >
            <div className="w-32 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                {lesson.image ? (
                    <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover" />
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
                <div className="mb-3">
                    <h4 className="text-sm text-gray-600 mb-1">Tên bài học:</h4>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{lesson.title}</h3>
                </div>
                <div className="mb-3">
                    <h4 className="text-sm text-gray-600 mb-1">Chủ đề:</h4>
                    <p className="font-semibold text-gray-700">{lesson.topic?.title || 'No Topic'}</p>
                </div>
                <div className="mt-auto flex justify-end">
                    <h4 className="text-sm text-gray-600 mb-1">
                        Trạng thái:
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}>
                            {status.text}
                        </div>
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
