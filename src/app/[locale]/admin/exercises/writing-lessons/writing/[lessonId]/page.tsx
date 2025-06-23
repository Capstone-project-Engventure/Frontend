"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { LevelOptions } from "@/lib/constants/level";

type OptionType = {
  value: string;
  label: string;
};

export default function AdminWritingPracticeExercise() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lessonId = params.lessonId;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<OptionType | null>(null);
  const [totalPage, setTotalPage] = useState(7);
  const [lessonsByTopic, setLessonsByTopic] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const [exerciseTypes, setExerciseTypes] = useState([]);
  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises writing", href: "/admin/exercises/writing" },
  ];

  const fields = [
    { key: "name", label: "Name" },
    { key: "question", label: "Question" },
    // { key: "options", label: "Options" },
    // { key: "audio_file", label: "Audio", type: "audio" },
    // { key: "system_answer", label: "Answer" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "question", label: "Question", type: "textarea" },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: LevelOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
    { key: "explanation", label: "Explanation", type: "textarea" },
    {
      key: "skill",
      label: "Skill",
      type: "select",
      options: [{ value: "writing", label: "Writing" }],
      default: "writing",
    },
    {
      key: "lesson",
      label: "",
      type: "hidden",
      default: Number(lessonId),
    },
    { key: "generated_by", label: "", type: "hidden", default: "admin" },
  ];

  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = new LessonService();

  const onPageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await topicService.getAll();
        if (!response.success || !Array.isArray((response as any).data)) {
          toast.error("Failed to fetch topics");
          return;
        }
        const tempList = (response as any).data.map((topic: any) => ({
          value: topic.id,
          label: topic.title,
        }));
        setTopics(tempList);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopic();
  }, []);

  useEffect(() => {
    const fetchLessonsByTopic = async () => {
      if (!selectedTopic) {
        setLessonsByTopic([]);
        return;
      }
      try {
        const response = await lessonService.getAllByTopic(selectedTopic.value);
        if (!response.success) {
          toast.error(response.error || "Failed to fetch lessons for the selected topic");
          return;
        }
        if (!Array.isArray(response.data)) {
          toast.error("Invalid data format received");
          return;
        }
        setLessonsByTopic(response.data);
      } catch (error) {
        console.error("Error fetching lessons by topic:", error);
      }
    };
    fetchLessonsByTopic();
  }, [selectedTopic]);

  // Fetch exercises for this specific lesson
  const fetchExercises = useCallback(async () => {
    try {
      const filters: Record<string, unknown> = {
        lesson: lessonId,
        skill: "writing",
      };

      const res = await exerciseService.getAll({
        page,
        pageSize,
        filters,
      });

      if (res.success) {
        setExercises(res.data || []);
        setTotalPage(res.pagination?.total_page ?? 1);
      } else {
        toast.error("Failed to fetch exercises");
        setExercises([]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while fetching exercises");
      setExercises([]);
    }
  }, [lessonId, page, pageSize]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const onHandleFile = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      const response = await exerciseService.importByFile(file);
      if (response.success) {
        toast.success("File imported successfully");
        fetchExercises();
      } else {
        toast.error(response.error || "Error importing file");
      }
    } catch (error) {
      toast.error("Network error while importing file");
    }
  };

  /* ──────────────────────── handle event in actions ────────────────────────*/
  const onEdit = useCallback(
    (item: any) => {
      const id = item?.id || item;
      const newPath = `${pathname}/edit/${id}`;
      router.push(newPath);
    },
    [pathname, router]
  );

  const onCreate = useCallback(() => {
    const newPath = `${pathname}/create`;
    router.push(newPath);
  }, [pathname, router]);

  const handleAdd = async (data: any) => {
    try {
      const exerciseData = {
        ...data,
        lesson: lessonId,
        skill: "writing",
        generated_by: "admin",
      };

      const response = await exerciseService.create(exerciseData, {});
      if (response.success) {
        toast.success("Exercise created successfully");
        fetchExercises();
        return response;
      } else {
        toast.error("Failed to create exercise");
        return response;
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Network error while creating exercise");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      const exerciseData = {
        ...data,
        lesson: lessonId,
        skill: "writing",
      };

      const response = await exerciseService.update(
        Number(id),
        exerciseData,
        {}
      );
      if (response.success) {
        toast.success("Exercise updated successfully");
        fetchExercises();
        return response;
      } else {
        toast.error("Failed to update exercise");
        return response;
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Network error while updating exercise");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const response = await exerciseService.delete(Number(id));
      if (response.success) {
        toast.success("Exercise deleted successfully");
        fetchExercises();
        return response;
      } else {
        toast.error("Failed to delete exercise");
        return response;
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Network error while deleting exercise");
      throw error;
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {currentLesson?.title || `Lesson ${lessonId}`} - Writing Exercises
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLesson?.description ||
            "Manage writing exercises for this lesson"}
        </p>
      </div>

      <AdvancedDataTable
        fields={fields}
        customObjects={exercises}
        customTotalPages={totalPage}
        page={page}
        onPageChange={onPageChange}
        modalFields={modalFields}
        modalTitle="Writing Exercise"
        hasCustomFetch={true}
        onCreate={onCreate}
        onEdit={onEdit}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSuccess={fetchExercises}
      />
    </div>
  );
}
