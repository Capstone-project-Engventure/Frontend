'use client';

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ReadingEditor from "@/app/[locale]/components/ReadingEditor";
import ReadingService from "@/lib/services/reading.service";
import LessonService from "@/lib/services/lesson.service";
import { Reading } from "@/lib/types/reading";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const EditReadingPage = () => {
    const readingService = new ReadingService();
    const lessonService = new LessonService();
    const params = useParams();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("Admin.ReadingPassages");
    
    const id = params.id;
    const lessonId = params.lessonId;
    
    const [reading, setReading] = useState<Reading | null>(null);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const breadcrumbs = [
        { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
        { label: t("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
        { label: t("breadcrumbs.readingLessons"), href: `/${locale}/admin/exercises/reading-lessons` },
        { 
            label: currentLesson?.title || t("breadcrumbs.readings"), 
            href: `/${locale}/admin/exercises/reading-lessons/readings/${lessonId}` 
        },
        { 
            label: `Edit: ${reading?.title || 'Loading...'}`, 
            href: `/${locale}/admin/exercises/reading-lessons/readings/${lessonId}/edit/${id}` 
        },
    ];

    const handleSave = async (data: Reading) => {
        console.log("Reading submitted:", data);
        try {
            const response = await readingService.update(Number(id), data, {});
            if (response.success) {
                toast.success(t("messages.updateSuccess"));
                // Navigate back to readings list
                router.push(`/${locale}/admin/exercises/reading-lessons/readings/${lessonId}`);
            } else {
                toast.error(t("messages.updateError"));
            }
        } catch (error: any) {
            console.error("Error updating reading:", error);
            if (error.response?.data?.title) {
                if (error.response.data.title[0].includes('already exists')) {
                    toast.error(t("messages.duplicateTitle"));
                } else {
                    toast.error(`Title: ${error.response.data.title[0]}`);
                }
            } else {
                toast.error(t("messages.updateError"));
            }
        }
    };

    const fetchReading = useCallback(async () => {
        try {
            setIsLoading(true);
            const [readingRes, lessonRes] = await Promise.all([
                readingService.getById(id as string),
                lessonService.getById(lessonId as string)
            ]);
            
            if (readingRes.success) {
                setReading(readingRes.data);
            } else {
                toast.error("Failed to fetch reading");
            }
            
            if (lessonRes.success) {
                setCurrentLesson(lessonRes.data);
            } else {
                toast.error("Failed to fetch lesson");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data");
        } finally {
            setIsLoading(false);
        }
    }, [id, lessonId]);

    useEffect(() => {
        if (id && lessonId) {
            fetchReading();
        }
    }, [fetchReading]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">{t("messages.loading")}</div>
            </div>
        );
    }

    if (!reading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">Reading not found</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="p-4">
                <Breadcrumb items={breadcrumbs} />
                
                <div className="mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t("actions.backToReadings")}
                    </button>
                </div>
            </div>

            <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
                <ReadingEditor 
                    header={`Edit reading: ${reading.title}`}
                    initialData={reading} 
                    onSubmit={handleSave} 
                />
            </main>
        </div>
    );
};

export default EditReadingPage;
