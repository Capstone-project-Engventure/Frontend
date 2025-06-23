// src\app\[locale]\components\card\SectionCard.tsx
"use client";

import { Section } from "@/lib/types/course";
import { Lesson } from "@/lib/types/lesson";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBook, FaCheckCircle, FaPlay, FaStar, FaTrophy } from "react-icons/fa";

interface SectionCardProps {
    section: Section;
    sectionIndex: number;
    completedLessons: number[];
}

const SectionCard: React.FC<SectionCardProps> = ({
    section,
    sectionIndex,
    completedLessons
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const completedCount = section.lessons.filter(lesson => completedLessons.includes(lesson.id)).length;
    const totalLessons = section.lessons.length;
    const isCompleted = completedCount === totalLessons;

    const getLessonIcon = (lesson: Lesson) => {
        switch (lesson.type) {
            case 'lesson':
                return <FaPlay className="text-red-500" />;
            case 'exercise':
                return <FaBook className="text-blue-500" />;
            default:
                return <FaBook className="text-gray-500" />;
        }
    };

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.type === 'lesson') {
            // Điều hướng đến trang chi tiết lesson
            router.push(`/${locale}/student/my-course/${courseId}/lesson/${lesson.id}`);
        } else {
            // Có thể thêm logic khác cho exercise
            console.log('Exercise clicked:', lesson);
            // Ví dụ: hiển thị modal hoặc điều hướng đến trang exercise
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}>
                                {String(sectionIndex + 1).padStart(2, '0')}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{section.name}</h3>
                            <p className="text-gray-600 text-sm">{completedCount}/{totalLessons} Sections</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-400" />
                            <span className="text-gray-600">{completedCount * 2}/{totalLessons * 2}</span>
                        </div>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map((trophy, index) => (
                                <FaTrophy
                                    key={index}
                                    className={`${index < Math.floor(completedCount / totalLessons * 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <div className="transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-100">
                    {section.lessons.map((lesson, lessonIndex) => {
                        const isLessonCompleted = completedLessons.includes(lesson.id);
                        const isClickable = lesson.type === 'lesson';

                        return (
                            <div
                                key={lesson.id}
                                className={`p-4 border-b border-gray-50 last:border-b-0 transition-colors ${isClickable
                                    ? 'hover:bg-blue-50 cursor-pointer'
                                    : 'hover:bg-gray-50 cursor-default'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLessonClick(lesson);
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {isLessonCompleted ? (
                                            <FaCheckCircle className="text-green-500 text-xl" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            {getLessonIcon(lesson)}
                                            <h4 className={`font-medium ${isLessonCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                                {lesson.title}
                                            </h4>
                                            {isClickable && (
                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                    Click để xem
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <FaStar className="text-yellow-400" />
                                                    <FaStar className="text-yellow-400" />
                                                    <FaStar className="text-yellow-400" />
                                                </span>
                                            </div>

                                            {lesson.description && (
                                                <div className="text-xs text-gray-500 max-w-xs truncate">
                                                    {lesson.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SectionCard;