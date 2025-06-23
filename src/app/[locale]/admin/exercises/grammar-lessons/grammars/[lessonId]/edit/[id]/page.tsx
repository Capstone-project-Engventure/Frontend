"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import GrammarEditor from "@/app/[locale]/components/GrammarEditor";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import { Exercise } from "@/lib/types/exercise";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const EditGrammarPage = () => {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Admin.GrammarExercises");
  
  const exerciseService = new ExerciseService();
  const lessonService = new LessonService();
  
  const [exercise, setExercise] = useState<Exercise>();
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrammarExercise = useCallback(async () => {
    try {
      const res = await exerciseService.getById(id as string);
      if (res.success) {
        setExercise(res?.data);
      } else {
        toast.error("Failed to fetch grammar exercise");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching grammar exercise:", error);
      toast.error("An error occurred while fetching grammar exercise");
      router.back();
    }
  }, [id]);

  const fetchLesson = useCallback(async () => {
    try {
      const res = await lessonService.getById(lessonId as string);
      if (res.success) {
        setCurrentLesson(res.data);
      } else {
        toast.error("Failed to fetch lesson");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("An error occurred while fetching lesson");
    }
  }, [lessonId, lessonService]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchGrammarExercise(), fetchLesson()]);
      setIsLoading(false);
    };
    
    if (id && lessonId) {
      fetchData();
    }
  }, [id, lessonId]);

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: t("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    { label: t("breadcrumbs.grammarLessons"), href: `/${locale}/admin/exercises/grammar-lessons` },
    { 
      label: currentLesson?.title || t("breadcrumbs.grammars"), 
      href: `/${locale}/admin/exercises/grammar-lessons/grammars/${lessonId}` 
    },
    { 
      label: `Chỉnh sửa bài tập ngữ pháp`, 
      href: `/${locale}/admin/exercises/grammar-lessons/grammars/${lessonId}/edit/${id}` 
    },
  ];

  const handleSave = async (data: Exercise) => {
    if (!exercise) return;
    
    const updatedExercise = {
      ...exercise,
      ...data,
      lesson: lessonId as string,
    };
    
    try {
      await exerciseService.update(exercise.id, updatedExercise, {});
      toast.success("Cập nhật bài tập ngữ pháp thành công");
      setExercise(updatedExercise);
    } catch (error: any) {
      console.error("Error updating grammar exercise:", error);
      if (error.response?.data?.name) {
        if (error.response.data.name[0].includes('already exists')) {
          toast.error("Tên bài tập này đã tồn tại");
        } else {
          toast.error(`Tên: ${error.response.data.name[0]}`);
        }
      } else {
        toast.error("Cập nhật bài tập ngữ pháp thất bại, vui lòng thử lại!");
      }
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/admin/exercises/grammar-lessons/grammars/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">{t("messages.loading")}</div>
      </div>
    );
  }

  // Convert Exercise to Grammar format for the editor
  const grammarData = exercise
    ? {
        id: exercise.id,
        lesson: parseInt(lessonId as string) || undefined,
        exercises: [
          {
            ...exercise,
            question: exercise.question ?? "",
            audio_file_url: exercise.audio_file_url ?? undefined,
          }
        ],
      }
    : undefined;

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
          {t("actions.backToGrammars")}
        </button>
      </div>

      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
        <GrammarEditor
          header={`Chỉnh sửa bài tập ngữ pháp${currentLesson ? ` cho ${currentLesson.title}` : ''}`}
          initialData={grammarData}
          onSubmit={handleSave}
        />
      </main>
    </div>
  );
};

export default EditGrammarPage;
