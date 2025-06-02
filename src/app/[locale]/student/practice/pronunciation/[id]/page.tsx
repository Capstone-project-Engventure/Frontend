"use client";
import PronunciationPracticeService from "@/lib/services/pronunciation-practice.service";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PronunciationIPAPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [result, setResult] = useState(null);
  const { id: symbol } = useParams();
  const [exercises, setExercises] = useState(null);
  const pronunciationService = new PronunciationPracticeService();
  const soundUrl = 'https://example.com/audio/hat.mp3';
  const t = useTranslations("PronunciationPractice")
  const startRecording = async () => {
    setResult(null);
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      setAudioBlob(blob);
      // 👉 call API to check pronunciation
      // uploadToBackend(blob);
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 3000); // ghi âm 3 giây
  };

  useEffect(() => {
    const fetchPronunciationPractice = async()=>{
      const res = await pronunciationService.getAll()
      if(!res.success || !Array.isArray(res.data)) {
        toast.error(t("fetch_unsuccessful"))
      }
      setExercises(res.data)
    }
    fetchPronunciationPractice()
  },[]);
  const playAudio = () => {
    new Audio(soundUrl).play();
  };
  return (
    <div className="w-full max-w-md mx-auto text-center p-6 shadow-xl rounded-2xl bg-white">
      <h2 className="text-4xl font-bold mb-4">{symbol}</h2>

      <button
        onClick={playAudio}
        className="text-lg px-4 py-2 bg-blue-500 text-white rounded-full mb-4"
      >
        🔊 Listen
      </button>

      <div>
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="text-lg px-6 py-2 bg-red-500 text-white rounded-full"
        >
          {isRecording ? "🎤 Recording..." : "🎤 Start Recording"}
        </button>
      </div>

      {audioBlob && (
        <div className="mt-4">
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}

      {result && (
        <p className="mt-4 text-xl">
          {result.success ? "✅ Good pronunciation!" : "❌ Try again!"}
        </p>
      )}
    </div>
  );
}
