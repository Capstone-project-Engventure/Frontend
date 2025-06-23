"use client";

import ListeningEditor from "@/app/[locale]/components/ListeningEditor";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export default function ListeningLessonExercisesEditPage() {
  const { id, lessonId } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExercise = useCallback(async () => {
    if (!id) return;
    
    const exerciseService = new ExerciseService();
    try {
      const response = await exerciseService.getById(id as string);
      if (response.success) {
        setExercise(response.data);
      } else {
        toast.error("Failed to fetch exercise");
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
      toast.error("Error fetching exercise");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

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
          toast.success("Listening exercise updated successfully");
          setExercise(response.data);
        } else {
          toast.error("Failed to update listening exercise");
        }
      } else {
        // Handle regular data
        data.lesson = Number(lessonId);
        data.skill = "listening";
        data.generated_by = "admin";
        
        const response = await exerciseService.update(exercise.id, data, {});
        
        if (response.success) {
          toast.success("Listening exercise updated successfully");
          setExercise(response.data);
        } else {
          toast.error("Failed to update listening exercise");
        }
      }
    } catch (error) {
      console.error("Error updating listening exercise:", error);
      toast.error("Error updating listening exercise");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-lg">Exercise not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ListeningEditor 
        header="Edit listening exercise" 
        onSubmit={handleSave}
        initialData={{ exercises: [exercise] }}
      />
    </main>
  );
}
