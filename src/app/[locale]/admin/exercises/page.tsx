"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import Breadcrumb from "@/app/[locale]/components/breadcumb";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import CustomSelector from "../../components/CustomSelector";

import ExerciseService from "@/lib/services/exercise.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { useLocale, useTranslations } from "next-intl";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import { LevelOptions } from "@/lib/constants/level";

export default function AdminExercise() {
  const t = useTranslations("Admin.Exercises");
  const locale = useLocale();

  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const exerciseTypeService = new ExerciseTypeService();

  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);

  const [lessons, setLessons] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);

  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fields = [
    { key: "name", label: t("fields.name"), type: "text" },
    { key: "question", label: t("fields.question"), type: "text" },
    { key: "system_answer", label: t("fields.answer"), type: "text" },
    { key: "level", label: t("fields.level"), type: "text" },
    { key: "type.name", label: t("fields.type"), isNest: true },
    // { key: "topic", label: "Topic" },
    { key: "description", label: t("fields.description"), type: "text" },
  ];

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

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises" }, // last item: no href
  ];

  const onPageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchExerciseData = async () => {
      setIsLoading(true);
      try {
        const res = await exerciseService.getAll(page, pageSize);
        if (res.success) {
          setExercises(res.data.results);
          setPage(res.data.page);
          setPageSize(res.data.page_size);
          setTotalPages(res.data.num_pages);
          console.log("Fetched exercises from API and cached");
        }
      } catch (err) {
        console.error("Fetch exercises failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTopics = async () => {
      const res = await topicService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setTopics(
          res.data.map((topic) => ({ id: topic.id, value: topic.title }))
        );
      }
    };

    const fetchExerciseTypes = async () => {
      const res = await exerciseTypeService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setExerciseTypes(
          res.data.map((type) => ({ id: type.id, value: type.name }))
        );
      }
    };

    fetchTopics();
    fetchExerciseData();
    fetchExerciseTypes();
  }, [page]);

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
          objects={lessons}
          value={lesson}
          onChange={setLesson}
          placeholder={t("placeholders.lesson")}
        />
      </div>
    </>
  );

  return (
    <>
      {/* <Breadcrumb items={breadcrumbs} /> */}
      <PaginationTable
        // objects={exercises}
        fields={fields}
        modalFields={modalFields}
        page={page}
        onPageChange={onPageChange}
        service={exerciseService}
        breadcrumbs={breadcrumbs}
        linkBase={`/${locale}/admin/exercises`}
        filterComponents={filterComponents}
      />
    </>
  );
}
