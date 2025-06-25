"use client";

import { Exercise } from "@/lib/types/exercise";
import React, { useEffect, useState } from "react";
import {
  FaRegStickyNote,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSave,
  FaMicrophone,
  FaVolumeUp,
  FaUpload
} from "react-icons/fa";

interface Speaking {
  id?: number;
  lesson?: number;
  exercises: Exercise[];
}

type Props = {
  initialData?: Speaking;
  onSubmit: (data: Exercise) => void;
  header: string;
};

const SpeakingEditor: React.FC<Props> = ({ initialData, onSubmit, header }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [audioFiles, setAudioFiles] = useState<{ [key: number]: File | null }>({});

  useEffect(() => {
    if (initialData) {
      setExercises(
        (initialData.exercises || []).map((ex: Exercise) => ({
          ...ex,
          system_answer: ex.system_answer ?? "",
          type_id: ex.type_id !== undefined ? ex.type_id : 1,
          level: ex.level ?? "A1",
          skill: "speaking",
          options: [], // Speaking exercises don't have multiple choice options
        }))
      );
    }
  }, [initialData]);

  const handleNameChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].question = value;
    setExercises(newExercises);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].description = value;
    setExercises(newExercises);
  };

  const handleExplanationChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].explanation = value;
    setExercises(newExercises);
  };

  const handleLevelChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].level = value;
    setExercises(newExercises);
  };

  const handleAudioFileChange = (index: number, file: File | null) => {
    setAudioFiles(prev => ({
      ...prev,
      [index]: file
    }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: "",
      question: "",
      options: [], // No multiple choice options for speaking
      system_answer: "",
      type_id: 1,
      level: "A1",
      skill: "speaking",
      image: null,
      lesson: null,
      generated_by: "admin",
      description: "",
      explanation: "",
      audio_file_url: "",
    };

    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
    // Remove associated audio file
    const newAudioFiles = { ...audioFiles };
    delete newAudioFiles[index];
    setAudioFiles(newAudioFiles);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    // Validation before submit
    if (exercises.length === 0) {
      alert("Vui lòng thêm ít nhất một bài tập!");
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!(ex.name?.trim() ?? "")) {
        alert(`Vui lòng nhập tên cho bài tập ${i + 1}!`);
        return;
      }
      if (!(ex.question?.trim() ?? "")) {
        alert(`Vui lòng nhập nội dung cho bài tập ${i + 1}!`);
        return;
      }
      if (!(ex.description?.trim() ?? "")) {
        alert(`Vui lòng nhập mô tả cho bài tập ${i + 1}!`);
        return;
      }
    }

    // Submit the first exercise (since we're creating one exercise at a time)
    const speakingData: Exercise[] = exercises;
    onSubmit(speakingData[0]);
  };

  useEffect(() => {
    if (exercises.length === 0) {
      addExercise();
    }
  }, []);

  const levelOptions = [
    { value: "A1", label: "A1" },
    { value: "A2", label: "A2" },
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 mt-10">
      <div className="text-center border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{header}</h2>
        <p className="text-gray-600">Tạo và chỉnh sửa các bài tập nói</p>
      </div>

      <div className="space-y-6">
        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaMicrophone className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Chưa có bài tập nào
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy bắt đầu bằng cách thêm bài tập đầu tiên
            </p>
            <button
              onClick={addExercise}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              <FaPlus className="mr-2" />
              Thêm bài tập đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <label className="text-lg font-semibold text-gray-700">
                      Bài tập nói {index + 1}
                    </label>
                  </div>
                  <button
                    onClick={() => removeExercise(index)}
                    className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    <FaTrash className="mr-1" />
                    Xóa
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên bài tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ex.name || ""}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên bài tập..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ
                    </label>
                    <select
                      value={ex.level || "A1"}
                      onChange={(e) => handleLevelChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {levelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Câu nói / Đề bài <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={ex.question || ""}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập câu nói hoặc đề bài cho học viên luyện tập..."
                    />
                    {ex.question && (
                      <button
                        onClick={() => speakText(ex.question!)}
                        className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                        title="Nghe thử câu nói"
                      >
                        <FaVolumeUp className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả / Hướng dẫn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ex.description || ""}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập mô tả hoặc hướng dẫn cho bài tập..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giải thích / Gợi ý phát âm
                  </label>
                  <textarea
                    value={ex.explanation || ""}
                    onChange={(e) => handleExplanationChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập giải thích, gợi ý phát âm hoặc lưu ý cho bài tập..."
                  />
                </div>

                {/* Audio Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File audio mẫu (tuỳ chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioFileChange(index, e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {audioFiles[index] && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
                        <FaCheck className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          File audio: {audioFiles[index]?.name}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Tải lên file audio mẫu để học viên có thể nghe và luyện tập theo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center space-x-4 pt-6 border-t">
          <button
            onClick={addExercise}
            className="cursor-pointer bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center font-medium"
          >
            <FaPlus className="mr-2" />
            Thêm bài tập mới
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
          >
            <FaSave className="mr-2" />
            Lưu bài tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingEditor; 