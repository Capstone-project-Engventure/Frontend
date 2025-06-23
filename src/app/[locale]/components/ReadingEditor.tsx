"use client";

import { Reading } from "@/lib/types/reading";
import React, { useEffect, useState } from "react";
import { Exercise } from "@/lib/types/exercise";
import { Option } from "@/lib/types/index";
import { Plus, X, BookOpen, FileText, HelpCircle, Check } from "lucide-react";

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
      id: Date.now(),
      name: "",
      question: "",
      options: [
        { key: "A", option: "" },
        { key: "B", option: "" }
      ],
      system_answer: "",
      type_id: 1,
      level: "A1",
      skill: "reading",
      image: null,
      lesson: null,
      generated_by: "admin",
      description: "",
      explanation: "",
      audio_file_url: "",
    };

    setExercises([...exercises, newExercise]);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...exercises];
    const optionKeys = ["A", "B", "C", "D", "E", "F"];
    const nextKey = optionKeys[newQuestions[qIndex].options.length] || `Option ${newQuestions[qIndex].options.length + 1}`;
    
    const newOption: Option = {
      key: nextKey,
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
    newQuestions[qIndex].system_answer =
      newQuestions[qIndex].options[correctIndex].key;
    setExercises(newQuestions);
  };

  const getCorrectAnswerIndex = (qIndex: number) => {
    const question = exercises[qIndex];
    return question.options.findIndex(opt => opt.key === question.system_answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">{header}</h1>
          </div>
          <p className="text-gray-600">Create engaging reading passages with comprehension questions</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <label className="text-lg font-semibold text-gray-700">Reading Title</label>
            </div>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter an engaging title for your reading passage..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <label className="text-lg font-semibold text-gray-700">Reading Passage</label>
            </div>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 min-h-[200px] text-base leading-relaxed focus:border-blue-500 focus:outline-none transition-colors resize-y"
              placeholder="Write your reading passage here. Make it engaging and appropriate for the target level..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="text-sm text-gray-500 mt-2">
              Characters: {content.length} | Words: {content.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-700">Comprehension Questions</h2>
              </div>
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {exercises.map((q, qIndex) => (
                <div key={qIndex} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                        {qIndex + 1}
                      </div>
                      <span className="font-semibold text-gray-700">Question {qIndex + 1}</span>
                    </div>
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                  {/* Question Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your question here..."
                      value={q.question || ""}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                          {opt.key}
                        </div>
                        <input
                          type="text"
                          className="flex-1 border border-gray-200 rounded px-3 py-2 focus:border-blue-500 focus:outline-none"
                          placeholder={`Option ${opt.key}`}
                          value={opt.option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-answer-${qIndex}`}
                            checked={getCorrectAnswerIndex(qIndex) === oIndex}
                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                            className="w-4 h-4 text-green-600"
                          />
                          <Check className={`w-4 h-4 ${getCorrectAnswerIndex(qIndex) === oIndex ? 'text-green-600' : 'text-gray-300'}`} />
                          <button
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                            disabled={q.options.length <= 2}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Option Button */}
                  <button
                    onClick={() => addOption(qIndex)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded transition-colors"
                    disabled={q.options.length >= 6}
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </button>
                </div>
              ))}

              {exercises.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No questions yet</p>
                  <p>Click "Add Question" to create your first comprehension question</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={!title.trim() || !content.trim()}
            >
              <Check className="w-5 h-5" />
              Save Reading Passage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingEditor;
