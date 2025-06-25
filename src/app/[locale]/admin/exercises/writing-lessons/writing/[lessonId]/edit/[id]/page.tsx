"use client";

import WritingEditor from "@/app/[locale]/components/WritingEditor";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Button } from "@/app/[locale]/components/ui/Button";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditWritingPage = () => {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [exercise, setExercise] = useState<Exercise>();
  const tWriting = useTranslations("Admin.WritingLessons");

  const breadcrumbs = [
    { label: tWriting("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: tWriting("breadcrumbs.exercises"), href: `/${locale}/admin/exercises` },
    {
      label: tWriting("breadcrumbs.writingLessons"),
      href: `/${locale}/admin/exercises/writing-lessons`
    },
    {
      label: tWriting("breadcrumbs.writings"),
      href: `/${locale}/admin/exercises/writing-lessons/writing/${lessonId}`
    },
    { label: tWriting("breadcrumbs.editWriting") }
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
      toast.success(tWriting("messages.updateExerciseSuccess"));
      setExercise(updatedExercise);

      // Navigate back to writing exercises list
      router.push(`/${locale}/admin/exercises/writing-lessons/writing/${lessonId}`);
    } catch (error) {
      toast.error(tWriting("messages.updateExerciseError"));
    }
  };

  const fetchWritingExercise = useCallback(async () => {
    const exerciseService = new ExerciseService();
    const res = await exerciseService.getById(id as string);
    if (res.success) {
      setExercise(res?.data);
    } else {
      toast.error(tWriting("messages.fetchExerciseError"));
    }
  }, [id]);

  useEffect(() => void fetchWritingExercise(), [fetchWritingExercise]);

  // Convert Exercise to Writing format for the editor
  const writingData = exercise
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
      <WritingEditor
        header={tWriting("headers.edit")}
        initialData={writingData}
        onSubmit={handleSave}
      />
    </main>
  );
};

export default EditWritingPage; 