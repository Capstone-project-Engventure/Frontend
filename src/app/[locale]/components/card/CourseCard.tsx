// src\app\[locale]\components\card\CourseCard.tsx
"use client";

import { Course } from "@/lib/types/course";
import { useLocale, } from "next-intl";
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from "react";
import { FaBook, FaCalendarAlt, FaCalendarCheck, FaClock, FaTrophy } from "react-icons/fa";

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const generateAvatar = (courseName: string) => {
        const colors = [
            "bg-gradient-to-br from-blue-400 to-blue-600",
            "bg-gradient-to-br from-green-400 to-green-600",
            "bg-gradient-to-br from-purple-400 to-purple-600",
            "bg-gradient-to-br from-pink-400 to-pink-600",
            "bg-gradient-to-br from-yellow-400 to-yellow-600",
            "bg-gradient-to-br from-red-400 to-red-600",
        ];

        const initials = courseName
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();

        const colorIndex = courseName.length % colors.length;

        return (
            <div className={`w-16 h-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {initials}
            </div>
        );
    };

    const calculateProgress = (course: Course) => {
        const now = new Date();
        const start = new Date(course.begin);
        const end = new Date(course.end);

        if (now < start) return 0;
        if (now > end) return 100;

        const total = end.getTime() - start.getTime();
        const current = now.getTime() - start.getTime();
        return Math.round((current / total) * 100);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const progress = calculateProgress(course);
    const isCompleted = progress === 100;
    const isActive = progress > 0 && progress < 100;

    const handleClick = useCallback(() => {
        const commonData = {
            id: course.id,
            name: course.name,
            description: course.description,
            scope: course.scope,
            sections: course.sections
        }

        localStorage.setItem('current_course', JSON.stringify(commonData));
        router.push(`/${locale}/student/my-course/${course.id}`);
    }, [course, locale, router])

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer group block transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-8 -translate-x-8"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            {generateAvatar(course.name)}
                            <div className="flex items-center space-x-1">
                                {isCompleted && (
                                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <FaTrophy className="mr-1" />
                                        Hoàn thành
                                    </div>
                                )}
                                {isActive && (
                                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <FaClock className="mr-1" />
                                        Đang học
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
                            {course.name}
                        </h3>

                        <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2 mb-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="text-sm opacity-90">Tiến độ: {progress}%</div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center text-gray-600 text-sm">
                        <FaCalendarAlt className="text-blue-500 mr-3 flex-shrink-0" />
                        <span className="font-medium text-gray-800">Khai giảng:</span>
                        <span className="ml-2">{formatDate(course.begin)}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <FaCalendarCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-medium text-gray-800">Kết thúc:</span>
                        <span className="ml-2">{formatDate(course.end)}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center font-semibold group-hover:bg-blue-100 transition-colors">
                            <FaBook className="inline mr-2" />
                            {isCompleted ? "Xem lại khóa học" : isActive ? "Tiếp tục học" : "Bắt đầu học"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
