"use client";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { useApi } from "@/lib/Api";
import { CategoryOptions } from "@/lib/constants/category";
import { LevelOptions } from "@/lib/constants/level";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Lesson } from "@/lib/types/lesson";
import { Topic } from "@/lib/types/topic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminLesson() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const lessonService = new LessonService();
  const topicService = new TopicService();

  const topicOptions = topics.map((t) => ({
    value: t.id,
    label: t.title,
  }));

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Lesson" },
  ];

  const fields = [
    { key: "title", label: "Title" },
    { key: "level", label: "Level" },
    { key: "topic", label: "Topic", isNest: true, nestKey: "title" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "title", label: "Title", type: "text" },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: LevelOptions,
    },
    { key: "topic_id", label: "Topic", type: "select", options: topicOptions },
    { key: "description", label: "Description", type: "textarea" },
  ];

  const fetchLessonData = async () => {
    setIsLoading(true);
    try {
      // Step 1: Check localStorage

      // Step 2: Fetch API
      const res = await lessonService.getAll(page, pageSize);
      console.log("check res:", res);

      if (!res.success) throw new Error("API response unsuccessful");

      if (Array.isArray(res.data)) {
        setLessons(res.data);
        setPageSize(1);
      } else {
        setLessons(res.data.results);
        setPage(res.data.page);
        setPageSize(res.data.page_size);
      }
    } catch (err) {
      console.error("Fetch lessons failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    const topicService = new TopicService();
    const res = await topicService.getAll();
    if (res.success && Array.isArray(res.data)) {
      setTopics(res.data);
    }
  };

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const onSuccess = () => {
    toast.success("Cập nhật thành công");
  };

  const handleCloseModal = () => {
    setFormData(null);
  };

  useEffect(() => {
    fetchTopics();
    fetchLessonData();
  }, [page]);

  // if (isLoading) {
  //   return <div>Đang tải dữ liệu...</div>;
  // }

  const onHandleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await lessonService.importLessonByFile(file);
      if (res.success) {
        toast.success("Import file thành công");
        fetchLessonData();
      } else {
        toast.error("Import file thất bại");
      }
    } catch (error) {
      console.error("Error importing file:", error);
      toast.error("Import file thất bại");
    }
  };

  return (
    // Fix the component with ts
    <>
      <PaginationTable
        fields={fields}
        page={page}
        service={lessonService}
        onPageChange={onPageChange}
        onSuccess={onSuccess}
        linkBase="/admin/lessons"
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
        onHandleFile={onHandleFile}
        hasTopicSelector={false}
      />
      {/* {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {formData.id ? "Edit" : "Add"} Lesson
            </h3>

            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {f.label}
                  </label>

                  {f.key === "level" ? (
                    <select
                      value={formData[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  ) : f.key === "topic" ? (
                    <select
                      value={formData[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select topic</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm border rounded-md text-gray-600 dark:text-gray-300 hover:shadow-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
