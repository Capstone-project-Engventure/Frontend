"use client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import SkillTabFilter from "@/app/[locale]/components/filter/SkillTabFilter";
import PromptSelector from "@/app/[locale]/components/prompt/PromptSelector";
import { useApi } from "@/lib/Api";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import TopicService from "@/lib/services/topic.service";
import { useExerciseTypeStore } from "@/lib/store/exerciseTypeStore";
import { useGenerateStore } from "@/lib/store/generateStore";
import { usePromptStore } from "@/lib/store/promptStore";
import { useTopicStore } from "@/lib/store/topicStore";
import { useHistoryGenerateStore } from "@/lib/store/historyGenerateStore";
import { Exercise } from "@/lib/types/exercise";
import { Prompt } from "@/lib/types/prompt";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import ExerciseCard from "@/app/[locale]/components/ExerciseCard";
import { toast } from "react-toastify";
import { useApproveExercise } from "@/lib/hooks/useApproveExercise";
import ExerciseApprovalCard from "@/app/[locale]/components/ExerciseApprovalCard";
import { useLLMModeValidator } from "@/lib/utils/llmModeValidator";
import LessonService from "@/lib/services/lesson.service";
// import OrbitProgress from "react-loading-indicator"; // Đảm bảo bạn đã cài đặt thư viện này


const sampleExercises = [
  {
    id: 1,
    name: "Environmental Sounds",
    question:
      "Listen to the audio and identify what environmental sound you hear.",
    system_answer: "A",
    type: { id: 1, name: "listening", description: "Listening exercises" },
    type_id: 1,
    skill: "listening",
    level: "A2",
    topic: "Environmental Awareness",
    topic_id: 1,
    description: "Identify natural sounds in the environment.",
    audio_file_url: "/audio/nature-sounds.mp3",
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      { key: "A", option: "Birds singing in a forest" },
      { key: "B", option: "Ocean waves crashing" },
      { key: "C", option: "Wind blowing through trees" },
      { key: "D", option: "Rain falling on leaves" },
    ],
    explanation:
      "The audio contains clear bird songs typical of forest environments, indicating biodiversity and healthy ecosystems.",
  },
  {
    id: 2,
    name: "Climate Change Article",
    question:
      "According to the passage, what is the primary cause of global warming?",
    system_answer: "B",
    type: { id: 2, name: "reading", description: "Reading exercises" },
    type_id: 2,
    skill: "reading",
    level: "B1",
    topic: "Environmental Awareness",
    topic_id: 1,
    description: "Read the passage and answer the comprehension question.",
    reading: {
      title: "Understanding Climate Change",
      content:
        "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, scientific evidence shows that human activities have been the main driver of climate change since the 1800s. The burning of fossil fuels like coal, oil, and gas produces greenhouse gases that trap heat in our atmosphere. These gases include carbon dioxide, methane, and nitrous oxide. As concentrations of these gases increase, more heat gets trapped, leading to rising global temperatures, melting ice caps, and changing weather patterns worldwide.",
    },
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      { key: "A", option: "Natural climate variations" },
      { key: "B", option: "Human activities since the 1800s" },
      { key: "C", option: "Solar radiation changes" },
      { key: "D", option: "Volcanic eruptions" },
    ],
    explanation:
      'The passage clearly states that "human activities have been the main driver of climate change since the 1800s," specifically mentioning the burning of fossil fuels.',
  },
  {
    id: 3,
    name: "Grammar: Present Perfect for Environmental Actions",
    question:
      'Choose the correct form: "We _____ renewable energy sources for the past decade."',
    system_answer: "C",
    type: { id: 3, name: "grammar", description: "Grammar exercises" },
    type_id: 3,
    skill: "grammar",
    level: "B1",
    topic: "Environmental Awareness",
    topic_id: 1,
    description:
      "Use present perfect tense to describe ongoing environmental actions.",
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      { key: "A", option: "use" },
      { key: "B", option: "used" },
      { key: "C", option: "have been using" },
      { key: "D", option: "will use" },
    ],
    explanation:
      'Present perfect continuous "have been using" is correct for actions that started in the past and continue to the present, indicated by "for the past decade."',
  },
  {
    id: 4,
    name: "Environmental Vocabulary",
    question: 'What does "sustainable" mean in environmental contexts?',
    system_answer: "A",
    type: { id: 4, name: "vocabulary", description: "Vocabulary exercises" },
    type_id: 4,
    skill: "vocabulary",
    level: "B2",
    topic: "Environmental Awareness",
    topic_id: 1,
    description: "Learn key environmental vocabulary terms.",
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      {
        key: "A",
        option: "Able to be maintained without harming the environment",
      },
      { key: "B", option: "Expensive and difficult to implement" },
      { key: "C", option: "Related to government policies only" },
      { key: "D", option: "Temporary and short-term" },
    ],
    explanation:
      "Sustainable refers to practices that can be maintained over time without depleting natural resources or harming the environment for future generations.",
  },
  {
    id: 5,
    name: "Environmental Essay Writing",
    question:
      "Write a short paragraph about one action you can take to protect the environment.",
    system_answer: "Sample",
    type: { id: 5, name: "writing", description: "Writing exercises" },
    type_id: 5,
    skill: "writing",
    level: "B2",
    topic: "Environmental Awareness",
    topic_id: 1,
    description:
      "Express your ideas about environmental protection in writing.",
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      {
        key: "Sample",
        option:
          "One simple action I can take to protect the environment is reducing my plastic consumption. By using reusable bags, water bottles, and containers, I can significantly decrease the amount of single-use plastic waste that ends up in landfills and oceans. This small change in daily habits can contribute to preserving marine life and reducing pollution for future generations.",
      },
    ],
    explanation:
      "Writing exercises help students practice expressing environmental concepts clearly and persuasively while building vocabulary and grammar skills.",
  },
  {
    id: 6,
    name: "Environmental Discussion",
    question: "Discuss the pros and cons of renewable energy sources.",
    system_answer: "Speaking",
    type: { id: 6, name: "speaking", description: "Speaking exercises" },
    type_id: 6,
    skill: "speaking",
    level: "B2",
    topic: "Environmental Awareness",
    topic_id: 1,
    description:
      "Practice speaking about environmental topics with structured discussion.",
    image: "",
    lesson: "",
    generated_by: "sample",
    options: [
      {
        key: "Speaking",
        option:
          "This is a speaking exercise. Students should discuss advantages like clean energy, job creation, and energy independence, as well as challenges like initial costs, weather dependency, and infrastructure needs.",
      },
    ],
    explanation:
      "Speaking exercises develop fluency and confidence in discussing complex environmental issues, helping students articulate their thoughts on important global topics.",
  },
];

