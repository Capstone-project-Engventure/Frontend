"use client";
import SoundService from "@/lib/services/sound.service";
import { Sound } from "@/lib/types/sound";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { toast } from "react-toastify";
const PronunciationPracticePage = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const soundService = new SoundService();
  const t = useTranslations("PronunciationPractice");
  const locale = useLocale()
  useEffect(() => {
    soundService.getAll().then((response) => {
      if (!response.success) {
        toast.error("fetch error");
        return;
      }
      setSounds(response.data);
    });
  }, []);

  const vowels = sounds.filter((sound) => sound.type === "vowel");
  const consonants = sounds.filter((sound) => sound.type === "consonant");

  const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const renderSoundCards = (list: Sound[]) => (
    <div className="flex flex-wrap gap-6">
      {list.map((sound, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 w-48 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 italic text-gray-500 mb-4">
            <p>{sound.symbol}</p>
            <button
              onClick={() => playSound(sound.sound_audio || sound.symbol)}
              aria-label={`${t("playSound")} ${sound.symbol}`}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <FiVolume2 size={18} />
            </button>
          </div>

          {/* Word + audio play */}
          <div className="flex items-center gap-2 text-xl font-semibold mb-2">
            <p>{sound.word}</p>
            <button
              onClick={() => playSound(sound.word_audio || sound.word)}
              aria-label={`${t("playSound")} ${sound.word}`}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <FiVolume2 size={18} />
            </button>
          </div>

          <Link
            href={`/${locale}/student/practice/pronunciation/${encodeURIComponent(sound.id)}`}
            className="text-white bg-teal-600 font-medium border border-gray-300 px-4 py-2 rounded hover:bg-teal-400 hover:text-white transition text-center w-full"
          >
            {t("goToExercise")}
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-6 text-lg text-gray-700">{t("subtitle")}</p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t("vowels")}</h2>
        {renderSoundCards(vowels)}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("consonants")}</h2>
        {renderSoundCards(consonants)}
      </section>
    </div>
  );
};

export default PronunciationPracticePage;

function useTranslation(): { t: any } {
  throw new Error("Function not implemented.");
}
