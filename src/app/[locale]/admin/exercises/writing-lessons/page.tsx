"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import ExerciseService from "@/lib/services/exercise.service";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { Topic } from "@/lib/types/topic";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import useAdminWritingStore from "@/lib/store/adminWritingStore";
import ExerciseSelector from "@/app/[locale]/components/ExerciseSelector";

export default function AdminWritingLessons() {
  const router = useRouter();
  const pathname = usePathname();

  /* ──────────────────────── state ──────────────────────── */
  const { 
    lessons: writingLessons, 
    setLessons: setWritingLessons, 
    hasFetched, 
    setHasFetched,
    hasHydrated,
    addLesson,
    updateLesson,
    deleteLesson
  } = useAdminWritingStore();
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [writingTopics, setWritingTopics] = useState<OptionType[]>([]);
  const [lessons, setLessons] = useState<OptionType[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<OptionType[]>([]);

  const [topic, setTopic] = useState<OptionType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<OptionType | null>(null);

  // Exercise selector modal state
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');
  const [newLessonLevel, setNewLessonLevel] = useState('');
  const [newLessonTopic, setNewLessonTopic] = useState('');
  const [creatingLesson, setCreatingLesson] = useState(false);

  /* ──────────────────────── i18n / services ────────────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Exercises");
  const tWriting = useTranslations("Admin.WritingLessons");
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const lessonService = new LessonService();
  const exerciseTypeService = new ExerciseTypeService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    {
      label: tWriting("breadcrumbs.writingLessons"),
      href: `${locale}/admin/exercises/writing-lessons`,
    },
  ];

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.name") },
      { key: "level", label: t("fields.level") },
      { key: "description", label: t("fields.description") },
    ],
    [t]
  );

  const modalFields = useMemo(
    () => [
      { key: "title", label: t("fields.name"), type: "text", required: true },
      { key: "description", label: t("fields.description"), type: "textarea" },
      {
        key: "level",
        label: t("fields.level"),
        type: "select",
        options: LevelOptions,
        required: true
      },
      {
        key: "topic",
        label: t("fields.topic"),
        type: "select",
        options: writingTopics,
      },
      { key: "type", label: "Type", type: "hidden", default: "writing_practice" },
    ],
    [t, writingTopics]
  );

  const onPageChange = (page: number) => {
    setPage(page);
  };
  
  /* ──────────────────────── data fetches ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [tpRes, writingTpRes, lsRes, etRes] = await Promise.all([
          topicService.getAll(),
          topicService.getByCategory("writing"),
          lessonService.getAll(),
          exerciseTypeService.getAll(),
        ]);
        if (tpRes.success) {
          setTopics(
            tpRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error(tWriting("messages.fetchTopicsError"));

        if (writingTpRes.success && writingTpRes.data) {
          setWritingTopics(
            writingTpRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error(!writingTpRes.success ? writingTpRes.error || tWriting("messages.fetchWritingTopicsError") : tWriting("messages.fetchWritingTopicsError"));

        if (lsRes.success) {
          setLessons(
            lsRes.data.map((v: any) => ({ value: v.id, label: v.title }))
          );
        } else toast.error(tWriting("messages.fetchLessonsError"));
        if (etRes.success) {
          setExerciseTypes(
            etRes.data.map((v: any) => ({ value: v.id, label: v.name }))
          );
        } else toast.error(tWriting("messages.fetchExerciseTypesError"));
              } catch (e) {
        console.error(e);
        toast.error(tWriting("messages.networkError"));
      }
    })();
  }, []);

  const fetchLessons = useCallback(async () => {
    if (!hasHydrated || hasFetched) return;
    
    const filters: Record<string, unknown> = { type: "writing_practice" };
    if (selectedLesson) filters.lesson = selectedLesson.value;
    
    try {
      const res = await lessonService.getAll({ page, pageSize: 10, filters });
      if (res.success) {
        setWritingLessons(res.data);
        setTotalPage(res.pagination?.total_page || 1);
      } else {
        toast.error(tWriting("messages.fetchError"));
        setWritingLessons([]);
      }
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching writing lessons:", error);
      toast.error(tWriting("messages.networkErrorWhileFetching"));
      setWritingLessons([]);
      setHasFetched(true);
    }
  }, [hasHydrated, hasFetched, selectedLesson, page, setWritingLessons, setHasFetched]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  /* ──────────────────────── derived data ───────────────── */
  const lessonOptions = useMemo(() => {
    if (!topic) return lessons;
    return lessons.filter((l) => l.value === topic.value);
  }, [lessons, topic]);

  /* ──────────────────────── filter UI (passed down) ────── */
  const filterComponents = (
    <>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">{t("fields.topic")}</label>
        <CustomSelector
          objects={topics}
          value={topic}
          onChange={setTopic}
          placeholder={t("placeholders.topic")}
        />
      </div>
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium">
          {t("fields.lesson")}
        </label>
        <CustomSelector
          objects={lessonOptions}
          value={selectedLesson}
          onChange={setSelectedLesson}
          placeholder={t("placeholders.lesson")}
        />
      </div>
    </>
  );

  /* ──────────────────────── handle event in actions ────────────────────────*/
  const onEdit = useCallback((item: any) => {
    const newPath = `${pathname}/writing/${item.id}`;
    router.push(newPath);
  }, [pathname, router]);

  const onCreate = useCallback(() => {
    setShowExerciseSelector(true);
  }, []);

  const handleCreateLessonFromExercises = async () => {
    if (!newLessonTitle.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }

    setCreatingLesson(true);
    try {
      // Create lesson first
      const lessonData = {
        title: newLessonTitle.trim(),
        description: newLessonDescription.trim() || `Writing lesson with ${selectedExercises.length} exercises`,
        level: newLessonLevel,
        topic_id: newLessonTopic || null,
        type: "writing_practice"
      };

      const lessonResponse = await lessonService.create(lessonData);
      
      if (!lessonResponse.success) {
        toast.error(lessonResponse.error || "Failed to create lesson");
        return;
      }

      const createdLesson = lessonResponse.data;

      // Assign exercises to lesson
      const exerciseIds = selectedExercises.map(ex => ex.id).filter(id => id != null);
      
      if (exerciseIds.length > 0) {
        const { axiosInstance } = await import('@/lib/Api');
        const assignResponse = await axiosInstance.post('/exercises/assign-to-lesson', {
          exercise_ids: exerciseIds,
          lesson_id: createdLesson.id
        });

        if (assignResponse.status === 200 || assignResponse.status === 201) {
          toast.success(`Lesson "${newLessonTitle}" created with ${exerciseIds.length} exercises!`);
          
          // Add to store
          addLesson(createdLesson);
          
          // Reset form
          setShowExerciseSelector(false);
          setSelectedExercises([]);
          setNewLessonTitle('');
          setNewLessonDescription('');
          setNewLessonLevel('');
          setNewLessonTopic('');
          
          // Refresh lessons
          setHasFetched(false);
          fetchLessons();
        } else {
          toast.error(`Lesson created but failed to assign exercises: ${assignResponse.data?.error || 'Unknown error'}`);
        }
      }

    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("An error occurred while creating the lesson");
    } finally {
      setCreatingLesson(false);
    }
  };

  const handleAdd = async (data: any) => {
    try {
      // Ensure type is set if not present
      const lessonData = {
        ...data,
        type: data.type || "writing_practice"
      };
      
      const response = await lessonService.create(lessonData);
      if (response.success) {
        addLesson(response.data);
        toast.success(tWriting("messages.createSuccess"));
        return response;
      } else {
        toast.error(tWriting("messages.createError"));
        return response;
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error(tWriting("messages.networkErrorWhileCreating"));
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.update(numericId, data);
      if (response.success) {
        updateLesson(numericId, data);
        toast.success(tWriting("messages.updateSuccess"));
        return response;
      } else {
        toast.error(tWriting("messages.updateError"));
        return response;
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error(tWriting("messages.networkErrorWhileUpdating"));
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await lessonService.delete(numericId);
      if (response.success) {
        deleteLesson(numericId);
        toast.success(tWriting("messages.deleteSuccess"));
        return response;
      } else {
        toast.error(tWriting("messages.deleteError"));
        return response;
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error(tWriting("messages.networkErrorWhileDeleting"));
      throw error;
    }
  };

  // Custom actions for the table
  const customActions = (
    <button
      onClick={() => setShowExerciseSelector(true)}
      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Create from Exercises
    </button>
  );

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Writing Practice Lessons
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage writing lessons and create new ones from available exercises
              </p>
            </div>
            {customActions}
          </div>
          
          <AdvancedDataTable
            fields={fields}
            customObjects={writingLessons}
            customTotalPages={totalPage}
            page={page}
            onPageChange={onPageChange}
            modalFields={modalFields}
            modalTitle={tWriting("modalTitle")}
            linkBase={`/${locale}/admin/exercises/writing-lessons/writing`}
            hasCustomFetch={true}
            onCreate={() => {}} // Disable default create to use custom action
            onEdit={onEdit}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSuccess={() => {
              // Refresh the current page data without full refetch
              if (hasHydrated) {
                setHasFetched(false);
                fetchLessons();
              }
            }}
          />
        </div>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl mx-4 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Writing Lesson from Exercises
              </h3>
              <button
                onClick={() => setShowExerciseSelector(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Lesson Details Form */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Lesson Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter lesson title..."
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Level
                    </label>
                    <select
                      value={newLessonLevel}
                      onChange={(e) => setNewLessonLevel(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Level</option>
                      {LevelOptions.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topic (Optional)
                    </label>
                    <select
                      value={newLessonTopic}
                      onChange={(e) => setNewLessonTopic(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Topic</option>
                      {writingTopics.map(topic => (
                        <option key={topic.value} value={topic.value}>
                          {topic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newLessonDescription}
                      onChange={(e) => setNewLessonDescription(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter lesson description..."
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <div className="font-medium mb-1">Selected: {selectedExercises.length} exercises</div>
                    {selectedExercises.length > 0 && (
                      <div className="text-xs">
                        {selectedExercises.map((ex, idx) => ex.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Exercise Selector */}
              <ExerciseSelector
                skill="writing"
                selectedExercises={selectedExercises}
                onExerciseSelect={setSelectedExercises}
                maxSelection={20}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowExerciseSelector(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLessonFromExercises}
                disabled={!newLessonTitle.trim() || selectedExercises.length === 0 || creatingLesson}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  newLessonTitle.trim() && selectedExercises.length > 0 && !creatingLesson
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {creatingLesson ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Lesson...
                  </div>
                ) : (
                  `Create Lesson (${selectedExercises.length} exercises)`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 