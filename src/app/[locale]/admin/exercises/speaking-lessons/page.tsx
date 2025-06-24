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
import useAdminSpeakingStore from "@/lib/store/adminSpeakingStore";

export default function AdminSpeakingLessons() {
  const router = useRouter();
  const pathname = usePathname();

  /* ──────────────────────── state ──────────────────────── */
  const { 
    lessons: speakingLessons, 
    setLessons: setSpeakingLessons, 
    hasFetched, 
    setHasFetched,
    hasHydrated,
    addLesson,
    updateLesson,
    deleteLesson
  } = useAdminSpeakingStore();
  
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
  const tSpeaking = useTranslations("Admin.SpeakingLessons");
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = new LessonService();
  const exerciseTypeService = new ExerciseTypeService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    {
      label: tSpeaking("breadcrumbs.speakingLessons"),
      href: `${locale}/admin/exercises/speaking-lessons`,
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
      { key: "type", label: "Type", type: "hidden", default: "speaking_practice" },
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
        } else toast.error(tSpeaking("messages.fetchTopicsError"));

        if (lsRes.success) {
          setLessons(
            lsRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error(tSpeaking("messages.fetchLessonsError"));
        if (etRes.success) {
          setExerciseTypes(
            etRes.data.map((v: any) => ({ value: v.id, label: v.name }))
          );
        } else toast.error(tSpeaking("messages.fetchExerciseTypesError"));
      } catch (e) {
        console.error(e);
        toast.error(tSpeaking("messages.networkError"));
      }
    })();
  }, []);

  const fetchLessons = useCallback(async () => {
    if (!hasHydrated || hasFetched) return;
    
    const filters: Record<string, unknown> = { type: "speaking_practice" };
    if (selectedLesson) filters.lesson = selectedLesson.value;
    
    try {
      const res = await lessonService.getAll({ page, pageSize: 10, filters });
      if (res.success) {
        setSpeakingLessons(res.data);
        setTotalPage(res.pagination?.total_page || 1);
      } else {
        toast.error(tSpeaking("messages.fetchError"));
        setSpeakingLessons([]);
      }
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching speaking lessons:", error);
      toast.error(tSpeaking("messages.networkErrorWhileFetching"));
      setSpeakingLessons([]);
      setHasFetched(true);
    }
  }, [hasHydrated, hasFetched, selectedLesson, page, setSpeakingLessons, setHasFetched]);

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
    // const newPath = `${pathname}/speaking/${item.id}`;
    // router.push(newPath);

    return item;
  }, []);

  const onCreate = useCallback(() => {
    // Handle create new lesson if needed
    console.log("Create new speaking lesson");
  }, []);

  const handleAdd = async (data: any) => {
    try {
      const response = await lessonService.create(data);
      if (response.success) {
        addLesson(response.data);
        toast.success(tSpeaking("messages.createSuccess"));
        return response;
      } else {
        toast.error(tSpeaking("messages.createError"));
        return response;
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error(tSpeaking("messages.networkErrorWhileCreating"));
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.update(numericId, data);
      if (response.success) {
        updateLesson(numericId, data);
        toast.success(tSpeaking("messages.updateSuccess"));
        return response;
      } else {
        toast.error(tSpeaking("messages.updateError"));
        return response;
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error(tSpeaking("messages.networkErrorWhileUpdating"));
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.delete(numericId);
      if (response.success) {
        deleteLesson(numericId);
        toast.success(tSpeaking("messages.deleteSuccess"));
        return response;
      } else {
        toast.error(tSpeaking("messages.deleteError"));
        return response;
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error(tSpeaking("messages.networkErrorWhileDeleting"));
      throw error;
    }
  };

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <AdvancedDataTable
        fields={fields}
        customObjects={speakingLessons}
        customTotalPages={totalPage}
        page={page}
        onPageChange={onPageChange}
        modalFields={modalFields}
        modalTitle={tSpeaking("modalTitle")}
        linkBase={`/${locale}/admin/exercises/speaking-lessons/speaking`}
        hasCustomFetch={true}
        onCreate={onCreate}
        onEdit={onEdit}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
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