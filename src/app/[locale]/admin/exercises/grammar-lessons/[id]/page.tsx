"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExerciseService from "@/lib/services/exercise.service";
import { Button } from "@/app/[locale]/components/ui/Button";
import AudioPlayer from "@/app/[locale]/components/AudioPlayer"; // optional custom audio player
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { Lesson } from "@/lib/types/lesson";
import LessonService from "@/lib/services/lesson.service";
import { OptionProps } from "react-select";
import { toast } from "react-toastify";
import ExerciseTypeService from "@/lib/services/exercise-types.service";

export default function LessonByGrammar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: lessonId } = use(params);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(7);
  const [lessons, setLessons] = useState<OptionProps[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<OptionProps[]>([]);

  const exerciseService = new ExerciseService();
  const lessonService = new LessonService();
  const exerciseTypeService = new ExerciseTypeService();

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises", href: "/admin/exercises" },
    { label: "Listening" },
  ];
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const fields = [
    // { key: "image", label: "Image", type: "image" },
    { key: "question", label: "Question" },
    { key: "options", label: "Options" },
    { key: "audio_file", label: "Audio", type: "audio" },
    { key: "system_answer", label: "Answer" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "question", label: "Question", type: "text" },
    { key: "audio_file", label: "Audio File", type: "audio" },
    { key: "system_answer", label: "Answer", type: "text" },
    { key: "lesson", label: "Lesson", type: "select", options: lessons || [] }, 
    {
      key: "type",
      label: "Question type",
      type: "select",
      options: exerciseTypes || [],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: [
        { key: "A1", label: "A1" },
        { key: "A2", label: "A2" },
        { key: "B1", label: "B1" },
        { key: "B2", label: "B2" },
        { key: "C1", label: "C2" },
      ],
    },
    {
      key: "options",
      label: "Options (A, B, C, D)",
      type: "mcq",
      choices: ["A", "B", "C"],
    },
    { key: "description", label: "Description", type: "textarea" },
    { key: "skill", type: "hidden", default: "listening" },
    { key: "generated_by", type: "hidden", default: "system" },
  ];

  useEffect(() => {
    if (lessonId) {
      const fetchExercise = async () => {
        const res = await new ExerciseService().getAll({
          filters: { lesson_id: lessonId, skill: "listening" },
        });
        setExercises(res.data || []);
      };
      fetchExercise();
    }
    const fetchLessons = async () => {
      const res = await lessonService.getAll();
      const tempList = [];
      if (Array.isArray(res.data)) {
        res.data.map((lesson: Lesson) => {
          tempList.push({ label: lesson.title, value: lesson.id });
        });
        setLessons(tempList);
      } else {
        toast.error("Error fetching lessons");
      }
    };
    fetchLessons();
    async function fetchExerciseTypes() {
      const res = await exerciseTypeService.getAll();
      if (Array.isArray(res.data)) {
        const tempList = [];
        res.data.map((et) => {
          tempList.push({ label: et.name, value: et.id });
        });
        setExerciseTypes(tempList);
      }
    }
    fetchExerciseTypes();
  }, [lessonId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Listening Exercises</h2>
      {exercises.length === 0 ? (
        <p>No listening exercises found in {lessonId}.</p>
      ) : (
        <PaginationTable
          fields={fields}
          onPageChange={onPageChange}
          service={exerciseService}
          linkBase="/admin/exercises"
          breadcrumbs={breadcrumbs}
          modalFields={modalFields}
          config={{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }}
        />
      )}
    </div>
  );
}
