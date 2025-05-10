"use client";
import PaginationTable from "@/app/components/table/PaginationTable";
import { useApi } from "@/lib/Api";
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
  const [pageSize, setPageSize] = useState(2);

  const fields = [
    { key: "title", label: "Title" },
    { key: "level", label: "Level" },
    { key: "description", label: "Description" },
    { key: "order", label: "Order" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Topic" },
  ];

  const modalFields = [
    { key: "title", label: "Title", type: "text" },
    { key: "level", label: "Level", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "order", label: "Order", type: "number" },
  ];
  

  const onPageChange = (page: number) => {
    setPage(page);
  };
  const handleAdd = (formData: any) => {
    topicService.createTopic(formData);
  };
  const handleUpdate = (id: number, formData: any) => {
    topicService.updateTopic(id, formData);
  };

  const handleDelete = (id: number) => {
    topicService.deleteTopic(id);
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (formData.id) {
      handleUpdate(formData.id, formData);
    } else {
      handleAdd(formData);
    }
    setFormData(null);
  };

  const handleCloseModal = () => {
    setFormData(null);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      const topicService = new TopicService();
      const res = await topicService.getAllTopics(1, 10);

      if (!res.success) throw new Error("API response unsuccessful");
      if (!Array.isArray(res.data)) {
        // const paginatedData = res.data as PaginatedResponse<Topic>;
        setTopics(res.data.results);
        setPageSize(res.data.page_size);
        setPage(res.data.page);
      } else {
        setTopics(res.data);
      }
    };

    fetchTopics();
  }, []);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    // Fix the component with ts
    <>
      <PaginationTable
        objects={topics}
        fields={fields}
        page={page}
        totalPages={pageSize}
        onPageChange={onPageChange}
        service={topicService}
        linkBase="/admin/topics"
        breadcrumbs={breadcrumbs}
        modalFields={modalFields}
      />
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-40 flex items-center justify-center z-50">
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
      )}
    </>
  );
}
