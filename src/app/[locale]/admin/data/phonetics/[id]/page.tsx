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
async function fetchExerciseBySymbol(sound_id: string) {
  const res = await exerciseService.getAll({ filters: { sound: sound_id } });
  if (!res.success) {
    toast.error("Failed to fetch exercises");
    return null;
  }
  return res.data;
}
async function fetchSoundById(sound_id: string) {
  const res = await soundService.getById(sound_id);
  if (!res.success) {
    toast.error("Failed to fetch exercises");
    return null;
  }
  return res.data;
}

const PhoneticExercisePage = () => {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("PhoneticDetail");

  const [selectedSound, setSelectedSound] = useState<Sound>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const onPageChange = (newPage: number) => setPage(newPage);

  const customFetch = async ({ page, pageSize, keyword }: FetchArgs) => {
    console.log("Check here");

    return await exerciseService.getAll({
      page,
      pageSize,
      keyword,
      filters: { sound: selectedSound.symbol },
    });
  };
  const breadcrumbs = [
    { label: "Home", href: `/${locale}/admin/home` },
    { label: "Phonetics", href: `/${locale}/admin/data/phonetics` },
    {
      label: selectedSound?.symbol || "",
      href: `/${locale}/admin/data/phonetics/${selectedSound?.symbol || ""}`,
    },
  ];
  const onHandleFile = (file: File) => console.log("Import file", file);

  const fields = [
    { key: "name", label: "Name" },
    { key: "question", label: "Question" },
    // { key: "options", label: "Options" },
    { key: "level", label: "Level" },
    { key: "system_answer", label: "Answer" },
    { key: "audio_file_url", label: "Audio", type: "audio" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "question", label: "Question", type: "text" },
    { key: "system_answer", label: "Answer", type: "text" },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: LevelOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
    { key: "audio_file", label: "Audio file", type: "audio" },
    // add other editable fields
  ];
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFilters({ sound: id });

    Promise.all([fetchExerciseBySymbol(id), fetchSoundById(id)])
      .then(([exerciseData, soundData]) => {
        setExercises(exerciseData);
        setSelectedSound(soundData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const createPronunciationPractice = async (formData: any, config: any) => {
    formData.append("sound_id", selectedSound.id);
    const res = await pronunciationService.create(formData, config);
    if (res.success) {
      toast.info(t("create_successful"));
    } else {
      toast.error(t("create_unsuccessful"));
    }
  };
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        {t("title", { symbol: selectedSound?.symbol || "..." })}
      </h1>
      <Breadcrumb items={breadcrumbs} />
      <PaginationTable
        customObjects={exercises}
        customTotalPages={1}
        hasCustomFetch={true}
        customFetch={customFetch}
        filterArgs={filters}
        fields={fields}
        page={page}
        onPageChange={onPageChange}
        onAdd={createPronunciationPractice}
        service={pronunciationService}
        linkBase={`/${locale}/admin/data/sound`}
        modalFields={modalFields}
        onHandleFile={onHandleFile}
        hasBreadcrumb={false}
        config={{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }}
      />
    </div>
  );
};

export default PhoneticExercisePage;
