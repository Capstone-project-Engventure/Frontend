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
import { LevelOptions } from "@/lib/constants/level";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";

export default function ListeningByLesson({
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
  const [lessons, setLessons] = useState<{ value: string; label: string }[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<{ value: string; label: string }[]>([]);

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
    { key: "name", label: "Name"},
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
      options: LevelOptions,
    },
    {
      key: "options",
      label: "Options (A, B, C, D)",
      type: "mcq",
      choices: ["A", "B", "C"],
    },
    { key: "description", label: "Description", type: "textarea" },
    { key: "skill", label: "", type: "hidden", default: "listening" },
    { key: "generated_by", label: "", type: "hidden", default: "system" },
  ];

  useEffect(() => {
    if (lessonId) {
      const fetchExercise = async () => {
        const res = await new ExerciseService().getAll({
          filters: { lesson_id: lessonId, skill: "listening" },
        });
        if ("data" in res && Array.isArray(res.data)) {
          setExercises(res.data);
        } else {
          toast.error("Error fetching exercises");
          setExercises([]);
        }
      };
      fetchExercise();
    }
    const fetchLessons = async () => {
      const res = await lessonService.getAll();
      const tempList: any[] = [];
      if ("data" in res && Array.isArray(res.data)) {
        res.data.map((lesson: Lesson) => {
          tempList.push({ value: String(lesson.id), label: lesson.title });
        });
        setLessons(tempList);
      } else {
        toast.error("Error fetching lessons");
      }
    };
    fetchLessons();
    async function fetchExerciseTypes() {
      const res = await exerciseTypeService.getAll();
      if ("data" in res && Array.isArray(res.data)) {
        const tempList: { value: string; label: string }[] = [];
        res.data.map((et) => {
          tempList.push({ value: String(et.id), label: et.name });
        });
        setExerciseTypes(tempList);
      } else {
        toast.error("Error fetching exercise types");
      }
    }
    fetchExerciseTypes();
  }, [lessonId]);

  const onHandleFile = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }
  
    try {
      exerciseService.importByFile(file);
    } catch (error) {
      toast.error("Error importing file");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Listening Exercises</h2>
      {exercises.length === 0 ? (
        <p>No listening exercises found in {lessonId}.</p>
      ) : (
        <AdvancedDataTable
          fields={fields}
          page={page}
          onPageChange={onPageChange}
          service={exerciseService}
          linkBase="/admin/exercises"
          breadcrumbs={breadcrumbs}
          modalFields={modalFields}
          // config={{
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
          // }}
        />
      )}
    </div>
  );
}
