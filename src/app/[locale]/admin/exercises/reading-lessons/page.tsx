"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import { LevelOptions } from "@/lib/constants/level";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Lesson } from "@/lib/types/lesson";
import { OptionType } from "@/lib/types/option";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import useAdminReadingStore from "@/lib/store/adminReadingStore";
import TableSkeleton from "@/app/[locale]/components/table/TableSkeleton";

export default function AdminReadingLessons() {
  const router = useRouter();
  const pathname = usePathname();

  /* ──────────────────────── store ──────────────────────── */
  const { 
    selectedTopic: storedSelectedTopic,
    setSelectedTopic: setStoredSelectedTopic,
    addLesson: addStoredLesson,
    updateLesson: updateStoredLesson,
    deleteLesson: deleteStoredLesson,
  } = useAdminReadingStore();

  /* ──────────────────────── state ──────────────────────── */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [readingLessons, setReadingLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<OptionType[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<OptionType | null>(
    storedSelectedTopic ? { value: storedSelectedTopic, label: "" } : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const hasInitializedTopic = useRef(false);

  /* ──────────────────────── i18n / services ────────────── */
  const locale = useLocale();
  const t = useTranslations("Admin.Exercises");
  const lessonService = new LessonService();
  const topicService = new TopicService();

  /* ──────────────────────── meta ───────────────────────── */
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `${locale}/admin/home` },
    { label: "Exercises", href: `${locale}/admin/exercises` },
    { label: "Reading Lessons", href: `${locale}/admin/exercises/reading-lessons` },
  ];

  const fields = useMemo(
    () => [
      { key: "title", label: t("fields.name"), type: "key" },
      { key: "level", label: t("fields.level") },
      { key: "topic", label: t("fields.topic") },
      { key: "description", label: t("fields.description") },
      { 
        key: "exerciseCount", 
        label: "Exercises", 
        type: "custom",
        render: (item: any) => (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {item && item.readings.length || 0} exercises
            </span>
          </div>
        )
      },
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
        options: topics,
        required: true
      },
      { key: "type", label: "Type", type: "hidden", default: "reading_practice" },
    ],
    [t, topics]
  );

  /* ──────────────────────── fetch functions ─────────────── */
  
  // Fetch reading topics only - chỉ gọi một lần khi component mount
  const fetchReadingTopics = useCallback(async () => {
    try {
      const response = await topicService.getByCategory("reading");
      if (response.success && response.data) {
        // Filter for reading category only
        const readingTopics = response.data.filter((topic: any) => topic.category === 'reading');
        const topicOptions = readingTopics.map((topic: any) => ({ 
          value: topic.id, 
          label: topic.title || 'Untitled Topic' 
        }));
        setTopics(topicOptions);

        if (!hasInitializedTopic.current && storedSelectedTopic && topicOptions.length > 0) {
          const foundTopic = topicOptions.find(t => t.value === storedSelectedTopic);
          if (foundTopic) {
            setSelectedTopic(foundTopic);
          }
          hasInitializedTopic.current = true;
        }
      } else {
        toast.error(!response.success ? response.error || "Failed to fetch reading topics" : "Failed to fetch reading topics");
      }
    } catch (error) {
      console.error("Error fetching reading topics:", error);
      toast.error("Network error while fetching topics");
    }
  }, []); // Loại bỏ dependency storedSelectedTopic

  // Fetch reading lessons
  const fetchReadingLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: Record<string, unknown> = { type: "reading_practice" };
      if (selectedTopic) {
        filters.topic = selectedTopic.value;
      }
      
      const response = await lessonService.getAll({ 
        page, 
        pageSize: 10, 
        filters 
      });
      
      if (response.success) {
        setReadingLessons(response.data || []);
        setTotalPage(response.pagination?.total_page || 1);
      } else {
        console.error("API Error:", response.message);
        toast.error(response.message || "Failed to fetch reading lessons");
        setReadingLessons([]);
        setTotalPage(1);
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error while fetching reading lessons");
      setReadingLessons([]);
      setTotalPage(1);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopic, page]);

  /* ──────────────────────── effects ────────────────────── */
  useEffect(() => {
    fetchReadingTopics();
  }, [fetchReadingTopics]);

  useEffect(() => {
    fetchReadingLessons();
  }, [fetchReadingLessons]);

  // Update store when topic changes - chỉ cập nhật khi thực sự cần thiết
  useEffect(() => {
    if (hasInitializedTopic.current) {
      setStoredSelectedTopic(selectedTopic?.value || null);
    }
  }, [selectedTopic, setStoredSelectedTopic]);

  /* ──────────────────────── event handlers ─────────────── */
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const handleTopicChange = (topic: OptionType | null) => {
    setSelectedTopic(topic);
    setPage(1); // Reset to first page when filter changes
  };

  /* ──────────────────────── CRUD handlers ─────────────── */
  const handleAddLesson = async (data: any) => {
    setIsProcessing(true);
    try {
      const lessonData = {
        ...data,
        type: "reading_practice"
      };
      
      const response = await lessonService.create(lessonData);
      
      if (response.success) {
        // Update state directly instead of fetching
        const newLesson = response.data;
        setReadingLessons(prev => [newLesson, ...prev]);
        addStoredLesson(newLesson);
        toast.success("Reading lesson created successfully");
        return response;
      } else {
        toast.error(response.message || "Failed to create reading lesson");
        return response;
      }
    } catch (error) {
      console.error("Error creating reading lesson:", error);
      toast.error("Network error while creating lesson");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateLesson = async (id: string | number, data: any) => {
    setIsProcessing(true);
    try {
      const allowedFields = ['title', 'description', 'level', 'topic', 'type'];
      const partialLessonData: any = {};
      allowedFields.forEach(field => {
        if (data.hasOwnProperty(field)) {
          partialLessonData[field] = data[field];
        }
      });
      partialLessonData.type = "reading_practice";
      
      const response = await lessonService.partialUpdate(id, partialLessonData);
      
      if (response.success) {
        // Update state directly instead of fetching
        const updatedLesson = response.data;
        setReadingLessons(prev => 
          prev.map(lesson => 
            lesson.id === Number(id) ? updatedLesson : lesson
          )
        );
        updateStoredLesson(Number(id), updatedLesson);
        toast.success("Reading lesson updated successfully");
        return response;
      } else {
        toast.error(response.message || "Failed to update reading lesson");
        return response;
      }
    } catch (error) {
      console.error("Error updating reading lesson:", error);
      toast.error("Network error while updating lesson");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLesson = async (id: string | number) => {
    setIsProcessing(true);
    try {
      const response = await lessonService.delete(Number(id));
      
      if (response.success) {
        // Update state directly instead of fetching
        setReadingLessons(prev => 
          prev.filter(lesson => lesson.id !== Number(id))
        );
        deleteStoredLesson(Number(id));
        toast.success("Reading lesson deleted successfully");
        return response;
      } else {
        toast.error(response.message || "Failed to delete reading lesson");
        return response;
      }
    } catch (error) {
      console.error("Error deleting reading lesson:", error);
      toast.error("Network error while deleting lesson");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onEdit = useCallback((item: any) => {
    return item; // Return item for modal editing
  }, []);

  const onSuccess = useCallback(() => {
    // Remove this callback since we're updating state directly
    // fetchReadingLessons();
  }, []);

  /* ──────────────────────── filter UI ──────────────────── */
  const filterComponents = (
    <div className="min-w-[200px]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t("fields.topic")}
      </label>
      <CustomSelector
        objects={topics}
        value={selectedTopic}
        onChange={handleTopicChange}
        placeholder={t("placeholders.topic")}
      />
    </div>
  );

  /* ──────────────────────── render ─────────────────────── */
  return (
    <div className="flex flex-col p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white min-h-screen relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Processing...</span>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>
      
      {/* Filter Section */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600 shadow-sm">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Filters
          </h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {filterComponents}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Reading Lessons
              </h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              ) : (
                <>
                  {readingLessons.length} lessons
                  {selectedTopic && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-blue-800 dark:text-blue-200">
                      Topic: {selectedTopic.label}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <TableSkeleton cols={fields.length} rows={5} />
        ) : (
          <AdvancedDataTable
            fields={fields}
            page={page}
            onPageChange={onPageChange}
            service={lessonService}
            linkBase={`/${locale}/admin/exercises/reading-lessons/readings`}
            modalFields={modalFields}
            modalTitle="Add/Edit Reading Lesson"
            customObjects={readingLessons}
            customTotalPages={totalPage}
            hasCustomFetch={true}
            onAdd={handleAddLesson}
            onUpdate={handleUpdateLesson}
            onDelete={handleDeleteLesson}
            onEdit={onEdit}
            onSuccess={onSuccess}
            hasImport={false}
          />
        )}
      </div>
    </div>
  );
}