"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import ReadingService from "@/lib/services/reading.service";
import TopicService from "@/lib/services/topic.service";
import { OptionType } from "@/lib/types/option";
import { Reading } from "@/lib/types/reading";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AdminReading() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lessonId = params.lessonId;
  /* ──────────────────────── state ──────────────────────── */
  const [readings, setReadings] = useState<Reading[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [lessons, setLessons] = useState<OptionType[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);

  const [topic, setTopic] = useState<OptionType | null>(null);
  const [lesson, setLesson] = useState<OptionType | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  /* ──────────────────────── i18n / services ────────────── */
  const locale = useLocale();
  const t = useTranslations("Admin.ReadingPassages");
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = useMemo(() => new LessonService(), []);
  const exerciseTypeService = new ExerciseTypeService();
  const readingService = new ReadingService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    {
      label: t("breadcrumbs.exercises"),
      href: `/${locale}/admin/exercises`,
    },
    {
      label: t("breadcrumbs.readingLessons"),
      href: `/${locale}/admin/exercises/reading-lessons`,
    },
    {
      label: currentLesson?.title || t("breadcrumbs.readings"),
      href: `/${locale}/admin/exercises/reading-lessons/readings/${lessonId}`,
    },
  ];

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.title") },
      { key: "content", label: t("fields.excerpt"), type: "excerpt", maxLength: 100 },
      { key: "exercises", label: t("fields.numberOfExercises"), type: "count" },
      { key: "description", label: t("fields.description") },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "title", label: t("fields.title"), type: "text", required: true },
      { key: "content", label: t("fields.content"), type: "textarea", required: true },
      { key: "description", label: t("fields.description"), type: "textarea" },
      {
        key: "lesson",
        label: t("fields.lesson"),
        type: "select",
        options: lessons || [],
        default: lessonId as string
      },
    ],
    [t, lessons]
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


  const fetchLesson = async () => {
    try {
      const res = await lessonService.getById(lessonId as string);
      if (res.success) {
        setReadings(res.data?.readings || []);
        setCurrentLesson(res.data);
      } else {
        toast.error("Failed to fetch lesson");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("An error occurred while fetching lesson");
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  /* ──────────────────────── derived data ───────────────── */
  const lessonOptions = useMemo(() => {
    if (!topic) return lessons;
    return lessons.filter((l) => l.value === topic.value);
  }, [lessons, topic]);

  /* ──────────────────────── filter UI (passed down) ────── */
  const filterComponents = (
    <>
    </>
  );

  /* ──────────────────────── handle event in actions ────────────────────────*/
  const onEdit = useCallback((item: any) => {
    const id = item?.id || item;
    const newPath = `${pathname}/edit/${id}`;
    router.push(newPath);
  }, [pathname, router]);

  const onCreate = useCallback(() => {
    const newPath = `${pathname}/create`;
    router.push(newPath);
  }, [pathname, router]);

  /* ──────────────────────── CRUD handlers ─────────────── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding reading:', data);

      const readingData = {
        ...data,
        lesson: Number(lessonId)
      };

      const response = await readingService.create(readingData, {});

      if (response.success) {
        toast.success(t("messages.createSuccess"));
        fetchLesson();
        return response;
      } else {
        toast.error(t("messages.createError"));
        return response;
      }
    } catch (error: any) {
      console.error("Error creating reading:", error);
      if (error.response?.data?.title) {
        if (error.response.data.title[0].includes('already exists')) {
          toast.error(t("messages.duplicateTitle"));
        } else {
          toast.error(`Title: ${error.response.data.title[0]}`);
        }
      } else {
        toast.error(t("messages.createError"));
      }
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      console.log('Updating reading:', data);

      const response = await readingService.update(Number(id), data, {});

      if (response.success) {
        toast.success(t("messages.updateSuccess"));
        fetchLesson();
        return response;
      } else {
        toast.error(t("messages.updateError"));
        return response;
      }
    } catch (error: any) {
      console.error("Error updating reading:", error);
      if (error.response?.data?.title) {
        if (error.response.data.title[0].includes('already exists')) {
          toast.error(t("messages.duplicateTitle"));
        } else {
          toast.error(`Title: ${error.response.data.title[0]}`);
        }
      } else {
        toast.error(t("messages.updateError"));
      }
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const response = await readingService.delete(Number(id));

      if (response.success) {
        toast.success(t("messages.deleteSuccess"));
        fetchLesson();
        return response;
      } else {
        toast.error(t("messages.deleteError"));
        return response;
      }
    } catch (error) {
      console.error("Error deleting reading:", error);
      toast.error(t("messages.deleteError"));
      throw error;
    }
  };

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <AdvancedDataTable
        fields={fields}
        customObjects={readings}
        customTotalPages={totalPage}
        page={page}
        onPageChange={onPageChange}
        hasCustomFetch={true}
        onCreate={onCreate}
        onEdit={onEdit}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSuccess={fetchLesson}
      />
    </div>
  );
}
