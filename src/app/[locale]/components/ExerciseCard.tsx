"use client";

import React, { useState } from "react";
import { Exercise } from "@/lib/types/exercise";
import {
  LuCheck as CheckCircle,
  LuVolume2 as Volume2,
  LuAward as Award,
  LuBookOpen as BookOpen,
  LuHeadphones as Headphones,
  LuFileText as FileText,
} from "react-icons/lu";

interface ExerciseCardProps {
  data?: Exercise;
  index?: number;
  isLoading?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  data,
  index = 0,
  isLoading = false,
}) => {
  const [isSelected, setSelected] = useState(false);
  const [isApproved, setApproved] = useState(false);

  // ---- SKELETON LOADING ----
  if (isLoading || !data) {
    return (
      <div className="animate-pulse bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 p-8">
        <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
      </div>
    );
  }

  const correctKey = data.system_answer;
  const rawOptions = data.options;
  const options =
    typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;

  const getTypeIcon = (typeName?: string) => {
    switch (typeName?.toLowerCase()) {
      case "listening":
        return <Headphones className="w-4 h-4" />;
      case "grammar":
        return <BookOpen className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "vocabulary":
        return <Award className="w-4 h-4" />;
      case "writing":
        return <FileText className="w-4 h-4" />;
      case "speaking":
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getTypeColor = (typeName?: string) => {
    switch (typeName?.toLowerCase()) {
      case "listening":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "grammar":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "reading":
        return "bg-green-100 text-green-700 border-green-200";
      case "vocabulary":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "writing":
        return "bg-red-100 text-red-700 border-red-200";
      case "speaking":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md">
              {index + 1}
            </div>
            <div
              className={`px-4 py-2 rounded-full border flex items-center space-x-2 font-medium text-sm ${getTypeColor(
                data.type?.name
              )}`}
            >
              {getTypeIcon(data.type?.name)}
              <span className="capitalize">{data.type?.name || "General"}</span>
            </div>
            <div className="flex space-x-2">
              <span className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 rounded-full border text-sm font-medium">
                {data.level || "N/A"}
              </span>
              <span className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 rounded-full border text-sm font-medium">
                {data.topic || "General"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => setSelected(!isSelected)}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                Select
              </span>
            </label>
            <button
              onClick={() => setApproved(!isApproved)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                isApproved
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300"
              }`}
            >
              {isApproved && <CheckCircle className="w-4 h-4" />}
              <span>{isApproved ? "Approved" : "Approve"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Reading Passage */}
        {data.type?.name === "reading" && data.reading ? (
          <div className="mb-6 p-6 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                Reading Passage
              </span>
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-3">
              {data.reading.title}
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {data.reading.content}
            </div>
          </div>
        ) : null}

        {/* Audio Question */}
        {data.type?.name === "listening" && data.audio_file_url ? (
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center space-x-3 mb-3">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">
                Audio Question
              </span>
            </div>
            <audio controls className="w-full">
              <source src={data.audio_file_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : null}

        {/* Description */}
        {data.description ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm font-medium">
              {data.description}
            </p>
          </div>
        ) : null}

        {/* Question */}
        <div className="mb-4">
          {data.question ? (
            <h3 className="text-lg font-semibold text-gray-800">
              {data.question}
            </h3>
          ) : (
            <p className="italic text-gray-500">Question is not available.</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options && options.length > 0 ? (
            options.map((opt) => {
              const isCorrect = opt.key === correctKey;
              return (
                <div
                  key={opt.key}
                  className={`relative rounded-xl border-2 p-5 transition-all duration-300 ${
                    isCorrect
                      ? "border-green-400 bg-green-50 shadow-md ring-2 ring-green-200"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span
                      className={`text-base ${
                        isCorrect
                          ? "text-green-800 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.option}
                    </span>
                  </div>
                  {isCorrect && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Correct</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="italic text-gray-500">No options provided.</p>
          )}
        </div>

        {/* Explanation */}
        {data.explanation ? (
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Explanation
                </h4>
                <p className="text-gray-700 leading-relaxed text-base">
                  {data.explanation}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ExerciseCard;
