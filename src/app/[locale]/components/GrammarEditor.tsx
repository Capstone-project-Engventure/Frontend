"use client";

import { Grammar } from "@/lib/types/Grammar";
import { Reading } from "@/lib/types/reading";
import { Exercise } from "@/lib/types/exercise";
import { Option } from "@/lib/types/index";
import React, { useEffect, useState } from "react";
import {
  FaRegStickyNote,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaSave,
} from "react-icons/fa";
type Props = {
  initialData?: Grammar;
  onSubmit: (data: Exercise[]) => void; // chỉ truyền 1 obj
  header: string;
};

const GrammarEditor: React.FC<Props> = ({ initialData, onSubmit, header }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (initialData) {
      setExercises(
        (initialData.exercises || []).map((ex) => ({
          ...ex,
          system_answer: ex.system_answer ?? "",
          type_id: ex.type_id !== undefined ? ex.type_id : 1, // fallback or handle as needed
          level: ex.level ?? "A1", // ensure level is always a string
        }))
      );
    }
  }, [initialData]);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...exercises];
    newQuestions[index].question = value;
    setExercises(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...exercises];
    if (newQuestions[qIndex] && newQuestions[qIndex].options) {
      newQuestions[qIndex].options[oIndex].option = value;
      setExercises(newQuestions);
    }
  };

  // Kiểm tra xem có options trùng lặp không
  const hasDuplicateOptions = (options: Option[]) => {
    const optionValues = options.map(opt => opt.option.trim().toLowerCase()).filter(val => val !== '');
    const uniqueOptions = new Set(optionValues);
    return uniqueOptions.size !== optionValues.length;
  };

  const addQuestion = () => {
    const newExercise: Exercise = {
      id: Date.now(), // hoặc một cách sinh id tạm thời
      name: "", // giá trị mặc định
      question: "",
      options: [],
      system_answer: "",
      // type: 1,
      type_id: 1,
      level: "A1",
      skill: "grammar",
      image: null,
      lesson: null,
      generated_by: "admin",
      description: "",
      explanation: "",
      // audio_file: null,
      audio_file_url: "",
    };

    setExercises([...exercises, newExercise]);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...exercises];
    if (!newQuestions[qIndex].options) {
      newQuestions[qIndex].options = [];
    }
    const newOption: Option = {
      key: String.fromCharCode(65 + newQuestions[qIndex].options.length), // A, B, C, D...
      option: "",
    };
    newQuestions[qIndex].options.push(newOption);
    setExercises(newQuestions);
  };

  const removeQuestion = (qIndex: number) => {
    setExercises(exercises.filter((_, i) => i !== qIndex));
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...exercises];
    if (newQuestions[qIndex] && newQuestions[qIndex].options) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      // Reassign keys after removing
      newQuestions[qIndex].options.forEach((opt, index) => {
        opt.key = String.fromCharCode(65 + index);
      });
      setExercises(newQuestions);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newQuestions = [...exercises];
    newQuestions[index].name = value;
    setExercises(newQuestions);
  };

  const handleExplanationChange = (index: number, value: string) => {
    const newQuestions = [...exercises];
    newQuestions[index].explanation = value;
    setExercises(newQuestions);
  };

  const handleSubmit = () => {
    // Validation before submit
    if (exercises.length === 0) {
      alert("Vui lòng thêm ít nhất một câu hỏi!");
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!(ex.name?.trim() ?? "")) {
        alert(`Vui lòng nhập tên cho câu hỏi ${i + 1}!`);
        return;
      }
      if (!(ex.question?.trim() ?? "")) {
        alert(`Vui lòng nhập câu hỏi ${i + 1}!`);
        return;
      }
      if (!ex.options || ex.options.length < 2) {
        alert(`Câu hỏi ${i + 1} cần ít nhất 2 lựa chọn!`);
        return;
      }
      if (ex.options.some((opt) => !opt.option.trim())) {
        alert(`Vui lòng điền đầy đủ các lựa chọn cho câu hỏi ${i + 1}!`);
        return;
      }
      
      // Kiểm tra các câu trả lời phải khác nhau
      const optionValues = ex.options.map(opt => opt.option.trim().toLowerCase());
      const uniqueOptions = new Set(optionValues);
      if (uniqueOptions.size !== optionValues.length) {
        alert(`Câu hỏi ${i + 1} có các lựa chọn trùng lặp. Vui lòng đảm bảo các lựa chọn khác nhau!`);
        return;
      }
      
      // Kiểm tra có ít nhất 2 options khác nhau
      if (uniqueOptions.size < 2) {
        alert(`Câu hỏi ${i + 1} cần ít nhất 2 lựa chọn khác nhau!`);
        return;
      }
      
      if (!ex.system_answer) {
        alert(`Vui lòng chọn đáp án đúng cho câu hỏi ${i + 1}!`);
        return;
      }
      if (!(ex.explanation?.trim() ?? "")) {
        alert(`Vui lòng nhập giải thích cho câu hỏi ${i + 1}!`);
        return;
      }
    }

    const grammarData: Exercise[] = exercises;
    onSubmit(grammarData);
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
    const newQuestions = [...exercises];
    if (newQuestions[qIndex] && newQuestions[qIndex].options && newQuestions[qIndex].options[correctIndex]) {
      newQuestions[qIndex].system_answer =
        newQuestions[qIndex].options[correctIndex].key;
      setExercises(newQuestions);
    }
  };

  useEffect(() => {
    if (exercises.length === 0) {
      addQuestion();
    }
  }, []);
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 mt-10">
      <div className="text-center border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{header}</h2>
        <p className="text-gray-600">Tạo và chỉnh sửa các câu hỏi ngữ pháp</p>
      </div>

      <div className="space-y-6">
        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaRegStickyNote className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Chưa có câu hỏi nào
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy bắt đầu bằng cách thêm câu hỏi đầu tiên
            </p>
            <button
              onClick={addQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              <FaPlus className="mr-2" />
              Thêm câu hỏi đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border-2 border-gray-200 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                      {qIndex + 1}
                    </div>
                    <label className="text-lg font-semibold text-gray-700">
                      Câu hỏi {qIndex + 1}
                    </label>
                  </div>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    <FaTrash className="mr-1" />
                    Xóa
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên bài tập: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="Nhập tên bài tập..."
                    value={q.name ?? ""}
                    onChange={(e) =>
                      handleNameChange(qIndex, e.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung câu hỏi: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
                    rows={3}
                    placeholder="Nhập nội dung câu hỏi..."
                    value={q.question ?? ""}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Các lựa chọn: <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      Chọn đáp án đúng bằng cách click vào nút radio
                    </span>
                  </div>

                  {hasDuplicateOptions(q.options || []) && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">
                          Cảnh báo: Có các lựa chọn trùng lặp. Vui lòng đảm bảo các lựa chọn khác nhau.
                        </span>
                      </div>
                    </div>
                  )}

                  {(q.options || []).map((opt, oIndex) => (
                    <div
                      key={oIndex}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                        {opt.key || String.fromCharCode(65 + oIndex)}
                      </div>
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        placeholder={`Lựa chọn ${String.fromCharCode(
                          65 + oIndex
                        )}...`}
                        value={opt.option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-answer-${qIndex}`}
                          checked={q.system_answer === opt.key}
                          onChange={() =>
                            handleCorrectAnswerChange(qIndex, oIndex)
                          }
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <FaCheck className="text-green-600" />
                      </div>
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center"
                        title="Xóa lựa chọn"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(qIndex)}
                    className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" />
                    Thêm lựa chọn
                  </button>
                </div>

                {q.system_answer && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <FaCheck className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Đáp án đúng: {q.system_answer}
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giải thích: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
                    rows={3}
                    placeholder="Nhập giải thích cho câu trả lời đúng..."
                    value={q.explanation ?? ""}
                    onChange={(e) =>
                      handleExplanationChange(qIndex, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={addQuestion}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
              >
                <FaPlus className="mr-2" />
                Thêm câu hỏi mới
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-600">
          Tổng số câu hỏi:{" "}
          <span className="font-semibold">{exercises.length}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={exercises.length === 0}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg flex items-center"
        >
          <FaSave className="mr-2" />
          Lưu bài tập
        </button>
      </div>
    </div>
  );
};

export default GrammarEditor;
