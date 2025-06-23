"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ExerciseCard from "@/app/[locale]/components/ExerciseCard";
import { useHistoryGenerateStore } from "@/lib/store/historyGenerateStore";
import { useApproveExercise } from "@/lib/hooks/useApproveExercise";
import { LuHistory, LuRefreshCw, LuDownload, LuSearch, LuFilter, LuCalendar, LuCheck, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

export default function HistoryPage() {
  const params = useParams();
  const locale = params.locale as string;

  const breadcrumbs = [
    {
      label: "Trang chủ",
      href: `/${locale}/admin/home`,
    },
    {
      label: "Lịch sử tạo bài tập",
      href: `/${locale}/admin/history`,
    },
  ];
  const { 
    histories, 
    loading, 
    error, 
    fetchHistories, 
    refreshHistories,
    clearHistories 
  } = useHistoryGenerateStore();

  const { 
    loading: approveLoading, 
    error: approveError, 
    checkExerciseExists, 
    approveExercise, 
    rejectExercise 
  } = useApproveExercise();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [exerciseStatuses, setExerciseStatuses] = useState<{[key: string]: 'pending' | 'approved' | 'rejected' | 'exists'}>({});

  const t = useTranslations("GenerateExercise");

  // Load histories on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchHistories();
      // Check exercise statuses for all history exercises
      const allExercises = histories.flatMap(h => h.created_exercises);
      if (allExercises.length > 0) {
        await checkAllExercisesExistence(allExercises);
      }
    };
    loadData();
  }, [fetchHistories]);

  // Check exercise statuses when histories change
  useEffect(() => {
    if (histories.length > 0) {
      const allExercises = histories.flatMap(h => h.created_exercises);
      checkAllExercisesExistence(allExercises);
    }
  }, [histories]);

  // Filter histories based on search and filters
  const filteredHistories = histories.filter(history => {
    const matchesSearch = searchTerm === "" || 
      JSON.stringify(history.params).toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.created_exercises.some(ex => 
        ex.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSkill = filterSkill === "" || history.params.skill === filterSkill;
    const matchesLevel = filterLevel === "" || history.params.level === filterLevel;
    const matchesMode = filterMode === "" || history.params.mode === filterMode;

    return matchesSearch && matchesSkill && matchesLevel && matchesMode;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  const paginatedHistories = filteredHistories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for filters
  const uniqueSkills = [...new Set(histories.map(h => h.params.skill).filter(Boolean))];
  const uniqueLevels = [...new Set(histories.map(h => h.params.level).filter(Boolean))];
  const uniqueModes = [...new Set(histories.map(h => h.params.mode).filter(Boolean))];

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(histories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generation-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("History exported successfully!");
  };

  const handleExportFiltered = () => {
    const blob = new Blob([JSON.stringify(filteredHistories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `filtered-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("Filtered history exported successfully!");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterSkill("");
    setFilterLevel("");
    setFilterMode("");
    setCurrentPage(1);
  };

  const handleApproveExercise = async (exercise: any) => {
    try {
      await approveExercise(exercise);
      const questionKey = exercise.question || `exercise-${exercise.id}`;
      setExerciseStatuses(prev => ({
        ...prev,
        [questionKey]: 'approved'
      }));
      toast.success("Bài tập đã được phê duyệt!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi phê duyệt bài tập");
    }
  };

  const handleRejectExercise = async (exercise: any, reason?: string) => {
    try {
      const exerciseId = exercise.id?.toString() || 'unknown';
      await rejectExercise(exerciseId, reason);
      const questionKey = exercise.question || `exercise-${exercise.id}`;
      setExerciseStatuses(prev => ({
        ...prev,
        [questionKey]: 'rejected'
      }));
      toast.success("Bài tập đã bị từ chối!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối bài tập");
    }
  };

  const checkAllExercisesExistence = async (exercises: any[]) => {
    const statuses: {[key: string]: 'pending' | 'approved' | 'rejected' | 'exists'} = {};
    
    for (const exercise of exercises) {
      try {
        const questionKey = exercise.question || `exercise-${exercise.id}`;
        const exists = await checkExerciseExists({
          question: exercise.question,
          skill: exercise.skill,
          level: exercise.level
        });
        statuses[questionKey] = exists ? 'exists' : (exercise.status === 'approved' ? 'approved' : 'pending');
      } catch (error) {
        console.error('Error checking exercise existence:', error);
        const questionKey = exercise.question || `exercise-${exercise.id}`;
        statuses[questionKey] = exercise.status === 'approved' ? 'approved' : 'pending';
      }
    }
    
    setExerciseStatuses(statuses);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LuHistory className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lịch sử tạo bài tập
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Xem và quản lý lịch sử các lần tạo bài tập
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshHistories}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <LuRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <LuDownload className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{histories.length}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-600">
              {histories.reduce((acc, h) => acc + h.created_exercises.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Exercises</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(exerciseStatuses).filter(s => s === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(exerciseStatuses).filter(s => s === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(exerciseStatuses).filter(s => s === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{uniqueSkills.length}</div>
            <div className="text-sm text-gray-600">Skills Used</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search & Filter
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset
            </button>
            {filteredHistories.length !== histories.length && (
              <button
                onClick={handleExportFiltered}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Export Filtered
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <LuSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in parameters or exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skill
            </label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Skills</option>
              {uniqueSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mode
            </label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Modes</option>
              {uniqueModes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            History ({filteredHistories.length} of {histories.length})
          </h3>
          
          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load history: {error}</p>
            <button 
              onClick={refreshHistories}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredHistories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <LuHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No history found</p>
            <p className="text-sm mt-2">
              {histories.length === 0 
                ? "Generate some exercises to see them here!"
                : "Try adjusting your search or filters"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* History List */}
            {paginatedHistories.map((history) => (
              <div 
                key={history.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* History Header */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <LuCalendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(history.created_at).toLocaleDateString()} {new Date(history.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {history.params.skill}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                          {history.params.level}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {history.params.mode}
                        </span>
                        {history.params.useRag && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            RAG
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {history.created_exercises.length} exercises
                      </span>
                      <button
                        onClick={() => toggleExpanded(history.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                      >
                        {expandedItems.has(history.id) ? 'Hide' : 'Show'} Exercises
                      </button>
                    </div>
                  </div>
                  
                  {/* Parameters */}
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Parameters:</strong> 
                    <span className="ml-2 font-mono text-xs">
                      {JSON.stringify(history.params, null, 0)}
                    </span>
                  </div>
                </div>

                {/* Exercises */}
                {expandedItems.has(history.id) && (
                  <div className="p-4 space-y-4">
                    {history.created_exercises.map((exercise: any, index: number) => {
                      const questionKey = exercise.question || `exercise-${exercise.id}`;
                      const status = exerciseStatuses[questionKey] || exercise.status || 'pending';
                      
                      return (
                        <div key={exercise.id || index} className="relative">
                          <ExerciseCard
                            data={exercise}
                            index={index}
                          />
                          
                          {/* Approval Actions Overlay */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            {/* Status Badge */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              status === 'approved' ? 'bg-green-100 text-green-800' :
                              status === 'rejected' ? 'bg-red-100 text-red-800' :
                              status === 'exists' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status === 'approved' ? '✓ Approved' :
                               status === 'rejected' ? '✗ Rejected' :
                               status === 'exists' ? '! Exists' :
                               'Pending'}
                            </span>

                            {/* Action Buttons for pending exercises */}
                            {status === 'pending' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleApproveExercise(exercise)}
                                  disabled={approveLoading}
                                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                  title="Approve Exercise"
                                >
                                  <LuCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectExercise(exercise, "Rejected from history")}
                                  disabled={approveLoading}
                                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                                  title="Reject Exercise"
                                >
                                  <LuX className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 