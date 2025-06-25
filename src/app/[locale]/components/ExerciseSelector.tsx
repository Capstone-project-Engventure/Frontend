"use client";

import { useState, useEffect, useMemo } from 'react';
import { Exercise } from '@/lib/types/exercise';
import { Topic } from '@/lib/types/topic';
import ExerciseService from '@/lib/services/exercise.service';
import TopicService from '@/lib/services/topic.service';
import ExerciseTypeService from '@/lib/services/exercise-types.service';
import { LevelOptions } from '@/lib/constants/level';
import { toast } from 'react-toastify';

interface ExerciseSelectorProps {
  skill: string;
  selectedExercises: Exercise[];
  onExerciseSelect: (exercises: Exercise[]) => void;
  maxSelection?: number;
}

interface Filters {
  topic: string;
  level: string;
  type: string;
  search: string;
}

export default function ExerciseSelector({ 
  skill, 
  selectedExercises, 
  onExerciseSelect,
  maxSelection = 20
}: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    topic: '',
    level: '',
    type: '',
    search: ''
  });

  const exerciseService = new ExerciseService();
  const topicService = new TopicService();
  const exerciseTypeService = new ExerciseTypeService();

  // Fetch topics and exercise types on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [topicsRes, typesRes] = await Promise.all([
          topicService.getAll(),
          exerciseTypeService.getAll()
        ]);

        if (topicsRes.success) {
          setTopics(topicsRes.data || []);
        }

        if (typesRes.success) {
          setExerciseTypes(typesRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  // Fetch exercises when filters change
  useEffect(() => {
    fetchExercises();
  }, [skill, page, filters]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const searchFilters: Record<string, any> = {
        skill: skill,
        lesson__isnull: true, // Only get exercises not assigned to any lesson
        page: page,
        pageSize: 10
      };

      if (filters.topic) searchFilters.topic = filters.topic;
      if (filters.level) searchFilters.level = filters.level;
      if (filters.type) searchFilters.type = filters.type;
      if (filters.search) searchFilters.search = filters.search;

      const res = await exerciseService.getAll({ 
        page, 
        pageSize: 10, 
        filters: searchFilters 
      });

      if (res.success) {
        setExercises(res.data || []);
        setTotalPages(res.pagination?.total_page || 1);
      } else {
        toast.error('Failed to fetch exercises');
        setExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Network error while fetching exercises');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleExerciseToggle = (exercise: Exercise) => {
    const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
    
    if (isSelected) {
      // Remove from selection
      onExerciseSelect(selectedExercises.filter(ex => ex.id !== exercise.id));
    } else {
      // Add to selection if under limit
      if (selectedExercises.length < maxSelection) {
        onExerciseSelect([...selectedExercises, exercise]);
      } else {
        toast.warning(`Maximum ${maxSelection} exercises can be selected`);
      }
    }
  };

  const handleSelectAll = () => {
    const unselectedExercises = exercises.filter(
      ex => !selectedExercises.some(sel => sel.id === ex.id)
    );
    
    const availableSlots = maxSelection - selectedExercises.length;
    const toSelect = unselectedExercises.slice(0, availableSlots);
    
    onExerciseSelect([...selectedExercises, ...toSelect]);
    
    if (unselectedExercises.length > availableSlots) {
      toast.warning(`Only ${toSelect.length} exercises added due to selection limit`);
    }
  };

  const handleDeselectAll = () => {
    onExerciseSelect([]);
  };

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => topic.category === skill);
  }, [topics, skill]);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Find Exercises for {skill.charAt(0).toUpperCase() + skill.slice(1)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search questions..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) => handleFilterChange('topic', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Topics</option>
              {filteredTopics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Levels</option>
              {LevelOptions.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exercise Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Types</option>
              {exerciseTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              disabled={exercises.length === 0}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Select All on Page
            </button>
            <button
              onClick={handleDeselectAll}
              disabled={selectedExercises.length === 0}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Clear Selection
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedExercises.length}/{maxSelection} exercises selected
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exercises found for the selected filters
          </div>
        ) : (
          exercises.map((exercise) => {
            const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
            
            return (
              <div
                key={exercise.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleExerciseToggle(exercise)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by parent div onClick
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {exercise.name}
                      </h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {exercise.level}
                      </span>
                      {exercise.type && (
                        <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                          {exercise.type.name}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {exercise.question}
                    </p>
                    
                    {exercise.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 