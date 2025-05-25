"use client"
import { useEffect, useState } from "react";
import { ExerciseCard } from "@/app/[locale]/components/ExerciseCard";
import ExerciseService from "@/lib/services/exercise.service";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import { Exercise } from "@/lib/types/exercise";
import { ExerciseType } from "@/lib/types/exercise-type";

type Level = "beginner" | "intermediate" | "advanced";

export default function Grammar() {
  const exerciseService = new ExerciseService();
  const exerciseTypeService = new ExerciseTypeService();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<Level>("beginner");
  const [isLoading, setIsLoading] = useState(false);

  const levels: Level[] = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    const fetchExerciseTypes = async () => {
      try {
        const res = await exerciseTypeService.getAllExerciseTypes();
        if (res.success && Array.isArray(res.data)) {
          setExerciseTypes(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch exercise types:", err);
      }
    };

    fetchExerciseTypes();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const typeFilter = selectedType ? `type:${selectedType}` : "";
        const levelFilter = `level:${selectedLevel}`;
        const keyword = [typeFilter, levelFilter].filter(Boolean).join(" ");
        const res = await exerciseService.getAllExercises(1, 10, keyword);
        if (res.success) {
          setExercises(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch exercises:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [selectedType, selectedLevel]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-2">
          Select Grammar Type
        </label>
        <select
          id="exerciseType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Types</option>
          {exerciseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Levels">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  selectedLevel === level
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {isLoading ? (
        <div className="text-center">Loading exercises...</div>
      ) : exercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {exercises.map((exercise, idx) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No exercises found</div>
      )}
    </div>
  );
}

