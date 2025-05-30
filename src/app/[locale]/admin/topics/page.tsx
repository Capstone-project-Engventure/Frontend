"use client";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import { useApi } from "@/lib/Api";
import { CategoryOptions } from "@/lib/constants/category";
import TopicService from "@/lib/services/topic.service";
import { PaginatedResponse } from "@/lib/types/response";
import { Topic } from "@/lib/types/topic";
import { useEffect, useState } from "react";

import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

export default function AdminTopic() {
  const topicService = new TopicService();
  const [isLoading, setIsLoading] = useState(false);
  //   const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(7);
  const [keyword, setKeyword] = useState("");

  const fields = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    // { key: "order", label: "Order" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Topic" },
  ];

  const modalFields = [
    { key: "title", label: "Title", type: "text" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: CategoryOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
    // { key: "order", label: "Order", type: "number" },
  ];

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;

  const handleAddClick = () => {
    setFormData({
      title: "",
      level: "",
      topic: "",
      description: "",
    });
  };

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

  // if (isLoading) {
  //   return <div>Đang tải dữ liệu...</div>;
  // }

  return (
    // Fix the component with ts
    <>
      <PaginationTable
        fields={fields}
        page={page}
        onPageChange={onPageChange}
        service={topicService}
        linkBase="/admin/topics"
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
        onHandleFile={onHandleFile}
      />
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-white  bg-opacity-30 dark:bg-white dark:bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
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
