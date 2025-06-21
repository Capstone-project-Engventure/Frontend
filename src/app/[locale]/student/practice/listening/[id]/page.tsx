"use client";

import LessonService from "@/lib/services/lesson.service";
import { Exercise } from "@/lib/types/exercise";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ListeningPracticeDetailPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [completedCount, setCompletedCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const lessonService = new LessonService();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem("current_lesson");
        let LessonData: any = {};

        if (stored) {
          try {
            LessonData = JSON.parse(stored);
            if (LessonData && LessonData.exercises?.length > 0) {
              setExercises(LessonData.exercise);
            }
          } catch (e) {
            console.error("Failed to parse lesson data from localStorage:", e);
          }
          setLoading(false);
          return;
        }

        const result = await lessonService.getById(Number(id));
        if (result.success) {
          const exercises = result.data?.exercises || [];
          setExercises(exercises);
        } else {
          console.error("Failed to load listening practice from API.");
          toast.error("Failed to load exercises");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading exercises");
      }
    };

    fetchData();
  }, [id]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;
  const progress =
    totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleOptionSelect = (optionKey: string) => {
    if (showResult) return;
    setSelectedOption(optionKey);
  };

  const handleExercise = () => {
    if (!selectedOption) {
      toast.warning("Please select an answer first!");
      return;
    }

    const correct = selectedOption === currentExercise.system_answer;
    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);

    if (correct) {
      setCompletedCount((prev) => prev + 1);
      toast.success("Correct! Well done!");
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      toast.error("Incorrect. Try again!");
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestion();
    } else {
      toast.success("Congratulations! You completed all exercises!");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getOptionStyle = (optionKey: string) => {
    const baseStyle =
      "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 hover:shadow-md font-medium";

    if (!showResult) {
      return `${baseStyle} ${selectedOption === optionKey
        ? "border-blue-500 bg-blue-50 shadow-md text-blue-700"
        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
        }`;
    }

    // Show results
    if (optionKey === currentExercise.system_answer) {
      return `${baseStyle} border-green-500 bg-green-50 text-green-800`;
    } else if (optionKey === selectedOption && !isCorrect) {
      return `${baseStyle} border-red-500 bg-red-50 text-red-800`;
    } else {
      return `${baseStyle} border-gray-200 bg-gray-100 text-gray-500`;
    }
  };

  const getOptionIcon = (optionKey: string) => {
    if (!showResult) return null;

    if (optionKey === currentExercise.system_answer) {
      return <span className="text-green-600 font-bold text-lg">✓</span>;
    } else if (optionKey === selectedOption && !isCorrect) {
      return <span className="text-red-600 font-bold text-lg">✗</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-gray-600 text-lg">No exercises available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-600 text-xl">✖</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-600 text-xl">⚙️</span>
            </button>
          </div>

          <div className="flex-1 mx-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentIndex + 1} of {totalExercises}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-red-500">
            <span className="text-2xl">❤️</span>
            <span className="font-bold text-lg">{hearts}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Exercise Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {currentExercise.level}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {currentExercise.skill}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {currentExercise.name}
            </span>
          </div>

          {/* Question */}
          {/* <h2 className="text-2xl font-bold mb-6 text-gray-800 leading-relaxed">
            {currentExercise.question}
          </h2> */}

          {/* Audio Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <audio
              ref={audioRef}
              // src={
              //   currentExercise.audio_file
              //     ? `${process.env.NEXT_PUBLIC_GCS_BASE_URL}${currentExercise.audio_file}`
              //     : currentExercise.audio_file_url
              // }
              src={`${process.env.NEXT_PUBLIC_GCS_BASE_URL}${currentExercise.audio_file}`}
              className="hidden"
            />
            <div className="flex items-center justify-center">
              <button
                onClick={handlePlay}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all duration-200 ${isPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  } shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <span className="text-xl">{isPlaying ? "⏸️" : "🔊"}</span>
                <span className="text-lg">
                  {isPlaying ? "Pause Audio" : "Play Audio"}
                </span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {Array.isArray(currentExercise.options) &&
              currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  className={getOptionStyle(option.key)}
                  onClick={() => handleOptionSelect(option.key)}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {option.key}
                      </span>
                      <span className="text-gray-800">{option.option}</span>
                    </div>
                    {getOptionIcon(option.key)}
                  </div>
                </button>
              ))}
          </div>

          {/* Explanation */}
          {showExplanation && currentExercise.explanation && (
            <div
              className={`p-4 rounded-xl border-l-4 ${isCorrect
                ? "bg-green-50 border-green-400"
                : "bg-red-50 border-red-400"
                }`}
            >
              <h3 className="font-semibold mb-2 text-gray-800">Explanation:</h3>
              <p className="text-gray-700">{currentExercise.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button className="px-4 py-2 border border-gray-400 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
              Can't listen now
            </button>
          </div>

          <div className="flex space-x-3">
            {!showResult ? (
              <button
                onClick={handleExercise}
                className="px-8 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 font-medium transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                Check Answer
              </button>
            ) : (
              <>
                {!isCorrect && (
                  <button
                    onClick={resetQuestion}
                    className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 font-medium transition-all duration-200"
                  >
                    Try Again
                  </button>
                )}
                {currentIndex < exercises.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                  >
                    Next Question →
                  </button>
                )}
                {currentIndex === exercises.length - 1 && (
                  <button className="px-8 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 font-medium transition-all duration-200">
                    Complete! 🎉
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
