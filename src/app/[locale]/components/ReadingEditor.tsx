"use client";

import { Exercise, Option, Reading } from "@/lib/types/Reading";
import React, { useEffect, useState } from "react";

type Props = {
  initialData?: Reading;
  onSubmit: (data: Reading) => void;
  header: string;
};

const ReadingEditor: React.FC<Props> = ({ initialData, onSubmit, header }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
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
    id: Date.now(),         // hoặc một cách sinh id tạm thời
    name: '',               // giá trị mặc định
    question: '',
    options: [],
    system_answer: '',
    type: undefined,
    type_id: undefined,
    level: 'A1',
    skill: 'reading',
    image: null,
    lesson: null,
    generated_by: 'admin',
    description: '',
    explanation: '',
    audio_file: null,
    audio_file_url: '',
  };

  setExercises([...exercises, newExercise]);
};


  const addOption = (qIndex: number) => {
    debugger
    const newQuestions = [...exercises];
    const newOption: Option = {
      key: "",
      option: ""
    }
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
    const readingData: Reading = {
      id: initialData?.id!,
      title,
      content,
      exercises,
    };
    onSubmit(readingData);
  };

	const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
		const newQuestions = [...exercises];
		newQuestions[qIndex].system_answer = newQuestions[qIndex].options[correctIndex].option;
		setExercises(newQuestions);
	};

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {header}
      </h2>

      <div className="space-y-4">
        <label className="block font-semibold">Title:</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block font-semibold">Passage:</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

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

export default ReadingEditor;
