"use client";

import { Exercise } from "@/lib/types/exercise";

interface Writing {
  id?: number;
  lesson?: number;
  exercises: Exercise[];
}
import React, { useEffect, useState } from "react";
import {
  FaRegStickyNote,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSave,
  FaPencilAlt,
} from "react-icons/fa";

type Props = {
  initialData?: Writing;
  onSubmit: (data: Exercise) => void;
  header: string;
};

const WritingEditor: React.FC<Props> = ({ initialData, onSubmit, header }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (initialData) {
      setExercises(
        (initialData.exercises || []).map((ex: Exercise) => ({
          ...ex,
          system_answer: ex.system_answer ?? "",
          type_id: ex.type_id !== undefined ? ex.type_id : 1,
          level: ex.level ?? "A1",
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

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: "",
      question: "",
      options: [],
      system_answer: "",
      type_id: 1,
      level: "A1",
      skill: "writing",
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

    const writingData: Exercise[] = exercises;
    onSubmit(writingData[0]);
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
        <p className="text-gray-600">Tạo và chỉnh sửa các bài tập viết</p>
      </div>

      <div className="space-y-6">
        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaPencilAlt className="text-gray-400 text-6xl mb-4 mx-auto" />
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
                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <label className="text-lg font-semibold text-gray-700">
                      Bài tập {index + 1}
                    </label>
                  </div>
                  <button
                    onClick={() => removeExercise(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    <FaTrash className="mr-1" />
                    Xóa
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên bài tập
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
                    Nội dung bài tập / Đề bài
                  </label>
                  <textarea
                    value={ex.question || ""}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập nội dung bài tập hoặc đề bài..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả / Hướng dẫn
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
                    Giải thích / Gợi ý
                  </label>
                  <textarea
                    value={ex.explanation || ""}
                    onChange={(e) => handleExplanationChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập giải thích hoặc gợi ý cho bài tập..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center space-x-4 pt-6 border-t">
          <button
            onClick={addExercise}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center font-medium"
          >
            <FaPlus className="mr-2" />
            Thêm bài tập mới
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
          >
            <FaSave className="mr-2" />
            Lưu bài tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingEditor; 