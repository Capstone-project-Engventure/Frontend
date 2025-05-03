"use client";
import PaginationTable from "@/app/components/table/PaginationTable";
import { useApi } from "@/lib/Api";
import CourseService from "@/lib/services/course.service";
import { PaginatedResponse } from "@/lib/types/response";
import { Course } from "@/lib/types/course";
import { useEffect, useState } from "react";

import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

export default function AdminCourse() {
  const courseService = new CourseService();
  const [isLoading, setIsLoading] = useState(false);
  //   const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const onPageChange = (page: number) => {
    setPage(page);
  };
  const handleAdd = (formData: any) => {
    courseService.createCourse(formData);
  };
  const handleUpdate = (id: number, formData: any) => {
    courseService.updateCourse(id, formData);
  };

  const handleDelete = (id: number) => {
    courseService.deleteCourse(id);
  };
  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;

  const handleAddClick = () => {
    setFormData({
      name: "",
      begin: "",
      end: "",
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
    const fetchCourses = async () => {
      const courseService = new CourseService();
      const res = await courseService.getAllCourses(1, 10);

      if (!res.success) throw new Error("API response unsuccessful");
      if (!Array.isArray(res.data)) {
        // const paginatedData = res.data as PaginatedResponse<Course>;
        setCourses(res.data.results);
        setPageSize(res.data.page_size);
        setPage(res.data.page);
      } else {
        setCourses(res.data);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          <HiPlus className="text-lg" />
          Add
        </button>
      </div>
      <PaginationTable
        objects={courses}
        fields={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "begin", label: "Begin Date" },
          { key: "end", label: "End Date" },
        ]}
        page={page}
        totalPages={pageSize}
        onPageChange={onPageChange}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        linkBase="/admin/lessons"
      />
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {formData.id ? "Edit" : "Add"} Course
            </h3>

            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {f.label}
                  </label>

                  {f.key === "begin" || f.key === "end" ? (
                    <input
                      type="date"
                      value={formData[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
                    />
                  ) : f.key === "topic" ? (
                    <select
                      value={formData[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select topic</option>
                      {courses.map((topic) => (
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
