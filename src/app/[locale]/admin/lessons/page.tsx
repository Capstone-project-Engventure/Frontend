"use client";

import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { LevelOptions } from "@/lib/constants/level";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
export default function AdminLesson() {
  // State
  /* ──────────────── state ──────────────── */
  const [page, setPage] = useState(1);
  const [topics, setTopics] = useState<any[]>([]);

  /* ──────────────── i18n / services ────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Lessons");
  const lessonService = new LessonService();
  const topicService = new TopicService();

  const topicOptions = useMemo(
    () => topics.map(({ id, title }) => ({ value: id, label: title })),
    [topics]
  );

  const breadcrumbs = useMemo(
    () => [
      { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
      { label: t("breadcrumbs.lesson") },
    ],
    [locale, t]
  );

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.title") },
      { key: "level", label: t("fields.level") },
      {
        key: "topic",
        label: t("fields.topic"),
        isNest: true,
        nestKey: "title",
      },
      { key: "type", label: t("fields.types") },
      { key: "description", label: t("fields.description") },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "title", label: t("fields.title"), type: "text" },
      {
        key: "level",
        label: t("fields.level"),
        type: "select",
        options: LevelOptions,
      },
      {
        key: "topic_id",
        label: t("fields.topic"),
        type: "select",
        options: topicOptions,
      },
      {
        key: "type",
        label: t("fields.types"),
        type: "select",
        options: [
          { value: "lesson", label: t("fields.type.lesson") },
          { value: "practice", label: t("fields.type.practice") },
        ],
      },
      { key: "description", label: t("fields.description"), type: "textarea" },
    ],
    [t, topicOptions]
  );
  /* ──────────────── effects ────────────── */
  useEffect(() => {
    (async () => {
      const res = await topicService.getAll();
      if (res.success && Array.isArray(res.data)) setTopics(res.data);
      else toast.error(t("messages.fetchTopicFail"));
    })();
  }, []);

  /* ──────────────── handlers ───────────── */
  const onSuccess = () => toast.success(t("messages.success"));
  const onPageChange = (p: number) => setPage(p);

  // const onHandleFile = async (file: File) => {
  //   if (!file) return;
  //   const res = await lessonService.importByFile(file);
  //   res.success
  //     ? toast.success(t("messages.importOk"))
  //     : toast.error(t("messages.importFail"));
  // };

  return (
    // Fix the component with ts
    <>
      <AdvancedDataTable
        fields={fields}
        page={page}
        service={lessonService}
        onPageChange={onPageChange}
        onSuccess={onSuccess}
        linkBase={`/${locale}/admin/lessons`}
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
      />
    </>
  );
}
