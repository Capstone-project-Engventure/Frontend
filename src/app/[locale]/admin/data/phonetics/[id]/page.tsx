"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PronunciationPracticeService from "@/lib/services/pronunciation-practice.service";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { useLocale, useTranslations } from "next-intl";
import ExerciseService from "@/lib/services/exercise.service";
import { FetchArgs } from "@/lib/types/api";
import { LevelOptions } from "@/lib/constants/level";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import SoundService from "@/lib/services/sound.service";
import { Sound } from "@/lib/types/sound";
import { toast } from "react-toastify";

const pronunciationService = new PronunciationPracticeService();
const exerciseService = new ExerciseService();
const soundService = new SoundService();

async function fetchExerciseBySymbol(sound_id: string, t: (key: string) => string) {
  const res = await exerciseService.getAll({ filters: { sound: sound_id } });
  if (!res.success) {
    toast.error(t("error.fetchExercises"));
    return null;
  }
  return res.data;
}

async function fetchSoundById(sound_id: string, t: (key: string) => string) {
  const res = await soundService.getById(sound_id);
  if (!res.success) {
    toast.error(t("error.fetchSound"));
    return null;
  }
  return res.data;
}

const PhoneticExercisePage = () => {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("PhoneticDetail");
  const tc = useTranslations("Common");

  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const onPageChange = (newPage: number) => setPage(newPage);

  const customFetch = async ({ page, pageSize, keyword }: FetchArgs) => {
    return await exerciseService.getAll({
      page,
      pageSize,
      keyword,
      filters: { sound: selectedSound?.symbol },
    });
  };

  const breadcrumbs = [
    { label: tc("breadcrumb.home"), href: `/${locale}/admin/home` },
    { label: tc("breadcrumb.phonetics"), href: `/${locale}/admin/data/phonetics` },
    {
      label: selectedSound?.symbol || "...",
      href: `/${locale}/admin/data/phonetics/${selectedSound?.symbol || ""}`,
    },
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFilters({ sound: id });

    Promise.all([
      fetchExerciseBySymbol(id, t),
      fetchSoundById(id, t),
    ])
      .then(([exerciseData, soundData]) => {
        setExercises(exerciseData || []);
        setSelectedSound(soundData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, t]);

  const createPronunciationPractice = async (formData: any, config: any) => {
    formData.append("sound_id", selectedSound?.id || "");
    const res = await pronunciationService.create(formData, config);
    if (res.success) {
      toast.info(t("create_successful"));
    } else {
      toast.error(t("create_unsuccessful"));
    }
  };

  const fields = [
    { key: "name", label: t("fields.name") },
    { key: "question", label: t("fields.question") },
    { key: "level", label: t("fields.level") },
    { key: "system_answer", label: t("fields.answer") },
    { key: "audio_file_url", label: t("fields.audio"), type: "audio" },
    { key: "description", label: t("fields.description") },
  ];

  const modalFields = [
    { key: "name", label: t("modal.name"), type: "text" },
    { key: "question", label: t("modal.question"), type: "text" },
    { key: "system_answer", label: t("modal.answer"), type: "text" },
    {
      key: "level",
      label: t("modal.level"),
      type: "select",
      options: LevelOptions,
    },
    { key: "description", label: t("modal.description"), type: "textarea" },
    { key: "audio_file", label: t("modal.audioFile"), type: "audio" },
  ];

  if (error) {
    return <div>{t("error.general")}: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        {t("title", { symbol: selectedSound?.symbol || "..." })}
      </h1>
      <Breadcrumb items={breadcrumbs} />
      <PaginationTable
        customObjects={exercises}
        customTotalPages={1}
        hasCustomFetch
        customFetch={customFetch}
        filterArgs={filters}
        fields={fields}
        page={page}
        onPageChange={onPageChange}
        onAdd={createPronunciationPractice}
        service={pronunciationService}
        linkBase={`/${locale}/admin/data/sound`}
        modalFields={modalFields}
        onHandleFile={() => {}}
        hasBreadcrumb={false}
        config={{ headers: { "Content-Type": "multipart/form-data" } }}
      />
    </div>
  );
};

export default PhoneticExercisePage;
