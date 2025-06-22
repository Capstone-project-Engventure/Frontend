"use client";

import React, { use, useState, useRef, useEffect, useCallback } from "react";

import {
  LuPlay as Play,
  LuMic as Mic,
  LuMicOff as MicOff,
  LuRotateCcw as RotateCcw,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuVolume2 as Volume2,
} from "react-icons/lu";

import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/[locale]/components/ui/Button";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import { toast } from "react-toastify";

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

const exercises = [
  {
    id: 1,
    name: "Food Phrase 2",
    question: "Could I see the menu please?",
    system_answer:
      "IPA: /kʊd aɪ siː ðə ˈmɛnjuː pliːz/ – chú trọng âm nhẹ 'menu'",
    description: "Luyện phát âm câu yêu cầu xem thực đơn",
    explanation: "Luyện nhấn âm chính trong câu lịch sự.",
  },
  {
    id: 2,
    name: "Food Phrase 3",
    question: "The food is delicious",
    system_answer: "IPA: /ðə fuːd ɪz dɪˈlɪʃəs/ – nhấn 'lish' trong 'delicious'",
    description: "Phát âm câu khen món ăn ngon",
    explanation: "Thực hành nhấn âm trọng trong 'delicious'.",
  },
  {
    id: 3,
    name: "Food Phrase 4",
    question: "Where is the nearest restaurant?",
    system_answer:
      "IPA: /wɛər ɪz ðə ˈnɪərɪst ˈrɛstrɒnt/ – nhấn 'nearest' và 'restaurant'",
    description: "Luyện phát âm câu hỏi tìm nhà hàng gần nhất",
    explanation: "Thực hành âm đôi 'au' trong 'restaurant'.",
  },
  {
    id: 4,
    name: "Food Phrase 5",
    question: "I would like to try the local cuisine",
    system_answer:
      "IPA: /aɪ wʊd laɪk tuː traɪ ðə ˈloʊkəl kwɪˈziːn/ – nhấn 'local' và 'cuisine'",
    description: "Phát âm câu bày tỏ mong muốn thử ẩm thực địa phương",
    explanation: "Luyện nhấn kết hợp 'kwɪˈziːn'.",
  },
  {
    id: 5,
    name: "Food Phrase 6",
    question: "May I have the bill, please?",
    system_answer: "IPA: /meɪ aɪ hæv ðə bɪl pliːz/ – nhấn 'bill'",
    description: "Phát âm câu hỏi xin thanh toán",
    explanation: "Thực hành câu lịch sự kết thúc bằng 'please'.",
  },
  {
    id: 6,
    name: "Food Phrase 7",
    question: "Is there a vegetarian option?",
    system_answer: "IPA: /ɪz ðɛər ə ˌvɛdʒəˈtɛəriən ˈɒpʃən/ – nhấn 'vegetarian'",
    description: "Luyện phát âm câu hỏi về lựa chọn ăn chay",
    explanation: "Thực hành nối âm trong 'vegetarian option'.",
  },
  {
    id: 7,
    name: "Food Phrase 8",
    question: "This soup is too salty",
    system_answer: "IPA: /ðɪs suːp ɪz tuː ˈsɔːlti/ – nhấn 'salty'",
    description: "Phát âm câu nhận xét món ăn mặn",
    explanation: "Luyện nhấn 'too salty'.",
  },
  {
    id: 8,
    name: "Food Phrase 9",
    question: "Can I get a doggy bag?",
    system_answer: "IPA: /kæn aɪ ɡɛt ə ˈdɒɡi bæɡ/ – nhấn 'doggy bag'",
    description: "Luyện phát âm câu xin đựng thức ăn thừa",
    explanation: "Thực hành nhấn 'doggy bag'.",
  },
  {
    id: 9,
    name: "Food Phrase 10",
    question: "Do you accept credit cards?",
    system_answer: "IPA: /duː juː ækˈsɛpt ˈkrɛdɪt kɑːdz/ – nhấn 'accept'",
    description: "Phát âm câu hỏi thanh toán bằng thẻ",
    explanation: "Luyện nhấn 'credit cards'.",
  },
  {
    id: 10,
    name: "Food Phrase 11",
    question: "I'm allergic to peanuts",
    system_answer: "IPA: /aɪm əˈlɜːdʒɪk tuː ˈpiːnʌts/ – nhấn 'allergic'",
    description: "Luyện phát âm câu báo dị ứng",
    explanation: "Thực hành trọng âm trên 'allergic'.",
  },
  {
    id: 12,
    name: "Food Phrase 12",
    question: "The coffee is too hot to drink",
    system_answer: "IPA: /ðə ˈkɒfi ɪz tuː hɒt tuː drɪŋk/ – nhấn 'coffee'",
    description: "Phát âm câu nhận xét nhiệt độ đồ uống",
    explanation: "Luyện nối âm giữa 'hot to'.",
  },
  {
    id: 13,
    name: "Food Phrase 13",
    question: "Could you recommend a dessert?",
    system_answer: "IPA: /kʊd juː rɛkəˈmɛnd ə dɪˈzɜːrt/ – nhấn 'dessert'",
    description: "Luyện phát âm câu hỏi đề xuất món tráng miệng",
    explanation: "Thực hành trọng âm cuối từ 'dessert'.",
  },
  {
    id: 14,
    name: "Food Phrase 14",
    question: "I prefer my steak well done",
    system_answer:
      "IPA: /aɪ prɪˈfɜː maɪ steɪk wɛl dʌn/ – nhấn 'pref êr' và 'done'",
    description: "Phát âm câu chọn mức chín của bít tết",
    explanation: "Luyện nhấn 'well done'.",
  },
  {
    id: 15,
    name: "Food Phrase 15",
    question: "The service was excellent",
    system_answer:
      "IPA: /ðə ˈsɜːvɪs wɒz ˈɛksələnt/ – nhấn 'service' và 'excellent'",
    description: "Luyện phát âm câu khen dịch vụ",
    explanation: "Thực hành nhịp điệu câu khen.",
  },
];

