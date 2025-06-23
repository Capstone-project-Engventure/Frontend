"use client";

import ListeningEditor from "@/app/[locale]/components/ListeningEditor";
import ExerciseService from "@/lib/services/exercise.service";
import { Exercise } from "@/lib/types/exercise";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useLocale } from "next-intl";

export default function ListeningLessonExercisesViewPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

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

  const handleEdit = () => {
    router.push(`/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}/edit/${id}`);
  };

  const handleBack = () => {
    router.push(`/${locale}/admin/exercises/listening-lessons/listenings/${lessonId}`);
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
      {/* Header with navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft />
          <span>Quay lại danh sách</span>
        </button>
        
        <button
          onClick={handleEdit}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaEdit />
          <span>Chỉnh sửa</span>
        </button>
      </div>

      <ListeningEditor 
        header={`Xem bài tập: ${exercise.name || 'Listening Exercise'}`}
        onSubmit={() => {}} // Empty function since this is view-only
        initialData={{ exercises: [exercise] }}
        isViewOnly={true}
      />
    </main>
  );
} 