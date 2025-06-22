import React from 'react';
import { CategoryEnum, CategoryOptions } from '@/lib/constants/category';
import { 
  MdLibraryBooks, 
  MdOutlineVolumeUp, 
  MdOutlineRecordVoiceOver, 
  MdEditNote,
  MdMenuBook,
  MdSpellcheck,
  MdQuiz,
  MdCategory 
} from 'react-icons/md';
import { GiSpellBook } from 'react-icons/gi';

interface SkillTabFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts?: Record<string, number>;
  showCounts?: boolean;
}

// Icon mapping for each skill/category
const skillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  [CategoryEnum.READING]: MdLibraryBooks,
  [CategoryEnum.WRITING]: MdEditNote,
  [CategoryEnum.SPEAKING]: MdOutlineRecordVoiceOver,
  [CategoryEnum.LISTENING]: MdOutlineVolumeUp,
  [CategoryEnum.GRAMMAR]: GiSpellBook,
  [CategoryEnum.VOCABULARY]: MdMenuBook,
  [CategoryEnum.PRONUNCIATION]: MdOutlineRecordVoiceOver,
  [CategoryEnum.FUNCTIONAL]: MdSpellcheck,
  [CategoryEnum.TEST]: MdQuiz,
  [CategoryEnum.OTHER]: MdCategory,
};

// Color mapping for each skill
const skillColors: Record<string, { bg: string; text: string; border: string; activeBg: string; activeText: string }> = {
  [CategoryEnum.READING]: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    activeBg: 'bg-blue-500',
    activeText: 'text-white'
  },
  [CategoryEnum.WRITING]: {
    bg: 'bg-green-50 hover:bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    activeBg: 'bg-green-500',
    activeText: 'text-white'
  },
  [CategoryEnum.SPEAKING]: {
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    activeBg: 'bg-red-500',
    activeText: 'text-white'
  },
  [CategoryEnum.LISTENING]: {
    bg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    activeBg: 'bg-purple-500',
    activeText: 'text-white'
  },
  [CategoryEnum.GRAMMAR]: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    activeBg: 'bg-orange-500',
    activeText: 'text-white'
  },
  [CategoryEnum.VOCABULARY]: {
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    activeBg: 'bg-yellow-500',
    activeText: 'text-white'
  },
  [CategoryEnum.PRONUNCIATION]: {
    bg: 'bg-pink-50 hover:bg-pink-100',
    text: 'text-pink-700',
    border: 'border-pink-200',
    activeBg: 'bg-pink-500',
    activeText: 'text-white'
  },
  [CategoryEnum.FUNCTIONAL]: {
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    activeBg: 'bg-indigo-500',
    activeText: 'text-white'
  },
  [CategoryEnum.TEST]: {
    bg: 'bg-gray-50 hover:bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    activeBg: 'bg-gray-500',
    activeText: 'text-white'
  },
  [CategoryEnum.OTHER]: {
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    activeBg: 'bg-slate-500',
    activeText: 'text-white'
  },
};

const SkillTabFilter: React.FC<SkillTabFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  showCounts = true
}) => {
  const allCategories = [
    { label: 'All Skills', value: '' },
    ...CategoryOptions
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filter by Skill
        </h3>
        
        {/* Desktop: Horizontal tabs */}
        <div className="hidden md:flex flex-wrap gap-2">
          {allCategories.map((category) => {
            const isActive = selectedCategory === category.value;
            const Icon = category.value ? skillIcons[category.value] : MdCategory;
            const colors = category.value ? skillColors[category.value] : {
              bg: 'bg-gray-50 hover:bg-gray-100',
              text: 'text-gray-700',
              border: 'border-gray-200',
              activeBg: 'bg-gray-600',
              activeText: 'text-white'
            };
            const count = categoryCounts?.[category.value] || 0;

            return (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium
                  ${isActive 
                    ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-md transform scale-105` 
                    : `${colors.bg} ${colors.text} ${colors.border} hover:shadow-sm`
                  }
                `}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm">{category.label}</span>
                {showCounts && category.value && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-black/10'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile: Dropdown */}
        <div className="md:hidden">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {allCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
                {showCounts && category.value && categoryCounts?.[category.value] 
                  ? ` (${categoryCounts[category.value]})` 
                  : ''
                }
              </option>
            ))}
          </select>
        </div>

        {/* Active filter indicator */}
        {selectedCategory && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Active filter:</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md font-medium">
                {CategoryOptions.find(cat => cat.value === selectedCategory)?.label || 'All Skills'}
              </span>
            </div>
            <button
              onClick={() => onCategoryChange('')}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTabFilter; 