const VAD_CONFIG = {
  silenceThreshold: 0.01, // Ngưỡng im lặng
  speechThreshold: 0.02, // Ngưỡng phát hiện giọng nói
  silenceTimeout: 2000, // 2 giây im lặng thì dừng
  minSpeechDuration: 500, // Tối thiểu 0.5 giây mới được coi là nói
  maxRecordingTime: 30000, // Tối đa 30 giây
};

export default function SpeakingPracticeDetailPage() {
  const router = useRouter();
  const locale = useLocale();

  const { id } = useParams();
  const exerciseService = new ExerciseService();
  const lessonService = new LessonService();
  const [exercises, setExercises] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [vadState, setVadState] = useState("idle"); // 'idle', 'detecting', 'speaking', 'silence'
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [result, setResult] = useState<any>(null);
  type HistoryItem = {
    id: number;
    audioBlob: Blob;
    result: any;
  };
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef(null);
  const playbackRef = useRef(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const vadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("current_lesson");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTitle(parsed.title || "");
        setDescription(parsed.description || "");
      } catch (e) {
        console.error("Failed to parse reading data from localStorage.");
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await lessonService.getById(Number(id));
      if (result.success) {
        const exercises = result.data?.exercises || [];
        setExercises(exercises);
      } else {
        console.error("Failed to load reading practice from API.");
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const currentExercise =
    Array.isArray(exercises) && exercises.length > 0
      ? exercises[currentIndex]
      : null;

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (vadTimerRef.current) {
      clearTimeout(vadTimerRef.current);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  // Audio level analysis
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) for audio level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += (dataArray[i] / 255) * (dataArray[i] / 255);
    }
    const rms = Math.sqrt(sum / bufferLength);
    setAudioLevel(rms);

    // VAD Logic
    if (isRecording) {
      if (rms > VAD_CONFIG.speechThreshold) {
        // Speech detected
        if (vadState === "detecting" || vadState === "idle") {
          setVadState("speaking");
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
      } else if (rms < VAD_CONFIG.silenceThreshold) {
        // Silence detected
        if (vadState === "speaking") {
          setVadState("silence");
          // Bắt đầu đếm thời gian im lặng
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              stopRecording();
            }, VAD_CONFIG.silenceTimeout);
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [isRecording, vadState]);

  // Setup audio context and analyzer
  const setupAudioAnalysis = async (stream:any) => {
    try {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as any).webkitAudioContext
      )();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();

      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;

      source.connect(analyserRef.current);

      // Start analyzing
      analyzeAudio();
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  };

  // Start recording with VAD
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Setup audio analysis for VAD
      await setupAudioAnalysis(stream);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        cleanup();

        try {
          // Create a File object from the blob for the API
          const audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
          
          // Gửi audio blob kèm câu cần phát âm lên server
          const result = await exerciseService.checkPronunciation({
            audio: audioFile,
            exercise: currentExercise?.id || "",
          });
          setResult(result.data);
          setHistory((prev) => [
            {
              id: Date.now(), // hoặc response.id nếu backend trả về ID submission
              audioBlob: blob,
              result: result.data,
            },
            ...prev,
          ]);
          console.log("Check result:", result); // hoặc set state để hiển thị kết quả
          // TODO: setState hoặc feedback cho UI
        } catch (error) {
          console.error("Pronunciation check failed:", error);
          toast.error("Pronunciation check failed");
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setVadState("detecting");
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Auto stop after max time
      vadTimerRef.current = setTimeout(() => {
        stopRecording();
      }, VAD_CONFIG.maxRecordingTime);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVadState("idle");
      setAudioLevel(0);
      setRecordingDuration(0);
      cleanup();
    }
  };

  // Play text using speech synthesis
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Navigation functions
  const nextExercise = () => {
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
    setShowAnswer(false);
    setAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const prevExercise = () => {
    setCurrentIndex((prev) => (prev - 1 + exercises.length) % exercises.length);
    setShowAnswer(false);
    setAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const resetExercise = () => {
    setAudioBlob(null);
    setShowAnswer(false);
    setVadState("idle");
    setAudioLevel(0);
    if (isRecording) stopRecording();
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Get VAD status display
  const getVADStatusDisplay = () => {
    switch (vadState) {
      case "detecting":
        return { text: "🎤 Sẵn sàng - Hãy nói...", color: "text-blue-500" };
      case "speaking":
        return { text: "🗣️ Đang ghi âm...", color: "text-green-500" };
      case "silence":
        return { text: "⏳ Im lặng phát hiện...", color: "text-yellow-500" };
      default:
        return { text: "⭕ Chưa bắt đầu", color: "text-gray-500" };
    }
  };
  const vadStatus = getVADStatusDisplay();

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Đang tải bài luyện nói...</p>
      </div>
    );
  }

  // from-blue-50 to-indigo-100
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br  p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎯 {title}
            </h1>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Bài {currentIndex + 1} / {exercises.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentIndex + 1) / exercises.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / exercises.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Main Exercise Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            {/* Exercise Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentExercise.name}
              </h2>
              <p className="text-gray-600">{currentExercise.description}</p>
            </div>

            {/* Question Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                  "{currentExercise.question}"
                </h3>

                {/* Play Audio Button */}
                <button
                  onClick={() => speakText(currentExercise.question)}
                  disabled={isPlaying}
                  className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isPlaying
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white hover:scale-105"
                  }`}
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  {isPlaying ? "Đang phát..." : "Nghe mẫu"}
                </button>
              </div>
            </div>
            {/* VAD Status Display */}
            {isRecording && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className={`font-medium ${vadStatus.color}`}>
                    {vadStatus.text}
                  </div>
                  <div className="text-sm text-gray-500">
                    {recordingDuration}s
                  </div>
                </div>

                {/* Audio Level Visualization */}
                <div className="mt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Âm thanh:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-100 ${
                          audioLevel > VAD_CONFIG.speechThreshold
                            ? "bg-green-500"
                            : audioLevel > VAD_CONFIG.silenceThreshold
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                        style={{
                          width: `${Math.min(100, audioLevel * 500)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recording Controls */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-6 h-6 mr-3" />
                      Dừng ghi âm
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6 mr-3" />
                      Bắt đầu ghi âm
                    </>
                  )}
                </button>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <div className="text-red-500 font-medium">
                  🔴 Đang ghi âm... Hãy nói câu trên!
                </div>
              )}

              {/* Playback Controls */}
              {audioBlob && (
                <div className="mt-4">
                  <button
                    onClick={playRecording}
                    className="inline-flex items-center px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Nghe lại
                  </button>
                </div>
              )}
            </div>

            {/* Kết quả đánh giá mới nhất */}
            {result && (
              <div className="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  ✅ Kết quả đánh giá phát âm
                </h3>
                <p className="text-gray-700 mb-2">
                  Điểm số:{" "}
                  <span className="font-bold text-lg">{result.grade}/10</span>
                </p>
                {result.note?.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {result.note.map((n: any, i: number) => (
                      <div key={i} className="text-sm text-gray-600 mb-1">
                        • {n}
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Lịch sử ghi âm */}
            {history.length > 0 && (
              <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                  🕘 Lịch sử ghi âm
                </h3>
                <ul className="space-y-4">
                  {history.map((h, idx) => (
                    <li
                      key={h.id}
                      className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-700">
                          Lần {history.length - idx}
                        </p>
                        <p className="text-sm text-gray-500">
                          Điểm:{" "}
                          <span className="font-semibold">
                            {h.result.grade}/10
                          </span>
                        </p>
                      </div>
                      <audio controls className="w-48">
                        <source
                          src={URL.createObjectURL(h.audioBlob)}
                          type="audio/webm"
                        />
                        Trình duyệt không hỗ trợ.
                      </audio>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Answer Section */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
              >
                {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
              </button>

              {showAnswer && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                  <div className="text-left">
                    <p className="font-mono text-lg text-gray-800 mb-2">
                      {currentExercise.system_answer}
                    </p>
                    <p className="text-gray-600 italic">
                      {currentExercise.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevExercise}
              className="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Bài trước
            </button>

            <button
              onClick={resetExercise}
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Làm lại
            </button>

            <button
              onClick={nextExercise}
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              Bài tiếp
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p>💡 Mẹo: Nghe mẫu trước, sau đó ghi âm và so sánh với đáp án!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
