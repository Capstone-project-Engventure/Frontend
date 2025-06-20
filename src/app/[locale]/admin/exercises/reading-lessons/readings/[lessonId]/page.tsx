"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { OptionType } from "@/lib/types/option";
import { Reading } from "@/lib/types/reading";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AdminReading() {
  console.log(1200);

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

  /* ──────────────────────── i18n / services ────────────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Exercises");
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = useMemo(() => new LessonService(), []);
  const exerciseTypeService = new ExerciseTypeService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    {
      label: t("breadcrumbs.readingExercises"),
      href: `${locale}/admin/exercises/reading-lessons`,
    },
  ];

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.name") },
      { key: "question", label: t("fields.question") },
      { key: "options", label: t("fields.options"), type: "mcq" },
      { key: "level", label: t("fields.level") },
      { key: "system_answer", label: t("fields.answer") },
      { key: "description", label: t("fields.description") },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "name", label: t("fields.name"), type: "text" },
      { key: "question", label: t("fields.question"), type: "text" },
      {
        key: "lesson",
        label: t("fields.lesson"),
        type: "select",
        options: lessons || [],
      },
      {
        key: "type",
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
      {
        key: "skill",
        label: t("fields.skill"),
        type: "select",
        options: SkillOptions,
      },
      // { key: "generated_by", type: "hidden", default: "system" },
    ],
    [t, lessons, exerciseTypes]
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

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await lessonService.getById(lessonId as string);
        if (res.success) {
          console.log(res);
          setReadings(res.data?.readings || []);
        } else {
          toast.error("Failed to fetch lesson");
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast.error("An error occurred while fetching lesson");
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId, lessonService]);

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
      fetchLesson();
    } catch {
      toast.error("Error importing file");
    }
  };

  /* ──────────────────────── filter UI (passed down) ────── */
  const filterComponents = (
    <>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">{t("fields.topic")}</label>
        {/* <CustomSelector
          objects={topics}
          value={topic}
          onChange={setTopic}
          placeholder={t("placeholders.topic")}
        /> */}
      </div>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">
          {t("fields.lesson")}
        </label>
        <CustomSelector
          objects={lessonOptions}
          value={lesson}
          onChange={setLesson}
          placeholder={t("placeholders.lesson")}
        />
      </div>
    </>
  );

  /* ──────────────────────── handle event in actions ────────────────────────*/
  const onEdit = useCallback((id: string) => {
    const newPath = `${pathname}/edit/${id}`;
    router.push(newPath);
  }, []);

  const onCreate = useCallback(() => {
    const newPath = `${pathname}/create`;
    router.push(newPath);
  }, []);

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <PaginationTable
        filterComponents={filterComponents}
        customObjects={readings}
        customTotalPages={totalPage}
        fields={fields}
        page={page}
        onPageChange={onPageChange}
        service={exerciseService}
        // breadcrumbs={breadcrumbs}
        modalFields={modalFields}
        onHandleFile={onHandleFile}
        hasBreadcrumb={false}
        hasCustomFetch={true}
        onEdit={onEdit}
        onCreate={onCreate}
      />
    </div>
  );
}
