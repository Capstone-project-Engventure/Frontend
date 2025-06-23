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
import { useLocale, useTranslations } from "next-intl";

type OptionType = {
  value: string;
  label: string;
};

export default function AdminWritingPracticeExercise() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lessonId = params.lessonId;
  const locale = useLocale();
  const t = useTranslations("Admin.Exercises");
  const tWriting = useTranslations("Admin.WritingLessons");

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
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    { label: tWriting("breadcrumbs.writings"), href: `/${locale}/admin/exercises/writing-lessons` },
  ];

  const fields = [
    { key: "name", label: t("fields.name") },
    { key: "question", label: t("fields.question") },
    // { key: "options", label: "Options" },
    // { key: "audio_file", label: "Audio", type: "audio" },
    // { key: "system_answer", label: "Answer" },
    { key: "description", label: t("fields.description") },
  ];

  const modalFields = [
    { key: "name", label: t("fields.name"), type: "text" },
    { key: "question", label: t("fields.question"), type: "textarea" },
    {
      key: "level",
      label: t("fields.level"),
      type: "select",
      options: LevelOptions,
    },
    { key: "description", label: t("fields.description"), type: "textarea" },
    { key: "explanation", label: t("fields.explanation"), type: "textarea" },
    {
      key: "skill",
      label: t("fields.skill"),
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
          toast.error(tWriting("messages.fetchTopicsError"));
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
          toast.error(response.error || tWriting("messages.fetchLessonsError"));
          return;
        }
        if (!Array.isArray(response.data)) {
          toast.error(tWriting("messages.fetchLessonsError"));
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
        toast.error(tWriting("messages.fetchError"));
        setExercises([]);
      }
    } catch (e) {
      console.error(e);
      toast.error(tWriting("messages.networkError"));
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
      toast.error(tWriting("messages.networkError"));
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
        toast.success(tWriting("messages.createExerciseSuccess"));
        fetchExercises();
        return response;
      } else {
        toast.error(tWriting("messages.createExerciseError"));
        return response;
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error(tWriting("messages.networkErrorWhileCreating"));
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
        toast.success(tWriting("messages.updateExerciseSuccess"));
        fetchExercises();
        return response;
      } else {
        toast.error(tWriting("messages.updateExerciseError"));
        return response;
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error(tWriting("messages.networkErrorWhileUpdating"));
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const response = await exerciseService.delete(Number(id));
      if (response.success) {
        toast.success(tWriting("messages.deleteExerciseSuccess"));
        fetchExercises();
        return response;
      } else {
        toast.error(tWriting("messages.deleteExerciseError"));
        return response;
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error(tWriting("messages.networkErrorWhileDeleting"));
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
        // modalFields={modalFields}
        modalTitle={tWriting("modalTitle")}
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
