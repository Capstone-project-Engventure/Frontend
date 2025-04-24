// components/ExerciseCard.tsx
import React from 'react';

type Exercise = {
  id: string;
  name: string;
  question: string;
  description: string;
  options: Record<string, string> | string[] | null;
};

type ExerciseCardProps = {
  exercise: Exercise;
  index: number;
};

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const renderOptions = () => {
    if (!exercise.options) return null;

    // MCQ: object
    if (!Array.isArray(exercise.options)) {
      return (
        <ul className="space-y-1 mt-2">
          {Object.entries(exercise.options).map(([key, val]) => (
            <li key={key} className="flex items-center">
              <span className="w-5 h-5 border rounded-full flex items-center justify-center mr-2 text-xs">
                {key}
              </span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Ordering: array
    return (
      <ul className="space-y-1 mt-2 list-decimal list-inside">
        {exercise.options.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex rounded-md shadow-md overflow-hidden border border-gray-200 relative w-full ">
      {/* Left index */}
      <div className="bg-teal-500 text-white px-4 py-6 flex flex-col items-center justify-center w-[80px]">
        <span className="text-sm">Q</span>
        <span className="text-3xl font-bold">{index + 1}</span>
      </div>

      {/* Main content */}
      <div className="flex flex-col p-4 flex-1">
        <h3 className="font-semibold text-lg">{exercise.name}</h3>
        <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{exercise.question}</p>
        <p className="text-xs text-gray-500 mt-1 italic">{exercise.description}</p>
        {renderOptions()}
      </div>

      {/* Indicator icon, ví dụ dùng dot */}
      <div className="absolute top-2 right-2">
        <span className="bg-red-400 text-white text-xs px-2 py-1 rounded-full">●</span>
      </div>
    </div>
  );
}
