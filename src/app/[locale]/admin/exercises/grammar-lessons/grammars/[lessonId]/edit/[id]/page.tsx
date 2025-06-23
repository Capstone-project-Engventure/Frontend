"use client";

import GrammarEditor from "@/app/[locale]/components/GrammarEditor";
import ReadingService from "@/lib/services/reading.service";
import { Reading } from "@/lib/types/reading";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Exercise } from "@/lib/types/exercise";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";

const EditGrammarPage = () => {
  // const readingService = new ReadingService();
  const { id } = useParams();
  console.log("check id", id);
  const lessonService = new LessonService(); // Ensure you have the correct service for lessons
  // Make sure this import exists
  const [exercise, setExercise] = useState<Exercise>();

  const handleSave = async (data: Exercise) => {
    if (!exercise) return;
    const exerciseService = new ExerciseService();
    const updatedReading = {
      ...exercise,
      exercises: exercise.exercises?.map((ex) =>
        ex.id === data.id ? { ...ex, ...data } : ex
      ),
    };
    try {
      await exerciseService.update(updatedReading.id, updatedReading, {});
      toast.success("Update reading successfully");
      setExercise(updatedReading);
    } catch (error) {
      toast.error("Update reading failure, please try again!");
    }
  };

  // const [exercises, setExercises] = useState<Exercise>();
  const fetchGrammarExercise = useCallback(async () => {
    console.log("check id", id);
    const exerciseService = new ExerciseService();

    const res = await exerciseService.getById(id as string);
    if (res.success) {
      setExercise(res?.data);
    } else {
      toast.error("Failed to fetch lesson");
    }
  }, [id]);

  useEffect(() => void fetchGrammarExercise(), [fetchGrammarExercise]);

  // Convert Reading to Grammar, ensuring exercises.question is string | undefined (not null)
  // and audio_file_url is string | undefined (not null)
  const grammarData = exercise
    ? {
        ...exercise,
        exercises: (exercise.exercises ?? []).map((ex) => ({
          ...ex,
          question: ex.question ?? "", // convert null to empty string
          audio_file_url: ex.audio_file_url ?? undefined, // convert null to undefined
        })) as Exercise[], // ensure type is Exercise[]
        lesson:
          typeof exercise.lesson === "number" ? exercise.lesson : undefined, // ensure lesson is number or undefined
      }
    : undefined;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <GrammarEditor
        header="Edit reading content"
        initialData={grammarData}
        onSubmit={handleSave}
      />
    </main>
  );
};

export default EditGrammarPage;
