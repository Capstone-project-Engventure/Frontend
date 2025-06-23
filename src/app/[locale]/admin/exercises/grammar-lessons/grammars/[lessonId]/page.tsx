"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { Topic } from "@/lib/types/topic";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function AdminGrammarExercises() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lessonId = params.lessonId as string;

  // Safe render function to prevent React child errors
  const safeRender = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      // Handle specific object types
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.label) return value.label;
      return JSON.stringify(value);
    }
    return String(value);
  };

  /* ──────────────────────── state ──────────────────────── */
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [lessons, setLessons] = useState<OptionType[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);

  const [topic, setTopic] = useState<OptionType | null>(null);
  const [lesson, setLesson] = useState<OptionType | null>(null);

  /* ──────────────────────── i18n / services ────────────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Exercises");
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = new LessonService();
  const exerciseTypeService = new ExerciseTypeService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    {
      label: t("breadcrumbs.grammarExercises"),
      href: `/${locale}/admin/exercises/grammar-lessons`,
    },
    {
      label: currentLesson?.title || `Lesson ${lessonId}`,
      href: pathname,
    },
  ];

  const fields = useMemo(
    () => [
      {
        key: "name",
        label: t("fields.name"),
        render: safeRender,
      },
      {
        key: "question",
        label: t("fields.question"),
        render: safeRender,
      },
      {
        key: "level",
        label: t("fields.level"),
        render: safeRender,
      },
      // {
      //   key: "type",
      //   label: t("fields.questionType"),
      //   render: (value: any) => {
      //     if (!value) return "N/A";
      //     if (typeof value === 'string') return value;
      //     if (typeof value === 'object' && value.name) return value.name;
      //     return "N/A";
      //   },
      // },
      {
        key: "system_answer",
        label: t("fields.answer"),
        render: safeRender,
      },
      // {
      //   key: "options",
      //   label: t("fields.options"),
      //   render: (value: any) => {
      //     try {
      //       if (!value) return "N/A";

      //       // If value is a string, try to parse it
      //       let options = value;
      //       if (typeof value === 'string') {
      //         options = JSON.parse(value);
      //       }

      //       if (!Array.isArray(options)) return "N/A";

      //       return options.map((opt: any) => {
      //         if (typeof opt === 'object' && opt.key && opt.option) {
      //           return `${opt.key}: ${opt.option}`;
      //         }
      //         return String(opt);
      //       }).join(", ");
      //     } catch (e) {
      //       return typeof value === 'string' ? value : "Invalid format";
      //     }
      //   }
      // },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "name", label: t("fields.name"), type: "text" },
      { key: "question", label: t("fields.question"), type: "textarea" },
      {
        key: "type_id",
        label: t("fields.questionType"),
        type: "select",
        options: exerciseTypes || [],
      },
      {
        key: "level",
        label: t("fields.level"),
        type: "select",
        options: LevelOptions,
      },
      { key: "description", label: t("fields.description"), type: "textarea" },
      { key: "system_answer", label: t("fields.answer"), type: "text" },
      { key: "explanation", label: t("fields.explanation"), type: "textarea" },
      {
        key: "options",
        label: t("fields.options"),
        type: "textarea",
        placeholder:
          'JSON format: [{"key": "A", "option": "Answer A"}, {"key": "B", "option": "Answer B"}]',
      },
      {
        key: "skill",
        label: t("fields.skill"),
        type: "select",
        options: SkillOptions,
        default: "grammar",
      },
      {
        key: "lesson",
        label: "",
        type: "hidden",
        default: lessonId,
      },
      { key: "generated_by", label: "", type: "hidden", default: "admin" },
    ],
    [t, exerciseTypes, lessonId]
  );

  const onPageChange = (page: number) => {
    setPage(page);
  };

  /* ──────────────────────── data fetches ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [tpRes, lsRes, etRes] = await Promise.all([
          topicService.getAll(),
          lessonService.getAll(),
          exerciseTypeService.getAll(),
        ]);
        if (tpRes.success) {
          setTopics(
            tpRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error("Failed to fetch topics");

        if (lsRes.success) {
          setLessons(
            lsRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error("Failed to fetch lessons");

        if (etRes.success) {
          setExerciseTypes(
            etRes.data.map((v: any) => ({ value: v.id, label: v.name }))
          );
        } else toast.error("Failed to fetch exercise types");
      } catch (e) {
        console.error(e);
        toast.error("Network error");
      }
    })();
  }, []);

  // Fetch current lesson info
  useEffect(() => {
    (async () => {
      if (lessonId) {
        try {
          const res = await lessonService.getById(lessonId);
          if (res.success) {
            setCurrentLesson(res.data);
          }
        } catch (e) {
          console.error("Error fetching lesson:", e);
        }
      }
    })();
  }, [lessonId]);

  const fetchExercises = useCallback(async () => {
    try {
      const filters: Record<string, unknown> = {
        lesson: lessonId,
        skill: "grammar",
      };

      const res = await exerciseService.getAll({
        page,
        pageSize,
        filters,
      });
      console.log("check res: ", res);

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

  /* ──────────────────────── derived data ───────────────── */
  const lessonOptions = useMemo(() => {
    if (!topic) return lessons;
    return lessons.filter((l) => l.value === topic.value);
  }, [lessons, topic]);

  /* ──────────────────────── upload handler ─────────────── */
  const onHandleFile = async (file: File | null) => {
    if (!file) return toast.error("Please select a file to import");
    try {
      await exerciseService.importByFile(file);
      toast.success("Import queued");
      fetchExercises();
    } catch {
      toast.error("Error importing file");
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
        skill: "grammar",
        generated_by: "admin",
      };

      // Parse options if it's a string
      if (exerciseData.options && typeof exerciseData.options === "string") {
        try {
          exerciseData.options = JSON.parse(exerciseData.options);
        } catch (e) {
          toast.error("Invalid JSON format for options");
          return;
        }
      }

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
        skill: "grammar",
      };

      // Parse options if it's a string
      if (exerciseData.options && typeof exerciseData.options === "string") {
        try {
          exerciseData.options = JSON.parse(exerciseData.options);
        } catch (e) {
          toast.error("Invalid JSON format for options");
          return;
        }
      }

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

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {currentLesson?.title || `Lesson ${lessonId}`} - Grammar Exercises
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLesson?.description ||
            "Manage grammar exercises for this lesson"}
        </p>
      </div>

      <AdvancedDataTable
        fields={fields}
        customObjects={exercises}
        customTotalPages={totalPage}
        page={page}
        onPageChange={onPageChange}
        modalTitle="Grammar Exercise"
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
