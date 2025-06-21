"use client";

import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { useApi } from "@/lib/Api";
import { LevelOptions } from "@/lib/constants/level";
import { SkillOptions } from "@/lib/constants/skill";
import ExerciseTypeService from "@/lib/services/exercise-types.service";
import TopicService from "@/lib/services/topic.service";
import { useExerciseTypeStore } from "@/lib/store/exerciseTypeStore";
import { useGenerateStore } from "@/lib/store/generateStore";
import { usePromptStore } from "@/lib/store/promptStore";
import { useTopicStore } from "@/lib/store/topicStore";
import { Exercise } from "@/lib/types/exercise";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ExerciseCard from "@/app/[locale]/components/ExerciseCard";
import { toast } from "react-toastify";
// import OrbitProgress from "react-loading-indicator"; // Đảm bảo bạn đã cài đặt thư viện này

const breadcrumbs = [
  {
    label: "Trang chủ",
    href: "/admin/home",
  },
  {
    label: "Tạo sinh bài tập",
    href: "/admin/generate",
  },
];
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
  const { topics, fetchTopics } = useTopicStore();
  const { types, fetchTypes } = useExerciseTypeStore();
  const { prompts, fetchPrompts } = usePromptStore();
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
    error,
    setNumber,
    setSkill,
    setLevel,
    setTopic,
    setType,
    setMode,
    setUseRag,
    updatePrompt,
    setPromptContent,
    generate,
    exportResults,
  } = useGenerateStore();

  const [showSampleExercises, setShowSampleExercises] = useState(false);
  const setPrompt = (val: string) => {
    useGenerateStore.setState({ prompt: val });
    updatePrompt(); // gọi lại sau khi set prompt
  };

  const handleGenerate = async () => {
    if (!isFormValid) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      // Gọi hàm generate từ store
      await generate();

      // Kiểm tra kết quả sau khi generate
      const currentResults = useGenerateStore.getState().results;

      if (currentResults.length === 0) {
        toast.error("Không tạo được bài tập nào phù hợp với tiêu chí đã chọn!");
      } else {
        toast.success(`Tạo thành công ${currentResults.length} bài tập!`);
      }
    } catch (error: any) {
      console.error("Error generating exercises:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo bài tập!");
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchTypes();
    fetchPrompts();
  }, []);

  useEffect(() => {
    updatePrompt();
  }, [prompt, skill, level, topicId, typeId, mode, useRag]);

  const t = useTranslations("GenerateExercise");
  const isFormValid = skill && level && topicId && typeId && prompt;
  const hasResults = results && results.length > 0;
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <Breadcrumb items={breadcrumbs} />
      <h2 className="text-xl font-semibold">{t("heading")}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          /* Number of exercises */
          <div>
            <label
              htmlFor="number"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              {t("numberOfQuestions")}
            </label>
            <input
              id="number"
              type="number"
              min={1}
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="block w-full p-3 border border-gray-300 rounded-md 
         bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        }

        {/* Skill */}
        <div>
          <label
            htmlFor="skill"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectSkill")}
          </label>
          <select
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t("selectSkill")}</option>
            {SkillOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {/* {t(`skills.${s.value}`)} */}
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label
            htmlFor="level"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectLevel")}
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t("selectLevel")}</option>
            {LevelOptions.map((l) => (
              <option key={l.value} value={l.value}>
                {l.value}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label
            htmlFor="topic"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectTopic")}
          </label>
          <select
            id="topic"
            value={topicId}
            onChange={(e) => setTopic(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t("selectTopic")}</option>
            {topics.map((tpc) => (
              <option key={tpc.id} value={tpc.id}>
                {tpc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectType")}
          </label>
          <select
            id="type"
            value={typeId}
            onChange={(e) => setType(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <label
            htmlFor="mode"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectMode")}
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as "vertex" | "ollama")}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ollama">Ollama (Local)</option>
            <option value="vertex">Vertex AI (Cloud)</option>
          </select>
        </div>

        {/* RAG */}
        <div className="flex items-center mt-2">
          <input
            id="useRag"
            type="checkbox"
            checked={useRag}
            onChange={(e) => setUseRag(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="useRag" className="ml-2 text-sm text-gray-700">
            {t("useRag")}
          </label>
        </div>

        {/* Prompt Selection */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label
            htmlFor="prompt"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {t("selectPrompt")}
          </label>
          <select
            id="prompt"
            value={prompt}
            onChange={(e) => {
              useGenerateStore.setState({ prompt: e.target.value });
              updatePrompt();
            }}
            className="block w-full p-3 border border-gray-300 rounded-md 
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t("selectPrompt")}</option>
            {Array.isArray(prompts) &&
              prompts.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Prompt content display */}
      <div>
        <label className="block mb-2 font-medium">{t("promptLabel")}</label>
        <textarea
          rows={15}
          value={prompt_content}
          onChange={(e) => setPromptContent(e.target.value)}
          className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !isFormValid}
          className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
            loading || !isFormValid
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t("creating")}
            </div>
          ) : (
            t("createExercise")
          )}
        </button>

        <button
          onClick={exportResults}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {t("exportJson")}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* {sampleExercises.map((ex) => (
        <ExerciseCard key={ex.id} data={ex} />
      ))} */}
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Đang tải bài tập...</span>
        </div>
      )}

      {/* Results & Sample Toggle */}
      <div className="space-y-4">
        {hasResults && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700">
              Kết quả từ hệ thống ({results.length} bài tập)
            </h3>
            {results.map((ex) => (
              <ExerciseCard key={ex.id} data={ex} />
            ))}
          </div>
        )}

        {/* Toggle sample with arrow */}
        <div
          className="flex items-center cursor-pointer text-sm text-gray-500"
          onClick={() => setShowSampleExercises((prev) => !prev)}
        >
          <span>Hiển thị sample</span>
          <svg
            className={`ml-1 transition-transform ${
              showSampleExercises ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 5.646a.5.5 0 01.708 0L8 11.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
            />
          </svg>
        </div>

        {showSampleExercises && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">
              Bài tập mẫu (Demo) - {sampleExercises.length} bài tập
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Đây là các bài tập mẫu để bạn tham khảo. Hãy điền form và nhấn
              "Tạo bài tập" để tạo bài tập thực tế.
            </p>
            {sampleExercises.map((ex) => (
              <ExerciseCard key={ex.id} data={ex} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
