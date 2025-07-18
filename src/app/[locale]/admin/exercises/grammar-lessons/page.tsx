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
import { useRouter, usePathname } from "next/navigation";
import useAdminGrammarStore from "@/lib/store/adminGrammarStore";

export default function AdminGrammarLessons() {
  const router = useRouter();
  const pathname = usePathname();

  /* ──────────────────────── state ──────────────────────── */
  const {
    lessons: grammarLessons,
    setLessons: setGrammarLessons,
    hasFetched,
    setHasFetched,
    hasHydrated,
    addLesson,
    updateLesson,
    deleteLesson
  } = useAdminGrammarStore();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [lessons, setLessons] = useState<OptionType[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);

  const [topic, setTopic] = useState<OptionType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<OptionType | null>(null);



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
      href: `${locale}/admin/exercises/grammar-lessons`,
    },
    {
      label: "Grammar Practice Lessons",
      href: "#",
    },
  ];

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.name") },
      { key: "level", label: t("fields.level") },
      { key: "description", label: t("fields.description") },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "title", label: t("fields.name"), type: "text", required: true },
      { key: "description", label: t("fields.description"), type: "textarea" },
      {
        key: "level",
        label: t("fields.level"),
        type: "select",
        options: LevelOptions,
        required: true
      },
      {
        key: "topic",
        label: t("fields.topic"),
        type: "select",
        options: topics,
      },
      { key: "type", label: "Type", type: "hidden", default: "grammar_practice" },
    ],
    [t, topics]
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

  const fetchLessons = useCallback(async () => {
    if (!hasHydrated || hasFetched) return;

    const filters: Record<string, unknown> = { type: "grammar_practice" };
    if (selectedLesson) filters.lesson = selectedLesson.value;

    try {
      const res = await lessonService.getAll({ page, pageSize: 10, filters });
      if (res.success) {
        setGrammarLessons(res.data);
        setTotalPage(res.pagination?.total_page || 1);
      } else {
        toast.error("Failed to fetch lessons");
        setGrammarLessons([]);
      }
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching grammar lessons:", error);
      toast.error("Network error while fetching lessons");
      setGrammarLessons([]);
      setHasFetched(true);
    }
  }, [hasHydrated, hasFetched, selectedLesson, page, setGrammarLessons, setHasFetched]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  /* ──────────────────────── derived data ───────────────── */
  const lessonOptions = useMemo(() => {
    if (!topic) return lessons;
    return lessons.filter((l) => l.value === topic.value);
  }, [lessons, topic]);

  /* ──────────────────────── filter UI (passed down) ────── */
  const filterComponents = (
    <>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">{t("fields.topic")}</label>
        <CustomSelector
          objects={topics}
          value={topic}
          onChange={setTopic}
          placeholder={t("placeholders.topic")}
        />
      </div>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">
          {t("fields.lesson")}
        </label>
        <CustomSelector
          objects={lessonOptions}
          value={selectedLesson}
          onChange={setSelectedLesson}
          placeholder={t("placeholders.lesson")}
        />
      </div>
    </>
  );

  /* ──────────────────────── handle event in actions ────────────────────────*/
  const onEdit = useCallback((item: any) => {
    return item;
  }, []);

  const onCreate = useCallback(() => {
    // Handle create new lesson if needed
    console.log("Create new grammar lesson");
  }, []);

  const handleAdd = async (data: any) => {
    try {
      const response = await lessonService.create(data);
      if (response.success) {
        addLesson(response.data);
        toast.success("Lesson created successfully");
        return response;
      } else {
        toast.error("Failed to create lesson");
        return response;
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Network error while creating lesson");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.update(numericId, data);
      if (response.success) {
        updateLesson(numericId, response.data);
        toast.success("Lesson updated successfully");
        return response;
      } else {
        toast.error("Failed to update lesson");
        return response;
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Network error while updating lesson");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.delete(numericId);
      if (response.success) {
        deleteLesson(numericId);
        toast.success("Lesson deleted successfully");
        return response;
      } else {
        toast.error("Failed to delete lesson");
        return response;
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Network error while deleting lesson");
      throw error;
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    try {
      const numericIds = ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      
      // Delete lessons one by one (since we don't have bulk delete API)
      const deletePromises = numericIds.map(id => lessonService.delete(id));
      const responses = await Promise.all(deletePromises);
      
      const successfulIds = responses
        .map((response, index) => response.success ? numericIds[index] : null)
        .filter(id => id !== null) as number[];
      
      if (successfulIds.length > 0) {
        // Update store by removing successful deletions
        successfulIds.forEach(id => deleteLesson(id));
        toast.success(`Successfully deleted ${successfulIds.length} lesson(s)`);
      }
      
      const failedCount = numericIds.length - successfulIds.length;
      if (failedCount > 0) {
        toast.error(`Failed to delete ${failedCount} lesson(s)`);
      }
      
      return { success: successfulIds.length > 0 };
    } catch (error) {
      console.error("Error bulk deleting lessons:", error);
      toast.error("Network error while deleting lessons");
      throw error;
    }
  };

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <AdvancedDataTable
        fields={fields}
        customObjects={grammarLessons}
        customTotalPages={totalPage}
        page={page}
        onPageChange={onPageChange}
        linkBase={`/${locale}/admin/exercises/grammar-lessons/grammars`}
        modalFields={modalFields}
        modalTitle="Grammar Lesson"
        hasCustomFetch={true}
        onCreate={onCreate}
        onEdit={onEdit}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onSuccess={() => {
          // Refresh the current page data without full refetch
          if (hasHydrated) {
            setHasFetched(false);
            fetchLessons();
          }
        }}
      />
    </div>
  );
}