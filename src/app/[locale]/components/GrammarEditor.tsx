"use client";

import { Grammar } from "@/lib/types/Grammar";
import { Reading } from "@/lib/types/reading";
import { Exercise } from "@/lib/types/exercise";
import { Option } from "@/lib/types/index";
import React, { useEffect, useState } from "react";

type Props = {
  initialData?: Grammar;
  onSubmit: (data: Exercise) => void; // chỉ truyền 1 obj
  header: string;
};

const GrammarEditor: React.FC<Props> = ({ initialData, onSubmit, header }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (initialData) {
      setExercises(initialData.exercises || []);
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
    newQuestions[qIndex].options[oIndex].option = value;
    setExercises(newQuestions);
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
    newQuestions[qIndex].options.splice(oIndex, 1);
    setExercises(newQuestions);
  };

  const handleSubmit = () => {
    exercises.forEach((ex) => (ex.lesson = 14));
    const grammarData: Exercise[] = exercises;
    onSubmit(grammarData[0]);
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
    const newQuestions = [...exercises];
    newQuestions[qIndex].system_answer =
      newQuestions[qIndex].options[correctIndex].option;
    setExercises(newQuestions);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 text-center">{header}</h2>

      <div className="space-y-4">
        <div className="space-y-6">
          {exercises.map((q, qIndex) => (
            <div key={qIndex} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <label className="font-semibold">Question {qIndex + 1}:</label>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-1 mt-1"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              <div className="mt-3 space-y-2">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-1"
                      value={opt.option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name={`correct-answer-${qIndex}`}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    />
                    <span className="text-sm text-gray-600">Correct</span>

                    <button
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className="text-sm text-blue-600 mt-2"
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="text-sm text-blue-700 hover:underline"
          >
            + Add Question
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GrammarEditor;
