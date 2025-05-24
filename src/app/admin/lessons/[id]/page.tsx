"use client";
import { useApi } from "@/lib/Api";
import LessonService from "@/lib/services/lesson.service";
import { Lesson } from "@/lib/types/lesson";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLessonDetail() {
  const lessonService = new LessonService();
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessonData = async () => {
      setIsLoading(true);
      try {
        // Step 1: Check localStorage
        const cachedLessons = localStorage.getItem("lessons");
        const cachedTimestamp = localStorage.getItem("lessons_timestamp");
        const now = Date.now();

        if (cachedLessons && cachedTimestamp) {
          const ageInMinutes = (now - parseInt(cachedTimestamp)) / 1000 / 60;
          if (ageInMinutes < 10) {
            // only use cache if less than 10 minutes old
            const lessonsData = JSON.parse(cachedLessons);
            setLessons(lessonsData);
            console.log("Loaded lessons from cache");
            return;
          }
        }

        const res = await lessonService.getAll();
        if (res.success && Array.isArray(res.data)) {
          setLessons(res.data);
          localStorage.setItem("lessons", JSON.stringify(res.data));
          localStorage.setItem("lessons_timestamp", now.toString());
          console.log("Fetched lessons from API and cached");
        }
      } catch (err) {
        console.error("Fetch lessons failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessonData();
  }, []);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="relative overflow-x-auto mt-8 rounded-lg shadow-md">
        <p>Lesson Detail</p>
    </div>
  );
}
