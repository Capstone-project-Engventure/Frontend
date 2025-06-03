"use client";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import ExerciseService from "@/lib/services/exercise.service";
import TopicService from "@/lib/services/topic.service";
import { Exercise } from "@/lib/types/exercise";
import { useEffect, useState } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

export default function AdminExercise() {
  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const fields = [
    { key: "name", label: "Name" },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    { key: "level", label: "Level" },
    { key: "topic", label: "Topic" },
    { key: "description", label: "Description" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Exercises" }, // last item: no href
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  
  useEffect(() => {
    const fetchExerciseData = async () => {
      setIsLoading(true);
      try {
        const res = await exerciseService.getAll(page, pageSize);
        if (res.success) {
          setExercises(res.data.results);
          setPage(res.data.page);
          setPageSize(res.data.page_size);
          setTotalPages(res.data.num_pages);
          console.log("Fetched exercises from API and cached");
        }
      } catch (err) {
        console.error("Fetch exercises failed:", err);
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

    fetchTopics();
    fetchExerciseData();
  }, [page]);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    // Fix the component with ts
    <>
      <div className="py-2">
        <Breadcrumb items={breadcrumbs} />
      </div>
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
        objects={exercises}
        fields={fields}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        // onAdd={handleAdd}
        // onUpdate={handleUpdate}
        linkBase="/admin/exercises"
      />
     
    </>
  );
}