export default function ExerciseGenerate() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const breadcrumbs = [
    {
      label: "Trang chủ",
      href: `/${locale}/admin/home`,
    },
    {
      label: "Tạo sinh bài tập",
      href: `/${locale}/admin/generate`,
    },
  ];

  const { 
    topics, 
    categoryCounts, 
    filteredTopics,
    selectedCategory,
    isLoading: topicsLoading,
    error: topicsError,
    fetchTopics, 
    fetchCategoryStats,
    setSelectedCategory,
    clearError
  } = useTopicStore();

  const { types, fetchTypes } = useExerciseTypeStore();
  // const { prompts, fetchPrompts } = usePromptStore();
  const {
    number,
    skill,
    level,
    topicId,
    typeId,
    mode,
    useRag,
    prompt,
    prompt_content,
    results,
    loading,
    healthLoading,
    error,
    healthStatus,
    setNumber,
    setSkill,
    setLevel,
    setTopic,
    setType,
    setMode,
    setUseRag,
    updatePrompt,
    setPromptContent,
    checkHealth,
    generate,
    exportResults,
  } = useGenerateStore();

  const { 
    histories, 
    fetchHistories, 
    addHistory
  } = useHistoryGenerateStore();

  const { 
    loading: approveLoading, 
    error: approveError, 
    checkExerciseExists, 
    approveExercise, 
    rejectExercise 
  } = useApproveExercise();

  const [showSampleExercises, setShowSampleExercises] = useState(false);
  const [exerciseStatuses, setExerciseStatuses] = useState<{[key: string]: 'pending' | 'approved' | 'rejected' | 'exists'}>({});
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [lessonCreating, setLessonCreating] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');

  // Prompt Store
  const promptStore = usePromptStore();
  
  // LLM Mode Validator
  const { validateAndWarn, showWarning } = useLLMModeValidator();

  // Lesson Service
  const lessonService = new LessonService();

  // Filter topics based on selected skill
  const availableTopics = useMemo(() => {
    if (!skill) return filteredTopics;
    return filteredTopics.filter(topic => topic.category === skill);
  }, [filteredTopics, skill]);

  // Auto-select category when skill changes
  useEffect(() => {
    if (skill && skill !== selectedCategory) {
      setSelectedCategory(skill);
    }
  }, [skill, selectedCategory, setSelectedCategory]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchTopics(),
          fetchTypes(),
          fetchCategoryStats(),
          promptStore.fetchPrompts(),
          fetchHistories()
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    initializeData();
  }, [fetchTopics, fetchTypes, fetchCategoryStats, promptStore.fetchPrompts, fetchHistories]);

  // Handle skill category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSkill(category); // Sync with generate store
    setTopic(''); // Reset topic selection
  };

  const setPrompt = (val: string) => {
    useGenerateStore.setState({ prompt: val });
    updatePrompt();
  };

  const handleGenerate = async () => {
    if (!canGenerate) {
      if (!isSystemHealthy) {
        toast.error("System is not ready. Please wait for health check to complete.");
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin");
      }
      return;
    }

    try {
      console.log('🚀 Starting exercise generation...');
      await generate();
      if (results && results.length > 0) {
        await checkAllExercisesExistence(results);
        
        // Add to history
        const historyEntry = {
          id: Date.now(),
          created_at: new Date().toISOString(),
          params: { number, skill, level, topicId, typeId, mode, useRag },
          response: { exercises: results },
          created_exercises: results
        };
        addHistory(historyEntry);
      }
    } catch (error) {
      console.error("❌ Error generating exercises:", error);
      toast.error("Có lỗi xảy ra khi tạo bài tập");
      
      // Re-check health if generation fails
      console.log('🏥 Re-checking system health after failure...');
      checkHealth();
    }
  };

  const checkAllExercisesExistence = async (exercises: Exercise[]) => {
    const statuses: {[key: string]: 'pending' | 'approved' | 'rejected' | 'exists'} = {};
    
    for (const exercise of exercises) {
      try {
        const questionKey = exercise.question || `exercise-${exercise.id}`;
        const exists = await checkExerciseExists({
          question: exercise.question,
          skill: exercise.skill,
          level: exercise.level
        });
        statuses[questionKey] = exists ? 'exists' : 'pending';
      } catch (error) {
        console.error('Error checking exercise existence:', error);
        const questionKey = exercise.question || `exercise-${exercise.id}`;
        statuses[questionKey] = 'pending';
      }
    }
    
    setExerciseStatuses(statuses);
  };

  const handleApproveExercise = async (exercise: Exercise) => {
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

  const handleRejectExercise = async (exercise: Exercise, reason?: string) => {
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

  // Auto health check on mount and periodic checks
  useEffect(() => {
    const checkHealthOnMount = async () => {
      console.log('🏥 Checking system health on mount...');
      await checkHealth();
    };
    
    // Check health immediately
    checkHealthOnMount();
    
    // Set up periodic health check every 2 minutes
    const healthCheckInterval = setInterval(async () => {
      console.log('🔄 Periodic health check...');
      await checkHealth();
    }, 2 * 60 * 1000); // 2 minutes
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);

  // Also check health when mode changes
  useEffect(() => {
    if (healthStatus) {
      console.log(`🔄 Mode changed to ${mode}, rechecking health...`);
      checkHealth();
    }
  }, [mode]);

  // Validate mode when health status changes
  // useEffect(() => {
  //   if (healthStatus) {
  //     const validation = validateAndWarn(mode, healthStatus);
  //     if (!validation.isValid) {
  //       showWarning(mode, healthStatus);
  //     }
  //   }
  // }, [healthStatus, mode, validateAndWarn, showWarning]);

  const t = useTranslations("GenerateExercise");
  const isFormValid = skill && level && topicId && typeId && prompt;
  const isSystemHealthy = healthStatus?.overall || false;
  const canGenerate = isFormValid && isSystemHealthy && !loading;
  const hasResults = results && results.length > 0;

  const handleCreateLesson = async () => {
    if (!hasResults || !lessonTitle.trim()) {
      toast.error("Please enter lesson title and ensure you have exercises to add");
      return;
    }

    setLessonCreating(true);
    try {
      // First, create the lesson
      const lessonData = {
        title: lessonTitle.trim(),
        description: lessonDescription.trim() || `Generated lesson with ${results.length} exercises`,
        level: level,
        topic_id: topicId,
        type: `${skill}_practice` // e.g., "listening_practice", "reading_practice"
      };

      const lessonResponse = await lessonService.create(lessonData);
      
      if (!lessonResponse.success) {
        toast.error(lessonResponse.error || "Failed to create lesson");
        return;
      }

      const createdLesson = lessonResponse.data;
      console.log('Created lesson:', createdLesson);

      // Then, assign all exercises to this lesson
      const exerciseIds = results.map(ex => ex.id).filter(id => id != null);
      
      if (exerciseIds.length > 0) {
        // Call the existing assign API via axiosInstance
        const { axiosInstance } = await import('@/lib/Api');
        const assignResponse = await axiosInstance.post('/exercises/assign-to-lesson', {
          exercise_ids: exerciseIds,
          lesson_id: createdLesson.id
        });

        if (assignResponse.status === 200 || assignResponse.status === 201) {
          toast.success(`Lesson "${lessonTitle}" created successfully with ${exerciseIds.length} exercises!`);
          setShowCreateLessonModal(false);
          setLessonTitle('');
          setLessonDescription('');
          
          // Optionally redirect to the lesson management page
          setTimeout(() => {
            router.push(`/${locale}/admin/exercises/${skill}-lessons`);
          }, 2000);
        } else {
          toast.error(`Lesson created but failed to assign exercises: ${assignResponse.data?.error || 'Unknown error'}`);
        }
      } else {
        toast.warning("Lesson created but no exercises to assign");
        setShowCreateLessonModal(false);
        setLessonTitle('');
        setLessonDescription('');
      }

    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("An error occurred while creating the lesson");
    } finally {
      setLessonCreating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={breadcrumbs} />
      
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("heading")}
          </h2>
          
          {/* System Status Indicator */}
          <div className="flex items-center gap-3">
            {healthLoading ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Checking...</span>
              </div>
            ) : healthStatus ? (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isSystemHealthy 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isSystemHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-xs font-medium">
                  {isSystemHealthy ? 'System Ready' : 'System Issue'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs font-medium">Status Unknown</span>
              </div>
            )}
            
            {/* Manual Health Check Button */}
            <button
              onClick={checkHealth}
              disabled={healthLoading}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                healthLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
              }`}
              title="Manual health check"
            >
              {healthLoading ? (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Check Health
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          Generate exercises by selecting skill, level, and topic. Use the skill filter to find relevant topics.
          {!isSystemHealthy && healthStatus && (
            <span className="text-red-600 dark:text-red-400 font-medium ml-2">
              ⚠️ System check required before generating.
            </span>
          )}
        </p>
      </div>

      {/* Error States */}
      {topicsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">Failed to load topics: {topicsError}</p>
            <button
              onClick={() => {
                clearError();
                fetchTopics(true);
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Skill Filter */}
      <SkillTabFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
        showCounts={true}
      />

      {/* Generate Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Exercise Configuration
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Number of exercises */}
          <div>
            <label htmlFor="number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("numberOfQuestions")}
            </label>
            <input
              id="number"
              type="number"
              min={1}
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skill (Auto-filled from filter) */}
          <div>
            <label htmlFor="skill" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectSkill")}
            </label>
            <select
              id="skill"
              value={skill}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectSkill")}</option>
              {SkillOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectLevel")}
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectLevel")}</option>
              {LevelOptions.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.value}
                </option>
              ))}
            </select>
          </div>

          {/* Topic (Filtered by selected skill) */}
          <div>
            <label htmlFor="topic" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectTopic")}
              {topicsLoading && (
                <span className="ml-2 text-xs text-blue-600">Loading...</span>
              )}
            </label>
            <select
              id="topic"
              value={topicId}
              onChange={(e) => setTopic(e.target.value)}
              disabled={topicsLoading || !skill}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!skill ? "Select skill first" : t("selectTopic")}
              </option>
              {availableTopics.map((tpc) => (
                <option key={tpc.id} value={tpc.id}>
                  {tpc.title}
                </option>
              ))}
            </select>
            {skill && availableTopics.length === 0 && !topicsLoading && (
              <p className="text-sm text-yellow-600 mt-1">
                No topics available for {skill}. Try selecting a different skill.
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectType")}
            </label>
            <select
              id="type"
              value={typeId}
              onChange={(e) => setType(e.target.value)}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectType")}</option>
              {types.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode */}
          <div>
            <label htmlFor="mode" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("selectMode")}
            </label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as "vertex" | "ollama")}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ollama">Ollama (Local)</option>
              <option value="vertex">Vertex AI (Cloud)</option>
            </select>
          </div>

          {/* RAG */}
          <div className="flex items-center mt-6">
            <input
              id="useRag"
              type="checkbox"
              checked={useRag}
              onChange={(e) => setUseRag(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="useRag" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t("useRag")}
            </label>
          </div>
        </div>
      </div>

      {/* Prompt Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Prompt Selector */}
        <PromptSelector
          selectedPrompt={selectedPrompt}
          onPromptSelect={setSelectedPrompt}
          onPromptContentChange={setPromptContent}
          skill={skill}
          type={typeId}
        />
        
        {/* Prompt Content Editor */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("promptLabel")} Content
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {prompt_content.length} characters
            </div>
          </div>
          <textarea
            rows={15}
            value={prompt_content}
            onChange={(e) => setPromptContent(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={selectedPrompt ? `Edit ${selectedPrompt.name} template...` : "Enter your prompt here or select a template above..."}
          />
          
          {/* Prompt Variables Info */}
          {selectedPrompt && selectedPrompt.variables && selectedPrompt.variables.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Available Variables:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {selectedPrompt.variables.map((variable, index) => (
                  <div key={index} className="bg-white dark:bg-blue-800 px-2 py-1 rounded text-xs font-mono">
                    {`{${variable.name}}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                canGenerate && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Exercises
                </>
              )}
            </button>
            
            {hasResults && (
              <button
                onClick={exportResults}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Export Results
              </button>
            )}
          </div>
          
                      <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSampleExercises(!showSampleExercises)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showSampleExercises ? 'Hide' : 'Show'} Sample Exercises
              </button>
              
              <button
                onClick={() => router.push(`/${locale}/admin/history`)}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History ({histories.length})
              </button>
            </div>
        </div>
        
        {/* Form validation feedback */}
        {!isFormValid && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Please fill in all required fields: skill, level, topic, type, and prompt content.
            </p>
          </div>
        )}
        
        {!isSystemHealthy && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              System health check failed. Please wait for the system to be ready before generating.
            </p>
          </div>
        )}
      </div>

      {/* Sample Exercises */}
      {showSampleExercises && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Sample Exercises
          </h3>
          <div className="flex flex-col gap-2">
            {sampleExercises.map((exercise) => (
                 <ExerciseCard key={exercise.id} data={exercise} />
            ))}
          </div>
        </div>
      )}

      

      {/* Results Section */}
      {hasResults && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Generated Exercises ({results.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateLessonModal(true)}
                disabled={!canGenerate}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  canGenerate
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Create Lesson
              </button>
              <button
                onClick={exportResults}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export All
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {results.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id || index}
                data={exercise}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 bg-gray-300/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Create New Lesson
              </h3>
              <button
                onClick={() => setShowCreateLessonModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter lesson title..."
                  maxLength={50}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {lessonTitle.length}/50 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter lesson description..."
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <div className="font-medium mb-1">Lesson Details:</div>
                  <div>• Skill: {skill}</div>
                  <div>• Level: {level}</div>
                  <div>• Topic: {availableTopics.find(t => t.id.toString() === topicId)?.title || 'Unknown'}</div>
                  <div>• Exercises: {results.length}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateLessonModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLesson}
                disabled={!lessonTitle.trim() || lessonCreating}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  lessonTitle.trim() && !lessonCreating
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {lessonCreating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Lesson'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}