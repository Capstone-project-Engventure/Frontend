"use client";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
import SkillTabFilter from "@/app/[locale]/components/filter/SkillTabFilter";
import { CategoryOptions } from "@/lib/constants/category";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { Lesson } from "@/lib/types/lesson";
import { Topic } from "@/lib/types/topic";
import { useEffect, useState, useMemo } from "react";

import {
  HiPlus,
} from "react-icons/hi";
import { toast } from "react-toastify";

export default function AdminTopic() {
  const topicService = new TopicService();
  const lessonService = new LessonService();
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]); // Store all topics for filtering
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fields = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
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
  ];

  // Calculate category counts from all topics
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTopics.forEach(topic => {
      const category = topic.category || 'other';
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [allTopics]);

  // Filter topics based on selected category
  const filteredTopics = useMemo(() => {
    if (!selectedCategory) return allTopics;
    return allTopics.filter(topic => topic.category === selectedCategory);
  }, [allTopics, selectedCategory]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page when filtering
  };

  const fetchAllTopics = async () => {
    setIsLoading(true);
    try {
      const response = await topicService.getAll({});
      if (response.success && response.data) {
        setAllTopics(response.data);
      } else {
        toast.error("Failed to fetch topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Error loading topics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  // Update topics when filter changes
  useEffect(() => {
    setTopics(filteredTopics);
  }, [filteredTopics]);

  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
  } | null>(null);

  function fetchLessonData() {
    throw new Error("Function not implemented.");
  }

  const onHandleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await lessonService.importByFile(file);
      if (res.status === 200) {
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
    <div className="flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Topics Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage topics by skill category. Filter by skill to see related topics.
        </p>
      </div>

      {/* Skill Filter */}
      <SkillTabFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
        showCounts={true}
      />

      {/* Results Summary */}
      {selectedCategory && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Showing {filteredTopics.length} topics for{" "}
                <span className="font-semibold">
                  {CategoryOptions.find(cat => cat.value === selectedCategory)?.label}
                </span>
              </span>
            </div>
            <button
              onClick={() => setSelectedCategory("")}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all topics
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <AdvancedDataTable
          fields={fields}
          page={page}
          onPageChange={onPageChange}
          service={topicService}
          linkBase="/admin/topics"
          breadcrumbs={breadcrumbs}
          modalFields={modalFields}
          customObjects={filteredTopics} // Pass filtered data
          hasCustomFetch={true}
          // onHandleFile={onHandleFile}
        />
      </div>
    </div>
  );
}

