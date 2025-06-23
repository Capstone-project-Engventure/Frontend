'use client';

import ListeningEditor from "@/app/[locale]/components/ListeningEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const CreateListeningPage = () => {
  const exerciseService = new ExerciseService();
  const lessonService = new LessonService();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.ListeningExercises");
  
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
  }, [lessonId]);

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: t("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    { label: t("breadcrumbs.listeningLessons"), href: `/${locale}/admin/exercises/listening-lessons` },
    { 
      label: currentLesson?.title || t("breadcrumbs.listenings"), 
      href: `/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}` 
    },
    { 
      label: t("breadcrumbs.createListening"), 
      href: `/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}/create` 
    },
  ];
  
  const handleSave = async (data: any) => {
    console.log("Listening exercise submitted: ", data);
    try {
      // Handle FormData if it contains audio file
      if (data instanceof FormData) {
        const exerciseData = JSON.parse(data.get('data') as string);
        exerciseData.lesson = Number(lessonId);
        exerciseData.skill = "listening";
        exerciseData.generated_by = "admin";
        
        // Add all form data
        for (const [key, value] of data.entries()) {
          if (key !== 'data') {
            exerciseData[key] = value;
          }
        }
        
        await exerciseService.create(exerciseData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Handle regular data
        data.lesson = Number(lessonId);
        data.skill = "listening";
        data.generated_by = "admin";
        await exerciseService.create(data, {});
      }
      
      toast.success(t("messages.createSuccess"));
      router.push(`/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}`);
    } catch (error) {
      console.error("Error creating listening exercise:", error);
      toast.error(t("messages.createError"));
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">{t("messages.loading")}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2 p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="my-4">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("actions.backToListenings")}
        </button>
      </div>

      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
        <ListeningEditor 
          header={`${t("headers.addNew")}${currentLesson ? ` for ${currentLesson.title}` : ''}`} 
          onSubmit={handleSave} 
        />
      </main>
    </div>
  );
};

export default CreateListeningPage;
