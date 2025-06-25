"use client";

import AudioWithQuestions from "@/app/[locale]/components/AudioWithQuestions";
import { Button } from "@/app/[locale]/components/ui/Button";
import listeningPracticeService from "@/lib/services/student/listening-practice.service";
import { Exercise } from "@/lib/types/exercise";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ListeningPracticeDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const currentExercise = useState(0)
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Fetch Exercises
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem("current_lesson");
        if (stored) {
          const LessonData = JSON.parse(stored);
          if (LessonData?.exercises?.length > 0) {
            setExercises(LessonData.exercises);
            setLoading(false);
            return;
          }
        }

        const result = await listeningPracticeService.getById(Number(id));
        if (result.success && result.dataListening) {
          const exercises = result.dataListening
          setExercises(exercises);
        } else {
          toast.error("Failed to load exercises");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error loading exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600">Loading exercises...</p>
        </div>
      </div>
    );
  }


  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-600 text-lg">No exercises available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Button className="mb-6" variant="destructive" onClick={() => router.back()}>
        <FaArrowLeft className="me-2" />
        Back
      </Button>
      <div className="max-w-4xl mx-auto p-4">
        <AudioWithQuestions exercises={exercises} />
      </div>
    </div>
  );
}
