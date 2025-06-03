"use client";
import { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaArrowRight,
  FaVolumeUp,
  FaMicrophone,
  FaCheck,
  FaTimes,
  FaVolumeDown,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import ExerciseService from "@/lib/services/exercise.service";
import PronunciationPracticeService from "@/lib/services/pronunciation-practice.service";
import SoundService from "@/lib/services/sound.service";
import { Exercise } from "@/lib/types/exercise";
import { Sound } from "@/lib/types/sound";
import Breadcrumb from "@/app/[locale]/components/breadcumb";

export default function StudentPronunciationPractice() {
  /* --------------------------------------------------- */
  /*                       STATE                        */
  /* --------------------------------------------------- */
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // One blob + result per exercise index
  const [audioBlobs, setAudioBlobs] = useState<(Blob | null)[]>([]);
  const [results, setResults] = useState<(null | { success: boolean })[]>([]);

  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { id } = useParams<{ id: string }>();
  const t = useTranslations("StudentPronunciationPractice");
  const locale = useLocale();
  const breadcrumbs = [
    { label: t("home"), href: `/${locale}/student/home` },
    {
      label: t("pronunciation"),
      href: `/${locale}/student/practice/pronunciation`,
    },
    { label: selectedSound?.symbol },
  ];

  /* --------------------------------------------------- */
  /*                      SERVICES                      */
  /* --------------------------------------------------- */
  const exerciseService = new ExerciseService();
  const pronunciationService = new PronunciationPracticeService();
  const soundService = new SoundService();

  /* --------------------------------------------------- */
  /*                         DATA                        */
  /* --------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exRes, soundRes] = await Promise.all([
          exerciseService.getAll({ filters: { sound: id } }),
          soundService.getById(id),
        ]);

        if (exRes.success && Array.isArray(exRes.data)) {
          setExercises(exRes.data);
          setAudioBlobs(new Array(exRes.data.length).fill(null));
          setResults(new Array(exRes.data.length).fill(null));
        } else {
          toast.error(t("fetch_unsuccessful"));
        }

        if (soundRes.success) {
          setSelectedSound(soundRes.data);
        } else {
          toast.error(t("fetch_unsuccessful"));
        }
      } catch (err) {
        console.error(err);
        toast.error(t("fetch_unsuccessful"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  /* --------------------------------------------------- */
  /*                    HELPERS                         */
  /* --------------------------------------------------- */
  const currentExercise = exercises[currentIndex];
  const currentResult = results[currentIndex];
  const currentBlob = audioBlobs[currentIndex];

  const updateResult = (idx: number, res: { success: boolean }) =>
    setResults((prev) => {
      const clone = [...prev];
      clone[idx] = res;
      return clone;
    });

  const updateBlob = (idx: number, blob: Blob) =>
    setAudioBlobs((prev) => {
      const clone = [...prev];
      clone[idx] = blob;
      return clone;
    });

  /* --------------------------------------------------- */
  /*                 AUDIO PLAY & RECORD                 */
  /* --------------------------------------------------- */
  const buildUrl = (path: string | null) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_GCS_BASE_URL}/${path}`;
  };

  const playModelAudio = useCallback(
    (rate: number) => {
      const url = buildUrl(currentExercise?.audio_file_url ?? null);
      if (!url) return toast.error(t("no_audio_available"));
      const audio = new Audio(url);
      audio.playbackRate = rate;
      audio.play();
    },
    [currentExercise, t]
  );

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      updateBlob(currentIndex, blob);
      setIsRecording(false);

      try {
        const res = await pronunciationService.checkPronunciation({
          soundId: id,
          exerciseId: currentExercise?.id,
          blob,
        });
        if (res.success) {
          updateResult(currentIndex, { success: res.data?.is_correct });
        } else {
          toast.error(t("check_unsuccessful"));
        }
      } catch {
        toast.error(t("check_unsuccessful"));
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 3000);
  };

  /* --------------------------------------------------- */
  /*               NAVIGATION (CIRCULAR)                 */
  /* --------------------------------------------------- */
  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? exercises.length - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === exercises.length - 1 ? 0 : i + 1));

  /* --------------------------------------------------- */
  /*                      RENDER                         */
  /* --------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg text-gray-500">
        {t("loading")}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-lg text-gray-500">
        {t("no_exercises")}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <h2 className="text-2xl text-center mb-6 font-semibold">
        {t("title", { symbol: selectedSound?.symbol || "..." })}
      </h2>

      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-2xl text-center overflow-hidden">
        {/* Index display */}
        <div className="absolute top-2 right-4 text-sm text-gray-500">
          {currentIndex + 1} / {exercises.length}
        </div>

        {/* Slide navigation */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100"
        >
          <FaArrowRight />
        </button>

        {/* Animated slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Sound symbol */}
            <h3 className="text-xl font-medium mb-4 min-h-[4rem] flex items-center justify-center">
              {currentExercise.description}
            </h3>
            <h2 className="text-4xl font-bold mb-2">
              {currentExercise.question}
            </h2>

            {/* Audio buttons */}
            <div className="flex justify-center gap-3 mb-4 mt-4">
              <button
                onClick={() => playModelAudio(1)}
                title={t("tooltip_normal")} // tooltip on hover
                className="text-lg px-4 py-2 bg-blue-500 text-white rounded-full flex items-center gap-2"
              >
                <FaVolumeUp /> {t("listen_normal")}
              </button>
              <button
                onClick={() => playModelAudio(0.6)}
                title={t("tooltip_slow")} // tooltip on hover
                className="text-lg px-4 py-2 bg-indigo-500 text-white rounded-full flex items-center gap-2"
              >
                <FaVolumeDown /> {t("listen_slow")}
              </button>
            </div>

            {/* Record */}
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="text-lg px-6 py-2 bg-red-500 text-white rounded-full flex items-center gap-2 mx-auto"
            >
              <FaMicrophone />{" "}
              {isRecording ? t("recording") : t("start_recording")}
            </button>

            {/* Playback */}
            {currentBlob && (
              <div className="mt-4">
                <audio controls src={URL.createObjectURL(currentBlob)} />
              </div>
            )}

            {/* Result */}
            {currentResult && (
              <p className="mt-4 text-xl flex items-center justify-center gap-2 text-center">
                {currentResult.success ? (
                  <>
                    <FaCheck className="text-green-500" />
                    {t("good_pronunciation")}
                  </>
                ) : (
                  <>
                    <FaTimes className="text-red-500" />
                    {t("try_again")}
                  </>
                )}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
