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
  onSubmit: (data: Exercise) => void; // chỉ truyền 1 obj
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
      key: "",
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
      setExercises(newQuestions);
    }
  };

  const handleSubmit = () => {
    // Validation before submit
    if (exercises.length === 0) {
      alert("Vui lòng thêm ít nhất một câu hỏi!");
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
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
      if (!ex.system_answer) {
        alert(`Vui lòng chọn đáp án đúng cho câu hỏi ${i + 1}!`);
        return;
      }
    }

    exercises.forEach((ex) => (ex.lesson = "14"));
    const grammarData: Exercise[] = exercises;
    onSubmit(grammarData[0]);
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
    const newQuestions = [...exercises];
    if (newQuestions[qIndex] && newQuestions[qIndex].options && newQuestions[qIndex].options[correctIndex]) {
      newQuestions[qIndex].system_answer =
        newQuestions[qIndex].options[correctIndex].option;
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
                          checked={q.system_answer === opt.option}
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
