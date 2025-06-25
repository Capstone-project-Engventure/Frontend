"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { useDeployExercise } from "@/lib/hooks/useDeployExercise";
import ExerciseCard from "@/app/[locale]/components/ExerciseCard";
import { Exercise } from "@/lib/types/exercise";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";

export default function DeployedExercisesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("DeployedExercises");

  const {
    loading,
    error,
    getPublishedExercises,
    unpublishExercises,
    getDeploymentStats,
    getAllLessons
  } = useDeployExercise();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  
  // Filters
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [lessonFilter, setLessonFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const breadcrumbs = [
    {
      label: "Trang chủ",
      href: `/${locale}/admin/home`,
    },
    {
      label: "Bài tập đã triển khai",
      href: `/${locale}/admin/deployed-exercises`,
    },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exercisesResult, statsResult, lessonsResult] = await Promise.all([
          getPublishedExercises(),
          getDeploymentStats(),
          getAllLessons()
        ]);

        if (exercisesResult) {
          setExercises(Array.isArray(exercisesResult) ? exercisesResult : [exercisesResult]);
        }
        
        if (statsResult) {
          setStats(statsResult);
        }
        
        if (lessonsResult) {
          setLessons(Array.isArray(lessonsResult) ? lessonsResult : [lessonsResult]);
        }
      } catch (error) {
        console.error("Error fetching deployed exercises:", error);
        toast.error("Failed to load deployed exercises");
      }
    };

    fetchData();
  }, []);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSkill = !skillFilter || exercise.skill === skillFilter;
      const matchesLevel = !levelFilter || exercise.level === levelFilter;
      const matchesLesson = !lessonFilter || exercise.lesson === lessonFilter;
      const matchesSearch = !searchQuery || 
        exercise.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.question?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSkill && matchesLevel && matchesLesson && matchesSearch;
    });
  }, [exercises, skillFilter, levelFilter, lessonFilter, searchQuery]);

  // Handlers
  const handleSelectExercise = (exercise: Exercise, isSelected: boolean) => {
    if (isSelected) {
      setSelectedExercises(prev => [...prev, exercise]);
    } else {
      setSelectedExercises(prev => prev.filter(ex => ex.id !== exercise.id));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedExercises(filteredExercises);
    } else {
      setSelectedExercises([]);
    }
  };

  const handleUnpublish = async () => {
    if (selectedExercises.length === 0) {
      toast.warning("Please select exercises to unpublish");
      return;
    }

    try {
      const exerciseIds = selectedExercises
        .filter(ex => ex.id)
        .map(ex => ex.id as number);

      await unpublishExercises(exerciseIds);
      
      // Remove unpublished exercises from the list
      setExercises(prev => prev.filter(ex => !exerciseIds.includes(ex.id as number)));
      setSelectedExercises([]);
      
      toast.success(`Unpublished ${exerciseIds.length} exercises`);
    } catch (error) {
      toast.error("Failed to unpublish exercises");
    }
  };

  const handleRefresh = async () => {
    try {
      const result = await getPublishedExercises();
      if (result) {
        setExercises(Array.isArray(result) ? result : [result]);
        toast.success("Data refreshed");
      }
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Deployed Exercises
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage exercises that are currently available to students.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Published</div>
            <div className="text-2xl font-bold text-blue-900">{stats.totalPublished || 0}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">Active Lessons</div>
            <div className="text-2xl font-bold text-green-900">{stats.activeLessons || 0}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-600 text-sm font-medium">Total Students</div>
            <div className="text-2xl font-bold text-purple-900">{stats.totalStudents || 0}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-orange-600 text-sm font-medium">Completions</div>
            <div className="text-2xl font-bold text-orange-900">{stats.totalCompletions || 0}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skill
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Skills</option>
              {SkillOptions.map((skill) => (
                <option key={skill.value} value={skill.value}>
                  {skill.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Levels</option>
              {LevelOptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lesson
            </label>
            <select
              value={lessonFilter}
              onChange={(e) => setLessonFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Lessons</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSkillFilter("");
                setLevelFilter("");
                setLessonFilter("");
                setSearchQuery("");
              }}
              className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Published Exercises ({filteredExercises.length})
            </h3>
            {selectedExercises.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {selectedExercises.length} selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectAll(selectedExercises.length === 0)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {selectedExercises.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selectedExercises.length > 0 && (
              <button
                onClick={handleUnpublish}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Unpublish Selected
              </button>
            )}
          </div>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {exercises.length === 0 ? "No published exercises found." : "No exercises match the current filters."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExercises.map((exercise, index) => {
              const isSelected = selectedExercises.some(ex => ex.id === exercise.id);

              return (
                <div key={exercise.id || index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectExercise(exercise, e.target.checked)}
                    className="mt-4 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <ExerciseCard
                      data={exercise}
                      index={index}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ✓ Published
                      </span>
                      {exercise.lesson && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Lesson: {lessons.find(l => l.id === exercise.lesson)?.title || exercise.lesson}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 