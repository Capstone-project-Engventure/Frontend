'use client';

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ReadingEditor from "@/app/[locale]/components/ReadingEditor";
import ReadingService from "@/lib/services/reading.service";
import LessonService from "@/lib/services/lesson.service";
import { Reading } from "@/lib/types/reading";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const CreateReadingPage = () => {
    const readingService = new ReadingService();
    const lessonService = new LessonService();
    const params = useParams();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("Admin.ReadingPassages");
    
    const lessonId = params.lessonId;
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await lessonService.getById(lessonId as string);
                if (res.success) {
                    setCurrentLesson(res.data);
                } else {
                    toast.error("Failed to fetch lesson");
                    router.back();
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
                toast.error("An error occurred while fetching lesson");
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId, lessonService, router]);

    const breadcrumbs = [
        { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
        { label: t("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
        { label: t("breadcrumbs.readingLessons"), href: `/${locale}/admin/exercises/reading-lessons` },
        { 
            label: currentLesson?.title || t("breadcrumbs.readings"), 
            href: `/${locale}/admin/exercises/reading-lessons/readings/${lessonId}` 
        },
        { 
            label: t("breadcrumbs.createReading"), 
            href: `/${locale}/admin/exercises/reading-lessons/readings/${lessonId}/create` 
        },
    ];

    const handleSave = async (data: Reading) => {
        console.log("Reading submitted:", data);
        try {
            data.lesson = Number(lessonId);
            const response = await readingService.create(data, {});
            if (response.success) {
                toast.success(t("messages.createSuccess"));
                router.push(`/${locale}/admin/exercises/reading-lessons/readings/${lessonId}`);
            } else {
                toast.error(t("messages.createError"));
            }
        } catch (error: any) {
            console.error("Error creating reading:", error);
            if (error.response?.data?.title) {
                if (error.response.data.title[0].includes('already exists')) {
                    toast.error(t("messages.duplicateTitle"));
                } else {
                    toast.error(`Title: ${error.response.data.title[0]}`);
                }
            } else {
                toast.error(t("messages.createError"));
            }
        }
    };

    const handleBack = () => {
        router.push(`/${locale}/admin/exercises/reading-lessons/readings/${lessonId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">{t("messages.loading")}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
            <Breadcrumb items={breadcrumbs} />
            
            <div className="mb-4">
                <button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t("actions.backToReadings")}
                </button>
            </div>

            <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <ReadingEditor 
                    header={`Add new reading passage${currentLesson ? ` for ${currentLesson.title}` : ''}`} 
                    onSubmit={handleSave} 
                />
            </main>
        </div>
    );
};

export default CreateReadingPage;
