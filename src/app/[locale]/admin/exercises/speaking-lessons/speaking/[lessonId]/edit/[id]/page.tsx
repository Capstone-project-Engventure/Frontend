"use client";

import SpeakingEditor from "@/app/[locale]/components/SpeakingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Button } from "@/app/[locale]/components/ui/Button";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
        <div className="my-4">
          <Button
            onClick={() => router.back()}
            variant="default"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>
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
