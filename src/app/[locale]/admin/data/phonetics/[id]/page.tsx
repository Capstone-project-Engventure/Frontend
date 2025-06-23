"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PronunciationPracticeService from "@/lib/services/pronunciation-practice.service";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { useLocale, useTranslations } from "next-intl";
import ExerciseService from "@/lib/services/exercise.service";
import { FetchArgs } from "@/lib/types/api";
import { LevelOptions } from "@/lib/constants/level";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import SoundService from "@/lib/services/sound.service";
import { Sound } from "@/lib/types/sound";
import { toast } from "react-toastify";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";

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

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const customFetch = useCallback(async ({ page, pageSize, keyword }: FetchArgs) => {
    if (!selectedSound?.symbol) return { data: [], total: 0, success: false };
    
    return await exerciseService.getAll({
      page,
      pageSize,
      keyword,
      filters: { sound: selectedSound.symbol },
    });
  }, [selectedSound?.symbol]);

  const breadcrumbs = [
    { label: tc("breadcrumb.home"), href: `/${locale}/admin/home` },
    { label: tc("breadcrumb.phonetics"), href: `/${locale}/admin/data/phonetics` },
    {
      label: selectedSound?.symbol || "...",
      href: `/${locale}/admin/data/phonetics/${selectedSound?.symbol || ""}`,
    },
  ];

  // useEffect(() => {
  //   if (!id) return;
  //   setLoading(true);
  //   setFilters({ sound: id });

  //   Promise.all([
  //     fetchExerciseBySymbol(id, t),
  //     fetchSoundById(id, t),
  //   ])
  //     .then(([exerciseData, soundData]) => {
  //       setExercises(exerciseData || []);
  //       setSelectedSound(soundData);
  //     })
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false));
  // }, [id, t]);

  const createPronunciationPractice = useCallback(async (formData: any) => {
    if (!selectedSound?.id) {
      toast.error(t("error.noSoundSelected"));
      return;
    }
    try {
      const dataWithSound = {
        ...formData,
        sound_id: selectedSound.id
      };
      
      const res = await pronunciationService.create(dataWithSound, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.success) {
        toast.info(t("create_successful"));
        return res;
      } else {
        toast.error(t("create_unsuccessful"));
        return res;
      }
    } catch (error) {
      toast.error(t("error.general"));
      throw error;
    }
  }, [selectedSound?.id, t]);

  const fields = [
    { key: "name", label: t("fields.name"), type: "text" },
    { key: "question", label: t("fields.question"), type: "text" },
    { key: "level", label: t("fields.level"), type: "select" },
    { key: "system_answer", label: t("fields.answer"), type: "text"  },
    { key: "audio_file_url", label: t("fields.audio"), type: "audio" },
    // { key: "description", label: t("fields.description"), type: "textarea" },
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

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setFilters({ sound: id });

      try {
        const [exerciseData, soundData] = await Promise.all([
          fetchExerciseBySymbol(id, t),
          fetchSoundById(id, t),
        ]);

        setExercises(
          Array.isArray(exerciseData)
            ? exerciseData
            : exerciseData && typeof exerciseData === "object"
            ? [exerciseData]
            : []
        );
        setSelectedSound(soundData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t("error.general");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, t]);


  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{tc("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t("error.general")}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("title", { symbol: selectedSound?.symbol || "..." })}
            </h1>
          </div>
          {selectedSound?.symbol && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-2xl font-mono font-bold text-blue-800">
                {selectedSound.symbol}
              </span>
            </div>
          )}
        </div>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("exercises.title")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("exercises.description")}
          </p>
        </div>
        
        <div className="p-6">
          <AdvancedDataTable 
            fields={fields} 
            page={page}
            onPageChange={onPageChange}  
            modalFields={modalFields}
            customObjects={exercises}
            customTotalPages={1}
            hasCustomFetch={true}
            modalTitle="Phonetic Exercise"
            onAdd={createPronunciationPractice}
            onSuccess={() => {
              // Reload exercises after successful operations
              if (id && typeof id === 'string') {
                fetchExerciseBySymbol(id, t).then(exerciseData => {
                  setExercises(
                    Array.isArray(exerciseData)
                      ? exerciseData
                      : exerciseData && typeof exerciseData === "object"
                      ? [exerciseData]
                      : []
                  );
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneticExercisePage;
