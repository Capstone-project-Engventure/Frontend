"use client";

import SpeakingEditor from "@/app/[locale]/components/SpeakingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Exercise } from "@/lib/types/exercise";
import ExerciseService from "@/lib/services/exercise.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const EditSpeakingPage = () => {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [exercise, setExercise] = useState<Exercise>();
  const tSpeaking = useTranslations("Admin.SpeakingLessons");

  const breadcrumbs = [
    { label: tSpeaking("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: tSpeaking("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    { 
      label: tSpeaking("breadcrumbs.speakingLessons"), 
      href: `/${locale}/admin/exercises/speaking-lessons` 
    },
    { 
      label: tSpeaking("breadcrumbs.speakings"), 
      href: `/${locale}/admin/exercises/speaking-lessons/speaking/${lessonId}` 
    },
    { label: tSpeaking("breadcrumbs.editSpeaking") }
  ];

  const handleSave = async (data: Exercise) => {
    if (!exercise) return;
    const exerciseService = new ExerciseService();
    const updatedExercise = {
      ...exercise,
      ...data,
    };
    try {
      await exerciseService.update(updatedExercise.id, updatedExercise, {});
      toast.success(tSpeaking("messages.updateExerciseSuccess"));
      setExercise(updatedExercise);
      
      // Navigate back to speaking exercises list
      router.push(`/${locale}/admin/exercises/speaking-lessons/speaking/${lessonId}`);
    } catch (error) {
      toast.error(tSpeaking("messages.updateExerciseError"));
    }
  };

  const fetchSpeakingExercise = useCallback(async () => {
    const exerciseService = new ExerciseService();
    const res = await exerciseService.getById(id as string);
    if (res.success) {
      setExercise(res?.data);
    } else {
      toast.error(tSpeaking("messages.fetchExerciseError"));
    }
  }, [id, tSpeaking]);

  useEffect(() => void fetchSpeakingExercise(), [fetchSpeakingExercise]);

  // Convert Exercise to Speaking format for the editor
  const speakingData = exercise
    ? {
        ...exercise,
        exercises: [exercise], // Wrap single exercise in array for editor
        lesson:
          typeof exercise.lesson === "number" ? exercise.lesson : undefined,
      }
    : undefined;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <SpeakingEditor
        header={tSpeaking("headers.edit")}
        initialData={speakingData}
        onSubmit={handleSave}
      />
    </main>
  );
};

export default EditSpeakingPage;
