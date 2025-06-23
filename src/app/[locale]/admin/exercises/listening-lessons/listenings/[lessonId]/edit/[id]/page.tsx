"use client";

import ListeningEditor from "@/app/[locale]/components/ListeningEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import { Exercise } from "@/lib/types/exercise";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function ListeningLessonExercisesEditPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.ListeningExercises");
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    
    const lessonService = new LessonService();
    try {
      const response = await lessonService.getById(lessonId as string);
      if (response.success) {
        setCurrentLesson(response.data);
      } else {
        toast.error("Failed to fetch lesson");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Error fetching lesson");
    }
  }, [lessonId]);

  const fetchExercise = useCallback(async () => {
    if (!id) return;
    
    const exerciseService = new ExerciseService();
    try {
      const response = await exerciseService.getById(id as string);
      if (response.success) {
        setExercise(response.data);
      } else {
        toast.error(t("messages.fetchError"));
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
      toast.error(t("messages.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchLesson();
    fetchExercise();
  }, [fetchLesson, fetchExercise]);

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: t("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    { label: t("breadcrumbs.listeningLessons"), href: `/${locale}/admin/exercises/listening-lessons` },
    { 
      label: currentLesson?.title || t("breadcrumbs.listenings"), 
      href: `/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}` 
    },
    { 
      label: `${t("breadcrumbs.editListening")}: ${exercise?.name || 'Loading...'}`, 
      href: `/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}/edit/${id}` 
    },
  ];

  const handleSave = async (data: any) => {
    if (!exercise) return;
    
    const exerciseService = new ExerciseService();
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
        
        const response = await exerciseService.update(exercise.id, exerciseData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (response.success) {
          toast.success(t("messages.updateSuccess"));
          setExercise(response.data);
        } else {
          toast.error(t("messages.updateError"));
        }
      } else {
        // Handle regular data
        data.lesson = Number(lessonId);
        data.skill = "listening";
        data.generated_by = "admin";
        
        const response = await exerciseService.update(exercise.id, data, {});
        
        if (response.success) {
          toast.success(t("messages.updateSuccess"));
          setExercise(response.data);
        } else {
          toast.error(t("messages.updateError"));
        }
      }
    } catch (error) {
      console.error("Error updating listening exercise:", error);
      toast.error(t("messages.updateError"));
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">{t("messages.loading")}</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">{t("messages.exerciseNotFound")}</div>
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
          header={`${t("headers.edit")}: ${exercise.name}`} 
          onSubmit={handleSave}
          initialData={{ exercises: [exercise] }}
        />
      </main>
    </div>
  );
}
