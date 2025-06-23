"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import LessonService from "@/lib/services/lesson.service";
import TopicService from "@/lib/services/topic.service";
import { LevelOptions } from "@/lib/constants/level";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import { OptionType } from "@/lib/types/option";

export default function CreateReadingLesson() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Admin.Exercises");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    topic_id: "",
    type: "reading_practice",
    content: "",
  });

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<OptionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lessonService = new LessonService();
  const topicService = new TopicService();

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: `/${locale}/admin/home` },
    {
      label: t("breadcrumbs.readingExercises"),
      href: `/${locale}/admin/exercises/reading-lessons`,
    },
    {
      label: "Create New Lesson",
      href: `/${locale}/admin/exercises/reading-lessons/create`,
    },
  ];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await topicService.getAll();
        if (res.success) {
          setTopics(
            res.data.map((topic: any) => ({
              value: topic.id.toString(),
              label: topic.title,
            }))
          );
        } else {
          toast.error("Failed to fetch topics");
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("Network error while fetching topics");
      }
    };

    fetchTopics();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTopicChange = (topic: OptionType | null) => {
    setSelectedTopic(topic);
    setFormData(prev => ({
      ...prev,
      topic_id: topic ? topic.value : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.level || !formData.topic_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await lessonService.create(formData);
      if (res.success) {
        toast.success("Lesson created successfully");
        router.push(`/${locale}/admin/exercises/reading-lessons`);
      } else {
        toast.error(res.message || "Failed to create lesson");
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Network error while creating lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/admin/exercises/reading-lessons`);
  };

  return (
    <div className="flex flex-col p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Create New Reading Lesson
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter lesson title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter lesson description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Level</option>
                  {LevelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic *
                </label>
                <CustomSelector
                  objects={topics}
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  placeholder="Select Topic"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the reading passage content..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Lesson"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 