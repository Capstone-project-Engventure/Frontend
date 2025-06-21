"use client";

import Breadcrumb from "@/app/[locale]/components/breadcumb";
import LessonCard from "@/app/[locale]/components/card/LessonCard";
import PaginationCard from "@/app/[locale]/components/card/PaginationCard";
import FilterCard from "@/app/[locale]/components/card/FilterCard";

import { Lesson } from "@/lib/types/lesson";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState, useMemo } from "react";
import LessonService from "@/lib/services/lesson.service";
import useLessonStore from "@/lib/store/lessonStore";
import { useRouter } from "next/navigation";

// Constants
const ITEMS_PER_PAGE = 6;

const LEVEL_ORDER = [
  "A1 - Elementary",
  "A2 - Pre-Intermediate",
  "B1 - Intermediate",
  "B2 - Upper-Intermediate",
  "C1 - Advanced",
  "C2 - Proficiency",
];

type GroupedLessons = Record<string, Lesson[]>;
type PageMap = Record<string, number>;

const SpeakingPractice: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("SpeakingPractice");
  const tc = useTranslations("Common");
  const lessonService = new LessonService();
  const router = useRouter();

  const { lessons, setLessons, hasFetched, setHasFetched } = useLessonStore();
  const [currentPages, setCurrentPages] = useState<PageMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter states
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const breadcrumbs = [
    { label: tc("breadcrumbs.home"), href: "#" },
    {
      label: tc("breadcrumbs.speaking"),
      href: `/${locale}/student/practice/speaking`,
    },
  ];

  useEffect(() => {
    const fetchLessons = async () => {
      if (!hasFetched || lessons.length === 0) {
        setIsLoading(true);
        const result = await lessonService.getAllSpeakingLessons();
        console.log("Fetched lessons:", result);
        if (result.status == 200) {
          setLessons(result.data);
          setHasFetched(true);
        }
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [hasFetched, lessons, setHasFetched, setLessons]);

  // Get unique topics and levels from lessons
  const { uniqueTopics, uniqueLevels } = useMemo(() => {
    const topics = new Set<string>();
    const levels = new Set<string>();

    lessons.forEach((lesson) => {
      // Handle topic - use title property from Topic object
      const topicTitle = lesson.topic?.title;

      if (topicTitle && topicTitle !== "No Topic") {
        topics.add(topicTitle);
      }

      if (lesson.level) {
        levels.add(lesson.level);
      }
    });

    return {
      uniqueTopics: Array.from(topics).sort(),
      uniqueLevels: Array.from(levels).sort((a, b) => {
        const indexA = LEVEL_ORDER.indexOf(a);
        const indexB = LEVEL_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }),
    };
  }, [lessons]);

  // Filter lessons based on selected topic and level
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Handle topic comparison using title property
      const topicMatch =
        !selectedTopic || lesson.topic?.title === selectedTopic;
      const levelMatch = !selectedLevel || lesson.level === selectedLevel;
      return topicMatch && levelMatch;
    });
  }, [lessons, selectedTopic, selectedLevel]);

  // Group filtered lessons by level
  const groupedLessons: GroupedLessons = useMemo(() => {
    return filteredLessons.reduce((acc, lesson) => {
      const level = lesson.level || "Unknown";
      if (!acc[level]) acc[level] = [];
      acc[level].push(lesson);
      return acc;
    }, {} as GroupedLessons);
  }, [filteredLessons]);

  // Sort levels according to predefined order
  const sortedLevels = useMemo(() => {
    return Object.keys(groupedLessons).sort((a, b) => {
      const indexA = LEVEL_ORDER.indexOf(a);
      const indexB = LEVEL_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedLessons]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPages({});
  }, [selectedTopic, selectedLevel]);

  // Pagination utilities
  const getLessonsForCurrentPage = (level: string): Lesson[] => {
    const page = currentPages[level] || 1;
    const start = (page - 1) * ITEMS_PER_PAGE;
    return groupedLessons[level].slice(start, start + ITEMS_PER_PAGE);
  };

  const getTotalPages = (level: string): number =>
    Math.ceil(groupedLessons[level].length / ITEMS_PER_PAGE);

  const handlePageChange = (level: string, page: number): void => {
    setCurrentPages((prev) => ({ ...prev, [level]: page }));
  };

  // Filter handlers
  const handleTopicChange = (topic: string): void => {
    setSelectedTopic(topic);
  };

  const handleLevelChange = (level: string): void => {
    setSelectedLevel(level);
  };

  const handleResetFilters = (): void => {
    setSelectedTopic("");
    setSelectedLevel("");
  };

  return (
    <div className="flex flex-col px-10 py-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />

      {/* Filter Component */}
      <FilterCard
        topics={uniqueTopics}
        levels={uniqueLevels}
        selectedTopic={selectedTopic}
        selectedLevel={selectedLevel}
        onTopicChange={handleTopicChange}
        onLevelChange={handleLevelChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredLessons.length === 0 && lessons.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t("filter.noResults") || "No lessons found matching your filters."}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200"
          >
            {t("filter.clearFilters") || "Clear Filters"}
          </button>
        </div>
      )}

      {/* Lessons Display */}
      <div className="mt-4">
        {sortedLevels.map((level) => (
          <div key={level} className="mb-10">
            <h2 className="text-3xl font-bold text-gray-500 dark:text-white mb-4 border-b-2 border-amber-500 inline-block pb-2">
              {level} ({groupedLessons[level].length})
            </h2>

            <div className="min-h-[200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getLessonsForCurrentPage(level).map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>

            {getTotalPages(level) > 1 && (
              <div className="mt-3 px-6 flex justify-end">
                <PaginationCard
                  currentPage={currentPages[level] || 1}
                  totalPages={getTotalPages(level)}
                  onPageChange={(page) => handlePageChange(level, page)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakingPractice;
