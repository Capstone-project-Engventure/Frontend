// pages/lesson/[id].tsx (hoặc component chứa danh sách)
"use client";

import React, { use, useEffect, useState } from "react";
import ExerciseCard from "@/app/[locale]/components/ExerciseCard";
import { useApi } from "@/lib/Api";
import { useParams } from "next/navigation";

type Exercise = {
  id: number;
  name: string;
  question: string;
  description: string;
  options: Record<string, string> | string[] | null;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
};
export default function LessonPage() {
  const api = useApi();
  const { id: lessonId } = useParams();
  //   const [exercises, setExercises] = useState<Exercise[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      console.log("Lesson ID:", lessonId);

      // 1. Try read cache
      const cacheKey = "lesson_cache";
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const lessons: Lesson[] = JSON.parse(saved);
        const found = lessons.find((l) => l.id === Number(lessonId));
        if (found) {
          setLesson(found);
          return;
        }
      }
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        if (res.status === 200) {
          // Ensure all exercise ids are numbers
          const fetched: Lesson = {
            ...res.data,
            exercises: res.data.exercises.map((ex: any) => ({
              ...ex,
              id: Number(ex.id),
            })),
          };
          setLesson(fetched);

          // 3. Update cache
          const existing: Lesson[] = saved ? JSON.parse(saved) : [];
          localStorage.setItem(
            cacheKey,
            JSON.stringify([...existing, fetched])
          );
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (!lesson) {
    return <p className="p-4 text-center">Đang tải thông tin buổi học…</p>;
  }
  if (!lesson.exercises.length) {
    return <p className="p-4 text-center text-gray-500">Chưa có bài tập.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-6">
      {lesson.exercises.map((ex, idx) => (
        <ExerciseCard key={ex.id} data={ex} index={idx} />
      ))}
    </div>
  );
}
