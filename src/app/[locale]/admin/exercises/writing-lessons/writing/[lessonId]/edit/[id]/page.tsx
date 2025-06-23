"use client";

import WritingEditor from "@/app/[locale]/components/WritingEditor";
import { Exercise } from "@/lib/types/exercise";
import ExerciseService from "@/lib/services/exercise.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const EditWritingPage = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState<Exercise>();

  const handleSave = async (data: Exercise) => {
    if (!exercise) return;
    const exerciseService = new ExerciseService();
    const updatedExercise = {
      ...exercise,
      ...data,
    };
    try {
      await exerciseService.update(updatedExercise.id, updatedExercise, {});
      toast.success("Update writing exercise successfully");
      setExercise(updatedExercise);
    } catch (error) {
      toast.error("Update writing exercise failure, please try again!");
    }
  };

  const fetchWritingExercise = useCallback(async () => {
    const exerciseService = new ExerciseService();
    const res = await exerciseService.getById(id as string);
    if (res.success) {
      setExercise(res?.data);
    } else {
      toast.error("Failed to fetch exercise");
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
      <WritingEditor
        header="Edit writing exercise"
        initialData={writingData}
        onSubmit={handleSave}
      />
    </main>
  );
};

export default EditWritingPage; 