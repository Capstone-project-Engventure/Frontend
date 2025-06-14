import React from "react";
import { useTranslations } from "next-intl";

interface FilterCardProps {
    topics: string[];
    levels: string[];
    selectedTopic: string;
    selectedLevel: string;
    onTopicChange: (topic: string) => void;
    onLevelChange: (level: string) => void;
    onReset: () => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
    topics,
    levels,
    selectedTopic,
    selectedLevel,
    onTopicChange,
    onLevelChange,
}) => {
    const t = useTranslations("ReadingPractice");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Topic Filter */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("filter.topic") || "Topic"}
                        </label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => onTopicChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[200px]"
                        >
                            <option value="">{t("filter.allTopics") || "All Topics"}</option>
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("filter.level") || "Level"}
                        </label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => onLevelChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[200px]"
                        >
                            <option value="">{t("filter.allLevels") || "All Levels"}</option>
                            {levels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {(selectedTopic || selectedLevel) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                            {t("filter.activeFilters") || "Active filters:"}
                        </span>
                        {selectedTopic && (
                            <span className="items-center px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                                <strong>Chủ đề:</strong> {selectedTopic}
                                <button
                                    onClick={() => onTopicChange("")}
                                    className="cursor-pointer ml-2 hover:text-red-600 dark:hover:text-amber-300"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedLevel && (
                            <span className="items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                <strong>Cấp độ:</strong> {selectedLevel}
                                <button
                                    onClick={() => onLevelChange("")}
                                    className="cursor-pointer ml-2 hover:text-red-600 dark:hover:text-blue-300"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterCard;