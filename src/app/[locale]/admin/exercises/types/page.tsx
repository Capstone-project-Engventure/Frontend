"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import TopicService from "@/lib/services/topic.service";
import { ExerciseType } from "@/lib/types/exercise-type";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";

export default function AdminExerciseTypesPage() {
  const exerciseTypeService = new ExerciseTypeService();
  const topicService = new TopicService();
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const fields = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises", href: "/admin/exercises" },
    { label: "Types" }, // last item: no href
  ];

  const onPageChange = (page: number) => {
    setPage(page);
  };
  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;


  // useEffect(() => {
  //   const fetchExerciseData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await exerciseTypeService.getAllExerciseTypes(
  //         page,
  //         pageSize
  //       );
  //       if (res.success) {
  //         setExerciseTypes(res.data.results);
  //         setPage(res.data.page);
  //         setPageSize(res.data.page_size);
  //         setTotalPages(res.data.num_pages);
  //         console.log("Fetched exercises from API and cached");
  //       }
  //     } catch (err) {
  //       console.error("Fetch exercises failed:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   const fetchTopics = async () => {
  //     // const topicService = new TopicService();
  //     const res = await topicService.getAll();
  //     if (res.success && Array.isArray(res.data)) {
  //       setTopics(res.data);
  //     }
  //   };

  //   fetchTopics();
  //   fetchExerciseData();
  // }, [page]);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    // Fix the component with ts
    <>
      <div className="py-2">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <PaginationTable
        // objects={exerciseTypes}
        fields={fields}
        page={page}
        service={exerciseTypeService}
        // totalPages={totalPages}
        modalFields={modalFields}
        onPageChange={onPageChange}
        linkBase="/admin/exercises"
      />
      {/* {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {formData.id ? "Edit" : "Add"} Exercise Type
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
